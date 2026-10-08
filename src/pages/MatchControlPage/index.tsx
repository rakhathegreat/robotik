import { MatchHeader } from "./MatchHeader"
import { ArenaController } from "./ArenaController"
import { MatchTelemetry } from "./MatchTelemetry"
import { AuditLog } from "./AuditLog"

export function MatchControlPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 flex flex-col gap-6">
        <MatchHeader />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <ArenaController />
          <MatchTelemetry />
        </div>
        <AuditLog />
      </div>
    </div>
  )
}
