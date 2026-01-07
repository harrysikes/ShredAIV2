import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { Button } from '../components/ui';
import colors from '../constants/colors';

type PaywallScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Paywall'>;

const { width: screenWidth } = Dimensions.get('window');

export default function PaywallScreen() {
  const navigation = useNavigation<PaywallScreenNavigationProp>();
  const { setIsSubscribed } = useSurveyStore();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = {
    monthly: {
      price: '$6.99',
      period: 'month',
      savings: null,
      popular: false,
    },
    yearly: {
      price: '$59.99',
      period: 'year',
      savings: 'Save 28%',
      popular: true,
    },
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate subscription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful subscription
      setIsSubscribed(true);
      
      // Show success message
      Alert.alert(
        'Subscription Successful!',
        'Welcome to ShredAI Premium! You now have access to your personalized results and workout plan.',
        [
          {
            text: 'View Results',
            onPress: () => navigation.navigate('Results'),
          },
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Subscription Failed',
        'There was an error processing your subscription. Please try again.',
        [
          {
            text: 'Try Again',
            onPress: () => setIsProcessing(false),
          },
        ]
      );
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Subscription',
      'You can still view basic results, but you\'ll miss out on your personalized workout plan and detailed analysis.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Skip for Now',
          onPress: () => navigation.navigate('Results'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unlock Your Results</Text>
          <Text style={styles.headerSubtitle}>
            Subscribe to get your personalized body fat analysis and workout plan
          </Text>
        </View>

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>Choose Your Plan</Text>
        
        <View style={styles.planOptions}>
          <TouchableOpacity
            onPress={() => setSelectedPlan('monthly')}
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.planOptionSelected
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={[
              styles.planName,
              selectedPlan === 'monthly' && styles.planNameSelected
            ]}>Monthly</Text>
              {plans.monthly.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'monthly' && styles.planPriceSelected
            ]}>{plans.monthly.price}</Text>
            <Text style={[
              styles.planPeriod,
              selectedPlan === 'monthly' && styles.planPeriodSelected
            ]}>per {plans.monthly.period}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedPlan('yearly')}
            style={[
              styles.planOption,
              selectedPlan === 'yearly' && styles.planOptionSelected
            ]}
            activeOpacity={0.8}
          >
            <View style={styles.planHeader}>
              <Text style={[
              styles.planName,
              selectedPlan === 'yearly' && styles.planNameSelected
            ]}>Yearly</Text>
              {plans.yearly.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={[
              styles.planPrice,
              selectedPlan === 'yearly' && styles.planPriceSelected
            ]}>{plans.yearly.price}</Text>
            <Text style={[
              styles.planPeriod,
              selectedPlan === 'yearly' && styles.planPeriodSelected
            ]}>per {plans.yearly.period}</Text>
            {plans.yearly.savings && (
              <Text style={styles.savingsText}>{plans.yearly.savings}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <View style={styles.featureIcon}>📊</View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Detailed Body Fat Analysis</Text>
            <Text style={styles.featureDescription}>
              Get your exact body fat percentage with confidence intervals
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>💪</View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Personalized Workout Plan</Text>
            <Text style={styles.featureDescription}>
              Custom routines based on your goals and fitness level
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>📈</View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>Progress Tracking</Text>
            <Text style={styles.featureDescription}>
              Monitor your fitness journey with detailed analytics
            </Text>
          </View>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIcon}>🎯</View>
          <View style={styles.featureText}>
            <Text style={styles.featureTitle}>AI-Powered Insights</Text>
            <Text style={styles.featureDescription}>
              Advanced recommendations based on your progress
            </Text>
          </View>
        </View>
      </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            By subscribing, you agree to our Terms of Service and Privacy Policy. 
            Cancel anytime in your device settings.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Buttons */}
      <View style={styles.fixedBottomContainer}>
        {/* Subscribe Button */}
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleSubscribe}
            disabled={isProcessing}
            style={styles.subscribeButton}
            size="lg"
          >
            {isProcessing ? 'Processing...' : `Subscribe for ${plans[selectedPlan].price}/${plans[selectedPlan].period}`}
          </Button>

          <Button
            variant="ghost"
            onPress={handleSkip}
            style={styles.skipButton}
          >
            Skip for now
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fixedBottomContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
    width: 44,
    textAlign: 'center',
    marginTop: 2,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  plansContainer: {
    marginBottom: 40,
  },
  plansTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  planOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planOption: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  planOptionSelected: {
    backgroundColor: colors.textPrimary,
    borderColor: colors.textPrimary,
    borderWidth: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 17,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  planNameSelected: {
    color: colors.surface,
    fontWeight: '600',
  },
  popularBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000000',
  },
  planPrice: {
    fontSize: 26,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  planPriceSelected: {
    color: colors.surface,
  },
  planPeriod: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planPeriodSelected: {
    color: colors.surface,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B6B',
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  subscribeButton: {
    backgroundColor: colors.textPrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#E3DAC9',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#000000',
    opacity: 0.6,
    textDecorationLine: 'underline',
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});

