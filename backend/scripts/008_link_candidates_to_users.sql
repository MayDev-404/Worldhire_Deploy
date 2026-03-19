-- Link candidates table to users table
-- This migration adds user_id foreign key to link candidate profiles to user accounts
-- Run this script in your Supabase SQL Editor

-- Add user_id column to candidates table
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_candidates_user_id ON candidates(user_id);

-- Migrate existing candidates to link by email (one-time migration)
-- This links existing candidates to users if they have matching emails
UPDATE candidates c
SET user_id = u.id
FROM users u
WHERE c.email = u.email
AND c.user_id IS NULL;

-- Update RLS policy to allow users to view their own candidate profile
DROP POLICY IF EXISTS "Users can view own candidate profile" ON candidates;
CREATE POLICY "Users can view own candidate profile" ON candidates
    FOR SELECT
    USING (auth.uid() = user_id);

-- Update RLS policy to allow users to update their own candidate profile
DROP POLICY IF EXISTS "Users can update own candidate profile" ON candidates;
CREATE POLICY "Users can update own candidate profile" ON candidates
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Note: The existing "Anyone can submit applications" policy still allows
-- unauthenticated submissions, but authenticated users will be linked via user_id

