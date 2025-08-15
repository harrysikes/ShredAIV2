import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import ProgressBar from '../components/ProgressBar';
import { Button, Card, CardContent } from '../components/ui';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(surveyData.dateOfBirth?.getFullYear() || new Date().getFullYear() - 25);
  const [selectedMonth, setSelectedMonth] = useState(surveyData.dateOfBirth?.getMonth() || 0);
  const [selectedDay, setSelectedDay] = useState(surveyData.dateOfBirth?.getDate() || 1);
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [selectedFeet, setSelectedFeet] = useState(surveyData.height?.feet || 5);
  const [selectedInches, setSelectedInches] = useState(surveyData.height?.inches || 0);

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

  // Update selected date values when survey data changes
  useEffect(() => {
    if (surveyData.dateOfBirth) {
      setSelectedYear(surveyData.dateOfBirth.getFullYear());
      setSelectedMonth(surveyData.dateOfBirth.getMonth());
      setSelectedDay(surveyData.dateOfBirth.getDate());
    }
  }, [surveyData.dateOfBirth]);

  // Update selected height values when survey data changes
  useEffect(() => {
    if (surveyData.height) {
      setSelectedFeet(surveyData.height.feet);
      setSelectedInches(surveyData.height.inches);
    }
  }, [surveyData.height]);

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
      <Button
        variant={surveyData.sex === 'male' ? 'selected' : 'outline'}
        onPress={() => setSurveyData({ sex: 'male' })}
        style={styles.optionButton}
      >
        Male
      </Button>
      <Button
        variant={surveyData.sex === 'female' ? 'selected' : 'outline'}
        onPress={() => setSurveyData({ sex: 'female' })}
        style={styles.optionButton}
      >
        Female
      </Button>
    </View>
  );

  const renderDateOfBirthStep = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleDateConfirm = () => {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      setSurveyData({ dateOfBirth: newDate });
      setShowDatePicker(false);
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.datePickerLabel}>Select your birth date:</Text>
        <View style={styles.datePickerContainer}>
          <Text style={styles.dateDisplay}>
            {surveyData.dateOfBirth
              ? surveyData.dateOfBirth.toLocaleDateString()
              : 'Not selected'}
          </Text>
          
          {!showDatePicker ? (
            <Button
              variant="outline"
              onPress={() => setShowDatePicker(true)}
            >
              Select Date
            </Button>
          ) : (
            <View style={styles.dateScrollerContainer}>
              <View style={styles.dateScrollerRow}>
                <View style={styles.dateScrollerColumn}>
                  <Text style={styles.dateScrollerLabel}>Month</Text>
                  <ScrollView style={styles.dateScroller} showsVerticalScrollIndicator={false}>
                    {months.map((month, index) => (
                      <TouchableOpacity
                        key={month}
                        style={[
                          styles.dateScrollerOption,
                          selectedMonth === index && styles.dateScrollerOptionSelected
                        ]}
                        onPress={() => setSelectedMonth(index)}
                      >
                        <Text style={[
                          styles.dateScrollerOptionText,
                          selectedMonth === index && styles.dateScrollerOptionTextSelected
                        ]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.dateScrollerColumn}>
                  <Text style={styles.dateScrollerLabel}>Day</Text>
                  <ScrollView style={styles.dateScroller} showsVerticalScrollIndicator={false}>
                    {days.map((day) => (
                      <TouchableOpacity
                        key={day}
                        style={[
                          styles.dateScrollerOption,
                          selectedDay === day && styles.dateScrollerOptionSelected
                        ]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[
                          styles.dateScrollerOptionText,
                          selectedDay === day && styles.dateScrollerOptionTextSelected
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                <View style={styles.dateScrollerColumn}>
                  <Text style={styles.dateScrollerLabel}>Year</Text>
                  <ScrollView style={styles.dateScroller} showsVerticalScrollIndicator={false}>
                    {years.map((year) => (
                      <TouchableOpacity
                        key={year}
                        style={[
                          styles.dateScrollerOption,
                          selectedYear === year && styles.dateScrollerOptionSelected
                        ]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[
                          styles.dateScrollerOptionText,
                          selectedYear === year && styles.dateScrollerOptionTextSelected
                        ]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              <View style={styles.dateScrollerActions}>
                <Button
                  variant="outline"
                  onPress={() => setShowDatePicker(false)}
                  style={styles.dateScrollerButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleDateConfirm}
                  style={styles.dateScrollerButton}
                >
                  Confirm
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderHeightStep = () => {
    const feet = Array.from({ length: 8 }, (_, i) => i + 1);
    const inches = Array.from({ length: 12 }, (_, i) => i);

    const handleHeightConfirm = () => {
      setSurveyData({ height: { feet: selectedFeet, inches: selectedInches } });
      setShowHeightPicker(false);
    };

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.heightLabel}>Select your height:</Text>
        <View style={styles.heightContainer}>
          <Text style={styles.heightDisplay}>
            {surveyData.height ? `${surveyData.height.feet}' ${surveyData.height.inches}"` : 'Not selected'}
          </Text>
          
          {!showHeightPicker ? (
            <Button
              variant="outline"
              onPress={() => setShowHeightPicker(true)}
            >
              Select Height
            </Button>
          ) : (
            <View style={styles.pickerContainer}>
              <View style={styles.pickerRow}>
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Feet</Text>
                  <Picker
                    selectedValue={selectedFeet}
                    onValueChange={(itemValue: number) => setSelectedFeet(itemValue)}
                    style={styles.picker}
                  >
                    {feet.map((foot) => (
                      <Picker.Item key={foot} label={`${foot}'`} value={foot} />
                    ))}
                  </Picker>
                </View>
                
                <View style={styles.pickerColumn}>
                  <Text style={styles.pickerLabel}>Inches</Text>
                  <Picker
                    selectedValue={selectedInches}
                    onValueChange={(itemValue: number) => setSelectedInches(itemValue)}
                    style={styles.picker}
                  >
                    {inches.map((inch) => (
                      <Picker.Item key={inch} label={`${inch}"`} value={inch} />
                    ))}
                  </Picker>
                </View>
              </View>
              
              <View style={styles.pickerActions}>
                <Button
                  variant="outline"
                  onPress={() => setShowHeightPicker(false)}
                  style={styles.pickerButton}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onPress={handleHeightConfirm}
                  style={styles.pickerButton}
                >
                  Confirm
                </Button>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

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
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                const newWeight = weightInLbs + 5;
                setSurveyData({ weight: { value: newWeight } });
              }}
              style={styles.weightAdjustButton}
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => {
                const newWeight = Math.max(0, weightInLbs - 5);
                setSurveyData({ weight: { value: newWeight } });
              }}
              style={styles.weightAdjustButton}
            >
              -
            </Button>
          </View>
        </View>
      </View>
    );
  };

  const renderExerciseFrequencyStep = () => (
    <View style={styles.stepContainer}>
      {['2-3 days', '3-4 days', '5-6 days', '7 days'].map((frequency) => (
        <Button
          key={frequency}
          variant={surveyData.exerciseFrequency === frequency ? 'selected' : 'outline'}
          onPress={() => setSurveyData({ exerciseFrequency: frequency as any })}
          style={styles.optionButton}
        >
          {frequency}
        </Button>
      ))}
    </View>
  );

    const renderWorkoutGoalStep = () => (
    <View style={styles.stepContainer}>
      {['gain muscle', 'lose fat', 'improve endurance'].map((goal) => (
        <Button
          key={goal}
          variant={surveyData.workoutGoal === goal ? 'selected' : 'outline'}
          onPress={() => setSurveyData({ workoutGoal: goal as any })}
          style={styles.optionButton}
        >
          {goal.charAt(0).toUpperCase() + goal.slice(1)}
        </Button>
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
          <Button
            onPress={nextStep}
            disabled={!canProceed()}
            style={styles.nextButton}
            size="lg"
          >
            {currentStep < SURVEY_STEPS.length - 1 ? 'Next' : 'Complete Survey'}
          </Button>
        </View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
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
    borderWidth: 3,
    borderColor: 'transparent',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionButtonSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  optionButtonTextSelected: {
    color: '#000000',
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
  dateScrollerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dateScrollerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateScrollerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  dateScrollerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  dateScroller: {
    height: 120,
    width: '100%',
  },
  dateScrollerOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  dateScrollerOptionSelected: {
    backgroundColor: '#000000',
  },
  dateScrollerOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  dateScrollerOptionTextSelected: {
    color: '#ffffff',
  },
  dateScrollerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  dateScrollerButton: {
    flex: 1,
  },
  heightDisplay: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 120,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  pickerButton: {
    flex: 1,
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
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heightOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 8,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heightOptionSelected: {
    backgroundColor: '#000000',
  },
  heightOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  heightOptionTextSelected: {
    color: '#ffffff',
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
