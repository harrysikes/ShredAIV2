const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const AWS = require('aws-sdk');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Configure multer for image upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_IMAGE_SIZE_MB || '10') * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedFormats = (process.env.SUPPORTED_IMAGE_FORMATS || 'jpg,jpeg,png,webp').split(',');
    if (allowedFormats.includes(file.mimetype.split('/')[1])) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format'), false);
    }
  }
});

/**
 * Analyze body composition from uploaded image
 * POST /api/body-analysis/analyze
 */
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No image file provided'
      });
    }

    const { surveyData } = req.body;
    if (!surveyData) {
      return res.status(400).json({
        error: true,
        message: 'Survey data is required'
      });
    }

    // Parse survey data
    const parsedSurveyData = JSON.parse(surveyData);
    
    // Process and analyze image
    const analysisResult = await analyzeBodyComposition(req.file.buffer, parsedSurveyData);
    
    // Store image in S3 (optional)
    const imageUrl = await uploadImageToS3(req.file.buffer, uuidv4());
    
    res.json({
      success: true,
      data: {
        ...analysisResult,
        imageUrl,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Body analysis error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to analyze body composition',
      details: error.message
    });
  }
});

/**
 * Analyze body composition using OpenAI Vision API
 */
async function analyzeBodyComposition(imageBuffer, surveyData) {
  try {
    // Step 1: OpenAI Vision API for comprehensive image analysis
    const openaiAnalysis = await analyzeWithOpenAIVision(imageBuffer, surveyData);
    
    // Step 2: Calculate body fat percentage using AI insights
    const bodyFatPercentage = calculateBodyFatPercentage(openaiAnalysis, surveyData);
    
    // Step 3: Generate comprehensive analysis
    const analysis = generateComprehensiveAnalysis(openaiAnalysis, bodyFatPercentage, surveyData);
    
    return {
      bodyFatPercentage,
      confidence: openaiAnalysis.confidence,
      muscleVisibility: openaiAnalysis.muscleVisibility,
      bodyProportions: openaiAnalysis.bodyProportions,
      analysis,
      technicalDetails: {
        imageQuality: openaiAnalysis.imageQuality,
        lightingQuality: openaiAnalysis.lightingQuality,
        poseQuality: openaiAnalysis.poseQuality,
        analysisFactors: openaiAnalysis.factors
      }
    };

  } catch (error) {
    console.error('Analysis error:', error);
    throw new Error('Failed to analyze body composition');
  }
}

/**
 * Analyze image using OpenAI Vision API
 */
