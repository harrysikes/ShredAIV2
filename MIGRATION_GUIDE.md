# Migration Guide: AsyncStorage → Supabase

This guide helps you migrate from the old AsyncStorage-based system to the new Supabase-backed architecture.

## Overview

The app now uses:
- **Supabase Auth** for user authentication
- **Supabase PostgreSQL** for data persistence
- **Supabase Storage** for user photos
- **Backend service role** for privileged operations

## Step-by-Step Migration

### 1. Set Up Supabase

Follow `SUPABASE_SETUP.md` to:
- Create Supabase project
- Run database schema
- Set up storage buckets
- Configure environment variables

### 2. Update Environment Variables

**Frontend (`app.json`):**
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://your-project.supabase.co",
      "supabaseAnonKey": "your-anon-key"
    }
  }
}
```

**Backend (Vercel):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Update Imports

Replace all imports from `surveyStore` to `supabaseStore`:

**Before:**
```typescript
import { useSurveyStore } from '../state/surveyStore';
```

**After:**
```typescript
import { useSurveyStore } from '../state/supabaseStore';
```

### 4. Add Authentication Flow

The app now requires users to sign up/sign in. The `AuthScreen` will be shown automatically if the user is not authenticated.

### 5. Update Screen Components

Most screens should work without changes, but verify:
- `HomeScreen.tsx` - Uses `loadProfileData()` which now loads from Supabase
- `WorkoutPlanScreen.tsx` - Uses `completeWorkout()` which now saves to Supabase
- `BodyFatHistoryScreen.tsx` - Uses `bodyFatHistory` from Supabase
- `ResultsScreen.tsx` - Uses `addBodyFatHistory()` which now uploads photos to Supabase Storage

### 6. Data Migration (Optional)

If you have existing users with AsyncStorage data, create a migration script:

```typescript
// Example migration function (run once per user)
async function migrateAsyncStorageToSupabase(userId: string) {
  // Load from AsyncStorage
  const profileJson = await AsyncStorage.getItem('@shredai_profile');
  const historyJson = await AsyncStorage.getItem('@shredai_history');
  const planJson = await AsyncStorage.getItem('@shredai_workout_plan');
  
  // Save to Supabase
  if (profileJson) {
    const profile = JSON.parse(profileJson);
    await supabase.from('survey_data').upsert({
      user_id: userId,
      ...profile.surveyData,
    });
  }
  
  if (historyJson) {
    const history = JSON.parse(historyJson);
    for (const entry of history) {
      await supabase.from('body_fat_history').insert({
        user_id: userId,
        date: entry.date,
        body_fat_percentage: entry.bodyFatPercentage,
        weight: entry.weight,
      });
    }
  }
  
  // Clear AsyncStorage after migration
  await AsyncStorage.multiRemove([
    '@shredai_profile',
    '@shredai_history',
    '@shredai_workout_plan',
    '@shredai_workout_tracking',
  ]);
}
```

### 7. Update Backend Endpoints

Backend endpoints should now use `supabaseAdmin` instead of in-memory storage:

**Before:**
```javascript
const users = new Map();
users.set(email, user);
```

**After:**
```javascript
const { supabaseAdmin } = require('../lib/supabaseService');
await supabaseAdmin.from('profiles').insert({ ... });
```

### 8. Test Authentication Flow

1. Test user signup
2. Test user signin
3. Verify data persists across app restarts
4. Test multi-device sync (sign in on different device)
5. Verify photos upload to Supabase Storage

### 9. Remove Old Code (After Testing)

Once migration is complete and tested:
- Keep `surveyStore.ts` as backup for now
- Remove AsyncStorage dependencies if not needed elsewhere
- Clean up old backend in-memory storage code

## Breaking Changes

1. **Authentication Required**: Users must sign up/sign in
2. **No Offline-Only Mode**: App requires internet connection for data sync
3. **Photo Storage**: Photos now stored in Supabase Storage (not base64 in database)
4. **API Changes**: Some store methods are now async and return Promises

## Rollback Plan

If issues occur:
1. Revert imports back to `surveyStore`
2. Keep AsyncStorage as fallback
3. Gradually migrate users

## Support

See `SUPABASE_SETUP.md` for troubleshooting and setup details.
