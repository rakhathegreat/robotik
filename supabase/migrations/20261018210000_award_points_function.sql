-- Atomic score award. The console used to read total_score, add the points in JS and write
-- it back, which drops an increment if two awards race (two referee consoles, or a double
-- click that slips past the disabled button). Do the increment in a single statement.
--
-- SECURITY INVOKER (the plpgsql default) so the `participants` UPDATE RLS policy still
-- applies: only an admin/referee session can award points; for anyone else the UPDATE
-- matches no row and the function returns null.
CREATE OR REPLACE FUNCTION public.award_participant_points(p_participant_id uuid, p_points integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
    v_total integer;
BEGIN
    UPDATE public.participants
    SET total_score = COALESCE(total_score, 0) + p_points
    WHERE id = p_participant_id
    RETURNING total_score INTO v_total;

    RETURN v_total;
END;
$$;
