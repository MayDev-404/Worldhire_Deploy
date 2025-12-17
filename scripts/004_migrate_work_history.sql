-- Migration script to remove work_history column and create work_experiences table
-- Run this script in your Supabase SQL Editor

-- Step 1: Create work_experiences table
CREATE TABLE IF NOT EXISTS work_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key to candidates table
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  
  -- Work experience fields
  company_name TEXT NOT NULL,
  role TEXT NOT NULL,
  start_month TEXT NOT NULL,
  start_year TEXT NOT NULL,
  end_month TEXT,
  end_year TEXT,
  description TEXT,
  is_current BOOLEAN DEFAULT FALSE,
  
  -- Ordering field to maintain experience order
  display_order INTEGER DEFAULT 0
);

-- Step 2: Create index on candidate_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_work_experiences_candidate_id ON work_experiences(candidate_id);

-- Step 3: Create index on display_order for sorting
CREATE INDEX IF NOT EXISTS idx_work_experiences_display_order ON work_experiences(candidate_id, display_order);

-- Step 4: Enable Row Level Security
ALTER TABLE work_experiences ENABLE ROW LEVEL SECURITY;

-- Step 5: Create policy to allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit work experiences" ON work_experiences
  FOR INSERT WITH CHECK (true);

-- Step 6: Create policy to allow authenticated users to read work experiences
CREATE POLICY "Authenticated users can view work experiences" ON work_experiences
  FOR SELECT USING (auth.role() = 'authenticated');

-- Step 7: Create policy to allow authenticated users to update work experiences
CREATE POLICY "Authenticated users can update work experiences" ON work_experiences
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Step 8: Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_work_experiences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_work_experiences_updated_at ON work_experiences;
CREATE TRIGGER update_work_experiences_updated_at BEFORE UPDATE ON work_experiences
    FOR EACH ROW EXECUTE FUNCTION update_work_experiences_updated_at();

-- Step 9: Remove work_history column from candidates table (optional - uncomment if you want to remove it)
-- Note: This will delete existing work_history data. Make sure to backup if needed.
-- ALTER TABLE candidates DROP COLUMN IF EXISTS work_history;

-- If you want to keep the column but make it nullable for backward compatibility:
ALTER TABLE candidates ALTER COLUMN work_history DROP NOT NULL;

