import { create } from 'zustand';

export interface SurveyData {
  sex: 'male' | 'female' | null;
  dateOfBirth: Date | null;
  height: {
    feet: number;
    inches: number;
  } | null;
  weight: {
    value: number; // Always in pounds
  } | null;
  exerciseFrequency: '2-3 days' | '3-4 days' | '5-6 days' | '7 days' | null;
  workoutGoal: 'gain muscle' | 'lose fat' | 'improve endurance' | null;
}

export interface AppState {
  surveyData: SurveyData;
  currentStep: number;
  capturedImage: string | null;
  bodyFatPercentage: number | null;
  isLoading: boolean;
  isSubscribed: boolean;
  setSurveyData: (data: Partial<SurveyData>) => void;
  setCurrentStep: (step: number) => void;
  setCapturedImage: (image: string | null) => void;
  setBodyFatPercentage: (percentage: number | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsSubscribed: (subscribed: boolean) => void;
  resetSurvey: () => void;
}

const initialSurveyData: SurveyData = {
  sex: null,
  dateOfBirth: null,
  height: null,
  weight: null,
  exerciseFrequency: null,
  workoutGoal: null,
};

export const useSurveyStore = create<AppState>((set) => ({
  surveyData: initialSurveyData,
  currentStep: 0,
  capturedImage: null,
  bodyFatPercentage: null,
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
    
  setBodyFatPercentage: (percentage) =>
    set({ bodyFatPercentage: percentage }),
    
  setIsLoading: (loading) =>
    set({ isLoading: loading }),
    
  setIsSubscribed: (subscribed) =>
    set({ isSubscribed: subscribed }),
    
  resetSurvey: () =>
    set({
      surveyData: initialSurveyData,
      currentStep: 0,
      capturedImage: null,
      bodyFatPercentage: null,
      isLoading: false,
    }),
}));
