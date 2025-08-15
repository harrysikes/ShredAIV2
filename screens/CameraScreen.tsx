import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Alert,
} from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { detectHuman, HumanDetectionResponse } from '../api/humanDetectionApi';
import { Button } from '../components/ui';

type CameraScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
  const navigation = useNavigation<CameraScreenNavigationProp>();
  const { setCapturedImage } = useSurveyStore();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>('front');
  const [countdown, setCountdown] = useState(5);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [humanDetected, setHumanDetected] = useState<boolean | null>(null);
  const [detectionMessage, setDetectionMessage] = useState<string>('');
  const cameraRef = useRef<any>(null);
  const countdownAnim = useRef(new Animated.Value(1)).current;

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

  const startCountdown = () => {
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
          quality: 0.8,
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
          // Human detected, proceed with the photo
          setCapturedImage(photo.base64 || '');
          setIsCountingDown(false);
          setCountdown(5);
          
          // Navigate to loading screen
          navigation.navigate('Loading');
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
        {/* Visual guide overlay */}
        <View style={styles.guideOverlay}>
          <View style={styles.guideFrame}>
            <View style={styles.guideCorner} />
            <View style={[styles.guideCorner, styles.guideCornerTopRight]} />
            <View style={[styles.guideCorner, styles.guideCornerBottomLeft]} />
            <View style={[styles.guideCorner, styles.guideCornerBottomRight]} />
          </View>
        </View>

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
          
          <Button
            variant="ghost"
            size="sm"
            onPress={flipCamera}
            style={styles.flipButton}
          >
            🔄
          </Button>
        </View>

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
              : 'Position yourself in the frame and tap the button below'}
          </Text>
          
          {/* Positioning tips */}
          {!isCountingDown && humanDetected === null && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>📸 Positioning Tips:</Text>
              <Text style={styles.tipText}>• Stand 3-6 feet from camera</Text>
              <Text style={styles.tipText}>• Ensure good lighting</Text>
              <Text style={styles.tipText}>• Show your upper body clearly</Text>
            </View>
          )}
        </View>

        {/* Bottom shutter button */}
        <View style={styles.bottomControls}>
          <Button
            onPress={startCountdown}
            disabled={isCountingDown || isAnalyzing}
            style={[
              styles.shutterButton,
              (isCountingDown || isAnalyzing) && styles.shutterButtonDisabled,
            ]}
          >
            <View style={styles.shutterButtonInner} />
          </Button>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  guideOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  guideFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    position: 'relative',
  },
  guideCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  guideCornerTopRight: {
    top: 0,
    right: 0,
  },
  guideCornerBottomLeft: {
    bottom: 0,
    left: 0,
  },
  guideCornerBottomRight: {
    bottom: 0,
    right: 0,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    fontSize: 120,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  shutterButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  shutterButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
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
    color: '#FF0000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
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
    color: '#00FF00',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successSubtext: {
    color: '#FFFFFF',
    fontSize: 16,
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
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  analyzingSubtext: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  tipsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  tipText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 5,
  },
});
