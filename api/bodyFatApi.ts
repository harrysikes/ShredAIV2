import { SurveyData } from '../state/surveyStore';

export interface BodyFatRequest {
  surveyData: SurveyData;
  imageData: string; // base64 encoded image
}

export interface BodyFatResponse {
  bodyFatPercentage: number;
  confidence: number;
  analysis: {
    surveyEstimate: number;
    imageEstimate: number;
    combinedEstimate: number;
  };
}

// Mock API implementation
export const calculateBodyFat = async (
  request: BodyFatRequest
): Promise<BodyFatResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Generate realistic body fat estimates based on survey data
  const { surveyData } = request;
  
  // Base estimates by sex and age
  let baseEstimate = 0;
  if (surveyData.sex === 'male') {
    baseEstimate = 15; // Average male body fat
  } else {
    baseEstimate = 25; // Average female body fat
  }
  
  // Adjust by age (simplified)
  if (surveyData.dateOfBirth) {
    const age = new Date().getFullYear() - surveyData.dateOfBirth.getFullYear();
    if (age > 40) baseEstimate += 2;
    if (age > 60) baseEstimate += 3;
  }
  
  // Adjust by exercise frequency
  if (surveyData.exerciseFrequency === '7 days') baseEstimate -= 3;
  else if (surveyData.exerciseFrequency === '5-6 days') baseEstimate -= 2;
  else if (surveyData.exerciseFrequency === '3-4 days') baseEstimate -= 1;
  
  // Adjust by goal
  if (surveyData.workoutGoal === 'lose fat') baseEstimate -= 2;
  else if (surveyData.workoutGoal === 'gain muscle') baseEstimate += 1;
  
  // Generate random variation for image analysis
  const imageVariation = (Math.random() - 0.5) * 6; // ±3%
  const imageEstimate = Math.max(8, Math.min(35, baseEstimate + imageVariation));
  
  // Combine survey and image estimates (50/50 weight)
  const combinedEstimate = (baseEstimate + imageEstimate) / 2;
  
  // Add some final randomness for realism
  const finalEstimate = Math.max(8, Math.min(35, combinedEstimate + (Math.random() - 0.5) * 2));
  
  return {
    bodyFatPercentage: Math.round(finalEstimate * 10) / 10,
    confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
    analysis: {
      surveyEstimate: Math.round(baseEstimate * 10) / 10,
      imageEstimate: Math.round(imageEstimate * 10) / 10,
      combinedEstimate: Math.round(combinedEstimate * 10) / 10,
    },
  };
};
