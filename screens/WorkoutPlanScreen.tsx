import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import colors from '../constants/colors';
import {
  getDayOne,
  getDayNumber,
  generateMonthlyPlan,
  DailyWorkout,
} from '../utils/workoutPlanGenerator';

type WorkoutPlanScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WorkoutPlan'>;

const { width: screenWidth } = Dimensions.get('window');

export default function WorkoutPlanScreen() {
  const navigation = useNavigation<WorkoutPlanScreenNavigationProp>();
  const route = useRoute();
  const currentRoute = route.name;
  const { bodyFatHistory, surveyData, workoutTracking, completeWorkout, loadProfileData } = useSurveyStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showWorkoutDetail, setShowWorkoutDetail] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<DailyWorkout | null>(null);
  
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  useEffect(() => {
    loadProfileData();
  }, []);

  // Get Day One (first BF% log date)
  const dayOne = useMemo(() => {
    if (!workoutTracking.dayOne && bodyFatHistory.length > 0) {
      const first = getDayOne(bodyFatHistory);
      return first;
    }
    return workoutTracking.dayOne ? new Date(workoutTracking.dayOne) : null;
  }, [workoutTracking.dayOne, bodyFatHistory]);

  // Generate monthly plan
  const monthlyPlan = useMemo(() => {
    if (!dayOne || !surveyData.workoutGoal) return null;
    return generateMonthlyPlan(
      dayOne,
      currentMonth,
      currentYear,
      surveyData,
      workoutTracking.completedWorkouts,
      workoutTracking.missedWorkouts
    );
  }, [dayOne, currentMonth, currentYear, surveyData, workoutTracking]);

  // Get today's workout
  const todayWorkout = useMemo(() => {
    if (!monthlyPlan) return null;
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return monthlyPlan.workouts.find(w => w.date === todayStr) || null;
  }, [monthlyPlan]);

  // Render calendar grid
  const renderCalendar = () => {
    if (!monthlyPlan) return null;

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday

    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    let current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      currentWeek.push(new Date(current));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      current.setDate(current.getDate() + 1);
    }

    return (
      <View style={styles.calendarGrid}>
        {/* Day headers */}
        <View style={styles.weekRow}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <View key={index} style={styles.dayHeader}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar days */}
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {week.map((date, dayIndex) => {
              const dateStr = date.toISOString().split('T')[0];
              const workout = monthlyPlan.workouts.find(w => w.date === dateStr);
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              
              let dayColor = colors.background;
              if (workout?.type === 'rest') {
                dayColor = '#002FFF'; // Blue for rest days
              } else if (workout?.completed) {
                dayColor = '#00FF19'; // Green for completed
              } else if (workout?.missed) {
                dayColor = '#FF2A00'; // Red for missed
              } else if (workout?.type === 'workout') {
                dayColor = colors.surface; // White for scheduled workout
              }

              return (
                <TouchableOpacity
                  key={dayIndex}
                  style={[
                    styles.calendarDay,
                    !isCurrentMonth && styles.calendarDayOtherMonth,
                  ]}
                  onPress={() => {
                    if (workout && workout.type === 'workout') {
                      setSelectedWorkout(workout);
                      setShowWorkoutDetail(true);
                    }
                  }}
                >
                  <View style={[
                    styles.dayCircle,
                    { backgroundColor: dayColor },
                    isToday && styles.dayCircleToday,
                  ]}>
                    <Text style={styles.dayNumber}>
                      {date.getDate()}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  const handleCompleteWorkout = async () => {
    if (selectedWorkout) {
      await completeWorkout(selectedWorkout.date);
      setShowWorkoutDetail(false);
      setSelectedWorkout(null);
      // State update will automatically trigger re-render via Zustand
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Plan</Text>
        <Text style={styles.headerSubtitle}>
          {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      {/* Calendar Section - Top Half */}
      <View style={styles.calendarSection}>
        {renderCalendar()}
        
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#00FF19' }]} />
            <Text style={styles.legendText}>Completed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF2A00' }]} />
            <Text style={styles.legendText}>Missed</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#002FFF' }]} />
            <Text style={styles.legendText}>Rest Day</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} />
            <Text style={styles.legendText}>Scheduled</Text>
          </View>
        </View>
      </View>

      {/* Daily Workout Section - Bottom Half */}
      <View style={styles.dailyWorkoutSection}>
        {todayWorkout ? (
          <TouchableOpacity
            style={styles.workoutCard}
            onPress={() => {
              setSelectedWorkout(todayWorkout);
              setShowWorkoutDetail(true);
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.workoutCardTitle}>Today's Workout</Text>
            <Text style={styles.workoutCardName}>{todayWorkout.title}</Text>
            {todayWorkout.focus && (
              <Text style={styles.workoutCardFocus}>Focus: {todayWorkout.focus}</Text>
            )}
            {todayWorkout.duration && (
              <Text style={styles.workoutCardDuration}>{todayWorkout.duration}</Text>
            )}
            {todayWorkout.completed && (
              <Text style={styles.workoutCompletedBadge}>✓ Completed</Text>
            )}
            {todayWorkout.missed && (
              <Text style={styles.workoutMissedBadge}>Missed</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.noWorkoutCard}>
            <Text style={styles.noWorkoutText}>No workout plan available</Text>
            <Text style={styles.noWorkoutSubtext}>Complete a scan to generate your plan</Text>
          </View>
        )}
      </View>

      {/* Workout Detail Modal */}
      <Modal
        visible={showWorkoutDetail}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowWorkoutDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedWorkout && selectedWorkout.type === 'workout' ? (
                <>
                  <Text style={styles.modalTitle}>{selectedWorkout.title}</Text>
                  {selectedWorkout.focus && (
                    <Text style={styles.modalSubtitle}>Focus: {selectedWorkout.focus}</Text>
                  )}
                  
                  <View style={styles.modalMeta}>
                    {selectedWorkout.intensity && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Intensity</Text>
                        <Text style={styles.metaValue}>{selectedWorkout.intensity}</Text>
                      </View>
                    )}
                    {selectedWorkout.duration && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Duration</Text>
                        <Text style={styles.metaValue}>{selectedWorkout.duration}</Text>
                      </View>
                    )}
                  </View>

                  {/* Warmup */}
                  {selectedWorkout.warmup && selectedWorkout.warmup.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Warmup</Text>
                      {selectedWorkout.warmup.map((item, index) => (
                        <Text key={index} style={styles.sectionItem}>• {item}</Text>
                      ))}
                    </View>
                  )}

                  {/* Exercises */}
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Exercises</Text>
                      {selectedWorkout.exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseCard}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDetail}>
                            {exercise.sets} sets × {exercise.reps} reps
                          </Text>
                          <Text style={styles.exerciseDetail}>Rest: {exercise.restTime}</Text>
                          {exercise.tips && (
                            <Text style={styles.exerciseTips}>{exercise.tips}</Text>
                          )}
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Cooldown */}
                  {selectedWorkout.cooldown && selectedWorkout.cooldown.length > 0 && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>Cooldown</Text>
                      {selectedWorkout.cooldown.map((item, index) => (
                        <Text key={index} style={styles.sectionItem}>• {item}</Text>
                      ))}
                    </View>
                  )}
                </>
              ) : (
                <View>
                  <Text style={styles.modalTitle}>{selectedWorkout?.title || 'Rest Day'}</Text>
                  <Text style={styles.restDayText}>Enjoy your rest day! Recovery is an important part of any fitness program.</Text>
                </View>
              )}
            </ScrollView>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.backButton]}
                onPress={() => setShowWorkoutDetail(false)}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              
              {selectedWorkout && selectedWorkout.type === 'workout' && !selectedWorkout.completed && (
                <TouchableOpacity
                  style={[styles.modalButton, styles.completeButton]}
                  onPress={handleCompleteWorkout}
                >
                  <Text style={styles.completeButtonText}>Complete Workout</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[
            styles.navButton,
            currentRoute === 'Home' && styles.navButtonActive
          ]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[
            styles.navButtonText,
            currentRoute === 'Home' && styles.navButtonActiveText
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            currentRoute === 'Survey' && styles.navButtonActive,
            styles.navButtonMiddle
          ]}
          onPress={() => navigation.navigate('Survey')}
        >
          <Text style={[
            styles.navButtonText,
            currentRoute === 'Survey' && styles.navButtonActiveText
          ]}>
            Scan
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.navButton,
            currentRoute === 'WorkoutPlan' && styles.navButtonActive
          ]}
          onPress={() => navigation.navigate('WorkoutPlan')}
        >
          <Text style={[
            styles.navButtonText,
            currentRoute === 'WorkoutPlan' && styles.navButtonActiveText
          ]}>
            Workout
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
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  dayOneText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  calendarSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  calendarGrid: {
    marginBottom: 16,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dayHeader: {
    width: (screenWidth - 60) / 7,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  calendarDay: {
    width: (screenWidth - 60) / 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  calendarDayOtherMonth: {
    opacity: 0.3,
  },
  calendarDayToday: {
    // Highlight today
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  dayCircleToday: {
    borderColor: colors.accent,
    borderWidth: 3,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dailyWorkoutSection: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  workoutCardTitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  workoutCardName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  workoutCardFocus: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  workoutCardDuration: {
    fontSize: 14,
    color: colors.textTertiary,
    marginTop: 8,
  },
  workoutCompletedBadge: {
    fontSize: 14,
    color: '#4A7C59',
    fontWeight: '600',
    marginTop: 8,
  },
  workoutMissedBadge: {
    fontSize: 14,
    color: '#8B5A5A',
    fontWeight: '600',
    marginTop: 8,
  },
  noWorkoutCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  noWorkoutText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  noWorkoutSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 18,
    color: colors.accent,
    marginBottom: 16,
  },
  modalMeta: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 24,
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
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionItem: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 6,
  },
  exerciseCard: {
    backgroundColor: colors.surface,
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
  exerciseDetail: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseTips: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 20,
  },
  restDayText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginTop: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  completeButton: {
    backgroundColor: colors.accent,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navButtonMiddle: {
    marginHorizontal: 8,
  },
  navButtonActive: {
    backgroundColor: colors.accent,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  navButtonActiveText: {
    color: colors.surface,
  },
});
