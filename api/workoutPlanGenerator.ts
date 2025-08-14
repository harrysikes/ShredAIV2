import { SurveyData } from '../state/surveyStore';

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  equipment: string;
  restTime: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  goal: string;
  frequency: string;
  days: WorkoutDay[];
  notes: string[];
}

const exercises = {
  chest: [
    { name: 'Push-ups', sets: 3, reps: '8-12', equipment: 'Bodyweight', restTime: '60s' },
    { name: 'Dumbbell Bench Press', sets: 3, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Incline Dumbbell Press', sets: 3, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Dumbbell Flyes', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
  ],
  back: [
    { name: 'Pull-ups', sets: 3, reps: '5-10', equipment: 'Pull-up Bar', restTime: '90s' },
    { name: 'Dumbbell Rows', sets: 3, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Lat Pulldowns', sets: 3, reps: '8-12', equipment: 'Machine', restTime: '90s' },
    { name: 'Face Pulls', sets: 3, reps: '12-15', equipment: 'Cable Machine', restTime: '60s' },
  ],
  legs: [
    { name: 'Squats', sets: 3, reps: '8-12', equipment: 'Bodyweight/Dumbbells', restTime: '90s' },
    { name: 'Lunges', sets: 3, reps: '10 each leg', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Romanian Deadlifts', sets: 3, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Calf Raises', sets: 3, reps: '15-20', equipment: 'Bodyweight', restTime: '60s' },
  ],
  shoulders: [
    { name: 'Overhead Press', sets: 3, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
    { name: 'Lateral Raises', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
    { name: 'Front Raises', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
    { name: 'Rear Delt Flyes', sets: 3, reps: '12-15', equipment: 'Dumbbells', restTime: '60s' },
  ],
  arms: [
    { name: 'Bicep Curls', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
    { name: 'Tricep Dips', sets: 3, reps: '8-12', equipment: 'Bodyweight', restTime: '60s' },
    { name: 'Hammer Curls', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
    { name: 'Overhead Tricep Extension', sets: 3, reps: '10-15', equipment: 'Dumbbells', restTime: '60s' },
  ],
  cardio: [
    { name: 'High Knees', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '30s' },
    { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '30s' },
    { name: 'Burpees', sets: 3, reps: '8-12', equipment: 'Bodyweight', restTime: '60s' },
    { name: 'Jump Rope', sets: 3, reps: '1 minute', equipment: 'Jump Rope', restTime: '60s' },
  ],
};

export const generateWorkoutPlan = (
  surveyData: SurveyData,
  bodyFatPercentage: number
): WorkoutPlan => {
  const { exerciseFrequency, workoutGoal } = surveyData;
  
  let plan: WorkoutPlan;
  
  if (workoutGoal === 'gain muscle') {
    if (exerciseFrequency === '2-3 days') {
      plan = {
        goal: 'Muscle Building',
        frequency: '2-3 days per week',
        days: [
          {
            day: 'Day 1: Upper Body',
            focus: 'Chest, Back, Shoulders',
            exercises: [...exercises.chest.slice(0, 2), ...exercises.back.slice(0, 2), ...exercises.shoulders.slice(0, 2)],
          },
          {
            day: 'Day 2: Lower Body',
            focus: 'Legs, Core',
            exercises: [...exercises.legs, { name: 'Planks', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '60s' }],
          },
          {
            day: 'Day 3: Full Body',
            focus: 'Compound Movements',
            exercises: [
              { name: 'Squats', sets: 4, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
              { name: 'Push-ups', sets: 4, reps: '8-12', equipment: 'Bodyweight', restTime: '90s' },
              { name: 'Dumbbell Rows', sets: 4, reps: '8-12', equipment: 'Dumbbells', restTime: '90s' },
              { name: 'Planks', sets: 3, reps: '45 seconds', equipment: 'Bodyweight', restTime: '60s' },
            ],
          },
        ],
        notes: [
          'Focus on progressive overload - increase weight when you can do 12 reps easily',
          'Rest 2-3 minutes between compound exercises',
          'Eat in a slight caloric surplus to support muscle growth',
        ],
      };
    } else {
      plan = {
        goal: 'Muscle Building',
        frequency: '4-7 days per week',
        days: [
          {
            day: 'Day 1: Chest & Triceps',
            focus: 'Push movements',
            exercises: [...exercises.chest, ...exercises.arms.slice(2, 4)],
          },
          {
            day: 'Day 2: Back & Biceps',
            focus: 'Pull movements',
            exercises: [...exercises.back, ...exercises.arms.slice(0, 2)],
          },
          {
            day: 'Day 3: Legs',
            focus: 'Lower body strength',
            exercises: exercises.legs,
          },
          {
            day: 'Day 4: Shoulders & Arms',
            focus: 'Isolation work',
            exercises: [...exercises.shoulders, ...exercises.arms],
          },
          {
            day: 'Day 5: Full Body',
            focus: 'Compound movements',
            exercises: [
              { name: 'Deadlifts', sets: 4, reps: '6-8', equipment: 'Dumbbells', restTime: '120s' },
              { name: 'Squats', sets: 4, reps: '8-10', equipment: 'Dumbbells', restTime: '90s' },
              { name: 'Push-ups', sets: 4, reps: '10-15', equipment: 'Bodyweight', restTime: '90s' },
            ],
          },
        ],
        notes: [
          'Split routine allows for more volume per muscle group',
          'Include 1-2 rest days per week for recovery',
          'Progressive overload is key - track your weights and reps',
        ],
      };
    }
  } else if (workoutGoal === 'lose fat') {
    plan = {
      goal: 'Fat Loss',
      frequency: exerciseFrequency,
      days: [
        {
          day: 'Day 1: HIIT Cardio',
          focus: 'High intensity intervals',
          exercises: exercises.cardio,
        },
        {
          day: 'Day 2: Upper Body Strength',
          focus: 'Compound movements',
          exercises: [
            { name: 'Push-ups', sets: 4, reps: 'Max reps', equipment: 'Bodyweight', restTime: '60s' },
            { name: 'Dumbbell Rows', sets: 4, reps: '12-15', equipment: 'Dumbbells', restTime: '60s' },
            { name: 'Overhead Press', sets: 3, reps: '10-12', equipment: 'Dumbbells', restTime: '60s' },
          ],
        },
        {
          day: 'Day 3: Lower Body & Cardio',
          focus: 'Strength + endurance',
          exercises: [
            ...exercises.legs.slice(0, 3),
            { name: 'Jump Squats', sets: 3, reps: '15-20', equipment: 'Bodyweight', restTime: '60s' },
            { name: 'Mountain Climbers', sets: 3, reps: '45 seconds', equipment: 'Bodyweight', restTime: '30s' },
          ],
        },
        {
          day: 'Day 4: Full Body Circuit',
          focus: 'Metabolic conditioning',
          exercises: [
            { name: 'Burpees', sets: 3, reps: '10-15', equipment: 'Bodyweight', restTime: '45s' },
            { name: 'Mountain Climbers', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '30s' },
            { name: 'High Knees', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '30s' },
            { name: 'Planks', sets: 3, reps: '30 seconds', equipment: 'Bodyweight', restTime: '30s' },
          ],
        },
      ],
      notes: [
        'Keep rest periods short (30-60 seconds) to maintain elevated heart rate',
        'Combine strength training with cardio for maximum fat burn',
        'Maintain a caloric deficit through diet and exercise',
        'Aim for 150-300 minutes of moderate exercise per week',
      ],
    };
  } else {
    // Improve endurance
    plan = {
      goal: 'Endurance',
      frequency: exerciseFrequency,
      days: [
        {
          day: 'Day 1: Cardio Endurance',
          focus: 'Steady state cardio',
          exercises: [
            { name: 'Running/Jogging', sets: 1, reps: '20-30 minutes', equipment: 'Treadmill/Outdoor', restTime: 'N/A' },
            { name: 'Cycling', sets: 1, reps: '20-30 minutes', equipment: 'Stationary Bike', restTime: 'N/A' },
            { name: 'Jump Rope', sets: 3, reps: '5 minutes', equipment: 'Jump Rope', restTime: '2 minutes' },
          ],
        },
        {
          day: 'Day 2: Strength Endurance',
          focus: 'High rep, low weight',
          exercises: [
            { name: 'Bodyweight Squats', sets: 4, reps: '20-25', equipment: 'Bodyweight', restTime: '60s' },
            { name: 'Push-ups', sets: 4, reps: '15-20', equipment: 'Bodyweight', restTime: '60s' },
            { name: 'Lunges', sets: 3, reps: '15 each leg', equipment: 'Bodyweight', restTime: '60s' },
          ],
        },
        {
          day: 'Day 3: Circuit Training',
          focus: 'Muscular endurance',
          exercises: [
            { name: 'Mountain Climbers', sets: 4, reps: '45 seconds', equipment: 'Bodyweight', restTime: '30s' },
            { name: 'Burpees', sets: 3, reps: '12-15', equipment: 'Bodyweight', restTime: '45s' },
            { name: 'High Knees', sets: 4, reps: '45 seconds', equipment: 'Bodyweight', restTime: '30s' },
            { name: 'Planks', sets: 3, reps: '45 seconds', equipment: 'Bodyweight', restTime: '30s' },
          ],
        },
      ],
      notes: [
        'Focus on duration over intensity for endurance building',
        'Gradually increase workout duration and reduce rest periods',
        'Include both cardio and strength training for balanced endurance',
        'Listen to your body and don\'t overtrain',
      ],
    };
  }
  
  return plan;
};
