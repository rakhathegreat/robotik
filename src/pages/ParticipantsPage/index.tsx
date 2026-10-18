import { ParticipantsTable } from "./ParticipantsTable";
import { MatchControl } from "./MatchControl";
import { ParticipantForm } from "./ParticipantForm";
import { useState } from "react";
import type { Participant } from "@/hooks/useParticipants";

export function ParticipantsPage() {
	const [editing, setEditing] = useState<Participant | null>(null);

	return (
		<div className="flex flex-col w-full">
			<div className="w-full max-w-[1720px] mx-auto px-space-lg pt-4 pb-space-xl flex flex-col gap-space-lg">
				{/* Master-Detail Split Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
					{/* Left Column: Master List */}
					<div className="lg:col-span-8 flex flex-col gap-space-md h-full">
						<ParticipantsTable onEdit={setEditing} />
					</div>

					{/* Right Column: Command & CRUD Form Panel */}
					<div className="lg:col-span-4 flex flex-col gap-space-md h-full justify-between">
						<MatchControl />
						<ParticipantForm
							editing={editing}
							onDone={() => setEditing(null)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
