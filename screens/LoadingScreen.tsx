import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/supabaseStore';
import colors from '../constants/colors';

type LoadingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Loading'>;

export default function LoadingScreen() {
  const navigation = useNavigation<LoadingScreenNavigationProp>();
  const { surveyData, capturedImages, setBodyFatPercentage, setIsLoading } = useSurveyStore();

  // Validate that we have captured images before proceeding
  useEffect(() => {
    if (!capturedImages || capturedImages.length === 0) {
      console.error('No images captured - cannot proceed with analysis');
      Alert.alert(
        'No Images',
        'No images were captured. Please return to the camera and take photos.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }

    // Validate image quality - check that images have minimum size
    const invalidImages = capturedImages.filter(img => !img.base64 || img.base64.length < 20000);
    if (invalidImages.length > 0) {
      console.error('Invalid or blank images detected');
      Alert.alert(
        'Invalid Images',
        'Some images appear to be blank or invalid. Please retake the photos.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
      return;
    }
  }, [capturedImages, navigation]);
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

    // Real AI analysis using OpenAI GPT-4o Vision API
    const performRealAnalysis = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Human detection (update UI)
        setAnalysisStep(1);
        
        // Import the API function dynamically
        const { analyzeBodyComposition } = await import('../api/bodyAnalysisApi');
        
        // Prepare images (convert to array of base64 strings)
        const imageBase64Array = capturedImages.map(img => img.base64);
        
        if (imageBase64Array.length === 0) {
          throw new Error('No images to analyze');
        }
        
        // Step 2: Muscle visibility analysis (update UI)
        setAnalysisStep(2);
        
        // Call real OpenAI API
        const result = await analyzeBodyComposition({
          images: imageBase64Array,
          surveyData: surveyData,
        });
        
        if (!result.success || !result.data) {
          throw new Error(result.error || 'Analysis failed');
        }
        
        // Step 3: Body proportion calculations (update UI)
        setAnalysisStep(3);
        
        // Extract body fat percentage from result
        const bodyFatPercentage = result.data.bodyFatPercentage;
        
        if (!bodyFatPercentage || bodyFatPercentage <= 0) {
          throw new Error('Invalid analysis result');
        }
        
        // Step 4: Final body fat calculation (update UI)
        setAnalysisStep(4);
        
        // Small delay to show final step
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set the real body fat percentage from OpenAI analysis
        setBodyFatPercentage(bodyFatPercentage);
        setIsLoading(false);
        
        // Navigate to paywall after a short delay
        setTimeout(() => {
          navigation.navigate('Paywall');
        }, 500);
        
      } catch (error: any) {
        console.error('Error during AI analysis:', error);
        setIsLoading(false);
        
        // Show error alert
        Alert.alert(
          'Analysis Error',
          error.message || 'Failed to analyze body composition. Please try again.',
          [
            {
              text: 'Try Again',
              onPress: () => navigation.goBack(),
            },
            {
              text: 'Skip for Now',
              style: 'cancel',
              onPress: () => {
                // Use a fallback body fat percentage based on survey data
                const fallbackBodyFat = calculateFallbackBodyFat(surveyData);
                setBodyFatPercentage(fallbackBodyFat);
                setTimeout(() => {
                  navigation.navigate('Paywall');
                }, 500);
              },
            },
          ]
        );
      }
    };
    
    // Fallback calculation if API fails
    const calculateFallbackBodyFat = (survey: any) => {
      let baseBodyFat = survey.sex === 'male' ? 15 : 25;
      
      if (survey.exerciseFrequency === 'very-often') baseBodyFat -= 4;
      else if (survey.exerciseFrequency === 'often') baseBodyFat -= 3;
      else if (survey.exerciseFrequency === 'sometimes') baseBodyFat -= 2;
      
      return Math.max(5, Math.min(35, baseBodyFat + (Math.random() - 0.5) * 4));
    };

    // Start real AI analysis after a short delay
    const timer = setTimeout(performRealAnalysis, 1000);

    return () => {
      pulseAnimation.stop();
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount - capturedImages are validated above

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
