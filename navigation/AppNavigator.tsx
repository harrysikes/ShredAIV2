import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from '../screens/HomeScreen';
import SurveyScreen from '../screens/SurveyScreen';
import CameraInstructionsScreen from '../screens/CameraInstructionsScreen';
import CameraScreen from '../screens/CameraScreen';
import LoadingScreen from '../screens/LoadingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import BodyFatHistoryScreen from '../screens/BodyFatHistoryScreen';
import WorkoutPlanScreen from '../screens/WorkoutPlanScreen';
import WeeklyChallengeScreen from '../screens/WeeklyChallengeScreen';
import AuthScreen from '../screens/AuthScreen';
import { useSurveyStore } from '../state/supabaseStore';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Survey: undefined;
  CameraInstructions: undefined;
  Camera: undefined;
  Loading: undefined;
  Paywall: undefined;
  Results: undefined;
  PrivacyPolicy: undefined;
  BodyFatHistory: undefined;
  WorkoutPlan: undefined;
  WeeklyChallenge: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useSurveyStore();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();

  // Handle auth state changes and navigate accordingly
  useEffect(() => {
    if (!navigationRef.isReady()) return;

    const currentRoute = navigationRef.getCurrentRoute();
    // Screens that require authentication (excluding scan flow screens)
    const protectedRoutes = ['Home', 'Survey', 'CameraInstructions', 'Camera', 'BodyFatHistory', 'WorkoutPlan', 'WeeklyChallenge'];
    // Scan flow screens that can be accessed without auth (but will need auth to save data)
    const scanFlowScreens = ['Loading', 'Results', 'Paywall'];
    const isOnProtectedRoute = currentRoute && protectedRoutes.includes(currentRoute.name);
    const isOnScanFlowScreen = currentRoute && scanFlowScreens.includes(currentRoute.name);

    if (!isAuthenticated) {
      // Only redirect to Auth if we're on a protected route (not already on Auth or scan flow screens)
      // Allow scan flow to continue even without auth (data just won't be saved)
      if (currentRoute?.name !== 'Auth' && isOnProtectedRoute && !isOnScanFlowScreen) {
        navigationRef.navigate('Auth');
      }
    } else {
      // If authenticated and currently on Auth screen, navigate to Home
      if (currentRoute?.name === 'Auth') {
        navigationRef.navigate('Home');
      }
    }
  }, [isAuthenticated, navigationRef]);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Auth"}
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, next, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                  {
                    scale: current.progress.interpolate({
                      inputRange: [0, 0.5, 1],
                      outputRange: [0.95, 0.97, 1],
                    }),
                  },
                ],
                opacity: current.progress.interpolate({
                  inputRange: [0, 0.5, 0.9, 1],
                  outputRange: [0, 0.5, 0.9, 1],
                }),
              },
              overlayStyle: {
                opacity: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.5],
                }),
              },
            };
          },
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
          },
        }}
      >
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Survey" component={SurveyScreen} />
        <Stack.Screen name="CameraInstructions" component={CameraInstructionsScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="BodyFatHistory" component={BodyFatHistoryScreen} />
        <Stack.Screen name="WorkoutPlan" component={WorkoutPlanScreen} />
        <Stack.Screen name="WeeklyChallenge" component={WeeklyChallengeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
