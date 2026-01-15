# Network Error Fix Guide

## ✅ Fixed Issues

### 1. Text Rendering Error
**Problem:** "text strings must be rendered with a <text> component"
**Fix:** Updated error handling to properly extract error messages instead of rendering error objects directly.

### 2. API Configuration
**Problem:** App was trying to use `localhost:3000` in development mode
**Fix:** Updated `api/config.ts` to always use production URL (works on physical devices)

### 3. Error Messages
**Problem:** Generic error messages not helpful
**Fix:** Added detailed error logging and user-friendly error messages

---

## 🔧 Network Error Fix

The "Network request failed" error means the app can't reach the backend. Here's how to fix it:

### Step 1: Verify Backend is Deployed

Check if your backend is accessible:
```bash
curl https://backend-q8gcefib5-harry-sikes-projects.vercel.app/health
```

**Expected response:**
```json
{"status":"healthy","timestamp":"...","version":"1.0.0","service":"ShredAI Backend"}
```

**If you get an error:**
- Backend might not be deployed
- Go to Vercel dashboard and redeploy

### Step 2: Check CORS Configuration

React Native apps don't have a specific origin, so CORS needs to allow all origins.

**In Vercel Dashboard:**
1. Go to your project → Settings → Environment Variables
2. Find `ALLOWED_ORIGINS`
3. Set it to `*` (or leave empty to allow all)
4. Redeploy the backend

**Or update `backend/index.js`:**
```javascript
const corsOptions = {
  origin: '*', // Allow all origins for React Native
  credentials: true,
  optionsSuccessStatus: 200
};
```

### Step 3: Verify Environment Variables

Make sure these are set in Vercel:
- ✅ `OPENAI_API_KEY` (required for body analysis)
- ✅ `SUPABASE_URL` (if using Supabase)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` (if using Supabase)
- ✅ `ALLOWED_ORIGINS` (set to `*` or empty)

### Step 4: Test the Endpoint

Test the body analysis endpoint:
```bash
curl -X POST https://backend-q8gcefib5-harry-sikes-projects.vercel.app/api/body-analysis/analyze-base64 \
  -H "Content-Type: application/json" \
  -d '{"images":["test"],"surveyData":{"sex":"male","age":25}}'
```

---

## 🚀 Quick Fix Checklist

- [ ] Backend is deployed to Vercel
- [ ] `ALLOWED_ORIGINS` is set to `*` in Vercel
- [ ] `OPENAI_API_KEY` is set in Vercel
- [ ] Backend health endpoint returns 200
- [ ] App is using production URL (already fixed in code)
- [ ] Restart the app after changes

---

## 📱 Testing

1. **Restart your app** (completely close and reopen)
2. **Try the scan again**
3. **Check console logs** for detailed error messages
4. **If still failing**, check Vercel function logs:
   - Go to Vercel Dashboard → Your Project → Functions
   - Check the logs for the `/api/body-analysis/analyze-base64` endpoint

---

## 🔍 Debugging

If errors persist, check:

1. **Console Logs:**
   - Look for `[AUTH DEBUG]` messages
   - Check for network error details
   - Verify API URL is correct

2. **Vercel Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment → Functions
   - Check logs for errors

3. **Network Connection:**
   - Ensure device has internet
   - Try on different network (WiFi vs cellular)
   - Check if other apps can access internet

---

## 💡 Alternative: Use Local Backend for Testing

If you want to test with a local backend:

1. **Start local backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Use ngrok to expose it:**
   ```bash
   ngrok http 3000
   ```

3. **Update `api/config.ts`:**
   ```typescript
   production: {
     baseURL: 'https://your-ngrok-url.ngrok.io',
   }
   ```

---

## ✅ What's Fixed in Code

- ✅ API config always uses production URL
- ✅ Error handling properly extracts error messages
- ✅ Better error messages for users
- ✅ Detailed logging for debugging

The app should now work once the backend is properly configured!
