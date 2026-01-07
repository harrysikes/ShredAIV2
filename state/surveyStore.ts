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
  workoutGoal: 'lose-weight' | 'build-muscle' | 'maintain' | 'improve-fitness' | null;
}

export type CameraAngle = 'front' | 'side' | 'back';

export interface CapturedImageData {
  angle: CameraAngle;
  base64: string;
}

export interface AppState {
  surveyData: SurveyData;
  currentStep: number;
  capturedImage: string | null; // Keep for backwards compatibility
  capturedImages: CapturedImageData[]; // New: multiple angles
  currentAngle: CameraAngle;
  bodyFatPercentage: number | null;
  isLoading: boolean;
  isSubscribed: boolean;
  setSurveyData: (data: Partial<SurveyData>) => void;
  setCurrentStep: (step: number) => void;
  setCapturedImage: (image: string | null) => void; // Keep for backwards compatibility
  setCapturedImages: (images: CapturedImageData[]) => void;
  addCapturedImage: (angle: CameraAngle, base64: string) => void;
  setCurrentAngle: (angle: CameraAngle) => void;
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
  capturedImages: [],
  currentAngle: 'front',
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
}));
