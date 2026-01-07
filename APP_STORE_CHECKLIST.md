# 📱 App Store Submission Checklist

## ✅ What You Have

- ✅ Backend deployed and working
- ✅ React Native app with all screens
- ✅ Camera functionality
- ✅ Survey flow
- ✅ Paywall screen
- ✅ Results display
- ✅ Basic app.json configuration
- ✅ Bundle identifier: `com.shredai.v2`

---

## 🚨 Critical: Must Complete Before Submission

### 1. **App Store Connect Setup**
- [ ] Create Apple Developer account ($99/year)
- [ ] Create App Store Connect record
- [ ] Set up App ID in Apple Developer Portal
- [ ] Configure bundle identifier matching `com.shredai.v2`
- [ ] Enable In-App Purchases capability
- [ ] Configure App Store Connect metadata

### 2. **App Icons & Assets** (Required)
- [ ] **App Icon**: 1024x1024px PNG (no transparency)
  - Current: `assets/icon.png` - verify it's 1024x1024
- [ ] **Splash Screen**: Already configured ✅
- [ ] **App Screenshots** (Required for each device size):
  - iPhone 6.7" (iPhone 14 Pro Max): 6.5 required
  - iPhone 6.5" (iPhone 11 Pro Max): 6.5 required
  - iPhone 5.5" (iPhone 8 Plus): 5.5 required
  - [Screenshot specs](https://developer.apple.com/app-store/app-store-product-page/)

### 3. **App Store Listing Content**
- [ ] **App Name**: "ShredAI" (30 characters max)
- [ ] **Subtitle**: Short description (30 characters)
- [ ] **Description**: 
  ```
  ShredAI uses advanced AI to analyze your body composition and calculate body fat percentage from a simple photo. No expensive equipment needed - just your iPhone camera.
  
  Features:
  • AI-powered body composition analysis
  • Accurate body fat percentage calculation
  • Personalized workout plans
  • Progress tracking
  • Privacy-focused - your photos stay secure
  ```
- [ ] **Keywords**: fitness, body fat, workout, AI, health, body composition
- [ ] **Category**: Health & Fitness (Primary), Lifestyle (Secondary)
- [ ] **Age Rating**: Complete questionnaire (likely 4+)
- [ ] **Support URL**: Your website or support email
- [ ] **Marketing URL**: (Optional) Landing page

### 4. **Privacy & Legal** (Required)
- [ ] **Privacy Policy URL**: Required for apps that collect data
  - Must explain what data you collect (photos, survey data)
  - How you use it (AI analysis)
  - Where it's stored (AWS S3)
  - Third-party services (OpenAI, AWS)
- [ ] **Terms of Service**: (Recommended)
- [ ] **Privacy Policy** must be accessible before user submits data

### 5. **In-App Purchases Setup**
- [ ] Create subscription products in App Store Connect:
  - Monthly: `com.shredai.v2.monthly` ($6.99)
  - Yearly: `com.shredai.v2.yearly` ($59.99)
- [ ] Implement actual subscription verification
- [ ] Handle subscription status changes
- [ ] Test purchases with Sandbox accounts
- [ ] Add restore purchases functionality

### 6. **Production Build**
- [ ] **Update app.json** with production details:
  ```json
  {
    "expo": {
      "name": "ShredAI",
      "slug": "shredai",
      "version": "1.0.0",
      "ios": {
        "bundleIdentifier": "com.shredai.v2",
        "buildNumber": "1",
        "supportsTablet": false,
        "requireFullScreen": true,
        "config": {
          "usesNonExemptEncryption": false
        }
      }
    }
  }
  ```
- [ ] Build production IPA:
  ```bash
  eas build --platform ios --profile production
  ```
- [ ] Or use Expo Application Services (EAS)

### 7. **Testing & Quality Assurance**
- [ ] Test on physical iPhone (not just simulator)
- [ ] Test complete user flow:
  - [ ] Survey completion
  - [ ] Photo capture
  - [ ] API calls to backend
  - [ ] Loading states
  - [ ] Error handling
  - [ ] Paywall display
  - [ ] Subscription purchase
  - [ ] Results display
- [ ] Test error scenarios:
  - [ ] No internet connection
  - [ ] API failures
  - [ ] Camera permission denied
  - [ ] Invalid photo format
- [ ] Test on multiple iOS versions (iOS 15+)
- [ ] Test on different iPhone models

### 8. **Error Handling & User Experience**
- [ ] Add loading indicators for all API calls
- [ ] Add error messages for failed requests
- [ ] Add retry logic for network failures
- [ ] Add offline detection
- [ ] Validate all user inputs
- [ ] Add confirmation dialogs for critical actions
- [ ] Add success feedback for completed actions

### 9. **Security & Privacy**
- [ ] Verify camera permissions are properly requested
- [ ] Verify photo library permissions are properly requested
- [ ] Ensure photos are securely uploaded to S3
- [ ] Add data encryption for sensitive data
- [ ] Implement proper session management
- [ ] Add rate limiting handling in app

### 10. **App Store Guidelines Compliance**
- [ ] **Guideline 2.1**: App Completeness
  - All features must work
  - No placeholder content
  - No broken links
- [ ] **Guideline 5.1.1**: Privacy
  - Privacy policy required
  - Data collection disclosed
  - User consent obtained
- [ ] **Guideline 3.1.1**: In-App Purchase
  - Proper subscription implementation
  - Clear pricing
  - Terms displayed
- [ ] **Guideline 2.3**: Accurate Metadata
  - Screenshots must show actual app
  - Description must be accurate
- [ ] **Guideline 4.0**: Design
  - Professional appearance
  - No crashes
  - Smooth performance

---

## 🔧 Technical Improvements Needed

### 1. **Update API Configuration**
```typescript
// api/config.ts - Make sure production URL is correct
export const API_CONFIG = {
  production: {
    baseURL: 'https://backend-3qcj507t8-harry-sikes-projects.vercel.app',
  }
};
```

### 2. **Add Error Monitoring**
- [ ] Integrate Sentry or similar for crash reporting
- [ ] Add analytics (Firebase Analytics, Mixpanel, etc.)
- [ ] Log API errors for debugging

### 3. **Add Loading States**
- [ ] Verify all API calls show loading indicators
- [ ] Add skeleton screens for better UX
- [ ] Prevent double submissions

### 4. **Optimize Performance**
- [ ] Image compression before upload
- [ ] Lazy loading for screens
- [ ] Optimize bundle size
- [ ] Cache API responses where appropriate

### 5. **Add Accessibility**
- [ ] VoiceOver support
- [ ] Dynamic Type support
- [ ] Color contrast compliance
- [ ] Touch target sizes (min 44x44)

---

## 📋 App Store Connect Metadata Checklist

### Required Information:
- [ ] App name (max 30 characters)
- [ ] Subtitle (max 30 characters)
- [ ] Description (max 4000 characters)
- [ ] Keywords (max 100 characters)
- [ ] Support URL
- [ ] Marketing URL (optional)
- [ ] Privacy Policy URL
- [ ] Category
- [ ] Age rating
- [ ] App icon (1024x1024)
- [ ] Screenshots (required for each device size)
- [ ] App preview video (optional but recommended)

### Pricing & Availability:
- [ ] Set price ($0.00 for free, or paid)
- [ ] Select countries/regions
- [ ] Set availability date

---

## 🚀 Submission Process

### Step 1: Prepare Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build for App Store
eas build --platform ios --profile production
```

### Step 2: Upload to App Store Connect
- [ ] Upload IPA through App Store Connect or EAS Submit
- [ ] Wait for processing (15-30 minutes)

### Step 3: Complete App Store Connect Form
- [ ] Fill in all metadata
- [ ] Upload screenshots
- [ ] Set pricing
- [ ] Add review notes (if needed)

### Step 4: Submit for Review
- [ ] Answer all export compliance questions
- [ ] Submit for review
- [ ] Wait 24-48 hours for review

---

## ⚠️ Common Rejection Reasons

1. **App Crashes**: Test thoroughly on physical devices
2. **Missing Privacy Policy**: Required for data collection
3. **Broken Functionality**: All features must work
4. **Misleading Metadata**: Screenshots must match app
5. **Incomplete In-App Purchases**: Must work correctly
6. **Guideline Violations**: Review all guidelines

---

## 📝 Quick Wins (Do These First)

1. **Create Privacy Policy** (1-2 hours)
   - Use a template service or write your own
   - Host on GitHub Pages or your website
   - Add link to app settings

2. **Take Screenshots** (2-3 hours)
   - Use iPhone simulator or device
   - Create screenshots for all required sizes
   - Edit to look professional

3. **Test Complete Flow** (1-2 hours)
   - Go through entire app on physical device
   - Fix any bugs you find
   - Verify API calls work

4. **Write App Description** (30 minutes)
   - Be clear about what the app does
   - Highlight key features
   - Use keywords naturally

---

## 🎯 Estimated Timeline

- **Quick Path** (if everything works): 1-2 weeks
  - Setup: 2-3 days
  - Testing: 2-3 days
  - Assets: 1-2 days
  - Submission: 1 day
  - Review: 1-2 days

- **Thorough Path** (recommended): 2-4 weeks
  - Setup: 3-5 days
  - Testing & fixes: 5-7 days
  - Assets & content: 3-5 days
  - Submission: 1-2 days
  - Review: 1-3 days

---

## 💡 Recommendations

1. **Start with TestFlight** - Get beta testers first
2. **Use EAS Build** - Easier than manual builds
3. **Create a simple website** - For privacy policy and support
4. **Set up analytics** - Track usage before launch
5. **Prepare marketing** - Screenshots, description, etc.

---

## 🔗 Useful Links

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Apple Developer Portal](https://developer.apple.com/)
- [App Store Screenshot Requirements](https://developer.apple.com/app-store/app-store-product-page/)

---

**Your app is close! Focus on:**
1. Privacy Policy ⚠️ (REQUIRED)
2. App Store assets (screenshots, icons)
3. Thorough testing
4. In-app purchase setup

Good luck! 🚀


