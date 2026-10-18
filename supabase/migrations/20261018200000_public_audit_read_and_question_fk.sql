-- Two corrections that the arena display depends on:
--
-- 1) The login-free projector (/public-view) derives "soal terjawab" from the
--    arena-wide no-repeat trail in audit_logs. RLS only let admin/referee SELECT
--    it, so the anon session always read zero rows and the counter stayed at 0.
--    Expose the trail publicly, consistent with participants/questions/match_state.
CREATE POLICY "Public read access for audit logs" ON audit_logs FOR SELECT USING (true);

-- 2) match_state.current_question_id referenced questions(id) with the default
--    NO ACTION, so deleting the question currently on screen failed with a
--    foreign-key error instead of clearing the arena. Null it out on delete.
ALTER TABLE match_state DROP CONSTRAINT match_state_current_question_id_fkey;
ALTER TABLE match_state
    ADD CONSTRAINT match_state_current_question_id_fkey
    FOREIGN KEY (current_question_id) REFERENCES questions(id) ON DELETE SET NULL;
