export interface WeeklyChallenge {
  name: string;
  rules: string[];
  equipment: string[];
  timeNeeded: string;
}

// Array of weekly challenges - rotates based on week number
const CHALLENGES: WeeklyChallenge[] = [
  {
    name: "Mini Murph",
    rules: [
      "800m run",
      "50 pull-ups",
      "100 push-ups",
      "150 air squats",
      "800m run",
      "Partition as needed",
      "Optional weighted vest",
      "Time cap: 30 minutes"
    ],
    equipment: ["Pull-up bar", "Optional: weighted vest"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Quarter Murph Ladder",
    rules: [
      "400m run",
      "25 pull-ups",
      "50 push-ups",
      "75 squats",
      "400m run",
      "Complete all exercises in order"
    ],
    equipment: ["Pull-up bar"],
    timeNeeded: "20-25 minutes"
  },
  {
    name: "Cindy → Run Finisher",
    rules: [
      "20 min AMRAP: 5 pull-ups, 10 push-ups, 15 squats",
      "Then 1-mile run for time",
      "Complete as many rounds as possible in 20 minutes",
      "Finish with a 1-mile run"
    ],
    equipment: ["Pull-up bar"],
    timeNeeded: "25-30 minutes"
  },
  {
    name: "Chad Mini (Box Step Hell)",
    rules: [
      "500 box step-ups (20\" box)",
      "Time cap: 30 minutes",
      "Partition freely",
      "Step up with full leg extension"
    ],
    equipment: ["Box or step (20 inches high)"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Death by Burpees",
    rules: [
      "Minute 1: 1 burpee",
      "Minute 2: 2 burpees",
      "Continue adding 1 burpee each minute",
      "Continue until failure or time cap",
      "Time cap: 30 minutes"
    ],
    equipment: ["None - bodyweight only"],
    timeNeeded: "30 minutes max"
  },
  {
    name: "100s for Time",
    rules: [
      "100 push-ups",
      "100 sit-ups",
      "100 squats",
      "100 jumping lunges",
      "Complete all exercises for time",
      "Rest as needed between exercises"
    ],
    equipment: ["None - bodyweight only"],
    timeNeeded: "20-35 minutes"
  },
  {
    name: "Core From Hell",
    rules: [
      "5 rounds total",
      "Each round: 1 min plank, 30 V-ups, 40 Russian twists, 20 leg raises",
      "Rest 1-2 minutes between rounds",
      "Maintain form throughout"
    ],
    equipment: ["Yoga mat (optional)"],
    timeNeeded: "20-25 minutes"
  },
  {
    name: "EMOM 30 (Bodyweight Grinder)",
    rules: [
      "Min 1: 15 push-ups",
      "Min 2: 20 squats",
      "Min 3: 10 burpees",
      "Repeat for 10 rounds (30 minutes total)",
      "Use remaining time in each minute as rest"
    ],
    equipment: ["None - bodyweight only"],
    timeNeeded: "30 minutes"
  },
  {
    name: "DB Complex AMRAP",
    rules: [
      "10 goblet squats",
      "10 DB push press",
      "10 DB RDL (Romanian Deadlifts)",
      "10 renegade rows",
      "Repeat for 30 minutes",
      "Complete as many rounds as possible"
    ],
    equipment: ["Dumbbells (moderate weight)"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Farmer's Carry Gauntlet",
    rules: [
      "100m heavy carry",
      "20 push-ups",
      "20 air squats",
      "Repeat for 30 minutes",
      "Use heavy dumbbells or kettlebells for carry"
    ],
    equipment: ["Heavy dumbbells or kettlebells"],
    timeNeeded: "30 minutes"
  },
  {
    name: "KB Swing + Core Ladder",
    rules: [
      "10 KB swings → 20 → 30 → 40 → 50",
      "Between sets: 30-sec hollow hold",
      "Increase swings by 10 each round",
      "Rest as needed between rounds"
    ],
    equipment: ["Kettlebell"],
    timeNeeded: "20-25 minutes"
  },
  {
    name: "Upper Pump Destroyer",
    rules: [
      "5 rounds total",
      "Each round: 12 DB bench, 12 shoulder raises, 12 curls, 12 triceps extensions",
      "Rest 1-2 minutes between rounds",
      "Choose appropriate weight for all exercises"
    ],
    equipment: ["Dumbbells", "Bench or floor"],
    timeNeeded: "25-30 minutes"
  },
  {
    name: "5K-ish Intervals",
    rules: [
      "400m run",
      "30 squats",
      "20 push-ups",
      "Repeat for 30 minutes",
      "Maintain consistent pace throughout"
    ],
    equipment: ["None - bodyweight only"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Row / Bike EMOM",
    rules: [
      "Min 1: 15-18 calories on rower/bike",
      "Min 2: 15 wall balls",
      "Min 3: Rest",
      "Repeat for 10 rounds (30 minutes total)",
      "Use remaining time as rest"
    ],
    equipment: ["Rower or exercise bike", "Wall ball (or substitute with air squats)"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Sprint & Drop",
    rules: [
      "200m sprint",
      "20 burpees",
      "30 sit-ups",
      "Repeat until time cap",
      "Time cap: 30 minutes"
    ],
    equipment: ["None - bodyweight only"],
    timeNeeded: "30 minutes"
  },
  {
    name: "Staircase Hell",
    rules: [
      "5 stair sprints",
      "20 lunges",
      "20 push-ups",
      "Repeat for duration",
      "Complete all exercises in sequence before repeating"
    ],
    equipment: ["Stairs", "None for exercises"],
    timeNeeded: "20-30 minutes"
  }
];

/**
 * Get the current week number (0-51, resets every year)
 * This ensures challenges rotate weekly
 */
function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.floor(days / 7);
}

/**
 * Get the current week's challenge
 * Resets every Sunday night (technically Monday 00:00)
 */
export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = getWeekNumber();
  const challengeIndex = weekNumber % CHALLENGES.length;
  return CHALLENGES[challengeIndex];
}
