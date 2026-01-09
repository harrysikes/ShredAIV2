import { SurveyData } from '../state/supabaseStore';

export interface DailyWorkout {
  date: string; // ISO date string
  dayNumber: number; // Day number since first BF% log
  title: string;
  type: 'workout' | 'rest';
  focus?: string;
  intensity?: 'Low' | 'Medium' | 'High';
  duration?: string;
  warmup?: string[];
  exercises?: {
    name: string;
    sets: number;
    reps: string;
    restTime: string;
    tips?: string;
  }[];
  cooldown?: string[];
  completed?: boolean;
  missed?: boolean;
}

export interface MonthlyWorkoutPlan {
  month: number; // 0-11
  year: number;
  startDate: string;
  endDate: string;
  workouts: DailyWorkout[];
}

/**
 * Get the first BF% log date as Day 1
 */
export function getDayOne(bodyFatHistory: { date: string }[]): Date | null {
  if (!bodyFatHistory || bodyFatHistory.length === 0) return null;
  
  const sorted = [...bodyFatHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return new Date(sorted[0].date);
}

/**
 * Calculate day number from Day 1
 */
export function getDayNumber(dayOne: Date, targetDate: Date): number {
  const diffTime = targetDate.getTime() - dayOne.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Day 1 is the first day
}

/**
 * Get days per week based on exercise frequency
 */
function getDaysPerWeek(exerciseFrequency: string | null): number {
  switch (exerciseFrequency) {
    case 'never': return 2;
    case 'rarely': return 3;
    case 'sometimes': return 4;
    case 'often': return 5;
    case 'very-often': return 6;
    default: return 3;
  }
}

/**
 * Get workout days of the week based on frequency
 * Returns array of day indices (0=Sunday, 6=Saturday)
 */
function getWorkoutDays(daysPerWeek: number): number[] {
  if (daysPerWeek <= 3) {
    return [1, 3, 5]; // Mon, Wed, Fri
  } else if (daysPerWeek === 4) {
    return [1, 3, 5, 6]; // Mon, Wed, Fri, Sat
  } else if (daysPerWeek === 5) {
    return [1, 2, 4, 5, 6]; // Mon, Tue, Thu, Fri, Sat
  } else {
    return [1, 2, 3, 4, 5, 6]; // Mon-Sat
  }
}

/**
 * Generate workouts for a single day based on goal and frequency
 */
function generateWorkoutForDay(
  dayNumber: number,
  workoutGoal: string | null,
  exerciseFrequency: string | null,
  dayOfWeek: number
): DailyWorkout {
  const daysPerWeek = getDaysPerWeek(exerciseFrequency);
  const workoutDays = getWorkoutDays(daysPerWeek);
  
  // Check if this is a scheduled workout day
  if (!workoutDays.includes(dayOfWeek)) {
    return {
      date: '', // Will be set by caller
      dayNumber,
      title: 'Rest Day',
      type: 'rest',
    };
  }

  // Determine workout focus based on day
  let focus = 'Full Body';
  let intensity: 'Low' | 'Medium' | 'High' = 'Medium';
  
  if (workoutGoal === 'build-muscle') {
    const focusOptions = ['Upper Body', 'Lower Body', 'Full Body', 'Push', 'Pull', 'Legs'];
    focus = focusOptions[(dayNumber - 1) % focusOptions.length];
    intensity = exerciseFrequency === 'often' || exerciseFrequency === 'very-often' ? 'High' : 'Medium';
  } else if (workoutGoal === 'lose-weight') {
    focus = 'Cardio & Strength';
    intensity = 'High';
  } else if (workoutGoal === 'maintain') {
    focus = 'Full Body Maintenance';
    intensity = 'Medium';
  } else {
    focus = 'General Fitness';
    intensity = 'Low';
  }

  // Generate exercises based on focus
  const exercises = generateExercises(focus, intensity);

  return {
    date: '', // Will be set by caller
    dayNumber,
    title: `${focus} Workout - Day ${dayNumber}`,
    type: 'workout',
    focus,
    intensity,
    duration: intensity === 'High' ? '60 minutes' : intensity === 'Medium' ? '45 minutes' : '30 minutes',
    warmup: [
      '5 min light cardio',
      'Dynamic stretching',
      'Mobility drills'
    ],
    exercises,
    cooldown: [
      'Static stretching',
      '5 min cool down walk',
      'Foam rolling (optional)'
    ],
  };
}

/**
 * Generate exercises based on focus and intensity
 */
function generateExercises(focus: string, intensity: 'Low' | 'Medium' | 'High'): DailyWorkout['exercises'] {
  const sets = intensity === 'High' ? 4 : intensity === 'Medium' ? 3 : 2;
  const reps = intensity === 'High' ? '8-12' : intensity === 'Medium' ? '10-15' : '12-20';
  const restTime = intensity === 'High' ? '90 seconds' : intensity === 'Medium' ? '60 seconds' : '45 seconds';

  if (focus === 'Upper Body') {
    return [
      { name: 'Push-ups', sets, reps, restTime, tips: 'Keep core tight, full range of motion' },
      { name: 'Pull-ups or Rows', sets, reps, restTime, tips: 'Pull shoulder blades together' },
      { name: 'Shoulder Press', sets, reps, restTime, tips: 'Control the weight, don\'t arch back' },
      { name: 'Bicep Curls', sets: sets - 1, reps, restTime, tips: 'Keep elbows stationary' },
      { name: 'Tricep Dips', sets: sets - 1, reps, restTime, tips: 'Go slow on the negative' },
    ];
  } else if (focus === 'Lower Body') {
    return [
      { name: 'Squats', sets, reps, restTime, tips: 'Knees track over toes, go below parallel' },
      { name: 'Lunges', sets, reps, restTime, tips: 'Keep front knee over ankle' },
      { name: 'Romanian Deadlifts', sets, reps, restTime, tips: 'Hinge at hips, keep back straight' },
      { name: 'Calf Raises', sets: sets - 1, reps, restTime, tips: 'Full range of motion at top' },
      { name: 'Leg Raises', sets: sets - 1, reps, restTime, tips: 'Control the movement' },
    ];
  } else if (focus === 'Push') {
    return [
      { name: 'Bench Press / Push-ups', sets, reps, restTime, tips: 'Full range of motion' },
      { name: 'Overhead Press', sets, reps, restTime, tips: 'Core engaged' },
      { name: 'Dips', sets, reps, restTime, tips: 'Keep elbows close to body' },
      { name: 'Tricep Extensions', sets: sets - 1, reps, restTime, tips: 'Control the weight' },
    ];
  } else if (focus === 'Pull') {
    return [
      { name: 'Pull-ups / Rows', sets, reps, restTime, tips: 'Pull to chest' },
      { name: 'Lat Pulldowns', sets, reps, restTime, tips: 'Wide grip for lats' },
      { name: 'Bicep Curls', sets, reps, restTime, tips: 'Full extension' },
      { name: 'Face Pulls', sets: sets - 1, reps, restTime, tips: 'Focus on rear delts' },
    ];
  } else if (focus === 'Legs') {
    return [
      { name: 'Squats', sets, reps, restTime, tips: 'Deep squats for full activation' },
      { name: 'Deadlifts', sets, reps, restTime, tips: 'Keep back neutral' },
      { name: 'Lunges', sets, reps, restTime, tips: 'Step forward, not out' },
      { name: 'Leg Curls', sets: sets - 1, reps, restTime, tips: 'Control the negative' },
      { name: 'Calf Raises', sets: sets - 1, reps, restTime, tips: 'Full stretch and contraction' },
    ];
  } else if (focus === 'Cardio & Strength') {
    return [
      { name: 'Circuit: Squats', sets, reps: '15-20', restTime: '30 seconds', tips: 'High intensity' },
      { name: 'Circuit: Push-ups', sets, reps: '12-15', restTime: '30 seconds', tips: 'Full body engagement' },
      { name: 'Circuit: Burpees', sets, reps: '10-12', restTime: '30 seconds', tips: 'Explosive movement' },
      { name: 'Circuit: Mountain Climbers', sets, reps: '20-30', restTime: '30 seconds', tips: 'Fast pace' },
      { name: 'Circuit: Jumping Lunges', sets: sets - 1, reps: '12-15 per leg', restTime: '30 seconds', tips: 'Land softly' },
    ];
  } else {
    // Full Body / General Fitness
    return [
      { name: 'Squats', sets, reps, restTime, tips: 'Foundation movement' },
      { name: 'Push-ups', sets, reps, restTime, tips: 'Core engaged' },
      { name: 'Rows / Pull-ups', sets, reps, restTime, tips: 'Balance push/pull' },
      { name: 'Plank', sets: 1, reps: '30-60 seconds', restTime: '60 seconds', tips: 'Hold perfect form' },
      { name: 'Lunges', sets: sets - 1, reps, restTime, tips: 'Unilateral strength' },
    ];
  }
}

/**
 * Generate monthly workout plan
 */
export function generateMonthlyPlan(
  dayOne: Date,
  month: number,
  year: number,
  surveyData: SurveyData,
  completedWorkouts: Record<string, boolean>,
  missedWorkouts: Record<string, boolean>
): MonthlyWorkoutPlan {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of month
  
  const workouts: DailyWorkout[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    const dayNumber = getDayNumber(dayOne, currentDate);
    const dateStr = currentDate.toISOString().split('T')[0];

    let workout = generateWorkoutForDay(
      dayNumber,
      surveyData.workoutGoal,
      surveyData.exerciseFrequency,
      dayOfWeek
    );

    workout.date = dateStr;
    
    // Mark as completed or missed if applicable
    if (completedWorkouts[dateStr]) {
      workout.completed = true;
    } else if (missedWorkouts[dateStr]) {
      workout.missed = true;
    } else if (workout.type === 'workout' && currentDate < new Date()) {
      // Past workout day that wasn't completed is missed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (currentDate < today) {
        workout.missed = true;
      }
    }

    workouts.push(workout);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    month,
    year,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    workouts,
  };
}
