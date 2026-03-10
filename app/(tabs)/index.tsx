import React, { useEffect, useMemo, useState } from 'react';
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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
  createResumeVersion,
  loadSavedResumeVersions,
  saveResumeVersions,
  type SavedResumeVersion,
} from '@/lib/resumeStorage';
import { API_URL } from '@/config/api';
import { loadProfileFromStorage, type UserProfile } from '@/lib/profileStorage';

type Tone = 'Concise' | 'Technical' | 'Impact-focused';
type ResumeStyle = 'Classic' | 'Modern' | 'Compact';

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
  const [exportingPdf, setExportingPdf] = useState(false);
  const [savedVersions, setSavedVersions] = useState<SavedResumeVersion[]>([]);
  const [saveTitle, setSaveTitle] = useState('');
  const [savingVersion, setSavingVersion] = useState(false);
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>('Classic');

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [storedProfile, storedVersions] = await Promise.all([
          loadProfileFromStorage(),
          loadSavedResumeVersions(),
        ]);

        setProfile(storedProfile);
        setSavedVersions(storedVersions);
      } catch {
        Alert.alert('Error', 'Failed to load profile or saved resumes.');
      } finally {
        setProfileLoading(false);
      }
    };

    loadInitialData();
  }, []);
  const saveCurrentVersion = async () => {
    if (!result || !profile) {
      Alert.alert('Error', 'Generate a resume first before saving.');
      return;
    }

    try {
      setSavingVersion(true);

      const versionTitle =
        saveTitle.trim() ||
        `Resume for ${jobDescription.split('\n')[0].slice(0, 40) || 'New Role'}`;

      const newVersion = createResumeVersion({
        title: versionTitle,
        tone,
        jobDescription,
        profile,
        result,
      });

      const updated = [newVersion, ...savedVersions];
      setSavedVersions(updated);
      await saveResumeVersions(updated);

      setSaveTitle('');
      Alert.alert('Saved', 'Resume version saved locally.');
    } catch {
      Alert.alert('Error', 'Failed to save resume version.');
    } finally {
      setSavingVersion(false);
    }
  };

  const loadVersionIntoEditor = (version: SavedResumeVersion) => {
    setResult(version.result);
    setJobDescription(version.jobDescription);
    setTone(version.tone as Tone);
    Alert.alert('Loaded', 'Saved resume version loaded into the editor.');
  };

  const deleteVersion = async (id: string) => {
    try {
      const updated = savedVersions.filter((version) => version.id !== id);
      setSavedVersions(updated);
      await saveResumeVersions(updated);
    } catch {
      Alert.alert('Error', 'Failed to delete saved version.');
    }
  };

  const ResumeStyleButton = ({ value }: { value: ResumeStyle }) => {
    const active = resumeStyle === value;

    return (
      <TouchableOpacity
        style={[styles.toneButton, active && styles.toneButtonActive]}
        onPress={() => setResumeStyle(value)}
      >
        <Text style={[styles.toneButtonText, active && styles.toneButtonTextActive]}>
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

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

  const fullResumeText = useMemo(() => {
    if (!result || !profile) return '';

    const headerLine = [
      profile.email?.trim(),
      profile.phone?.trim(),
      profile.location?.trim(),
    ]
      .filter(Boolean)
      .join(' | ');

    return `
${profile.fullName || 'Your Name'}
${headerLine}

SUMMARY
${result.summary}

EDUCATION
${result.education
  .map(
    (edu) =>
      `${edu.school}
${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}
${edu.startDate} - ${edu.endDate}
${edu.details || ''}`.trim()
  )
  .join('\n\n')}

SKILLS
${result.skills.join(', ')}

PROJECTS
${result.projects
  .map(
    (project) =>
      `${project.name}
${project.role}
${project.bullets.map((b) => `• ${b}`).join('\n')}`.trim()
  )
  .join('\n\n')}

EXPERIENCE
${result.experience
  .map(
    (exp) =>
      `${exp.company}
${exp.title}
${exp.startDate} - ${exp.endDate}${exp.location ? ` | ${exp.location}` : ''}
${exp.bullets.map((b) => `• ${b}`).join('\n')}`.trim()
  )
  .join('\n\n')}

MISSING KEYWORDS
${result.missingKeywords.join(', ')}
`.trim();
  }, [profile, result]);

  const copyFullResume = async () => {
    if (!fullResumeText) return;
    await Clipboard.setStringAsync(fullResumeText);
    Alert.alert('Copied', 'Full tailored resume copied to clipboard.');
  };

  const updateSummary = (text: string) => {
    if (!result) return;
    setResult({ ...result, summary: text });
  };

  const headingSize = resumeStyle === 'Modern' ? '28px' : resumeStyle === 'Compact' ? '22px' : '24px';

  const updateSkills = (text: string) => {
    if (!result) return;
    const skills = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setResult({ ...result, skills });
  };

  const updateMissingKeywords = (text: string) => {
    if (!result) return;
    const missingKeywords = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setResult({ ...result, missingKeywords });
  };

  const updateEducationField = (
    index: number,
    field: keyof TailoredResumeResponse['education'][number],
    value: string
  ) => {
    if (!result) return;
    const updated = [...result.education];
    updated[index] = { ...updated[index], [field]: value };
    setResult({ ...result, education: updated });
  };

  const updateExperienceField = (
    index: number,
    field: keyof TailoredResumeResponse['experience'][number],
    value: string
  ) => {
    if (!result) return;
    const updated = [...result.experience];
    updated[index] = { ...updated[index], [field]: value };
    setResult({ ...result, experience: updated });
  };

  const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
    if (!result) return;
    const updated = [...result.experience];
    const bullets = [...updated[expIndex].bullets];
    bullets[bulletIndex] = value;
    updated[expIndex] = { ...updated[expIndex], bullets };
    setResult({ ...result, experience: updated });
  };

  const updateProjectField = (
    index: number,
    field: keyof TailoredResumeResponse['projects'][number],
    value: string
  ) => {
    if (!result) return;
    const updated = [...result.projects];
    updated[index] = { ...updated[index], [field]: value };
    setResult({ ...result, projects: updated });
  };

  const updateProjectBullet = (projectIndex: number, bulletIndex: number, value: string) => {
    if (!result) return;
    const updated = [...result.projects];
    const bullets = [...updated[projectIndex].bullets];
    bullets[bulletIndex] = value;
    updated[projectIndex] = { ...updated[projectIndex], bullets };
    setResult({ ...result, projects: updated });
  };

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

  const buildResumeHtml = () => {

    const styleMap = {
      Classic: {
        fontFamily: 'Georgia, serif',
        accent: '#111111',
        sectionSpacing: '18px',
      },
      Modern: {
        fontFamily: 'Arial, sans-serif',
        accent: '#0F62FE',
        sectionSpacing: '20px',
      },
      Compact: {
        fontFamily: 'Arial, sans-serif',
        accent: '#111111',
        sectionSpacing: '12px',
      },
    };

    const currentStyle = styleMap[resumeStyle];
    if (!result || !profile) return '';

    const headerLine = [
      profile.email?.trim(),
      profile.phone?.trim(),
      profile.location?.trim(),
    ]
      .filter(Boolean)
      .join(' | ');

    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body {
        font-family: ${currentStyle.fontFamily};
        padding: 28px 34px;
        color: #111;
        font-size: 12px;
        line-height: 1.45;
      }
      h1 {
        font-size: 24px;
        margin: 0 0 4px 0;
      }
      .contact {
        font-size: 11px;
        color: #444;
        margin-bottom: 16px;
      }
      .section-title {
        font-size: ${headingSize};
        font-weight: 700;
        color: ${currentStyle.accent};
        margin: ${currentStyle.sectionSpacing} 0 8px 0;        letter-spacing: 0.4px;
      }
      .item {
        margin-bottom: 10px;
      }
      .item-title {
        font-weight: 700;
      }
      .item-subtitle {
        font-weight: 600;
      }
      .meta {
        color: #555;
        margin: 2px 0 4px 0;
      }
      ul {
        margin: 4px 0 0 18px;
        padding: 0;
      }
      li {
        margin-bottom: 4px;
      }
      .para {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <h1>${escapeHtml(profile.fullName || 'Your Name')}</h1>
    <div class="contact">${escapeHtml(headerLine)}</div>

    <div class="section-title">SUMMARY</div>
    <p class="para">${escapeHtml(result.summary)}</p>

    <div class="section-title">EDUCATION</div>
    ${result.education
      .map(
        (edu) => `
      <div class="item">
        <div class="item-title">${escapeHtml(edu.school)}</div>
        <div class="item-subtitle">${escapeHtml(
          `${edu.degree}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}`
        )}</div>
        <div class="meta">${escapeHtml(`${edu.startDate} - ${edu.endDate}`)}</div>
        ${edu.details ? `<div>${escapeHtml(edu.details)}</div>` : ''}
      </div>
    `
      )
      .join('')}

    <div class="section-title">SKILLS</div>
    <p class="para">${escapeHtml(result.skills.join(', '))}</p>

    <div class="section-title">PROJECTS</div>
    ${result.projects
      .map(
        (project) => `
      <div class="item">
        <div class="item-title">${escapeHtml(project.name)}</div>
        <div class="item-subtitle">${escapeHtml(project.role)}</div>
        <ul>
          ${project.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}

    <div class="section-title">EXPERIENCE</div>
    ${result.experience
      .map(
        (exp) => `
      <div class="item">
        <div class="item-title">${escapeHtml(exp.company)}</div>
        <div class="item-subtitle">${escapeHtml(exp.title)}</div>
        <div class="meta">${escapeHtml(
          `${exp.startDate} - ${exp.endDate}${exp.location ? ` | ${exp.location}` : ''}`
        )}</div>
        <ul>
          ${exp.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}
        </ul>
      </div>
    `
      )
      .join('')}
  </body>
</html>
    `.trim();
  };

  const exportPdf = async () => {
    if (!result || !profile) return;

    try {
      setExportingPdf(true);

      const html = buildResumeHtml();
      const { uri } = await Print.printToFileAsync({ html });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert('PDF created', `Saved PDF at: ${uri}`);
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share your tailored resume',
        UTI: 'com.adobe.pdf',
      });
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to export PDF.');
    } finally {
      setExportingPdf(false);
    }
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

            <Text style={styles.label}>Resume Style</Text>
              <View style={styles.toneRow}>
                <ResumeStyleButton value="Classic" />
                <ResumeStyleButton value="Modern" />
                <ResumeStyleButton value="Compact" />
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
              <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>Save This Version</Text>
              <TextInput
                style={[styles.editInput, { marginTop: 12 }]}
                value={saveTitle}
                onChangeText={setSaveTitle}
                placeholder="e.g. Shopify SWE Intern Resume"
                placeholderTextColor="#8C8C8C"
              />
              <TouchableOpacity
                style={[styles.primaryButton, savingVersion && styles.disabledButton]}
                onPress={saveCurrentVersion}
                disabled={savingVersion}
              >
                <Text style={styles.primaryButtonText}>
                  {savingVersion ? 'Saving...' : 'Save Resume Version'}
                </Text>
              </TouchableOpacity>
            </View>
              <View style={styles.topActionsRow}>
                <TouchableOpacity style={styles.copyFullButton} onPress={copyFullResume}>
                  <Text style={styles.copyFullButtonText}>Copy Full Resume</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.exportButton, exportingPdf && styles.disabledButton]}
                  onPress={exportPdf}
                  disabled={exportingPdf}
                >
                  <Text style={styles.exportButtonText}>
                    {exportingPdf ? 'Exporting...' : 'Share PDF'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Saved Resume Versions</Text>

                {savedVersions.length === 0 ? (
                  <Text style={[styles.resultBody, { marginTop: 10 }]}>
                    No saved resume versions yet.
                  </Text>
                ) : (
                  savedVersions.map((version) => (
                    <View key={version.id} style={styles.savedVersionCard}>
                      <Text style={styles.savedVersionTitle}>{version.title}</Text>
                      <Text style={styles.savedVersionMeta}>
                        {version.profileName} • {version.tone} •{' '}
                        {new Date(version.createdAt).toLocaleDateString()}
                      </Text>

                      <View style={styles.savedVersionActions}>
                        <TouchableOpacity
                          style={styles.savedVersionButton}
                          onPress={() => loadVersionIntoEditor(version)}
                        >
                          <Text style={styles.savedVersionButtonText}>Load</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.savedVersionDeleteButton}
                          onPress={() => deleteVersion(version.id)}
                        >
                          <Text style={styles.savedVersionDeleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Summary</Text>
                  <TouchableOpacity onPress={() => copySection(result.summary)}>
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  multiline
                  value={result.summary}
                  onChangeText={updateSummary}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Education</Text>
                {result.education.map((edu, index) => (
                  <View key={index} style={styles.blockItem}>
                    <TextInput
                      style={styles.editInput}
                      value={edu.school}
                      onChangeText={(value) => updateEducationField(index, 'school', value)}
                      placeholder="School"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={edu.degree}
                      onChangeText={(value) => updateEducationField(index, 'degree', value)}
                      placeholder="Degree"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={edu.fieldOfStudy}
                      onChangeText={(value) =>
                        updateEducationField(index, 'fieldOfStudy', value)
                      }
                      placeholder="Field of study"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={edu.startDate}
                      onChangeText={(value) => updateEducationField(index, 'startDate', value)}
                      placeholder="Start date"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={edu.endDate}
                      onChangeText={(value) => updateEducationField(index, 'endDate', value)}
                      placeholder="End date"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={[styles.editInput, styles.editTextArea]}
                      multiline
                      value={edu.details}
                      onChangeText={(value) => updateEducationField(index, 'details', value)}
                      placeholder="Details"
                      placeholderTextColor="#8C8C8C"
                      textAlignVertical="top"
                    />
                  </View>
                ))}
              </View>

              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultTitle}>Skills</Text>
                  <TouchableOpacity onPress={() => copySection(result.skills.join(', '))}>
                    <Text style={styles.copyText}>Copy</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  multiline
                  value={result.skills.join(', ')}
                  onChangeText={updateSkills}
                  placeholder="Comma-separated skills"
                  placeholderTextColor="#8C8C8C"
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Projects</Text>
                {result.projects.map((project, index) => (
                  <View key={index} style={styles.blockItem}>
                    <TextInput
                      style={styles.editInput}
                      value={project.name}
                      onChangeText={(value) => updateProjectField(index, 'name', value)}
                      placeholder="Project name"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={project.role}
                      onChangeText={(value) => updateProjectField(index, 'role', value)}
                      placeholder="Role"
                      placeholderTextColor="#8C8C8C"
                    />
                    {project.bullets.map((bullet, bulletIndex) => (
                      <TextInput
                        key={bulletIndex}
                        style={[styles.editInput, styles.editTextArea]}
                        multiline
                        value={bullet}
                        onChangeText={(value) =>
                          updateProjectBullet(index, bulletIndex, value)
                        }
                        placeholder={`Project bullet ${bulletIndex + 1}`}
                        placeholderTextColor="#8C8C8C"
                        textAlignVertical="top"
                      />
                    ))}
                  </View>
                ))}
              </View>

              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Experience</Text>
                {result.experience.map((exp, index) => (
                  <View key={index} style={styles.blockItem}>
                    <TextInput
                      style={styles.editInput}
                      value={exp.company}
                      onChangeText={(value) => updateExperienceField(index, 'company', value)}
                      placeholder="Company"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={exp.title}
                      onChangeText={(value) => updateExperienceField(index, 'title', value)}
                      placeholder="Title"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={exp.startDate}
                      onChangeText={(value) => updateExperienceField(index, 'startDate', value)}
                      placeholder="Start date"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={exp.endDate}
                      onChangeText={(value) => updateExperienceField(index, 'endDate', value)}
                      placeholder="End date"
                      placeholderTextColor="#8C8C8C"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={exp.location}
                      onChangeText={(value) => updateExperienceField(index, 'location', value)}
                      placeholder="Location"
                      placeholderTextColor="#8C8C8C"
                    />
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <TextInput
                        key={bulletIndex}
                        style={[styles.editInput, styles.editTextArea]}
                        multiline
                        value={bullet}
                        onChangeText={(value) =>
                          updateExperienceBullet(index, bulletIndex, value)
                        }
                        placeholder={`Experience bullet ${bulletIndex + 1}`}
                        placeholderTextColor="#8C8C8C"
                        textAlignVertical="top"
                      />
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
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  multiline
                  value={result.missingKeywords.join(', ')}
                  onChangeText={updateMissingKeywords}
                  placeholder="Comma-separated keywords"
                  placeholderTextColor="#8C8C8C"
                  textAlignVertical="top"
                />
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
    paddingBottom: 180,
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
  topActionsRow: {
    gap: 10,
    marginBottom: 14,
  },
  copyFullButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  copyFullButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#2C2C2C',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#FFFFFF',
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
  editInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111111',
    marginTop: 8,
  },
  editTextArea: {
    minHeight: 78,
    paddingTop: 12,
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

  savedVersionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
  },
  savedVersionTitle: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '800',
  },
  savedVersionMeta: {
    color: '#555555',
    fontSize: 13,
    marginTop: 4,
  },
  savedVersionActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  savedVersionButton: {
    backgroundColor: '#EDEDED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  savedVersionButtonText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 13,
  },
  savedVersionDeleteButton: {
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  savedVersionDeleteButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});