import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { Button } from '../components/ui';
import { WorkoutPlan } from '../api/workoutPlanGenerator';
import colors from '../constants/colors';

type WorkoutPlanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutPlan'>;

export default function WorkoutPlanScreen() {
  const navigation = useNavigation<WorkoutPlanScreenNavigationProp>();
  const { workoutPlan } = useSurveyStore();

  if (!workoutPlan) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Workout Plan</Text>
          <Text style={styles.emptyText}>No workout plan available</Text>
          <Text style={styles.emptySubtext}>Complete a scan to generate your plan</Text>
        </View>
        <Button
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const plan = workoutPlan as WorkoutPlan;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{plan.goal}</Text>
        <Text style={styles.headerSubtitle}>
          {plan.frequency} • {plan.difficulty} Level
        </Text>
      </View>

      {/* Workout Days */}
      {plan.days.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.dayCard}>
          <Text style={styles.dayTitle}>{day.day}</Text>
          <Text style={styles.dayFocus}>Focus: {day.focus}</Text>
          
          <View style={styles.dayMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Intensity</Text>
              <Text style={styles.metaValue}>{day.intensity}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{day.totalTime}</Text>
            </View>
          </View>

          {/* Warmup */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Warmup</Text>
            {day.warmup.map((item, index) => (
              <Text key={index} style={styles.sectionItem}>• {item}</Text>
            ))}
          </View>

          {/* Exercises */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exercises</Text>
            {day.exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseDetails}>
                  <Text style={styles.exerciseDetail}>
                    {exercise.sets} sets × {exercise.reps} reps
                  </Text>
                  <Text style={styles.exerciseDetail}>Rest: {exercise.restTime}</Text>
                </View>
                <Text style={styles.exerciseTips}>{exercise.tips}</Text>
              </View>
            ))}
          </View>

          {/* Cooldown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cooldown</Text>
            {day.cooldown.map((item, index) => (
              <Text key={index} style={styles.sectionItem}>• {item}</Text>
            ))}
          </View>
        </View>
      ))}

      {/* Nutrition */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Nutrition Guidelines</Text>
        {plan.nutrition.map((item, index) => (
          <Text key={index} style={styles.infoItem}>• {item}</Text>
        ))}
      </View>

      {/* Recovery */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Recovery Tips</Text>
        {plan.recovery.map((item, index) => (
          <Text key={index} style={styles.infoItem}>• {item}</Text>
        ))}
      </View>

      {/* Progression */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Progression Plan</Text>
        {plan.progression.map((item, index) => (
          <Text key={index} style={styles.infoItem}>• {item}</Text>
        ))}
      </View>

      {/* Equipment */}
      <View style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Required Equipment</Text>
        <Text style={styles.infoItem}>{plan.equipment.join(', ')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 40,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  dayFocus: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  dayMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  exerciseCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  exerciseTips: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  infoItem: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 8,
    backgroundColor: colors.accent,
  },
  backButtonText: {
    color: colors.surface,
  },
});

