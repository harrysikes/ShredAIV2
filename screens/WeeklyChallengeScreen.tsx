import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import colors from '../constants/colors';
import { getCurrentWeeklyChallenge } from '../utils/weeklyChallenge';

type WeeklyChallengeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WeeklyChallenge'>;

export default function WeeklyChallengeScreen() {
  const navigation = useNavigation<WeeklyChallengeScreenNavigationProp>();
  const route = useRoute();
  const currentRoute = route.name;
  const challenge = getCurrentWeeklyChallenge();

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Challenge</Text>
          <Text style={styles.challengeName}>{challenge.name}</Text>
        </View>

        {/* Rules Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rules</Text>
          {challenge.rules.map((rule, index) => (
            <View key={index} style={styles.ruleItem}>
              <Text style={styles.ruleBullet}>•</Text>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        {/* Equipment Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipment Needed</Text>
          {challenge.equipment.map((item, index) => (
            <View key={index} style={styles.equipmentItem}>
              <Text style={styles.equipmentBullet}>•</Text>
              <Text style={styles.equipmentText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Time Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Time Needed</Text>
          <Text style={styles.timeText}>{challenge.timeNeeded}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Challenge resets every Sunday night
          </Text>
        </View>
      </ScrollView>

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  challengeName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    textAlign: 'center',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  ruleItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ruleBullet: {
    fontSize: 16,
    color: colors.accent,
    marginRight: 12,
    fontWeight: '700',
  },
  ruleText: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  equipmentItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  equipmentBullet: {
    fontSize: 16,
    color: colors.accent,
    marginRight: 12,
    fontWeight: '700',
  },
  equipmentText: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textTertiary,
    fontStyle: 'italic',
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