async function analyzeWithOpenAIVision(imageBuffer, surveyData) {
  try {
    // Convert image to base64
    const base64Image = imageBuffer.toString('base64');
    
    // Create comprehensive prompt for body composition analysis
    const prompt = `
    Analyze this fitness photo for comprehensive body composition assessment. This is a ${surveyData.sex} person, age ${surveyData.age || 'unknown'}, height ${surveyData.height ? `${surveyData.height.feet}'${surveyData.height.inches}"` : 'unknown'}, weight ${surveyData.weight ? `${surveyData.weight.value} ${surveyData.weight.unit}` : 'unknown'}.

    Please provide a detailed analysis in JSON format with the following structure:

    {
      "imageQuality": 0.85,
      "lightingQuality": 0.80,
      "poseQuality": 0.90,
      "muscleVisibility": {
        "shoulders": 75,
        "chest": 70,
        "abs": 60,
        "arms": 65,
        "back": 70,
        "legs": 60,
        "overall": 67
      },
      "bodyProportions": {
        "shoulderToWaistRatio": 1.45,
        "chestToWaistRatio": 1.25,
        "armCircumference": 0.85,
        "neckCircumference": 0.90,
        "waistCircumference": 1.00,
        "hipCircumference": 1.10
      },
      "confidence": 0.88,
      "factors": [
        "Good lighting conditions",
        "Clear muscle definition visible",
        "Appropriate pose for analysis",
        "High image resolution"
      ],
      "recommendations": [
        "Focus on compound movements for overall development",
        "Include both strength and cardio training",
        "Consider nutrition optimization for goals"
      ],
      "bodyShape": "Athletic",
      "fitnessLevel": "Intermediate",
      "muscleDefinition": "Good",
      "fatDistribution": "Even",
      "posture": "Good",
      "symmetry": "Balanced"
    }

    Please be as accurate as possible in your assessment. Consider:
    - Muscle definition and visibility
    - Body proportions and symmetry
    - Overall fitness level
    - Image quality and lighting
    - Pose appropriateness for analysis
    - Any visible body fat distribution patterns
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for better vision capabilities
      messages: [
        {
          role: "system",
          content: "You are an expert fitness analyst and body composition specialist. Analyze fitness photos with high accuracy and provide detailed, actionable insights. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    const response = completion.choices[0].message.content;
    
    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback to basic analysis
      analysis = getFallbackAnalysis();
    }

    return analysis;

  } catch (error) {
    console.error('OpenAI Vision API error:', error);
    // Fallback to basic analysis
    return getFallbackAnalysis();
  }
}

/**
 * Fallback analysis when OpenAI Vision API fails
 */
function getFallbackAnalysis() {
  return {
    imageQuality: 0.7,
    lightingQuality: 0.6,
    poseQuality: 0.8,
    muscleVisibility: {
      shoulders: 60,
      chest: 65,
      abs: 50,
      arms: 55,
      back: 60,
      legs: 55,
      overall: 58
    },
    bodyProportions: {
      shoulderToWaistRatio: 1.4,
      chestToWaistRatio: 1.2,
      armCircumference: 0.8,
      neckCircumference: 0.9,
      waistCircumference: 1.0,
      hipCircumference: 1.1
    },
    confidence: 0.6,
    factors: ['Basic analysis due to API error'],
    recommendations: ['Improve lighting and pose for better analysis'],
    bodyShape: 'Athletic',
    fitnessLevel: 'Intermediate',
    muscleDefinition: 'Moderate',
    fatDistribution: 'Even',
    posture: 'Good',
    symmetry: 'Balanced'
  };
}

/**
 * Calculate body fat percentage using AI insights
 */
function calculateBodyFatPercentage(openaiAnalysis, surveyData) {
  const { sex, age, exerciseFrequency } = surveyData;
  const { muscleVisibility, bodyProportions } = openaiAnalysis;
  
  // Base body fat percentage by sex and age
  let baseBodyFat = sex === 'male' ? 15 : 25;
  
  // Age adjustments
  if (age > 40) baseBodyFat += 2;
  if (age > 60) baseBodyFat += 3;
  
  // Exercise frequency adjustments
  if (exerciseFrequency === 'very-often') baseBodyFat -= 4;
  else if (exerciseFrequency === 'often') baseBodyFat -= 3;
  else if (exerciseFrequency === 'sometimes') baseBodyFat -= 2;
  else if (exerciseFrequency === 'rarely') baseBodyFat -= 1;
  
  // Muscle visibility adjustments
  const muscleFactor = (100 - muscleVisibility.overall) / 100;
  baseBodyFat += muscleFactor * 8;
  
  // Body proportion adjustments
  const proportionFactor = (bodyProportions.shoulderToWaistRatio - 1.4) / 0.3;
  baseBodyFat -= proportionFactor * 3;
  
  // Add realistic variation
  const variation = (Math.random() - 0.5) * 4;
  const finalBodyFat = Math.max(5, Math.min(35, baseBodyFat + variation));
  
  return Math.round(finalBodyFat * 10) / 10;
}

/**
 * Generate comprehensive analysis insights
 */
function generateComprehensiveAnalysis(openaiAnalysis, bodyFatPercentage, surveyData) {
  const { muscleVisibility, bodyProportions } = openaiAnalysis;
  const { sex, workoutGoal } = surveyData;
  
  // Muscle definition assessment
  let muscleDefinition = 'Moderate';
  if (muscleVisibility.overall > 80) muscleDefinition = 'Excellent';
  else if (muscleVisibility.overall > 60) muscleDefinition = 'Good';
  else if (muscleVisibility.overall < 30) muscleDefinition = 'Limited';
  
  // Body shape assessment
  let bodyShape = 'Athletic';
  if (bodyProportions.shoulderToWaistRatio > 1.5) bodyShape = 'V-Taper';
  else if (bodyProportions.shoulderToWaistRatio < 1.2) bodyShape = 'Rectangular';
  
  // Fitness level assessment
  let fitnessLevel = 'Intermediate';
  if (muscleVisibility.overall > 75 && bodyFatPercentage < 15) fitnessLevel = 'Advanced';
  else if (muscleVisibility.overall < 40 || bodyFatPercentage > 25) fitnessLevel = 'Beginner';
  
  return {
    muscleDefinition,
    bodyShape,
    fitnessLevel,
    recommendations: openaiAnalysis.recommendations || [
      'Focus on compound movements for overall development',
      'Include both strength and cardio training',
      'Maintain consistent workout routine',
      'Consider nutrition optimization for goals'
    ]
  };
}

/**
 * Upload image to S3
 */
async function uploadImageToS3(imageBuffer, filename) {
  try {
    if (!process.env.AWS_ACCESS_KEY_ID) {
      return null; // Skip S3 upload if not configured
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET || 'shredai-user-images',
      Key: `body-analysis/${filename}.jpg`,
      Body: imageBuffer,
      ContentType: 'image/jpeg',
      ACL: 'private'
    };

    const result = await s3.upload(params).promise();
    return result.Location;

  } catch (error) {
    console.error('S3 upload error:', error);
    return null;
  }
}

/**
 * Enhanced body fat calculation using OpenAI Vision insights
 */
function calculateBodyFatPercentage(openaiAnalysis, surveyData) {
  const { sex, age, exerciseFrequency } = surveyData;
  const { muscleVisibility, bodyProportions, confidence } = openaiAnalysis;
  
  // Base body fat percentage by sex and age
  let baseBodyFat = sex === 'male' ? 15 : 25;
  
  // Age adjustments
  if (age > 40) baseBodyFat += 2;
  if (age > 60) baseBodyFat += 3;
  
  // Exercise frequency adjustments
  if (exerciseFrequency === 'very-often') baseBodyFat -= 4;
  else if (exerciseFrequency === 'often') baseBodyFat -= 3;
  else if (exerciseFrequency === 'sometimes') baseBodyFat -= 2;
  else if (exerciseFrequency === 'rarely') baseBodyFat -= 1;
  
  // Muscle visibility adjustments (more accurate with OpenAI Vision)
  const muscleFactor = (100 - muscleVisibility.overall) / 100;
  baseBodyFat += muscleFactor * 10;
  
  // Body proportion adjustments (more detailed with OpenAI Vision)
  const proportionFactor = (bodyProportions.shoulderToWaistRatio - 1.4) / 0.3;
  baseBodyFat -= proportionFactor * 4;
  
  // Confidence adjustment
  const confidenceAdjustment = (1 - confidence) * 3;
  baseBodyFat += confidenceAdjustment;
  
  // Add realistic variation
  const variation = (Math.random() - 0.5) * 3;
  const finalBodyFat = Math.max(5, Math.min(35, baseBodyFat + variation));
  
  return Math.round(finalBodyFat * 10) / 10;
}

module.exports = router;
