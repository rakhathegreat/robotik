type StartCountdownProps = {
	/** Milliseconds left of the intro countdown (`useMatchState`); 0 once the clock is running. */
	countdownMs: number;
};

/**
 * Projector intro: bare 3-2-1 digits over the arena while a start is still pending. The console
 * parks `timer_started_at` a few seconds ahead of now, so the digits end exactly when the clock
 * begins counting — this component owns no timer of its own and needs no extra signal.
 */
export function StartCountdown({ countdownMs }: StartCountdownProps) {
	if (countdownMs <= 0) return null;

	const seconds = Math.ceil(countdownMs / 1000);

	return (
		<div
			className="absolute inset-0 z-40 flex items-center justify-center bg-surface-base/85 backdrop-blur-sm"
			aria-live="assertive">
			<span
				key={seconds}
				className="font-label-mono-stat text-[220px] xl:text-[300px] font-black leading-none tracking-tighter tabular-nums text-text-primary animate-in fade-in zoom-in-75 duration-500">
				{seconds}
			</span>
		</div>
	);
}
