import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const fillAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fillAnimation, {
      toValue: progressValue,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progressValue, fillAnimation]);

  const renderSegments = () => {
    const segments = [];
    for (let i = 0; i < totalSteps; i++) {
      const isCompleted = i < currentStep;
      
      segments.push(
        <View key={i} style={styles.segmentContainer}>
          <View style={[styles.segment, isCompleted && styles.segmentCompleted]}>
            {isCompleted && (
              <Animated.View 
                style={[
                  styles.segmentFill,
                  {
                    width: fillAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]} 
              />
            )}
          </View>
        </View>
      );
    }
    return segments;
  };

  return (
    <View style={styles.container}>
      {/* Segmented Progress */}
      <View style={styles.segmentsContainer}>
        {renderSegments()}
      </View>
      
      {/* Step Counter */}
      <View style={styles.stepCounter}>
        <Text style={styles.stepText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  segmentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  segmentContainer: {
    alignItems: 'center',
    flex: 1,
  },
  segment: {
    width: '80%',
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  segmentCompleted: {
    backgroundColor: '#000000',
  },
  segmentFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#000000',
    borderRadius: 4,
  },

  stepCounter: {
    alignItems: 'center',
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default ProgressBar;

