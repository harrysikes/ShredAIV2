import { SurveyData } from '../state/supabaseStore';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  restTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  muscleGroups: string[];
  tips: string;
  progression: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  warmup: string[];
  cooldown: string[];
  totalTime: string;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface WorkoutPlan {
  goal: string;
  frequency: string;
  days: WorkoutDay[];
  notes: string[];
  nutrition: string[];
  recovery: string[];
  progression: string[];
  equipment: string[];
  estimatedCalories: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const exercises: Record<string, Exercise[]> = {
  chest: [
    {
      name: 'Push-ups',
      sets: 3,
      reps: '8-12',
      equipment: 'Bodyweight',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
      tips: 'Keep your core tight and body in a straight line',
      progression: 'Add resistance bands or elevate feet for progression'
    },
    {
      name: 'Dumbbell Bench Press',
      sets: 4,
      reps: '8-12',
      equipment: 'Dumbbells, Bench',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
      tips: 'Control the descent and press explosively up',
      progression: 'Increase weight by 2.5-5 lbs when you hit 12 reps consistently'
    },
    {
      name: 'Incline Dumbbell Press',
      sets: 3,
      reps: '8-12',
      equipment: 'Dumbbells, Incline Bench',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Upper Chest', 'Triceps', 'Shoulders'],
      tips: 'Set bench to 30-45 degree angle for optimal upper chest activation',
      progression: 'Focus on mind-muscle connection and controlled movement'
    },
    {
      name: 'Dumbbell Flyes',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells, Bench',
      restTime: '60s',
      difficulty: 'Intermediate',
      muscleGroups: ['Chest', 'Shoulders'],
      tips: 'Keep slight bend in elbows and feel the stretch in your chest',
      progression: 'Use cables for constant tension or add slight incline'
    }
  ],
  back: [
    {
      name: 'Pull-ups',
      sets: 3,
      reps: '5-10',
      equipment: 'Pull-up Bar',
      restTime: '90s',
      difficulty: 'Advanced',
      muscleGroups: ['Lats', 'Biceps', 'Rear Delts'],
      tips: 'Pull your shoulder blades down and back, not just your arms',
      progression: 'Start with assisted pull-ups or negative reps if needed'
    },
    {
      name: 'Dumbbell Rows',
      sets: 4,
      reps: '8-12',
      equipment: 'Dumbbells, Bench',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Lats', 'Biceps', 'Rear Delts'],
      tips: 'Keep your back straight and pull elbow back, not up',
      progression: 'Increase weight gradually and focus on full range of motion'
    },
    {
      name: 'Lat Pulldowns',
      sets: 3,
      reps: '8-12',
      equipment: 'Cable Machine',
      restTime: '90s',
      difficulty: 'Beginner',
      muscleGroups: ['Lats', 'Biceps', 'Rear Delts'],
      tips: 'Pull bar to upper chest, not behind your head',
      progression: 'Focus on squeezing your lats at the bottom of each rep'
    },
    {
      name: 'Face Pulls',
      sets: 3,
      reps: '12-15',
      equipment: 'Cable Machine',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Rear Delts', 'Traps', 'Rhomboids'],
      tips: 'Pull towards your face, not your chest, and squeeze shoulder blades',
      progression: 'Increase weight while maintaining perfect form'
    }
  ],
  legs: [
    {
      name: 'Squats',
      sets: 4,
      reps: '8-12',
      equipment: 'Bodyweight/Dumbbells',
      restTime: '90s',
      difficulty: 'Beginner',
      muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
      tips: 'Keep chest up, knees in line with toes, go parallel to ground',
      progression: 'Add weight gradually, focus on depth and form'
    },
    {
      name: 'Lunges',
      sets: 3,
      reps: '10 each leg',
      equipment: 'Dumbbells',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
      tips: 'Step forward, lower until both knees are at 90 degrees',
      progression: 'Add weight, try walking lunges, or reverse lunges'
    },
    {
      name: 'Romanian Deadlifts',
      sets: 3,
      reps: '8-12',
      equipment: 'Dumbbells',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
      tips: 'Keep bar close to legs, hinge at hips, feel stretch in hamstrings',
      progression: 'Increase weight gradually, focus on hip hinge movement'
    },
    {
      name: 'Calf Raises',
      sets: 4,
      reps: '15-20',
      equipment: 'Bodyweight/Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Calves'],
      tips: 'Full range of motion - lower heels below step level',
      progression: 'Add weight, try single leg, or change foot position'
    }
  ],
  shoulders: [
    {
      name: 'Overhead Press',
      sets: 4,
      reps: '8-12',
      equipment: 'Dumbbells',
      restTime: '90s',
      difficulty: 'Intermediate',
      muscleGroups: ['Shoulders', 'Triceps', 'Core'],
      tips: 'Keep core tight, press straight up, don\'t lean back',
      progression: 'Increase weight gradually, focus on strict form'
    },
    {
      name: 'Lateral Raises',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Side Delts'],
      tips: 'Raise arms to shoulder level, slight bend in elbows',
      progression: 'Add weight gradually, focus on mind-muscle connection'
    },
    {
      name: 'Front Raises',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Front Delts'],
      tips: 'Raise one arm at a time, control the movement',
      progression: 'Try alternating arms or use cables for constant tension'
    },
    {
      name: 'Rear Delt Flyes',
      sets: 3,
      reps: '12-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Rear Delts', 'Traps'],
      tips: 'Bend forward, raise arms to shoulder level, squeeze rear delts',
      progression: 'Increase weight while maintaining perfect form'
    }
  ],
  arms: [
    {
      name: 'Bicep Curls',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Biceps'],
      tips: 'Keep elbows at sides, curl weight up, control descent',
      progression: 'Add weight, try hammer curls, or use cables'
    },
    {
      name: 'Tricep Dips',
      sets: 3,
      reps: '8-12',
      equipment: 'Bodyweight',
      restTime: '60s',
      difficulty: 'Intermediate',
      muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
      tips: 'Keep body close to bench, lower until arms are parallel',
      progression: 'Add weight on lap, try ring dips, or use parallel bars'
    },
    {
      name: 'Hammer Curls',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Biceps', 'Forearms'],
      tips: 'Keep palms facing each other, curl both arms simultaneously',
      progression: 'Increase weight, try alternating arms, or add isometric hold'
    },
    {
      name: 'Overhead Tricep Extension',
      sets: 3,
      reps: '10-15',
      equipment: 'Dumbbells',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Triceps'],
      tips: 'Keep upper arms stationary, extend at elbows only',
      progression: 'Increase weight, try single arm, or use cables'
    }
  ],
  core: [
    {
      name: 'Planks',
      sets: 3,
      reps: '30-60 seconds',
      equipment: 'Bodyweight',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Core', 'Shoulders', 'Glutes'],
      tips: 'Keep body straight, engage core, breathe steadily',
      progression: 'Increase time, add movement, or try side planks'
    },
    {
      name: 'Russian Twists',
      sets: 3,
      reps: '20-30',
      equipment: 'Bodyweight/Dumbbell',
      restTime: '60s',
      difficulty: 'Intermediate',
      muscleGroups: ['Obliques', 'Core'],
      tips: 'Keep feet off ground, rotate torso, touch weight to sides',
      progression: 'Add weight, increase reps, or try bicycle crunches'
    },
    {
      name: 'Dead Bug',
      sets: 3,
      reps: '10 each side',
      equipment: 'Bodyweight',
      restTime: '60s',
      difficulty: 'Beginner',
      muscleGroups: ['Core', 'Hip Flexors'],
      tips: 'Keep lower back pressed to ground, move slowly and controlled',
      progression: 'Increase reps, add resistance, or try bird dogs'
    }
  ],
  cardio: [
    {
      name: 'High Knees',
      sets: 3,
      reps: '30-45 seconds',
      equipment: 'Bodyweight',
      restTime: '30s',
      difficulty: 'Beginner',
      muscleGroups: ['Cardio', 'Core', 'Hip Flexors'],
      tips: 'Stay on balls of feet, bring knees to waist level',
      progression: 'Increase time, add resistance bands, or try butt kicks'
    },
    {
      name: 'Mountain Climbers',
      sets: 3,
      reps: '30-45 seconds',
      equipment: 'Bodyweight',
      restTime: '30s',
      difficulty: 'Intermediate',
      muscleGroups: ['Cardio', 'Core', 'Shoulders'],
      tips: 'Keep hips level, alternate legs quickly, maintain plank position',
      progression: 'Increase time, add resistance, or try cross-body climbers'
    },
    {
      name: 'Burpees',
      sets: 3,
      reps: '8-12',
      equipment: 'Bodyweight',
      restTime: '60s',
      difficulty: 'Advanced',
      muscleGroups: ['Full Body', 'Cardio'],
      tips: 'Explosive jump at top, control the movement, full range of motion',
      progression: 'Start with modified burpees, add push-up, or increase reps'
    },
    {
      name: 'Jump Rope',
      sets: 3,
      reps: '1-2 minutes',
      equipment: 'Jump Rope',
      restTime: '60s',
      difficulty: 'Intermediate',
      muscleGroups: ['Cardio', 'Calves', 'Shoulders'],
      tips: 'Stay on balls of feet, keep elbows close, maintain rhythm',
      progression: 'Increase time, try double-unders, or add footwork variations'
    }
  ]
};

