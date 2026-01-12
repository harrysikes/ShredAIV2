# Supabase Setup Guide for ShredAI V2

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Note your project URL and API keys

## Step 1: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/schema.sql` to create all tables and RLS policies
4. Run the contents of `supabase/storage-setup.sql` to set up storage buckets

## Step 2: Environment Variables

### Frontend (Expo/React Native)

Add to your `app.json` or use `expo-constants`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your-anon-key-here"
    }
  }
}
```

Or create a `.env` file (requires `react-native-config` or similar):
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Backend (Vercel)

Add these environment variables in your Vercel project settings:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**⚠️ IMPORTANT**: Never expose the service role key to the client. It bypasses Row Level Security.

## Step 3: Storage Bucket Configuration

1. Go to Storage in your Supabase dashboard
2. Verify the `user-photos` bucket was created
3. Ensure it's set to **Private**
4. Verify the storage policies are in place

## Step 4: Authentication Setup

1. Go to Authentication > Settings in Supabase dashboard
2. Configure email authentication (enabled by default)
3. **For Development: Disable Email Confirmation (Recommended)**
   - Scroll to "Email Auth" section
   - Find "Enable email confirmations" toggle
   - **Turn it OFF** for development/testing
   - This allows users to sign up and immediately sign in without checking email
   - **⚠️ Re-enable this in production for security**
4. Set up email templates if desired
5. Configure redirect URLs for your app

**Why disable email confirmation for development?**
- Faster testing without waiting for emails
- No need to check spam folders
- Immediate access after sign-up
- The app now handles email confirmation gracefully, but disabling it makes testing easier

## Step 5: Row Level Security Verification

All tables should have RLS enabled. Verify in the SQL Editor:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`.

## Step 6: Migration from AsyncStorage

The new `supabaseStore.ts` replaces `surveyStore.ts`. To migrate:

1. Users will need to sign up/sign in
2. Existing AsyncStorage data can be migrated on first login (optional migration script)
3. Update all imports from `surveyStore` to `supabaseStore`

## Testing

1. Test user signup/signin
2. Verify data persists across app restarts
3. Test multi-device sync (sign in on different device)
4. Verify photos upload to storage
5. Test RLS policies (users can only see their own data)

## Troubleshooting

### "Missing Supabase environment variables"
- Ensure environment variables are set correctly
- For Expo, check `app.json` extra config
- For backend, check Vercel environment variables

### "Row Level Security policy violation"
- Verify RLS policies are created
- Check that user is authenticated
- Ensure `auth.uid()` matches `user_id` in queries

### "Storage upload failed"
- Verify bucket exists and is named `user-photos`
- Check storage policies allow user uploads
- Ensure file size is under 10MB limit

### "Service role key not working"
- Verify key is correct (starts with `eyJ...`)
- Ensure it's only used on backend, never exposed to client
- Check that key has not been rotated

### "Sign-up doesn't let me through / Email confirmation required"
- **Quick Fix**: Disable email confirmation in Supabase Dashboard
  - Go to Authentication > Settings
  - Scroll to "Email Auth" section
  - Turn OFF "Enable email confirmations"
  - Users can now sign up and immediately sign in
- **Alternative**: Check your email for the confirmation link
  - The app now shows a helpful message when email confirmation is required
  - Click the confirmation link in your email, then sign in
- **Production**: Re-enable email confirmation for security

## Security Checklist

- ✅ RLS enabled on all tables
- ✅ Service role key only in backend environment variables
- ✅ Storage bucket is private
- ✅ Storage policies restrict access to user's own files
- ✅ JWT tokens properly validated
- ✅ No sensitive data in client-side code
