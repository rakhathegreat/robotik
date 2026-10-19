import { useEffect, useRef } from "react";
import { playCountdownTick, stopMatchEndSound } from "@/lib/sound";

type StartCountdownProps = {
	/** Milliseconds left of the intro countdown (`useMatchState`); 0 once the clock is running. */
	countdownMs: number;
};

/**
 * Projector intro: 3 - 2 - 1 - MULAI! countdown overlay over the arena.
 * Pacing: exactly 1000ms each for 3, 2, 1 and 1000ms for "MULAI!" before the official match clock starts.
 */
export function StartCountdown({ countdownMs }: StartCountdownProps) {
	const lastPlayedRef = useRef<string | null>(null);

	// Determine current display stage (1.5s per stage: 3 -> 2 -> 1 -> MULAI!)
	let currentStage: "3" | "2" | "1" | "MULAI" | null = null;
	if (countdownMs > 4500) {
		currentStage = "3";
	} else if (countdownMs > 3000) {
		currentStage = "2";
	} else if (countdownMs > 1500) {
		currentStage = "1";
	} else if (countdownMs > 0) {
		currentStage = "MULAI";
	}

	useEffect(() => {
		if (currentStage === "3") {
			if (lastPlayedRef.current !== "3") {
				lastPlayedRef.current = "3";
				stopMatchEndSound();
				playCountdownTick(3);
			}
		} else if (currentStage === "2") {
			if (lastPlayedRef.current !== "2") {
				lastPlayedRef.current = "2";
				playCountdownTick(2);
			}
		} else if (currentStage === "1") {
			if (lastPlayedRef.current !== "1") {
				lastPlayedRef.current = "1";
				playCountdownTick(1);
			}
		} else if (currentStage === "MULAI") {
			if (lastPlayedRef.current !== "MULAI") {
				lastPlayedRef.current = "MULAI";
				playCountdownTick(0);
			}
		} else {
			lastPlayedRef.current = null;
		}
	}, [currentStage]);

	if (!currentStage) return null;

	const isGo = currentStage === "MULAI";

	return (
		<div
			className="absolute inset-0 z-40 flex items-center justify-center bg-surface-base/85 backdrop-blur-sm"
			aria-live="assertive">
			<span
				key={currentStage}
				className={
					isGo
						? "font-sans text-[110px] sm:text-[150px] md:text-[200px] xl:text-[240px] font-black tracking-tight leading-none text-white animate-in fade-in zoom-in-75 duration-300 select-none uppercase"
						: "font-label-mono-stat text-[220px] xl:text-[300px] font-black leading-none tracking-tighter tabular-nums text-text-primary animate-in fade-in zoom-in-75 duration-300 select-none"
				}>
				{isGo ? "MULAI!" : currentStage}
			</span>
		</div>
	);
}
