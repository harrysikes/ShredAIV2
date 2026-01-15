# Sign-In Debug Guide

## How to Debug Sign-In Issues

When you try to sign in, check your console/terminal for these debug messages:

### 1. Check Supabase Connection

Look for this warning at app startup:
```
⚠️ Missing Supabase environment variables.
```

**If you see this:**
- Your Supabase URL or key is not configured
- Check `app.json` has `supabaseUrl` and `supabaseAnonKey` in the `extra` section
- Restart the app after adding them

### 2. Sign-In Attempt Logs

When you click "Sign In", you should see:
```
[AUTH SCREEN DEBUG] handleAuth called: { isSignUp: false, email: 'provided', hasPassword: true }
[AUTH SCREEN DEBUG] Starting authentication...
[AUTH SCREEN DEBUG] Calling signIn...
[AUTH DEBUG] Sign in attempt: { email: 'your@email.com' }
```

### 3. Sign-In Response

Look for this log:
```
[AUTH DEBUG] Sign in response: {
  hasError: true/false,
  errorMessage: '...',
  errorCode: 400/401/etc,
  hasUser: true/false,
  hasSession: true/false,
  userId: '...',
  email: '...'
}
```

### Common Issues and Solutions

#### Issue 1: "Invalid login credentials"
```
[AUTH DEBUG] Sign in error: { message: 'Invalid login credentials' }
```
**Solution:**
- Check your email and password are correct
- If you just signed up, make sure email confirmation is disabled OR you've confirmed your email
- Try resetting your password in Supabase dashboard

#### Issue 2: "No session returned"
```
[AUTH DEBUG] No session returned after sign in - email confirmation may be required
```
**Solution:**
- Go to Supabase Dashboard → Authentication → Settings
- Turn OFF "Enable email confirmations"
- Try signing in again

#### Issue 3: "Missing Supabase environment variables"
```
⚠️ Missing Supabase environment variables.
```
**Solution:**
- Open `app.json`
- Add to `extra` section:
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
- Restart the app completely

#### Issue 4: Sign-in succeeds but doesn't navigate
```
[AUTH DEBUG] Sign in response: { hasSession: true, ... }
[AUTH SCREEN DEBUG] Auth successful, checking state before navigation...
[NAV DEBUG] Authenticated but on Auth screen, redirecting to Home
```
**If you see this but still on Auth screen:**
- Check if `isAuthenticated` is actually `true` in the next log
- The navigation should happen automatically after 500ms
- If it doesn't, there might be a navigation conflict

#### Issue 5: Auth state not persisting
```
[AUTH DEBUG] Auth state after set: { isAuthenticated: false, ... }
```
**Solution:**
- Check if Supabase client is properly initialized
- Verify `persistSession: true` in `lib/supabase.ts`
- Try signing out and signing in again

## Step-by-Step Debugging

1. **Check Console Logs**
   - Look for `[AUTH DEBUG]` and `[AUTH SCREEN DEBUG]` messages
   - Copy the full log output from sign-in attempt

2. **Verify Supabase Config**
   - Check `app.json` has correct Supabase URL and key
   - Verify in Supabase dashboard that the project is active

3. **Check Email Confirmation**
   - Go to Supabase Dashboard → Authentication → Settings
   - Check if "Enable email confirmations" is ON or OFF
   - For development, turn it OFF

4. **Test with Known Good Account**
   - Create a fresh account with email confirmation OFF
   - Try signing in immediately after sign-up
   - If this works, the issue is with the specific account

5. **Check Navigation Logs**
   - Look for `[NAV DEBUG]` messages
   - Verify `isAuthenticated` becomes `true` after sign-in
   - Check if navigation to Home is attempted

## What to Share for Help

If you're still stuck, share:
1. The full console log output from when you click "Sign In"
2. Any error messages shown in the app
3. Whether Supabase credentials are configured in `app.json`
4. Whether email confirmation is enabled in Supabase
