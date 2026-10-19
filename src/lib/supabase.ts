import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

/**
 * Where supabase-js keeps the operator session (the same value it would derive by default,
 * declared explicitly so it can be cleared from outside the client).
 *
 * `useAuthSession` needs that when a refresh keeps failing: `signOut({ scope: 'local' })`
 * reads the session through the client's own loader first, which returns that very refresh
 * error and gives up before removing anything — so the stored token has to go first.
 */
export const AUTH_STORAGE_KEY = `sb-${new URL(supabaseUrl).hostname.split('.')[0]}-auth-token`

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: { storageKey: AUTH_STORAGE_KEY },
})
