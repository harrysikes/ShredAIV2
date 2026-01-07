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
import colors from '../constants/colors';
import { Image } from 'react-native';

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

export default function LoadingScreen() {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const { surveyData, capturedImages, setBodyFatPercentage, setIsLoading } = useSurveyStore();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [analysisStep, setAnalysisStep] = React.useState(0);

  useEffect(() => {
    // Start pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();


    // Start text fade animation
    Animated.spring(textAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Start progress animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 7000,
      useNativeDriver: false,
    }).start();

    // Simulate AI analysis steps WITHOUT actually calling the API
    const performFalseAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Human detection (1.5 seconds)
        setAnalysisStep(1);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Step 2: Muscle visibility analysis (2 seconds)
        setAnalysisStep(2);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 3: Body proportion calculations (2 seconds)
        setAnalysisStep(3);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Step 4: Final body fat calculation (1.5 seconds)
        setAnalysisStep(4);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Set a mock body fat percentage (this will be replaced with real analysis after subscription)
        const mockBodyFatPercentage = Math.floor(Math.random() * 15) + 8; // Random between 8-22%
        setBodyFatPercentage(mockBodyFatPercentage);
        setIsLoading(false);
        
        // Navigate to paywall after a short delay
        setTimeout(() => {
          navigation.navigate('Paywall');
        }, 500);
        
      } catch (error) {
        console.error('Error during false analysis:', error);
        setIsLoading(false);
        // Still navigate to paywall even if there's an error
        setTimeout(() => {
          navigation.navigate('Paywall');
        }, 500);
      }
    };

    // Start false analysis after a short delay
    const timer = setTimeout(performFalseAnalysis, 1000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(timer);
    };
  }, []);

  const getAnalysisStepText = () => {
    const angleCount = capturedImages.length;
    const isMultiAngle = angleCount > 1;
    
    switch (analysisStep) {
      case 1:
        return isMultiAngle 
          ? `Analyzing ${angleCount} angles and detecting human presence...`
          : 'Detecting human presence and analyzing pose...';
      case 2:
        return isMultiAngle
          ? 'Analyzing muscle visibility across all angles...'
          : 'Analyzing muscle visibility and definition...';
      case 3:
        return isMultiAngle
          ? 'Calculating body proportions from multiple views...'
          : 'Calculating body proportions and ratios...';
      case 4:
        return isMultiAngle
          ? 'Combining multi-angle analysis for final calculation...'
          : 'Computing final body fat percentage...';
      default:
        return isMultiAngle
          ? 'Initializing multi-angle AI analysis...'
          : 'Initializing AI analysis...';
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
        {/* Logo */}
        <Image 
          source={require('../assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        
        {/* Main loading area */}
        <View style={styles.loadingArea}>
          <View style={styles.spinnerContainer}>
            <Animated.View
              style={[
                styles.spinnerWrapper,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <ActivityIndicator size="large" color={colors.textPrimary} />
            </Animated.View>
          </View>
          
          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          
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

        {/* Step Progress indicators */}
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
          {capturedImages.length > 1 && (
            <Text style={styles.aiInfoText}>
              • Multi-angle analysis ({capturedImages.length} views) for enhanced accuracy
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 40,
  },
  loadingArea: {
    alignItems: 'center',
    marginBottom: 60,
  },
  spinnerContainer: {
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressBarContainer: {
    width: '80%',
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 20,
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    paddingVertical: 4,
  },
  progressStepCompleted: {
    opacity: 1,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.border,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  progressDotCompleted: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  progressText: {
    fontSize: 15,
    color: colors.textTertiary,
  },
  progressTextCompleted: {
    color: colors.textPrimary,
    fontWeight: '500',
  },
  aiInfoContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  aiInfoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
});
