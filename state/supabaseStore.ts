import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Session, User } from '@supabase/supabase-js';

// Keep existing interfaces for compatibility
export interface SurveyData {
  sex: 'male' | 'female' | null;
  dateOfBirth: Date | null;
  age?: number;
  height: {
    feet: number;
    inches: number;
  } | null;
  weight: {
    value: number;
    unit: 'lbs' | 'kg';
  } | null;
  exerciseFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'very-often' | null;
  workoutGoal: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | null;
}

export type CameraAngle = 'front' | 'side' | 'back';

export interface CapturedImageData {
  angle: CameraAngle;
  base64: string;
  storageUrl?: string; // Supabase Storage URL after upload
}

export interface BodyFatHistoryEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  bodyFatPercentage: number;
  weight?: number;
  imageUrl?: string;
}

export interface WorkoutTracking {
  dayOne: string | null; // ISO date string of first BF% log
  completedWorkouts: Record<string, boolean>; // date -> true
  missedWorkouts: Record<string, boolean>; // date -> true
}

export interface AppState {
  // Auth state
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  
  // App state
  surveyData: SurveyData;
  currentStep: number;
  capturedImage: string | null;
  capturedImages: CapturedImageData[];
  currentAngle: CameraAngle;
  bodyFatPercentage: number | null;
  bodyFatHistory: BodyFatHistoryEntry[];
  workoutPlan: any | null;
  workoutTracking: WorkoutTracking;
  isLoading: boolean;
  isSubscribed: boolean;
  
  // Auth actions
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  
  // Survey actions
  setSurveyData: (data: Partial<SurveyData>) => Promise<void>;
  setCurrentStep: (step: number) => void;
  setCapturedImage: (image: string | null) => void;
  setCapturedImages: (images: CapturedImageData[]) => void;
  addCapturedImage: (angle: CameraAngle, base64: string) => void;
  setCurrentAngle: (angle: CameraAngle) => void;
  setBodyFatPercentage: (percentage: number | null) => void;
  
  // Body fat history actions
  addBodyFatHistory: (bodyFatPercentage: number, weight?: number, imageBase64?: string) => Promise<void>;
  removeBodyFatHistory: (date: string) => Promise<void>;
  loadBodyFatHistory: () => Promise<void>;
  
  // Workout actions
  setWorkoutPlan: (plan: any | null) => Promise<void>;
  loadWorkoutPlan: () => Promise<void>;
  completeWorkout: (date: string, workoutType: string) => Promise<void>;
  markWorkoutMissed: (date: string, workoutType: string) => Promise<void>;
  loadWorkoutTracking: () => Promise<void>;
  
  // Profile actions
  loadProfileData: () => Promise<void>;
  saveProfileData: () => Promise<void>;
  getDailyStreak: () => number;
  
  // Utility
  setIsLoading: (loading: boolean) => void;
  setIsSubscribed: (subscribed: boolean) => void;
  resetSurvey: () => void;
}

const initialSurveyData: SurveyData = {
  sex: null,
  dateOfBirth: null,
  height: null,
  weight: { value: 150, unit: 'lbs' },
  exerciseFrequency: null,
  workoutGoal: null,
};

