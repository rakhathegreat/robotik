import { Award, Medal, BadgeCheck } from "lucide-react"
import type { Database } from "@/types/supabase"

type Participant = Database['public']['Tables']['participants']['Row']

type PodiumProps = {
  data: Participant[]
  finishedId?: string | null
}

export function Podium({ data, finishedId }: PodiumProps) {
  const first = data[0]
  const second = data[1]
  const third = data[2]

  if (data.length === 0) return null

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-end pt-2 sm:pt-4">
      {/* JUARA 2: SILVER PODIUM */}
      {second && (
        <article
          className={`order-2 md:order-1 rounded-xl p-4 flex flex-col justify-between transition-all shadow-sm backdrop-blur-md min-h-[220px] ${
            second.id === finishedId
              ? "ring-2 ring-status-success/60 border border-status-success/50 bg-status-success/[0.08]"
              : "bg-slate-500/10 border border-border-subtle/30"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-400/10 text-slate-300 font-label-mono-stat text-[10px] font-semibold tracking-wide uppercase">
                <Award size={13} className="text-slate-300" />
                Juara 2
              </span>
              <div className="flex items-center gap-1.5">
                {second.id === finishedId && (
                  <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success font-label-mono-stat text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Selesai
                  </span>
                )}
                <span className="font-label-mono-stat text-slate-400 text-[10px] font-semibold tracking-wider uppercase">
                  Silver
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">{second.name}</h2>
              <p className="font-body-sm text-text-muted text-xs mt-0.5">{second.school}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-border-subtle/20">
            <span className="font-label-mono-stat text-[10px] text-text-muted">Total Perolehan</span>
            <span className="px-2 py-1 rounded bg-slate-500/10 text-slate-200 font-label-lg font-bold text-xs">
              {second.total_score ?? 0} Poin
            </span>
          </div>
        </article>
      )}

      {/* JUARA 1: CENTER ELEVATED HERO SPOTLIGHT */}
      {first && (
        <article
          className={`order-1 md:order-2 relative rounded-2xl bg-gradient-to-b from-surface-raised/95 via-surface-raised/80 to-surface-container/60 p-5 flex flex-col justify-between transition-all md:-translate-y-2 shadow-2xl shadow-amber-500/10 overflow-hidden backdrop-blur-md min-h-[260px] ${
            first.id === finishedId
              ? "ring-2 ring-status-success/60 border border-status-success/50"
              : "border border-amber-500/20"
          } ${!second ? "md:col-start-2" : ""}`}
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-44 bg-amber-500/15 blur-3xl pointer-events-none rounded-full"></div>
          <div className="relative space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 font-label-mono-stat text-[10px] font-bold tracking-wider uppercase shadow-inner">
                <Medal size={14} className="text-amber-400" />
                Juara 1 · Gold
              </span>
              <div className="flex items-center gap-1.5">
                {first.id === finishedId && (
                  <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success font-label-mono-stat text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Selesai
                  </span>
                )}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-400/10 text-amber-300 font-label-mono-stat text-[10px] font-semibold">
                  <Award size={12} className="text-amber-400" />
                  <span>Podium Champion</span>
                </div>
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight">{first.name}</h2>
                <BadgeCheck size={16} className="text-amber-400" />
              </div>
              <p className="font-body-md text-text-secondary text-xs font-normal">{first.school}</p>
            </div>
          </div>
          <div className="relative mt-4 pt-3 flex items-center justify-between border-t border-amber-500/10">
            <div>
              <span className="block font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">
                Total Perolehan
              </span>
              <span className="text-[9px] text-amber-400/80 font-label-mono-stat font-medium">
                Nilai Akumulasi Tertinggi
              </span>
            </div>
            <div className="flex items-baseline gap-1 px-3 py-1.5 rounded-lg bg-amber-400/20 text-amber-300 shadow-sm shadow-amber-500/10">
              <span className="font-headline-lg text-xl font-extrabold leading-none tracking-tight text-amber-300">
                {first.total_score ?? 0}
              </span>
              <span className="font-label-md text-[10px] font-bold uppercase tracking-wide text-amber-200">
                Poin
              </span>
            </div>
          </div>
        </article>
      )}

      {/* JUARA 3: BRONZE PODIUM */}
      {third && (
        <article
          className={`order-3 md:order-3 rounded-xl p-4 flex flex-col justify-between transition-all shadow-sm backdrop-blur-md min-h-[220px] ${
            third.id === finishedId
              ? "ring-2 ring-status-success/60 border border-status-success/50 bg-status-success/[0.08]"
              : "bg-amber-900/20 border border-border-subtle/30"
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-900/20 text-amber-300 font-label-mono-stat text-[10px] font-semibold tracking-wide uppercase">
                <Medal size={13} className="text-amber-400" />
                Juara 3
              </span>
              <div className="flex items-center gap-1.5">
                {third.id === finishedId && (
                  <span className="px-2 py-0.5 rounded-full bg-status-success/20 text-status-success font-label-mono-stat text-[10px] font-bold uppercase tracking-wider animate-pulse">
                    Selesai
                  </span>
                )}
                <span className="font-label-mono-stat text-amber-400/80 text-[10px] font-semibold tracking-wider uppercase">
                  Bronze
                </span>
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary tracking-tight">{third.name}</h2>
              <p className="font-body-sm text-text-muted text-xs mt-0.5">{third.school}</p>
            </div>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between border-t border-border-subtle/20">
            <span className="font-label-mono-stat text-[10px] text-text-muted">Total Perolehan</span>
            <span className="px-2 py-1 rounded bg-amber-900/20 text-amber-200 font-label-lg font-bold text-xs">
              {third.total_score ?? 0} Poin
            </span>
          </div>
        </article>
      )}
    </section>
  )
}
