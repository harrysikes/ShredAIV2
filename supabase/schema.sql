-- ShredAI V2 Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'monthly', 'yearly')),
  subscription_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- SURVEY DATA
-- ============================================
CREATE TABLE IF NOT EXISTS public.survey_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sex TEXT CHECK (sex IN ('male', 'female')),
  date_of_birth DATE,
  height_feet INTEGER,
  height_inches INTEGER,
  weight_value DECIMAL(5,2),
  weight_unit TEXT CHECK (weight_unit IN ('lbs', 'kg')),
  exercise_frequency TEXT CHECK (exercise_frequency IN ('never', 'rarely', 'sometimes', 'often', 'very-often')),
  workout_goal TEXT CHECK (workout_goal IN ('lose-weight', 'build-muscle', 'maintain', 'improve-fitness')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- BODY FAT HISTORY
-- ============================================
CREATE TABLE IF NOT EXISTS public.body_fat_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  body_fat_percentage DECIMAL(4,2) NOT NULL,
  weight DECIMAL(5,2),
  method TEXT DEFAULT 'ai_vision' CHECK (method IN ('ai_vision', 'manual', 'calibrated')),
  image_url TEXT, -- Reference to Supabase Storage
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_body_fat_history_user_date ON public.body_fat_history(user_id, date DESC);

-- ============================================
-- WORKOUT PLANS
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  goal TEXT NOT NULL,
  frequency TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  plan_data JSONB NOT NULL, -- Full workout plan structure
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_workout_plans_user_active ON public.workout_plans(user_id, is_active);

-- ============================================
-- WORKOUT TRACKING
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_tracking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_one DATE NOT NULL, -- First BF% log date
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- WORKOUT COMPLETIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_completions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  workout_type TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_workout_completions_user_date ON public.workout_completions(user_id, date DESC);

-- ============================================
-- WORKOUT MISSES
-- ============================================
CREATE TABLE IF NOT EXISTS public.workout_misses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  workout_type TEXT NOT NULL,
  marked_at TIMESTAMPTZ DEFAULT NOW(),
  reason TEXT,
  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_workout_misses_user_date ON public.workout_misses(user_id, date DESC);

-- ============================================
-- CALIBRATION DATA (for accuracy improvement)
-- ============================================
CREATE TABLE IF NOT EXISTS public.calibration_data (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  analysis_id TEXT,
  estimated_body_fat DECIMAL(4,2) NOT NULL,
  actual_body_fat DECIMAL(4,2) NOT NULL,
  measurement_method TEXT,
  confidence DECIMAL(3,2),
  image_quality DECIMAL(3,2),
  survey_data JSONB,
  accuracy DECIMAL(5,2),
  error DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calibration_user ON public.calibration_data(user_id, created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_fat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_misses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calibration_data ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Survey Data: Users can manage their own survey data
DROP POLICY IF EXISTS "Users can manage own survey data" ON public.survey_data;
CREATE POLICY "Users can manage own survey data" ON public.survey_data
  FOR ALL USING (auth.uid() = user_id);

-- Body Fat History: Users can manage their own history
DROP POLICY IF EXISTS "Users can manage own body fat history" ON public.body_fat_history;
CREATE POLICY "Users can manage own body fat history" ON public.body_fat_history
  FOR ALL USING (auth.uid() = user_id);

-- Workout Plans: Users can manage their own plans
DROP POLICY IF EXISTS "Users can manage own workout plans" ON public.workout_plans;
CREATE POLICY "Users can manage own workout plans" ON public.workout_plans
  FOR ALL USING (auth.uid() = user_id);

-- Workout Tracking: Users can manage their own tracking
DROP POLICY IF EXISTS "Users can manage own workout tracking" ON public.workout_tracking;
CREATE POLICY "Users can manage own workout tracking" ON public.workout_tracking
  FOR ALL USING (auth.uid() = user_id);

-- Workout Completions: Users can manage their own completions
DROP POLICY IF EXISTS "Users can manage own workout completions" ON public.workout_completions;
CREATE POLICY "Users can manage own workout completions" ON public.workout_completions
  FOR ALL USING (auth.uid() = user_id);

-- Workout Misses: Users can manage their own misses
DROP POLICY IF EXISTS "Users can manage own workout misses" ON public.workout_misses;
CREATE POLICY "Users can manage own workout misses" ON public.workout_misses
  FOR ALL USING (auth.uid() = user_id);

-- Calibration Data: Users can manage their own calibration data
DROP POLICY IF EXISTS "Users can manage own calibration data" ON public.calibration_data;
CREATE POLICY "Users can manage own calibration data" ON public.calibration_data
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_survey_data_updated_at ON public.survey_data;
CREATE TRIGGER update_survey_data_updated_at BEFORE UPDATE ON public.survey_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workout_tracking_updated_at ON public.workout_tracking;
CREATE TRIGGER update_workout_tracking_updated_at BEFORE UPDATE ON public.workout_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
