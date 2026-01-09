# Next Steps After Configuring Environment Variables

You've completed:
- ✅ Frontend configured in `app.json`
- ✅ Backend environment variables added to Vercel

## Step 1: Redeploy Backend on Vercel

The backend needs to be redeployed to pick up the new environment variables:

1. Go to https://vercel.com → Your project
2. Go to **Deployments** tab
3. Find the latest deployment
4. Click the **three dots (⋯)** menu
5. Click **Redeploy**
6. Select **Use existing Build Cache** (optional, faster)
7. Click **Redeploy**

Wait for deployment to complete (usually 1-2 minutes).

---

## Step 2: Run Database Schema in Supabase

1. Go to your Supabase project: https://supabase.com/dashboard/project/gufbulaxyqcggaeqqvhh
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file `supabase/schema.sql` from your project
5. **Copy ALL the contents** of `schema.sql`
6. **Paste into the SQL Editor** in Supabase
7. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
8. You should see "Success. No rows returned" or similar success message

---

## Step 3: Set Up Storage Buckets

1. Still in Supabase dashboard, click **Storage** in the left sidebar
2. Click **New bucket**
3. Name: `user-photos`
4. **Make it PRIVATE** (uncheck "Public bucket")
5. Click **Create bucket**

OR run the SQL (easier):
1. Go back to **SQL Editor**
2. Open `supabase/storage-setup.sql` from your project
3. **Copy ALL the contents**
4. **Paste into SQL Editor**
5. Click **Run**

---

## Step 4: Verify Setup

### Test Database Connection

1. In Supabase dashboard, go to **Table Editor**
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `survey_data`
   - ✅ `body_fat_history`
   - ✅ `workout_plans`
   - ✅ `workout_tracking`
   - ✅ `workout_completions`
   - ✅ `workout_misses`
   - ✅ `calibration_data`

### Test Storage Bucket

1. Go to **Storage** in Supabase
2. You should see `user-photos` bucket
3. It should show as **Private**

### Test Backend Connection

Check Vercel deployment logs:
1. Go to Vercel → Your project → **Deployments**
2. Click on the latest deployment
3. Check **Function Logs** for any errors
4. Should see successful startup messages

---

## Step 5: Restart Your Frontend

Since you updated `app.json`, restart your Expo dev server:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm start
```

Press `r` to reload, or `shift+r` to reload and clear cache.

---

## Step 6: Test Authentication Flow

1. **Open your app** (in Expo Go or iOS Simulator)
2. You should see the **Auth Screen** (sign up/sign in)
3. **Create a test account:**
   - Enter name, email, password
   - Click "Sign Up"
4. You should be redirected to the Home screen
5. **Verify data saves:**
   - Complete a body fat scan
   - Check if data persists after app restart

---

## Step 7: Verify Data in Supabase

1. Go to Supabase → **Table Editor**
2. Click on `profiles` table
3. You should see your test user's profile
4. After completing a scan, check `body_fat_history` table
5. Data should appear there

---

## Troubleshooting

### "Missing Supabase environment variables"
- ✅ Check `app.json` has non-empty values
- ✅ Restart Expo dev server after changing `app.json`

### "Failed to connect to Supabase"
- ✅ Verify URL is correct: `https://gufbulaxyqcggaeqqvhh.supabase.co`
- ✅ Check anon key is correct
- ✅ Check your internet connection

### "Permission denied" or "Row Level Security" errors
- ✅ Run the schema.sql file to create RLS policies
- ✅ Verify you're signed in as a user

### Backend not working
- ✅ Verify environment variables are in Vercel
- ✅ Redeploy after adding variables
- ✅ Check Vercel function logs for errors

### Storage upload fails
- ✅ Verify `user-photos` bucket exists
- ✅ Ensure bucket is private
- ✅ Run storage-setup.sql to create policies

---

## Quick Checklist

- [ ] Redeploy Vercel backend
- [ ] Run `schema.sql` in Supabase SQL Editor
- [ ] Run `storage-setup.sql` in Supabase SQL Editor
- [ ] Verify tables exist in Supabase Table Editor
- [ ] Verify `user-photos` bucket exists in Storage
- [ ] Restart Expo dev server (`npm start`)
- [ ] Test signup/signin in app
- [ ] Test data persistence (complete a scan)

Once all these are done, your app is fully connected to Supabase! 🎉
