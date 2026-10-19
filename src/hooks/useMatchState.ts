import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribeToTable } from '@/lib/tableRealtime'
import { AUDIT, writeAudit } from '@/lib/auditLog'
import type { Database } from '@/types/supabase'

type MatchState = Database['public']['Tables']['match_state']['Row']
type Question = Database['public']['Tables']['questions']['Row']

const SINGLETON_ID = 1
const DEFAULT_DURATION_MS = 300000
const TICK_MS = 37
/**
 * Intro delay applied to every "go" (IDLE -> RUNNING and PAUSED -> RUNNING): the projector shows
 * a 3-2-1-MULAI countdown (1.5s each, total ~6s) and the clock holds the budget until it ends. Scheduled on
 * `timer_started_at` so the console, the projector and the lap record all agree on the moment
 * the match really starts. (6500ms accounts for ~500ms network roundtrip so 3 gets a full 1500ms).
 */
const START_COUNTDOWN_MS = 6500

type Snapshot = {
  matchState: MatchState | null
  question: Question | null
  remainingMs: number
  /** Milliseconds left of the intro countdown; 0 once the clock is actually running. */
  countdownMs: number
  error: string | null
}

/**
 * Owner of the arena timer. The database only holds `timer_status` +
 * `remaining_ms_at_pause` + `timer_started_at`; the countdown is derived here from those
 * (37ms tick for a ~27fps readout) and never stored as a ticking value.
 *
 * This lives in a module-level store instead of per-hook state because the Match Control
 * page mounts `useMatchState` from three components. As one store they share a single
 * fetch, a single realtime subscription and a single interval; previously each component
 * kept its own copy, so every tick and every arena write was tripled.
 */
let snapshot: Snapshot = {
  matchState: null,
  question: null,
  remainingMs: DEFAULT_DURATION_MS,
  countdownMs: 0,
  error: null,
}

const listeners = new Set<() => void>()
let started = false
let ticker: ReturnType<typeof setInterval> | null = null

function notify() {
  listeners.forEach((listener) => listener())
}

function patch(partial: Partial<Snapshot>) {
  snapshot = { ...snapshot, ...partial }
  notify()
}

function remainingFor(state: MatchState): number {
  let remaining = state.remaining_ms_at_pause

  if (state.timer_status === 'RUNNING' && state.timer_started_at) {
    remaining -= Date.now() - new Date(state.timer_started_at).getTime()
  }

  // A "go" schedules `timer_started_at` a few seconds ahead, which would make the subtraction
  // negative and the clock read *more* than the budget. Hold it at the budget until then.
  return Math.max(0, Math.min(remaining, state.remaining_ms_at_pause))
}

/** Milliseconds left before a scheduled start fires; 0 when the clock is already ticking. */
function countdownFor(state: MatchState): number {
  if (state.timer_status !== 'RUNNING' || !state.timer_started_at) return 0

  return Math.max(0, new Date(state.timer_started_at).getTime() - Date.now())
}

function syncTicker(state: MatchState) {
  if (ticker) {
    clearInterval(ticker)
    ticker = null
  }

  // Only tick while something is actually rendering the countdown.
  if (listeners.size === 0) return

  if (state.timer_status === 'RUNNING') {
    ticker = setInterval(() => {
      patch({ remainingMs: remainingFor(state), countdownMs: countdownFor(state) })
    }, TICK_MS)
  }
}

function applyMatchState(state: MatchState) {
  snapshot = {
    ...snapshot,
    matchState: state,
    remainingMs: remainingFor(state),
    countdownMs: countdownFor(state),
  }
  syncTicker(state)
  notify()
}

async function loadQuestion(questionId: string | null) {
  if (!questionId) {
    patch({ question: null })
    return
  }

  const { data } = await supabase.from('questions').select('*').eq('id', questionId).single()
  patch({ question: data ?? null })
}

async function refresh() {
  const { data, error } = await supabase
    .from('match_state')
    .select('*')
    .eq('id', SINGLETON_ID)
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  snapshot = {
    ...snapshot,
    error: null,
    matchState: data,
    remainingMs: remainingFor(data),
    countdownMs: countdownFor(data),
  }
  syncTicker(data)
  notify()

  await loadQuestion(data.current_question_id)
}

function subscribe(listener: () => void) {
  listeners.add(listener)

  if (!started) {
    started = true
    void refresh()
    subscribeToTable('match_state', refresh)
  } else if (snapshot.matchState) {
    // Resuming after every consumer unmounted: restart the ticker without a refetch.
    syncTicker(snapshot.matchState)
  }

  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && ticker) {
      clearInterval(ticker)
      ticker = null
    }
  }
}

function getSnapshot() {
  return snapshot
}

async function toggleTimer(participantId: string | null) {
  const current = snapshot.matchState
  const wasRunning = current?.timer_status === 'RUNNING'
  patch({ error: null })

  const { data, error } = await supabase
    .from('match_state')
    .update(
      wasRunning
        ? { timer_status: 'PAUSED', remaining_ms_at_pause: remainingFor(current!) }
        : {
            timer_status: 'RUNNING',
            // Ahead of `Date.now()`: the clock only begins once the intro countdown has played.
            timer_started_at: new Date(Date.now() + START_COUNTDOWN_MS).toISOString(),
          }
    )
    .eq('id', SINGLETON_ID)
    .select()
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  applyMatchState(data)

  const startingFresh = !wasRunning && current?.timer_status === 'IDLE'
  const auditError = await writeAudit({
    action: wasRunning
      ? AUDIT.timerPaused
      : startingFresh
        ? AUDIT.matchStarted
        : AUDIT.timerResumed,
    description: wasRunning
      ? 'Timer dijeda'
      : startingFresh
        ? 'Match dimulai secara resmi'
        : 'Timer dilanjutkan',
    participantId,
  })
  if (auditError) patch({ error: auditError })
}

