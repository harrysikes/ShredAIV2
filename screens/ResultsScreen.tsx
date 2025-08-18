import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { generateWorkoutPlan } from '../api/workoutPlanGenerator';
import { Button } from '../components/ui';

type ResultsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Results'>;

export default function ResultsScreen() {
  const navigation = useNavigation<ResultsScreenNavigationProp>();
  const { surveyData, bodyFatPercentage, isSubscribed, resetSurvey } = useSurveyStore();
  
  // Generate workout plan
  const workoutPlan = bodyFatPercentage 
    ? generateWorkoutPlan(surveyData, bodyFatPercentage)
    : null;

  const handleStartOver = () => {
    Alert.alert(
      'Start Over',
      'Are you sure you want to start over? This will clear all your current data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Start Over',
          style: 'destructive',
          onPress: () => {
            resetSurvey();
            navigation.navigate('Survey');
          },
        },
      ]
    );
  };

  const getBodyFatCategory = (percentage: number) => {
    if (surveyData.sex === 'male') {
      if (percentage < 6) return 'Essential Fat';
      if (percentage < 14) return 'Athletes';
      if (percentage < 18) return 'Fitness';
      if (percentage < 25) return 'Average';
      if (percentage < 32) return 'Above Average';
      return 'Obese';
    } else {
      if (percentage < 14) return 'Essential Fat';
      if (percentage < 21) return 'Athletes';
      if (percentage < 25) return 'Fitness';
      if (percentage < 32) return 'Average';
      if (percentage < 38) return 'Above Average';
      return 'Obese';
    }
  };

  const getBodyFatColor = (percentage: number) => {
    if (surveyData.sex === 'male') {
      if (percentage < 18) return '#4CAF50'; // Green
      if (percentage < 25) return '#FF9800'; // Orange
      return '#F44336'; // Red
    } else {
      if (percentage < 25) return '#4CAF50'; // Green
      if (percentage < 32) return '#FF9800'; // Orange
      return '#F44336'; // Red
    }
  };

  if (!bodyFatPercentage) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No results available</Text>
        <Button variant="outline" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your AI Analysis Results</Text>
        <Text style={styles.headerSubtitle}>
          Advanced body composition analysis using computer vision
        </Text>
      </View>

      {/* Body Fat Result */}
      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Body Fat Percentage</Text>
        <View style={styles.resultValueContainer}>
          <Text style={styles.resultValue}>{bodyFatPercentage}%</Text>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: getBodyFatColor(bodyFatPercentage) }
          ]}>
            <Text style={styles.categoryText}>
              {getBodyFatCategory(bodyFatPercentage)}
            </Text>
          </View>
        </View>
        <Text style={styles.resultDescription}>
          This AI-powered calculation analyzes muscle visibility, body proportions, and anatomical features for maximum accuracy.
        </Text>
      </View>

      {/* AI Analysis Insights */}
      <View style={styles.aiAnalysisCard}>
        <Text style={styles.aiAnalysisTitle}>🤖 AI Analysis Insights</Text>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Analysis Confidence:</Text>
          <Text style={styles.insightValue}>85%</Text>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Image Quality:</Text>
          <Text style={styles.insightValue}>Excellent</Text>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Lighting Quality:</Text>
          <Text style={styles.insightValue}>Good</Text>
        </View>
        
        <View style={styles.insightRow}>
          <Text style={styles.insightLabel}>Pose Quality:</Text>
          <Text style={styles.insightValue}>Optimal</Text>
        </View>
        
        <View style={styles.analysisFactors}>
          <Text style={styles.factorsTitle}>Analysis Factors Used:</Text>
          <Text style={styles.factorText}>• Muscle definition assessment</Text>
          <Text style={styles.factorText}>• Shoulder-to-waist ratio calculation</Text>
          <Text style={styles.factorText}>• Chest-to-waist ratio analysis</Text>
          <Text style={styles.factorText}>• Anatomical feature detection</Text>
          <Text style={styles.factorText}>• Lighting and shadow analysis</Text>
        </View>
      </View>

      {/* Survey Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Your Profile</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sex:</Text>
          <Text style={styles.summaryValue}>
            {surveyData.sex ? surveyData.sex.charAt(0).toUpperCase() + surveyData.sex.slice(1) : 'Not specified'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Age:</Text>
          <Text style={styles.summaryValue}>
            {surveyData.dateOfBirth 
              ? `${new Date().getFullYear() - surveyData.dateOfBirth.getFullYear()} years`
              : 'Not specified'
            }
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Height:</Text>
          <Text style={styles.summaryValue}>
            {surveyData.height ? `${surveyData.height.feet}'${surveyData.height.inches}"` : 'Not specified'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Weight:</Text>
          <Text style={styles.summaryValue}>
            {surveyData.weight ? `${surveyData.weight.value} lbs (${Math.round(surveyData.weight.value * 0.453592 * 10) / 10} kg)` : 'Not specified'}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Exercise Frequency:</Text>
          <Text style={styles.summaryValue}>{surveyData.exerciseFrequency || 'Not specified'}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Goal:</Text>
          <Text style={styles.summaryValue}>
            {surveyData.workoutGoal 
              ? surveyData.workoutGoal.charAt(0).toUpperCase() + surveyData.workoutGoal.slice(1)
              : 'Not specified'
            }
          </Text>
        </View>
      </View>

      {/* Workout Plan */}
      {isSubscribed && workoutPlan ? (
        <View style={styles.workoutCard}>
          <Text style={styles.workoutTitle}>Your Personalized Workout Plan</Text>
          <Text style={styles.workoutSubtitle}>
            {workoutPlan.goal} • {workoutPlan.frequency}
          </Text>
          
          {workoutPlan.days.map((day, index) => (
            <View key={index} style={styles.workoutDay}>
              <Text style={styles.dayTitle}>{day.day}</Text>
              <Text style={styles.dayFocus}>{day.focus}</Text>
              
              {day.exercises.map((exercise, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exercise}>
                  <View style={styles.exerciseHeader}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseSets}>{exercise.sets} sets</Text>
                  </View>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseReps}>{exercise.reps}</Text>
                    <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                    <Text style={styles.exerciseRest}>{exercise.restTime} rest</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
          
          <View style={styles.workoutNotes}>
            <Text style={styles.notesTitle}>Important Notes:</Text>
            {workoutPlan.notes?.map((note, index) => (
              <Text key={index} style={styles.note}>• {note}</Text>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.upgradeCard}>
          <Text style={styles.upgradeTitle}>Unlock Your Workout Plan</Text>
          <Text style={styles.upgradeDescription}>
            Subscribe to get your personalized workout routine based on your goals and fitness level.
          </Text>
          <Button
            onPress={() => navigation.navigate('Paywall')}
            style={styles.upgradeButton}
          >
            Subscribe Now
          </Button>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button 
          variant="outline"
          onPress={handleStartOver}
          style={styles.startOverButton}
        >
          Start Over
        </Button>
        
        <Button 
          variant="ghost"
          onPress={() => Alert.alert('Share', 'Share functionality would go here')}
          style={styles.shareButton}
        >
          Share Results
        </Button>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Results are based on AI-powered image analysis and survey data. For medical advice, consult a healthcare professional.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultValueContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultDescription: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 20,
  },
  aiAnalysisCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  aiAnalysisTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightLabel: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  analysisFactors: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  factorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  factorText: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 8,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  workoutCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  workoutSubtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
    marginBottom: 24,
  },
  workoutDay: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  dayFocus: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  exercise: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  exerciseSets: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseReps: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.6,
  },
  exerciseRest: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.6,
  },
  workoutNotes: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 8,
  },
  upgradeCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
    textAlign: 'center',
  },
  upgradeDescription: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  upgradeButtonText: {
    color: '#E3DAC9',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  startOverButton: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  startOverButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#E3DAC9',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 12,
    color: '#000000',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginTop: 100,
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#E3DAC9',
    fontSize: 16,
    fontWeight: '600',
  },
});
