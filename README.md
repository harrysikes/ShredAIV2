# ShredzAI

A React Native iOS app that calculates body fat percentage using AI-powered image analysis combined with user survey data.

## Features

- **Survey Flow**: Collects user data (sex, age, height, weight, exercise frequency, goals)
- **AI Camera Analysis**: Takes photos with countdown timer for body composition analysis
- **Body Fat Calculation**: Combines survey data with AI image analysis (50/50 weight)
- **Personalized Workout Plans**: Generates custom routines based on user preferences
- **Subscription Model**: Paywall with monthly/yearly plans
- **Modern UI**: Clean, minimalist design with bone background (#E3DAC9)

## Tech Stack

- **React Native** with TypeScript
- **Expo** for development and building
- **React Navigation** for screen navigation
- **Zustand** for state management
- **Expo Camera** for photo capture
- **Expo In-App Purchases** for subscriptions

## Prerequisites

- macOS (required for iOS development)
- Xcode 15+ installed
- iOS Simulator or physical iOS device
- Node.js 18+ and npm
- Expo CLI

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ShredAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g @expo/cli
   ```

## Development

1. **Start the development server**
   ```bash
   npm start
   ```

2. **Run on iOS Simulator**
   ```bash
   npm run ios
   ```

3. **Run on physical iOS device**
   - Install Expo Go app from App Store
   - Scan QR code from terminal
   - Or use `expo start --tunnel` for network access

## Project Structure

```
src/
├── api/                    # API services
│   ├── bodyFatApi.ts      # Body fat calculation
│   └── workoutPlanGenerator.ts # Workout plan generation
├── components/             # Reusable components
│   └── ProgressBar.tsx    # Survey progress indicator
├── navigation/             # Navigation setup
│   └── AppNavigator.tsx   # Main navigation structure
├── screens/                # App screens
│   ├── SurveyScreen.tsx   # Survey flow
│   ├── CameraScreen.tsx   # Photo capture
│   ├── LoadingScreen.tsx  # AI analysis loading
│   ├── PaywallScreen.tsx  # Subscription options
│   └── ResultsScreen.tsx  # Results display
└── state/                  # State management
    └── surveyStore.ts     # Zustand store
```

## App Flow

1. **Survey Screen**: 6-step questionnaire with smooth transitions
2. **Camera Screen**: Photo capture with 5-second countdown
3. **Loading Screen**: AI analysis simulation (~3 seconds)
4. **Paywall Screen**: Subscription options ($6.99/month, $59.99/year)
5. **Results Screen**: Body fat percentage + workout plan (if subscribed)

## Key Components

### Survey Flow
- Animated progress bar
- Step-by-step data collection
- Smooth transitions between questions
- Form validation

### Camera Integration
- Front/back camera switching
- Countdown timer before capture
- Permission handling
- Image processing

### AI Analysis
- Mock API implementation
- Survey + image data combination
- Realistic body fat estimates
- Confidence scoring

### Workout Plans
- Goal-based routine generation
- Equipment considerations
- Progressive overload principles
- Rest period recommendations

## Styling

- **Primary Background**: Bone (#E3DAC9)
- **Primary Text**: Black (#000000)
- **Camera Text**: White (#FFFFFF)
- **Accent Colors**: Various for UI elements
- **Typography**: System fonts with custom weights
- **Spacing**: Consistent 8px grid system

## Configuration

### iOS Permissions
- Camera access for body composition photos
- Photo library access for saving images

### App Configuration
- iOS-only (Android disabled)
- Portrait orientation
- No tablet support
- Custom bundle identifier

## Building for Production

1. **Configure app.json** with your app details
2. **Build for iOS**
   ```bash
   expo build:ios
   ```
3. **Submit to App Store** using Xcode or App Store Connect

## Mock Features

- **AI Analysis**: Simulated with realistic algorithms
- **In-App Purchases**: Mock subscription flow
- **Image Processing**: Base64 encoding simulation
- **API Calls**: Local mock implementations

## Future Enhancements

- Real AI/ML integration for body composition
- Actual in-app purchase implementation
- User accounts and data persistence
- Progress tracking and analytics
- Social sharing features
- Advanced workout customization

## Troubleshooting

### Common Issues

1. **Camera permissions denied**
   - Check iOS Settings > Privacy > Camera
   - Ensure proper permission descriptions in app.json

2. **Build errors**
   - Clear Expo cache: `expo start -c`
   - Update dependencies: `npm update`
   - Check Xcode version compatibility

3. **Navigation issues**
   - Verify React Navigation installation
   - Check screen component exports

### Development Tips

- Use iOS Simulator for faster development
- Enable "Debug Remote JS" in Expo Dev Tools
- Monitor console logs for API responses
- Test on physical device for camera functionality

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes with proper TypeScript types
4. Test on iOS simulator/device
5. Submit pull request

## License

Private project - All rights reserved

## Support

For technical support or questions, please refer to the project documentation or create an issue in the repository.
