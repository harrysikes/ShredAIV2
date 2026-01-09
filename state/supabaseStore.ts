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
  signUp: (email: string, password: string, name?: string) => Promise<{ error: Error | null }>;
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
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null, isAuthenticated: !!session });
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, isAuthenticated: !!session });
        if (session) {
          // Load user data when authenticated
          get().loadProfileData();
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  },

  signUp: async (email: string, password: string, name?: string) => {
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

      if (error) {
        return { error };
      }

      if (data.session) {
        set({ 
          session: data.session, 
          user: data.user, 
          isAuthenticated: true 
        });
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.session) {
        set({ 
          session: data.session, 
          user: data.user, 
          isAuthenticated: true 
        });
        await get().loadProfileData();
      }

      return { error: null };
    } catch (error) {
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
        .single();

      if (error) {
        // If table doesn't exist or other database error, log but don't throw
        console.error('Error saving body fat history to database:', error);
        console.error('This might be because the database tables haven\'t been created yet.');
        console.error('Please run the SQL files in Supabase: schema.sql');
        // Still update local state
      } else {
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
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows

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
      // Load day one
      const { data: trackingData } = await supabase
        .from('workout_tracking')
        .select('day_one')
        .eq('user_id', user.id)
        .single();

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
    if (!user) return;

    try {
      // Load survey data
      const { data: surveyData } = await supabase
        .from('survey_data')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (surveyData) {
        const data: SurveyData = {
          sex: surveyData.sex,
          dateOfBirth: surveyData.date_of_birth ? new Date(surveyData.date_of_birth) : null,
          height: surveyData.height_feet !== null ? {
            feet: surveyData.height_feet,
            inches: surveyData.height_inches || 0,
          } : null,
          weight: surveyData.weight_value !== null ? {
            value: surveyData.weight_value,
            unit: surveyData.weight_unit || 'lbs',
          } : null,
          exerciseFrequency: surveyData.exercise_frequency,
          workoutGoal: surveyData.workout_goal,
        };
        set({ surveyData: data });
      }

      // Load subscription status
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, subscription_expires_at')
        .eq('id', user.id)
        .single();

      if (profile) {
        const isSubscribed = profile.subscription_tier !== 'free' && 
          (!profile.subscription_expires_at || new Date(profile.subscription_expires_at) > new Date());
        set({ isSubscribed });
      }

      // Load all data
      await Promise.all([
        get().loadBodyFatHistory(),
        get().loadWorkoutPlan(),
        get().loadWorkoutTracking(),
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
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
