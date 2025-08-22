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
  TextInput,
  Modal,
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
  const [isWeightEditing, setIsWeightEditing] = useState(false);
  const [weightInputValue, setWeightInputValue] = useState(surveyData.weight?.value?.toString() || '150');
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

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

  // Update weight input value when survey data changes
  useEffect(() => {
    if (surveyData.weight?.value) {
      setWeightInputValue(surveyData.weight.value.toString());
    }
  }, [surveyData.weight?.value]);

  // Initialize date picker values when component mounts
  useEffect(() => {
    const today = new Date();
    if (!surveyData.dateOfBirth) {
      setSelectedYear(today.getFullYear() - 18); // Default to 18 years ago
      setSelectedMonth(today.getMonth());
      setSelectedDay(today.getDate());
    } else {
      // If we have a date, use it to initialize the pickers
      setSelectedYear(surveyData.dateOfBirth.getFullYear());
      setSelectedMonth(surveyData.dateOfBirth.getMonth());
      setSelectedDay(surveyData.dateOfBirth.getDate());
    }
  }, [surveyData.dateOfBirth]);

  // Update selected day when month or year changes to prevent invalid dates
  useEffect(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    if (selectedDay > daysInMonth) {
      setSelectedDay(daysInMonth);
    }
  }, [selectedMonth, selectedYear, selectedDay]);

  const handleNext = () => {
    if (currentStep < SURVEY_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Survey complete, navigate to camera
      navigation.navigate('Camera');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderSexStep = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{SURVEY_STEPS[0].title}</Text>
      <Text style={styles.questionSubtitle}>{SURVEY_STEPS[0].subtitle}</Text>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.radioOption,
            surveyData.sex === 'male' && styles.radioOptionSelected
          ]}
          onPress={() => setSurveyData({ sex: 'male' })}
        >
          <View style={[
            styles.radioButton,
            surveyData.sex === 'male' && styles.radioButtonSelected
          ]}>
            {surveyData.sex === 'male' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[
            styles.radioOptionText,
            surveyData.sex === 'male' && styles.radioOptionTextSelected
          ]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.radioOption,
            surveyData.sex === 'female' && styles.radioOptionSelected
          ]}
          onPress={() => setSurveyData({ sex: 'female' })}
        >
          <View style={[
            styles.radioButton,
            surveyData.sex === 'female' && styles.radioButtonSelected
          ]}>
            {surveyData.sex === 'female' && <View style={styles.radioButtonInner} />}
          </View>
          <Text style={[
            styles.radioOptionText,
            surveyData.sex === 'female' && styles.radioOptionTextSelected
          ]}>
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDateOfBirthStep = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    const days = Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1);

    const handleDateConfirm = () => {
      const newDate = new Date(selectedYear, selectedMonth, selectedDay);
      setSurveyData({ dateOfBirth: newDate });
      setShowDatePicker(false);
    };

    // Initialize with current date if not set
    const initializeDate = () => {
      if (!surveyData.dateOfBirth) {
        const today = new Date();
        setSelectedYear(today.getFullYear() - 18); // Default to 18 years ago
        setSelectedMonth(today.getMonth());
        setSelectedDay(today.getDate());
      }
    };

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[1].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[1].subtitle}</Text>
        
        {!showDatePicker ? (
          <View style={styles.dateDisplayContainer}>
            <Text style={styles.dateDisplayText}>
              {surveyData.dateOfBirth
                ? `${months[surveyData.dateOfBirth.getMonth()]} ${surveyData.dateOfBirth.getDate()}, ${surveyData.dateOfBirth.getFullYear()}`
                : 'Not selected'}
            </Text>
            <Button
              variant="outline"
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerButton}
            >
              Select Date
            </Button>
          </View>
        ) : (
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerRow}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Month</Text>
                <TouchableOpacity
                  style={styles.customPickerButton}
                  onPress={() => setShowMonthPicker(true)}
                >
                  <Text style={styles.customPickerButtonText}>
                    {months[selectedMonth] || 'Select Month'}
                  </Text>
                </TouchableOpacity>

              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Day</Text>
                <TouchableOpacity
                  style={styles.customPickerButton}
                  onPress={() => setShowDayPicker(true)}
                >
                  <Text style={styles.customPickerButtonText}>
                    {selectedDay || 'Select Day'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.yearColumn}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <TouchableOpacity
                  style={styles.yearPickerButton}
                  onPress={() => setShowYearPicker(true)}
                >
                  <Text style={styles.customPickerButtonText}>
                    {selectedYear || 'Select Year'}
                  </Text>
                </TouchableOpacity>

              </View>
            </View>
            
            <View style={styles.datePickerActions}>
              <Button
                variant="outline"
                onPress={() => setShowDatePicker(false)}
                style={styles.datePickerButton}
              >
                Cancel
              </Button>
              <Button
                onPress={handleDateConfirm}
                style={styles.datePickerButton}
              >
                Confirm
              </Button>
            </View>
          </View>
        )}

        {/* Month Picker Modal */}
        <Modal
          visible={showMonthPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowMonthPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Month (3-letter)</Text>
              <ScrollView style={styles.modalScrollView}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.modalOption,
                      selectedMonth === index && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedMonth(index);
                      setShowMonthPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      selectedMonth === index && styles.modalOptionTextSelected
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowMonthPicker(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Day Picker Modal */}
        <Modal
          visible={showDayPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDayPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Day</Text>
              <ScrollView style={styles.modalScrollView}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.modalOption,
                      selectedDay === day && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedDay(day);
                      setShowDayPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      selectedDay === day && styles.modalOptionTextSelected
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowDayPicker(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Year Picker Modal */}
        <Modal
          visible={showYearPicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowYearPicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, styles.yearPickerModal]}>
              <Text style={styles.modalTitle}>Select Year</Text>
              <ScrollView style={styles.modalScrollView}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.modalOption,
                      styles.yearPickerOption,
                      selectedYear === year && styles.modalOptionSelected
                    ]}
                    onPress={() => {
                      setSelectedYear(year);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text style={[
                      styles.modalOptionText,
                      selectedYear === year && styles.modalOptionTextSelected
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowYearPicker(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const renderHeightStep = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{SURVEY_STEPS[2].title}</Text>
      <Text style={styles.questionSubtitle}>{SURVEY_STEPS[2].subtitle}</Text>
      
      {!showHeightPicker ? (
        <View style={styles.heightDisplayContainer}>
          <Text style={styles.heightDisplayText}>
            {surveyData.height
              ? `${surveyData.height.feet}' ${surveyData.height.inches}"`
              : 'Not selected'}
          </Text>
          <Button
            variant="outline"
            onPress={() => setShowHeightPicker(true)}
            style={styles.heightPickerButton}
          >
            Select Height
          </Button>
        </View>
      ) : (
        <View style={styles.heightPickerContainer}>
          <View style={styles.heightPickerRow}>
            <View style={styles.heightPickerColumn}>
              <Text style={styles.heightPickerLabel}>Feet</Text>
              <Picker
                selectedValue={selectedFeet || 5}
                onValueChange={(itemValue: number) => setSelectedFeet(itemValue)}
                style={styles.picker}
                mode="dialog"
                enabled={true}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((feet) => (
                  <Picker.Item key={feet} label={feet.toString()} value={feet} />
                ))}
              </Picker>
            </View>
            
            <View style={styles.heightPickerColumn}>
              <Text style={styles.heightPickerLabel}>Inches</Text>
              <Picker
                selectedValue={selectedInches || 0}
                onValueChange={(itemValue: number) => setSelectedInches(itemValue)}
                style={styles.picker}
                mode="dialog"
                enabled={true}
              >
                {Array.from({ length: 12 }, (_, i) => i).map((inches) => (
                  <Picker.Item key={inches} label={inches.toString()} value={inches} />
                ))}
              </Picker>
            </View>
          </View>
          
          <View style={styles.heightPickerActions}>
            <Button
              variant="outline"
              onPress={() => setShowHeightPicker(false)}
              style={styles.heightPickerButton}
            >
              Cancel
            </Button>
            <Button
              onPress={() => {
                setSurveyData({ height: { feet: selectedFeet, inches: selectedInches } });
                setShowHeightPicker(false);
              }}
              style={styles.heightPickerButton}
            >
              Confirm
            </Button>
          </View>
        </View>
      )}
    </View>
  );

  const renderWeightStep = () => {
    const handleWeightChange = (text: string) => {
      const numValue = parseInt(text) || 0;
      if (numValue >= 50 && numValue <= 500) {
        setSurveyData({ 
          weight: { 
            value: numValue, 
            unit: surveyData.weight?.unit || 'lbs' 
          } 
        });
      }
      setWeightInputValue(text);
    };
    
    const handleDone = () => {
      const numValue = parseInt(weightInputValue) || 150;
      const clampedValue = Math.max(50, Math.min(500, numValue));
      setSurveyData({ 
        weight: { 
          value: clampedValue, 
          unit: surveyData.weight?.unit || 'lbs' 
        } 
      });
      setWeightInputValue(clampedValue.toString());
      setIsWeightEditing(false);
    };
    
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[3].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[3].subtitle}</Text>
        
        <View style={styles.weightContainer}>
          {/* Weight Input Section */}
          <View style={styles.weightInputSection}>
            <Text style={styles.weightLabel}>Weight</Text>
            
            {isWeightEditing ? (
              <View style={styles.weightInputRow}>
                <TextInput
                  style={styles.weightInput}
                  value={weightInputValue}
                  onChangeText={handleWeightChange}
                  keyboardType="numeric"
                  placeholder="Enter weight"
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={handleDone}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.weightDisplayRow}
                onPress={() => setIsWeightEditing(true)}
              >
                <Text style={styles.weightValue}>{surveyData.weight?.value || 150}</Text>
                <Text style={styles.weightUnit}>{surveyData.weight?.unit || 'lbs'}</Text>
                <Text style={styles.editHint}>Tap to edit</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Unit Toggle */}
          <View style={styles.weightUnitContainer}>
            <Text style={styles.weightUnitLabel}>Unit</Text>
            <View style={styles.weightUnitToggle}>
              <TouchableOpacity
                style={[
                  styles.unitToggleButton,
                  surveyData.weight?.unit === 'lbs' && styles.unitToggleButtonActive
                ]}
                onPress={() => setSurveyData({ 
                  weight: { 
                    value: surveyData.weight?.value || 150, 
                    unit: 'lbs' 
                  } 
                })}
              >
                <Text style={[
                  styles.unitToggleText,
                  surveyData.weight?.unit === 'lbs' && styles.unitToggleTextActive
                ]}>
                  lbs
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitToggleButton,
                  surveyData.weight?.unit === 'kg' && styles.unitToggleButtonActive
                ]}
                onPress={() => setSurveyData({ 
                  weight: { 
                    value: surveyData.weight?.value || 68, 
                    unit: 'kg' 
                  } 
                })}
              >
                <Text style={[
                  styles.unitToggleText,
                  surveyData.weight?.unit === 'kg' && styles.unitToggleTextActive
                ]}>
                  kg
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Quick Adjust Buttons */}
          <View style={styles.weightAdjustment}>
            <TouchableOpacity
              style={styles.weightAdjustButton}
              onPress={() => {
                const currentWeight = surveyData.weight?.value || 150;
                const newWeight = Math.max(50, currentWeight - 5);
                setSurveyData({ 
                  weight: { 
                    value: newWeight, 
                    unit: surveyData.weight?.unit || 'lbs' 
                  } 
                });
                setWeightInputValue(newWeight.toString());
              }}
            >
              <Text style={styles.weightAdjustButtonText}>-5</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.weightAdjustButton}
              onPress={() => {
                const currentWeight = surveyData.weight?.value || 150;
                const newWeight = Math.min(500, currentWeight + 5);
                setSurveyData({ 
                  weight: { 
                    value: newWeight, 
                    unit: surveyData.weight?.unit || 'lbs' 
                  } 
                });
                setWeightInputValue(newWeight.toString());
              }}
            >
              <Text style={styles.weightAdjustButtonText}>+5</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderExerciseFrequencyStep = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{SURVEY_STEPS[4].title}</Text>
      <Text style={styles.questionSubtitle}>{SURVEY_STEPS[4].subtitle}</Text>
      
      <View style={styles.optionsContainer}>
                 {[
           { value: 'never' as const, label: 'Never', description: 'I don\'t exercise' },
           { value: 'rarely' as const, label: 'Rarely', description: 'Less than once a week' },
           { value: 'sometimes' as const, label: 'Sometimes', description: '1-2 times per week' },
           { value: 'often' as const, label: 'Often', description: '3-4 times per week' },
           { value: 'very-often' as const, label: 'Very Often', description: '5+ times per week' },
         ].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              surveyData.exerciseFrequency === option.value && styles.radioOptionSelected
            ]}
            onPress={() => setSurveyData({ exerciseFrequency: option.value })}
          >
            <View style={[
              styles.radioButton,
              surveyData.exerciseFrequency === option.value && styles.radioButtonSelected
            ]}>
              {surveyData.exerciseFrequency === option.value && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioOptionContent}>
              <Text style={[
                styles.radioOptionText,
                surveyData.exerciseFrequency === option.value && styles.radioOptionTextSelected
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.radioOptionDescription,
                surveyData.exerciseFrequency === option.value && styles.radioOptionDescriptionSelected
              ]}>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderWorkoutGoalStep = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionTitle}>{SURVEY_STEPS[5].title}</Text>
      <Text style={styles.questionSubtitle}>{SURVEY_STEPS[5].subtitle}</Text>
      
      <View style={styles.optionsContainer}>
                 {[
           { value: 'lose-weight' as const, label: 'Lose Weight', description: 'Reduce body fat and overall weight' },
           { value: 'build-muscle' as const, label: 'Build Muscle', description: 'Increase muscle mass and strength' },
           { value: 'maintain' as const, label: 'Maintain', description: 'Keep current fitness level' },
           { value: 'improve-fitness' as const, label: 'Improve Fitness', description: 'Enhance overall physical condition' },
           { value: 'sports-performance' as const, label: 'Sports Performance', description: 'Improve athletic abilities' },
         ].map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.radioOption,
              surveyData.workoutGoal === option.value && styles.radioOptionSelected
            ]}
            onPress={() => setSurveyData({ workoutGoal: option.value })}
          >
            <View style={[
              styles.radioButton,
              surveyData.workoutGoal === option.value && styles.radioButtonSelected
            ]}>
              {surveyData.workoutGoal === option.value && <View style={styles.radioButtonInner} />}
            </View>
            <View style={styles.radioOptionContent}>
              <Text style={[
                styles.radioOptionText,
                surveyData.workoutGoal === option.value && styles.radioOptionTextSelected
              ]}>
                {option.label}
              </Text>
              <Text style={[
                styles.radioOptionDescription,
                surveyData.workoutGoal === option.value && styles.radioOptionDescriptionSelected
              ]}>
                {option.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderSexStep();
      case 2:
        return renderDateOfBirthStep();
      case 3:
        return renderHeightStep();
      case 4:
        return renderWeightStep();
      case 5:
        return renderExerciseFrequencyStep();
      case 6:
        return renderWorkoutGoalStep();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return surveyData.sex;
      case 2:
        return surveyData.dateOfBirth;
      case 3:
        return surveyData.height;
      case 4:
        return surveyData.weight;
      case 5:
        return surveyData.exerciseFrequency;
      case 6:
        return surveyData.workoutGoal;
      default:
        return false;
    }
  };

  const getNextButtonStyle = () => {
    if (!canProceed()) {
      return [styles.nextButton, styles.nextButtonDisabled];
    }
    return styles.nextButton;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <ProgressBar currentStep={currentStep} totalSteps={SURVEY_STEPS.length} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {renderCurrentStep()}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={[
          styles.navigationButtons,
          currentStep === 1 && styles.navigationButtonsFirstStep
        ]}>
          {/* Back Button - Only show for questions 2-6 */}
          {currentStep > 1 && (
            <Button
              variant="outline"
              onPress={handleBack}
              style={styles.backButton}
            >
              Back
            </Button>
          )}
          
          {/* Next Button - Always show for questions 1-6 */}
          <Button
            onPress={handleNext}
            disabled={!canProceed()}
            style={!canProceed() ? StyleSheet.flatten([styles.nextButton, styles.nextButtonDisabled]) : styles.nextButton}
          >
            {currentStep === SURVEY_STEPS.length ? 'Complete Survey' : 'Next'}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingBottom: 40, // Add some padding at the bottom for the footer
  },
  stepContainer: {
    // This style is now primarily for the animation container
  },
  questionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  questionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  questionSubtitle: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: 30,
  },
  optionsContainer: {
    // This style is for the radio button group
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  radioOptionSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  radioOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  radioOptionTextSelected: {
    color: '#000000',
  },
  radioOptionDescription: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.6,
    marginTop: 4,
  },
  radioOptionDescriptionSelected: {
    color: '#000000',
    opacity: 0.8,
  },
  dateDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dateDisplayText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
    textAlign: 'center',
    flexShrink: 0,
    paddingHorizontal: 20,
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
  datePickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    minHeight: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  datePickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  yearColumn: {
    flex: 1.2,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  datePickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    height: 200,
    minHeight: 200,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  heightDisplayContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heightDisplayText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  heightPickerButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  heightPickerContainer: {
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
  heightPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heightPickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  heightPickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  heightPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  weightContainer: {
    alignItems: 'center',
  },
  weightInputSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  weightInput: {
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 120,
    marginRight: 15,
    backgroundColor: '#ffffff',
  },
  doneButton: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  doneButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  weightDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  editHint: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  weightUnitToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  unitToggleButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  unitToggleButtonActive: {
    backgroundColor: '#000000',
  },
  unitToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  unitToggleTextActive: {
    color: '#ffffff',
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
  weightUnit: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.6,
    marginTop: 8,
    textAlign: 'center',
  },
  weightUnitContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  weightUnitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  weightUnitButtons: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 4,
  },
  weightUnitButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  weightUnitButtonSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
    borderWidth: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  weightUnitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  weightUnitButtonTextSelected: {
    color: '#ffffff',
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
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  navigationButtonsFirstStep: {
    justifyContent: 'flex-end',
  },
  backButton: {
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3DAC9',
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
  radioOptionContent: {
    flex: 1,
  },

  customPickerButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 80,
  },
  yearPickerButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    minWidth: 100,
  },
  customPickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
    flexShrink: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalScrollView: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 50,
    justifyContent: 'center',
  },
  modalOptionSelected: {
    backgroundColor: '#000000',
  },
  modalOptionText: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
    flexShrink: 0,
  },
  modalOptionTextSelected: {
    color: '#ffffff',
    fontWeight: '600',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  yearPickerModal: {
    width: '95%',
  },
  yearPickerOption: {
    paddingHorizontal: 40,
  },
});
