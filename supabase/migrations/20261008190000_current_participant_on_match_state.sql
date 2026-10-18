-- The referee console is opened per team; the projector display has no URL parameter, so
-- the team currently in the arena is published on the match_state singleton row.
ALTER TABLE match_state ADD COLUMN current_participant_id UUID REFERENCES participants(id) ON DELETE SET NULL;