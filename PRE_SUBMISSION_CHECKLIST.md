# 🎯 Pre-Submission Checklist - Prioritized

Your roadmap to App Store submission. Focus on these items in order.

---

## ✅ Already Complete

- ✅ Backend deployed and working
- ✅ All app screens implemented
- ✅ Privacy Policy written and updated
- ✅ Legal documents created (Terms, AI Disclosure, Medical Disclaimer, Photo Policy)
- ✅ Camera functionality
- ✅ Survey flow
- ✅ Results display

---

## 🚨 CRITICAL: Must Do First (Before Submission)

### 1. **Enable GitHub Pages for Privacy Policy** ⚠️ REQUIRED
**Status:** File ready, needs GitHub Pages enabled  
**Time:** 5 minutes  
**Priority:** HIGHEST

- [ ] Enable GitHub Pages in repository Settings → Pages
- [ ] Set source to `/docs` folder
- [ ] Verify URL works: https://harrysikes.github.io/ShredAIV2/
- [ ] Test URL opens in browser

**Why:** App Store requires a publicly accessible privacy policy URL.

---

### 2. **Apple Developer Account Setup** ⚠️ REQUIRED
**Status:** Needs setup  
**Time:** 30-60 minutes  
**Priority:** HIGHEST

- [ ] Sign up for Apple Developer Program ($99/year)
  - Go to: https://developer.apple.com/programs/
  - Complete enrollment
- [ ] Create App Store Connect account
  - Go to: https://appstoreconnect.apple.com/
  - Sign in with Apple Developer account
- [ ] Create new app in App Store Connect
  - Click "+" to create new app
  - Bundle ID: `com.shredai.v2`
  - App Name: "ShredAI"
- [ ] Set up App ID in Apple Developer Portal
  - Go to: https://developer.apple.com/account/resources/identifiers/list
  - Create App ID matching `com.shredai.v2`
  - Enable "In-App Purchase" capability

**Why:** Required to submit apps to the App Store.

---

### 3. **Create In-App Purchase Products** ⚠️ REQUIRED
**Status:** Currently mocked in app  
**Time:** 30 minutes  
**Priority:** HIGH

- [ ] In App Store Connect → Your App → Features → In-App Purchases
- [ ] Create subscription product 1:
  - Type: **Auto-Renewable Subscription**
  - Reference Name: "Monthly Subscription"
  - Product ID: `com.shredai.v2.monthly`
  - Price: $6.99/month
  - Subscription Group: Create new group
- [ ] Create subscription product 2:
  - Type: **Auto-Renewable Subscription**
  - Reference Name: "Yearly Subscription"
  - Product ID: `com.shredai.v2.yearly`
  - Price: $59.99/year
  - Same subscription group as monthly
- [ ] Add subscription information (screenshots, descriptions)
- [ ] Submit for review (these get reviewed separately)

**Note:** You can set up the products now, but you'll need to implement real purchase code later (see #8).

**Why:** App Store requires real subscription products for apps with subscriptions.

---

### 4. **Create App Screenshots** ⚠️ REQUIRED
**Status:** Not created  
**Time:** 2-3 hours  
**Priority:** HIGH

Required for each device size:
- [ ] iPhone 6.7" (iPhone 14 Pro Max): **6.5 screenshots required**
- [ ] iPhone 6.5" (iPhone 11 Pro Max): **6.5 screenshots required**
- [ ] iPhone 5.5" (iPhone 8 Plus): **5.5 screenshots required**

**How to create:**
1. Run app in iOS Simulator
2. Use appropriate device size
3. Take screenshots of each screen:
   - Survey screen
   - Camera screen
   - Loading screen
   - Paywall screen
   - Results screen
