# How to Find Your Supabase Service Role Key

## Location in Supabase Dashboard

1. **Go to your Supabase project**: https://supabase.com/dashboard
2. **Click on your project** (gufbulaxyqcggaeqqvhh)
3. **Go to Settings** (gear icon in left sidebar)
4. **Click on "API"** (under Project Settings)
5. **Scroll down** to find the keys section

You should see:
- **Project URL** - `https://gufbulaxyqcggaeqqvhh.supabase.co`
- **anon public** key - `sb_publishable_uqD0kRP_huqdK204EveHyw_64Y9j7KS` ✅ (you have this)
- **service_role** key - **This is what you need** (might be hidden)

## If You Can't See the Service Role Key

The service_role key is sometimes hidden for security. Look for:

1. **A toggle button or "Reveal" button** next to the service_role key
2. **A section that says "Service Role Key"** with a "Show" or "Reveal" button
3. **A warning icon** indicating it's a secret key
4. **Try clicking on the key field** - sometimes it reveals on click

## Alternative: Reset/Create Service Role Key

If you still can't find it:

1. In the same API settings page
2. Look for "Reset service role key" or "Rotate key" option
3. Click it to generate a new one
4. **⚠️ IMPORTANT:** Copy it immediately - it won't be shown again!

## Visual Guide

In the API settings page, you should see something like:

```
Project URL
https://gufbulaxyqcggaeqqvhh.supabase.co

API Keys
┌─────────────────────────────────────────┐
│ anon public                              │
│ sb_publishable_uqD0kRP_huqdK204EveHyw...│
│                                          │
│ service_role (secret)  [Show] ← Click!  │
│ sb_service_...                          │
└─────────────────────────────────────────┘
```

## Quick Check

The service_role key will:
- Start with `sb_service_` (newer format) or `eyJ...` (older JWT format)
- Have a longer string than the anon key
- Be marked as "secret" or "service_role"
- Have a warning that it bypasses Row Level Security

## Need Help?

If you still can't find it:
1. Check if you have the correct permissions (project owner)
2. Try refreshing the Supabase dashboard
3. Contact Supabase support if needed
4. You can also reset it if necessary
