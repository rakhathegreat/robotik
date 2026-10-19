import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Timer, Trophy } from "lucide-react";
import { useParticipants, type Participant } from "@/hooks/useParticipants";
import { useLastFinish } from "@/hooks/useLastFinish";
import {
	useTeamMatchTimes,
	type ParticipantMatchTime,
} from "@/hooks/useTeamMatchTimes";
import { toEpochMicros } from "@/lib/lapTime";
import { Podium } from "@/pages/LeaderboardPage/Podium";
import { StandingsTable } from "@/pages/LeaderboardPage/StandingsTable";

/**
 * How long the "match selesai" banner and the finished team's highlight stay up after a run
 * ends. Past this window the board is a plain classement again — the projector may sit on it
 * for the whole break between two matches.
 */
const REVEAL_MS = 12_000;

/** Only teams that have played (status done or scored points) enter the leaderboard. */
function hasMatched(p: Participant): boolean {
	return p.status === "done" || (p.total_score ?? 0) > 0;
}

/** Ranking is score first, then duration (faster is better), then name. */
function rankTeams(
	participants: Participant[],
	matchTimes: Map<string, ParticipantMatchTime>,
): Participant[] {
	return participants.filter(hasMatched).sort((a, b) => {
		const scoreDiff = (b.total_score ?? 0) - (a.total_score ?? 0);
		if (scoreDiff !== 0) return scoreDiff;

		const timeA = matchTimes.get(a.id)?.durationMs ?? Number.POSITIVE_INFINITY;
		const timeB = matchTimes.get(b.id)?.durationMs ?? Number.POSITIVE_INFINITY;
		if (timeA !== timeB) return timeA - timeB;

		return a.name.localeCompare(b.name);
	});
}

/**
 * Default projector screen: the live classement. Shows only teams that have already matched,
 * matching the admin leaderboard design (Podium for Top 3 and Standings Table for rank 4+),
 * with the team that just finished called out and highlighted.
 */
export function LeaderboardView() {
	const { participants } = useParticipants();
	const lastFinish = useLastFinish();
	const { matchTimesByParticipant } = useTeamMatchTimes();

	const ranked = useMemo(
		() => rankTeams(participants, matchTimesByParticipant),
		[participants, matchTimesByParticipant],
	);

	// The reveal is a window, not a flag: it is true for `REVEAL_MS` after the newest finish and
	// the timeout below re-renders once when the window closes.
	const finishedMicros = lastFinish
		? toEpochMicros(lastFinish.createdAt)
		: null;
	const [now, setNow] = useState(() => Date.now());
	const isRevealing =
		finishedMicros !== null && now * 1000 - finishedMicros < REVEAL_MS * 1000;

	useEffect(() => {
		if (finishedMicros === null) return;

		const remainingMs =
			Math.round(finishedMicros / 1000) + REVEAL_MS - Date.now();
		if (remainingMs <= 0) return;

		const timeout = setTimeout(() => setNow(Date.now()), remainingMs + 50);
		return () => clearTimeout(timeout);
	}, [finishedMicros]);

	const finishedIndex = isRevealing
		? ranked.findIndex((team) => team.id === lastFinish?.participantId)
		: -1;
	const finishedTeam = finishedIndex >= 0 ? ranked[finishedIndex] : null;
	const finishedTime = finishedTeam
		? matchTimesByParticipant.get(finishedTeam.id)
		: null;

	const top3 = ranked.slice(0, 3);
	const rest = ranked.slice(3);

	return (
		<main className="w-full h-full flex flex-col gap-4 lg:gap-6 p-4 md:p-6 lg:p-8 bg-surface-base overflow-y-auto">
			<div className="w-full max-w-[1720px] mx-auto flex flex-col gap-6 min-h-0">
				{finishedTeam && (
					<div className="animate-in fade-in slide-in-from-top-2 duration-500 flex items-center gap-4 rounded-2xl border border-status-success/30 bg-status-success/[0.07] px-5 py-3.5 shadow-lg flex-wrap sm:flex-nowrap">
						<div className="w-10 h-10 shrink-0 rounded-lg bg-status-success/15 border border-status-success/30 flex items-center justify-center">
							<BadgeCheck size={20} className="text-status-success" />
						</div>
						<div className="min-w-0 flex-1">
							<span className="block font-label-mono-stat text-[10px] font-bold uppercase tracking-[0.25em] text-status-success">
								Match Selesai
							</span>
							<p className="truncate text-lg xl:text-xl font-bold text-text-primary tracking-tight">
								{finishedTeam.name}
							</p>
							<p className="text-xs text-text-muted truncate">
								{finishedTeam.school}
							</p>
						</div>
						<div className="flex items-center gap-5 sm:gap-6 shrink-0">
							<div className="text-center">
								<span className="font-label-mono-stat text-xl xl:text-2xl font-bold tabular-nums text-text-primary">
									{finishedTime?.formattedDuration ?? "—"}
								</span>
							</div>
							<div className="text-center">
								<span className="block font-label-mono-stat text-[10px] uppercase tracking-widest text-text-muted">
									Total Skor
								</span>
								<span className="font-label-mono-stat text-xl xl:text-2xl font-bold tabular-nums text-amber-300">
									{finishedTeam.total_score ?? 0}{" "}
									<span className="text-xs uppercase text-text-muted">PTS</span>
								</span>
							</div>
							<div className="text-right pl-3 border-l border-status-success/20">
								<span className="block font-label-mono-stat text-[10px] uppercase tracking-widest text-text-muted">
									Peringkat
								</span>
								<span className="font-label-mono-stat text-2xl xl:text-3xl font-black tabular-nums leading-none text-status-success">
									#{finishedIndex + 1}
								</span>
							</div>
						</div>
					</div>
				)}

				{ranked.length === 0 ? (
					<div className="flex-1 min-h-[320px] flex flex-col items-center justify-center gap-3">
						<Trophy size={48} className="text-text-muted/30" />
						<p className="font-label-mono-stat text-sm uppercase tracking-[0.25em] text-text-muted">
							Belum ada tim yang bertanding
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-6">
						<Podium
							data={top3}
							finishedId={isRevealing ? finishedTeam?.id : null}
							matchTimes={matchTimesByParticipant}
						/>
						{rest.length > 0 && (
							<StandingsTable
								data={rest}
								finishedId={isRevealing ? finishedTeam?.id : null}
								matchTimes={matchTimesByParticipant}
								autoPageIntervalMs={10000}
								rankOffset={4}
							/>
						)}
					</div>
				)}
			</div>
		</main>
	);
}
