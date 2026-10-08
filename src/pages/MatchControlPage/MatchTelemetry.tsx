import { BarChart2, ListChecks } from "lucide-react"

export function MatchTelemetry() {
  return (
    <div className="lg:col-span-6 h-full flex flex-col gap-4">
      {/* Clean Telemetry Scoreboard (No Penalties) */}
      <div className="p-4 rounded-xl bg-surface-raised border border-border-subtle shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
          <div className="flex items-center gap-1 font-label-mono-stat text-[10px] text-text-muted uppercase">
            <BarChart2 size={15} />
            <span>TELEMETRY METRICS</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-mono-stat text-[11px] text-status-success">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col justify-between p-3 rounded-xl bg-surface-container border border-primary/40 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
                <span className="font-label-mono-stat text-[10px] text-text-primary uppercase font-bold tracking-wider">TOTAL POIN</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[32px] sm:text-[40px] font-black text-text-primary tracking-tight leading-none">20</span>
              <span className="font-label-mono-stat text-[11px] text-status-success font-bold uppercase tracking-wider">PTS</span>
            </div>
            <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-border-subtle">
              <span className="font-body-sm text-[11px] text-text-secondary">Skor terkini</span>
              <span className="font-label-mono-stat text-[10px] text-text-muted">Akumulasi 100%</span>
            </div>
          </div>
          <div className="flex flex-col justify-between p-3 rounded-lg bg-surface-container-lowest border border-border-subtle">
            <div className="flex items-center justify-between">
              <span className="font-label-mono-stat text-[10px] text-text-muted uppercase font-semibold">SOAL BENAR</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-raised font-label-mono-stat text-[10px] text-text-secondary">Akurasi 40%</span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-[28px] sm:text-[36px] font-black text-text-secondary tracking-tight leading-none">2/5</span>
              <span className="font-label-mono-stat text-[10px] text-status-success font-semibold">+20p</span>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-border-subtle">
              <span className="font-body-sm text-[11px] text-text-muted">Tingkat akurasi soal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Question Sequence Progression Matrix */}
      <div className="p-4 rounded-xl flex-1 bg-surface-raised border border-border-subtle shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between pb-1.5 border-b border-border-subtle">
          <div className="flex items-center gap-1 font-label-mono-stat text-[10px] text-text-muted uppercase">
            <ListChecks size={13} />
            <span>PROGRES MATRIKS SOAL</span>
          </div>
          <span className="font-label-mono-stat text-[10px] text-text-secondary">2 SELESAI • 3 TERSISA</span>
        </div>
        <div className="flex flex-col gap-1.5 pt-0.5">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-lowest border border-border-subtle">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-status-success text-surface-base flex items-center justify-center text-[9px] font-bold">✓</span>
              <span className="font-label-md text-xs text-text-primary font-medium">Soal 1: 18 + 14 = 32</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-surface-raised font-label-mono-stat text-[10px] text-status-success font-semibold">+10 Poin</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container border border-primary/40">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-primary text-on-primary flex items-center justify-center text-[9px] font-bold">2</span>
              <span className="font-label-md text-xs text-text-primary font-bold">Soal 2: 63 − 28 = ?</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-surface-raised font-label-mono-stat text-[10px] text-text-primary font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
              Sedang Aktif
            </span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-lowest/60 border border-border-subtle text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-surface-raised text-text-muted flex items-center justify-center text-[9px]">3</span>
              <span className="font-label-md text-xs">Soal 3: Menunggu giliran</span>
            </div>
            <span className="font-label-mono-stat text-[10px] text-text-muted">10 Poin</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-lowest/60 border border-border-subtle text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-surface-raised text-text-muted flex items-center justify-center text-[9px]">4</span>
              <span className="font-label-md text-xs">Soal 4: Menunggu giliran</span>
            </div>
            <span className="font-label-mono-stat text-[10px] text-text-muted">10 Poin</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-surface-container-lowest/60 border border-border-subtle text-text-muted">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-surface-raised text-text-muted flex items-center justify-center text-[9px]">5</span>
              <span className="font-label-md text-xs">Soal 5: Menunggu giliran</span>
            </div>
            <span className="font-label-mono-stat text-[10px] text-text-muted">10 Poin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
