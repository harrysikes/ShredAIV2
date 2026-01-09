import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase URL and anon key from environment variables
// For Expo, configure in app.json under "extra" or use environment variables
const supabaseUrl = 
  Constants.expoConfig?.extra?.supabaseUrl || 
  process.env.EXPO_PUBLIC_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Missing Supabase environment variables.\n' +
    'Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in app.json or .env file.\n' +
    'See SUPABASE_SETUP.md for instructions.'
  );
  // Don't throw - allow app to start but auth will fail gracefully
}

// Create Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (matching our schema)
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          updated_at: string;
          subscription_tier: 'free' | 'monthly' | 'yearly';
          subscription_expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          subscription_tier?: 'free' | 'monthly' | 'yearly';
          subscription_expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          email?: string;
          name?: string | null;
          subscription_tier?: 'free' | 'monthly' | 'yearly';
          subscription_expires_at?: string | null;
          is_active?: boolean;
        };
      };
      survey_data: {
        Row: {
          id: string;
          user_id: string;
          sex: 'male' | 'female' | null;
          date_of_birth: string | null;
          height_feet: number | null;
          height_inches: number | null;
          weight_value: number | null;
          weight_unit: 'lbs' | 'kg' | null;
          exercise_frequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'very-often' | null;
          workout_goal: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          sex?: 'male' | 'female' | null;
          date_of_birth?: string | null;
          height_feet?: number | null;
          height_inches?: number | null;
          weight_value?: number | null;
          weight_unit?: 'lbs' | 'kg' | null;
          exercise_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'very-often' | null;
          workout_goal?: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | null;
        };
        Update: {
          sex?: 'male' | 'female' | null;
          date_of_birth?: string | null;
          height_feet?: number | null;
          height_inches?: number | null;
          weight_value?: number | null;
          weight_unit?: 'lbs' | 'kg' | null;
          exercise_frequency?: 'never' | 'rarely' | 'sometimes' | 'often' | 'very-often' | null;
          workout_goal?: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | null;
        };
      };
      body_fat_history: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          body_fat_percentage: number;
          weight: number | null;
          method: 'ai_vision' | 'manual' | 'calibrated';
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          date: string;
          body_fat_percentage: number;
          weight?: number | null;
          method?: 'ai_vision' | 'manual' | 'calibrated';
          image_url?: string | null;
        };
        Update: {
          body_fat_percentage?: number;
          weight?: number | null;
          method?: 'ai_vision' | 'manual' | 'calibrated';
          image_url?: string | null;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          goal: string;
          frequency: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          plan_data: any; // JSONB
          generated_at: string;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          user_id: string;
          goal: string;
          frequency: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          plan_data: any;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          goal?: string;
          frequency?: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null;
          plan_data?: any;
          expires_at?: string | null;
          is_active?: boolean;
        };
      };
      workout_tracking: {
        Row: {
          id: string;
          user_id: string;
          day_one: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          day_one: string;
        };
        Update: {
          day_one?: string;
        };
      };
      workout_completions: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          workout_type: string;
          completed_at: string;
          notes: string | null;
        };
        Insert: {
          user_id: string;
          date: string;
          workout_type: string;
          notes?: string | null;
        };
        Update: {
          workout_type?: string;
          notes?: string | null;
        };
      };
      workout_misses: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          workout_type: string;
          marked_at: string;
          reason: string | null;
        };
        Insert: {
          user_id: string;
          date: string;
          workout_type: string;
          reason?: string | null;
        };
        Update: {
          workout_type?: string;
          reason?: string | null;
        };
      };
    };
  };
}
