-- Migration script to remove education column and create educations table
-- Run this script in your Supabase SQL Editor

-- Step 1: Create educations table
CREATE TABLE IF NOT EXISTS educations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key to candidates table
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  
  -- Education fields
  degree TEXT NOT NULL,
  institute TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_year TEXT NOT NULL,
  
  -- Ordering field to maintain education order
  display_order INTEGER DEFAULT 0
);

-- Step 2: Create index on candidate_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_educations_candidate_id ON educations(candidate_id);

-- Step 3: Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_educations_display_order ON educations(candidate_id, display_order);

-- Step 4: Enable Row Level Security
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policy to allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit educations" ON educations
  FOR INSERT WITH CHECK (true);

-- Step 6: Create policy to allow authenticated users to read educations
CREATE POLICY "Authenticated users can view educations" ON educations
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 7: Create policy to allow authenticated users to update educations
CREATE POLICY "Authenticated users can update educations" ON educations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 8: Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_educations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_educations_updated_at ON educations;
CREATE TRIGGER update_educations_updated_at BEFORE UPDATE ON educations
    FOR EACH ROW EXECUTE FUNCTION update_educations_updated_at();

-- Step 9: Remove education column from candidates table (optional - uncomment if you want to remove it)
-- Note: This will delete existing education data. Make sure to backup if needed.
-- ALTER TABLE candidates DROP COLUMN IF EXISTS education;

-- If you want to keep the column but make it nullable for backward compatibility:
ALTER TABLE candidates ALTER COLUMN education DROP NOT NULL;

