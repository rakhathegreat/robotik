import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { useMatchState } from "@/hooks/useMatchState";
import { ArenaView } from "./ArenaView";
import { LeaderboardView } from "./LeaderboardView";
import { StartCountdown } from "./StartCountdown";

/**
 * Login-free projector display. The classement is the resting screen: it is what the audience
 * sees before the first match, between two matches, and right after a run ends (where the
 * classement reveals itself row by row around the team that just finished). The arena view only
 * takes over while a match is actually on — RUNNING or PAUSED — which is also the moment the
 * referee presses "Mulai Match" and the 3-2-1 intro plays.
 */
export function PublicViewPage() {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const { matchState, countdownMs } = useMatchState();

	const toggleFullscreen = async () => {
		try {
			if (!document.fullscreenElement) {
				await document.documentElement.requestFullscreen();
			} else {
				await document.exitFullscreen();
			}
		} catch (err) {
			// Fullscreen needs a user gesture and is unavailable in some embeds; ignore.
			console.error("Fullscreen toggle failed:", err);
		}
	};

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () =>
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
	}, []);

	const isMatchOn = Boolean(matchState?.current_participant_id);

	return (
		<div className="bg-surface-base font-sans text-on-surface select-none antialiased h-screen w-screen flex flex-col overflow-hidden relative group">
			<button
				onClick={toggleFullscreen}
				className="absolute top-6 right-6 z-50 p-2.5 rounded-lg bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-all opacity-0 group-hover:opacity-100 shadow-sm"
				title="Toggle Fullscreen">
				{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
			</button>

			<StartCountdown countdownMs={countdownMs} />

			{/* `matchState === null` is only the first fetch; showing neither screen avoids a
			    classement flash on a page opened in the middle of a match. */}
			{matchState === null ? null : isMatchOn ? <ArenaView /> : <LeaderboardView />}
		</div>
	);
}
