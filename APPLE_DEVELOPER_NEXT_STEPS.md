# 🍎 Apple Developer - Next Steps

You've enrolled in Apple Developer! Here's what to do next.

---

## ✅ Step 1: Check Enrollment Status

**If you just enrolled:**
- Approval can take **24-48 hours**
- Check status at: https://developer.apple.com/account/
- You'll receive an email when approved

**If already approved:**
- Proceed to Step 2!

---

## ✅ Step 2: Access App Store Connect

1. **Go to App Store Connect:**
   - https://appstoreconnect.apple.com/
   - Sign in with your **Apple Developer account** (same credentials)

2. **Accept Terms** (if prompted)
   - You may need to accept App Store Connect terms on first login

---

## ✅ Step 3: Create App ID in Developer Portal

**Before creating the app in App Store Connect, set up the App ID:**

1. **Go to Apple Developer Portal:**
   - https://developer.apple.com/account/resources/identifiers/list

2. **Click "+" to create new App ID**

3. **Fill in details:**
   - **Description:** ShredAI V2
   - **Bundle ID:** Select "Explicit" → Enter: `com.shredai.v2`
   - **Capabilities:** Check these:
     - ✅ In-App Purchase
     - ✅ Push Notifications (optional, but good to have)
   
4. **Click "Continue" → "Register"**

**Why:** App Store Connect needs this App ID to create your app.

---

## ✅ Step 4: Create App in App Store Connect

1. **In App Store Connect, click:**
   - **"My Apps"** (top left)
   - **"+"** button → **"New App"**

2. **Fill in App Information:**
   - **Platform:** iOS
   - **Name:** ShredAI (30 characters max)
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** Select `com.shredai.v2` (the one you just created)
   - **SKU:** `shredai-v2` (or any unique identifier)
   - **User Access:** Full Access (unless you have a team)

3. **Click "Create"**

**Note:** You can't change the Bundle ID or SKU after creation, so make sure they're correct!

---

## ✅ Step 5: Configure App Information

Once your app is created, you'll see the app dashboard. Configure these sections:

### 5.1 App Information
- **Name:** ShredAI
- **Subtitle:** (30 characters max) - e.g., "AI Body Composition Analysis"
- **Category:**
  - Primary: **Health & Fitness**
  - Secondary: **Lifestyle** (optional)
- **Privacy Policy URL:** https://harrysikes.github.io/ShredAIV2/
- **Support URL:** https://harrysikes.github.io/ShredAIV2/ (or your support email)

### 5.2 Pricing and Availability
- **Price:** Free (subscriptions are separate)
- **Availability:** All countries (or select specific ones)

### 5.3 App Privacy
- **Click "Get Started"** or **"Manage"**
- You'll need to answer questions about data collection:
  - ✅ Photos (for body composition analysis)
  - ✅ Health & Fitness data (survey responses)
  - ✅ Device ID
  - ✅ Usage data
- For each data type, specify:
  - How it's used (App Functionality, Analytics, etc.)
  - Whether it's linked to user identity
  - Whether it's used for tracking

---

## ✅ Step 6: Prepare for In-App Purchases

**You'll create the subscription products next, but first:**

1. **In App Store Connect → Your App → Features → In-App Purchases**
2. **You'll need to create a Subscription Group first**
3. **Then create your two subscription products**

**We'll do this in detail after you complete Steps 1-5!**

---

## 📋 Quick Checklist

- [ ] Apple Developer enrollment approved
- [ ] App Store Connect account accessible
- [ ] App ID created: `com.shredai.v2`
- [ ] In-App Purchase capability enabled
- [ ] App created in App Store Connect
- [ ] App Information configured
- [ ] Privacy Policy URL added
- [ ] App Privacy questions answered

---

## 🎯 What You Can Do Now

**If enrollment is pending:**
- Wait for approval email
- Start creating app screenshots (see PRE_SUBMISSION_CHECKLIST.md)
- Prepare app description and metadata

**If enrollment is approved:**
- Complete Steps 2-5 above
- Then move on to creating In-App Purchase products

---

## 🔗 Useful Links

- **Apple Developer Portal:** https://developer.apple.com/account/
- **App Store Connect:** https://appstoreconnect.apple.com/
- **App IDs:** https://developer.apple.com/account/resources/identifiers/list
- **Your Privacy Policy:** https://harrysikes.github.io/ShredAIV2/

---

## ⚠️ Important Notes

1. **Bundle ID:** `com.shredai.v2` - Make sure this matches your `app.json`
2. **App Name:** "ShredAI" - 30 characters max
3. **Privacy Policy URL:** Must be publicly accessible (GitHub Pages)
4. **In-App Purchases:** Must be set up before you can test subscriptions

---

**Next:** Once you've created the app in App Store Connect, we'll set up the In-App Purchase products! 🚀

