-- =============================================================================
-- FULL DATABASE SCHEMA - Idempotent (safe to run on empty or existing DB)
-- Run this entire script in Supabase SQL Editor to set up the fullstack app.
-- Order: users → refresh_tokens → candidates → work_experiences → educations
--        → storage buckets → RLS fixes → candidates.user_id link
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS (auth)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Service role full access" ON users;
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 2. REFRESH TOKENS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    device_info VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role full access" ON refresh_tokens;
CREATE POLICY "Service role full access" ON refresh_tokens FOR ALL USING (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens
    WHERE expires_at < NOW() OR revoked = TRUE;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. CANDIDATES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  current_location TEXT NOT NULL,
  current_salary_currency TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  nationality TEXT NOT NULL,
  gender TEXT NOT NULL,
  cv_url TEXT,
  photograph_url TEXT,
  seniority_level TEXT,
  reporting_manager TEXT,
  preferred_location TEXT NOT NULL,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL,
  work_history TEXT NOT NULL,
  education TEXT NOT NULL,
  expected_salary_currency TEXT NOT NULL,
  expected_salary_range TEXT NOT NULL,
  linkedin_profile TEXT,
  portfolio TEXT,
  preferred_role TEXT,
  work_permit_status TEXT DEFAULT 'Nationality basis',
  employment_type TEXT DEFAULT 'Permanent',
  work_mode TEXT NOT NULL DEFAULT 'Hybrid',
  "references" TEXT,
  notice_period TEXT NOT NULL,
  actively_seeking_toggle TEXT NOT NULL DEFAULT 'Passive',
  application_status TEXT DEFAULT 'submitted',
  profile_completion_percentage INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(application_status);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -----------------------------------------------------------------------------
-- 4. WORK EXPERIENCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_month TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_month TEXT,
  end_year TEXT,
  description TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_work_experiences_candidate_id ON work_experiences(candidate_id);
CREATE INDEX IF NOT EXISTS idx_work_experiences_display_order ON work_experiences(candidate_id, display_order);
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit work experiences" ON work_experiences;
CREATE POLICY "Anyone can submit work experiences" ON work_experiences FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view work experiences" ON work_experiences;
CREATE POLICY "Authenticated users can view work experiences" ON work_experiences FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update work experiences" ON work_experiences;
CREATE POLICY "Authenticated users can update work experiences" ON work_experiences FOR UPDATE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_work_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_work_experiences_updated_at ON work_experiences;
CREATE TRIGGER update_work_experiences_updated_at BEFORE UPDATE ON work_experiences
    FOR EACH ROW EXECUTE FUNCTION update_work_experiences_updated_at();

-- Make work_history nullable (after work_experiences exists)
ALTER TABLE candidates ALTER COLUMN work_history DROP NOT NULL;

-- -----------------------------------------------------------------------------
-- 5. EDUCATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  institute TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_year TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_educations_candidate_id ON educations(candidate_id);
CREATE INDEX IF NOT EXISTS idx_educations_display_order ON educations(candidate_id, display_order);
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit educations" ON educations;
CREATE POLICY "Anyone can submit educations" ON educations FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Authenticated users can view educations" ON educations;
CREATE POLICY "Authenticated users can view educations" ON educations FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "Authenticated users can update educations" ON educations;
CREATE POLICY "Authenticated users can update educations" ON educations FOR UPDATE USING (auth.role() = 'authenticated');

CREATE OR REPLACE FUNCTION update_educations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS update_educations_updated_at ON educations;
CREATE TRIGGER update_educations_updated_at BEFORE UPDATE ON educations
    FOR EACH ROW EXECUTE FUNCTION update_educations_updated_at();

ALTER TABLE candidates ALTER COLUMN education DROP NOT NULL;

-- -----------------------------------------------------------------------------
-- 6. STORAGE BUCKETS (Supabase Storage)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('candidate-cvs', 'candidate-cvs', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('candidate-photos', 'candidate-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view CVs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;

CREATE POLICY "Anyone can upload CVs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'candidate-cvs');
CREATE POLICY "Authenticated users can view CVs" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-cvs' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can upload photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'candidate-photos');
CREATE POLICY "Public can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'candidate-photos');

-- -----------------------------------------------------------------------------
-- 7. CANDIDATES RLS (allow anon insert, authenticated read/update)
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can submit applications" ON candidates;
DROP POLICY IF EXISTS "Public can submit applications" ON candidates;
DROP POLICY IF EXISTS "Anon can submit applications" ON candidates;
DROP POLICY IF EXISTS "Allow public inserts" ON candidates;
DROP POLICY IF EXISTS "Authenticated can submit applications" ON candidates;
DROP POLICY IF EXISTS "Authenticated users can view candidates" ON candidates;
DROP POLICY IF EXISTS "Authenticated users can update candidates" ON candidates;

CREATE POLICY "Allow public inserts" ON candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view candidates" ON candidates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can update candidates" ON candidates FOR UPDATE TO authenticated USING (true);
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 8. LINK CANDIDATES TO USERS (user_id, backfill, RLS for own profile)
-- -----------------------------------------------------------------------------
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
COMMENT ON COLUMN candidates.user_id IS 'Foreign key to users table - links candidate profile to user account';

UPDATE candidates c
SET user_id = u.id
FROM users u
WHERE c.email = u.email
AND c.user_id IS NULL;

DROP POLICY IF EXISTS "Users can view own candidate profile" ON candidates;
CREATE POLICY "Users can view own candidate profile" ON candidates
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own candidate profile" ON candidates;
CREATE POLICY "Users can update own candidate profile" ON candidates
  FOR UPDATE
  USING (auth.uid() = user_id);

-- =============================================================================
-- END FULL SCHEMA
-- =============================================================================
