import { Flag } from "lucide-react"
import { useTeamLaps } from "@/hooks/useTeamLaps"
import { formatLapTime } from "@/lib/lapTime"

type LapRecordProps = {
  participantId: string | null
}

/**
 * Operator side of the arena lap record: one row per question attempt — `Soal N (Benar)` or
 * `Soal N (Salah)` — timed from the match start down to the microsecond. Same source as the
 * projector display (`useTeamLaps`); the projector shows a single team, this shows the team
 * currently loaded in the console.
 */
export function LapRecord({ participantId }: LapRecordProps) {
  const laps = useTeamLaps(participantId)
  const correctCount = laps.filter((lap) => lap.isCorrect).length

  return (
    <div className="flex-1 lg:min-h-0 flex flex-col rounded-xl bg-surface-raised border border-border-subtle shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
        <div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-muted uppercase">
          <Flag size={13} />
          <span>Catatan Lap</span>
        </div>
        <span className="font-label-mono-stat text-[10px] text-text-muted">
          {correctCount} BENAR · {laps.length - correctCount} SALAH
        </span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-1.5">
        {laps.length === 0 ? (
          <p className="p-1.5 text-xs text-text-muted">Belum ada percobaan.</p>
        ) : (
          laps.map((lap) => (
            <div
              key={lap.index}
              className="flex items-center justify-between gap-2 p-1.5 rounded bg-surface-container-lowest border border-border-subtle text-[11px]"
            >
              <span className="font-label-mono-stat text-[10px] text-text-secondary tracking-wider">
                Soal {lap.index}{" "}
                <span className={lap.isCorrect ? "text-status-success" : "text-text-muted"}>
                  ({lap.isCorrect ? "Benar" : "Salah"})
                </span>
              </span>
              <span className="font-label-mono-stat text-xs font-bold text-text-primary tabular-nums">
                {formatLapTime(lap.elapsedMicros)}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="px-4 py-2 border-t border-border-subtle text-center">
        <span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">
          Sejak match dimulai
        </span>
      </div>
    </div>
  )
}
