const express = require('express');
const OpenAI = require('openai');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Generate personalized workout plan
 * POST /api/workouts/generate
 */
router.post('/generate', async (req, res) => {
  try {
    const { surveyData, bodyFatPercentage, previousPlanId } = req.body;
    
    if (!surveyData) {
      return res.status(400).json({
        error: true,
        message: 'Survey data is required'
      });
    }

    // Generate workout plan using AI
    const workoutPlan = await generateWorkoutPlan(surveyData, bodyFatPercentage, previousPlanId);
    
    res.json({
      success: true,
      data: {
        ...workoutPlan,
        planId: uuidv4(),
        generatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      }
    });

  } catch (error) {
    console.error('Workout plan generation error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to generate workout plan',
      details: error.message
    });
  }
});

/**
 * Get workout plan by ID
 * GET /api/workouts/:planId
 */
router.get('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    
    // In a real app, you'd fetch this from a database
    // For now, return a mock response
    res.json({
      success: true,
      data: {
        planId,
        message: 'Workout plan retrieved successfully',
        note: 'Implement database storage for persistent workout plans'
      }
    });

  } catch (error) {
    console.error('Get workout plan error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve workout plan',
      details: error.message
    });
  }
});

/**
 * Update workout plan progress
 * PUT /api/workouts/:planId/progress
 */
