import { createClient } from '@supabase/supabase-js';

// Service role client for backend/server-side operations
// This should ONLY be used on the server (Vercel backend)
// NEVER expose the service role key to the client

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase service role credentials. Required for backend operations.');
}

// Create Supabase client with service role (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
