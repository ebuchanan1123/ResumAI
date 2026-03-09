import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { API_URL } from '@/config/api';
import { loadProfileFromStorage, type UserProfile } from '@/lib/profileStorage';

type Tone = 'Concise' | 'Technical' | 'Impact-focused';

type TailoredResumeResponse = {
  summary: string;
  skills: string[];
  experience: {
    company: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    bullets: string[];
  }[];
  projects: {
    name: string;
    role: string;
    bullets: string[];
  }[];
  education: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    details: string;
  }[];
  missingKeywords: string[];
};

export default function ResumeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [tone, setTone] = useState<Tone>('Technical');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TailoredResumeResponse | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await loadProfileFromStorage();
        setProfile(storedProfile);
      } catch {
        Alert.alert('Error', 'Failed to load profile.');
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, []);

  const reloadProfile = async () => {
    try {
      const storedProfile = await loadProfileFromStorage();
      setProfile(storedProfile);
      Alert.alert('Loaded', 'Latest profile data loaded.');
    } catch {
      Alert.alert('Error', 'Failed to reload profile.');
    }
  };

  const tailorResume = async () => {
    if (!profile) {
      Alert.alert('Error', 'Profile is not loaded yet.');
      return;
    }

    if (jobDescription.trim().length < 30) {
      Alert.alert('Error', 'Please paste a longer job description.');
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const res = await fetch(`${API_URL}/tailor-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          jobDescription,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to tailor resume.');
      }

      setResult(data);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const copySection = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'Section copied to clipboard.');
  };

  const copyFullResume = async () => {
    if (!result || !profile) return;

    const fullText = `
${profile.fullName || 'Your Name'}
${profile.email || ''} ${profile.phone ? `| ${profile.phone}` : ''} ${profile.location ? `| ${profile.location}` : ''}

SUMMARY
${result.summary}

SKILLS
${result.skills.join(', ')}

EDUCATION
${result.education
  .map(
    (edu) =>
      `${edu.school}
${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
${edu.startDate} - ${edu.endDate}
${edu.details || ''}`
  )
  .join('\n\n')}

EXPERIENCE
${result.experience
  .map(
    (exp) =>
      `${exp.company}
${exp.title}
${exp.startDate} - ${exp.endDate}${exp.location ? ` | ${exp.location}` : ''}
${exp.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}

PROJECTS
${result.projects
  .map(
    (project) =>
      `${project.name}
${project.role}
${project.bullets.map((b) => `• ${b}`).join('\n')}`
  )
  .join('\n\n')}
`.trim();

    await Clipboard.setStringAsync(fullText);
    Alert.alert('Copied', 'Full tailored resume copied to clipboard.');
  };

  const ToneButton = ({ value }: { value: Tone }) => {
    const active = tone === value;

    return (
      <TouchableOpacity
        style={[styles.toneButton, active && styles.toneButtonActive]}
        onPress={() => setTone(value)}
      >
        <Text style={[styles.toneButtonText, active && styles.toneButtonTextActive]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const profileLooksEmpty =
    !profile?.fullName &&
    !profile?.skills &&
    (!profile?.experience || profile.experience.every((item) => !item.company && !item.title)) &&
    (!profile?.projects || profile.projects.every((item) => !item.name));

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.screen}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <Text style={styles.title}>Resume</Text>
          <Text style={styles.subtitle}>
            Generate a tailored resume from your saved profile and a target job description.
          </Text>

          <View style={styles.sectionCard}>
            <View style={styles.profileStatusHeader}>
              <Text style={styles.sectionTitle}>Profile Status</Text>
              <TouchableOpacity style={styles.smallButton} onPress={reloadProfile}>
                <Text style={styles.smallButtonText}>Reload</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.statusText}>
              {profileLooksEmpty
                ? 'Your profile looks mostly empty. Fill out the Profile tab first for better results.'
                : `Using saved profile for ${profile?.fullName || 'this user'}.`}
            </Text>
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Target Job Description</Text>
            <TextInput
              style={[styles.input, styles.jobDescriptionArea]}
              multiline
              value={jobDescription}
              onChangeText={setJobDescription}
              placeholder="Paste the internship job description here..."
              placeholderTextColor="#8C8C8C"
              textAlignVertical="top"
            />

            <Text style={styles.label}>Tone</Text>
            <View style={styles.toneRow}>
              <ToneButton value="Concise" />
              <ToneButton value="Technical" />
              <ToneButton value="Impact-focused" />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.disabledButton]}
              onPress={tailorResume}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading ? 'Generating...' : 'Generate Tailored Resume'}
              </Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>Building your tailored resume...</Text>
            </View>
          ) : result ? (
            <View style={styles.resultsSection}>
              <TouchableOpacity style={styles.copyFullButton} onPress={copyFullResume}>
                <Text style={styles.copyFullButtonText}>Copy Full Resume</Text>
              </TouchableOpacity>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Summary</Text>
                  <TouchableOpacity onPress={() => copySection(result.summary)}>
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultBody}>{result.summary}</Text>
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Skills</Text>
                  <TouchableOpacity onPress={() => copySection(result.skills.join(', '))}>
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultBody}>{result.skills.join(', ')}</Text>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Education</Text>
                {result.education.map((edu, index) => (
                  <View key={index} style={styles.blockItem}>
                    <Text style={styles.blockHeading}>{edu.school}</Text>
                    <Text style={styles.blockSubheading}>
                      {edu.degree}
                      {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
                    </Text>
                    <Text style={styles.blockMeta}>
                      {edu.startDate} - {edu.endDate}
                    </Text>
                    {!!edu.details && <Text style={styles.resultBody}>{edu.details}</Text>}
                  </View>
                ))}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Experience</Text>
                {result.experience.map((exp, index) => (
                  <View key={index} style={styles.blockItem}>
                    <Text style={styles.blockHeading}>{exp.company}</Text>
                    <Text style={styles.blockSubheading}>{exp.title}</Text>
                    <Text style={styles.blockMeta}>
                      {exp.startDate} - {exp.endDate}
                      {exp.location ? ` | ${exp.location}` : ''}
                    </Text>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <Text key={bulletIndex} style={styles.bulletLine}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Projects</Text>
                {result.projects.map((project, index) => (
                  <View key={index} style={styles.blockItem}>
                    <Text style={styles.blockHeading}>{project.name}</Text>
                    <Text style={styles.blockSubheading}>{project.role}</Text>
                    {project.bullets.map((bullet, bulletIndex) => (
                      <Text key={bulletIndex} style={styles.bulletLine}>
                        • {bullet}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Missing Keywords</Text>
                  <TouchableOpacity
                    onPress={() => copySection(result.missingKeywords.join(', '))}
                  >
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.resultBody}>{result.missingKeywords.join(', ')}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Your generated summary, skills, experience, projects, and keyword suggestions will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 160,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    color: '#A3A3A3',
    marginTop: 12,
    fontSize: 15,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 10,
  },
  subtitle: {
    color: '#A3A3A3',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionCard: {
    backgroundColor: '#0C0C0C',
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  profileStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallButtonText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 13,
  },
  statusText: {
    color: '#A3A3A3',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 12,
  },
  label: {
    color: '#FFFFFF',
    marginTop: 14,
    marginBottom: 8,
    fontWeight: '700',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
    color: '#111111',
  },
  jobDescriptionArea: {
    minHeight: 220,
    paddingTop: 14,
    marginTop: 12,
  },
  toneRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 2,
    marginBottom: 18,
  },
  toneButton: {
    backgroundColor: '#161616',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  toneButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  toneButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  toneButtonTextActive: {
    color: '#111111',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 18,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resultsSection: {
    marginTop: 4,
  },
  copyFullButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  copyFullButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#F4F4F4',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultTitle: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 15,
  },
  copyText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 13,
  },
  resultBody: {
    color: '#111111',
    fontSize: 15,
    lineHeight: 23,
  },
  blockItem: {
    marginTop: 12,
  },
  blockHeading: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  blockSubheading: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  blockMeta: {
    color: '#555555',
    fontSize: 14,
    marginBottom: 6,
  },
  bulletLine: {
    color: '#111111',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 6,
  },
  emptyState: {
    backgroundColor: '#0C0C0C',
    borderWidth: 1,
    borderColor: '#1D1D1D',
    borderRadius: 18,
    padding: 18,
  },
  emptyStateText: {
    color: '#8E8E8E',
    fontSize: 15,
    lineHeight: 22,
  },
});