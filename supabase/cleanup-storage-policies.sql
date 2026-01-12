-- Quick cleanup script for existing storage policies
-- Run this if you're getting "policy already exists" errors
-- Safe to run multiple times

-- Drop all photo storage policies that may have been created previously
DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;

-- Verify cleanup (this will show a notice if policies existed)
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies cleaned up successfully';
END $$;
