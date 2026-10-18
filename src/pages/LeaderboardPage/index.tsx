import { useMemo } from "react"
import { Trophy } from "lucide-react"
import { Podium } from "./Podium"
import { StandingsTable } from "./StandingsTable"
import { useParticipants, type Participant } from "@/hooks/useParticipants"

function hasMatched(p: Participant): boolean {
  return p.status === "done" || (p.total_score ?? 0) > 0
}

export function LeaderboardPage() {
  const { participants } = useParticipants()

  const ranked = useMemo(
    () =>
      participants
        .filter(hasMatched)
        .sort(
          (a, b) => (b.total_score ?? 0) - (a.total_score ?? 0) || a.name.localeCompare(b.name)
        ),
    [participants]
  )

  const top3 = ranked.slice(0, 3)
  const rest = ranked.slice(3)

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex flex-col gap-6">
        {ranked.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-raised/40 border border-border-subtle rounded-xl text-center gap-3">
            <Trophy size={40} className="text-text-muted/40" />
            <p className="font-label-mono-stat text-sm text-text-muted uppercase tracking-wider">
              Belum ada tim yang bertanding
            </p>
          </div>
        ) : (
          <>
            <Podium data={top3} />
            {rest.length > 0 && <StandingsTable data={rest} />}
          </>
        )}
      </div>
    </div>
  )
}