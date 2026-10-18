import { useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { createQueryStore } from '@/lib/queryStore'
import { AUDIT } from '@/lib/auditLog'
import type { Database } from '@/types/supabase'

export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

export { AUDIT }

export const QUESTION_CORRECT = AUDIT.questionCorrect

/** How many recent entries the shared audit cache keeps for display. */
const CACHE_LIMIT = 200

/**
 * Arena audit trail. There is no match table, so every entry carries the question it
 * refers to in `question_id`; answered-question counters are derived from those rows.
 *
 * One `audit_logs` cache is shared by every consumer; callers pass the slice they want
 * to render (`useAuditLogs(20)`), so two lists on one page do not double the fetch.
 * Counters that must not miss early rows use `useAnsweredQuestions` instead.
 */
const store = createQueryStore<AuditLog[]>(
  [],
  async () => {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(CACHE_LIMIT)

    return { data: data ?? [], error: error?.message ?? null }
  },
  'audit_logs'
)

export function useAuditLogs(limit = 20) {
  const { data, loading, error } = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return {
    logs: limit >= data.length ? data : data.slice(0, limit),
    loading,
    error,
    refresh: store.refresh,
  }
}
