import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { subscribeToTable } from '@/lib/tableRealtime'
import { AUDIT } from '@/lib/auditLog'

export type MatchFinish = {
  /** Team that finished its run; may be null for a finish written without a participant. */
  participantId: string | null
  /** `audit_logs.created_at` of the `match_finished` row, microsecond precision. */
  createdAt: string
}

/**
 * Newest `match_finished` row. The projector uses it to celebrate the team that just left the
 * arena; there is no match table, so the audit trail is the only record of a finish.
 *
 * Returns null until the first finish the arena ever recorded (or when a reset cleared them).
 */
export function useLastFinish(): MatchFinish | null {
  const [finish, setFinish] = useState<MatchFinish | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      const { data } = await supabase
        .from('audit_logs')
        .select('participant_id, created_at')
        .eq('action', AUDIT.matchFinished)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!active) return
      setFinish(
        data ? { participantId: data.participant_id, createdAt: data.created_at } : null
      )
    }

    void load()
    return subscribeToTable('audit_logs', () => {
      void load()
    })
  }, [])

  return finish
}
