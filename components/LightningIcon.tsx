import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

interface LightningIconProps {
  streak: number;
  size?: number;
}

export default function LightningIcon({ streak, size = 40 }: LightningIconProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sparkAnim1 = useRef(new Animated.Value(0)).current;
  const sparkAnim2 = useRef(new Animated.Value(0)).current;
  const sparkAnim3 = useRef(new Animated.Value(0)).current;
  const sparkAnim4 = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0.8)).current;

  // Calculate size multiplier based on streak (1x to 1.5x)
  const sizeMultiplier = Math.min(1 + (streak / 30), 1.5);
  const iconSize = size * sizeMultiplier;
  
  // Number of sparks based on streak
  const sparkCount = Math.min(Math.floor(streak / 3), 4);

  useEffect(() => {
    // Pulsing animation for the lightning
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Spark animations
    const createSparkAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(animValue, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(animValue, {
              toValue: 0,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    };

    pulse.start();
    const animations: Animated.CompositeAnimation[] = [pulse];
    
    if (sparkCount > 0) {
      animations.push(createSparkAnimation(sparkAnim1, 0));
    }
    if (sparkCount > 1) {
      animations.push(createSparkAnimation(sparkAnim2, 200));
    }
    if (sparkCount > 2) {
      animations.push(createSparkAnimation(sparkAnim3, 400));
    }
    if (sparkCount > 3) {
      animations.push(createSparkAnimation(sparkAnim4, 600));
    }

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [streak, sparkCount]);

  // Lightning bolt path
  const lightningPath = `M ${iconSize * 0.5} ${iconSize * 0.1}
    L ${iconSize * 0.35} ${iconSize * 0.4}
    L ${iconSize * 0.45} ${iconSize * 0.4}
    L ${iconSize * 0.3} ${iconSize * 0.9}
    L ${iconSize * 0.5} ${iconSize * 0.6}
    L ${iconSize * 0.4} ${iconSize * 0.6}
    Z`;

  // Spark positions (around the lightning)
  const sparkPositions = [
    { x: iconSize * 0.2, y: iconSize * 0.3 },
    { x: iconSize * 0.7, y: iconSize * 0.4 },
    { x: iconSize * 0.25, y: iconSize * 0.7 },
    { x: iconSize * 0.75, y: iconSize * 0.5 },
  ];

  const sparkTranslate1 = sparkAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const sparkTranslate2 = sparkAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const sparkTranslate3 = sparkAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 7],
  });

  const sparkTranslate4 = sparkAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 9],
  });

  return (
    <View style={[styles.container, { width: iconSize, height: iconSize }]}>
      <Animated.View
        style={[
          styles.lightningContainer,
          {
            transform: [{ scale: scaleAnim }],
            width: iconSize,
            height: iconSize,
          },
        ]}
      >
        <Svg width={iconSize} height={iconSize} viewBox={`0 0 ${iconSize} ${iconSize}`}>
          <Path
            d={lightningPath}
            fill="#FFD700"
            stroke="#FFA500"
            strokeWidth={iconSize * 0.02}
          />
        </Svg>
      </Animated.View>
      
      {/* Sparks as separate animated views */}
      {sparkCount > 0 && (
        <>
          <Animated.View
            style={[
              styles.spark,
              {
                left: sparkPositions[0].x - iconSize * 0.075,
                top: sparkPositions[0].y - iconSize * 0.075,
                width: iconSize * 0.15,
                height: iconSize * 0.15,
                transform: [
                  { translateX: sparkTranslate1 },
                  { translateY: sparkTranslate1 },
                ],
                opacity: opacityAnim,
              },
            ]}
          >
            <Svg width={iconSize * 0.15} height={iconSize * 0.15}>
              <Circle cx={iconSize * 0.075} cy={iconSize * 0.075} r={iconSize * 0.03} fill="#FFD700" />
              <Circle cx={iconSize * 0.1} cy={iconSize * 0.05} r={iconSize * 0.02} fill="#FFA500" />
            </Svg>
          </Animated.View>
          
          {sparkCount > 1 && (
            <Animated.View
              style={[
                styles.spark,
                {
                  left: sparkPositions[1].x - iconSize * 0.075,
                  top: sparkPositions[1].y - iconSize * 0.075,
                  width: iconSize * 0.15,
                  height: iconSize * 0.15,
                  transform: [
                    { translateX: sparkTranslate2 },
                    { translateY: sparkTranslate2 },
                  ],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Svg width={iconSize * 0.15} height={iconSize * 0.15}>
                <Circle cx={iconSize * 0.075} cy={iconSize * 0.075} r={iconSize * 0.03} fill="#FFD700" />
                <Circle cx={iconSize * 0.05} cy={iconSize * 0.1} r={iconSize * 0.02} fill="#FFA500" />
              </Svg>
            </Animated.View>
          )}
          
          {sparkCount > 2 && (
            <Animated.View
              style={[
                styles.spark,
                {
                  left: sparkPositions[2].x - iconSize * 0.075,
                  top: sparkPositions[2].y - iconSize * 0.075,
                  width: iconSize * 0.15,
                  height: iconSize * 0.15,
                  transform: [
                    { translateX: sparkTranslate3 },
                    { translateY: sparkTranslate3 },
                  ],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Svg width={iconSize * 0.15} height={iconSize * 0.15}>
                <Circle cx={iconSize * 0.075} cy={iconSize * 0.075} r={iconSize * 0.03} fill="#FFD700" />
                <Circle cx={iconSize * 0.1} cy={iconSize * 0.1} r={iconSize * 0.02} fill="#FFA500" />
              </Svg>
            </Animated.View>
          )}
          
          {sparkCount > 3 && (
            <Animated.View
              style={[
                styles.spark,
                {
                  left: sparkPositions[3].x - iconSize * 0.075,
                  top: sparkPositions[3].y - iconSize * 0.075,
                  width: iconSize * 0.15,
                  height: iconSize * 0.15,
                  transform: [
                    { translateX: sparkTranslate4 },
                    { translateY: sparkTranslate4 },
                  ],
                  opacity: opacityAnim,
                },
              ]}
            >
              <Svg width={iconSize * 0.15} height={iconSize * 0.15}>
                <Circle cx={iconSize * 0.075} cy={iconSize * 0.075} r={iconSize * 0.03} fill="#FFD700" />
                <Circle cx={iconSize * 0.05} cy={iconSize * 0.05} r={iconSize * 0.02} fill="#FFA500" />
              </Svg>
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  lightningContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spark: {
    position: 'absolute',
  },
});
