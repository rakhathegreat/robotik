/**
 * Web Audio sound engine for the robotik counting mission arena.
 *
 * All arena audio (countdown beeps, correct answer chimes, and match end winner music)
 * is owned and played exclusively by PublicViewPage (the projector / arena sound system)
 * to ensure crisp, clean audio with zero duplicate echo.
 */

import winnerMusicUrl from "@/assets/music/winner 2.mp3";

const STORAGE_KEY = "robotik_arena_sound_muted";

let audioCtx: AudioContext | null = null;
let winnerAudio: HTMLAudioElement | null = null;
let lastMatchEndSoundTime = 0;
let lastCorrectSoundTime = 0;

const listeners = new Set<(muted: boolean) => void>();

/** Get or initialize the AudioContext */
export function getAudioContext(): AudioContext | null {
	if (typeof window === "undefined") return null;

	if (!audioCtx) {
		const AudioContextClass =
			window.AudioContext ||
			(window as unknown as { webkitAudioContext: typeof AudioContext })
				.webkitAudioContext;
		if (AudioContextClass) {
			audioCtx = new AudioContextClass();
		}
	}

	if (audioCtx && audioCtx.state === "suspended") {
		audioCtx.resume().catch(() => {});
	}

	return audioCtx;
}

/** Unlock audio on first user gesture */
if (typeof window !== "undefined") {
	const unlock = () => {
		if (audioCtx && audioCtx.state === "suspended") {
			audioCtx.resume().catch(() => {});
		}
	};
	window.addEventListener("click", unlock, { passive: true });
	window.addEventListener("keydown", unlock, { passive: true });
	window.addEventListener("touchstart", unlock, { passive: true });
}

function getWinnerAudio(): HTMLAudioElement | null {
	if (typeof window === "undefined") return null;
	if (!winnerAudio) {
		winnerAudio = new Audio(winnerMusicUrl);
		winnerAudio.preload = "auto";
	}
	return winnerAudio;
}

export function stopMatchEndSound(): void {
	if (winnerAudio) {
		winnerAudio.pause();
		winnerAudio.currentTime = 0;
	}
}

export function isSoundMuted(): boolean {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(STORAGE_KEY) === "true";
}

export function setSoundMuted(muted: boolean): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
	if (muted) {
		stopMatchEndSound();
	}
	listeners.forEach((cb) => cb(muted));
}

export function toggleSoundMuted(): boolean {
	const next = !isSoundMuted();
	setSoundMuted(next);
	if (!next) {
		playConfirmationChirp();
	}
	return next;
}

export function subscribeSoundMuted(cb: (muted: boolean) => void): () => void {
	listeners.add(cb);
	return () => {
		listeners.delete(cb);
	};
}

/** Subtle chirp when unmuting */
function playConfirmationChirp(): void {
	const ctx = getAudioContext();
	if (!ctx) return;
	try {
		const now = ctx.currentTime;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();

		osc.type = "sine";
		osc.frequency.setValueAtTime(880, now);
		osc.frequency.exponentialRampToValueAtTime(1320, now + 0.1);

		gain.gain.setValueAtTime(0.001, now);
		gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

		osc.connect(gain);
		gain.connect(ctx.destination);

		osc.start(now);
		osc.stop(now + 0.11);
	} catch (e) {
		console.error("Failed to play confirmation chirp:", e);
	}
}

/**
 * Play countdown sound effect:
 * - seconds = 3, 2, 1: crisp electronic beep (800 Hz)
 * - seconds = 0 (GO / MULAI!): higher harmonic energetic tone (1200 Hz + 1600 Hz)
 */
export function playCountdownTick(seconds: number): void {
	if (isSoundMuted()) return;

	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const now = ctx.currentTime;

		if (seconds > 0) {
			// Crisp 800Hz beep for 3, 2, 1
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "triangle";
			osc.frequency.setValueAtTime(800, now);

			gain.gain.setValueAtTime(0.001, now);
			gain.gain.linearRampToValueAtTime(0.35, now + 0.015);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now);
			osc.stop(now + 0.15);
		} else {
			// Energetic GO! chord tone for 0
			const osc1 = ctx.createOscillator();
			const osc2 = ctx.createOscillator();
			const gain = ctx.createGain();

			osc1.type = "sine";
			osc1.frequency.setValueAtTime(1200, now);

			osc2.type = "sine";
			osc2.frequency.setValueAtTime(1600, now);

			gain.gain.setValueAtTime(0.001, now);
			gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
			gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

			osc1.connect(gain);
			osc2.connect(gain);
			gain.connect(ctx.destination);

			osc1.start(now);
			osc2.start(now);
			osc1.stop(now + 0.46);
			osc2.stop(now + 0.46);
		}
	} catch (e) {
		console.error("Failed to play countdown tick:", e);
	}
}

