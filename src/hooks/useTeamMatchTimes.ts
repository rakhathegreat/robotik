import { useMemo, useSyncExternalStore } from "react";
import { supabase } from "@/lib/supabase";
import { createQueryStore } from "@/lib/queryStore";
import { AUDIT } from "@/lib/auditLog";

export type ParticipantMatchTime = {
	participantId: string;
	formattedDuration: string; // e.g. "02:45"
	durationMs: number; // e.g. 165000
	finishedAt: string;
};

type AuditTimeRow = {
	action: string;
	created_at: string;
	description: string | null;
	participant_id: string | null;
};

const DURATION_REGEX = /durasi\s+([\d:]+(?:\.\d+)?)/i;

function parseDurationMs(durationStr: string): number {
	const parts = durationStr.split(":");
	if (parts.length === 2) {
		const minutes = parseInt(parts[0], 10) || 0;
		const seconds = parseFloat(parts[1]) || 0;
		return Math.round((minutes * 60 + seconds) * 1000);
	}
	const numeric = parseFloat(durationStr);
	return isNaN(numeric) ? 0 : Math.round(numeric * 1000);
}

export function formatDurationMs(ms: number): string {
	const safe = Math.max(0, ms);
	const totalSeconds = Math.floor(safe / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const millis = safe % 1000;
	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

/**
 * Shared query store for match finishes and resets across all participants.
 * Listens to realtime changes on `audit_logs` table.
 */
const store = createQueryStore<AuditTimeRow[]>(
	[],
	async () => {
		const { data, error } = await supabase
			.from("audit_logs")
			.select("action, created_at, description, participant_id")
			.in("action", [AUDIT.matchFinished, AUDIT.matchReset])
			.not("participant_id", "is", null)
			.order("created_at", { ascending: true });

		return {
			data: (data ?? []) as AuditTimeRow[],
			error: error?.message ?? null,
		};
	},
	"audit_logs",
);

export function useTeamMatchTimes() {
	const {
		data: rows,
		loading,
		error,
	} = useSyncExternalStore(store.subscribe, store.getSnapshot);

	const matchTimesByParticipant = useMemo(() => {
		const map = new Map<string, ParticipantMatchTime>();

		for (const row of rows) {
			if (!row.participant_id) continue;

			if (row.action === AUDIT.matchReset) {
				// A reset wipes any previous match finish for this team
				map.delete(row.participant_id);
				continue;
			}

			if (row.action === AUDIT.matchFinished) {
				const desc = row.description ?? "";
				const match = DURATION_REGEX.exec(desc);
				const rawDur = match ? match[1] : "00:00";
				const durationMs = parseDurationMs(rawDur);
				const formattedDuration = formatDurationMs(durationMs);

				map.set(row.participant_id, {
					participantId: row.participant_id,
					formattedDuration,
					durationMs,
					finishedAt: row.created_at,
				});
			}
		}

		return map;
	}, [rows]);

	return {
		matchTimesByParticipant,
		loading,
		error,
		refresh: store.refresh,
	};
}
