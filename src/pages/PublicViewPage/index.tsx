import { useState, useEffect, useRef } from "react";
import { Maximize, Minimize, Volume2, VolumeX } from "lucide-react";
import { useMatchState } from "@/hooks/useMatchState";
import { useLastFinish } from "@/hooks/useLastFinish";
import {
	isSoundMuted,
	toggleSoundMuted,
	subscribeSoundMuted,
	playMatchEndSound,
} from "@/lib/sound";
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
	const [isMuted, setIsMuted] = useState(isSoundMuted);
	const { matchState, countdownMs } = useMatchState();
	const lastFinish = useLastFinish();
	const prevFinishRef = useRef<string | null>(null);

	// Subscribe to sound muted state changes
	useEffect(() => {
		return subscribeSoundMuted(setIsMuted);
	}, []);

	// Play arena buzzer when a match finishes
	useEffect(() => {
		if (!lastFinish) return;
		const finishTime = new Date(lastFinish.createdAt).getTime();
		const isRecent = Math.abs(Date.now() - finishTime) < 5000;

		// Only play if this is a newly observed finish while this page is open,
		// and it happened within the last 5 seconds (not on initial mount of an old match).
		if (prevFinishRef.current && prevFinishRef.current !== lastFinish.createdAt && isRecent) {
			playMatchEndSound();
		}
		prevFinishRef.current = lastFinish.createdAt;
	}, [lastFinish]);

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

	const handleToggleSound = () => {
		setIsMuted(toggleSoundMuted());
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
			<div className="absolute top-6 right-6 z-50 flex items-center gap-2 opacity-30 hover:opacity-100 group-hover:opacity-100 transition-opacity">
				<button
					onClick={handleToggleSound}
					className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-all shadow-sm cursor-pointer"
					title={isMuted ? "Aktifkan Suara Arena" : "Bisukan Suara Arena"}>
					{isMuted ? (
						<VolumeX size={20} className="text-status-warning" />
					) : (
						<Volume2 size={20} />
					)}
				</button>
				<button
					onClick={toggleFullscreen}
					className="p-2.5 rounded-lg bg-surface-raised border border-border-subtle text-text-muted hover:text-text-primary hover:border-border-strong transition-all shadow-sm cursor-pointer"
					title="Toggle Fullscreen">
					{isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
				</button>
			</div>

			<StartCountdown countdownMs={countdownMs} />

			{/* `matchState === null` is only the first fetch; showing neither screen avoids a
			    classement flash on a page opened in the middle of a match. */}
			{matchState === null ? null : isMatchOn ? <ArenaView /> : <LeaderboardView />}
		</div>
	);
}
