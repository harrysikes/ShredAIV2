import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import colors from '../constants/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width: screenWidth } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { bodyFatPercentage, bodyFatHistory, workoutPlan, loadProfileData } = useSurveyStore();

  useEffect(() => {
    // Load profile data when screen mounts
    loadProfileData();
  }, []);

  const latestBodyFat = bodyFatHistory.length > 0
    ? bodyFatHistory[bodyFatHistory.length - 1].bodyFatPercentage
    : bodyFatPercentage;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ShredAI</Text>
        <Text style={styles.headerSubtitle}>Your Body Composition Tracker</Text>
      </View>

      {/* Current Stats Card */}
      {latestBodyFat !== null && (
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Current Body Fat</Text>
          <View style={styles.statsValueContainer}>
            <Text style={styles.statsValue}>{latestBodyFat.toFixed(1)}</Text>
            <Text style={styles.statsPercent}>%</Text>
          </View>
          {bodyFatHistory.length > 1 && (
            <Text style={styles.statsChange}>
              {(() => {
                const first = bodyFatHistory[0].bodyFatPercentage;
                const last = bodyFatHistory[bodyFatHistory.length - 1].bodyFatPercentage;
                const change = last - first;
                if (change > 0) {
                  return `+${change.toFixed(1)}% since tracking started`;
                } else if (change < 0) {
                  return `${change.toFixed(1)}% since tracking started`;
                }
                return 'No change';
              })()}
            </Text>
          )}
        </View>
      )}

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        {/* Scan Button */}
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Survey')}
        >
          <Text style={styles.actionTitle}>New Scan</Text>
          <Text style={styles.actionDescription}>
            Analyze your body composition
          </Text>
        </TouchableOpacity>

        {/* Workout Plan Button */}
        <TouchableOpacity
          style={[
            styles.actionCard,
            !workoutPlan && styles.actionCardDisabled
          ]}
          onPress={() => {
            if (workoutPlan) {
              navigation.navigate('WorkoutPlan');
            }
          }}
          disabled={!workoutPlan}
        >
          <Text style={styles.actionTitle}>Workout Plan</Text>
          <Text style={styles.actionDescription}>
            {workoutPlan
              ? 'View your personalized plan'
              : 'Complete a scan to generate'}
          </Text>
        </TouchableOpacity>

        {/* History Chart Button */}
        <TouchableOpacity
          style={[
            styles.actionCard,
            bodyFatHistory.length === 0 && styles.actionCardDisabled
          ]}
          onPress={() => {
            if (bodyFatHistory.length > 0) {
              navigation.navigate('BodyFatHistory');
            }
          }}
          disabled={bodyFatHistory.length === 0}
        >
          <Text style={styles.actionTitle}>Progress Chart</Text>
          <Text style={styles.actionDescription}>
            {bodyFatHistory.length > 0
              ? `View ${bodyFatHistory.length} ${bodyFatHistory.length === 1 ? 'entry' : 'entries'}`
              : 'Complete scans to track progress'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 70,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statsLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -2,
  },
  statsPercent: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  statsChange: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    gap: 10,
    flex: 0.85,
    paddingBottom: 20,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionCardDisabled: {
    opacity: 0.5,
  },
  actionTitle: {
    fontSize: 41,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -2,
  },
  actionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

