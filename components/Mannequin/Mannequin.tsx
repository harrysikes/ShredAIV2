import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { MannequinSVG } from './MannequinSVG';
import { POSES } from './poses';
import { interpolatePose } from './animation';

interface MannequinProps {
  poseValue: number; // 0-7
}

export function Mannequin({ poseValue }: MannequinProps) {
  const [currentPose, setCurrentPose] = useState(() => {
    try {
      const clampedValue = Math.max(0, Math.min(7, poseValue || 0));
      const i = Math.floor(clampedValue);
      const t = clampedValue % 1;
      const poseA = POSES[Math.min(i, POSES.length - 1)] || POSES[0];
      const poseB = POSES[Math.min(i + 1, POSES.length - 1)] || poseA;
      return interpolatePose(poseA, poseB, t);
    } catch (error) {
      console.error('Error initializing pose:', error);
      return POSES[0];
    }
  });

  useEffect(() => {
    try {
      const clampedValue = Math.max(0, Math.min(7, poseValue || 0));
      const i = Math.floor(clampedValue);
      const t = clampedValue % 1;
      const poseA = POSES[Math.min(i, POSES.length - 1)] || POSES[0];
      const poseB = POSES[Math.min(i + 1, POSES.length - 1)] || poseA;
      setCurrentPose(interpolatePose(poseA, poseB, t));
    } catch (error) {
      console.error('Error updating pose:', error);
    }
  }, [poseValue]);

  try {
    if (!currentPose) {
      throw new Error('No pose data available');
    }

    const styles = {
      torso: { rotation: Number(currentPose?.torso) || 0 },
      leftShoulder: { rotation: Number(currentPose?.lShoulder) || 0 },
      rightShoulder: { rotation: Number(currentPose?.rShoulder) || 0 },
      leftElbow: { rotation: Number(currentPose?.lElbow) || 0 },
      rightElbow: { rotation: Number(currentPose?.rElbow) || 0 },
      leftHip: { rotation: Number(currentPose?.lHip) || 0 },
      rightHip: { rotation: Number(currentPose?.rHip) || 0 },
      leftKnee: { rotation: Number(currentPose?.lKnee) || 0 },
      rightKnee: { rotation: Number(currentPose?.rKnee) || 0 },
    };

    return <MannequinSVG styles={styles} />;
  } catch (error) {
    console.error('Error rendering Mannequin:', error);
    // Return null to prevent crashes, parent will show fallback
    return null;
  }
}

