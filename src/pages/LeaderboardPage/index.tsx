import { useMemo } from "react"
import { Trophy } from "lucide-react"
import { Podium } from "./Podium"
import { StandingsTable } from "./StandingsTable"
import { useParticipants, type Participant } from "@/hooks/useParticipants"
import { useTeamMatchTimes } from "@/hooks/useTeamMatchTimes"

function hasMatched(p: Participant): boolean {
  return p.status === "done" || (p.total_score ?? 0) > 0
}

export function LeaderboardPage() {
  const { participants } = useParticipants()
  const { matchTimesByParticipant } = useTeamMatchTimes()

  const ranked = useMemo(
    () =>
      participants
        .filter(hasMatched)
        .sort((a, b) => {
          // 1. Total score (descending)
          const scoreDiff = (b.total_score ?? 0) - (a.total_score ?? 0)
          if (scoreDiff !== 0) return scoreDiff

          // 2. Tie-breaker: duration (lower/faster is better)
          const timeA = matchTimesByParticipant.get(a.id)?.durationMs ?? Number.POSITIVE_INFINITY
          const timeB = matchTimesByParticipant.get(b.id)?.durationMs ?? Number.POSITIVE_INFINITY
          if (timeA !== timeB) return timeA - timeB

          // 3. Name (alphabetical)
          return a.name.localeCompare(b.name)
        }),
    [participants, matchTimesByParticipant]
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
            <Podium data={top3} matchTimes={matchTimesByParticipant} />
            {rest.length > 0 && <StandingsTable data={rest} matchTimes={matchTimesByParticipant} />}
          </>
        )}
      </div>
    </div>
  )
}