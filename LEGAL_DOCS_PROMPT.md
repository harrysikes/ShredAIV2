# Legal Documents Generation Prompt for ChatGPT

Copy and paste this entire prompt into ChatGPT to generate all required legal documents:

---

## PROMPT FOR CHATGPT:

I need you to create comprehensive legal documents for my mobile app that will be submitted to the Apple App Store. Please generate the following documents with all necessary legal language:

### APP DETAILS:
- **App Name**: ShredAI
- **App Type**: iOS mobile application (React Native/Expo)
- **Primary Function**: AI-powered body composition analysis using photos
- **Business Model**: Freemium with in-app subscriptions ($6.99/month, $59.99/year)
- **Target Audience**: Adults 18+ interested in fitness and body composition tracking

### DATA COLLECTION & PROCESSING:

1. **Photographs**: 
   - Users take photos of themselves (front/back/side views)
   - Photos are uploaded to AWS S3 cloud storage
   - Photos are processed using OpenAI GPT-4o Vision API for body composition analysis
   - Photos are stored securely in private S3 buckets

2. **Survey Data**:
   - Biological sex
   - Date of birth (age)
   - Height (feet/inches or cm)
   - Weight (lbs or kg)
   - Exercise frequency
   - Workout goals

3. **Usage Data**:
   - Device information
   - App usage patterns
   - Error logs
   - IP addresses

### THIRD-PARTY SERVICES:

1. **OpenAI** (GPT-4o Vision API):
   - Processes user photos for body composition analysis
   - AI analyzes images to calculate body fat percentage
   - [OpenAI Privacy Policy: https://openai.com/policies/privacy-policy]

2. **Amazon Web Services (AWS S3)**:
   - Stores user photos securely
   - Private, encrypted storage buckets
   - [AWS Privacy Policy: https://aws.amazon.com/privacy/]

3. **Vercel**:
   - Hosts backend API servers
   - Processes API requests
   - [Vercel Privacy Policy: https://vercel.com/legal/privacy-policy]

4. **Apple**:
   - In-app purchase processing
   - App Store distribution
   - Device information

### FEATURES:

- Camera access for taking body composition photos
- Photo library access (optional, for saving results)
- AI-powered body fat percentage calculation
- Personalized workout plan generation
- Progress tracking
- In-app subscriptions

### LEGAL REQUIREMENTS:

Please create the following documents with proper legal language:

1. **PRIVACY POLICY**:
   - GDPR compliant
   - CCPA compliant
   - COPPA compliant (not for children under 13)
   - Detailed data collection disclosure
   - Third-party service disclosures
   - User rights (access, deletion, portability)
   - Data retention policies
   - Security measures
   - International data transfers
   - Contact information for privacy inquiries
   - How to exercise rights
   - California privacy rights section
   - Children's privacy section
   - Clear, user-friendly language while maintaining legal accuracy

2. **TERMS OF SERVICE**:
   - User agreement and acceptance
   - Service description
   - Account creation and responsibilities
   - Subscription terms and billing
   - Cancellation and refund policies
   - Intellectual property rights
   - User-generated content (photos) licensing
   - Prohibited uses
   - Disclaimers (medical/health advice disclaimers)
   - Limitation of liability
   - Indemnification
   - Dispute resolution
   - Governing law
   - Changes to terms
   - Contact information

3. **AI USAGE DISCLOSURE**:
   - Clear explanation that AI is used for analysis
   - Accuracy disclaimers
   - Not a medical device or diagnostic tool
   - Educational/entertainment purposes
   - User responsibility for health decisions

4. **PHOTO USAGE POLICY**:
   - How photos are used
   - Storage and security
   - User rights to delete photos
   - No sharing with third parties (except AI processing)
   - Retention period

5. **MEDICAL DISCLAIMER**:
   - Not a medical device
   - Not FDA approved
   - For informational purposes only
   - Not a substitute for professional medical advice
   - Consult healthcare providers for medical decisions

### SPECIFIC REQUIREMENTS:

- **App Store Compliance**: Must meet Apple's App Store Review Guidelines
- **GDPR**: Must comply with European data protection laws
- **CCPA**: Must comply with California Consumer Privacy Act
- **HIPAA**: Not required (not a medical device), but include health data disclaimers
- **COPPA**: Explicitly state not for children under 13
- **Accessibility**: Documents should be clear and understandable

### TONE & STYLE:

- Professional but accessible
- Clear, plain language where possible
- Legally accurate
- User-friendly
- Comprehensive coverage of all legal bases

### CONTACT INFORMATION:

- **Privacy Email**: privacy@shredai.app
- **Support Email**: support@shredai.app (or use privacy email if not available)
- **Website**: https://shredai.app (or GitHub Pages URL if not available)

### FORMAT:

Please provide:
1. Complete Privacy Policy (ready to use)
2. Complete Terms of Service (ready to use)
3. AI Usage Disclosure (can be integrated into Privacy Policy or separate)
4. Medical Disclaimer (can be integrated into Terms of Service or separate)
5. Photo Usage Policy (can be integrated into Privacy Policy or separate)

All documents should be:
- Ready to publish
- Properly formatted
- Include "Last Updated" date
- Include version number
- Include effective date

### ADDITIONAL NOTES:

- The app is NOT a medical device
- Results are estimates, not medical diagnoses
- Users should consult healthcare professionals for medical advice
- Photos are processed by AI but not stored by OpenAI (only by AWS)
- Subscriptions auto-renew unless cancelled
- Users can delete their data at any time
- App is available in multiple countries (international compliance needed)

---

**Please generate all documents with proper legal language, ensuring compliance with App Store requirements, GDPR, CCPA, and other relevant regulations. Make them comprehensive but user-friendly.**

---

## AFTER CHATGPT GENERATES THE DOCUMENTS:

1. Review the generated documents
2. Update contact emails/URLs if needed
3. Add to your app (create screens or link to hosted versions)
4. Host the documents online (GitHub Pages, your website, etc.)
5. Add links in App Store Connect
6. Add links in your app (Settings, About, etc.)

## FILES TO CREATE:

After ChatGPT generates the documents, save them as:
- `TERMS_OF_SERVICE.md`
- `TERMS_OF_SERVICE.html` (for hosting)
- Update `PRIVACY_POLICY.md` if ChatGPT improves it
- `MEDICAL_DISCLAIMER.md` (if separate)
- `AI_DISCLOSURE.md` (if separate)

## APP STORE REQUIREMENTS:

You'll need to provide:
- Privacy Policy URL (already have: https://harrysikes.github.io/ShredAIV2/)
- Terms of Service URL (create after ChatGPT generates it)
- Medical disclaimer (can be in Terms of Service)
- AI usage disclosure (can be in Privacy Policy)

---

**Copy the prompt above (starting from "PROMPT FOR CHATGPT:") and paste it into ChatGPT to generate all your legal documents!**


