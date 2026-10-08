import { Podium } from "./Podium"
import { StandingsTable } from "./StandingsTable"

export function LeaderboardPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 flex flex-col gap-6">
        <Podium />
        <StandingsTable />
      </div>
    </div>
  )
}
