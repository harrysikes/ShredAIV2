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

export interface AppState {
  surveyData: SurveyData;
  currentStep: number;
  capturedImage: string | null; // Keep for backwards compatibility
  capturedImages: CapturedImageData[]; // New: multiple angles
  currentAngle: CameraAngle;
  bodyFatPercentage: number | null;
  bodyFatHistory: BodyFatHistoryEntry[];
  workoutPlan: any | null;
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
  setIsLoading: (loading: boolean) => void;
  setIsSubscribed: (subscribed: boolean) => void;
  resetSurvey: () => void;
  loadProfileData: () => Promise<void>;
  saveProfileData: () => Promise<void>;
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
    
    let updatedHistory: BodyFatHistoryEntry[];
    
    set((state) => {
      // Always add new entry (allow multiple scans per day)
      // The entry has a full timestamp, so each scan gets a unique entry
      updatedHistory = [...state.bodyFatHistory, entry].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      return { bodyFatHistory: updatedHistory };
    });
    
    // Save to AsyncStorage using the updated history we just computed
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
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
}));
