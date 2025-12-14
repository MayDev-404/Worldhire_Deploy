-- Create storage buckets for CVs and photographs
-- CVs are private (public=false) for privacy, photos are public (public=true) for display
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('candidate-cvs', 'candidate-cvs', false, 5242880, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('candidate-photos', 'candidate-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "Anyone can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view CVs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view photos" ON storage.objects;

-- Set up storage policies for CV bucket (PRIVATE)
-- Allow anyone to upload CVs (for public registration form)
CREATE POLICY "Anyone can upload CVs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'candidate-cvs');

-- Only authenticated users (recruiters) can view CVs for privacy
CREATE POLICY "Authenticated users can view CVs" ON storage.objects
  FOR SELECT USING (bucket_id = 'candidate-cvs' AND auth.role() = 'authenticated');

-- Set up storage policies for photos bucket (PUBLIC)
-- Allow anyone to upload photos (for public registration form)
CREATE POLICY "Anyone can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'candidate-photos');

-- Allow public to view photos (for display in candidate profiles)
CREATE POLICY "Public can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'candidate-photos');
