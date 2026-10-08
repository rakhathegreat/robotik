import { History } from "lucide-react"

export function AuditLog() {
  return (
    <div className="w-full mt-2">
      <div className="p-3 rounded-xl bg-surface-raised border border-border-subtle shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle">
          <div className="flex items-center gap-1 font-label-mono-stat text-[10px] text-text-muted uppercase">
            <History size={12} />
            <span>ARENA AUDIT LOG</span>
          </div>
          <span className="font-label-mono-stat text-[10px] text-text-muted">SYNCED: JURI-01</span>
        </div>
        <div className="flex flex-col gap-1 max-h-32 overflow-y-auto font-label-mono-stat text-[10px]">
          <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-lowest text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">00:44.20</span>
              <span className="text-xs text-text-primary font-medium">Soal 2 Dimulai: Target "63 - 28"</span>
            </div>
            <span className="px-1 py-0.5 rounded bg-surface-container text-text-muted">SOAL 2</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-lowest text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">00:32.10</span>
              <span className="text-xs text-status-success font-semibold">✓ Soal 1 Benar (18 + 14 = 32)</span>
            </div>
            <span className="px-1 py-0.5 rounded bg-surface-raised text-status-success font-bold">+10 PTS</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-surface-container-lowest text-text-secondary">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-muted">00:00.00</span>
              <span className="text-xs">Match 01 Dimulai secara resmi</span>
            </div>
            <span className="px-1 py-0.5 rounded bg-surface-container text-text-muted">START</span>
          </div>
        </div>
      </div>
    </div>
  )
}
