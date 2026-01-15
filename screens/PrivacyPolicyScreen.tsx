import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type PrivacyPolicyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PrivacyPolicy'>;

const PRIVACY_POLICY_CONTENT = `
Version 1.0
Last Updated: February 16, 2025
Effective Date: February 16, 2025

ShredzAI ("ShredzAI," "we," "our," or "us") provides an AI-powered body composition analysis mobile application (the "App"). We are committed to protecting your privacy and handling your personal information responsibly, transparently, and in compliance with global privacy laws, including the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and applicable international data protection regulations.

By using ShredzAI, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the App.

1. ELIGIBILITY & CHILDREN'S PRIVACY (COPPA COMPLIANCE)

ShredAI is intended for adults age 18 and older.

We do not knowingly collect, use, or store personal data from anyone under the age of 13. If we learn that a child under 13 has provided personal data, we will delete it immediately.

2. INFORMATION WE COLLECT

A. Photographs (Personal Data)

We collect:
• User-submitted body photos (front/back/side)
• Metadata associated with photo uploads (timestamp, device type)

Purpose: Body composition analysis using AI.
Processing: Photos are processed by OpenAI GPT-4o Vision API to extract estimated metrics.
Storage: Photos are stored in secure, private AWS S3 buckets.

OpenAI does not retain your photos after processing.

B. Survey Data

You may optionally provide:
• Biological sex
• Date of birth/age
• Height
• Weight
• Exercise frequency
• Fitness goals

Purpose: To improve the accuracy of body composition estimates and provide personalized insights.

C. Usage Data

We automatically collect:
• Device information (model, OS version)
• IP address
• App interaction data
• Error and crash logs
• Subscription status

Purpose: App functionality, security, fraud prevention, analytics, and improvement.

3. HOW WE USE YOUR INFORMATION

We use your personal data for:
• Providing body composition analysis
• Generating personalized fitness guidance
• Improving the App and AI models
• Maintaining account functionality
• Processing subscriptions and payments
• Responding to support requests
• Ensuring safety, compliance, and fraud prevention

We do not sell your data.

4. LEGAL BASES FOR PROCESSING (GDPR)

For EU/EEA users, we rely on the following legal bases:
• Consent: For processing photos and personal attributes.
• Contract: To provide you the App and its features.
• Legitimate Interest: App performance, analytics, and security.
• Legal Obligation: Where required by law.

5. THIRD-PARTY SERVICE PROVIDERS

1. OpenAI (GPT-4o Vision API)
• Processes body photos to generate analysis
• Does not store or use your photos for training

2. Amazon Web Services (AWS S3)
• Stores photos in private, encrypted buckets

3. Vercel
• Hosts backend APIs
• Receives requests containing user data necessary for processing

4. Apple (In-App Purchases)
• Handles payment processing
• Provides device-level analytics
• Does not receive your photos

We only share data with these service providers as necessary to provide the App.

6. DATA RETENTION

We retain:
• Photos: Until you delete them or request deletion
• Account data: Until your account is deleted
• Analytics & logs: Up to 24 months
• Legal compliance data: As required by law

You may delete your entire account and all associated data at any time.

7. DATA SECURITY

We use industry-standard protections, including:
• Encrypted AWS S3 photo storage
• HTTPS data transport
• Access-controlled servers
• Role-based data access
• Zero retention by OpenAI

No system can be 100% secure, but we take commercially reasonable steps to protect your information.

8. INTERNATIONAL DATA TRANSFERS

Your information may be transferred to servers located in the United States and other countries. We rely on:
• Standard Contractual Clauses (SCCs)
• Adequacy decisions where applicable

9. YOUR RIGHTS

GDPR Rights:
You may request:
• Access to your data
• Correction
• Deletion
• Restriction of processing
• Data portability
• Withdrawal of consent

CCPA Rights (California):
You have the right to:
• Know what data is collected
• Request deletion
• Opt out of data sale (we do not sell data)
• Non-discrimination for exercising your rights

To exercise rights, email: privacy@shredai.app

10. YOUR CHOICES

• You may delete photos individually or delete your entire account.
• You may revoke camera access at any time.
• You may unsubscribe from marketing emails (if applicable).
• You may disable analytics collection on your device.

11. CHANGES TO THIS POLICY

We may update this Privacy Policy as needed. We will post updates and revise the "Last Updated" date.

12. CONTACT INFORMATION

Privacy Inquiries: privacy@shredai.app
Support: privacy@shredai.app
Website: https://shredai.app
`;

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();

  const handleOpenFullPolicy = () => {
    // TODO: Update this URL to your actual privacy policy hosting location
    // Options:
    // 1. GitHub Pages: https://yourusername.github.io/ShredAIV2/
    // 2. Custom domain: https://shredai.app/privacy-policy
    // 3. Your website: https://yoursite.com/privacy
    const privacyPolicyUrl = 'https://shredai.app/privacy-policy'; // Update this!
    Linking.openURL(privacyPolicyUrl).catch(err =>
      console.error('Failed to open privacy policy URL:', err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Privacy Policy</Text>
        <View style={styles.closeButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.content}>{PRIVACY_POLICY_CONTENT}</Text>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={handleOpenFullPolicy}
        >
          <Text style={styles.linkButtonText}>
            View Full Privacy Policy Online
          </Text>
        </TouchableOpacity>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            Contact us at:{' '}
            <Text
              style={styles.email}
              onPress={() => Linking.openURL('mailto:privacy@shredai.app')}
            >
              privacy@shredai.app
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3DAC9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#E3DAC9',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 80,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: '#333',
    marginBottom: 20,
  },
  linkButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  linkButtonText: {
    color: '#E3DAC9',
    fontSize: 16,
    fontWeight: '600',
  },
  contactSection: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  email: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

