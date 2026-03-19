-- =============================================================================
-- ALTERATIONS ONLY - For existing DBs that already have tables from older scripts
-- Run this if you already have: users, refresh_tokens, candidates, work_experiences,
-- educations, and storage buckets, and only need to add user_id + RLS updates.
-- =============================================================================

-- Add user_id to candidates if missing
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);
COMMENT ON COLUMN candidates.user_id IS 'Foreign key to users table - links candidate profile to user account';

-- Backfill: link existing candidates to users by email
UPDATE candidates c
SET user_id = u.id
FROM users u
WHERE c.email = u.email
AND c.user_id IS NULL;

-- RLS: allow candidates to view/update their own profile (when using Supabase Auth)
DROP POLICY IF EXISTS "Users can view own candidate profile" ON candidates;
CREATE POLICY "Users can view own candidate profile" ON candidates
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own candidate profile" ON candidates;
CREATE POLICY "Users can update own candidate profile" ON candidates
  FOR UPDATE
  USING (auth.uid() = user_id);
