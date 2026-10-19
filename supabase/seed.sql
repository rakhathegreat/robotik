-- Seed data for participants
INSERT INTO participants (name, school, total_score) VALUES
('Team Alpha', 'SD Bina Prestasi', 120),
('Team Beta', 'SDIT Nurul Fikri', 95),
('Team Gamma', 'SD Taruna Bangsa', 140),
('Team Delta', 'SDK Santa Maria', 80);

-- Seed data for questions
INSERT INTO questions (equation, answer, difficulty_level) VALUES
('63 - 28 = ?', '35', 1),
('12 * 8 = ?', '96', 2),
('144 / 12 = ?', '12', 2),
('25 + 47 = ?', '72', 1),
('15 * 15 = ?', '225', 3);

-- Update match_state with a question
UPDATE match_state SET current_question_id = (SELECT id FROM questions LIMIT 1) WHERE id = 1;

-- Seed match finish records for the initial leaderboard classement
INSERT INTO audit_logs (action, description, participant_id, created_at)
SELECT 
    'match_finished',
    'Match selesai oleh ' || name || ' (durasi ' || dur || ')',
    id,
    now() - interval '10 minutes'
FROM (
    VALUES 
    ('Team Gamma', '02:45.120'),
    ('Team Alpha', '03:12.450'),
    ('Team Beta', '03:30.890'),
    ('Team Delta', '04:15.000')
) AS v(team_name, dur)
JOIN participants ON participants.name = v.team_name;

-- Dev operator accounts (local only). RLS requires a profiles row for every write,
-- so insert into auth.users + auth.identities and let the trigger create the profile.
-- admin@arena.local / arena-admin-2026   (admin)
-- referee@arena.local / arena-referee-2026 (referee)
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    confirmed_at, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token, email_change,
    raw_app_meta_data, raw_user_meta_data
)
VALUES
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-4000-8000-000000000001',
    'authenticated', 'authenticated',
    'admin@arena.local',
    crypt('arena-admin-2026', gen_salt('bf')),
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{}'
),
(
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-4000-8000-000000000002',
    'authenticated', 'authenticated',
    'referee@arena.local',
    crypt('arena-referee-2026', gen_salt('bf')),
    now(), now(), now(),
    '', '', '', '',
    '{"provider":"email","providers":["email"]}',
    '{}'
)
ON CONFLICT (id) DO NOTHING;

UPDATE profiles SET role = 'admin' WHERE id = 'a0000000-0000-4000-8000-000000000001';
UPDATE profiles SET role = 'referee' WHERE id = 'a0000000-0000-4000-8000-000000000002';
