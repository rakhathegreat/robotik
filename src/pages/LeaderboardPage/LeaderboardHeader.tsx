export function LeaderboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 pb-2">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 font-label-mono-stat text-[11px] text-text-muted tracking-wide">
          <span className="hover:text-text-secondary cursor-pointer transition-colors">Tournament</span>
          <span className="text-border-strong">/</span>
          <span className="text-text-secondary">Arena 01</span>
          <span className="text-border-strong">/</span>
          <span className="text-text-primary">Live Leaderboard</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl text-text-primary tracking-tight font-bold">Leaderboard Resmi</h1>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-surface-container border border-border-subtle font-label-mono-stat text-text-secondary text-[11px]">35 Tim</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-container border border-border-subtle font-label-mono-stat text-[11px] text-text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
              Live Update
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 font-label-mono-stat text-[11px] text-text-muted">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low border border-border-subtle text-text-secondary">
          Terakhir Diperbarui: <strong className="text-text-primary font-semibold">Baru Saja</strong>
        </span>
      </div>
    </div>
  )
}
