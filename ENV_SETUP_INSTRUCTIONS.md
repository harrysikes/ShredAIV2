# Environment Variables Setup Instructions

## Step 1: Get Your Supabase Credentials

1. Go to https://supabase.com and sign in
2. Open your project (or create a new one)
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** (e.g., `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...` - **KEEP THIS SECRET!**)

Copy these values - you'll need them in the next steps.

---

## Step 2: Configure Frontend (app.json)

1. Open `app.json` in your project root
2. Find the `"extra"` section (it should already be there with empty strings)
3. Replace the empty strings with your Supabase credentials:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project-id.supabase.co",
      "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Example:**
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://abcdefghijklmnop.supabase.co",
      "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NzE2ODAwMCwiZXhwIjoxOTYyNzQ0MDAwfQ.abcdefghijklmnopqrstuvwxyz1234567890"
    }
  }
}
```

4. Save the file

**⚠️ Important:** The `anon` key is safe to include in your app - it's designed to be public. The `service_role` key should NEVER be in app.json.

---

## Step 3: Configure Backend (Vercel)

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign in
2. Select your project (or create one if you haven't)
3. Go to **Settings** → **Environment Variables**
4. Add these two variables:

   **Variable 1:**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://your-project-id.supabase.co` (same URL as frontend)
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** Your service_role key from Supabase (starts with `eyJ...`)
   - **Environment:** Select all (Production, Preview, Development)
   - **⚠️ WARNING:** This is a secret key - never expose it!

5. Click **Save** for each variable
6. **Redeploy your backend** (Vercel will automatically redeploy, or go to Deployments → Redeploy)

### Option B: Using Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
cd backend
vercel link

# Add environment variables
vercel env add SUPABASE_URL
# Paste your Supabase URL when prompted
# Select: Production, Preview, Development

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Paste your service_role key when prompted
# Select: Production, Preview, Development

# Pull environment variables locally (optional, for testing)
vercel env pull .env.local
```

---

## Step 4: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client library
- `expo-file-system` - For handling file uploads in React Native
- All other dependencies

**Expected output:**
```
added 245 packages, and audited 246 packages in 15s
```

---

## Step 5: Verify Setup

### Frontend Verification

1. Check `app.json` has your Supabase credentials in the `extra` section
2. Restart your Expo development server:
   ```bash
   npm start
   ```
   Then press `r` to reload, or `shift+r` to reload and clear cache

### Backend Verification

1. Check Vercel dashboard shows both environment variables
2. Test a backend endpoint (if you have one set up)
3. Check Vercel function logs for any errors

---

## Troubleshooting

### "Missing Supabase environment variables" error

- **Frontend:** Check `app.json` has the `extra` section with non-empty strings
- **Backend:** Check Vercel environment variables are set and project is redeployed

### "Invalid API key" error

- Verify you copied the correct key (anon key for frontend, service_role for backend)
- Check for extra spaces or line breaks
- Ensure keys start with `eyJ...`

### Backend not working

- Make sure you redeployed after adding environment variables
- Check Vercel function logs for specific errors
- Verify service_role key is correct (not the anon key)

### Frontend not connecting

- Restart Expo dev server after changing `app.json`
- Clear Expo cache: `expo start -c`
- Check that `app.json` is valid JSON (no trailing commas)

---

## Security Checklist

- ✅ Anon key in `app.json` (safe - designed to be public)
- ✅ Service role key ONLY in Vercel (never in code)
- ✅ Service role key NOT in git repository
- ✅ `.env` files in `.gitignore` (if using them)

---

## Quick Reference

**Frontend (`app.json`):**
```json
"extra": {
  "supabaseUrl": "YOUR_SUPABASE_URL",
  "supabaseAnonKey": "YOUR_ANON_KEY"
}
```

**Backend (Vercel):**
- `SUPABASE_URL` = Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` = Your service_role key

**Install:**
```bash
npm install
```
