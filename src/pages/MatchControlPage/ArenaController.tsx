import { Timer, CheckCircle2, SkipForward, Play, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AUDIT, writeAudit } from "@/lib/auditLog";
import { CORRECT_POINTS, awardPoints } from "@/lib/scoring";
import { useMatchState } from "@/hooks/useMatchState";
import type { Participant } from "@/hooks/useParticipants";

type ArenaControllerProps = {
	participant: Participant | null;
};

export function ArenaController({ participant }: ArenaControllerProps) {
	const {
		matchState,
		question,
		timeLeft,
		remainingMs,
		countdownMs,
		capacityPct,
		error,
		toggleTimer,
		nextUnansweredQuestion,
		nextActiveQuestion,
		setCurrentQuestion,
	} = useMatchState({ participantId: participant?.id });
	const [scoring, setScoring] = useState(false);
	const [actionError, setActionError] = useState<string | null>(null);
	const scoringRef = useRef(false);

	/**
	 * Puts the next question on screen: an unanswered one when available, otherwise any other
	 * active question — there is no per-match question quota, so the run never gets stuck
	 * waiting for unused questions. Returns false only when the bank has no active question.
	 */
	const advanceQuestion = async () => {
		const nextId = (await nextUnansweredQuestion()) ?? (await nextActiveQuestion());

		if (!nextId) {
			setActionError("Belum ada soal aktif di bank soal");
			return false;
		}

		await setCurrentQuestion(nextId);
		return true;
	};

	useEffect(() => {
		if (participant && !question && !matchState?.current_question_id) {
			void advanceQuestion();
		}
	}, [participant, question, matchState?.current_question_id]);

	const markCorrect = async () => {
		if (!participant || !question || scoringRef.current) return;

		scoringRef.current = true;
		setScoring(true);
		setActionError(null);

		try {
			const { data: newTotal, error: scoreError } = await awardPoints(
				participant.id,
				CORRECT_POINTS,
			);

			if (scoreError) {
				setActionError(scoreError.message);
				return;
			}

			// SECURITY INVOKER + RLS: an expired session or missing participant updates zero rows
			// and the function returns null instead of throwing. Do not record a correct answer.
			if (newTotal === null) {
				setActionError(
					"Skor tidak tersimpan: sesi tidak berhak atau peserta tidak ditemukan",
				);
				return;
			}

			const auditError = await writeAudit({
				action: AUDIT.questionCorrect,
				description: `Soal benar (${question.equation}) oleh ${participant.name} (+${CORRECT_POINTS} Poin)`,
				participantId: participant.id,
				questionId: question.id,
			});

			if (auditError) {
				setActionError(auditError);
				return;
			}

			// The award never moves the question, so advance here — the audit row is already
			// written, which is what makes the no-repeat rule skip this question.
			await advanceQuestion();
		} finally {
			scoringRef.current = false;
			setScoring(false);
		}
	};

	const skipQuestion = async () => {
		if (!participant || !question) return;

		setScoring(true);
		setActionError(null);

		const auditError = await writeAudit({
			action: AUDIT.questionSkipped,
			description: `Soal dilewati (${question.equation}) oleh ${participant.name}`,
			participantId: participant.id,
			questionId: question.id,
		});

		setScoring(false);
		if (auditError) setActionError(auditError);
	};

	// Latest shortcut handlers, so the keydown listener can be registered once and still call
	// the current render's closures (markCorrect closes over the on-screen question).
	const shortcutsRef = useRef({ toggleTimer, markCorrect });
	useEffect(() => {
		shortcutsRef.current = { toggleTimer, markCorrect };
	});

	// Referee shortcuts: Space toggles the clock, Tab records a correct answer (= one lap).
	// Held keys are ignored so auto-repeat never double-awards or flickers the timer, and both
	// are skipped while typing so a space in the time-budget input never pauses the match.
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.repeat || event.metaKey || event.ctrlKey || event.altKey)
				return;

			const target = event.target;
			if (target instanceof HTMLElement) {
				if (
					target.tagName === "INPUT" ||
					target.tagName === "TEXTAREA" ||
					target.isContentEditable ||
					// An open overlay (Set Timer popover, operator menu) owns the keyboard.
					target.closest('[role="dialog"], [role="menu"], [role="listbox"]')
				)
					return;
			}

			if (event.code === "Space") {
				event.preventDefault();
				void shortcutsRef.current.toggleTimer();
			} else if (event.code === "Tab") {
				event.preventDefault();
				void shortcutsRef.current.markCorrect();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);

	const isRunning = matchState?.timer_status === "RUNNING";
	const isPaused = matchState?.timer_status === "PAUSED";
	// DESIGN.md reserves status-warning strictly for time-critical countdowns (< 30s).
	const isCritical = isRunning && remainingMs > 0 && remainingMs <= 30_000;

	const timerCardClass = isCritical
		? "border-status-warning/50 bg-status-warning/[0.04] ring-1 ring-status-warning/30"
		: isRunning
			? "border-status-success/40 bg-surface-raised ring-1 ring-status-success/20"
			: "border-border-subtle bg-surface-raised";

	const timerDigitClass = isCritical
		? "text-status-warning"
		: isPaused
			? "text-text-secondary"
			: "text-text-primary";

	const statusDotClass = isCritical
		? "bg-status-warning animate-pulse"
		: isRunning
			? "bg-status-success animate-pulse"
			: isPaused
				? "bg-text-muted"
				: "bg-zinc-600";

	const statusBarClass = isCritical
		? "bg-status-warning"
		: isRunning
			? "bg-status-success"
			: isPaused
				? "bg-text-muted"
				: "bg-zinc-600";

	return (
		<div className="lg:col-span-7 h-full min-h-0 flex flex-col gap-4">
			{/* Official Arena Timer — highlighted */}
			<div
				className={`flex-1 p-5 rounded-xl border shadow-sm flex flex-col gap-4 transition-colors duration-500 ${timerCardClass}`}>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-secondary uppercase tracking-wider">
						<Timer size={13} />
						<span>Official Arena Timer</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="font-label-mono-stat text-[10px] text-text-muted">
							BUDGET{" "}
							{matchState
								? `${Math.floor(matchState.base_duration_ms / 60000)
										.toString()
										.padStart(2, "0")}:00`
								: "05:00"}
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container border border-border-subtle px-2 py-0.5 font-label-mono-stat text-[10px] uppercase tracking-wider text-text-secondary">
							<span className={`w-1.5 h-1.5 rounded-full ${statusDotClass}`} />
							{countdownMs > 4500
								? "SIAP 3"
								: countdownMs > 3000
									? "SIAP 2"
									: countdownMs > 1500
										? "SIAP 1"
										: countdownMs > 0
											? "MULAI!"
											: isCritical
												? "KRITIS"
												: (matchState?.timer_status ?? "IDLE")}
						</span>
					</div>
				</div>

				<div className="flex-1 flex flex-col items-center justify-center gap-6">
					{/* Sized off the viewport so the hero timer shrinks instead of spilling on a short
					    window (`min(vh,vw)` keeps it from overflowing a narrow-but-tall one). */}
					<div
						className={`text-[clamp(3.5rem,min(11vh,7.5vw),8rem)] leading-none font-bold tracking-tighter tabular-nums text-center select-none transition-colors duration-500 ${timerDigitClass}`}>
						{timeLeft}
					</div>

					<div className="w-full max-w-md xl:max-w-xl bg-surface-container-lowest h-2 rounded-full overflow-hidden">
						<div
							className={`h-full rounded-full transition-all duration-300 ${statusBarClass}`}
							style={{ width: `${capacityPct}%` }}></div>
					</div>

					{matchState?.timer_status === "IDLE" ? (
						<Button
							onClick={toggleTimer}
							size="lg"
							className="bg-status-success hover:bg-status-success/90 text-gray-950 font-bold px-6 py-2 rounded-xl shadow-lg shadow-status-success/20 cursor-pointer animate-pulse transition-all">
							<Play size={18} fill="currentColor" className="mr-2" />
							Mulai Match (Spasi)
						</Button>
					) : (
						<Button
							variant="outline"
							size="sm"
							onClick={toggleTimer}
							className={`bg-surface-container border-border-subtle hover:border-border-strong hover:text-text-primary text-xs ${
								isRunning ? "text-text-secondary" : "text-status-success"
							}`}>
							{isRunning ? <Pause size={14} className="mr-1.5" /> : <Play size={14} fill="currentColor" className="mr-1.5" />}
							{isRunning ? "Pause (Spasi)" : "Lanjut (Spasi)"}
						</Button>
					)}
				</div>
			</div>

			{(actionError ?? error) && (
				<p className="font-body-sm text-[11px] text-status-warning break-words">
					{actionError ?? error}
				</p>
			)}

			{/* Scoring actions (question card removed) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
				<Button
					onClick={markCorrect}
					disabled={!participant || !question || scoring}
					className="h-10 bg-text-primary text-gray-900 cursor-pointer shadow-md text-sm font-bold w-full">
					<CheckCircle2 size={16} className="text-surface-base" />
					{scoring ? "Menyimpan..." : `Benar (+${CORRECT_POINTS} Poin)`}
				</Button>
				<Button
					variant="outline"
					onClick={skipQuestion}
					disabled={!participant || !question || scoring}
					className="h-10 cursor-pointer text-sm font-semibold w-full">
					<SkipForward size={16} />
					Lewati
				</Button>
			</div>
		</div>
	);
}
