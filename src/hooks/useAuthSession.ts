import { useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

export type Role = Database['public']['Enums']['role_type']

type AuthSnapshot = {
  session: Session | null
  role: Role | null
  loading: boolean
}

/**
 * Current operator session plus the role RLS checks against. `profiles` is readable only
 * by the owner, so the role is fetched per session rather than trusted from claims.
 *
 * Held in a module-level store because `useAuthSession` is called from `RequireAuth`,
 * the header, the participants table and the login page at once — as separate hooks each
 * one re-ran `getSession()` and registered its own `onAuthStateChange` listener. Now there
 * is a single listener and a single role fetch shared by every consumer.
 */
let snapshot: AuthSnapshot = { session: null, role: null, loading: true }
const listeners = new Set<() => void>()
let started = false

function patch(partial: Partial<AuthSnapshot>) {
  snapshot = { ...snapshot, ...partial }
  listeners.forEach((listener) => listener())
}

async function loadRole(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  patch({ role: data?.role ?? null })
}

function start() {
  if (started) return
  started = true

  void supabase.auth.getSession().then(({ data }) => {
    patch({ session: data.session, loading: false })
    if (data.session?.user) void loadRole(data.session.user.id)
  })

  supabase.auth.onAuthStateChange((_event, nextSession) => {
    patch({ session: nextSession, loading: false, role: null })
    if (nextSession?.user) void loadRole(nextSession.user.id)
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  start()
  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot() {
  return snapshot
}

async function signOut() {
  await supabase.auth.signOut()
  patch({ session: null, role: null })
}

export function useAuthSession() {
  const current = useSyncExternalStore(subscribe, getSnapshot)

  return {
    session: current.session,
    user: current.session?.user ?? null,
    email: current.session?.user?.email ?? null,
    role: current.role,
    isAdmin: current.role === 'admin',
    loading: current.loading,
    signOut,
  }
}
