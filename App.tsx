import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AppNavigator from './navigation/AppNavigator';
import { useSurveyStore } from './state/supabaseStore';
import colors from './constants/colors';

export default function App() {
  const { initializeAuth, isAuthenticated, isLoading } = useSurveyStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize Supabase auth and load profile data
    console.log('[APP DEBUG] Initializing app...');
    const init = async () => {
      console.log('[APP DEBUG] Calling initializeAuth...');
      await initializeAuth();
      const authState = useSurveyStore.getState();
      console.log('[APP DEBUG] Auth initialized:', {
        isAuthenticated: authState.isAuthenticated,
        hasUser: !!authState.user,
        userId: authState.user?.id,
      });
      setInitializing(false);
      console.log('[APP DEBUG] App initialization complete');
    };
    init();
  }, []);

  if (initializing || isLoading) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <AppNavigator />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