async function resetTimer() {
  patch({ error: null })

  const { data, error } = await supabase
    .from('match_state')
    .update({
      timer_status: 'IDLE',
      remaining_ms_at_pause: snapshot.matchState?.base_duration_ms ?? DEFAULT_DURATION_MS,
      timer_started_at: null,
    })
    .eq('id', SINGLETON_ID)
    .select()
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  applyMatchState(data)
}

async function setCurrentQuestion(questionId: string, participantId: string | null) {
  patch({ error: null })

  const { data, error } = await supabase
    .from('match_state')
    .update({ current_question_id: questionId })
    .eq('id', SINGLETON_ID)
    .select()
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  applyMatchState(data)
  await loadQuestion(questionId)

  const { data: shown } = await supabase
    .from('questions')
    .select('equation')
    .eq('id', questionId)
    .single()

  const auditError = await writeAudit({
    action: AUDIT.questionShown,
    description: `Soal ditampilkan: ${shown?.equation ?? questionId.slice(0, 8)}`,
    participantId,
    questionId,
  })
  if (auditError) patch({ error: auditError })
}

async function setCurrentParticipant(id: string | null) {
  patch({ error: null })

  const { data, error } = await supabase
    .from('match_state')
    .update({ current_participant_id: id })
    .eq('id', SINGLETON_ID)
    .select()
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  applyMatchState(data)
}

/** Question ids the whole arena has already answered correctly (no-repeat rule). */
async function answeredQuestionIds() {
  const { data } = await supabase
    .from('audit_logs')
    .select('question_id')
    .eq('action', AUDIT.questionCorrect)
    .not('question_id', 'is', null)

  return new Set((data ?? []).map((row) => row.question_id as string))
}

async function nextUnansweredQuestion() {
  const answered = await answeredQuestionIds()

  const { data } = await supabase.from('questions').select('id').eq('is_active', true)
  const pool = (data ?? [])
    .map((row) => row.id)
    .filter((id) => !answered.has(id) && id !== snapshot.matchState?.current_question_id)

  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

/**
 * Fallback for when every question has already been answered by the arena: there is no
 * per-match question quota, so hand back another active question (a repeat) instead of
 * leaving the team parked on the same one. Returns null only when the bank is empty.
 */
async function nextActiveQuestion() {
  const { data } = await supabase.from('questions').select('id').eq('is_active', true)
  const ids = (data ?? []).map((row) => row.id)
  const others = ids.filter((id) => id !== snapshot.matchState?.current_question_id)
  const pool = others.length > 0 ? others : ids

  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

async function setTimeBudget(durationMs: number, participantId: string | null) {
  patch({ error: null })
  const clamped = Math.max(30_000, Math.min(durationMs, 60 * 60 * 1000))
  const current = snapshot.matchState

  const { data, error } = await supabase
    .from('match_state')
    .update({
      base_duration_ms: clamped,
      remaining_ms_at_pause:
        current?.timer_status === 'IDLE' ? clamped : current?.remaining_ms_at_pause ?? clamped,
    })
    .eq('id', SINGLETON_ID)
    .select()
    .single()

  if (error) {
    patch({ error: error.message })
    return
  }

  applyMatchState(data)

  const auditError = await writeAudit({
    action: AUDIT.timeBudgetChanged,
    description: `Time budget diubah menjadi ${Math.round(clamped / 60000)} menit`,
    participantId,
  })
  if (auditError) patch({ error: auditError })
}

function formatTime(remaining: number) {
  const m = Math.floor(remaining / 60000)
  const s = Math.floor((remaining % 60000) / 1000)
  const ms = Math.floor((remaining % 1000) / 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`
}

type UseMatchStateOptions = {
  /** Team currently in the arena; stamped onto every audit row the actions write. */
  participantId?: string | null
}

export function useMatchState({ participantId = null }: UseMatchStateOptions = {}) {
  const snap = useSyncExternalStore(subscribe, getSnapshot)

  const timeLeft = useMemo(() => formatTime(snap.remainingMs), [snap.remainingMs])

  const capacityPct = useMemo(() => {
    const base = snap.matchState?.base_duration_ms ?? DEFAULT_DURATION_MS
    const pct = (snap.remainingMs / base) * 100
    return pct < 0 ? 0 : pct > 100 ? 100 : pct
  }, [snap.remainingMs, snap.matchState?.base_duration_ms])

  const toggle = useCallback(() => toggleTimer(participantId), [participantId])
  const reset = useCallback(() => resetTimer(), [])
  const showQuestion = useCallback(
    (questionId: string) => setCurrentQuestion(questionId, participantId),
    [participantId]
  )
  const publishParticipant = useCallback((id: string | null) => setCurrentParticipant(id), [])
  const nextQuestion = useCallback(() => nextUnansweredQuestion(), [])
  const nextAnyQuestion = useCallback(() => nextActiveQuestion(), [])
  const changeTimeBudget = useCallback(
    (durationMs: number) => setTimeBudget(durationMs, participantId),
    [participantId]
  )

  return {
    matchState: snap.matchState,
    question: snap.question,
    timeLeft,
    remainingMs: snap.remainingMs,
    countdownMs: snap.countdownMs,
    capacityPct,
    error: snap.error,
    refresh,
    toggleTimer: toggle,
    resetTimer: reset,
    setCurrentQuestion: showQuestion,
    nextUnansweredQuestion: nextQuestion,
    nextActiveQuestion: nextAnyQuestion,
    setCurrentParticipant: publishParticipant,
    setTimeBudget: changeTimeBudget,
  }
}
