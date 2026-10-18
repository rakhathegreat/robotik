import { useSyncExternalStore } from 'react'
import { supabase } from '@/lib/supabase'
import { createQueryStore } from '@/lib/queryStore'
import type { Database } from '@/types/supabase'

export type Question = Database['public']['Tables']['questions']['Row']

/** Question-bank cache shared by every consumer on the page. */
const store = createQueryStore<Question[]>(
  [],
  async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })

    return { data: data ?? [], error: error?.message ?? null }
  },
  'questions'
)

export function useQuestions() {
  const { data, loading, error } = useSyncExternalStore(store.subscribe, store.getSnapshot)

  return { questions: data, loading, error, refresh: store.refresh }
}
