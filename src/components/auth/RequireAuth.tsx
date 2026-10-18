import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthSession } from '@/hooks/useAuthSession'

/**
 * Gate for the operator console. `/public-view` stays outside it — the arena display
 * must keep working on a projector with no session.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { session, loading } = useAuthSession()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center">
        <span className="font-label-mono-stat text-[11px] text-text-muted uppercase tracking-widest">
          Memverifikasi sesi...
        </span>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}