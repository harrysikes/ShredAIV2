import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Button } from '../components/ui';
import colors from '../constants/colors';

type CameraInstructionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CameraInstructions'>;

const { width: screenWidth } = Dimensions.get('window');

export default function CameraInstructionsScreen() {
  const navigation = useNavigation<CameraInstructionsScreenNavigationProp>();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Camera Setup Guide</Text>
          <Text style={styles.subtitle}>
            Follow these tips for the best results
          </Text>
        </View>

        {/* Instructions Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📸 Optimal Setup Guide</Text>
          
          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Scan Area</Text>
            <Text style={styles.sectionText}>
              • This scan analyzes your upper body only (hips and above)
              • Position yourself so your upper torso fills the frame
              • The camera should capture from your waist/hips up to your head
              • Lower body and legs don't need to be in the frame
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Clothing Requirements</Text>
            <Text style={styles.sectionText}>
              • <Text style={styles.boldText}>For males:</Text> Remove your shirt for best accuracy
              • <Text style={styles.boldText}>For females:</Text> Wear form-fitting clothing (sports bra or tight-fitting top)
              • Avoid loose or baggy clothing that obscures body shape
              • Clothing should not hide your torso contours
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Lighting</Text>
            <Text style={styles.sectionText}>
              • Use bright, even lighting (natural light preferred)
              • Avoid harsh shadows or backlighting
              • Ensure your upper body is well-lit
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Angle & Position</Text>
            <Text style={styles.sectionText}>
              • Stand at arm's length from the camera
              • Keep camera at chest level, straight ahead
              • Ensure upper body (hips to head) is visible in frame
              • Stand straight with feet shoulder-width apart
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Distance</Text>
            <Text style={styles.sectionText}>
              • Position yourself 4-6 feet from the camera
              • Your upper torso should fill most of the frame
              • Don't stand too close or too far away
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Pose</Text>
            <Text style={styles.sectionText}>
              • Stand naturally with arms at your sides
              • Keep shoulders relaxed and back straight
              • Look straight at the camera (don't tilt head)
              • Keep your feet shoulder-width apart
              • Distribute weight evenly on both feet
              • Avoid leaning forward or backward
              • Keep hands relaxed, not clenched
              • For front view: Face camera directly, arms slightly away from body
              • For side view: Turn 90° to show profile, keep shoulders square to side
              • For back view: Turn completely around, back facing camera straight on
            </Text>
          </View>
        </View>

        {/* Detailed Posing Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📐 Optimal Posing for Each Angle</Text>
          
          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Front View</Text>
            <Text style={styles.sectionText}>
              • Face the camera directly, looking straight ahead
              • Keep your body square to the camera (don't angle shoulders)
              • Place arms 2-3 inches away from your sides
              • Stand with feet parallel, shoulder-width apart
              • Ensure upper body is visible from hips/waist to head
              • Frame should include your torso and upper body only
              • Keep chin level and eyes looking at the camera lens
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Side View</Text>
            <Text style={styles.sectionText}>
              • Turn 90° to your right or left to show your profile
              • Keep both shoulders in line (don't twist)
              • Stand straight, don't lean forward or arch backward
              • Keep arms at your sides, naturally positioned
              • Ensure your upper body profile is visible (hips to head)
              • Frame should capture your side torso and upper body
              • Look straight ahead, not at the camera (profile view)
              • Keep feet together or slightly apart for balance
            </Text>
          </View>

          <View style={styles.instructionSection}>
            <Text style={styles.sectionTitle}>Back View</Text>
            <Text style={styles.sectionText}>
              • Turn completely around so your back faces the camera
              • Stand straight with shoulders level
              • Keep arms relaxed at your sides, slightly away from body
              • Ensure upper back is visible from waist/hips to shoulders
              • Frame should include your back torso only
              • Don't look back at the camera - face straight ahead
              • Keep your posture straight and natural
              • Feet should be shoulder-width apart for stability
            </Text>
          </View>
        </View>

        {/* Quality Tips Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quality Checklist</Text>
          
          <View style={styles.checklist}>
            <View style={styles.checklistItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.checklistText}>Good lighting conditions</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.checklistText}>Proper distance from camera</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.checklistText}>Full body visible in frame</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.checklistText}>Camera positioned straight ahead</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checkmark}>✓</Text>
              <Text style={styles.checklistText}>Standing in natural pose</Text>
            </View>
          </View>
        </View>

        {/* What to Expect Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What to Expect</Text>
          <Text style={styles.sectionText}>
            You'll need to capture photos from 3 angles of your <Text style={styles.boldText}>upper body only</Text> (hips and above):
          </Text>
          <View style={styles.angleList}>
            <View style={styles.angleItem}>
              <Text style={styles.angleNumber}>1</Text>
              <Text style={styles.angleText}>Front view (upper torso)</Text>
            </View>
            <View style={styles.angleItem}>
              <Text style={styles.angleNumber}>2</Text>
              <Text style={styles.angleText}>Side view (upper torso)</Text>
            </View>
            <View style={styles.angleItem}>
              <Text style={styles.angleNumber}>3</Text>
              <Text style={styles.angleText}>Back view (upper torso)</Text>
            </View>
          </View>
          <Text style={styles.sectionText}>
            Each photo will analyze your upper body from the waist/hips up. The camera frame should focus on your torso area, not your full body or legs.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.navigate('Camera')}
            style={styles.startButton}
          >
            Start Scanning
          </Button>
          
          <Button
            variant="outline"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          >
            Back
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  instructionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  checklist: {
    marginTop: 8,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: colors.success,
    marginRight: 12,
    fontWeight: '600',
  },
  checklistText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  angleList: {
    marginTop: 16,
    marginBottom: 16,
  },
  angleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  angleNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
    marginRight: 12,
  },
  angleText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButton: {
    borderColor: colors.textPrimary,
    paddingVertical: 16,
    borderRadius: 12,
  },
  backButtonText: {
    color: colors.textPrimary,
  },
});

