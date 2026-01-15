# 🎯 What's Left - Remaining Tasks

## ✅ What You've Completed

- ✅ Apple Developer enrollment (approved!)
- ✅ Privacy Policy created and updated
- ✅ Legal documents (Terms, AI Disclosure, Medical Disclaimer, Photo Policy)
- ✅ Privacy policy file ready for GitHub Pages
- ✅ App icon verified (1024x1024)
- ✅ Backend deployed and working
- ✅ All app screens implemented
- ✅ Email addresses unified (privacy@shredai.app)

---

## 🚨 CRITICAL - Must Complete Before Submission

### 1. **App Store Connect Setup** ⚠️ REQUIRED
**Status:** In Progress  
**Time:** 30-60 minutes  
**Priority:** HIGHEST

**Do This Now:**
- [ ] Create App ID: `com.shredai.v2` in Developer Portal
  - Go to: https://developer.apple.com/account/resources/identifiers/list
  - Enable "In-App Purchase" capability
- [ ] Create app in App Store Connect
  - Go to: https://appstoreconnect.apple.com/
  - Create new app with Bundle ID: `com.shredai.v2`
- [ ] Configure App Information
  - Privacy Policy URL: `https://harrysikes.github.io/ShredAIV2/`
  - Category: Health & Fitness
  - Answer App Privacy questions
- [ ] Verify GitHub Pages is enabled
  - Check: https://harrysikes.github.io/ShredAIV2/
  - If 404, enable in repo Settings → Pages

**See:** `APP_STORE_CONNECT_SETUP.md` for detailed steps

---

### 2. **Create In-App Purchase Products** ⚠️ REQUIRED
**Status:** Not Started  
**Time:** 30 minutes  
**Priority:** HIGH

**In App Store Connect → Your App → Features → In-App Purchases:**
- [ ] Create Subscription Group
- [ ] Create Monthly Subscription:
  - Product ID: `com.shredai.v2.monthly`
  - Price: $6.99/month
- [ ] Create Yearly Subscription:
  - Product ID: `com.shredai.v2.yearly`
  - Price: $59.99/year
- [ ] Add descriptions and screenshots for each
- [ ] Submit for review (reviewed separately from app)

**Note:** Products need to be created before you can implement real purchases in code.

---

### 3. **Create App Screenshots** ⚠️ REQUIRED
**Status:** Not Started  
**Time:** 2-3 hours  
**Priority:** HIGH

**Required for each device size:**
- [ ] iPhone 6.7" (iPhone 14 Pro Max): **6.5 screenshots**
- [ ] iPhone 6.5" (iPhone 11 Pro Max): **6.5 screenshots**
- [ ] iPhone 5.5" (iPhone 8 Plus): **5.5 screenshots**

**How to create:**
1. Run app in iOS Simulator
2. Select device size (iPhone 14 Pro Max, etc.)
3. Navigate through app and take screenshots:
   - Survey screen
   - Camera screen
   - Paywall screen
   - Results screen
   - (Add more as needed)
4. Use Cmd+S or Device → Screenshots
5. Screenshots saved at correct resolution automatically

**Why:** App Store requires screenshots for each device size.

---

### 4. **Complete App Store Connect Metadata** ⚠️ REQUIRED
**Status:** Not Started  
**Time:** 1-2 hours  
**Priority:** HIGH

**In App Store Connect → Your App → App Store:**

- [ ] **App Name:** `ShredAI` (already set)
- [ ] **Subtitle:** `AI Body Composition Analysis` (30 chars max)
- [ ] **Description:** (4000 characters max)
  ```
  ShredAI uses advanced AI to analyze your body composition and calculate body fat percentage from a simple photo. No expensive equipment needed - just your iPhone camera.
  
  Features:
  • AI-powered body composition analysis
  • Accurate body fat percentage calculation
  • Personalized workout plans
  • Progress tracking
  • Privacy-focused - your photos stay secure
  ```
