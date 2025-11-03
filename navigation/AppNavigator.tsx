import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import SurveyScreen from '../screens/SurveyScreen';
import CameraScreen from '../screens/CameraScreen';
import LoadingScreen from '../screens/LoadingScreen';
import PaywallScreen from '../screens/PaywallScreen';
import ResultsScreen from '../screens/ResultsScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';

export type RootStackParamList = {
  Survey: undefined;
  Camera: undefined;
  Loading: undefined;
  Paywall: undefined;
  Results: undefined;
  PrivacyPolicy: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Survey"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Survey" component={SurveyScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
