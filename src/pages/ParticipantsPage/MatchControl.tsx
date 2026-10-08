import { Flag, Play, Shuffle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MatchControl() {
  return (
    <div className="bg-surface-raised rounded-xl border border-border-subtle p-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Flag size={16} className="text-text-primary" />
          <span className="font-label-mono-stat text-[11px] text-text-muted uppercase tracking-wider font-semibold">Kontrol Pertandingan</span>
        </div>
        <span className="inline-flex items-center gap-1 font-label-mono-stat text-[11px] text-status-success">
          <span className="w-1.5 h-1.5 rounded-full bg-status-success"></span>
        </span>
      </div>
      <div className="bg-surface-container-low p-3 rounded-lg border border-border-subtle flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-text-muted text-[10px] uppercase tracking-wider">NEXT MATCH (ANTREAN #01)</span>
        </div>
        <div>
          <div className="text-lg font-bold text-text-primary leading-tight">RoboStar Alpha</div>
          <div className="font-body-sm text-text-secondary text-[12px] mt-0.5">SD Bina Prestasi Jakarta</div>
        </div>
        <Button className="w-full h-9 mt-1 bg-primary text-gray-900 font-semibold cursor-pointer shadow-sm text-[13px]">
          <Play size={16} fill="currentColor" className="mr-2" />
          Match Start
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="h-8 bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-[12px]">
          <Shuffle size={14} className="mr-1.5" />
          Shuffle
        </Button>
        <Button variant="outline" className="h-8 bg-surface-container border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary text-[12px]">
          <Lock size={14} className="mr-1.5" />
          Kunci
        </Button>
      </div>
    </div>
  )
}
