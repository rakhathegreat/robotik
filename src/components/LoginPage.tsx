import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Eye, EyeOff, ArrowRight, Info, ExternalLink } from "lucide-react"

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated auth
    navigate("/participants")
  }

  return (
    <div className="bg-[#09090b] font-sans text-[#e5e1e4] antialiased min-h-screen flex flex-col justify-center items-center">
      <main className="w-full flex justify-center items-center p-4">
        <div className="flex flex-col w-full max-w-[480px] items-center justify-center py-4 px-4 relative z-10">

          {/* Subtle Ambient Background Glow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-white/5 via-white/[0.02] to-transparent blur-3xl pointer-events-none rounded-full" />

          {/* Top Status Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#161619] border border-white/10 shadow-lg mb-6 select-none">
            <span className="w-2 h-2 rounded-full bg-[#10b981] inline-block animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="font-mono text-[11px] font-semibold text-zinc-300 tracking-wider uppercase">
              ARENA 01 // SYSTEM READY
            </span>
          </div>

          {/* Centered Precision Card */}
          <Card className="w-full bg-[#141417] border border-white/10 rounded-2xl shadow-2xl shadow-black/80 p-8 sm:p-9 flex flex-col relative backdrop-blur-sm gap-0 ring-0">

            {/* Geometric Robot Precision Emblem */}
            <div className="flex flex-col items-center text-center">
              <div className="w-13 h-13 p-3 rounded-xl bg-[#1c1c20] border border-white/10 flex items-center justify-center text-white mb-4 shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.75"
                  viewBox="0 0 24 24"
                >
                  <rect height="10" rx="2" width="18" x="3" y="11" />
                  <circle cx="12" cy="5" r="2" />
                  <path d="M12 7v4" />
                  <line strokeWidth="2.5" x1="8" x2="8.01" y1="16" y2="16" />
                  <line strokeWidth="2.5" x1="16" x2="16.01" y1="16" y2="16" />
                  <path d="M9 19h6" />
                  <path d="M1 15h2" />
                  <path d="M21 15h2" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Counting Mission
              </h1>
              <p className="text-sm text-zinc-400 mt-1 font-medium">
                TASIK ROBOTICS COMPETITION 2026
              </p>
            </div>

            {/* Form Content Area */}
            <div className="mt-7">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <label className="text-zinc-300" htmlFor="input-password">
                      Password Arena
                    </label>
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-zinc-400 pointer-events-none select-none" />
                    <Input
                      autoFocus
                      autoComplete="current-password"
                      className="w-full bg-[#0d0d10] text-white border border-white/10 focus-visible:border-zinc-400 pl-11 pr-11 h-12 rounded-xl outline-none focus-visible:bg-[#111114] transition-all placeholder:text-zinc-500 focus-visible:ring-0 placeholder:text-sm"
                      id="input-password"
                      placeholder="Masukkan kata sandi arena..."
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 h-10 w-10 hover:bg-transparent hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={16} className="text-zinc-400 select-none" />
                      ) : (
                        <Eye size={16} className="text-zinc-400 select-none" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full h-12 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-md select-none mt-1"
                  type="submit"
                  onClick={handleLogin}
                >
                  <span>Masuk Konsol</span>
                  <ArrowRight size={16} className="select-none" />
                </Button>

                <p className="text-center text-xs text-zinc-400 flex items-center justify-center gap-1.5 mt-2">
                  <Info size={14} className="text-zinc-400 select-none" />
                  <span>Satu akun master untuk seluruh operasional pertandingan</span>
                </p>
              </div>
            </div>

            {/* Secondary Divider Section */}
            <div className="mt-7 flex flex-col gap-4">
              <div className="relative flex items-center justify-center">
                <div className="w-full h-px bg-white/10 absolute" />
                <span className="relative px-3 bg-[#141417] text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
                  AKSES DISPLAY PUBLIK (TANPA LOGIN)
                </span>
              </div>

              {/* Read-Only Quick Access Button */}
              <Button
                className="w-full h-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-lg bg-[#18181b]/60 hover:bg-[#1c1c20] border border-white/5 hover:border-white/10 text-zinc-400 hover:text-zinc-200 transition-all group"
                type="button"
              >
                <ExternalLink size={16} className="group-hover:text-white transition-colors select-none" />
                <span className="text-xs font-medium">Public View</span>
              </Button>
            </div>
          </Card>

          {/* Telemetry System Metadata Footer */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-center select-none text-[11px] font-mono text-zinc-400">
            <span className="text-zinc-400 font-mono text-[11px] select-none">
              ICONFEST 2026 // HMIF-FT UNSIL
            </span>
          </div>

        </div>
      </main>
    </div>
  )
}
