import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import ProgressBar from '../components/ProgressBar';

type SurveyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Survey'>;

const { width: screenWidth } = Dimensions.get('window');

const SURVEY_STEPS = [
  {
    id: 'sex',
    title: 'What is your biological sex?',
    subtitle: 'This helps us calculate more accurate body fat estimates',
  },
  {
    id: 'dateOfBirth',
    title: 'When were you born?',
    subtitle: 'Age affects metabolism and body composition',
  },
  {
    id: 'height',
    title: 'What is your height?',
    subtitle: 'Height is used in body fat calculations',
  },
  {
    id: 'weight',
    title: 'What is your current weight?',
    subtitle: 'Weight helps determine your body composition',
  },
  {
    id: 'exerciseFrequency',
    title: 'How often do you exercise?',
    subtitle: 'Exercise frequency affects your fitness level',
  },
  {
    id: 'workoutGoal',
    title: 'What is your primary workout goal?',
    subtitle: 'This helps us create a personalized workout plan',
  },
];

export default function SurveyScreen() {
  const navigation = useNavigation<SurveyScreenNavigationProp>();
  const { surveyData, currentStep, setSurveyData, setCurrentStep } = useSurveyStore();
  const [slideAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, slideAnim, fadeAnim]);

  const nextStep = () => {
    if (currentStep < SURVEY_STEPS.length - 1) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -screenWidth,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep + 1);
      });
    } else {
      // Survey complete, navigate to camera
      navigation.navigate('Camera');
    }
  };

  const renderSexStep = () => (
    <View style={styles.stepContainer}>
      <TouchableOpacity
        style={[
          styles.optionButton,
          surveyData.sex === 'male' && styles.optionButtonSelected,
        ]}
        onPress={() => setSurveyData({ sex: 'male' })}
      >
        <Text
          style={[
            styles.optionButtonText,
            surveyData.sex === 'male' && styles.optionButtonTextSelected,
          ]}
        >
          Male
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.optionButton,
          surveyData.sex === 'female' && styles.optionButtonSelected,
        ]}
        onPress={() => setSurveyData({ sex: 'female' })}
      >
        <Text
          style={[
            styles.optionButtonText,
            surveyData.sex === 'female' && styles.optionButtonTextSelected,
          ]}
        >
          Female
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDateOfBirthStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.datePickerLabel}>Select your birth date:</Text>
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateDisplay}>
          {surveyData.dateOfBirth
            ? surveyData.dateOfBirth.toLocaleDateString()
            : 'Not selected'}
        </Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => {
            // For now, just set a default date
            // In a real app, you'd use a proper date picker
            setSurveyData({ dateOfBirth: new Date('1990-01-01') });
          }}
        >
          <Text style={styles.datePickerButtonText}>Select Date</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeightStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.heightContainer}>
        <View style={styles.heightPicker}>
          <Text style={styles.heightLabel}>Feet</Text>
          <View style={styles.heightWheel}>
            {Array.from({ length: 8 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.heightOption,
                  surveyData.height?.feet === i + 1 && styles.heightOptionSelected,
                ]}
                onPress={() => setSurveyData({ height: { feet: i + 1, inches: surveyData.height?.inches || 0 } })}
              >
                <Text
                  style={[
                    styles.heightOptionText,
                    surveyData.height?.feet === i + 1 && styles.heightOptionTextSelected,
                  ]}
                >
                  {i + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.heightPicker}>
          <Text style={styles.heightLabel}>Inches</Text>
          <View style={styles.heightWheel}>
            {Array.from({ length: 12 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.heightOption,
                  surveyData.height?.inches === i && styles.heightOptionSelected,
                ]}
                onPress={() => setSurveyData({ height: { feet: surveyData.height?.feet || 5, inches: i } })}
              >
                <Text
                  style={[
                    styles.heightOptionText,
                    surveyData.height?.inches === i && styles.heightOptionTextSelected,
                  ]}
                >
                  {i}"
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderWeightStep = () => {
    const weightInLbs = surveyData.weight?.value || 150;
    const weightInKg = Math.round(weightInLbs * 0.453592 * 10) / 10;
    
    return (
      <View style={styles.stepContainer}>
        <View style={styles.weightContainer}>
          <View style={styles.weightInputContainer}>
            <Text style={styles.weightLabel}>Weight</Text>
            <Text style={styles.weightValue}>
              {weightInLbs} lbs
            </Text>
            <Text style={styles.weightConversion}>
              ({weightInKg} kg)
            </Text>
          </View>
          <View style={styles.weightAdjustment}>
            <TouchableOpacity
              style={styles.weightAdjustButton}
              onPress={() => {
                const newWeight = weightInLbs + 5;
                setSurveyData({ weight: { value: newWeight, unit: 'lbs' } });
              }}
            >
              <Text style={styles.weightAdjustButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.weightAdjustButton}
              onPress={() => {
                const newWeight = Math.max(0, weightInLbs - 5);
                setSurveyData({ weight: { value: newWeight, unit: 'lbs' } });
              }}
            >
              <Text style={styles.weightAdjustButtonText}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderExerciseFrequencyStep = () => (
    <View style={styles.stepContainer}>
      {['2-3 days', '3-4 days', '5-6 days', '7 days'].map((frequency) => (
        <TouchableOpacity
          key={frequency}
          style={[
            styles.optionButton,
            surveyData.exerciseFrequency === frequency && styles.optionButtonSelected,
          ]}
          onPress={() => setSurveyData({ exerciseFrequency: frequency as any })}
        >
          <Text
            style={[
              styles.optionButtonText,
              surveyData.exerciseFrequency === frequency && styles.optionButtonTextSelected,
            ]}
          >
            {frequency}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderWorkoutGoalStep = () => (
    <View style={styles.stepContainer}>
      {['gain muscle', 'lose fat', 'improve endurance'].map((goal) => (
        <TouchableOpacity
          key={goal}
          style={[
            styles.optionButton,
            surveyData.workoutGoal === goal && styles.optionButtonSelected,
          ]}
          onPress={() => setSurveyData({ workoutGoal: goal as any })}
        >
          <Text
            style={[
              styles.optionButtonText,
              surveyData.workoutGoal === goal && styles.optionButtonTextSelected,
            ]}
          >
            {goal.charAt(0).toUpperCase() + goal.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderCurrentStep = () => {
    const step = SURVEY_STEPS[currentStep];
    switch (step.id) {
      case 'sex':
        return renderSexStep();
      case 'dateOfBirth':
        return renderDateOfBirthStep();
      case 'height':
        return renderHeightStep();
      case 'weight':
        return renderWeightStep();
      case 'exerciseFrequency':
        return renderExerciseFrequencyStep();
      case 'workoutGoal':
        return renderWorkoutGoalStep();
      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = SURVEY_STEPS[currentStep];
    switch (step.id) {
      case 'sex':
        return surveyData.sex !== null;
      case 'dateOfBirth':
        return surveyData.dateOfBirth !== null;
      case 'height':
        return surveyData.height !== null;
      case 'weight':
        return surveyData.weight !== null;
      case 'exerciseFrequency':
        return surveyData.exerciseFrequency !== null;
      case 'workoutGoal':
        return surveyData.workoutGoal !== null;
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ProgressBar currentStep={currentStep} totalSteps={SURVEY_STEPS.length} />
      
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{SURVEY_STEPS[currentStep].title}</Text>
          <Text style={styles.subtitle}>{SURVEY_STEPS[currentStep].subtitle}</Text>
        </View>

        {renderCurrentStep()}

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.nextButton,
              !canProceed() && styles.nextButtonDisabled,
            ]}
            onPress={nextStep}
            disabled={!canProceed()}
          >
            <Text style={styles.nextButtonText}>
              {currentStep < SURVEY_STEPS.length - 1 ? 'Next' : 'Complete Survey'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: '#E3DAC9',
  },
  datePickerLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 30,
  },
  datePickerContainer: {
    alignItems: 'center',
  },
  dateDisplay: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3DAC9',
  },
  heightContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  heightPicker: {
    alignItems: 'center',
  },
  heightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
  },
  heightWheel: {
    height: 200,
    justifyContent: 'center',
  },
  heightOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginVertical: 4,
    borderRadius: 8,
  },
  heightOptionSelected: {
    backgroundColor: '#000000',
  },
  heightOptionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
  },
  heightOptionTextSelected: {
    color: '#E3DAC9',
  },
  weightContainer: {
    alignItems: 'center',
  },
  weightInputContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  weightValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
  },
  weightConversion: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
  },
  weightButtons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  weightUnitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weightUnitButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  weightUnitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  weightAdjustment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weightAdjustButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
  },
  weightAdjustButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E3DAC9',
  },
  footer: {
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E3DAC9',
  },
});
