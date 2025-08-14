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
  const [analysisStep, setAnalysisStep] = React.useState(0);

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

    // Simulate AI analysis steps
    const performAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Human detection
        setAnalysisStep(1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Step 2: Muscle visibility analysis
        setAnalysisStep(2);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Step 3: Body proportion calculations
        setAnalysisStep(3);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Step 4: Final body fat calculation
        setAnalysisStep(4);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Call the enhanced body fat calculation API
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

  const getAnalysisStepText = () => {
    switch (analysisStep) {
      case 1:
        return 'Detecting human presence and analyzing pose...';
      case 2:
        return 'Analyzing muscle visibility and definition...';
      case 3:
        return 'Calculating body proportions and ratios...';
      case 4:
        return 'Computing final body fat percentage...';
      default:
        return 'Initializing AI analysis...';
    }
  };

  const getAnalysisStepDetail = () => {
    switch (analysisStep) {
      case 1:
        return 'Using computer vision to identify anatomical features';
      case 2:
        return 'Assessing muscle definition across major muscle groups';
      case 3:
        return 'Measuring shoulder-to-waist and chest-to-waist ratios';
      case 4:
        return 'Combining all factors for accurate estimation';
      default:
        return 'Preparing advanced body composition analysis';
    }
  };

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
            AI Body Composition Analysis
          </Animated.Text>
          
          <Animated.Text
            style={[
              styles.subText,
              {
                opacity: textAnim,
              },
            ]}
          >
            {getAnalysisStepText()}
          </Animated.Text>
          
          <Animated.Text
            style={[
              styles.detailText,
              {
                opacity: textAnim,
              },
            ]}
          >
            {getAnalysisStepDetail()}
          </Animated.Text>
        </View>

        {/* Progress indicators */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressStep, analysisStep >= 1 && styles.progressStepCompleted]}>
            <View style={[styles.progressDot, analysisStep >= 1 && styles.progressDotCompleted]} />
            <Text style={[styles.progressText, analysisStep >= 1 && styles.progressTextCompleted]}>
              Human Detection
            </Text>
          </View>
          
          <View style={[styles.progressStep, analysisStep >= 2 && styles.progressStepCompleted]}>
            <View style={[styles.progressDot, analysisStep >= 2 && styles.progressDotCompleted]} />
            <Text style={[styles.progressText, analysisStep >= 2 && styles.progressTextCompleted]}>
              Muscle Analysis
            </Text>
          </View>
          
          <View style={[styles.progressStep, analysisStep >= 3 && styles.progressStepCompleted]}>
            <View style={[styles.progressDot, analysisStep >= 3 && styles.progressDotCompleted]} />
            <Text style={[styles.progressText, analysisStep >= 3 && styles.progressTextCompleted]}>
              Body Proportions
            </Text>
          </View>
          
          <View style={[styles.progressStep, analysisStep >= 4 && styles.progressStepCompleted]}>
            <View style={[styles.progressDot, analysisStep >= 4 && styles.progressDotCompleted]} />
            <Text style={[styles.progressText, analysisStep >= 4 && styles.progressTextCompleted]}>
              Final Calculation
            </Text>
          </View>
        </View>

        {/* AI capabilities info */}
        <View style={styles.aiInfoContainer}>
          <Text style={styles.aiInfoTitle}>🤖 AI Analysis Capabilities:</Text>
          <Text style={styles.aiInfoText}>
            • Computer vision muscle detection
          </Text>
          <Text style={styles.aiInfoText}>
            • Anatomical proportion analysis
          </Text>
          <Text style={styles.aiInfoText}>
            • Lighting and pose quality assessment
          </Text>
          <Text style={styles.aiInfoText}>
            • Multi-factor body fat estimation
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
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.6,
    lineHeight: 18,
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
  progressStepCompleted: {
    opacity: 1,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    marginRight: 15,
  },
  progressDotCompleted: {
    backgroundColor: '#000000',
  },
  progressText: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.6,
  },
  progressTextCompleted: {
    opacity: 1,
    fontWeight: '600',
  },
  aiInfoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#000000',
  },
  aiInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  aiInfoText: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 6,
  },
});
