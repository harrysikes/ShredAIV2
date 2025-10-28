// API Configuration
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:3000',
    timeout: 30000,
  },
  // Production (Vercel)
  production: {
    baseURL: 'https://backend-q8gcefib5-harry-sikes-projects.vercel.app',
    timeout: 30000,
  }
};

// Get current environment
export const getApiConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG[env as keyof typeof API_CONFIG] || API_CONFIG.development;
};

// API Endpoints
export const API_ENDPOINTS = {
  // Body Analysis
  bodyAnalysis: '/api/body-analysis/analyze',
  
  // Workout Plans
  workoutPlans: {
    generate: '/api/workouts/generate',
    get: (planId: string) => `/api/workouts/${planId}`,
    updateProgress: (planId: string) => `/api/workouts/${planId}/progress`,
  },
  
  // User Management
  users: {
    register: '/api/users/register',
    login: '/api/users/login',
    profile: '/api/users/profile',
    updateProfile: '/api/users/profile',
    survey: '/api/users/survey',
    progress: '/api/users/progress',
    updateProgress: '/api/users/progress',
    changePassword: '/api/users/password',
    deleteAccount: '/api/users/account',
  },
  
  // Health Check
  health: '/health',
};

// API Headers
export const getApiHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Unauthorized. Please log in again.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unknown error occurred.',
};

// Success Messages
export const API_SUCCESS_MESSAGES = {
  ANALYSIS_COMPLETE: 'Body analysis completed successfully!',
  WORKOUT_GENERATED: 'Workout plan generated successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PROGRESS_SAVED: 'Progress saved successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful!',
};
