import { Timer, Pause, RotateCcw, KeyRound, CheckCircle2, FastForward } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ArenaController() {
  return (
    <div className="lg:col-span-6 h-full flex flex-col gap-4">
      {/* Sleek Digital Timer Deck */}
      <div className="p-4 rounded-xl bg-surface-container border border-border-subtle shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-muted">
            <Timer size={13} />
            <span>TIME BUDGET: 05:00.00</span>
          </div>
          <div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-secondary">
            <span>Elapsed: 00:44.20</span>
            <span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse"></span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-0.5">
          <div className="text-[32px] sm:text-[40px] leading-none text-text-primary font-bold tracking-tighter tabular-nums select-none">
            04:15.80
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon-lg" className="w-9 h-9 rounded-full bg-primary text-on-primary shadow-md hover:opacity-90 transition-all" title="Pause / Resume Timer">
              <Pause size={18} />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-full bg-surface-raised border-border-subtle text-text-secondary hover:text-text-primary" title="Reset Waktu">
              <RotateCcw size={14} />
            </Button>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-text-primary rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
        </div>
        <div className="flex items-center justify-between font-label-mono-stat text-[11px] text-text-muted">
          <span>00:00 START</span>
          <span className="text-text-secondary font-semibold">85% SISA WAKTU ARENA</span>
          <span>05:00 TIMEOUT</span>
        </div>
      </div>

      {/* Active Math Question Card */}
      <div className="p-4 rounded-xl flex-1 bg-surface-raised border border-border-subtle shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary text-on-primary font-label-md text-[10px] uppercase font-bold tracking-wider">
              SOAL 2 / 5
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-status-success" title="Soal 1: Sukses"></span>
              <span className="w-2 h-2 rounded-full bg-text-primary ring-2 ring-primary" title="Soal 2: Sedang Berjalan"></span>
              <span className="w-2 h-2 rounded-full bg-surface-container-highest" title="Soal 3: Menunggu"></span>
              <span className="w-2 h-2 rounded-full bg-surface-container-highest" title="Soal 4: Menunggu"></span>
              <span className="w-2 h-2 rounded-full bg-surface-container-highest" title="Soal 5: Menunggu"></span>
            </div>
          </div>
          <div className="px-2 py-1 rounded-md bg-surface-container-lowest border border-border-subtle text-text-primary font-label-md text-[11px] font-bold flex items-center gap-1.5">
            <KeyRound size={13} className="text-status-success" />
            <span className="font-label-mono-stat text-[10px] text-text-muted">KUNCI JAWABAN:</span>
            <span className="text-status-success text-sm font-bold">35</span>
          </div>
        </div>

        {/* High Contrast Question Math Stage */}
        <div className="py-5 px-3 my-0.5 rounded-xl bg-surface-container-lowest border border-border-subtle flex flex-col items-center justify-center text-center shadow-inner relative">
          <div className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest mb-1.5">TARGET MISI MATEMATIKA ELEMENTER</div>
          <div className="text-[28px] md:text-[36px] leading-none text-text-primary font-extrabold tracking-tight select-none">63 − 28 = ?</div>
          <div className="font-body-sm text-[11px] text-text-muted mt-1.5">Robot harus menyusun balok bertanda digit 3 dan 5 pada docking pad</div>
        </div>

        {/* Streamlined Action Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
          <Button className="h-10 bg-text-primary text-gray-900 cursor-pointer shadow-md text-sm font-bold w-full">
            <CheckCircle2 size={16} className="text-surface-base" />
            Benar (+10 Poin)
          </Button>
          <Button variant="outline" className="h-10 cursor-pointer text-sm font-semibold w-full">
            <FastForward size={16} />
            Lewati Soal
          </Button>
        </div>
      </div>
    </div>
  )
}
