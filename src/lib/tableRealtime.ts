import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Listener = () => void

type TableEntry = {
  channel: RealtimeChannel
  listeners: Set<Listener>
}

const registry = new Map<string, TableEntry>()
let topicSeq = 0

/**
 * One realtime channel per table for the whole app, shared by every consumer.
 *
 * Keeping a single ref-counted channel per table means one round-trip per change no
 * matter how many components listen. Each channel gets a unique topic instead of the
 * bare table name: `supabase.channel(topic)` hands back an existing channel for a topic
 * that is still in use, and after a fast unmount/remount (React StrictMode, or jumping
 * between pages) the closing channel is returned in a `leaving` state where `.subscribe()`
 * is a silent no-op — realtime would then never resume for that table. A fresh topic per
 * entry always yields a channel that can actually join.
 */
export function subscribeToTable(table: string, listener: Listener) {
  let entry = registry.get(table)

  if (!entry) {
    const listeners = new Set<Listener>()
    topicSeq += 1
    const channel = supabase
      .channel(`table_changes:${table}:${topicSeq}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        listeners.forEach((notify) => notify())
      })
      .subscribe()

    entry = { channel, listeners }
    registry.set(table, entry)
  }

  entry.listeners.add(listener)

  return () => {
    entry?.listeners.delete(listener)
    if (entry && entry.listeners.size === 0) {
      supabase.removeChannel(entry.channel)
      registry.delete(table)
    }
  }
}