/**
 * Play authentic sports arena horn / buzzer for match end (synthesizer fallback).
 */
export function playSynthesizedBuzzer(): void {
	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const now = ctx.currentTime;
		const osc1 = ctx.createOscillator();
		const osc2 = ctx.createOscillator();
		const osc3 = ctx.createOscillator();
		const filter = ctx.createBiquadFilter();
		const masterGain = ctx.createGain();

		osc1.type = "sawtooth";
		osc1.frequency.setValueAtTime(165, now);

		osc2.type = "sawtooth";
		osc2.frequency.setValueAtTime(168, now);

		osc3.type = "square";
		osc3.frequency.setValueAtTime(330, now);
		const osc3Gain = ctx.createGain();
		osc3Gain.gain.setValueAtTime(0.18, now);
		osc3.connect(osc3Gain);
		osc3Gain.connect(filter);

		filter.type = "lowpass";
		filter.frequency.setValueAtTime(1400, now);
		filter.Q.setValueAtTime(2.2, now);

		masterGain.gain.setValueAtTime(0.001, now);
		masterGain.gain.linearRampToValueAtTime(0.45, now + 0.025);
		masterGain.gain.setValueAtTime(0.45, now + 1.0);
		masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

		osc1.connect(filter);
		osc2.connect(filter);
		filter.connect(masterGain);
		masterGain.connect(ctx.destination);

		osc1.start(now);
		osc2.start(now);
		osc3.start(now);

		osc1.stop(now + 1.26);
		osc2.stop(now + 1.26);
		osc3.stop(now + 1.26);
	} catch (e) {
		console.error("Failed to play synthesized buzzer:", e);
	}
}

/**
 * Play winner victory music for match end using `src/assets/music/winner 2.mp3`.
 * Falls back to synthesized buzzer if audio element cannot be played.
 */
export function playMatchEndSound(): void {
	if (isSoundMuted()) return;

	// Debounce to prevent duplicate playback within 3 seconds
	if (Date.now() - lastMatchEndSoundTime < 3000) {
		return;
	}
	lastMatchEndSoundTime = Date.now();

	try {
		const audio = getWinnerAudio();
		if (audio) {
			audio.currentTime = 0;
			const playPromise = audio.play();
			if (playPromise !== undefined) {
				playPromise.catch((err) => {
					console.warn(
						"winner 2.mp3 audio playback failed, falling back to buzzer:",
						err
					);
					playSynthesizedBuzzer();
				});
			}
		} else {
			playSynthesizedBuzzer();
		}
	} catch (e) {
		console.error("Failed to play winner audio:", e);
		playSynthesizedBuzzer();
	}
}

/**
 * Play an upbeat, celebratory chime for correct answers.
 * Ascending bright chime (E5 -> B5 -> E6) with bell-like exponential decay.
 */
export function playCorrectAnswerSound(): void {
	if (isSoundMuted()) return;

	// Debounce to prevent double-play within 350ms
	if (Date.now() - lastCorrectSoundTime < 350) {
		return;
	}
	lastCorrectSoundTime = Date.now();

	const ctx = getAudioContext();
	if (!ctx) return;

	try {
		const now = ctx.currentTime;
		const notes = [
			{ freq: 659.25, time: 0, dur: 0.18 }, // E5
			{ freq: 987.77, time: 0.08, dur: 0.22 }, // B5
			{ freq: 1318.51, time: 0.16, dur: 0.45 }, // E6
		];

		notes.forEach(({ freq, time, dur }) => {
			const osc = ctx.createOscillator();
			const gain = ctx.createGain();

			osc.type = "sine";
			osc.frequency.setValueAtTime(freq, now + time);

			gain.gain.setValueAtTime(0.001, now + time);
			gain.gain.linearRampToValueAtTime(0.3, now + time + 0.01);
			gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

			osc.connect(gain);
			gain.connect(ctx.destination);

			osc.start(now + time);
			osc.stop(now + time + dur + 0.01);
		});
	} catch (e) {
		console.error("Failed to play correct answer sound:", e);
	}
}
