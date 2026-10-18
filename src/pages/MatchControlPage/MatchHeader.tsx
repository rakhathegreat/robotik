import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Pause, Play, BadgeCheck, RefreshCw, Bot, Timer } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { supabase } from "@/lib/supabase"
import { AUDIT, writeAudit } from "@/lib/auditLog"
import { useMatchState } from "@/hooks/useMatchState"
import type { Participant } from "@/hooks/useParticipants"

type MatchHeaderProps = {
  participant: Participant | null
  participantId: string | null
  loadError: string | null
  onFinishError: (message: string) => void
}

export function MatchHeader({ participant, participantId, loadError, onFinishError }: MatchHeaderProps) {
  const navigate = useNavigate()
  const { matchState, remainingMs, toggleTimer, resetTimer, setTimeBudget, setCurrentParticipant } = useMatchState({ participantId })
  const [actionError, setActionError] = useState<string | null>(null)
  const [budgetMinutes, setBudgetMinutes] = useState("")
  const [isSavingBudget, setIsSavingBudget] = useState(false)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  const budgetFromDb = matchState ? Math.round(matchState.base_duration_ms / 60000) : null
  const elapsedMs = matchState ? Math.max(0, matchState.base_duration_ms - remainingMs) : 0
  const elapsedLabel = `${Math.floor(elapsedMs / 60000)}:${String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, "0")}`

  // Seed the field from the stored budget on every open so an abandoned draft never sticks.
  const handleTimerOpenChange = (open: boolean) => {
    if (open) setBudgetMinutes(budgetFromDb !== null ? String(budgetFromDb) : "")
    setIsTimerOpen(open)
  }

  const finishMatch = async () => {
    if (!participantId) return
    if (!confirm("Tandai match ini selesai? Skor peserta tetap tersimpan.")) return

    setActionError(null)

    // Hand the arena clock back to a full budget for the next team before leaving.
    await resetTimer()
    await setCurrentParticipant(null)

    const { error } = await supabase
      .from("participants")
      .update({ status: "done" })
      .eq("id", participantId)

    if (error) {
      onFinishError(error.message)
      return
    }

    const auditError = await writeAudit({
      action: AUDIT.matchFinished,
      description: `Match selesai oleh ${participant?.name ?? "tim arena"} (durasi ${elapsedLabel})`,
      participantId,
    })
    if (auditError) onFinishError(auditError)

    navigate("/participants", { replace: true })
  }

  const resetMatch = async () => {
    if (!confirm("Reset match? Timer kembali penuh dan skor tim dikembalikan ke 0.")) return

    setActionError(null)
    await resetTimer()

    if (participantId) {
      const { error } = await supabase
        .from("participants")
        .update({ total_score: 0, status: "active" })
        .eq("id", participantId)

      if (error) {
        setActionError(error.message)
        return
      }

      const auditError = await writeAudit({
        action: AUDIT.matchReset,
        description: `Match direset untuk ${participant?.name ?? "tim arena"} (skor kembali 0)`,
        participantId,
      })
      if (auditError) setActionError(auditError)
    }
  }

  const applyBudget = async () => {
    const minutes = Number(budgetMinutes)
    if (!Number.isFinite(minutes) || minutes <= 0) return

    setIsSavingBudget(true)
    setActionError(null)
    await setTimeBudget(Math.round(minutes * 60000))
    setIsSavingBudget(false)
    setIsTimerOpen(false)
  }

  const isRunning = matchState?.timer_status === "RUNNING"
  const timerStatus = matchState?.timer_status ?? "IDLE"
  const timerLabel = isRunning ? "Pause Match" : timerStatus === "PAUSED" ? "Lanjut Match" : "Mulai Match"

  return (
    <div className="flex flex-col gap-4 pb-4 border-b border-border-subtle">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface-container-highest border border-border-subtle flex items-center justify-center text-text-primary text-lg font-bold">
              <Bot size={24} className="text-text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg text-text-primary font-bold tracking-tight">
                  {participant?.name ?? "Peserta belum dipilih"}
                </h1>
                {participant && (
                  <span className="px-2 py-0.5 rounded-md bg-surface-container border border-border-subtle font-label-mono-stat text-text-secondary text-[10px] uppercase">
                    {participant.total_score} Poin
                  </span>
                )}
              </div>
              <p className="font-medium text-xs text-text-secondary mt-0.5">
                {participant?.school ??
                  (participantId ? "Memuat data peserta..." : "Buka match dari halaman Manajemen Peserta")}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Set timer */}
            <Popover open={isTimerOpen} onOpenChange={handleTimerOpenChange}>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!matchState}
                    className="bg-surface-raised border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary"
                    title="Atur durasi dasar timer">
                    <Timer />
                    Set Timer
                  </Button>
                }
              />
              <PopoverContent align="end" sideOffset={6} className="w-64">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] uppercase tracking-wider text-text-muted">
                    <Timer size={13} />
                    Durasi Match
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={60}
                      value={budgetMinutes}
                      onChange={(e) => setBudgetMinutes(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyBudget()}
                      className="h-8 flex-1 rounded bg-surface-container-lowest border border-border-subtle px-2 font-label-mono-stat text-sm text-text-primary text-center transition-colors focus:outline-none focus:border-border-strong"
                      title="Time budget dalam menit"
                    />
                    <span className="font-label-mono-stat text-[11px] text-text-muted">mnt</span>
                  </div>

                  <p className="font-body-sm text-[11px] text-text-muted">
                    Durasi dasar timer, 1–60 menit.
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-border-subtle">
                    <PopoverClose
                      render={<Button variant="ghost" size="sm" className="text-text-secondary" />}>
                      Batal
                    </PopoverClose>
                    <Button
                      size="sm"
                      onClick={applyBudget}
                      disabled={isSavingBudget}
                      className="font-semibold">
                      {isSavingBudget ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  if (isRunning && !confirm("Match sedang berjalan. Yakin ingin keluar ke antrean?")) return
                  await resetTimer()
                  await setCurrentParticipant(null)
                  navigate("/participants")
                }}
                className="text-text-muted hover:text-text-primary text-xs"
                title="Keluar ke antrean peserta"
              >
                Antrean
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetMatch}
                disabled={!matchState}
                className="bg-surface-raised border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary"
              >
                <RefreshCw />
                Reset Match
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTimer}
                disabled={!matchState}
                className={`bg-surface-raised border-border-subtle hover:border-border-strong hover:text-text-primary ${
                  isRunning ? "text-text-secondary" : "text-status-success"
                }`}
              >
                {isRunning ? <Pause /> : <Play />}
                {timerLabel}
              </Button>
              <Button
                size="sm"
                onClick={finishMatch}
                disabled={!participantId}
                className="bg-primary text-on-primary font-semibold shadow-sm"
              >
                <BadgeCheck />
                Selesai
              </Button>
            </div>
          </div>
          {(actionError ?? loadError) && (
            <p className="font-body-sm text-[11px] text-status-warning text-right break-words max-w-md">
              {actionError ?? loadError}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}