- [ ] **Keywords:** `fitness, body fat, workout, AI, health, body composition` (100 chars max)
- [ ] **Category:** Health & Fitness (Primary), Lifestyle (Secondary)
- [ ] **Age Rating:** Complete questionnaire (likely 4+)
- [ ] **Support URL:** `https://harrysikes.github.io/ShredAIV2/`
- [ ] **Privacy Policy URL:** `https://harrysikes.github.io/ShredAIV2/`
- [ ] **Upload Screenshots** (from step 3 above)

---

### 5. **Implement Real In-App Purchases** ⚠️ REQUIRED
**Status:** Currently mocked  
**Time:** 4-8 hours (development)  
**Priority:** HIGH

**Current Status:** Your `PaywallScreen.tsx` has mocked subscriptions. Need real implementation.

**What to do:**
- [ ] Install/verify `expo-in-app-purchases` package
- [ ] Replace mock `handleSubscribe` function
- [ ] Implement real StoreKit purchase flow
- [ ] Handle purchase success/failure
- [ ] Add "Restore Purchases" functionality
- [ ] Verify subscription status on app launch
- [ ] Test with Sandbox test accounts

**Why:** App Store will reject if subscriptions don't actually work.

**File to update:** `screens/PaywallScreen.tsx`

---

### 6. **Test on Physical Device** ⚠️ REQUIRED
**Status:** Not Started  
**Time:** 2-3 hours  
**Priority:** HIGH

- [ ] Test complete user flow on real iPhone:
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

### 7. **Production Build** ⚠️ REQUIRED
**Status:** Not Started  
**Time:** 30-60 minutes (build time varies)  
**Priority:** MEDIUM

- [ ] Install EAS CLI: `npm install -g eas-cli`
- [ ] Login: `eas login`
- [ ] Configure: `eas build:configure`
- [ ] Build for App Store: `eas build --platform ios --profile production`
- [ ] Wait for build to complete
- [ ] Upload to App Store Connect (or use `eas submit`)

**Why:** Required for App Store submission.

---

## 📋 RECOMMENDED - Should Complete (Better Experience)

### 8. **Error Handling & User Experience**
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

---

### 9. **Update app.json for Production**
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

---

## 🎯 Priority Order Summary

**Do These FIRST (This Week):**
1. ⚠️ App Store Connect Setup (30-60 min)
2. ⚠️ Create In-App Purchase Products (30 min)
3. ⚠️ Create App Screenshots (2-3 hours)
4. ⚠️ Complete App Store Connect Metadata (1-2 hours)

**Do These SECOND (Next Week):**
5. ⚠️ Implement Real In-App Purchases (4-8 hours)
6. ⚠️ Test on Physical Device (2-3 hours)
7. ⚠️ Production Build (30-60 min)

**Do These THIRD (Polish):**
8. Error Handling improvements (2-4 hours)
9. Update app.json (10 min)

---

## ⏱️ Estimated Timeline

**Minimum Viable Submission:**
- **This Week:** App Store Connect setup, screenshots, metadata
- **Next Week:** In-app purchases, testing, build
- **Total:** ~2 weeks

**Thorough Preparation:**
- **Week 1:** App Store Connect setup, screenshots, metadata
- **Week 2:** In-app purchases implementation, testing
- **Week 3:** Error handling, polish, final testing
- **Total:** ~3 weeks

---

## 🚨 Common Rejection Reasons to Avoid

1. **Missing Privacy Policy URL** - Make sure GitHub Pages is enabled
2. **In-App Purchases Don't Work** - Must implement real purchases
3. **App Crashes** - Test thoroughly on physical device
4. **Missing Screenshots** - Required for each device size
5. **Broken Functionality** - All features must work
6. **Misleading Metadata** - Screenshots must match app

---

## 📞 Quick Reference

**Developer Portal:** https://developer.apple.com/account/  
**App Store Connect:** https://appstoreconnect.apple.com/  
**App IDs:** https://developer.apple.com/account/resources/identifiers/list  
**Privacy Policy:** https://harrysikes.github.io/ShredAIV2/

---

## ✅ Next Immediate Action

**Start with:** App Store Connect Setup
1. Create App ID in Developer Portal
2. Create app in App Store Connect
3. Configure basic app information

**Then:** Create screenshots (can do while waiting for other things)

**Then:** Create In-App Purchase products

---

**You're making great progress! Focus on the critical items first.** 🚀
