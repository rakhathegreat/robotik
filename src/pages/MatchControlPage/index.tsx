import { useCallback, useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { supabase } from "@/lib/supabase"
import { subscribeToTable } from "@/lib/tableRealtime"
import { AUDIT, writeAudit } from "@/lib/auditLog"
import { useMatchState } from "@/hooks/useMatchState"
import type { Participant } from "@/hooks/useParticipants"
import { MatchHeader } from "./MatchHeader"
import { ArenaController } from "./ArenaController"
import { MatchTelemetry } from "./MatchTelemetry"
import { LapRecord } from "./LapRecord"

function formatDuration(ms: number) {
  const safe = Math.max(0, ms)
  const minutes = Math.floor(safe / 60000)
  const seconds = Math.floor((safe % 60000) / 1000)
  const millis = Math.floor(safe % 1000)
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`
}

export function MatchControlPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const participantId = searchParams.get("participant")
  const [participant, setParticipant] = useState<Participant | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const { matchState, remainingMs, resetTimer, setCurrentParticipant } = useMatchState({
    participantId,
  })
  const autoFinished = useRef(false)

  useEffect(() => {
    if (!participantId) {
      setParticipant(null)
      return
    }

    const load = async () => {
      const { data, error } = await supabase
        .from("participants")
        .select("*")
        .eq("id", participantId)
        .single()

      if (error) setLoadError(error.message)
      else {
        setLoadError(null)
        setParticipant(data)
      }
    }

    void load()

    return subscribeToTable("participants", () => {
      void load()
    })
  }, [participantId])

  // Publish the team currently in the arena so the projector display knows whose match it is.
  useEffect(() => {
    if (!matchState || !participantId) return
    if (matchState.current_participant_id === participantId) return
    void setCurrentParticipant(participantId)
  }, [matchState, participantId, setCurrentParticipant])

  // If the referee navigates away while the match has not started (IDLE), clear the arena
  // participant so the public view resets back to the resting leaderboard.
  useEffect(() => {
    return () => {
      if (matchState?.timer_status === "IDLE") {
        void setCurrentParticipant(null)
      }
    }
  }, [matchState?.timer_status, setCurrentParticipant])

  const timerExpired = remainingMs <= 0

  const onFinishError = useCallback((message: string) => setLoadError(message), [])

  // The only automatic end is the clock running out: there is no per-match question quota, so
  // "all questions answered" must not stop the team (it keeps receiving questions instead).
  useEffect(() => {
    if (!participantId || autoFinished.current) return
    if (matchState?.timer_status !== "RUNNING") return
    if (!timerExpired) return

    autoFinished.current = true

    const finish = async () => {
      // Same as the Selesai button: park the clock back to a full budget for the next team, so a
      // run that ended on 00:00 does not instantly finish the next team too.
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

      const elapsed = Math.max(0, (matchState?.base_duration_ms ?? 0) - remainingMs)

      const auditError = await writeAudit({
        action: AUDIT.matchFinished,
        description: `Match selesai otomatis (waktu habis) untuk ${participant?.name ?? "tim arena"} (durasi ${formatDuration(elapsed)})`,
        participantId,
      })
      if (auditError) onFinishError(auditError)

      navigate("/participants", { replace: true })
    }

    void finish()
  }, [timerExpired, matchState?.timer_status])

  return (
    <div className="flex flex-col w-full lg:h-[calc(100vh_-_5rem)]">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex flex-col gap-6 lg:flex-1 lg:min-h-0">
        <MatchHeader
          participant={participant}
          participantId={participantId}
          loadError={loadError}
          onFinishError={onFinishError}
        />
        {/*
          Two columns filling exactly one screen on a desktop monitor: the timer is the hero, the
          right column stacks the compact telemetry tiles over the lap list, which is the only part
          that scrolls. `minmax(0,1fr)` keeps the row inside the container instead of growing with
          the list, and the page carries no min-height — anything that forces a floor taller than a
          short browser viewport is exactly what puts a scrollbar back on a laptop.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] gap-6 items-stretch lg:flex-1 lg:min-h-0">
          <ArenaController participant={participant} />
          <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
            <MatchTelemetry participant={participant} />
            <LapRecord participantId={participantId} />
          </div>
        </div>
      </div>
    </div>
  )
}