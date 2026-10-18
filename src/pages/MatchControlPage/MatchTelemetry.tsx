import { useMemo } from "react";
import { BarChart2 } from "lucide-react";
import { useParticipants, type Participant } from "@/hooks/useParticipants";
import { useAnsweredQuestions } from "@/hooks/useAnsweredQuestions";

type MatchTelemetryProps = {
	participant: Participant | null;
};

export function MatchTelemetry({ participant }: MatchTelemetryProps) {
	const { participants } = useParticipants();
	const { answeredByQuestion } = useAnsweredQuestions();

	/** Distinct questions this team got right; falls back to all teams when none is loaded. */
	const teamSolved = useMemo(() => {
		if (!participant) return new Set(answeredByQuestion.keys());

		const solved = new Set<string>();
		for (const [questionId, solvers] of answeredByQuestion) {
			if (solvers.has(participant.id)) solved.add(questionId);
		}
		return solved;
	}, [answeredByQuestion, participant]);

	const totalScore = participants.reduce(
		(acc, p) => acc + (p.total_score || 0),
		0,
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="p-4 rounded-xl bg-surface-raised border border-border-subtle shadow-sm flex flex-col gap-3">
				<div className="flex items-center justify-between pb-2 border-b border-border-subtle">
					<div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">
						<BarChart2 size={14} />
						<span>Telemetry Metrics</span>
					</div>
					<span className="inline-flex items-center gap-1.5 font-label-mono-stat text-[10px] text-status-success uppercase tracking-wider">
						<span className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
						Live
					</span>
				</div>

				{/* Compact tiles: they keep their natural height so the lap list below gets the room. */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
					{/* Total points */}
					<div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-lowest border border-border-subtle">
						<div className="flex items-center justify-between">
							<span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">
								Total Poin
							</span>
						</div>
						<div className="flex items-baseline gap-1.5">
							<span className="text-[40px] font-black text-text-primary tracking-tight leading-none">
								{participant ? participant.total_score : totalScore}
							</span>
							<span className="font-label-mono-stat text-[11px] text-status-success font-bold uppercase tracking-wider">
								PTS
							</span>
						</div>
						<div className="flex items-center justify-between pt-2 border-t border-border-subtle">
							<span className="font-body-sm text-[11px] text-text-secondary">
								{participant
									? "Skor tim ini"
									: `Total ${participants.length} tim`}
							</span>
						</div>
					</div>

					{/* Correct questions — no per-match quota, so the count is never capped. */}
					<div className="flex flex-col gap-2 p-4 rounded-xl bg-surface-container-lowest border border-border-subtle">
						<div className="flex items-center justify-between">
							<span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-wider">
								Soal Benar
							</span>
						</div>
						<div className="flex items-baseline gap-1.5">
							<span className="text-[40px] font-black text-text-primary tracking-tight leading-none">
								{teamSolved.size}
							</span>
						</div>
						<div className="flex items-center justify-between pt-2 border-t border-border-subtle">
							<span className="font-body-sm text-[11px] text-text-secondary">
								Soal unik dijawab benar
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
