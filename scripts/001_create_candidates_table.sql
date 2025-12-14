-- Create candidates table to store all candidate application information
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic Information (Step 1)
  name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  current_location TEXT NOT NULL,
  current_salary_currency TEXT NOT NULL,
  salary_range TEXT NOT NULL,
  nationality TEXT NOT NULL,
  gender TEXT NOT NULL,
  
  -- CV and Photo Storage
  cv_url TEXT,
  photograph_url TEXT,
  
  -- Professional Details (Step 2)
  seniority_level TEXT,
  reporting_manager TEXT,
  preferred_location TEXT NOT NULL,
  skills TEXT NOT NULL,
  experience TEXT NOT NULL,
  work_history TEXT NOT NULL,
  education TEXT NOT NULL,
  expected_salary_currency TEXT NOT NULL,
  expected_salary_range TEXT NOT NULL,
  
  -- Preferences & Additional Info (Step 3)
  linkedin_profile TEXT,
  portfolio TEXT,
  preferred_role TEXT,
  work_permit_status TEXT DEFAULT 'Nationality basis',
  employment_type TEXT DEFAULT 'Permanent',
  work_mode TEXT NOT NULL DEFAULT 'Hybrid',
  "references" TEXT,
  notice_period TEXT NOT NULL,
  actively_seeking_toggle TEXT NOT NULL DEFAULT 'Passive',
  
  -- Metadata
  application_status TEXT DEFAULT 'submitted',
  profile_completion_percentage INTEGER DEFAULT 0
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);

-- Create index on application status for filtering
CREATE INDEX IF NOT EXISTS idx_candidates_status ON candidates(application_status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);

-- Enable Row Level Security
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (public application form)
CREATE POLICY "Anyone can submit applications" ON candidates
  FOR INSERT WITH CHECK (true);

-- Create policy to allow authenticated users to read all candidates (for recruiters)
CREATE POLICY "Authenticated users can view candidates" ON candidates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update candidates (for recruiters)
CREATE POLICY "Authenticated users can update candidates" ON candidates
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
