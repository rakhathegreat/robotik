import { useSyncExternalStore } from 'react'
import type { Session } from '@supabase/supabase-js'
import { AUTH_STORAGE_KEY, supabase } from '@/lib/supabase'
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

/** supabase-js refreshes 90s before expiry and retries on every 30s tick, so a token this far
 * past expiry has already failed several refresh attempts. */
const STALE_SESSION_GRACE_MS = 5 * 60 * 1000
const STALE_SESSION_CHECK_MS = 30 * 1000

/**
 * A refresh that fails with a retryable status (5xx, network) does *not* end the session in
 * supabase-js — it caches the failure and retries on the next tick — so the console can go on
 * rendering with an access token that expired long ago: reads come back empty and every write
 * 401s while the UI still looks signed in. Force one refresh once the token is past the grace
 * window and, if it still cannot be renewed, clear the session so `RequireAuth` sends the
 * operator back to `/login`.
 */
async function dropUnrefreshableSession() {
  const session = snapshot.session
  if (!session || snapshot.loading) return
  if (Date.now() - (session.expires_at ?? 0) * 1000 < STALE_SESSION_GRACE_MS) return

  const { data, error } = await supabase.auth.refreshSession()
  if (!error && data.session) return

  console.warn('[auth] session could not be refreshed, signing out', error?.message)

  // `signOut({ scope: 'local' })` cannot clear this by itself: it reads the session through the
  // client's loader, which returns the very same refresh error and bails out before removing
  // anything. Drop the stored token first, then sign out purely for the `SIGNED_OUT` event the
  // listener above turns into the snapshot patch.
  localStorage.removeItem(AUTH_STORAGE_KEY)
  localStorage.removeItem(`${AUTH_STORAGE_KEY}-user`)
  await supabase.auth.signOut({ scope: 'local' })
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

  window.setInterval(() => {
    void dropUnrefreshableSession()
  }, STALE_SESSION_CHECK_MS)
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
