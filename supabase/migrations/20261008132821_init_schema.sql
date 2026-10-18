-- Create custom types
CREATE TYPE role_type AS ENUM ('admin', 'referee');
CREATE TYPE timer_status_type AS ENUM ('IDLE', 'RUNNING', 'PAUSED');

-- Profiles/Roles table extending auth.users
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role role_type NOT NULL DEFAULT 'referee',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Participants table
CREATE TABLE participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    total_score INTEGER DEFAULT 0 NOT NULL,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions table
CREATE TABLE questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    equation TEXT NOT NULL,
    answer TEXT NOT NULL,
    difficulty_level INTEGER DEFAULT 1 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Match State Singleton Table
CREATE TABLE match_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_question_id UUID REFERENCES questions(id),
    timer_status timer_status_type DEFAULT 'IDLE' NOT NULL,
    timer_started_at TIMESTAMP WITH TIME ZONE,
    base_duration_ms BIGINT DEFAULT 300000 NOT NULL, -- 5 minutes by default
    remaining_ms_at_pause BIGINT DEFAULT 300000 NOT NULL
);

-- Audit Logs table
CREATE TABLE audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert the single row for match_state
INSERT INTO match_state (id) VALUES (1);


-- RLS Configuration
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);

-- 2. Participants: Anyone (even anon) can read, only admin/referee can write
CREATE POLICY "Public read access for participants" ON participants FOR SELECT USING (true);
CREATE POLICY "Admin/Referee can insert participants" ON participants FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);
CREATE POLICY "Admin/Referee can update participants" ON participants FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);
CREATE POLICY "Admin can delete participants" ON participants FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- 3. Questions: Public read access for questions (so frontend can show them), admin/referee can write
CREATE POLICY "Public read access for questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Admin/Referee can write questions" ON questions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);

-- 4. Match State: Public read, admin/referee write
CREATE POLICY "Public read access for match_state" ON match_state FOR SELECT USING (true);
CREATE POLICY "Admin/Referee can update match_state" ON match_state FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);

-- 5. Audit Logs: Admin/referee can read/write
CREATE POLICY "Admin/Referee can read audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);
CREATE POLICY "Admin/Referee can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'referee'))
);

-- Realtime Setup
-- Enable realtime for match_state to allow broadcasting
ALTER PUBLICATION supabase_realtime ADD TABLE match_state;
