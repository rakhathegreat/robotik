import { useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { createQueryStore } from '@/lib/queryStore'
import type { Database } from '@/types/supabase'

export type Participant = Database['public']['Tables']['participants']['Row']

/** Single source of truth for participants, shared by every consumer on the page. */
const store = createQueryStore<Participant[]>(
  [],
  async () => {
    const { data, error } = await supabase
      .from('participants')
      .select('*')
      .order('created_at', { ascending: true })

    return { data: data ?? [], error: error?.message ?? null }
  },
  'participants'
)

export function useParticipants() {
  const { data, loading, error } = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return { participants: data, loading, error, refresh: store.refresh }
}