export const useSurveyStore = create<AppState>((set, get) => ({
  // Initial state
  session: null,
  user: null,
  isAuthenticated: false,
  surveyData: initialSurveyData,
  currentStep: 1,
  capturedImage: null,
  capturedImages: [],
  currentAngle: 'front',
  bodyFatPercentage: null,
  bodyFatHistory: [],
  workoutPlan: null,
  workoutTracking: {
    dayOne: null,
    completedWorkouts: {},
    missedWorkouts: {},
  },
  isLoading: false,
  isSubscribed: false,

  // ============================================
  // AUTHENTICATION
  // ============================================
  
  initializeAuth: async () => {
    console.log('[AUTH DEBUG] Initializing auth...');
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('[AUTH DEBUG] getSession result:', {
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
        error: error?.message,
      });
      
      if (error) {
        console.error('[AUTH DEBUG] Error getting session:', error);
        set({ session: null, user: null, isAuthenticated: false });
        return;
      }
      
      console.log('[AUTH DEBUG] Setting initial auth state:', {
        hasSession: !!session,
        isAuthenticated: !!session,
      });
      set({ session, user: session?.user ?? null, isAuthenticated: !!session });
      
      // Load profile data if we have a session
      if (session) {
        console.log('[AUTH DEBUG] Loading profile data on init...');
        try {
          await get().loadProfileData();
        } catch (loadError) {
          console.error('[AUTH DEBUG] Error loading profile data on init:', loadError);
        }
      }
      
      // Listen for auth changes
      console.log('[AUTH DEBUG] Setting up auth state change listener...');
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('[AUTH DEBUG] Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          email: session?.user?.email,
        });
        set({ session, user: session?.user ?? null, isAuthenticated: !!session });
        
        if (session && event === 'SIGNED_IN') {
          console.log('[AUTH DEBUG] SIGNED_IN event detected, loading profile data...');
          // Only load profile data on explicit sign in
          get().loadProfileData().catch(err => {
            console.error('[AUTH DEBUG] Error loading profile data on auth change:', err);
          });
        } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          console.log('[AUTH DEBUG] SIGNED_OUT or TOKEN_REFRESHED, resetting survey data');
          // Reset survey data on sign out
          set({ surveyData: initialSurveyData });
        }
      });
      console.log('[AUTH DEBUG] Auth initialization complete');
    } catch (error) {
      console.error('[AUTH DEBUG] Error initializing auth:', error);
      set({ session: null, user: null, isAuthenticated: false });
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
    console.log('[AUTH DEBUG] Sign up attempt:', { email, hasName: !!name });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          },
        },
      });

      console.log('[AUTH DEBUG] Sign up response:', {
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.status,
        hasUser: !!data.user,
        hasSession: !!data.session,
        userId: data.user?.id,
        emailConfirmed: data.user?.email_confirmed_at ? true : false,
      });

      if (error) {
        console.error('[AUTH DEBUG] Sign up error:', error);
        return { error, needsEmailConfirmation: false };
      }

      // Supabase might not return a session if email confirmation is required
      // Check if email confirmation is needed
      const needsEmailConfirmation = !data.session && !!data.user && !data.user.email_confirmed_at;
      
      if (needsEmailConfirmation) {
        console.log('[AUTH DEBUG] Email confirmation required - no session returned');
        // Don't set auth state - user needs to confirm email first
        // Return a special error indicating email confirmation is needed
        return { 
          error: new Error('EMAIL_CONFIRMATION_REQUIRED'),
          needsEmailConfirmation: true 
        };
      }

      // If we have a session, proceed normally
      if (data.user && data.session) {
        console.log('[AUTH DEBUG] Setting auth state after signup:', {
          hasSession: !!data.session,
          userId: data.user.id,
          isAuthenticated: true,
        });
        set({ 
          session: data.session, 
          user: data.user, 
          isAuthenticated: true 
        });
        
        // Load profile data in background
        console.log('[AUTH DEBUG] Loading profile data after signup...');
        get().loadProfileData().catch(err => {
          console.warn('[AUTH DEBUG] Profile data load failed on signup (non-critical):', err);
        });
      } else {
        console.warn('[AUTH DEBUG] Unexpected signup result: user but no session and no confirmation required');
        return { 
          error: new Error('Account created but unable to sign in. Please try signing in manually.'), 
          needsEmailConfirmation: false 
        };
      }

      return { error: null, needsEmailConfirmation: false };
    } catch (error) {
      console.error('[AUTH DEBUG] Sign up exception:', error);
      return { error: error as Error, needsEmailConfirmation: false };
    }
  },

  signIn: async (email: string, password: string) => {
    console.log('[AUTH DEBUG] Sign in attempt:', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AUTH DEBUG] Sign in response:', {
        hasError: !!error,
        errorMessage: error?.message,
        errorCode: error?.status,
        hasUser: !!data.user,
        hasSession: !!data.session,
        userId: data.user?.id,
        email: data.user?.email,
      });

      if (error) {
        console.error('[AUTH DEBUG] Sign in error:', error);
        return { error };
      }

      // Check if we have a session - this is the critical check
      if (!data.session) {
        console.error('[AUTH DEBUG] No session returned after sign in - email confirmation may be required');
        return { 
          error: new Error('No session returned. Your account may need email confirmation.') 
        };
      }

      // Set auth state immediately
      console.log('[AUTH DEBUG] Setting auth state after signin:', {
        hasSession: !!data.session,
        userId: data.user?.id,
        isAuthenticated: true,
      });
      set({ 
        session: data.session, 
        user: data.user, 
        isAuthenticated: true 
      });
      
      // Verify state was set
      const currentState = get();
      console.log('[AUTH DEBUG] Auth state after set:', {
        isAuthenticated: currentState.isAuthenticated,
        hasUser: !!currentState.user,
        userId: currentState.user?.id,
      });
      
      // Load profile data in background - don't block sign in if this fails
      // User should explicitly fill out survey each time
      console.log('[AUTH DEBUG] Loading profile data after signin...');
      get().loadProfileData().catch((loadError) => {
        console.error('[AUTH DEBUG] Error loading profile data (non-blocking):', loadError);
        // Sign in still succeeds even if profile loading fails
      });

      return { error: null };
    } catch (error) {
      console.error('[AUTH DEBUG] Sign in exception:', error);
      return { error: error as Error };
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ 
        session: null, 
        user: null, 
        isAuthenticated: false,
        surveyData: initialSurveyData,
        bodyFatHistory: [],
        workoutPlan: null,
        workoutTracking: {
          dayOne: null,
          completedWorkouts: {},
          missedWorkouts: {},
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  // ============================================
  // SURVEY DATA
  // ============================================
  
  setSurveyData: async (data: Partial<SurveyData>) => {
    const { user } = get();
    if (!user) {
      // Store locally if not authenticated
      set((state) => ({
        surveyData: { ...state.surveyData, ...data },
      }));
      return;
    }

    // Update in Supabase
    try {
      const surveyData = { ...get().surveyData, ...data };
      
      const updateData: any = {};
      if (surveyData.sex) updateData.sex = surveyData.sex;
      if (surveyData.dateOfBirth) updateData.date_of_birth = surveyData.dateOfBirth.toISOString().split('T')[0];
      if (surveyData.height) {
        updateData.height_feet = surveyData.height.feet;
        updateData.height_inches = surveyData.height.inches;
      }
      if (surveyData.weight) {
        updateData.weight_value = surveyData.weight.value;
        updateData.weight_unit = surveyData.weight.unit;
      }
      if (surveyData.exerciseFrequency) updateData.exercise_frequency = surveyData.exerciseFrequency;
      if (surveyData.workoutGoal) updateData.workout_goal = surveyData.workoutGoal;

      const { error } = await supabase
        .from('survey_data')
        .upsert({
          user_id: user.id,
          ...updateData,
        }, {
          onConflict: 'user_id',
        });

      if (error) throw error;

      set({ surveyData });
    } catch (error) {
      console.error('Error saving survey data:', error);
      // Fallback to local state
      set((state) => ({
        surveyData: { ...state.surveyData, ...data },
      }));
    }
  },

  setCurrentStep: (step) => set({ currentStep: step }),
  setCapturedImage: (image) => set({ capturedImage: image }),
  setCapturedImages: (images) => set({ capturedImages: images }),
  
  addCapturedImage: (angle, base64) => {
    set((state) => {
      const existing = state.capturedImages.findIndex(img => img.angle === angle);
      const updated = existing >= 0
        ? state.capturedImages.map((img, idx) => idx === existing ? { angle, base64 } : img)
        : [...state.capturedImages, { angle, base64 }];
      return { 
        capturedImages: updated,
        capturedImage: base64,
      };
    });
  },
  
  setCurrentAngle: (angle) => set({ currentAngle: angle }),
  setBodyFatPercentage: (percentage) => set({ bodyFatPercentage: percentage }),

  // ============================================
  // BODY FAT HISTORY
  // ============================================
  
  addBodyFatHistory: async (bodyFatPercentage, weight, imageBase64) => {
    const { user } = get();
    if (!user) {
      console.error('User not authenticated - cannot save body fat history');
      // Still update local state so the UI works
      const entry: BodyFatHistoryEntry = {
        date: new Date().toISOString().split('T')[0],
        bodyFatPercentage,
        weight,
      };
      set((state) => ({
        bodyFatHistory: [...state.bodyFatHistory, entry].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
        bodyFatPercentage,
      }));
      return;
    }

    try {
      const date = new Date().toISOString().split('T')[0];

      // NOTE: Photos are NOT stored - only processed for analysis and then discarded
      // This complies with our privacy policy which states we do not store photos

      // Insert into Supabase (use upsert to handle same-day duplicates)
      const { data, error } = await supabase
        .from('body_fat_history')
        .upsert({
          user_id: user.id,
          date,
          body_fat_percentage: bodyFatPercentage,
          weight: weight || null,
          method: 'ai_vision',
          image_url: null, // No photo storage
        }, {
          onConflict: 'user_id,date',
        })
        .select()
        .maybeSingle(); // Use maybeSingle() - returns null if no rows

      if (error) {
        // Only log if it's not a "no rows" error (PGRST116)
        if (error.code !== 'PGRST116') {
          console.error('Error saving body fat history to database:', error);
          console.error('This might be because the database tables haven\'t been created yet.');
          console.error('Please run the SQL files in Supabase: schema.sql');
        }
        // Still update local state even if database save failed
      } else if (data) {
        // Successfully saved to database
        const entry: BodyFatHistoryEntry = {
          date: data.date,
          bodyFatPercentage: data.body_fat_percentage,
          weight: data.weight || undefined,
          // No imageUrl - photos are not stored
        };

        set((state) => ({
          bodyFatHistory: state.bodyFatHistory
            .filter(e => e.date !== entry.date) // Remove duplicate if exists
            .concat([entry])
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
          bodyFatPercentage,
        }));

        // Update workout tracking dayOne if this is the first entry
        const { workoutTracking } = get();
        if (!workoutTracking.dayOne) {
          try {
            await supabase
              .from('workout_tracking')
              .upsert({
                user_id: user.id,
                day_one: date,
              }, {
                onConflict: 'user_id',
              });

            set({
              workoutTracking: {
                ...workoutTracking,
                dayOne: date,
              },
            });
          } catch (trackingError) {
            console.error('Error updating workout tracking:', trackingError);
          }
        }
        return;
      }

      // Fallback: Update local state even if database save failed
      const entry: BodyFatHistoryEntry = {
        date,
        bodyFatPercentage,
        weight,
        // No imageUrl - photos are not stored
      };

      set((state) => ({
        bodyFatHistory: state.bodyFatHistory
          .filter(e => e.date !== entry.date) // Remove duplicate if exists
          .concat([entry])
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        bodyFatPercentage,
      }));
    } catch (error) {
      console.error('Unexpected error adding body fat history:', error);
      // Still update local state
      const entry: BodyFatHistoryEntry = {
        date: new Date().toISOString().split('T')[0],
        bodyFatPercentage,
        weight,
      };
      set((state) => ({
        bodyFatHistory: state.bodyFatHistory
          .filter(e => e.date !== entry.date)
          .concat([entry])
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        bodyFatPercentage,
      }));
    }
  },

  removeBodyFatHistory: async (date) => {
    const { user } = get();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('body_fat_history')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      if (error) throw error;

      set((state) => ({
        bodyFatHistory: state.bodyFatHistory.filter(entry => entry.date !== date),
      }));
    } catch (error) {
      console.error('Error removing body fat history:', error);
    }
  },

  loadBodyFatHistory: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('body_fat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (error) throw error;

      const history: BodyFatHistoryEntry[] = (data || []).map((row) => ({
        date: row.date,
        bodyFatPercentage: row.body_fat_percentage,
        weight: row.weight || undefined,
        imageUrl: row.image_url || undefined,
      }));

      set({ bodyFatHistory: history });
    } catch (error) {
      console.error('Error loading body fat history:', error);
    }
  },

  // ============================================
  // WORKOUT PLANS
  // ============================================
  
  setWorkoutPlan: async (plan) => {
    const { user } = get();
    if (!user) {
      set({ workoutPlan: plan });
      return;
    }

    try {
      if (plan) {
        const { error } = await supabase
          .from('workout_plans')
          .upsert({
            user_id: user.id,
            goal: plan.goal || '',
            frequency: plan.frequency || '',
            difficulty: plan.difficulty || null,
            plan_data: plan,
            is_active: true,
          }, {
            onConflict: 'user_id',
          });

        if (error) throw error;
      }

      set({ workoutPlan: plan });
    } catch (error) {
      console.error('Error saving workout plan:', error);
      set({ workoutPlan: plan });
    }
  },

  loadWorkoutPlan: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Use maybeSingle() - returns null if no rows

      if (error && error.code !== 'PGRST116') {
        console.warn('Error loading workout plan:', error);
        return;
      }

      if (data) {
        set({ workoutPlan: data.plan_data });
      }
    } catch (error) {
      console.error('Error loading workout plan:', error);
    }
  },

  // ============================================
  // WORKOUT TRACKING
  // ============================================
  
  completeWorkout: async (date, workoutType) => {
    const { user } = get();
    if (!user) return;

    try {
      // Insert completion
      await supabase
        .from('workout_completions')
        .upsert({
          user_id: user.id,
          date,
          workout_type: workoutType,
        }, {
          onConflict: 'user_id,date',
        });

      // Remove from misses if it was there
      await supabase
        .from('workout_misses')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      // Update local state
      set((state) => {
        const completed = { ...state.workoutTracking.completedWorkouts, [date]: true };
        const missed = { ...state.workoutTracking.missedWorkouts };
        delete missed[date];
        return {
          workoutTracking: {
            ...state.workoutTracking,
            completedWorkouts: completed,
            missedWorkouts: missed,
          },
        };
      });
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  },

  markWorkoutMissed: async (date, workoutType) => {
    const { user } = get();
    if (!user) return;

    try {
      // Insert miss
      await supabase
        .from('workout_misses')
        .upsert({
          user_id: user.id,
          date,
          workout_type: workoutType,
        }, {
          onConflict: 'user_id,date',
        });

      // Remove from completions if it was there
      await supabase
        .from('workout_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      // Update local state
      set((state) => {
        const missed = { ...state.workoutTracking.missedWorkouts, [date]: true };
        const completed = { ...state.workoutTracking.completedWorkouts };
        delete completed[date];
        return {
          workoutTracking: {
            ...state.workoutTracking,
            missedWorkouts: missed,
            completedWorkouts: completed,
          },
        };
      });
    } catch (error) {
      console.error('Error marking workout missed:', error);
    }
  },

  loadWorkoutTracking: async () => {
    const { user } = get();
    if (!user) return;

    try {
      // Load day one - use maybeSingle() since user might not have tracking data yet
      const { data: trackingData, error: trackingError } = await supabase
        .from('workout_tracking')
        .select('day_one')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() - returns null if no rows
      
      if (trackingError && trackingError.code !== 'PGRST116') {
        console.warn('Error loading workout tracking:', trackingError);
      }

      // Load completions
      const { data: completions } = await supabase
        .from('workout_completions')
        .select('date')
        .eq('user_id', user.id);

      // Load misses
      const { data: misses } = await supabase
        .from('workout_misses')
        .select('date')
        .eq('user_id', user.id);

      const completedWorkouts: Record<string, boolean> = {};
      (completions || []).forEach((c) => {
        completedWorkouts[c.date] = true;
      });

      const missedWorkouts: Record<string, boolean> = {};
      (misses || []).forEach((m) => {
        missedWorkouts[m.date] = true;
      });

      set({
        workoutTracking: {
          dayOne: trackingData?.day_one || null,
          completedWorkouts,
          missedWorkouts,
        },
      });
    } catch (error) {
      console.error('Error loading workout tracking:', error);
    }
  },

  // ============================================
  // PROFILE DATA
  // ============================================
  
  loadProfileData: async () => {
    const { user } = get();
    if (!user) {
      console.warn('loadProfileData called but no user is authenticated');
      return;
    }

    try {
      // DON'T auto-load survey data - user should fill it out fresh each time
      // Only load persistent data (history, workout plans, etc.)
      
      // Load subscription status (non-blocking)
      // Don't use .single() - user might not have a profile row yet
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_tier, subscription_expires_at')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle() instead of single() - returns null if no row

        if (profileError) {
          // Only log if it's not a "no rows" error
          if (profileError.code !== 'PGRST116') {
            console.warn('Error loading profile (non-critical):', profileError);
          }
        } else if (profileData) {
          const isSubscribed = profileData.subscription_tier !== 'free' && 
            (!profileData.subscription_expires_at || new Date(profileData.subscription_expires_at) > new Date());
          set({ isSubscribed });
        }
        // If profileData is null, user just doesn't have a profile yet - that's fine
      } catch (profileErr) {
        console.warn('Profile loading failed (non-critical):', profileErr);
      }

      // Load persistent data (history, workout plans) - each independently
      // Don't fail if one fails
      Promise.allSettled([
        get().loadBodyFatHistory().catch(err => console.warn('Body fat history load failed:', err)),
        get().loadWorkoutPlan().catch(err => console.warn('Workout plan load failed:', err)),
        get().loadWorkoutTracking().catch(err => console.warn('Workout tracking load failed:', err)),
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Don't throw - this is non-critical
    }
  },

  saveProfileData: async () => {
    // Profile data is saved automatically via setSurveyData
    // This is kept for backwards compatibility
    await get().setSurveyData(get().surveyData);
  },

  getDailyStreak: () => {
    const { bodyFatHistory } = get();
    if (bodyFatHistory.length === 0) return 0;
    
    const uniqueDates = new Set<string>();
    bodyFatHistory.forEach(entry => {
      uniqueDates.add(entry.date);
    });
    
    const sortedDates = Array.from(uniqueDates)
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    if (sortedDates.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentDate = sortedDates[0];
    mostRecentDate.setHours(0, 0, 0, 0);
    
    if (mostRecentDate.getTime() < yesterday.getTime()) {
      return 0;
    }
    
    let streak = 1;
    let currentDate = new Date(mostRecentDate);
    
    for (let i = 1; i < sortedDates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      expectedDate.setHours(0, 0, 0, 0);
      
      const checkDate = new Date(sortedDates[i]);
      checkDate.setHours(0, 0, 0, 0);
      
      if (checkDate.getTime() === expectedDate.getTime()) {
        streak++;
        currentDate = new Date(checkDate);
      } else {
        break;
      }
    }
    
    return streak;
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsSubscribed: (subscribed) => set({ isSubscribed: subscribed }),
  resetSurvey: () => set({
    surveyData: initialSurveyData,
    currentStep: 1,
    capturedImage: null,
    capturedImages: [],
    currentAngle: 'front',
    bodyFatPercentage: null,
    isLoading: false,
  }),
}));
