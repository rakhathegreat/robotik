import { PageHeader } from "./PageHeader"
import { ParticipantsTable } from "./ParticipantsTable"
import { MatchControl } from "./MatchControl"
import { ParticipantForm } from "./ParticipantForm"

export function ParticipantsPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1720px] mx-auto px-space-lg pt-4 pb-space-xl flex flex-col gap-space-lg">
        <PageHeader />
        
        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
          {/* Left Column: Master List */}
          <div className="lg:col-span-8 flex flex-col gap-space-md h-full">
            <ParticipantsTable />
          </div>
          
          {/* Right Column: Command & CRUD Form Panel */}
          <div className="lg:col-span-4 flex flex-col gap-space-md h-full justify-between">
            <MatchControl />
            <ParticipantForm />
          </div>
        </div>
      </div>
    </div>
  )
}
