import { supabase } from "@/lib/supabase"

/**
 * Scoring rule: every question is worth the same. Kept in one place because it is
 * displayed in three places (match control button, audit log badge, arena display).
 */
export const CORRECT_POINTS = 10

/**
 * Atomically add points to a participant and return the new total.
 *
 * PostgREST cannot express `total_score = total_score + n`, so the award lives in the
 * `award_participant_points` SQL function (see the migration of the same name) and is
 * invoked here. This replaces a client-side read-then-write, which dropped an increment
 * when two awards raced.
 *
 * `Database["public"]["Functions"]` is still empty in `src/types/supabase.ts`; re-run
 * `npx supabase gen types typescript --local` after this migration and the cast below can
 * be replaced with a direct `supabase.rpc("award_participant_points", ...)` call.
 */
const awardPointsRpc = supabase.rpc.bind(supabase) as unknown as (
  fn: string,
  args: Record<string, unknown>
) => Promise<{ data: number | null; error: { message: string } | null }>

export function awardPoints(participantId: string, points: number) {
  return awardPointsRpc("award_participant_points", {
    p_participant_id: participantId,
    p_points: points,
  })
}
