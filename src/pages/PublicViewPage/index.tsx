import { useState, useEffect } from "react"
import { Timer as TimerIcon, Award, CheckCircle2, Maximize, Minimize } from "lucide-react"

export function PublicViewPage() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeLeft, setTimeLeft] = useState("03:35.86")

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  useEffect(() => {
    let totalMs = (3 * 60 + 35) * 1000 + 860;

    const interval = setInterval(() => {
      totalMs -= 37;
      if (totalMs < 0) totalMs = 0;

      const m = Math.floor(totalMs / 60000);
      const s = Math.floor((totalMs % 60000) / 1000);
      const ms = Math.floor((totalMs % 1000) / 10);

      const mm = String(m).padStart(2, '0');
      const ss = String(s).padStart(2, '0');
      const msStr = String(ms).padStart(2, '0');

      setTimeLeft(`${mm}:${ss}.${msStr}`);
    }, 37);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-surface-base font-sans text-on-surface select-none antialiased h-screen w-screen flex flex-col overflow-hidden relative group">
      <button onClick={toggleFullscreen} className="absolute top-6 right-6 z-50 p-2.5 rounded-lg bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-all opacity-0 group-hover:opacity-100 shadow-sm" title="Toggle Fullscreen">
        {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
      </button>

      <main className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 lg:p-8 bg-surface-base">
        <div className="w-full h-full max-w-[1720px] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
          {/* Active Question Card */}
          <div className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md p-6 xl:p-8 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/5 pb-5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-surface-container border border-border-subtle text-text-primary text-xs font-semibold font-label-mono-stat">SOAL 02 / 05</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-label-mono-stat tracking-wider text-text-muted uppercase hidden sm:inline">PROGRESS MATRIKS</span>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-status-success shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-700"></div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center relative py-6">
              <div className="text-6xl sm:text-7xl md:text-8xl xl:text-[120px] 2xl:text-[140px] font-extrabold text-white tracking-tighter tabular-nums text-center select-none py-2 leading-none font-sans drop-shadow-md">63 − 28 = ?</div>
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-label-mono-stat text-xs text-text-muted">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-text-muted">STATUS:</span>
                  <span className="px-2.5 py-0.5 rounded-md bg-status-success/10 text-status-success font-semibold text-[11px]">AKTIF</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-text-muted tracking-wider text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-status-success/80"></span>
                <span>SYS_FEED // SYNCHRONIZED</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-5 xl:gap-6 justify-between">
            {/* Timer Card */}
            <div className="flex-1 flex flex-col justify-between rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <TimerIcon className="text-text-primary text-[18px]" size={18} />
                  <span className="text-xs font-label-mono-stat font-bold tracking-wider uppercase text-text-primary">OFFICIAL ARENA TIMER</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="text-5xl sm:text-6xl xl:text-[70px] font-bold text-white tracking-tight tabular-nums text-center select-none leading-none font-label-mono-stat drop-shadow-sm">
                  {timeLeft}
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-4 overflow-hidden p-0.5">
                  <div className="h-full bg-status-success rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '71.8%' }}></div>
                </div>
                <div className="w-full grid grid-cols-3 text-center mt-3 pt-4 font-label-mono-stat text-[10px] tracking-wider text-text-muted border-t border-white/5">
                  <div className="text-left">
                    <span className="block text-text-muted uppercase text-[9px]">BASE</span>
                    <span className="text-text-secondary font-medium">05:00.00</span>
                  </div>
                  <div>
                    <span className="block text-text-muted uppercase text-[9px]">CAPACITY</span>
                    <span className="text-status-success font-semibold">71.8% REMAIN</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-text-muted uppercase text-[9px]">FLOOR</span>
                    <span className="text-text-secondary font-medium">00:00.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Card */}
            <div className="flex-1 flex flex-col justify-between rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="text-status-success text-[18px]" size={18} />
                  <span className="text-xs font-label-mono-stat font-bold tracking-wider uppercase text-text-primary">TOTAL AKUMULASI POIN</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl xl:text-[68px] font-black text-white tracking-tight tabular-nums leading-none font-sans drop-shadow-md">20</span>
                  <span className="text-lg xl:text-xl font-label-mono-stat text-status-success font-bold uppercase tracking-wider">PTS</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 gap-3">
                <div className="rounded-xl border border-white/5 bg-zinc-900/60 p-3 text-center">
                  <span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider block">Pertanyaan</span>
                  <span className="font-label-mono-stat text-base text-text-primary font-bold tabular-nums">2 / 5 Soal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
