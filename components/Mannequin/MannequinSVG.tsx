import { Svg, G, Rect, Circle } from 'react-native-svg';

interface MannequinSVGProps {
  styles: {
    torso: { rotation: number };
    leftShoulder: { rotation: number };
    rightShoulder: { rotation: number };
    leftElbow: { rotation: number };
    rightElbow: { rotation: number };
    leftHip: { rotation: number };
    rightHip: { rotation: number };
    leftKnee: { rotation: number };
    rightKnee: { rotation: number };
  };
}

export function MannequinSVG({ styles }: MannequinSVGProps) {
  try {
    // Ensure all rotation values are numbers
    const torsoRot = Number(styles.torso?.rotation) || 0;
    const lShoulderRot = Number(styles.leftShoulder?.rotation) || 0;
    const rShoulderRot = Number(styles.rightShoulder?.rotation) || 0;
    const lElbowRot = Number(styles.leftElbow?.rotation) || 0;
    const rElbowRot = Number(styles.rightElbow?.rotation) || 0;
    const lHipRot = Number(styles.leftHip?.rotation) || 0;
    const rHipRot = Number(styles.rightHip?.rotation) || 0;
    const lKneeRot = Number(styles.leftKnee?.rotation) || 0;
    const rKneeRot = Number(styles.rightKnee?.rotation) || 0;

    return (
      <Svg width={220} height={440} viewBox="0 0 220 440">
        {/* ROOT (feet-centered) - translate to center */}
        <G transform={`translate(110, 340)`}>
          {/* TORSO */}
          <G transform={`rotate(${torsoRot}, 0, 0)`}>
            <Rect x={-18} y={0} width={36} height={90} rx={14} fill="#1A1A1A" />

            {/* HEAD */}
            <Circle cx={0} cy={-26} r={14} fill="#1A1A1A" />

            {/* LEFT ARM */}
            <G transform={`translate(-18, 10) rotate(${lShoulderRot}, 0, 0)`}>
              <Rect x={-6} y={0} width={12} height={42} rx={6} fill="#1A1A1A" />

              {/* LEFT FOREARM */}
              <G transform={`translate(0, 36) rotate(${lElbowRot}, 0, 0)`}>
                <Rect x={-5} y={0} width={10} height={36} rx={5} fill="#1A1A1A" />
              </G>
            </G>

            {/* RIGHT ARM */}
            <G transform={`translate(18, 10) rotate(${rShoulderRot}, 0, 0)`}>
              <Rect x={-6} y={0} width={12} height={42} rx={6} fill="#1A1A1A" />

              {/* RIGHT FOREARM */}
              <G transform={`translate(0, 36) rotate(${rElbowRot}, 0, 0)`}>
                <Rect x={-5} y={0} width={10} height={36} rx={5} fill="#1A1A1A" />
              </G>
            </G>
          </G>

          {/* LEFT LEG */}
          <G transform={`translate(-10, 90) rotate(${lHipRot}, 0, 0)`}>
            <Rect x={-6} y={0} width={12} height={54} rx={6} fill="#1A1A1A" />

            {/* LEFT CALF */}
            <G transform={`translate(0, 48) rotate(${lKneeRot}, 0, 0)`}>
              <Rect x={-5} y={0} width={10} height={44} rx={5} fill="#1A1A1A" />
            </G>
          </G>

          {/* RIGHT LEG */}
          <G transform={`translate(10, 90) rotate(${rHipRot}, 0, 0)`}>
            <Rect x={-6} y={0} width={12} height={54} rx={6} fill="#1A1A1A" />

            {/* RIGHT CALF */}
            <G transform={`translate(0, 48) rotate(${rKneeRot}, 0, 0)`}>
              <Rect x={-5} y={0} width={10} height={44} rx={5} fill="#1A1A1A" />
            </G>
          </G>
        </G>
      </Svg>
    );
  } catch (error) {
    console.error('Error rendering MannequinSVG:', error);
    return null;
  }
}

