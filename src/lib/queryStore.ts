import { subscribeToTable } from '@/lib/tableRealtime'

export type QueryState<T> = {
  data: T
  loading: boolean
  error: string | null
}

type Loader<T> = () => Promise<{ data: T; error: string | null }>

export type QueryStore<T> = {
  subscribe: (listener: () => void) => () => void
  getSnapshot: () => QueryState<T>
  refresh: () => Promise<void>
}

/**
 * Module-level, ref-counted cache for a single Supabase query.
 *
 * The first subscriber triggers the initial fetch and the realtime subscription; every
 * later consumer — and every remount — reuses both. A page that reads `participants`
 * from three components then does one fetch and one channel instead of three, and a
 * `refresh` button updates all of them at once.
 *
 * The cache is deliberately never torn down: the table set is tiny and every one of them
 * stays live for the whole competition, so keeping them warm avoids a refetch on every
 * navigation and sidesteps the subscribe/teardown race in `subscribeToTable`.
 */
export function createQueryStore<T>(initialData: T, loader: Loader<T>, table: string): QueryStore<T> {
  let state: QueryState<T> = { data: initialData, loading: true, error: null }
  const listeners = new Set<() => void>()
  let started = false

  const refresh = async () => {
    const { data, error } = await loader()
    state = { data, loading: false, error }
    listeners.forEach((listener) => listener())
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      if (!started) {
        started = true
        void refresh()
        subscribeToTable(table, refresh)
      }
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => state,
    refresh,
  }
}
