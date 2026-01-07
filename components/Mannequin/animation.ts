import { Pose } from './poses';

export const lerp = (a: number = 0, b: number = 0, t: number = 0): number => {
  return a + (b - a) * t;
};

export const interpolatePose = (a: Pose, b: Pose, t: number): Pose => {
  return {
    torso: lerp(a.torso, b.torso, t),
    lShoulder: lerp(a.lShoulder, b.lShoulder, t),
    rShoulder: lerp(a.rShoulder, b.rShoulder, t),
    lElbow: lerp(a.lElbow, b.lElbow, t),
    rElbow: lerp(a.rElbow, b.rElbow, t),
    lHip: lerp(a.lHip, b.lHip, t),
    rHip: lerp(a.rHip, b.rHip, t),
    lKnee: lerp(a.lKnee, b.lKnee, t),
    rKnee: lerp(a.rKnee, b.rKnee, t),
  };
};

