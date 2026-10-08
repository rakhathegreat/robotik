import { Award, Medal, BadgeCheck } from "lucide-react"

export function Podium() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end pt-2 sm:pt-4">
      {/* JUARA 2: SILVER PODIUM */}
      <article className="order-2 md:order-1 rounded-xl bg-slate-500/10 p-4 flex flex-col justify-between transition-all shadow-sm backdrop-blur-md min-h-[220px]">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-400/10 text-slate-300 font-label-mono-stat text-[10px] font-semibold tracking-wide uppercase">
              <Award size={13} className="text-slate-300" />
              Juara 2
            </span>
            <span className="font-label-mono-stat text-slate-400 text-[10px] font-semibold tracking-wider uppercase">Silver</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">Garuda Cyber Junior</h2>
            <p className="font-body-sm text-text-muted text-xs mt-0.5">SD Taruna Bangsa</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-surface-base/50 rounded-lg p-2">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Soal</span>
              <span className="font-label-mono-stat text-xs font-semibold text-text-primary">4/5 Selesai</span>
            </div>
            <div className="bg-surface-base/50 rounded-lg p-2">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Waktu</span>
              <span className="font-label-mono-stat text-xs font-mono font-semibold text-text-secondary">02:45.10</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-border-subtle/20">
          <span className="font-label-mono-stat text-[10px] text-text-muted">Total Perolehan</span>
          <span className="px-2 py-1 rounded bg-slate-500/10 text-slate-200 font-label-lg font-bold text-xs">40 Poin</span>
        </div>
      </article>

      {/* JUARA 1: CENTER ELEVATED HERO SPOTLIGHT */}
      <article className="order-1 md:order-2 relative rounded-2xl bg-gradient-to-b from-surface-raised/95 via-surface-raised/80 to-surface-container/60 p-5 flex flex-col justify-between transition-all md:-translate-y-2 shadow-2xl shadow-amber-500/10 overflow-hidden backdrop-blur-md min-h-[260px]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"></div>
        <div className="relative space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 font-label-mono-stat text-[10px] font-bold tracking-wider uppercase shadow-inner">
              <Medal size={14} className="text-amber-400" />
              Juara 1 · Gold
            </span>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 text-amber-300 font-label-mono-stat text-[10px] font-semibold">
              <Award size={12} className="text-amber-400" />
              <span>Podium Champion</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">RoboStar Alpha</h2>
              <BadgeCheck size={16} className="text-amber-400" />
            </div>
            <p className="font-body-md text-text-secondary text-xs font-normal">SD Bina Prestasi Jakarta</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-surface-base/80 rounded-xl p-2.5">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Soal Terselesaikan</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-label-mono-stat text-sm font-bold text-amber-300">5/5</span>
              </div>
            </div>
            <div className="bg-surface-base/80 rounded-xl p-2.5">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Waktu Resmi</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-label-mono-stat text-sm font-mono font-bold text-white tracking-tight">02:14.32</span>
                <span className="font-label-mono-stat text-[9px] text-amber-400/80">Tercepat</span>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mt-4 pt-3 flex items-center justify-between border-t border-amber-500/10">
          <div>
            <span className="block font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">Total Perolehan</span>
            <span className="text-[9px] text-amber-400/80 font-label-mono-stat font-medium">Nilai Akumulasi Tertinggi</span>
          </div>
          <div className="flex items-baseline gap-1 px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 shadow-sm shadow-amber-500/10">
            <span className="font-headline-lg text-xl font-extrabold leading-none tracking-tight text-amber-300">48</span>
            <span className="font-label-md text-[10px] font-bold uppercase tracking-wide text-amber-200">Poin</span>
          </div>
        </div>
      </article>

      {/* JUARA 3: BRONZE PODIUM */}
      <article className="order-3 md:order-3 rounded-xl bg-amber-900/20 p-4 flex flex-col justify-between transition-all shadow-sm backdrop-blur-md min-h-[220px]">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-900/20 text-amber-300 font-label-mono-stat text-[10px] font-semibold tracking-wide uppercase">
              <Medal size={13} className="text-amber-400" />
              Juara 3
            </span>
            <span className="font-label-mono-stat text-amber-400/80 text-[10px] font-semibold tracking-wider uppercase">Bronze</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-text-primary tracking-tight">Techno Bot 9</h2>
            <p className="font-body-sm text-text-muted text-xs mt-0.5">SDIT Nurul Fikri</p>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-surface-base/50 rounded-lg p-2">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Soal</span>
              <span className="font-label-mono-stat text-xs font-semibold text-text-primary">4/5 Selesai</span>
            </div>
            <div className="bg-surface-base/50 rounded-lg p-2">
              <span className="block font-label-mono-stat text-[9px] text-text-muted uppercase tracking-wider">Waktu</span>
              <span className="font-label-mono-stat text-xs font-mono font-semibold text-text-secondary">03:02.80</span>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-3 flex items-center justify-between border-t border-border-subtle/20">
          <span className="font-label-mono-stat text-[10px] text-text-muted">Total Perolehan</span>
          <span className="px-2 py-1 rounded bg-amber-900/20 text-amber-200 font-label-lg font-bold text-xs">38 Poin</span>
        </div>
      </article>
    </section>
  )
}
