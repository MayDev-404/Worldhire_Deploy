-- Fix RLS policies for candidates table
-- This script ensures anonymous users (using anon key) can submit applications

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can submit applications" ON candidates;
DROP POLICY IF EXISTS "Public can submit applications" ON candidates;
DROP POLICY IF EXISTS "Anon can submit applications" ON candidates;
DROP POLICY IF EXISTS "Allow public inserts" ON candidates;
DROP POLICY IF EXISTS "Authenticated can submit applications" ON candidates;
DROP POLICY IF EXISTS "Authenticated users can view candidates" ON candidates;
DROP POLICY IF EXISTS "Authenticated users can update candidates" ON candidates;

-- Create policy to allow anyone to insert (no role restriction)
-- This allows both anonymous (anon) and authenticated users to submit
-- When using the anon key, Supabase uses the 'anon' role
CREATE POLICY "Allow public inserts" ON candidates
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all candidates (for recruiters)
CREATE POLICY "Authenticated users can view candidates" ON candidates
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update candidates (for recruiters)
CREATE POLICY "Authenticated users can update candidates" ON candidates
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Verify RLS is enabled
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