export const generateWorkoutPlan = (
  surveyData: SurveyData,
  bodyFatPercentage: number
): WorkoutPlan => {
  const { exerciseFrequency, workoutGoal, age, sex, weight } = surveyData;
  
  // Determine difficulty level based on exercise frequency and age
  let difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  if (exerciseFrequency === 'never' || exerciseFrequency === 'rarely') {
    difficulty = 'Beginner';
  } else if (exerciseFrequency === 'sometimes') {
    difficulty = 'Intermediate';
  } else {
    difficulty = 'Advanced';
  }
  
  // Adjust for age
  if (age && age > 50) {
    if (difficulty === 'Advanced') difficulty = 'Intermediate';
    if (difficulty === 'Intermediate') difficulty = 'Beginner';
  }
  
  let plan: WorkoutPlan;
  
  if (workoutGoal === 'build-muscle') {
    if (exerciseFrequency === 'sometimes' || exerciseFrequency === 'rarely') {
      plan = {
        goal: 'Muscle Building - Foundation',
        frequency: '2-3 days per week',
        difficulty,
        days: [
          {
            day: 'Day 1: Upper Body Foundation',
            focus: 'Chest, Back, Shoulders',
            intensity: 'Medium',
            totalTime: '45-60 minutes',
            warmup: ['5 min light cardio', 'Arm circles', 'Cat-cow stretches'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              ...exercises.chest.slice(0, 2),
              ...exercises.back.slice(0, 2),
              ...exercises.shoulders.slice(0, 2)
            ]
          },
          {
            day: 'Day 2: Lower Body Foundation',
            focus: 'Legs, Core',
            intensity: 'Medium',
            totalTime: '45-60 minutes',
            warmup: ['5 min light cardio', 'Leg swings', 'Hip circles'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              ...exercises.legs,
              ...exercises.core.slice(0, 2)
            ]
          },
          {
            day: 'Day 3: Full Body Integration',
            focus: 'Compound Movements',
            intensity: 'High',
            totalTime: '50-65 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              { ...exercises.legs[0], sets: 4, reps: '8-12' },
              { ...exercises.chest[0], sets: 4, reps: '8-12' },
              { ...exercises.back[1], sets: 4, reps: '8-12' },
              { ...exercises.core[0], sets: 3, reps: '45 seconds' }
            ]
          }
        ],
        notes: [
          'Focus on perfect form before increasing weight',
          'Rest 2-3 minutes between compound exercises',
          'Eat in a slight caloric surplus (200-300 calories above maintenance)',
          'Prioritize protein intake (0.8-1.2g per pound of body weight)',
          'Sleep 7-9 hours for optimal muscle recovery'
        ],
        nutrition: [
          'Protein: 0.8-1.2g per pound of body weight',
          'Carbs: 2-3g per pound of body weight',
          'Fats: 0.3-0.5g per pound of body weight',
          'Eat 3-4 meals per day with protein at each meal',
          'Consider protein shake within 30 minutes post-workout'
        ],
        recovery: [
          'Stretch for 10-15 minutes after each workout',
          'Foam roll major muscle groups 2-3 times per week',
          'Take 1-2 complete rest days per week',
          'Consider contrast showers (hot/cold) for recovery',
          'Practice deep breathing and stress management'
        ],
        progression: [
          'Week 1-2: Focus on form and establishing routine',
          'Week 3-4: Increase weight by 5-10% when you hit 12 reps consistently',
          'Week 5-6: Add 1 set to main compound movements',
          'Week 7-8: Introduce new exercise variations',
          'Track your progress in a workout journal or app'
        ],
        equipment: ['Dumbbells', 'Bench', 'Pull-up bar', 'Resistance bands', 'Foam roller'],
        estimatedCalories: 2500 + (weight?.value || 150) * 15
      };
    } else {
      plan = {
        goal: 'Muscle Building - Advanced',
        frequency: '4-5 days per week',
        difficulty: 'Advanced',
        days: [
          {
            day: 'Day 1: Chest & Triceps',
            focus: 'Push movements',
            intensity: 'High',
            totalTime: '60-75 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Light push-ups'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              ...exercises.chest,
              ...exercises.arms.slice(2, 4)
            ]
          },
          {
            day: 'Day 2: Back & Biceps',
            focus: 'Pull movements',
            intensity: 'High',
            totalTime: '60-75 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Light rows'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              ...exercises.back,
              ...exercises.arms.slice(0, 2)
            ]
          },
          {
            day: 'Day 3: Legs',
            focus: 'Lower body strength',
            intensity: 'High',
            totalTime: '60-75 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Bodyweight squats'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: exercises.legs
          },
          {
            day: 'Day 4: Shoulders & Arms',
            focus: 'Isolation work',
            intensity: 'Medium',
            totalTime: '50-65 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Light shoulder work'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              ...exercises.shoulders,
              ...exercises.arms
            ]
          },
          {
            day: 'Day 5: Full Body Power',
            focus: 'Compound movements',
            intensity: 'High',
            totalTime: '60-75 minutes',
            warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
            cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
            exercises: [
              { name: 'Deadlifts', sets: 4, reps: '6-8', equipment: 'Dumbbells', restTime: '120s', difficulty: 'Advanced' as const, muscleGroups: ['Full Body'], tips: 'Keep bar close to legs, hinge at hips', progression: 'Increase weight gradually' },
              { ...exercises.legs[0], sets: 4, reps: '6-8' },
              { ...exercises.chest[0], sets: 4, reps: '8-10' },
              { ...exercises.core[0], sets: 3, reps: '60 seconds' }
            ]
          }
        ],
        notes: [
          'Split routine allows for more volume per muscle group',
          'Include 1-2 rest days per week for recovery',
          'Progressive overload is key - track your weights and reps',
          'Consider periodization (deload weeks every 4-6 weeks)',
          'Focus on mind-muscle connection and controlled movements'
        ],
        nutrition: [
          'Protein: 1.0-1.4g per pound of body weight',
          'Carbs: 2.5-4g per pound of body weight',
          'Fats: 0.4-0.6g per pound of body weight',
          'Eat 4-6 meals per day with protein at each meal',
          'Consider pre-workout meal 2-3 hours before training',
          'Post-workout protein within 30 minutes for optimal recovery'
        ],
        recovery: [
          'Stretch for 15-20 minutes after each workout',
          'Foam roll major muscle groups 3-4 times per week',
          'Take 1-2 complete rest days per week',
          'Consider massage therapy or chiropractic care monthly',
          'Practice stress management and prioritize sleep quality',
          'Consider contrast therapy and compression garments'
        ],
        progression: [
          'Week 1-2: Establish routine and perfect form',
          'Week 3-4: Increase weight by 5-10% on main lifts',
          'Week 5-6: Add volume (sets/reps) to isolation movements',
          'Week 7-8: Introduce advanced techniques (drop sets, supersets)',
          'Week 9-10: Deload week - reduce volume by 30-40%',
          'Track progress and adjust program every 4-6 weeks'
        ],
        equipment: ['Dumbbells', 'Bench', 'Pull-up bar', 'Cable machine', 'Resistance bands', 'Foam roller', 'Massage tools'],
        estimatedCalories: 2800 + (weight?.value || 150) * 18
      };
    }
  } else if (workoutGoal === 'lose-weight') {
    plan = {
      goal: 'Fat Loss & Toning',
      frequency: exerciseFrequency || 'sometimes',
      difficulty,
      days: [
        {
          day: 'Day 1: HIIT Cardio',
          focus: 'High intensity intervals',
          intensity: 'High',
          totalTime: '30-40 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
          cooldown: ['Static stretching', 'Deep breathing', 'Cool down walk'],
          exercises: exercises.cardio
        },
        {
          day: 'Day 2: Upper Body Strength',
          focus: 'Compound movements',
          intensity: 'Medium',
          totalTime: '45-55 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Light movements'],
          cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
          exercises: [
            { ...exercises.chest[0], sets: 4, reps: 'Max reps' },
            { ...exercises.back[1], sets: 4, reps: '12-15' },
            { ...exercises.shoulders[0], sets: 3, reps: '10-12' },
            { ...exercises.arms[0], sets: 3, reps: '12-15' }
          ]
        },
        {
          day: 'Day 3: Lower Body & Cardio',
          focus: 'Strength + endurance',
          intensity: 'Medium',
          totalTime: '50-60 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Bodyweight squats'],
          cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
          exercises: [
            ...exercises.legs.slice(0, 3),
            { name: 'Jump Squats', sets: 3, reps: '15-20', equipment: 'Bodyweight', restTime: '60s', difficulty: 'Intermediate', muscleGroups: ['Quads', 'Glutes', 'Cardio'], tips: 'Explosive jump at top, soft landing', progression: 'Add weight or increase reps' },
            { ...exercises.cardio[1], sets: 3, reps: '45 seconds' }
          ]
        },
        {
          day: 'Day 4: Full Body Circuit',
          focus: 'Metabolic conditioning',
          intensity: 'High',
          totalTime: '35-45 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
          cooldown: ['Static stretching', 'Deep breathing', 'Cool down walk'],
          exercises: [
            { ...exercises.cardio[2], sets: 3, reps: '10-15' },
            { ...exercises.cardio[1], sets: 3, reps: '30 seconds' },
            { ...exercises.cardio[0], sets: 3, reps: '30 seconds' },
            { ...exercises.core[0], sets: 3, reps: '30 seconds' }
          ]
        }
      ],
      notes: [
        'Keep rest periods short (30-60 seconds) to maintain elevated heart rate',
        'Combine strength training with cardio for maximum fat burn',
        'Maintain a caloric deficit through diet and exercise',
        'Aim for 150-300 minutes of moderate exercise per week',
        'Focus on compound movements to burn more calories',
        'Consider intermittent fasting for enhanced fat loss'
      ],
      nutrition: [
        'Protein: 1.0-1.2g per pound of body weight',
        'Carbs: 1.5-2.5g per pound of body weight',
        'Fats: 0.3-0.5g per pound of body weight',
        'Create a 300-500 calorie daily deficit',
        'Eat protein with every meal to preserve muscle mass',
        'Consider meal timing around workouts',
        'Stay hydrated - drink 8-12 glasses of water daily'
      ],
      recovery: [
        'Stretch for 10-15 minutes after each workout',
        'Foam roll major muscle groups 2-3 times per week',
        'Take 1-2 complete rest days per week',
        'Practice stress management and prioritize sleep',
        'Consider active recovery (light walking, yoga)',
        'Monitor your energy levels and adjust intensity accordingly'
      ],
      progression: [
        'Week 1-2: Establish routine and build endurance',
        'Week 3-4: Increase workout duration by 5-10 minutes',
        'Week 5-6: Reduce rest periods between exercises',
        'Week 7-8: Add resistance or increase reps',
        'Track your progress and adjust program every 2-3 weeks'
      ],
      equipment: ['Dumbbells', 'Bench', 'Resistance bands', 'Jump rope', 'Foam roller'],
      estimatedCalories: 2000 + (weight?.value || 150) * 10
    };
  } else {
    // Improve fitness/endurance
    plan = {
      goal: 'General Fitness & Endurance',
      frequency: exerciseFrequency || 'sometimes',
      difficulty,
      days: [
        {
          day: 'Day 1: Cardio Endurance',
          focus: 'Steady state cardio',
          intensity: 'Low',
          totalTime: '40-50 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
          cooldown: ['Static stretching', 'Deep breathing', 'Cool down walk'],
          exercises: [
            { name: 'Running/Jogging', sets: 1, reps: '20-30 minutes', equipment: 'Treadmill/Outdoor', restTime: 'N/A', difficulty: 'Intermediate', muscleGroups: ['Cardio', 'Legs'], tips: 'Maintain conversational pace', progression: 'Increase duration gradually' },
            { name: 'Cycling', sets: 1, reps: '20-30 minutes', equipment: 'Stationary Bike', restTime: 'N/A', difficulty: 'Beginner', muscleGroups: ['Cardio', 'Legs'], tips: 'Keep resistance moderate', progression: 'Increase resistance or duration' },
            { ...exercises.cardio[3], sets: 3, reps: '5 minutes' }
          ]
        },
        {
          day: 'Day 2: Strength Endurance',
          focus: 'High rep, low weight',
          intensity: 'Medium',
          totalTime: '45-55 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Light movements'],
          cooldown: ['Static stretching', 'Foam rolling', 'Deep breathing'],
          exercises: [
            { ...exercises.legs[0], sets: 4, reps: '20-25', equipment: 'Bodyweight' },
            { ...exercises.chest[0], sets: 4, reps: '15-20' },
            { ...exercises.legs[1], sets: 3, reps: '15 each leg' },
            { ...exercises.core[0], sets: 3, reps: '45 seconds' }
          ]
        },
        {
          day: 'Day 3: Circuit Training',
          focus: 'Muscular endurance',
          intensity: 'Medium',
          totalTime: '40-50 minutes',
          warmup: ['5 min light cardio', 'Dynamic stretches', 'Movement prep'],
          cooldown: ['Static stretching', 'Deep breathing', 'Cool down walk'],
          exercises: [
            { ...exercises.cardio[1], sets: 4, reps: '45 seconds' },
            { ...exercises.cardio[2], sets: 3, reps: '12-15' },
            { ...exercises.cardio[0], sets: 4, reps: '45 seconds' },
            { ...exercises.core[0], sets: 3, reps: '45 seconds' }
          ]
        }
      ],
      notes: [
        'Focus on duration over intensity for endurance building',
        'Gradually increase workout duration and reduce rest periods',
        'Include both cardio and strength training for balanced fitness',
        'Listen to your body and don\'t overtrain',
        'Build consistency before increasing intensity',
        'Consider cross-training to prevent boredom and overuse injuries'
      ],
      nutrition: [
        'Protein: 0.8-1.0g per pound of body weight',
        'Carbs: 2.0-3.0g per pound of body weight',
        'Fats: 0.3-0.5g per pound of body weight',
        'Eat balanced meals throughout the day',
        'Stay hydrated - drink water before, during, and after exercise',
        'Consider pre-workout snack 1-2 hours before training'
      ],
      recovery: [
        'Stretch for 10-15 minutes after each workout',
        'Foam roll major muscle groups 2-3 times per week',
        'Take 1-2 complete rest days per week',
        'Practice stress management and prioritize sleep',
        'Consider active recovery activities (yoga, swimming, walking)',
        'Listen to your body and adjust intensity as needed'
      ],
      progression: [
        'Week 1-2: Establish routine and build consistency',
        'Week 3-4: Increase workout duration by 5-10 minutes',
        'Week 5-6: Reduce rest periods between exercises',
        'Week 7-8: Add resistance or increase reps',
        'Track your progress and adjust program every 3-4 weeks'
      ],
      equipment: ['Dumbbells', 'Resistance bands', 'Jump rope', 'Foam roller', 'Yoga mat'],
      estimatedCalories: 2200 + (weight?.value || 150) * 12
    };
  }
  
  return plan;
};
