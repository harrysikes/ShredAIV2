import React, { useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Swipeable, ScrollView } from 'react-native-gesture-handler';
import Svg, { Polyline, Circle, Line, G, Text as SvgText } from 'react-native-svg';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/surveyStore';
import { Button } from '../components/ui';
import colors from '../constants/colors';

type BodyFatHistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BodyFatHistory'>;

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 80;
const CHART_HEIGHT = 250;
const CHART_PADDING = 40;
const CHART_INNER_WIDTH = CHART_WIDTH - CHART_PADDING * 2;
const CHART_INNER_HEIGHT = CHART_HEIGHT - CHART_PADDING * 2;

export default function BodyFatHistoryScreen() {
  const navigation = useNavigation<BodyFatHistoryScreenNavigationProp>();
  const { bodyFatHistory, removeBodyFatHistory, loadProfileData } = useSurveyStore();
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  // Load history when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProfileData();
    }, [loadProfileData])
  );

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

  if (!chartData || bodyFatHistory.length === 0) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Progress Chart</Text>
          <Text style={styles.emptyText}>No history data yet</Text>
          <Text style={styles.emptySubtext}>Complete scans to track your progress</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            textStyle={styles.backButtonText}
          >
            Go Back
          </Button>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Body Fat Progress</Text>
        <Text style={styles.headerSubtitle}>
          {bodyFatHistory.length} {bodyFatHistory.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
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
                r={6}
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
      </View>

      {/* History List */}
      <View style={styles.historyList}>
        <Text style={styles.historyTitle}>History</Text>
        {chartData.sorted.map((entry, index) => {
          const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
            const scale = dragX.interpolate({
              inputRange: [-100, 0],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            });

            return (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    'Delete Entry',
                    'Are you sure you want to delete this entry?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => swipeableRefs.current[entry.date]?.close(),
                      },
                      {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                          removeBodyFatHistory(entry.date);
                          swipeableRefs.current[entry.date]?.close();
                        },
                      },
                    ]
                  );
                }}
              >
                <Animated.Text style={[styles.deleteButtonText, { transform: [{ scale }] }]}>
                  Delete
                </Animated.Text>
              </TouchableOpacity>
            );
          };

          return (
            <Swipeable
              key={entry.date}
              ref={(ref) => {
                swipeableRefs.current[entry.date] = ref;
              }}
              renderRightActions={renderRightActions}
              friction={2}
              leftThreshold={40}
              rightThreshold={40}
            >
              <View style={styles.historyItem}>
                <View style={styles.historyItemLeft}>
                  <Text style={styles.historyDate}>
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                  {entry.weight && (
                    <Text style={styles.historyWeight}>
                      Weight: {entry.weight} lbs
                    </Text>
                  )}
                </View>
                <Text style={styles.historyValue}>
                  {entry.bodyFatPercentage.toFixed(1)}%
                </Text>
              </View>
            </Swipeable>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        >
          Back
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginTop: 40,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  chartWrapper: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
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
  historyList: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteButton: {
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  deleteButtonText: {
    color: colors.surface,
    fontWeight: '600',
    fontSize: 14,
    paddingHorizontal: 16,
  },
  historyItemLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  historyWeight: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  historyValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.accent,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginTop: 8,
    backgroundColor: colors.accent,
  },
  backButtonText: {
    color: colors.surface,
  },
});

