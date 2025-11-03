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
Last Updated: November 1, 2024

ShredAI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App").

1. INFORMATION WE COLLECT

Personal Information:
• Demographic Data: Sex, age, height, weight
• Fitness Information: Exercise frequency, workout goals
• Photographs: Body composition photos taken through the App

Automatically Collected Information:
• Device information (model, operating system)
• Usage data (features used, session duration)
• Technical data (IP address, error logs)

2. HOW WE USE YOUR INFORMATION

We use the information we collect to:
• Provide Services: Analyze body composition and calculate body fat percentage
• AI Processing: Process your photos using OpenAI's GPT-4o Vision API for body composition analysis
• Generate Workouts: Create personalized workout plans based on your goals and preferences
• Improve Services: Analyze usage patterns to improve app functionality
• Customer Support: Respond to your inquiries and provide support

3. DATA STORAGE AND PROCESSING

Where Your Data is Stored:
• Photographs: Stored securely on Amazon Web Services (AWS) S3 cloud storage
• Survey Data: Processed through our backend servers hosted on Vercel
• Local Storage: Some data may be cached locally on your device

Third-Party Services:
We use the following third-party services:
• OpenAI: Provides AI vision analysis services (GPT-4o)
• AWS S3: Cloud storage for images
• Vercel: Hosting provider for our backend services

4. DATA SECURITY

We implement appropriate technical and organizational measures to protect your personal information:
• Encryption: Data transmitted over the internet is encrypted using SSL/TLS
• Access Controls: Limited access to personal data to authorized personnel only
• Secure Storage: Images stored in private, encrypted S3 buckets
• Regular Updates: Security practices reviewed and updated regularly

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.

5. DATA RETENTION

• Photographs: Stored until you delete your account or request deletion
• Survey Data: Retained to provide ongoing services and historical tracking
• Account Data: Retained while your account is active

You may request deletion of your data at any time by contacting us.

6. YOUR RIGHTS

You have the right to:
• Access: Request access to your personal data
• Correction: Request correction of inaccurate data
• Deletion: Request deletion of your personal data
• Portability: Request transfer of your data to another service
• Objection: Object to processing of your personal data

To exercise these rights, please contact us at: privacy@shredai.app

7. CHILDREN'S PRIVACY

Our App is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.

8. INTERNATIONAL DATA TRANSFERS

Your information may be transferred to and processed in countries other than your own, including the United States. These countries may have different data protection laws than your country. By using our App, you consent to the transfer of your information to these countries.

9. CHANGES TO THIS PRIVACY POLICY

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy in the App and updating the "Last Updated" date. Your continued use of the App after any changes constitutes acceptance of the new Privacy Policy.

10. CALIFORNIA PRIVACY RIGHTS

If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
• Right to know what personal information is collected
• Right to delete personal information
• Right to opt-out of the sale of personal information (we do not sell your data)

11. CONTACT US

If you have questions about this Privacy Policy or our data practices, please contact us:

Email: privacy@shredai.app
Website: https://shredai.app

12. CONSENT

By using ShredAI, you consent to this Privacy Policy and agree to its terms.

Effective Date: November 1, 2024
Version: 1.0
`;

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<PrivacyPolicyScreenNavigationProp>();

  const handleOpenFullPolicy = () => {
    // You can host the HTML version and link to it
    // For now, we'll just show the content in-app
    Linking.openURL('https://shredai.app/privacy-policy.html').catch(err =>
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

