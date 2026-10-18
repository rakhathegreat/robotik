import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { subscribeToTable } from "@/lib/tableRealtime"
import { AUDIT } from "@/lib/auditLog"
import { toEpochMicros } from "@/lib/lapTime"

type LapRow = {
  action: string
  created_at: string
}

export type TeamLap = {
  /** 1-based attempt ordinal for the team's current run (attempt 1, attempt 2, ...). */
  index: number
  /** A skipped question is recorded as a wrong attempt. */
  isCorrect: boolean
  /** Microseconds between the run start and this attempt. */
  elapsedMicros: number
}

/** Timer actions that can mark the beginning of a run for the published team. */
const START_LIKE_ACTIONS: string[] = [AUDIT.matchStarted, AUDIT.timerResumed]

/**
 * Lap record for the team currently in the arena: one entry per question attempt the console
 * recorded, timed from the start of that team's current run. There is no match table, so the
 * audit trail is the only timing source.
 *
 * Every attempt counts — `question_correct` (Benar) and `question_skipped` (Salah) — so the
 * list is not bounded by how many questions the arena happens to hold.
 *
 * The run start is not a single event: the console writes `match_started` only on an
 * IDLE -> RUNNING transition, while the next team usually begins with `timer_resumed`
 * (PAUSED -> RUNNING). So the start is the first `match_started`/`timer_resumed` after the
 * team's most recent `match_reset` (falling back to its first remaining row). Attempts from
 * before that point — e.g. a previous, reset run — are dropped.
 *
 * The anchor is the moment the referee pressed start, so it includes the intro countdown and any
 * pause: laps are wall-clock, not the timer's elapsed time.
 */
export function useTeamLaps(participantId: string | null): TeamLap[] {
  const [rows, setRows] = useState<LapRow[]>([])

  useEffect(() => {
    if (!participantId) {
      setRows([])
      return
    }

    let active = true
    const load = async () => {
      const { data } = await supabase
        .from("audit_logs")
        .select("action, created_at")
        .eq("participant_id", participantId)
        .in("action", [
          AUDIT.matchStarted,
          AUDIT.timerResumed,
          AUDIT.matchReset,
          AUDIT.questionCorrect,
          AUDIT.questionSkipped,
        ])
        .order("created_at", { ascending: true })

      if (active) setRows(data ?? [])
    }

    void load()
    return subscribeToTable("audit_logs", () => {
      void load()
    })
  }, [participantId])

  return useMemo(() => {
    const timed = rows.map((row) => ({
      action: row.action,
      at: toEpochMicros(row.created_at),
    }))

    const resetTimes = timed.filter((row) => row.action === AUDIT.matchReset).map((row) => row.at)
    const lastReset = resetTimes.length > 0 ? Math.max(...resetTimes) : Number.NEGATIVE_INFINITY
    const scoped = timed.filter((row) => row.at >= lastReset)

    const startRow =
      scoped.find((row) => START_LIKE_ACTIONS.includes(row.action)) ?? scoped[0]
    if (!startRow) return []

    return scoped
      .filter(
        (row) =>
          (row.action === AUDIT.questionCorrect || row.action === AUDIT.questionSkipped) &&
          row.at >= startRow.at
      )
      .map((row, index) => ({
        index: index + 1,
        isCorrect: row.action === AUDIT.questionCorrect,
        elapsedMicros: row.at - startRow.at,
      }))
  }, [rows])
}
