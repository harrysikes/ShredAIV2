import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}

export interface BodyFatHistoryEntry {
  date: string; // ISO date string
  bodyFatPercentage: number;
  weight?: number;
}

export interface WorkoutTracking {
  dayOne: string | null; // ISO date string of first BF% log
  completedWorkouts: Record<string, boolean>; // date -> true
  missedWorkouts: Record<string, boolean>; // date -> true
}

export interface AppState {
  surveyData: SurveyData;
  currentStep: number;
  capturedImage: string | null; // Keep for backwards compatibility
  capturedImages: CapturedImageData[]; // New: multiple angles
  currentAngle: CameraAngle;
  bodyFatPercentage: number | null;
  bodyFatHistory: BodyFatHistoryEntry[];
  workoutPlan: any | null;
  workoutTracking: WorkoutTracking;
  isLoading: boolean;
  isSubscribed: boolean;
  setSurveyData: (data: Partial<SurveyData>) => void;
  setCurrentStep: (step: number) => void;
  setCapturedImage: (image: string | null) => void; // Keep for backwards compatibility
  setCapturedImages: (images: CapturedImageData[]) => void;
  addCapturedImage: (angle: CameraAngle, base64: string) => void;
  setCurrentAngle: (angle: CameraAngle) => void;
  setBodyFatPercentage: (percentage: number | null) => void;
  addBodyFatHistory: (bodyFatPercentage: number, weight?: number) => void;
  removeBodyFatHistory: (date: string) => void;
  setWorkoutPlan: (plan: any | null) => void;
  completeWorkout: (date: string) => Promise<void>;
  markWorkoutMissed: (date: string) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setIsSubscribed: (subscribed: boolean) => void;
  resetSurvey: () => void;
  loadProfileData: () => Promise<void>;
  saveProfileData: () => Promise<void>;
  getDailyStreak: () => number;
}

const initialSurveyData: SurveyData = {
  sex: null,
  dateOfBirth: null,
  height: null,
  weight: { value: 150, unit: 'lbs' },
  exerciseFrequency: null,
  workoutGoal: null,
};

const STORAGE_KEYS = {
  PROFILE: '@shredai_profile',
  HISTORY: '@shredai_history',
  WORKOUT_PLAN: '@shredai_workout_plan',
  WORKOUT_TRACKING: '@shredai_workout_tracking',
};

