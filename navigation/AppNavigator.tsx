import React, { useEffect, useRef } from 'react';
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

// Scan flow screens that can be accessed without auth (NEVER redirect from these)
const SCAN_FLOW_SCREENS = ['Loading', 'Results', 'Paywall', 'Camera'];
// Screens that require authentication (excluding scan flow screens)
const PROTECTED_ROUTES = ['Home', 'Survey', 'CameraInstructions', 'BodyFatHistory', 'WorkoutPlan', 'WeeklyChallenge'];

function isScanFlowScreen(routeName: string | undefined): boolean {
  return routeName ? SCAN_FLOW_SCREENS.includes(routeName) : false;
}

function isProtectedRoute(routeName: string | undefined): boolean {
  return routeName ? PROTECTED_ROUTES.includes(routeName) : false;
}

export default function AppNavigator() {
  const { isAuthenticated, user } = useSurveyStore();
  const navigationRef = useNavigationContainerRef<RootStackParamList>();
  const isNavigatingRef = useRef(false);
  const lastCheckedRouteRef = useRef<string | null>(null);

  console.log('[NAV DEBUG] AppNavigator render:', {
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id,
  });

  // Handle auth state changes and navigate accordingly
  useEffect(() => {
    console.log('[NAV DEBUG] useEffect triggered:', { isAuthenticated });
    if (!navigationRef.isReady()) {
      console.log('[NAV DEBUG] Navigation not ready yet');
      return;
    }

    const currentRoute = navigationRef.getCurrentRoute();
    const currentRouteName = currentRoute?.name || null;

    console.log('[NAV DEBUG] Current route check:', {
      currentRoute: currentRouteName,
      isScanFlow: isScanFlowScreen(currentRouteName || undefined),
    });

    // NEVER redirect if we're on a scan flow screen - allow the flow to complete
    // This check happens FIRST before any other logic
    if (isScanFlowScreen(currentRouteName || undefined)) {
      console.log('[NAV DEBUG] On scan flow screen, skipping redirect');
      // Completely skip auth redirect logic for scan flow screens
      return;
    }

    // Don't check the same route twice in a row (prevents unnecessary checks)
    if (currentRouteName === lastCheckedRouteRef.current) {
      console.log('[NAV DEBUG] Same route as last check, skipping');
      return;
    }
    lastCheckedRouteRef.current = currentRouteName;

    // Add a delay to ensure navigation has fully completed
    const timeoutId = setTimeout(() => {
      // Double-check we're still not on a scan flow screen
      const route = navigationRef.getCurrentRoute();
      const routeName = route?.name;
      const authStateAfterDelay = useSurveyStore.getState();
      
      console.log('[NAV DEBUG] After delay check:', {
        routeName,
        isAuthenticated: authStateAfterDelay.isAuthenticated,
        hasUser: !!authStateAfterDelay.user,
        isScanFlow: isScanFlowScreen(routeName || undefined),
      });
      
      if (isScanFlowScreen(routeName || undefined)) {
        console.log('[NAV DEBUG] Still on scan flow, don\'t redirect');
        return; // Still on scan flow, don't redirect
      }

      if (!authStateAfterDelay.isAuthenticated) {
        // Only redirect to Auth if we're on a protected route (not already on Auth)
        if (routeName !== 'Auth' && isProtectedRoute(routeName || undefined)) {
          console.log('[NAV DEBUG] Not authenticated, redirecting to Auth from:', routeName);
          navigationRef.navigate('Auth');
        }
      } else {
        // If authenticated and currently on Auth screen, navigate to Home
        if (routeName === 'Auth') {
          console.log('[NAV DEBUG] Authenticated but on Auth screen, redirecting to Home');
          navigationRef.navigate('Home');
        }
      }
    }, 500); // Longer delay to ensure navigation completes

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, navigationRef]);

  // Also listen to navigation state changes to check route
  const handleStateChange = () => {
    if (!navigationRef.isReady()) {
      console.log('[NAV DEBUG] handleStateChange: Navigation not ready');
      return;
    }
    
    const currentRoute = navigationRef.getCurrentRoute();
    const currentRouteName = currentRoute?.name || null;
    const authState = useSurveyStore.getState();

    console.log('[NAV DEBUG] handleStateChange:', {
      currentRoute: currentRouteName,
      isAuthenticated: authState.isAuthenticated,
      hasUser: !!authState.user,
      isScanFlow: isScanFlowScreen(currentRouteName || undefined),
    });

    // NEVER redirect if we're on a scan flow screen
    if (isScanFlowScreen(currentRouteName || undefined)) {
      console.log('[NAV DEBUG] handleStateChange: On scan flow, skipping');
      lastCheckedRouteRef.current = currentRouteName;
      return;
    }

    // Small delay to ensure navigation completed
    setTimeout(() => {
      const route = navigationRef.getCurrentRoute();
      const routeName = route?.name;
      const authStateAfterDelay = useSurveyStore.getState();
      
      console.log('[NAV DEBUG] handleStateChange after delay:', {
        routeName,
        isAuthenticated: authStateAfterDelay.isAuthenticated,
        hasUser: !!authStateAfterDelay.user,
        isScanFlow: isScanFlowScreen(routeName || undefined),
      });
      
      // Double-check we're still not on a scan flow screen
      if (isScanFlowScreen(routeName || undefined)) {
        console.log('[NAV DEBUG] handleStateChange: Still on scan flow');
        return;
      }

      // Only redirect if auth state has actually changed AND we're not in scan flow
      if (!authStateAfterDelay.isAuthenticated) {
        if (routeName !== 'Auth' && isProtectedRoute(routeName || undefined)) {
          console.log('[NAV DEBUG] handleStateChange: Redirecting to Auth from:', routeName);
          // Only navigate if we're not already navigating
          const currentRoute = navigationRef.getCurrentRoute();
          if (currentRoute?.name !== 'Auth') {
            navigationRef.navigate('Auth');
          }
        }
      } else {
        if (routeName === 'Auth') {
          console.log('[NAV DEBUG] handleStateChange: Redirecting to Home from Auth');
          navigationRef.navigate('Home');
        }
      }
    }, 500);
  };

  return (
    <NavigationContainer ref={navigationRef} onStateChange={handleStateChange}>
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
