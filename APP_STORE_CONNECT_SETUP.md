# 🍎 App Store Connect Setup - Step-by-Step Guide

You're approved! Let's set up your app in App Store Connect.

---

## ✅ Step 1: Create App ID (Required First)

**Before creating your app in App Store Connect, you need to create the App ID.**

### 1.1 Go to Developer Portal
Visit: https://developer.apple.com/account/resources/identifiers/list

### 1.2 Create New App ID
1. Click the **"+"** button (top left)
2. Select **"App IDs"** → Click **"Continue"**

### 1.3 Fill in App ID Details
- **Description:** `ShredAI V2` (or any description you like)
- **Bundle ID:** 
  - Select **"Explicit"**
  - Enter exactly: `com.shredai.v2`
  - ⚠️ This must match your `app.json` bundle identifier!

### 1.4 Enable Capabilities
Check these capabilities:
- ✅ **In-App Purchase** (REQUIRED for subscriptions)
- ✅ **Push Notifications** (optional, but recommended)
- ❌ Leave others unchecked unless needed

### 1.5 Register
- Click **"Continue"**
- Review your settings
- Click **"Register"**
- ✅ You should see "Registration Complete"

**Important:** You'll use this App ID (`com.shredai.v2`) when creating your app in App Store Connect.

---

## ✅ Step 2: Access App Store Connect

1. **Go to:** https://appstoreconnect.apple.com/
2. **Sign in** with your Apple Developer account credentials
3. **Accept Terms** (if prompted on first login)

---

## ✅ Step 3: Create Your App in App Store Connect

### 3.1 Navigate to Apps
1. Click **"My Apps"** (top left sidebar)
2. Click the **"+"** button → Select **"New App"**

### 3.2 Fill in App Information

**Platform:** 
- Select **iOS**

**Name:**
- Enter: `ShredAI`
- ⚠️ Maximum 30 characters

**Primary Language:**
- Select **English (U.S.)**

**Bundle ID:**
- Click dropdown → Select `com.shredai.v2`
- ⚠️ This should appear if you created the App ID correctly
- If it doesn't appear, wait 5-10 minutes and refresh

**SKU:**
- Enter: `shredai-v2` (or any unique identifier)
- This is just an internal identifier, not visible to users
- Must be unique to your account

**User Access:**
- Select **"Full Access"** (unless you have a team setup)

### 3.3 Create App
- Click **"Create"** button
- ⚠️ You cannot change Bundle ID or SKU after creation, so make sure they're correct!

---

## ✅ Step 4: Configure App Information

Once your app is created, you'll see the app dashboard. Configure these sections:

### 4.1 App Information (Left Sidebar)

**General Information:**
- **Name:** `ShredAI` (should already be filled)
- **Subtitle:** `AI Body Composition Analysis` (30 characters max)
- **Category:**
  - Primary: **Health & Fitness**
  - Secondary: **Lifestyle** (optional)
- **Content Rights:** Check "I have the right to use this content"

**Privacy Policy URL:**
- Enter: `https://harrysikes.github.io/ShredAIV2/`

**Support URL:**
- Enter: `https://harrysikes.github.io/ShredAIV2/` (same as privacy policy)
- Or use: `mailto:privacy@shredai.app`

**Marketing URL:** (Optional)
- Leave blank or add if you have a marketing website

### 4.2 Pricing and Availability

1. Click **"Pricing and Availability"** (left sidebar)
2. **Price:** Select **"Free"** (subscriptions are separate)
3. **Availability:** 
   - Select **"All countries and regions"** 
   - Or select specific countries
4. Click **"Save"**

### 4.3 App Privacy (IMPORTANT)

1. Click **"App Privacy"** (left sidebar)
2. Click **"Get Started"** or **"Manage"**
3. Answer questions about data collection:

**Data Types You Collect:**
- ✅ **Photos or Videos** - Select "Yes"
  - Purpose: App Functionality
  - Linked to User: Yes
  - Used for Tracking: No
  
- ✅ **Health & Fitness** - Select "Yes"
  - Purpose: App Functionality
  - Linked to User: Yes
  - Used for Tracking: No

- ✅ **Device ID** - Select "Yes"
  - Purpose: Analytics, App Functionality
  - Linked to User: No
  - Used for Tracking: No

- ✅ **Product Interaction** - Select "Yes"
  - Purpose: Analytics, App Functionality
  - Linked to User: No
  - Used for Tracking: No

4. Click **"Save"** after completing each section

**Note:** Be honest and accurate. Apple reviews this carefully.

---

## ✅ Step 5: Prepare for Version Information

While you can't submit without a build, you can prepare metadata:

1. **App Store Listing** (left sidebar)
   - App Name: `ShredAI`
   - Subtitle: `AI Body Composition Analysis`
   - Description: (You'll add this later)
   - Keywords: `fitness, body fat, workout, AI, health, body composition`
   - Support URL: `https://harrysikes.github.io/ShredAIV2/`
   - Marketing URL: (Optional)
   - Privacy Policy URL: `https://harrysikes.github.io/ShredAIV2/`

2. **App Preview and Screenshots**
   - You'll need these later (see PRE_SUBMISSION_CHECKLIST.md)

---

## 📋 Quick Checklist

**App ID Setup:**
- [ ] App ID created: `com.shredai.v2`
- [ ] In-App Purchase capability enabled
- [ ] Push Notifications enabled (optional)

**App Store Connect:**
- [ ] Signed in to App Store Connect
- [ ] App created with correct Bundle ID
- [ ] App Information configured
- [ ] Privacy Policy URL added
- [ ] Support URL added
- [ ] Category selected: Health & Fitness
- [ ] Pricing set to Free
- [ ] App Privacy questions answered

---

## 🎯 What's Next?

Once you complete these steps:

1. **Create In-App Purchase Products** (next step)
2. **Add App Screenshots** (required for submission)
3. **Complete App Description** (in App Store listing)
4. **Prepare for Build** (EAS Build for production)

---

## 🔗 Direct Links

- **Developer Portal - App IDs:** https://developer.apple.com/account/resources/identifiers/list
- **App Store Connect:** https://appstoreconnect.apple.com/
- **App Store Connect - My Apps:** https://appstoreconnect.apple.com/apps

---

## ⚠️ Important Notes

1. **Bundle ID:** Must be `com.shredai.v2` - matches your `app.json`
2. **App Name:** "ShredAI" - maximum 30 characters
3. **Cannot Change:** Bundle ID and SKU after creation
4. **Privacy Policy:** Must be publicly accessible (GitHub Pages)
5. **App Privacy:** Must be accurate - Apple reviews this

---

## 💡 Tips

- Take your time with App Privacy - be accurate and complete
- You can save and come back to complete sections
- App Store Connect auto-saves as you type
- You can't submit without a build, but you can prepare everything now

---

**Next:** After completing these steps, we'll create the In-App Purchase products! 🚀
