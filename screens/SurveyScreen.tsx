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
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import ProgressBar from '../components/ProgressBar';
import { Button, Card, CardContent } from '../components/ui';
import colors from '../constants/colors';

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
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(
    surveyData.dateOfBirth || new Date(new Date().setFullYear(new Date().getFullYear() - 25))
  );
  const [showHeightPicker, setShowHeightPicker] = useState(false);
  const [selectedFeet, setSelectedFeet] = useState(surveyData.height?.feet || 5);
  const [selectedInches, setSelectedInches] = useState(surveyData.height?.inches || 0);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState(surveyData.weight?.value || 150);
  const [workoutFrequencyValue, setWorkoutFrequencyValue] = useState(() => {
    // Map old values to new 0-7 scale
    const mapping: Record<string, number> = {
      'never': 0,
      'rarely': 1,
      'sometimes': 2,
      'often': 4,
      'very-often': 6,
    };
    return mapping[surveyData.exerciseFrequency || 'never'] || 3;
  });

  useEffect(() => {
    // Reset animations for new step
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep, fadeAnim, scaleAnim]);

  // Update temp date when survey data changes
  useEffect(() => {
    if (surveyData.dateOfBirth) {
      setTempDate(surveyData.dateOfBirth);
    }
  }, [surveyData.dateOfBirth]);

  // Update selected height values when survey data changes
  useEffect(() => {
    if (surveyData.height) {
      setSelectedFeet(surveyData.height.feet);
      setSelectedInches(surveyData.height.inches);
    }
  }, [surveyData.height]);

  // Update selected weight when survey data changes
  useEffect(() => {
    if (surveyData.weight?.value) {
      setSelectedWeight(surveyData.weight.value);
    }
  }, [surveyData.weight?.value, surveyData.weight?.unit]);


  const handleNext = () => {
    if (currentStep < SURVEY_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Survey complete, navigate to camera instructions
      navigation.navigate('CameraInstructions');
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
      
      <View style={styles.sexOptionsContainer}>
        <TouchableOpacity
          style={[
            styles.sexOptionBox,
            surveyData.sex === 'male' && styles.sexOptionBoxSelected
          ]}
          onPress={() => setSurveyData({ sex: 'male' })}
        >
          <Text style={[
            styles.sexSymbol,
            surveyData.sex === 'male' && styles.sexSymbolSelected
          ]}>
            ♂
          </Text>
          <Text style={[
            styles.sexLabel,
            surveyData.sex === 'male' && styles.sexLabelSelected
          ]}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sexOptionBox,
            surveyData.sex === 'female' && styles.sexOptionBoxSelected
          ]}
          onPress={() => setSurveyData({ sex: 'female' })}
        >
          <Text style={[
            styles.sexSymbol,
            surveyData.sex === 'female' && styles.sexSymbolSelected
          ]}>
            ♀
          </Text>
          <Text style={[
            styles.sexLabel,
            surveyData.sex === 'female' && styles.sexLabelSelected
          ]}>
            Female
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDateOfBirthStep = () => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const handleDateChange = (event: any, selectedDate?: Date) => {
      if (Platform.OS === 'ios') {
        if (selectedDate) {
          setTempDate(selectedDate);
        }
      } else {
        setShowDatePicker(false);
        if (selectedDate) {
          setSurveyData({ dateOfBirth: selectedDate });
        }
      }
    };

    const handleIOSDateConfirm = () => {
      setSurveyData({ dateOfBirth: tempDate });
      setShowDatePicker(false);
    };

    const formatDate = (date: Date) => {
      return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[1].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[1].subtitle}</Text>
        
        <View style={styles.dateDisplayContainer}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Text style={styles.dateDisplayText}>
              {surveyData.dateOfBirth
                ? formatDate(surveyData.dateOfBirth)
                : 'Tap to select date'}
            </Text>
          </TouchableOpacity>
          
          {Platform.OS === 'ios' ? (
            showDatePicker && (
              <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.iosDatePickerModal}>
                  <View style={styles.iosDatePickerContainer}>
                    <View style={styles.iosDatePickerHeader}>
                      <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.iosDatePickerCancel}>Cancel</Text>
                      </TouchableOpacity>
                      <Text style={styles.iosDatePickerTitle}>Select Date</Text>
                      <TouchableOpacity onPress={handleIOSDateConfirm}>
                        <Text style={styles.iosDatePickerDone}>Done</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                      textColor={colors.textPrimary}
                    />
                  </View>
                </View>
              </Modal>
            )
          ) : (
            showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
                minimumDate={new Date(1900, 0, 1)}
              />
            )
          )}
        </View>
      </View>
    );
  };

  const renderHeightStep = () => {
    const handleHeightConfirm = () => {
      setSurveyData({ height: { feet: selectedFeet, inches: selectedInches } });
      setShowHeightPicker(false);
    };

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[2].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[2].subtitle}</Text>
        
        <View style={styles.heightDisplayContainer}>
          <TouchableOpacity onPress={() => setShowHeightPicker(true)} activeOpacity={0.7}>
            <Text style={styles.heightDisplayText}>
              {surveyData.height
                ? `${surveyData.height.feet}'${surveyData.height.inches}"`
                : 'Tap to select height'}
            </Text>
          </TouchableOpacity>
          
          {showHeightPicker && (
            <Modal
              visible={showHeightPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowHeightPicker(false)}
            >
              <View style={styles.iosHeightPickerModal}>
                <View style={styles.iosHeightPickerContainer}>
                  <View style={styles.iosHeightPickerHeader}>
                    <TouchableOpacity onPress={() => setShowHeightPicker(false)}>
                      <Text style={styles.iosHeightPickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.iosHeightPickerTitle}>Select Height</Text>
                    <TouchableOpacity onPress={handleHeightConfirm}>
                      <Text style={styles.iosHeightPickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.heightPickerRow}>
                    <View style={styles.heightPickerColumn}>
                      <Text style={styles.heightPickerLabel}>Feet</Text>
                      <Picker
                        selectedValue={selectedFeet || 5}
                        onValueChange={(itemValue: number) => setSelectedFeet(itemValue)}
                        style={styles.picker}
                        mode="dialog"
                        enabled={true}
                        itemStyle={styles.pickerItem}
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
                        itemStyle={styles.pickerItem}
                      >
                        {Array.from({ length: 12 }, (_, i) => i).map((inches) => (
                          <Picker.Item key={inches} label={inches.toString()} value={inches} />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    );
  };

  const renderWeightStep = () => {
    const handleWeightConfirm = () => {
      setSurveyData({ 
        weight: { 
          value: selectedWeight, 
          unit: surveyData.weight?.unit || 'lbs' 
        } 
      });
      setShowWeightPicker(false);
    };

    // Generate weight options based on unit
    const minWeight = surveyData.weight?.unit === 'kg' ? 20 : 50;
    const maxWeight = surveyData.weight?.unit === 'kg' ? 230 : 500;
    const weightOptions = Array.from({ length: maxWeight - minWeight + 1 }, (_, i) => minWeight + i);

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[3].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[3].subtitle}</Text>
        
        <View style={styles.weightDisplayContainer}>
          <TouchableOpacity onPress={() => setShowWeightPicker(true)} activeOpacity={0.7}>
            <Text style={styles.weightDisplayText}>
              {surveyData.weight?.value
                ? `${surveyData.weight.value}`
                : 'Tap to select weight'}
            </Text>
          </TouchableOpacity>
          
          {/* Unit Selection Below Weight */}
          <View style={styles.weightUnitSelectionContainer}>
            <TouchableOpacity
              style={[
                styles.weightUnitButton,
                surveyData.weight?.unit === 'lbs' && styles.weightUnitButtonActive
              ]}
              onPress={() => {
                const currentValue = surveyData.weight?.value || 150;
                // Convert between units when switching
                const newValue = surveyData.weight?.unit === 'kg' 
                  ? Math.round(currentValue * 2.20462) 
                  : currentValue;
                setSurveyData({ 
                  weight: { 
                    value: newValue, 
                    unit: 'lbs' 
                  } 
                });
                setSelectedWeight(newValue);
              }}
            >
              <Text style={[
                styles.weightUnitButtonText,
                surveyData.weight?.unit === 'lbs' && styles.weightUnitButtonTextActive
              ]}>
                lbs
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.weightUnitButton,
                surveyData.weight?.unit === 'kg' && styles.weightUnitButtonActive
              ]}
              onPress={() => {
                const currentValue = surveyData.weight?.value || 150;
                // Convert between units when switching
                const newValue = surveyData.weight?.unit === 'lbs' 
                  ? Math.round(currentValue / 2.20462) 
                  : currentValue;
                setSurveyData({ 
                  weight: { 
                    value: newValue, 
                    unit: 'kg' 
                  } 
                });
                setSelectedWeight(newValue);
              }}
            >
              <Text style={[
                styles.weightUnitButtonText,
                surveyData.weight?.unit === 'kg' && styles.weightUnitButtonTextActive
              ]}>
                kg
              </Text>
            </TouchableOpacity>
          </View>
          
          {showWeightPicker && (
            <Modal
              visible={showWeightPicker}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setShowWeightPicker(false)}
            >
              <View style={styles.iosWeightPickerModal}>
                <View style={styles.iosWeightPickerContainer}>
                  <View style={styles.iosWeightPickerHeader}>
                    <TouchableOpacity onPress={() => setShowWeightPicker(false)}>
                      <Text style={styles.iosWeightPickerCancel}>Cancel</Text>
                    </TouchableOpacity>
                    <Text style={styles.iosWeightPickerTitle}>Select Weight</Text>
                    <TouchableOpacity onPress={handleWeightConfirm}>
                      <Text style={styles.iosWeightPickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <Picker
                    selectedValue={selectedWeight || minWeight}
                    onValueChange={(itemValue: number) => setSelectedWeight(itemValue)}
                    style={styles.weightPicker}
                    mode="dialog"
                    enabled={true}
                    itemStyle={styles.pickerItem}
                  >
                    {weightOptions.map((weight) => (
                      <Picker.Item key={weight} label={weight.toString()} value={weight} />
                    ))}
                  </Picker>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </View>
    );
  };

  const renderExerciseFrequencyStep = () => {

    const handleSliderChange = (value: number) => {
      const roundedValue = Math.round(value);
      setWorkoutFrequencyValue(value); // Use exact value for smooth interpolation
      
      // Map to old exercise frequency values for backward compatibility
      const frequencyMap: Record<number, 'never' | 'rarely' | 'sometimes' | 'often' | 'very-often'> = {
        0: 'never',
        1: 'rarely',
        2: 'sometimes',
        3: 'sometimes',
        4: 'often',
        5: 'often',
        6: 'very-often',
        7: 'very-often',
      };
      
      setSurveyData({ exerciseFrequency: frequencyMap[roundedValue] || 'sometimes' });
    };

    const getFrequencyLabel = () => {
      const value = workoutFrequencyValue;
      if (value === 0) return '0 days / week';
      if (value === 1) return '1 day / week';
      return `${value} days / week`;
    };

    // Removed unused variable

    return (
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>{SURVEY_STEPS[4].title}</Text>
        <Text style={styles.questionSubtitle}>{SURVEY_STEPS[4].subtitle}</Text>
        
        <View style={styles.frequencyContainer}>
          {/* Pose Image Display */}
          <View style={styles.poseImageContainer}>
            {(() => {
              const roundedValue = Math.round(workoutFrequencyValue);
              const poseImages: { [key: number]: any } = {
                0: require('../assets/poses/pose-0.png'),
                1: require('../assets/poses/pose-1.png'),
                2: require('../assets/poses/pose-2.png'),
                3: require('../assets/poses/pose-3.png'),
                4: require('../assets/poses/pose-4.png'),
                5: require('../assets/poses/pose-5.png'),
                6: require('../assets/poses/pose-6.png'),
                7: require('../assets/poses/pose-7.png'),
              };
              
              try {
                const imageSource = poseImages[roundedValue] || poseImages[0];
                return (
                  <View style={styles.poseImageBox}>
                    <Image 
                      source={imageSource}
                      style={styles.poseImage}
                      resizeMode="contain"
                    />
                  </View>
                );
              } catch (error) {
                // Fallback to number if image not found
                return (
                  <View style={styles.frequencyNumberContainer}>
                    <View style={styles.frequencyCircle}>
                      <Text style={styles.frequencyNumber}>
                        {roundedValue}
                      </Text>
                    </View>
                  </View>
                );
              }
            })()}
          </View>

          {/* Frequency Label */}
          <Text style={styles.frequencyLabel}>{getFrequencyLabel()}</Text>

          {/* Slider */}
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={7}
              step={1}
              value={workoutFrequencyValue}
              onValueChange={handleSliderChange}
              minimumTrackTintColor={colors.accent}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.accent}
            />
            
            {/* Slider Labels */}
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>0</Text>
              <Text style={styles.sliderLabel}>7</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.header}>
        <ProgressBar currentStep={currentStep} totalSteps={SURVEY_STEPS.length} />
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          {renderCurrentStep()}
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <View style={[
          styles.navigationButtons,
          currentStep === 1 && styles.navigationButtonsFirstStep
        ]}>
          {/* Back Button - Show for all steps */}
          {currentStep === 1 ? (
            <Button
              variant="outline"
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            >
              Back
            </Button>
          ) : (
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
        
        {/* Privacy Policy Link - Below buttons */}
        <TouchableOpacity
          onPress={() => navigation.navigate('PrivacyPolicy')}
          style={styles.privacyLinkContainer}
        >
          <Text style={styles.privacyLinkText}>
            By continuing, you agree to our{' '}
            <Text style={styles.privacyLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
    paddingTop: 20,
    flexShrink: 1,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginTop: 0,
  },
  questionSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: -20,
    marginBottom: 24,
  },
  sexOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    marginBottom: 24,
    paddingHorizontal: 16,
    gap: 16,
    flex: 1,
  },
  sexOptionBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    height: 180,
    width: (screenWidth - 32 - 16) / 2,
  },
  sexOptionBoxSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent + '10',
  },
  sexSymbol: {
    fontSize: 64,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  sexSymbolSelected: {
    color: colors.accent,
  },
  sexLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  sexLabelSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radioOptionSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.textTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  radioButtonSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  radioOptionText: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  radioOptionTextSelected: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  radioOptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  radioOptionDescriptionSelected: {
    color: colors.textPrimary,
  },
  dateDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
    width: '100%',
    flex: 1,
  },
  dateDisplayText: {
    fontSize: 42,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    letterSpacing: -0.5,
  },
  datePickerButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3DAC9',
  },
  iosDatePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosDatePickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingBottom: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosDatePickerCancel: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '500',
  },
  iosDatePickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iosDatePickerDone: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '600',
  },
  optionBox: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textPrimary,
  },
  pickerItem: {
    color: colors.textPrimary,
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  heightDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
    width: '100%',
    flex: 1,
  },
  heightDisplayText: {
    fontSize: 42,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    letterSpacing: -0.5,
  },
  iosHeightPickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosHeightPickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingBottom: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iosHeightPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosHeightPickerCancel: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '500',
  },
  iosHeightPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iosHeightPickerDone: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '600',
  },
  iosWeightPickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosWeightPickerContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingBottom: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iosWeightPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iosWeightPickerCancel: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '500',
  },
  iosWeightPickerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  iosWeightPickerDone: {
    fontSize: 17,
    color: colors.accent,
    fontWeight: '600',
  },
  weightPicker: {
    width: '100%',
    height: 200,
  },
  heightPickerContainer: {
    marginTop: 20,
  },
  heightPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heightPickerColumn: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  heightPickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  weightDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -60,
    width: '100%',
    flex: 1,
  },
  weightDisplayText: {
    fontSize: 42,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    letterSpacing: -0.5,
  },
  weightInputSection: {
    alignItems: 'center',
    marginBottom: 24,
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
  weightUnitSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
  weightUnitButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.softGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightUnitButtonActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  weightUnitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  weightUnitButtonTextActive: {
    color: colors.surface,
    fontWeight: '600',
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
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    flexShrink: 0,
  },
  privacyLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  privacyLinkText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  privacyLink: {
    color: colors.accent,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
  },
  navigationButtonsFirstStep: {
    // Keep both buttons visible on first step
  },
  backButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E3DAC9',
  },
  nextButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: colors.interactiveDisabled,
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
  frequencyContainer: {
    alignItems: 'center',
    marginTop: -20,
    width: '100%',
  },
  poseImageContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    minHeight: 240,
  },
  poseImageBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  poseImage: {
    width: 200,
    height: 280,
  },
  frequencyNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  frequencyCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent + '20',
    borderWidth: 2,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequencyNumber: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  frequencyLabel: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 32,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
