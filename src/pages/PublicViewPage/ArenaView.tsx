import { useEffect, useRef, useState } from "react";
import { Timer as TimerIcon, Award, Flag, Trophy, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { subscribeToTable } from "@/lib/tableRealtime";
import { useMatchState } from "@/hooks/useMatchState";
import { useTeamLaps } from "@/hooks/useTeamLaps";
import { playCorrectAnswerSound } from "@/lib/sound";
import { formatLapTime } from "@/lib/lapTime";
import type { Participant } from "@/hooks/useParticipants";

/**
 * Live match view for the projector: the team in the arena, the official clock, its lap record
 * and its progress. Shown only while a match is actually on (RUNNING or PAUSED) — the classement
 * is the default screen of `PublicViewPage`, and this one takes over the moment a match starts.
 */
export function ArenaView() {
	const { matchState, timeLeft, remainingMs, capacityPct } = useMatchState();
	const [arenaTeam, setArenaTeam] = useState<Participant | null>(null);

	// The arena team is whatever the referee console last published; it intentionally
	// stays on screen after the match so the projector keeps showing the last result.
	const teamId = matchState?.current_participant_id ?? null;

	useEffect(() => {
		if (!teamId) return;

		let active = true;
		const load = async () => {
			const { data } = await supabase
				.from("participants")
				.select("*")
				.eq("id", teamId)
				.single();
			if (active && data) setArenaTeam(data);
		};

		void load();
		return subscribeToTable("participants", () => {
			void load();
		});
	}, [teamId]);

	const laps = useTeamLaps(teamId);
	const correctCount = laps.filter((lap) => lap.isCorrect).length;
	const prevCorrectCountRef = useRef<number | null>(null);

	// Play chime on projector when a new correct answer is recorded
	useEffect(() => {
		if (
			prevCorrectCountRef.current !== null &&
			correctCount > prevCorrectCountRef.current
		) {
			playCorrectAnswerSound();
		}
		prevCorrectCountRef.current = correctCount;
	}, [correctCount]);

	const isRunning = matchState?.timer_status === "RUNNING";
	const isPaused = matchState?.timer_status === "PAUSED";
	// DESIGN.md reserves status-warning strictly for time-critical countdowns (< 30s).
	const isCritical = isRunning && remainingMs > 0 && remainingMs <= 30_000;

	const statusColorClass = isCritical
		? "bg-status-warning shadow-[0_0_10px_rgba(245,158,11,0.5)]"
		: isRunning
			? "bg-status-success shadow-[0_0_10px_rgba(16,185,129,0.5)]"
			: isPaused
				? "bg-text-muted"
				: "bg-zinc-600";

	const timerCardClass = isCritical
		? "border-status-warning/50 bg-status-warning/[0.04] ring-1 ring-status-warning/30"
		: isRunning
			? "border-status-success/40 bg-[#131315]/80 ring-1 ring-status-success/20"
			: "border-white/5 bg-[#131315]/80";

	const timerDigitClass = isCritical
		? "text-status-warning drop-shadow-[0_0_28px_rgba(245,158,11,0.35)]"
		: isPaused
			? "text-text-secondary"
			: "text-white drop-shadow-[0_0_24px_rgba(255,255,255,0.18)]";

	return (
		<main className="w-full h-full flex flex-col justify-center items-center p-4 md:p-6 lg:p-8 bg-surface-base">
			<div className="w-full h-full max-w-[1720px] grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch">
				<div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-4 lg:gap-6 min-h-0">
					{/* Arena Team Card */}
					<div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md px-4 py-3 shadow-lg">
						<div className="w-10 h-10 shrink-0 rounded-lg bg-surface-container border border-border-subtle flex items-center justify-center">
							<Users size={18} className="text-text-secondary" />
						</div>
						<div className="min-w-0">
							<span className="block font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest">
								Tim Arena
							</span>
							<h2 className="text-lg xl:text-xl font-bold text-text-primary tracking-tight truncate">
								{arenaTeam?.name ?? "MENUNGGU TIM"}
							</h2>
						</div>
						<span className="ml-auto pl-4 shrink-0 font-label-mono-stat text-xs text-text-secondary text-right truncate max-w-[45%]">
							{arenaTeam?.school ?? "Belum ada tim di arena"}
						</span>
					</div>

					{/* Timer Card — highlighted as the primary projector anchor */}
					<div
						className={`flex-1 flex flex-col justify-between rounded-2xl border backdrop-blur-md p-6 xl:p-8 shadow-xl relative overflow-hidden transition-colors duration-500 ${timerCardClass}`}>
						<div className="flex items-center justify-between border-b border-white/5 pb-4">
							<div className="flex items-center gap-2">
								<TimerIcon
									className={
										isCritical
											? "text-status-warning"
											: isRunning
												? "text-status-success"
												: "text-text-primary"
									}
									size={18}
								/>
								<span className="text-xs font-label-mono-stat font-bold tracking-wider uppercase text-text-primary">
									OFFICIAL ARENA TIMER
								</span>
							</div>
							<span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container border border-border-subtle px-2 py-0.5 font-label-mono-stat text-[10px] uppercase tracking-wider text-text-secondary">
								<span
									className={`w-1.5 h-1.5 rounded-full ${isCritical ? "bg-status-warning animate-pulse" : isRunning ? "bg-status-success animate-pulse" : isPaused ? "bg-text-muted" : "bg-zinc-600"}`}
								/>
								{isCritical ? "KRITIS" : (matchState?.timer_status ?? "IDLE")}
							</span>
						</div>
						<div className="flex-1 flex flex-col items-center justify-center">
							<div
								className={`text-6xl sm:text-7xl md:text-8xl xl:text-[120px] 2xl:text-[144px] font-bold tracking-tight tabular-nums text-center select-none leading-none font-label-mono-stat transition-colors duration-500 ${timerDigitClass}`}>
								{timeLeft}
							</div>
							<div className="w-full bg-zinc-800 rounded-full h-2.5 mt-6 overflow-hidden p-0.5">
								<div
									className={`h-full rounded-full transition-all duration-300 ${statusColorClass}`}
									style={{ width: `${capacityPct}%` }}></div>
							</div>
							<div className="w-full grid grid-cols-3 text-center mt-3 pt-4 font-label-mono-stat text-[10px] tracking-wider text-text-muted border-t border-white/5">
								<div className="text-left">
									<span className="block text-text-muted uppercase text-[9px]">
										BASE
									</span>
									<span className="text-text-secondary font-medium">
										{matchState
											? `${Math.floor(matchState.base_duration_ms / 60000)
													.toString()
													.padStart(2, "0")}:00.00`
											: "05:00.00"}
									</span>
								</div>
								<div>
									<span className="block text-text-muted uppercase text-[9px]">
										CAPACITY
									</span>
									<span
										className={
											matchState?.timer_status === "RUNNING"
												? "text-status-success font-semibold"
												: "text-text-muted"
										}>
										{capacityPct.toFixed(1)}% REMAIN
									</span>
								</div>
								<div className="text-right">
									<span className="block text-text-muted uppercase text-[9px]">
										FLOOR
									</span>
									<span className="text-text-secondary font-medium">
										00:00.00
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5 xl:gap-6 justify-between">
					{/* Lap Record Card */}
					<div className="flex-[1.5] flex flex-col rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md shadow-xl relative overflow-hidden min-h-0">
						<div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
							<div className="flex items-center gap-3">
								<Flag size={18} className="text-text-secondary" />
								<span className="text-xs font-label-mono-stat font-bold tracking-wider uppercase text-text-primary">
									Catatan Lap
								</span>
							</div>
							<span className="font-label-mono-stat text-[11px] text-text-muted uppercase tracking-widest">
								{correctCount} Benar · {laps.length - correctCount} Salah
							</span>
						</div>

						<div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
							{laps.length === 0 ? (
								<div className="h-full flex items-center justify-center text-xs font-label-mono-stat text-text-muted uppercase tracking-widest text-center">
									Belum ada percobaan
								</div>
							) : (
								<ul className="flex flex-col gap-2">
									{laps.map((lap) => (
										<li
											key={lap.index}
											className="flex items-center justify-between gap-3 rounded-lg bg-surface-container/60 border border-white/5 px-4 py-2.5">
											<span className="font-label-mono-stat text-xs text-text-secondary tracking-wider">
												Soal {lap.index}{" "}
												<span
													className={
														lap.isCorrect ? "text-status-success" : "text-text-muted"
													}>
													({lap.isCorrect ? "Benar" : "Salah"})
												</span>
											</span>
											<span className="font-label-mono-stat text-lg font-bold text-text-primary tabular-nums leading-none">
												{formatLapTime(lap.elapsedMicros)}
											</span>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="pt-3 pb-4 border-t border-white/5 flex items-center justify-center">
							<span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest">
								Waktu dihitung sejak match dimulai
							</span>
						</div>
					</div>

					{/* Answered Questions + Total Points (side by side) */}
					<div className="flex-1 flex flex-col justify-between rounded-2xl border border-white/5 bg-[#131315]/80 backdrop-blur-md p-6 shadow-xl relative overflow-hidden">
						<div className="flex items-center justify-between border-b border-white/5 pb-4">
							<div className="flex items-center gap-2">
								<Award
									className="text-status-success text-[18px]"
									size={18}
								/>
								<span className="text-xs font-label-mono-stat font-bold tracking-wider uppercase text-text-primary">
									PROGRES TIM
								</span>
							</div>
						</div>

						<div className="flex-1 flex items-center justify-center py-4">
							<div className="w-full grid grid-cols-2 items-center gap-4">
								<div className="flex flex-col items-center text-center">
									<span className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest">
										Soal Terjawab
									</span>
									<span className="flex items-baseline justify-center gap-1 mt-1">
										<span className="text-5xl sm:text-6xl xl:text-[56px] font-black text-white tracking-tight tabular-nums leading-none">
											{correctCount}
										</span>
									</span>
								</div>

								<div className="h-full border-l border-white/5 flex flex-col items-center text-center">
									<span className="inline-flex items-center gap-1.5 font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest">
										<Trophy size={12} className="text-status-warning" />
										Total Poin
									</span>
									<span className="flex items-baseline justify-center gap-1 mt-1">
										<span className="text-5xl sm:text-6xl xl:text-[56px] font-black text-white tracking-tight tabular-nums leading-none">
											{arenaTeam?.total_score ?? "--"}
										</span>
										<span className="text-base xl:text-lg font-label-mono-stat text-text-muted font-bold uppercase">
											PTS
										</span>
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
