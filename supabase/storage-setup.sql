-- ShredAI V2 Storage Setup
-- NOTE: Photo storage has been removed per privacy policy
-- Photos are processed in memory and immediately discarded, never stored
-- This file cleans up any existing photo storage policies that may have been created previously

-- Clean up any existing photo storage policies (safe to run multiple times)
-- This prevents errors if you try to create policies that already exist

DO $$
BEGIN
  -- Drop all photo storage policies if they exist (to avoid conflicts)
  DROP POLICY IF EXISTS "Users can upload own photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can view own photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete own photos" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update own photos" ON storage.objects;
  
  RAISE NOTICE '✅ Photo storage policies cleaned up (if they existed)';
EXCEPTION
  WHEN OTHERS THEN
    -- If policies don't exist or other errors, continue anyway
    RAISE NOTICE 'ℹ️  No existing policies to clean up or already cleaned';
END $$;

-- Optional: Drop the storage bucket if it exists (uncomment if you want to remove it completely)
-- DROP BUCKET IF EXISTS user-photos;

-- IMPORTANT: We do NOT create any storage buckets or policies
-- because photos are NOT stored per our privacy policy.
-- Photos are processed by OpenAI GPT-4o Vision API in memory and immediately discarded.
