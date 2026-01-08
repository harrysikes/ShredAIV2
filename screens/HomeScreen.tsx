import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import colors from '../constants/colors';
import Svg, { Polyline, Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { getCurrentWeeklyChallenge } from '../utils/weeklyChallenge';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 40;
const CHART_HEIGHT = 160;
const CHART_PADDING = 40;
const CHART_INNER_WIDTH = CHART_WIDTH - CHART_PADDING * 2;
const CHART_INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING * 2;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute();
  const { bodyFatPercentage, bodyFatHistory, workoutPlan, loadProfileData, getDailyStreak } = useSurveyStore();
  
  const currentRoute = route.name;

  useEffect(() => {
    loadProfileData();
  }, []);

  const latestBodyFat = bodyFatHistory.length > 0
    ? bodyFatHistory[bodyFatHistory.length - 1].bodyFatPercentage
    : bodyFatPercentage;

  const streak = getDailyStreak();
  const weeklyChallenge = getCurrentWeeklyChallenge();

  const chartData = useMemo(() => {
    if (bodyFatHistory.length === 0) return null;

    const sorted = [...bodyFatHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const values = sorted.map(entry => entry.bodyFatPercentage);
    const minValue = Math.min(...values) - 2;
    const maxValue = Math.max(...values) + 2;
    const valueRange = maxValue - minValue || 1;

    const points = sorted.map((entry, index) => {
      const x = CHART_PADDING + (index / (sorted.length - 1 || 1)) * CHART_INNER_WIDTH;
      const normalizedValue = (entry.bodyFatPercentage - minValue) / valueRange;
      const y = CHART_PADDING + CHART_INNER_HEIGHT - (normalizedValue * CHART_INNER_HEIGHT);
      return { x, y, value: entry.bodyFatPercentage, date: entry.date };
    });

    return { points, minValue, maxValue, sorted };
  }, [bodyFatHistory]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ShredAI Logo */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ShredAI</Text>
          <Text style={styles.headerSubtitle}>Your Body Composition Tracker</Text>
        </View>

        {/* Top Section: Body Fat and Streak */}
        <View style={styles.topSection}>
          {/* Current Body Fat Box - Top Left */}
          <View style={styles.bodyFatBox}>
            <Text style={styles.bodyFatLabel}>Body Fat</Text>
            {latestBodyFat !== null ? (
              <>
                <View style={styles.bodyFatValueContainer}>
                  <Text style={styles.bodyFatValue}>{latestBodyFat.toFixed(1)}</Text>
                  <Text style={styles.bodyFatPercent}>%</Text>
                </View>
              </>
            ) : (
              <Text style={styles.bodyFatEmpty}>No data</Text>
            )}
          </View>

          {/* Daily Streak Box - Top Right */}
          <View style={styles.streakBox}>
            <Text style={styles.streakLabel}>Day Streak</Text>
            <View style={styles.streakContent}>
              <Text style={styles.lightningEmoji}>⚡</Text>
              <Text style={styles.streakValue}>{streak}</Text>
            </View>
          </View>
        </View>

        {/* Body Fat Chart */}
        {chartData && bodyFatHistory.length > 0 ? (
          <TouchableOpacity
            style={styles.chartContainer}
            onPress={() => navigation.navigate('BodyFatHistory')}
            activeOpacity={0.7}
          >
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Body Fat Progress</Text>
              <Text style={styles.chartSubtitle}>
                {bodyFatHistory.length} {bodyFatHistory.length === 1 ? 'entry' : 'entries'}
              </Text>
            </View>
            <View style={styles.chartWrapper}>
              <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = CHART_PADDING + ratio * CHART_INNER_HEIGHT;
                  const value = chartData.maxValue - (ratio * (chartData.maxValue - chartData.minValue));
                  return (
                    <React.Fragment key={ratio}>
                      <Line
                        x1={CHART_PADDING}
                        y1={y}
                        x2={CHART_WIDTH - CHART_PADDING}
                        y2={y}
                        stroke={colors.border}
                        strokeWidth={0.5}
                        strokeDasharray="4,4"
                      />
                      <G key={`label-${ratio}`}>
                        <SvgText
                          x={CHART_PADDING - 10}
                          y={y + 4}
                          fontSize="12"
                          fill={colors.textSecondary}
                          textAnchor="end"
                        >
                          {value.toFixed(1)}
                        </SvgText>
                      </G>
                    </React.Fragment>
                  );
                })}

                {/* Chart line */}
                <Polyline
                  points={chartData.points.map(p => `${p.x},${p.y}`).join(' ')}
                  fill="none"
                  stroke={colors.accent}
                  strokeWidth={3}
                />

                {/* Data points */}
                {chartData.points.map((point, index) => (
                  <Circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill={colors.accent}
                    stroke={colors.surface}
                    strokeWidth={2}
                  />
                ))}
              </Svg>

              {/* X-axis labels */}
              <View style={styles.xAxisLabels}>
                {chartData.sorted.map((entry, index) => {
                  const shouldShow = index === 0 || 
                                    index === chartData.sorted.length - 1 || 
                                    chartData.sorted.length <= 5;
                  if (!shouldShow) return null;
                  
                  const position = (index / (chartData.sorted.length - 1 || 1)) * CHART_INNER_WIDTH;
                  return (
                    <View key={index} style={[styles.xAxisLabel, { left: CHART_PADDING + position - 20 }]}>
                      <Text style={styles.xAxisLabelText}>{formatDate(entry.date)}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
            <Text style={styles.chartHint}>Tap to view full history</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyChartContainer}>
            <Text style={styles.emptyChartText}>No progress data yet</Text>
            <Text style={styles.emptyChartSubtext}>Complete a scan to start tracking</Text>
          </View>
        )}

        {/* Weekly Challenge Box */}
        <TouchableOpacity
          style={styles.challengeBox}
          onPress={() => navigation.navigate('WeeklyChallenge')}
          activeOpacity={0.7}
        >
          <Text style={styles.challengeBoxTitle}>Weekly Challenge</Text>
          <Text style={styles.challengeBoxName}>{weeklyChallenge.name}</Text>
          <Text style={styles.challengeBoxHint}>Tap to view details</Text>
        </TouchableOpacity>
      </View>

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
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  topSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  bodyFatBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  bodyFatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyFatValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bodyFatValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  bodyFatPercent: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  bodyFatEmpty: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  streakBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lightningEmoji: {
    fontSize: 28,
  },
  streakValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  chartHeader: {
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartWrapper: {
    marginBottom: 8,
  },
  xAxisLabels: {
    marginTop: 10,
    height: 20,
    position: 'relative',
  },
  xAxisLabel: {
    position: 'absolute',
    width: 40,
  },
  xAxisLabelText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  chartHint: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: 'center',
    marginTop: 8,
  },
  emptyChartContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 8,
  },
  emptyChartText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptyChartSubtext: {
    fontSize: 14,
    color: colors.textTertiary,
  },
  challengeBox: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
    alignItems: 'center',
  },
  challengeBoxTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  challengeBoxName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
    textAlign: 'center',
  },
  challengeBoxHint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 4,
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