4. Use Simulator → Device → Screenshots or Cmd+S
5. Save images (they'll be at proper resolution)

**Why:** App Store requires screenshots for each device size.

---

### 5. **Verify App Icon** ⚠️ REQUIRED
**Status:** Need to verify  
**Time:** 5 minutes  
**Priority:** HIGH

- [ ] Verify `assets/icon.png` is exactly **1024x1024 pixels**
- [ ] Verify no transparency (solid background)
- [ ] Test that icon looks good at small sizes
- [ ] If needed, create new 1024x1024 icon

**Why:** App Store requires 1024x1024 icon.

---

### 6. **Complete App Store Connect Metadata** ⚠️ REQUIRED
**Status:** Needs completion  
**Time:** 1-2 hours  
**Priority:** HIGH

In App Store Connect → Your App → App Information:

- [ ] **App Name**: "ShredAI" (30 characters max)
- [ ] **Subtitle**: Short description (30 characters)
  - Example: "AI Body Composition Analysis"
- [ ] **Description**: (4000 characters max)
  ```
  ShredAI uses advanced AI to analyze your body composition and calculate body fat percentage from a simple photo. No expensive equipment needed - just your iPhone camera.
  
  Features:
  • AI-powered body composition analysis
  • Accurate body fat percentage calculation
  • Personalized workout plans
  • Progress tracking
  • Privacy-focused - your photos stay secure
  ```
- [ ] **Keywords**: fitness, body fat, workout, AI, health, body composition (100 characters max)
- [ ] **Category**: 
  - Primary: Health & Fitness
  - Secondary: Lifestyle
- [ ] **Support URL**: https://harrysikes.github.io/ShredAIV2/ (or your support email)
- [ ] **Privacy Policy URL**: https://harrysikes.github.io/ShredAIV2/
- [ ] **Marketing URL**: (Optional)
- [ ] **Age Rating**: Complete questionnaire (likely 4+)

**Why:** Required metadata for App Store listing.

---

## 🔧 IMPORTANT: Should Complete (Before Submission)

### 7. **Implement Real In-App Purchases** ⚠️ IMPORTANT
**Status:** Currently mocked (simulated)  
**Time:** 4-8 hours (development)  
**Priority:** HIGH

**Current Status:** Your `PaywallScreen.tsx` has mocked subscriptions. You need real implementation.

- [ ] Install/verify `expo-in-app-purchases` package
- [ ] Implement real purchase flow using Apple's StoreKit
- [ ] Handle purchase success/failure
- [ ] Implement "Restore Purchases" functionality
- [ ] Verify subscription status on app launch
- [ ] Test with Sandbox accounts (test accounts in App Store Connect)

**Code Changes Needed:**
- Replace mock `handleSubscribe` function in `PaywallScreen.tsx`
- Add StoreKit integration
- Add purchase verification
- Add restore purchases button

**Why:** App Store will reject if subscriptions don't actually work.

---

### 8. **Test on Physical Device** ⚠️ IMPORTANT
**Status:** Should test thoroughly  
**Time:** 2-3 hours  
**Priority:** HIGH

- [ ] Test on real iPhone (not just simulator)
- [ ] Test complete user flow:
  - [ ] Survey completion
  - [ ] Camera photo capture
  - [ ] API calls to backend
  - [ ] Loading states
  - [ ] Paywall display
  - [ ] Subscription purchase (once implemented)
  - [ ] Results display
- [ ] Test error scenarios:
  - [ ] No internet connection
  - [ ] Camera permission denied
  - [ ] API failures
  - [ ] Network timeout
- [ ] Test on iOS 15+ versions
- [ ] Fix any crashes or bugs found

**Why:** App Store reviewers test on real devices. Must work perfectly.

---

### 9. **Update app.json for Production** ⚠️ IMPORTANT
**Status:** May need updates  
**Time:** 10 minutes  
**Priority:** MEDIUM

- [ ] Verify bundle identifier: `com.shredai.v2`
- [ ] Set version: `1.0.0`
- [ ] Set build number: `1` (increment for each build)
- [ ] Verify app name: "ShredAI"
- [ ] Add encryption exemption if needed:
  ```json
  "config": {
    "usesNonExemptEncryption": false
  }
  ```

**Why:** Proper configuration required for App Store builds.

---

## 📋 RECOMMENDED: Should Complete (Better Experience)

### 10. **Error Handling & User Experience**
**Status:** Basic implementation  
**Time:** 2-4 hours  
**Priority:** MEDIUM

- [ ] Add loading indicators for all API calls
- [ ] Add error messages for failed requests
- [ ] Add retry logic for network failures
- [ ] Add offline detection
- [ ] Add success feedback for completed actions
- [ ] Validate all user inputs
- [ ] Add confirmation dialogs for critical actions

**Why:** Better user experience, fewer support issues.

---

### 11. **App Store Connect Submission Details**
**Status:** Needs preparation  
**Time:** 1 hour  
**Priority:** MEDIUM

- [ ] Prepare review notes (explain app functionality)
- [ ] Prepare demo account credentials (if needed)
- [ ] Answer export compliance questions
- [ ] Set pricing ($0.00 for free app, subscriptions are separate)
- [ ] Select countries/regions for availability
- [ ] Set availability date

**Why:** Smooth submission process.

---

### 12. **Production Build with EAS**
**Status:** Needs build  
**Time:** 30-60 minutes (build time varies)  
**Priority:** MEDIUM

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure: `eas build:configure`
- [ ] Build for App Store: `eas build --platform ios --profile production`
- [ ] Wait for build to complete
- [ ] Upload to App Store Connect (or use EAS Submit)

**Why:** Required for App Store submission.

---

## 🎯 Priority Order Summary

**Do These FIRST (Blocking):**
1. ✅ Enable GitHub Pages (5 min)
2. ⚠️ Apple Developer Account + App Store Connect Setup (1 hour)
3. ⚠️ Create In-App Purchase Products (30 min)
4. ⚠️ Create App Screenshots (2-3 hours)
5. ⚠️ Verify App Icon (5 min)
6. ⚠️ Complete App Store Connect Metadata (1-2 hours)

**Do These SECOND (Important):**
7. ⚠️ Implement Real In-App Purchases (4-8 hours)
8. ⚠️ Test on Physical Device (2-3 hours)
9. ⚠️ Update app.json (10 min)

**Do These THIRD (Recommended):**
10. Error Handling improvements (2-4 hours)
11. Submission details preparation (1 hour)
12. Production Build (30-60 min)

---

## ⏱️ Estimated Timeline

**Minimum Viable Submission (focusing on blocking items):**
- **Week 1:** Apple Developer setup, screenshots, metadata, GitHub Pages
- **Week 2:** In-app purchases implementation, testing, build
- **Total:** ~2 weeks

**Thorough Preparation (recommended):**
- **Week 1:** Apple Developer setup, screenshots, metadata
- **Week 2:** In-app purchases implementation, testing
- **Week 3:** Error handling, polish, final testing
- **Total:** ~3 weeks

---

## 🚨 Common Rejection Reasons to Avoid

1. **Missing Privacy Policy URL** - Make sure GitHub Pages is enabled ✅
2. **In-App Purchases Don't Work** - Must implement real purchases
3. **App Crashes** - Test thoroughly on physical device
4. **Missing Screenshots** - Required for each device size
5. **Broken Functionality** - All features must work
6. **Misleading Metadata** - Screenshots must match app

---

## 📞 Resources

- **Apple Developer Portal:** https://developer.apple.com/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Screenshot Requirements:** https://developer.apple.com/app-store/app-store-product-page/

---

## ✅ Quick Win Actions (Do Today)

1. Enable GitHub Pages (5 minutes)
2. Sign up for Apple Developer account (30 minutes)
3. Take first set of screenshots (1 hour)

---

**Next Step:** Start with #1 (GitHub Pages) - it's the quickest win! 🚀

