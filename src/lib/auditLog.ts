import { supabase } from '@/lib/supabase'

export const AUDIT = {
  matchStarted: 'match_started',
  matchFinished: 'match_finished',
  matchReset: 'match_reset',
  questionShown: 'question_shown',
  questionCorrect: 'question_correct',
  questionSkipped: 'question_skipped',
  timerPaused: 'timer_paused',
  timerResumed: 'timer_resumed',
  timeBudgetChanged: 'time_budget_changed',
} as const

export type AuditAction = (typeof AUDIT)[keyof typeof AUDIT]

type WriteAuditInput = {
  action: AuditAction
  description: string
  participantId?: string | null
  questionId?: string | null
}

/**
 * Appends an arena audit row. The signed-in referee is recorded as `created_by`.
 * Returns the error instead of throwing: audit failures must not block the operator
 * action that triggered them, and every caller surfaces the message inline.
 */
export async function writeAudit({
  action,
  description,
  participantId = null,
  questionId = null,
}: WriteAuditInput): Promise<string | null> {
  const { data: sessionData } = await supabase.auth.getSession()

  const { error } = await supabase.from('audit_logs').insert({
    action,
    description,
    participant_id: participantId,
    question_id: questionId,
    created_by: sessionData.session?.user?.id ?? null,
  })

  return error?.message ?? null
}