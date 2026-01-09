import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore, CameraAngle } from '../state/supabaseStore';
import { detectHuman, HumanDetectionResponse } from '../api/humanDetectionApi';
import { Button } from '../components/ui';
import colors from '../constants/colors';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface SetupQuality {
  lighting: 'optimal' | 'good' | 'poor';
  angle: 'optimal' | 'good' | 'poor';
  distance: 'optimal' | 'good' | 'poor';
  pose: 'optimal' | 'good' | 'poor';
  overall: number; // 0-100
}

const CAMERA_ANGLES: CameraAngle[] = ['front', 'side', 'back'];

export default function CameraScreen() {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const { 
    addCapturedImage, 
    capturedImages, 
    currentAngle, 
    setCurrentAngle 
  } = useSurveyStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [humanDetected, setHumanDetected] = useState<boolean | null>(null);
  const [detectionMessage, setDetectionMessage] = useState<string>('');
  
  // Get current angle index
  const currentAngleIndex = CAMERA_ANGLES.indexOf(currentAngle);
  const isLastAngle = currentAngleIndex === CAMERA_ANGLES.length - 1;
  const [setupQuality, setSetupQuality] = useState<SetupQuality>({
    lighting: 'poor',
    angle: 'poor',
    distance: 'poor',
    pose: 'poor',
    overall: 0
  });
  const [showSetupGuide, setShowSetupGuide] = useState(false); // Collapsed by default
  const [showQualityDetails, setShowQualityDetails] = useState(false); // Collapsed by default
  const cameraRef = useRef<any>(null);
  const countdownAnim = useRef(new Animated.Value(1)).current;
  const qualityCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const qualityDetailsAnim = useRef(new Animated.Value(0)).current;
  const tipsAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        // Use the Camera object for permissions
        const { Camera } = await import('expo-camera');
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isCountingDown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        Animated.sequence([
          Animated.timing(countdownAnim, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(countdownAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      takePicture();
    }
  }, [countdown, isCountingDown]);

  // Reset to first angle when screen is focused (new scan)
  useFocusEffect(
    React.useCallback(() => {
      // Always start from front angle when camera screen is focused
      setCurrentAngle('front');
    }, [setCurrentAngle])
  );

  // Start quality monitoring when camera is ready
  useEffect(() => {
    if (hasPermission) {
      startQualityMonitoring();
    }
    return () => {
      if (qualityCheckInterval.current) {
        clearInterval(qualityCheckInterval.current);
      }
    };
  }, [hasPermission]);

  // Initialize quality details animation
  useEffect(() => {
    if (showQualityDetails) {
      Animated.timing(qualityDetailsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(qualityDetailsAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [showQualityDetails]);

  // Initialize tips animation
  useEffect(() => {
    if (showSetupGuide) {
      Animated.timing(tipsAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(tipsAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [showSetupGuide]);

  const startQualityMonitoring = () => {
    // Simulate real-time quality analysis
    qualityCheckInterval.current = setInterval(() => {
      analyzeSetupQuality();
    }, 2000); // Check every 2 seconds
  };

  const analyzeSetupQuality = () => {
    // Simulate analysis of camera feed
    // In production, this would analyze actual camera frames
    const lighting: 'optimal' | 'good' | 'poor' = Math.random() > 0.3 ? 'optimal' : Math.random() > 0.5 ? 'good' : 'poor';
    const angle: 'optimal' | 'good' | 'poor' = Math.random() > 0.4 ? 'optimal' : Math.random() > 0.6 ? 'good' : 'poor';
    const distance: 'optimal' | 'good' | 'poor' = Math.random() > 0.35 ? 'optimal' : Math.random() > 0.55 ? 'good' : 'poor';
    const pose: 'optimal' | 'good' | 'poor' = Math.random() > 0.45 ? 'optimal' : Math.random() > 0.65 ? 'good' : 'poor';
    
    const scores = { lighting, angle, distance, pose };
    const overall = calculateOverallScore(scores);
    
    setSetupQuality({ ...scores, overall });
  };

  const calculateOverallScore = (scores: Omit<SetupQuality, 'overall'>): number => {
    let total = 0;
    Object.values(scores).forEach(score => {
      if (score === 'optimal') total += 25;
      else if (score === 'good') total += 15;
      else total += 5;
    });
    return Math.min(100, total);
  };

  const   getQualityColor = (quality: 'optimal' | 'good' | 'poor') => {
    switch (quality) {
      case 'optimal': return colors.success;
      case 'good': return colors.warning;
      case 'poor': return colors.error;
    }
  };

  const getQualityIcon = (quality: 'optimal' | 'good' | 'poor') => {
    switch (quality) {
      case 'optimal': return '✅';
      case 'good': return '⚠️';
      case 'poor': return '❌';
    }
  };

  const getSetupFeedback = (): string[] => {
    const feedback: string[] = [];
    
    if (setupQuality.lighting === 'poor') {
      feedback.push('Move to better lighting or turn on more lights');
    }
    
    // Angle-specific feedback
    if (currentAngle === 'front') {
      if (setupQuality.angle === 'poor') {
        feedback.push('Face camera directly, look straight ahead');
      }
      if (setupQuality.pose === 'poor') {
        feedback.push('Show upper body clearly, arms slightly away from sides');
      }
    } else if (currentAngle === 'side') {
      if (setupQuality.angle === 'poor') {
        feedback.push('Turn 90° to face your profile, keep shoulders square');
      }
      if (setupQuality.pose === 'poor') {
        feedback.push('Stand straight, don\'t lean forward or backward');
      }
    } else if (currentAngle === 'back') {
      if (setupQuality.angle === 'poor') {
        feedback.push('Turn completely around, back facing camera');
      }
      if (setupQuality.pose === 'poor') {
        feedback.push('Stand straight, arms slightly away from sides');
      }
    }
    
    if (setupQuality.distance === 'poor') {
      feedback.push('Stand 3-6 feet from camera');
    }
    
    if (feedback.length === 0) {
      feedback.push('Perfect setup! Ready for analysis');
    }
    
    return feedback;
  };

  const getAngleInstructions = (): string => {
    switch (currentAngle) {
      case 'front':
        return 'Face the camera directly. Keep your arms slightly away from your sides.';
      case 'side':
        return 'Turn 90° to show your profile. Keep your shoulders square and stand straight.';
      case 'back':
        return 'Turn completely around. Your back should face the camera.';
      default:
        return 'Position yourself in the frame';
    }
  };

  const getAngleTitle = (): string => {
    switch (currentAngle) {
      case 'front':
        return 'Front View';
      case 'side':
        return 'Side View';
      case 'back':
        return 'Back View';
      default:
        return 'Camera';
    }
  };

  const startCountdown = () => {
    if (setupQuality.overall < 70) {
      Alert.alert(
        'Setup Needs Improvement',
        'Your camera setup quality is below 70%. For best results, please improve:\n\n' + 
        getSetupFeedback().join('\n'),
        [{ text: 'Continue Anyway', onPress: () => proceedWithCountdown() }]
      );
      return;
    }
    proceedWithCountdown();
  };

  const proceedWithCountdown = () => {
    setCountdown(5);
    setIsCountingDown(true);
    setHumanDetected(null);
    setDetectionMessage('');
    countdownAnim.setValue(1);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsAnalyzing(true);
        
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9, // Higher quality for better analysis
          base64: true,
        });
        
        // Detect human in the photo using the API service
        const detectionResult: HumanDetectionResponse = await detectHuman({
          imageData: photo.base64 || '',
          imageFormat: 'jpg',
        });
        
        setHumanDetected(detectionResult.humanDetected);
        setDetectionMessage(detectionResult.message);
        
        if (detectionResult.humanDetected) {
          // Human detected, save the photo with current angle
          addCapturedImage(currentAngle, photo.base64 || '');
          setIsCountingDown(false);
          setCountdown(5);
          
          // If not last angle, move to next angle
          if (!isLastAngle) {
            const nextAngleIndex = currentAngleIndex + 1;
            setCurrentAngle(CAMERA_ANGLES[nextAngleIndex]);
            setHumanDetected(null);
            setDetectionMessage('');
          } else {
            // All angles captured, navigate to loading screen
            navigation.navigate('Loading');
          }
        } else {
          // No human detected, show error and allow retake
          setIsCountingDown(false);
          setCountdown(5);
          showHumanDetectionError(detectionResult.message);
        }
        
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
        setIsCountingDown(false);
        setCountdown(5);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const showHumanDetectionError = (message: string) => {
    const tips = [
      '• Ensure your entire upper body is visible',
      '• Stand 3-6 feet from the camera',
      '• Make sure you are well-lit',
      '• Remove any obstructions',
      '• Face the camera directly'
    ].join('\n');

    Alert.alert(
      'No Person Detected',
      `${message}\n\n${tips}\n\nPlease reposition and try again.`,
      [
        {
          text: 'Retake Photo',
          onPress: () => {
            setHumanDetected(null);
            setDetectionMessage('');
          },
        },
      ]
    );
  };

  const flipCamera = () => {
    setCameraType(
      cameraType === 'back' ? 'front' : 'back'
    );
  };

  const getShutterButtonStyle = () => {
    if (isCountingDown || isAnalyzing) {
      return [styles.shutterButton, styles.shutterButtonDisabled];
    }
    return styles.shutterButton;
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <Button
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraType} ref={cameraRef} />
      
      {/* Overlay on top of camera */}
      <View style={styles.overlay}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            ✕
          </Button>
          
          {/* Angle Progress */}
          <View style={styles.angleProgress}>
            <Text style={styles.angleProgressText}>
              {currentAngleIndex + 1}/{CAMERA_ANGLES.length}
            </Text>
            <View style={styles.angleIndicators}>
              {CAMERA_ANGLES.map((angle, idx) => (
                <View
                  key={angle}
                  style={[
                    styles.angleDot,
                    capturedImages.some(img => img.angle === angle) && styles.angleDotCompleted,
                    idx === currentAngleIndex && styles.angleDotCurrent,
                  ]}
                />
              ))}
            </View>
          </View>
          
          <Button
            variant="ghost"
            size="sm"
            onPress={flipCamera}
            style={styles.flipButton}
          >
            🔄
          </Button>
        </View>

        {/* Angle Title */}
        <View style={styles.angleTitleContainer}>
          <Text style={styles.angleTitle}>{getAngleTitle()}</Text>
          <Text style={styles.angleSubtitle}>{getAngleInstructions()}</Text>
        </View>

        {/* Live Quality Score with Individual Metrics - Always visible during scanning */}
        {humanDetected === null && (
          <View style={styles.qualityScoreContainer}>
            <Text style={styles.qualityScoreLabel}>Setup Quality</Text>
            <View style={styles.qualityScoreRow}>
              <Text style={styles.qualityScoreValue}>{setupQuality.overall}%</Text>
            </View>
            <View style={styles.qualityMetricsGrid}>
              <View style={styles.qualityMetricItem}>
                <Text style={styles.qualityMetricLabel}>Lighting</Text>
                <Text style={[
                  styles.qualityMetricIcon,
                  { color: getQualityColor(setupQuality.lighting) }
                ]}>
                  {getQualityIcon(setupQuality.lighting)}
                </Text>
              </View>
              <View style={styles.qualityMetricItem}>
                <Text style={styles.qualityMetricLabel}>Angle</Text>
                <Text style={[
                  styles.qualityMetricIcon,
                  { color: getQualityColor(setupQuality.angle) }
                ]}>
                  {getQualityIcon(setupQuality.angle)}
                </Text>
              </View>
              <View style={styles.qualityMetricItem}>
                <Text style={styles.qualityMetricLabel}>Distance</Text>
                <Text style={[
                  styles.qualityMetricIcon,
                  { color: getQualityColor(setupQuality.distance) }
                ]}>
                  {getQualityIcon(setupQuality.distance)}
                </Text>
              </View>
              <View style={styles.qualityMetricItem}>
                <Text style={styles.qualityMetricLabel}>Pose</Text>
                <Text style={[
                  styles.qualityMetricIcon,
                  { color: getQualityColor(setupQuality.pose) }
                ]}>
                  {getQualityIcon(setupQuality.pose)}
                </Text>
              </View>
            </View>
            <View style={styles.qualityScoreBar}>
              <View
                style={[
                  styles.qualityScoreFill,
                  {
                    width: `${setupQuality.overall}%`,
                    backgroundColor: setupQuality.overall >= 70 
                      ? colors.success 
                      : setupQuality.overall >= 50 
                      ? colors.warning 
                      : colors.error
                  }
                ]}
              />
            </View>
          </View>
        )}

        {/* Center countdown */}
        {isCountingDown && (
          <View style={styles.countdownContainer}>
            <Animated.Text
              style={[
                styles.countdownText,
                {
                  transform: [{ scale: countdownAnim }],
                },
              ]}
            >
              {countdown}
            </Animated.Text>
          </View>
        )}

        {/* Human detection status */}
        {humanDetected === false && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ No person detected</Text>
            <Text style={styles.errorSubtext}>{detectionMessage || 'Please reposition and retake'}</Text>
          </View>
        )}

        {/* Success indicator */}
        {humanDetected === true && (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✅ Person detected!</Text>
            <Text style={styles.successSubtext}>Processing your photo...</Text>
          </View>
        )}

        {/* Analysis indicator */}
        {isAnalyzing && (
          <View style={styles.analyzingContainer}>
            <Text style={styles.analyzingText}>Analyzing photo...</Text>
            <Text style={styles.analyzingSubtext}>Checking for human presence</Text>
          </View>
        )}

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            {isCountingDown
              ? `Photo will be taken in ${countdown} seconds`
              : humanDetected === false
              ? 'Position yourself clearly in the frame'
              : 'Position yourself in the frame and tap to capture'}
          </Text>
        </View>

        {/* Bottom shutter button */}
        <View style={styles.bottomControls}>
          <Button
            onPress={startCountdown}
            disabled={isCountingDown || isAnalyzing}
            style={isCountingDown || isAnalyzing ? StyleSheet.flatten([styles.shutterButton, styles.shutterButtonDisabled]) : styles.shutterButton}
          >
            <View style={styles.shutterButtonInner} />
          </Button>
          {!isLastAngle && capturedImages.some(img => img.angle === currentAngle) && (
            <Text style={styles.nextAngleHint}>
              Tap to retake or continue to next angle →
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
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  flipButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flipButtonText: {
    fontSize: 20,
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 110,
    fontWeight: '600',
    color: colors.surface,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: colors.surface,
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    fontWeight: '500',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  shutterButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.textPrimary,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: colors.error,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubtext: {
    color: colors.surface,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
  },
  successContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successText: {
    color: colors.success,
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  successSubtext: {
    color: colors.surface,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 5,
  },
  analyzingContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  analyzingText: {
    color: colors.surface,
    fontSize: 19,
    fontWeight: '600',
    textAlign: 'center',
  },
  analyzingSubtext: {
    color: colors.surface,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.9,
  },
  tipsContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.overlay,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  tipsTitle: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipText: {
    color: colors.surface,
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
    opacity: 0.9,
  },
  qualityIndicator: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: colors.overlay,
    borderRadius: 8,
    padding: 16,
    zIndex: 2,
  },
  qualityIndicatorGood: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.success,
  },
  qualityIndicatorPoor: {
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.error,
  },
  qualityIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qualityIndicatorLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  qualityIndicatorPercent: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  qualityProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  qualityProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  qualityDetailsContainer: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    backgroundColor: colors.overlay,
    borderRadius: 8,
    padding: 16,
    zIndex: 2,
    marginTop: 8,
  },
  qualityGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  qualityItem: {
    alignItems: 'center',
  },
  qualityLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 5,
    opacity: 0.8,
  },
  qualityScore: {
    fontSize: 28,
  },
  feedbackList: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 4,
    opacity: 0.9,
  },
  angleProgress: {
    backgroundColor: colors.overlay,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  angleProgressText: {
    color: colors.surface,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  angleIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  angleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  angleDotCompleted: {
    backgroundColor: colors.success,
  },
  angleDotCurrent: {
    backgroundColor: colors.accent,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  angleTitleContainer: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  qualityScoreContainer: {
    position: 'absolute',
    top: 180,
    left: 20,
    right: 20,
    backgroundColor: colors.overlay,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 3,
  },
  qualityScoreLabel: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  qualityScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityScoreValue: {
    color: colors.surface,
    fontSize: 28,
    fontWeight: '700',
  },
  qualityMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  qualityMetricItem: {
    alignItems: 'center',
    flex: 1,
  },
  qualityMetricLabel: {
    color: colors.surface,
    fontSize: 11,
    marginBottom: 4,
    opacity: 0.8,
  },
  qualityMetricIcon: {
    fontSize: 24,
  },
  qualityScoreBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  qualityScoreFill: {
    height: '100%',
    borderRadius: 2,
  },
  angleTitle: {
    color: colors.surface,
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  angleSubtitle: {
    color: colors.surface,
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 30,
  },
  nextAngleHint: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  tipsToggle: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    alignSelf: 'center',
  },
  tipsToggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
