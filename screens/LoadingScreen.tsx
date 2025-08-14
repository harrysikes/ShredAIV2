import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { calculateBodyFat } from '../api/bodyFatApi';

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

export default function LoadingScreen() {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const { surveyData, capturedImage, setBodyFatPercentage, setIsLoading } = useSurveyStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Start text fade animation
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Simulate AI analysis
    const performAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Call the body fat calculation API
        const result = await calculateBodyFat({
          surveyData,
          imageData: capturedImage || '',
        });
        
        setBodyFatPercentage(result.bodyFatPercentage);
        setIsLoading(false);
        
        // Navigate to paywall after a short delay
        setTimeout(() => {
          navigation.navigate('Paywall');
        }, 500);
        
      } catch (error) {
        console.error('Error during analysis:', error);
        // Handle error - could show error message or retry
        setIsLoading(false);
      }
    };

    // Start analysis after a short delay
    const timer = setTimeout(performAnalysis, 1000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo or app name */}
        <Text style={styles.appName}>ShredAI</Text>
        
        {/* Main loading area */}
        <View style={styles.loadingArea}>
          <Animated.View
            style={[
              styles.spinnerContainer,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <ActivityIndicator size="large" color="#000000" />
          </Animated.View>
          
          <Animated.Text
            style={[
              styles.loadingText,
              {
                opacity: textAnim,
              },
            ]}
          >
            Analyzing your photo...
          </Animated.Text>
          
          <Animated.Text
            style={[
              styles.subText,
              {
                opacity: textAnim,
              },
            ]}
          >
            Our AI is calculating your body fat percentage
          </Animated.Text>
        </View>

        {/* Progress indicators */}
        <View style={styles.progressContainer}>
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Processing image</Text>
          </View>
          
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Analyzing body composition</Text>
          </View>
          
          <View style={styles.progressStep}>
            <View style={styles.progressDot} />
            <Text style={styles.progressText}>Calculating results</Text>
          </View>
        </View>

        {/* Fun fact */}
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactText}>
            💡 Did you know? Body fat percentage is more accurate than BMI for measuring fitness progress.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 60,
    letterSpacing: 2,
  },
  loadingArea: {
    alignItems: 'center',
    marginBottom: 60,
  },
  spinnerContainer: {
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000000',
    marginRight: 15,
  },
  progressText: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.8,
  },
  funFactContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
  },
  funFactText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
  },
});
