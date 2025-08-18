import { create } from 'zustand';

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
  workoutGoal: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | 'sports-performance' | null;
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
  weight: { value: 150, unit: 'lbs' },
  exerciseFrequency: null,
  workoutGoal: null,
};

export const useSurveyStore = create<AppState>((set) => ({
  surveyData: initialSurveyData,
  currentStep: 1,
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
      currentStep: 1,
      capturedImage: null,
      bodyFatPercentage: null,
      isLoading: false,
    }),
}));
