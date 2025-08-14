import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';

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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Unlock Your Results</Text>
        <Text style={styles.headerSubtitle}>
          Subscribe to get your personalized body fat analysis and workout plan
        </Text>
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

      {/* Subscription Plans */}
      <View style={styles.plansContainer}>
        <Text style={styles.plansTitle}>Choose Your Plan</Text>
        
        <View style={styles.planOptions}>
          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Monthly</Text>
              {plans.monthly.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>{plans.monthly.price}</Text>
            <Text style={styles.planPeriod}>per {plans.monthly.period}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'yearly' && styles.planOptionSelected,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Yearly</Text>
              {plans.yearly.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Popular</Text>
                </View>
              )}
            </View>
            <Text style={styles.planPrice}>{plans.yearly.price}</Text>
            <Text style={styles.planPeriod}>per {plans.yearly.period}</Text>
            {plans.yearly.savings && (
              <Text style={styles.savingsText}>{plans.yearly.savings}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscribe Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            isProcessing && styles.subscribeButtonDisabled,
          ]}
          onPress={handleSubscribe}
          disabled={isProcessing}
        >
          <Text style={styles.subscribeButtonText}>
            {isProcessing ? 'Processing...' : `Subscribe for ${plans[selectedPlan].price}/${plans[selectedPlan].period}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
        >
          <Text style={styles.skipButtonText}>Skip for now</Text>
        </TouchableOpacity>
      </View>

      {/* Terms */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          Cancel anytime in your device settings.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
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
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
    lineHeight: 20,
  },
  plansContainer: {
    marginBottom: 40,
  },
  plansTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  planOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  planOption: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planOptionSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
  },
  planPeriod: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.7,
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
    backgroundColor: '#000000',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
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
    color: '#000000',
    opacity: 0.5,
    textAlign: 'center',
    lineHeight: 16,
  },
});
