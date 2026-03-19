-- =============================================================================
-- DROP ALL APP TABLES - Only run this if you want a completely fresh database.
-- This DELETES ALL DATA. Run 000_full_schema.sql after this.
-- =============================================================================

-- Drop in reverse dependency order (child tables first)
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS work_experiences CASCADE;
DROP TABLE IF EXISTS educations CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Storage buckets: optional (uncomment to remove buckets; objects inside will be removed)
-- DELETE FROM storage.buckets WHERE id IN ('candidate-cvs', 'candidate-photos');
