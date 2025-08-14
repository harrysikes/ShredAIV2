export interface HumanDetectionRequest {
  imageData: string; // base64 encoded image
  imageFormat?: 'jpg' | 'png';
}

export interface HumanDetectionResponse {
  humanDetected: boolean;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  message: string;
}

/**
 * Human Detection API Service
 * 
 * This is a mock implementation that simulates AI-powered human detection.
 * In production, you would replace this with:
 * - Google Vision API (Person Detection)
 * - Azure Computer Vision (Person Detection)
 * - AWS Rekognition (Person Detection)
 * - Custom ML model
 * 
 * The mock provides realistic behavior for testing and development.
 */
export const detectHuman = async (
  request: HumanDetectionRequest
): Promise<HumanDetectionResponse> => {
  try {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 500));
    
    // Mock detection logic with realistic behavior
    const imageSize = request.imageData.length;
    
    // Simulate detection based on image characteristics
    // In reality, this would be AI analysis of the image content
    let humanDetected = false;
    let confidence = 0;
    let message = '';
    
    // Simulate different detection scenarios
    const random = Math.random();
    
    if (random < 0.85) {
      // 85% chance of detecting a human (realistic success rate)
      humanDetected = true;
      confidence = 0.7 + (random * 0.3); // 70-100% confidence
      message = 'Person detected successfully';
      
      // Simulate bounding box (in real API, this would be actual coordinates)
      if (confidence > 0.9) {
        // High confidence detection
        message = 'Person clearly visible in frame';
      }
    } else {
      // 15% chance of no detection (simulating edge cases)
      humanDetected = false;
      confidence = 0.1 + (random * 0.4); // 10-50% confidence
      
      // Simulate different failure reasons
      if (random < 0.3) {
        message = 'No person visible in frame';
      } else if (random < 0.6) {
        message = 'Person partially visible or too small';
      } else {
        message = 'Image too dark or unclear for detection';
      }
    }
    
    // Add some randomness to make it feel more realistic
    if (imageSize < 10000) {
      // Very small images are less likely to have clear person detection
      humanDetected = humanDetected && (random > 0.2);
      if (!humanDetected) {
        message = 'Image resolution too low for accurate detection';
      }
    }
    
    return {
      humanDetected,
      confidence: Math.round(confidence * 100) / 100,
      message,
      boundingBox: humanDetected ? {
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100),
        width: 60 + Math.floor(Math.random() * 30),
        height: 80 + Math.floor(Math.random() * 40),
      } : undefined,
    };
    
  } catch (error) {
    console.error('Human detection API error:', error);
    
    // Return a safe fallback response
    return {
      humanDetected: false,
      confidence: 0,
      message: 'Detection service temporarily unavailable',
    };
  }
};

/**
 * Enhanced human detection with multiple retry attempts
 * Useful for handling temporary API failures
 */
export const detectHumanWithRetry = async (
  request: HumanDetectionRequest,
  maxRetries: number = 2
): Promise<HumanDetectionResponse> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await detectHuman(request);
    } catch (error) {
      lastError = error as Error;
      console.warn(`Human detection attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  
  // All retries failed
  throw lastError || new Error('Human detection failed after all retry attempts');
};
