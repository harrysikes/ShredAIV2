import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSurveyStore } from '../state/supabaseStore';
import colors from '../constants/colors';

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { signIn, signUp, isLoading } = useSurveyStore();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Listen for keyboard show/hide to prevent layout shifts
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAuth = async () => {
    console.log('[AUTH SCREEN DEBUG] handleAuth called:', { isSignUp, email: email ? 'provided' : 'missing', hasPassword: !!password });
    
    if (!email || !password) {
      console.log('[AUTH SCREEN DEBUG] Validation failed: missing email or password');
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (isSignUp && !name) {
      console.log('[AUTH SCREEN DEBUG] Validation failed: missing name for signup');
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);
    console.log('[AUTH SCREEN DEBUG] Starting authentication...');
    try {
      let result: { error: Error | null; needsEmailConfirmation?: boolean };
      if (isSignUp) {
        console.log('[AUTH SCREEN DEBUG] Calling signUp...');
        result = await signUp(email, password, name);
      } else {
        console.log('[AUTH SCREEN DEBUG] Calling signIn...');
        result = await signIn(email, password);
      }

      console.log('[AUTH SCREEN DEBUG] Auth result:', {
        hasError: !!result.error,
        errorMessage: result.error?.message,
        needsEmailConfirmation: result.needsEmailConfirmation,
      });

      if (result.error) {
        let errorMessage = result.error.message || 'Authentication failed';
        
        // Handle email confirmation requirement (only for sign-up)
        if (isSignUp && (result.needsEmailConfirmation || errorMessage === 'EMAIL_CONFIRMATION_REQUIRED')) {
          Alert.alert(
            'Check Your Email',
            'We sent you a confirmation email. Please check your inbox and click the confirmation link to activate your account. After confirming, you can sign in.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Switch to sign-in mode after alert
                  setIsSignUp(false);
                },
              },
            ]
          );
          return; // Don't show generic error
        }
        
        // Provide more helpful error messages
        if (errorMessage.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else if (errorMessage.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (errorMessage.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        }
        
        console.log('[AUTH SCREEN DEBUG] Showing error alert:', errorMessage);
        Alert.alert('Authentication Error', errorMessage);
      } else {
        console.log('[AUTH SCREEN DEBUG] Auth successful, checking state before navigation...');
        const { isAuthenticated, user } = useSurveyStore.getState();
        console.log('[AUTH SCREEN DEBUG] Current auth state:', {
          isAuthenticated,
          hasUser: !!user,
          userId: user?.id,
        });
        
        // Don't manually navigate - let AppNavigator handle it based on auth state
        // The onAuthStateChange listener in initializeAuth will trigger navigation
        // This prevents race conditions between manual navigation and AppNavigator redirects
        console.log('[AUTH SCREEN DEBUG] Auth successful - AppNavigator will handle navigation via auth state change');
      }
    } catch (error: any) {
      console.error('[AUTH SCREEN DEBUG] Exception in handleAuth:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      console.log('[AUTH SCREEN DEBUG] handleAuth completed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            keyboardVisible && styles.scrollContentKeyboardVisible
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
          <Text style={styles.title}>ShredAI</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </Text>

          {isSignUp && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  // Focus next input if needed
                }}
              />
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => {
                // Focus password input if needed
              }}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete={isSignUp ? 'password-new' : 'password'}
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={handleAuth}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              Keyboard.dismiss();
              setIsSignUp(!isSignUp);
            }}
          >
            <Text style={styles.switchText}>
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  scrollContentKeyboardVisible: {
    paddingTop: 40, // Reduce top padding when keyboard is visible
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
  },
  switchButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
});
