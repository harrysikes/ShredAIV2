export interface Pose {
  torso: number;
  lShoulder: number;
  rShoulder: number;
  lElbow: number;
  rElbow: number;
  lHip: number;
  rHip: number;
  lKnee: number;
  rKnee: number;
}

export const POSES: Pose[] = [
  // 0 — Relaxed
  {
    torso: 0,
    lShoulder: 0,
    rShoulder: 0,
    lElbow: 0,
    rElbow: 0,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 1 — Light Flex
  {
    torso: 0,
    lShoulder: -18,
    rShoulder: 18,
    lElbow: -12,
    rElbow: 12,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 2 — Casual Athletic
  {
    torso: 0,
    lShoulder: -32,
    rShoulder: 32,
    lElbow: -22,
    rElbow: 22,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 3 — Front Double Biceps
  {
    torso: 0,
    lShoulder: -78,
    rShoulder: 78,
    lElbow: -46,
    rElbow: 46,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 4 — Side Chest
  {
    torso: -8,
    lShoulder: -28,
    rShoulder: 62,
    lElbow: -18,
    rElbow: 28,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 5 — Overhead Flex
  {
    torso: 0,
    lShoulder: -142,
    rShoulder: 142,
    lElbow: -62,
    rElbow: 62,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },

  // 6 — Dynamic Lunge
  {
    torso: 10,
    lShoulder: -18,
    rShoulder: 58,
    lElbow: 0,
    rElbow: 28,
    lHip: -26,
    rHip: 18,
    lKnee: 18,
    rKnee: -12,
  },

  // 7 — Peak Confident
  {
    torso: 0,
    lShoulder: -58,
    rShoulder: 58,
    lElbow: -18,
    rElbow: 18,
    lHip: 0,
    rHip: 0,
    lKnee: 0,
    rKnee: 0,
  },
];

