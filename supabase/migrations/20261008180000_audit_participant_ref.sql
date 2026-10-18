-- Per-team answer trail. Without this, audit rows only carried the team name in a text
-- description, so telemetry and the arena counter could not tell teams apart.
ALTER TABLE audit_logs ADD COLUMN participant_id UUID REFERENCES participants(id) ON DELETE CASCADE;

CREATE INDEX audit_logs_participant_id_idx ON audit_logs (participant_id);