router.put('/:planId/progress', async (req, res) => {
  try {
    const { planId } = req.params;
    const { completedWorkouts, measurements, feedback } = req.body;
    
    // In a real app, you'd update this in a database
    res.json({
      success: true,
      data: {
        planId,
        message: 'Progress updated successfully',
        completedWorkouts: completedWorkouts || 0,
        measurements,
        feedback,
        updatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      error: true,
      message: 'Failed to update progress',
      details: error.message
    });
  }
});

/**
 * Generate workout plan using AI
 */
async function generateWorkoutPlan(surveyData, bodyFatPercentage, previousPlanId) {
  try {
    const { sex, age, height, weight, exerciseFrequency, workoutGoal } = surveyData;
    
    // Create detailed prompt for AI workout generation
    const prompt = `
    Generate a comprehensive, personalized workout plan for a fitness app user:
    
    User Profile:
    - Sex: ${sex}
    - Age: ${age || 'Not specified'}
    - Height: ${height ? `${height.feet}'${height.inches}"` : 'Not specified'}
    - Weight: ${weight ? `${weight.value} ${weight.unit}` : 'Not specified'}
    - Exercise Frequency: ${exerciseFrequency}
    - Workout Goal: ${workoutGoal}
    - Body Fat Percentage: ${bodyFatPercentage || 'Not measured'}
    - Previous Plan ID: ${previousPlanId || 'None'}
    
    Requirements:
    1. Create a detailed workout plan with 3-7 days per week
    2. Include specific exercises with sets, reps, rest times, and equipment
    3. Provide progressive overload strategies
    4. Include warm-up and cool-down routines
    5. Add nutrition recommendations
    6. Include recovery and rest day guidance
    7. Provide form tips and safety considerations
    
    Format the response as a JSON object with this structure:
    {
      "goal": "string",
      "frequency": "string",
      "difficulty": "Beginner|Intermediate|Advanced",
      "days": [
        {
          "day": "string",
          "focus": "string",
          "intensity": "Low|Medium|High",
          "totalTime": "string",
          "warmup": ["string array"],
          "cooldown": ["string array"],
          "exercises": [
            {
              "name": "string",
              "sets": "number",
              "reps": "string",
              "equipment": "string",
              "restTime": "string",
              "difficulty": "string",
              "muscleGroups": ["string array"],
              "tips": "string",
              "progression": "string"
            }
          ]
        }
      ],
      "notes": ["string array"],
      "nutrition": ["string array"],
      "recovery": ["string array"],
      "progression": ["string array"],
      "equipment": ["string array"],
      "estimatedCalories": "number"
    }
    
    Make the plan highly personalized and actionable for the user's specific goals and fitness level.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert fitness trainer and nutritionist with 20+ years of experience. Create personalized, safe, and effective workout plans that consider individual fitness levels, goals, and limitations. Always prioritize safety and progressive overload."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    const workoutPlan = JSON.parse(response);
    
    // Validate and enhance the workout plan
    return enhanceWorkoutPlan(workoutPlan, surveyData, bodyFatPercentage);

  } catch (error) {
    console.error('AI workout generation error:', error);
    // Fallback to template-based generation
    return generateFallbackWorkoutPlan(surveyData, bodyFatPercentage);
  }
}

/**
 * Enhance AI-generated workout plan with additional logic
 */
function enhanceWorkoutPlan(workoutPlan, surveyData, bodyFatPercentage) {
  const { exerciseFrequency, workoutGoal } = surveyData;
  
  // Adjust difficulty based on exercise frequency
  if (exerciseFrequency === 'never' || exerciseFrequency === 'rarely') {
    workoutPlan.difficulty = 'Beginner';
  } else if (exerciseFrequency === 'sometimes') {
    workoutPlan.difficulty = 'Intermediate';
  } else {
    workoutPlan.difficulty = 'Advanced';
  }
  
  // Adjust for age considerations
  if (surveyData.age && surveyData.age > 50) {
    if (workoutPlan.difficulty === 'Advanced') workoutPlan.difficulty = 'Intermediate';
    if (workoutPlan.difficulty === 'Intermediate') workoutPlan.difficulty = 'Beginner';
    
    // Add age-specific notes
    workoutPlan.notes.push('Focus on joint health and mobility');
    workoutPlan.notes.push('Allow extra recovery time between workouts');
  }
  
  // Add body fat specific recommendations
  if (bodyFatPercentage) {
    if (bodyFatPercentage > 25) {
      workoutPlan.notes.push('Include 20-30 minutes of cardio 3-4 times per week');
      workoutPlan.notes.push('Focus on compound movements for maximum calorie burn');
    } else if (bodyFatPercentage < 15) {
      workoutPlan.notes.push('Prioritize strength training for muscle building');
      workoutPlan.notes.push('Include progressive overload in your routine');
    }
  }
  
  // Ensure all required fields are present
  workoutPlan.equipment = workoutPlan.equipment || ['Dumbbells', 'Resistance bands', 'Bodyweight'];
  workoutPlan.estimatedCalories = workoutPlan.estimatedCalories || calculateEstimatedCalories(surveyData);
  
  return workoutPlan;
}

/**
 * Generate fallback workout plan if AI fails
 */
function generateFallbackWorkoutPlan(surveyData, bodyFatPercentage) {
  const { exerciseFrequency, workoutGoal } = surveyData;
  
  let plan = {
    goal: 'General Fitness',
    frequency: '3 days per week',
    difficulty: 'Intermediate',
    days: [],
    notes: [
      'This is a fallback plan - consider upgrading for personalized recommendations',
      'Focus on proper form and gradual progression',
      'Listen to your body and adjust intensity as needed'
    ],
    nutrition: [
      'Eat a balanced diet with adequate protein',
      'Stay hydrated throughout the day',
      'Consider meal timing around workouts'
    ],
    recovery: [
      'Get 7-9 hours of sleep per night',
      'Include rest days between workout days',
      'Practice stress management techniques'
    ],
    progression: [
      'Week 1-2: Focus on form and establishing routine',
      'Week 3-4: Increase weight or reps gradually',
      'Week 5-6: Add new exercises or increase sets'
    ],
    equipment: ['Dumbbells', 'Resistance bands', 'Bodyweight'],
    estimatedCalories: calculateEstimatedCalories(surveyData)
  };
  
  // Generate basic workout days
  if (workoutGoal === 'build-muscle') {
    plan.days = generateMuscleBuildingDays(exerciseFrequency);
  } else if (workoutGoal === 'lose-weight') {
    plan.days = generateFatLossDays(exerciseFrequency);
  } else {
    plan.days = generateGeneralFitnessDays(exerciseFrequency);
  }
  
  return plan;
}

/**
 * Generate muscle building workout days
 */
function generateMuscleBuildingDays(frequency) {
  const days = [];
  
  if (frequency === 'sometimes' || frequency === 'rarely') {
    days.push({
      day: 'Day 1: Upper Body',
      focus: 'Chest, Back, Shoulders',
      intensity: 'Medium',
      totalTime: '45-60 minutes',
      warmup: ['5 min light cardio', 'Arm circles', 'Dynamic stretches'],
      cooldown: ['Static stretching', 'Foam rolling'],
      exercises: [
        {
          name: 'Push-ups',
          sets: 3,
          reps: '8-12',
          equipment: 'Bodyweight',
          restTime: '60s',
          difficulty: 'Beginner',
          muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
          tips: 'Keep your core tight and body in a straight line',
          progression: 'Add resistance bands or elevate feet'
        },
        {
          name: 'Dumbbell Rows',
          sets: 3,
          reps: '8-12',
          equipment: 'Dumbbells',
          restTime: '90s',
          difficulty: 'Intermediate',
          muscleGroups: ['Lats', 'Biceps', 'Rear Delts'],
          tips: 'Keep your back straight and pull elbow back',
          progression: 'Increase weight gradually'
        }
      ]
    });
  }
  
  return days;
}

/**
 * Generate fat loss workout days
 */
function generateFatLossDays(frequency) {
  return [
    {
      day: 'Day 1: HIIT Cardio',
      focus: 'High intensity intervals',
      intensity: 'High',
      totalTime: '30-40 minutes',
      warmup: ['5 min light cardio', 'Dynamic stretches'],
      cooldown: ['Static stretching', 'Deep breathing'],
      exercises: [
        {
          name: 'Burpees',
          sets: 3,
          reps: '10-15',
          equipment: 'Bodyweight',
          restTime: '60s',
          difficulty: 'Advanced',
          muscleGroups: ['Full Body', 'Cardio'],
          tips: 'Explosive movement, control the descent',
          progression: 'Start with modified burpees'
        }
      ]
    }
  ];
}

/**
 * Generate general fitness workout days
 */
function generateGeneralFitnessDays(frequency) {
  return [
    {
      day: 'Day 1: Full Body',
      focus: 'Compound movements',
      intensity: 'Medium',
      totalTime: '45-55 minutes',
      warmup: ['5 min light cardio', 'Dynamic stretches'],
      cooldown: ['Static stretching', 'Foam rolling'],
      exercises: [
        {
          name: 'Bodyweight Squats',
          sets: 3,
          reps: '15-20',
          equipment: 'Bodyweight',
          restTime: '60s',
          difficulty: 'Beginner',
          muscleGroups: ['Quads', 'Glutes', 'Core'],
          tips: 'Keep chest up, knees in line with toes',
          progression: 'Add weight or increase reps'
        }
      ]
    }
  ];
}

/**
 * Calculate estimated calories based on user data
 */
function calculateEstimatedCalories(surveyData) {
  const { sex, age, height, weight, exerciseFrequency } = surveyData;
  
  if (!weight || !height) return 2000;
  
  // Basic BMR calculation (Mifflin-St Jeor Equation)
  let bmr;
  if (sex === 'male') {
    bmr = 10 * weight.value + 6.25 * (height.feet * 12 + height.inches) - 5 * (age || 30) + 5;
  } else {
    bmr = 10 * weight.value + 6.25 * (height.feet * 12 + height.inches) - 5 * (age || 30) - 161;
  }
  
  // Activity multiplier
  let activityMultiplier = 1.2; // Sedentary
  if (exerciseFrequency === 'rarely') activityMultiplier = 1.375;
  else if (exerciseFrequency === 'sometimes') activityMultiplier = 1.55;
  else if (exerciseFrequency === 'often') activityMultiplier = 1.725;
  else if (exerciseFrequency === 'very-often') activityMultiplier = 1.9;
  
  const tdee = bmr * activityMultiplier;
  
  // Adjust based on workout goal
  if (surveyData.workoutGoal === 'lose-weight') {
    return Math.round(tdee - 300); // Caloric deficit
  } else if (surveyData.workoutGoal === 'build-muscle') {
    return Math.round(tdee + 200); // Caloric surplus
  }
  
  return Math.round(tdee);
}

module.exports = router;
