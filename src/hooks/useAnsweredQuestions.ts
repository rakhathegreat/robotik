import { useMemo, useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { createQueryStore } from '@/lib/queryStore'
import { AUDIT } from '@/lib/auditLog'

type AnsweredRow = {
  question_id: string | null
  participant_id: string | null
}

export type AnsweredQuestions = {
  /** Question ids any team has answered correctly (the arena-wide no-repeat trail). */
  answeredQuestions: Set<string>
  /** question_id -> participant ids that answered it correctly. */
  answeredByQuestion: Map<string, Set<string>>
}

/**
 * The full arena-wide answered trail, fetched without the display `limit` that
 * `useAuditLogs` applies. Counters derived from the last N log rows silently forget
 * early answers once a session exceeds that window, which both re-shows already-answered
 * questions and stops the auto-finish "pool exhausted" check. Only the two id columns are
 * pulled, so this stays cheap even after thousands of rows, and the shared store means
 * several components reading it still issue one request.
 */
const store = createQueryStore<AnsweredRow[]>(
  [],
  async () => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('question_id, participant_id')
      .eq('action', AUDIT.questionCorrect)
      .not('question_id', 'is', null)

    return { data: (data ?? []) as AnsweredRow[], error: error?.message ?? null }
  },
  'audit_logs'
)

export function useAnsweredQuestions(): AnsweredQuestions {
  const { data: rows } = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return useMemo(() => {
    const answeredByQuestion = new Map<string, Set<string>>()

    for (const row of rows) {
      if (!row.question_id) continue
      let solvers = answeredByQuestion.get(row.question_id)
      if (!solvers) {
        solvers = new Set<string>()
        answeredByQuestion.set(row.question_id, solvers)
      }
      if (row.participant_id) solvers.add(row.participant_id)
    }

    return { answeredQuestions: new Set(answeredByQuestion.keys()), answeredByQuestion }
  }, [rows])
}
