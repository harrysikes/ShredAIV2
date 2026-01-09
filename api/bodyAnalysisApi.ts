import { getApiConfig, API_ENDPOINTS, getApiHeaders } from './config';

export interface BodyAnalysisRequest {
  images: string[]; // Base64 encoded images
  surveyData: {
    sex: 'male' | 'female' | null;
    dateOfBirth: Date | null;
    height: { feet: number; inches: number } | null;
    weight: { value: number; unit: 'lbs' | 'kg' } | null;
    exerciseFrequency: string | null;
    workoutGoal: string | null;
  };
}

export interface BodyAnalysisResponse {
  success: boolean;
  data?: {
    bodyFatPercentage: number;
    confidence: number;
    muscleVisibility: any;
    bodyProportions: any;
    analysis: any;
    technicalDetails: any;
  };
  error?: string;
  message?: string;
}

/**
 * Real AI Body Analysis API
 * Calls the backend OpenAI GPT-4o Vision API for actual body composition analysis
 * Uses base64 JSON endpoint (simpler for React Native)
 */
export async function analyzeBodyComposition(
  request: BodyAnalysisRequest
): Promise<BodyAnalysisResponse> {
  try {
    const config = getApiConfig();
    // Use base64 endpoint for React Native (simpler than FormData)
    const url = `${config.baseURL}/api/body-analysis/analyze-base64`;

    // Prepare survey data for API
    const age = request.surveyData.dateOfBirth
      ? Math.floor((new Date().getTime() - new Date(request.surveyData.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
      : 25; // Default age if not provided

    const height = request.surveyData.height || { feet: 5, inches: 10 };
    const weight = request.surveyData.weight || { value: 150, unit: 'lbs' };

    // Convert weight to pounds if in kg
    const weightInLbs = weight.unit === 'kg' ? weight.value * 2.20462 : weight.value;

    // Prepare images (ensure they have data URL prefix for consistency)
    const imagesForApi = request.images.map(img => {
      // Add data URL prefix if not present
      if (!img.startsWith('data:image/')) {
        return `data:image/jpeg;base64,${img}`;
      }
      return img;
    });

    // Prepare survey data
    const surveyDataForApi = {
      sex: request.surveyData.sex || 'male',
      age: age,
      height: {
        feet: height.feet,
        inches: height.inches,
      },
      weight: {
        value: weightInLbs,
        unit: 'lbs',
      },
      exerciseFrequency: request.surveyData.exerciseFrequency || 'sometimes',
      workoutGoal: request.surveyData.workoutGoal || 'maintain',
    };

    // Make API call with JSON payload (base64 images)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getApiHeaders(),
      },
      body: JSON.stringify({
        images: imagesForApi,
        surveyData: surveyDataForApi,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.error) {
      return {
        success: false,
        error: result.message || result.error || 'Analysis failed',
      };
    }

    return {
      success: true,
      data: result.data,
    };

  } catch (error: any) {
    console.error('Body analysis API error:', error);
    return {
      success: false,
      error: error.message || 'Failed to analyze body composition. Please try again.',
    };
  }
}
