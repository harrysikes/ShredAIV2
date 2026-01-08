import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import { useSurveyStore } from './state/surveyStore';

export default function App() {
  const { loadProfileData } = useSurveyStore();

  useEffect(() => {
    // Load saved profile data when app starts
    loadProfileData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}