export const useSurveyStore = create<AppState>((set, get) => ({
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
  
  setSurveyData: (data) =>
    set((state) => ({
      surveyData: { ...state.surveyData, ...data },
    })),
    
  setCurrentStep: (step) =>
    set({ currentStep: step }),
    
  setCapturedImage: (image) =>
    set({ capturedImage: image }),
    
  setCapturedImages: (images) =>
    set({ capturedImages: images }),
    
  addCapturedImage: (angle, base64) =>
    set((state) => {
      const existing = state.capturedImages.findIndex(img => img.angle === angle);
      const updated = existing >= 0
        ? state.capturedImages.map((img, idx) => idx === existing ? { angle, base64 } : img)
        : [...state.capturedImages, { angle, base64 }];
      return { 
        capturedImages: updated,
        capturedImage: base64, // Keep backwards compatibility - use latest image
      };
    }),
    
  setCurrentAngle: (angle) =>
    set({ currentAngle: angle }),
    
  setBodyFatPercentage: (percentage) =>
    set({ bodyFatPercentage: percentage }),
    
  addBodyFatHistory: async (bodyFatPercentage, weight) => {
    const entry: BodyFatHistoryEntry = {
      date: new Date().toISOString(),
      bodyFatPercentage,
      weight,
    };
    
    let updatedHistory: BodyFatHistoryEntry[] = [];
    let dayOne: string | null = null;
    
    set((state) => {
      // Always add new entry (allow multiple scans per day)
      // The entry has a full timestamp, so each scan gets a unique entry
      updatedHistory = [...state.bodyFatHistory, entry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      // Set dayOne if this is the first entry
      if (state.workoutTracking.dayOne === null && updatedHistory.length > 0) {
        dayOne = updatedHistory[0].date.split('T')[0]; // Store just the date part
      } else {
        dayOne = state.workoutTracking.dayOne;
      }
      
      return { 
        bodyFatHistory: updatedHistory,
        workoutTracking: {
          ...state.workoutTracking,
          dayOne: dayOne || state.workoutTracking.dayOne,
        },
      };
    });
    
    // Save to AsyncStorage using the updated history we just computed
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
      if (dayOne) {
        const { workoutTracking } = get();
        await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TRACKING, JSON.stringify({
          ...workoutTracking,
          dayOne,
        }));
      }
      console.log('History saved successfully:', updatedHistory.length, 'entries');
    } catch (error) {
      console.error('Error saving history:', error);
    }
  },
  
  removeBodyFatHistory: async (date) => {
    set((state) => {
      const updatedHistory = state.bodyFatHistory.filter(
        entry => entry.date !== date
      );
      return { bodyFatHistory: updatedHistory };
    });
    
    // Save to AsyncStorage
    const { bodyFatHistory } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(bodyFatHistory));
    } catch (error) {
      console.error('Error saving history after deletion:', error);
    }
  },
  
  setWorkoutPlan: (plan) => {
    set({ workoutPlan: plan });
    // Save to AsyncStorage
    if (plan) {
      AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_PLAN, JSON.stringify(plan)).catch(
        (error) => console.error('Error saving workout plan:', error)
      );
    }
  },
  
  completeWorkout: async (date) => {
    set((state) => {
      const completed = { ...state.workoutTracking.completedWorkouts, [date]: true };
      const missed = { ...state.workoutTracking.missedWorkouts };
      delete missed[date]; // Remove from missed if it was there
      
      return {
        workoutTracking: {
          ...state.workoutTracking,
          completedWorkouts: completed,
          missedWorkouts: missed,
        },
      };
    });
    
    // Save to AsyncStorage
    const { workoutTracking } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TRACKING, JSON.stringify(workoutTracking));
    } catch (error) {
      console.error('Error saving workout completion:', error);
    }
  },
  
  markWorkoutMissed: async (date) => {
    set((state) => {
      const missed = { ...state.workoutTracking.missedWorkouts, [date]: true };
      const completed = { ...state.workoutTracking.completedWorkouts };
      delete completed[date]; // Remove from completed if it was there
      
      return {
        workoutTracking: {
          ...state.workoutTracking,
          missedWorkouts: missed,
          completedWorkouts: completed,
        },
      };
    });
    
    // Save to AsyncStorage
    const { workoutTracking } = get();
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TRACKING, JSON.stringify(workoutTracking));
    } catch (error) {
      console.error('Error saving missed workout:', error);
    }
  },
  
  setIsLoading: (loading) =>
    set({ isLoading: loading }),
    
  setIsSubscribed: (subscribed) =>
    set({ isSubscribed: subscribed }),
    
  resetSurvey: () =>
    set({
      surveyData: initialSurveyData,
      currentStep: 1,
      capturedImage: null,
      capturedImages: [],
      currentAngle: 'front',
      bodyFatPercentage: null,
      isLoading: false,
    }),
    
  loadProfileData: async () => {
    try {
      // Load history
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (historyJson) {
        const history = JSON.parse(historyJson);
        set({ bodyFatHistory: history });
        
        // Set dayOne from first history entry if not already set
        if (history.length > 0) {
          const sorted = [...history].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          const firstDate = sorted[0].date.split('T')[0];
          
          const trackingJson = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TRACKING);
          let tracking = { dayOne: null, completedWorkouts: {}, missedWorkouts: {} };
          
          if (trackingJson) {
            tracking = JSON.parse(trackingJson);
          }
          
          if (!tracking.dayOne) {
            tracking.dayOne = firstDate;
            await AsyncStorage.setItem(STORAGE_KEYS.WORKOUT_TRACKING, JSON.stringify(tracking));
          }
          
          set({ workoutTracking: tracking });
        }
      }
      
      // Load workout tracking
      const trackingJson = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_TRACKING);
      if (trackingJson) {
        const tracking = JSON.parse(trackingJson);
        set({ workoutTracking: tracking });
      }
      
      // Load workout plan
      const planJson = await AsyncStorage.getItem(STORAGE_KEYS.WORKOUT_PLAN);
      if (planJson) {
        const plan = JSON.parse(planJson);
        set({ workoutPlan: plan });
      }
      
      // Load profile data
      const profileJson = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (profileJson) {
        const profile = JSON.parse(profileJson);
        // Restore survey data and other profile info
        if (profile.surveyData) {
          // Convert dateOfBirth back to Date if it exists
          if (profile.surveyData.dateOfBirth) {
            profile.surveyData.dateOfBirth = new Date(profile.surveyData.dateOfBirth);
          }
          set({ surveyData: profile.surveyData });
        }
        if (profile.bodyFatPercentage !== undefined) {
          set({ bodyFatPercentage: profile.bodyFatPercentage });
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  },
  
  saveProfileData: async () => {
    try {
      const state = get();
      const profileData = {
        surveyData: state.surveyData,
        bodyFatPercentage: state.bodyFatPercentage,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileData));
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  },
  
  getDailyStreak: () => {
    const { bodyFatHistory } = get();
    if (bodyFatHistory.length === 0) return 0;
    
    // Get unique dates (one entry per day counts)
    const uniqueDates = new Set<string>();
    bodyFatHistory.forEach(entry => {
      const date = new Date(entry.date);
      const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      uniqueDates.add(dateKey);
    });
    
    // Sort dates in descending order
    const sortedDates = Array.from(uniqueDates)
      .map(dateKey => {
        const [year, month, day] = dateKey.split('-').map(Number);
        return new Date(year, month, day);
      })
      .sort((a, b) => b.getTime() - a.getTime());
    
    if (sortedDates.length === 0) return 0;
    
    // Check if today or yesterday has an entry
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const mostRecentDate = sortedDates[0];
    mostRecentDate.setHours(0, 0, 0, 0);
    
    // If most recent entry is not today or yesterday, streak is broken
    if (mostRecentDate.getTime() < yesterday.getTime()) {
      return 0;
    }
    
    // Calculate consecutive days
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
}));
