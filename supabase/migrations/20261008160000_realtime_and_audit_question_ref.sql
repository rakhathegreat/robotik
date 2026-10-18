-- Realtime: publish the tables the frontend already subscribes to.
-- Only match_state was in the publication, so participants/questions/audit_logs
-- subscriptions never fired.
ALTER PUBLICATION supabase_realtime ADD TABLE participants, questions, audit_logs;

-- Link audit entries to the question they refer to so answered-question
-- telemetry and the arena counter can be derived without a match table.
ALTER TABLE audit_logs ADD COLUMN question_id UUID REFERENCES questions(id) ON DELETE SET NULL;

CREATE INDEX audit_logs_question_id_idx ON audit_logs (question_id);