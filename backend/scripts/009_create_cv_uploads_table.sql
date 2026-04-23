-- Migration: 009_create_cv_uploads_table.sql
-- Description: Create cv_uploads table to store metadata for parsed CVs

CREATE TABLE IF NOT EXISTS public.cv_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_url TEXT NOT NULL,
    candidate_id UUID REFERENCES public.candidates(id) ON DELETE SET NULL,
    upload_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cv_uploads_candidate_id ON public.cv_uploads(candidate_id);

-- RLS
ALTER TABLE public.cv_uploads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous or authenticated to insert (since parse-cv can be called pre-auth in the application flow)
CREATE POLICY "Enable insert for anyone" ON public.cv_uploads FOR INSERT WITH CHECK (true);

-- Allow authenticated/service role to select
CREATE POLICY "Enable select for authenticated users" ON public.cv_uploads FOR SELECT TO authenticated USING (true);
