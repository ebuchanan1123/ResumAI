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
import {
  createEmptyEducation,
  createEmptyExperience,
  createEmptyProfile,
  createEmptyProject,
  loadProfileFromStorage,
  saveProfileToStorage,
  type UserProfile,
} from '@/lib/profileStorage';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(createEmptyProfile());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const storedProfile = await loadProfileFromStorage();
        setProfile(storedProfile);
      } catch {
        Alert.alert('Error', 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateField = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEducationField = (
    index: number,
    field: keyof UserProfile['education'][number],
    value: string
  ) => {
    const updated = [...profile.education];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProfile((prev) => ({
      ...prev,
      education: updated,
    }));
  };

  const updateExperienceField = (
    index: number,
    field: keyof UserProfile['experience'][number],
    value: string
  ) => {
    const updated = [...profile.experience];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProfile((prev) => ({
      ...prev,
      experience: updated,
    }));
  };

  const updateProjectField = (
    index: number,
    field: keyof UserProfile['projects'][number],
    value: string
  ) => {
    const updated = [...profile.projects];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setProfile((prev) => ({
      ...prev,
      projects: updated,
    }));
  };

  const addEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }));
  };

  const addExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experience: [...prev.experience, createEmptyExperience()],
    }));
  };

  const addProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [...prev.projects, createEmptyProject()],
    }));
  };

  const removeEducation = (index: number) => {
    if (profile.education.length === 1) return;

    setProfile((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const removeExperience = (index: number) => {
    if (profile.experience.length === 1) return;

    setProfile((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const removeProject = (index: number) => {
    if (profile.projects.length === 1) return;

    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await saveProfileToStorage(profile);
      Alert.alert('Saved', 'Your profile was saved locally on this device.');
    } catch {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const resetProfile = () => {
    Alert.alert(
      'Reset profile',
      'This will erase your current profile fields on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => setProfile(createEmptyProfile()),
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>
            Add your full background here. This can be more detailed than a normal resume.
          </Text>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Basic Info</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="e.g. Evan Buchanan"
              placeholderTextColor="#8C8C8C"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="e.g. ebuchanan1123@gmail.com"
              placeholderTextColor="#8C8C8C"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="e.g. (647) 355-6678"
              placeholderTextColor="#8C8C8C"
            />

            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={profile.location}
              onChangeText={(value) => updateField('location', value)}
              placeholder="e.g. Ottawa, Ontario"
              placeholderTextColor="#8C8C8C"
            />

            <Text style={styles.label}>Skills</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={profile.skills}
              onChangeText={(value) => updateField('skills', value)}
              placeholder="e.g. JavaScript, TypeScript, React, Node.js, PostgreSQL, Git, REST APIs"
              placeholderTextColor="#8C8C8C"
              textAlignVertical="top"
            />

            <Text style={styles.label}>Summary Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={profile.summaryHint}
              onChangeText={(value) => updateField('summaryHint', value)}
              placeholder="Add extra context about your goals, strengths, or the type of roles you want."
              placeholderTextColor="#8C8C8C"
              textAlignVertical="top"
            />
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Education</Text>
              <TouchableOpacity style={styles.smallActionButton} onPress={addEducation}>
                <Text style={styles.smallActionButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {profile.education.map((item, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>Education {index + 1}</Text>
                  {profile.education.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeEducation(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.label}>School</Text>
                <TextInput
                  style={styles.input}
                  value={item.school}
                  onChangeText={(value) => updateEducationField(index, 'school', value)}
                  placeholder="University of Ottawa"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Degree</Text>
                <TextInput
                  style={styles.input}
                  value={item.degree}
                  onChangeText={(value) => updateEducationField(index, 'degree', value)}
                  placeholder="Honours BSc"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Field of Study</Text>
                <TextInput
                  style={styles.input}
                  value={item.fieldOfStudy}
                  onChangeText={(value) => updateEducationField(index, 'fieldOfStudy', value)}
                  placeholder="Computer Science"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={item.startDate}
                  onChangeText={(value) => updateEducationField(index, 'startDate', value)}
                  placeholder="Sep 2022"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={item.endDate}
                  onChangeText={(value) => updateEducationField(index, 'endDate', value)}
                  placeholder="Expected 2027"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Details</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  multiline
                  value={item.details}
                  onChangeText={(value) => updateEducationField(index, 'details', value)}
                  placeholder="Relevant coursework, GPA, awards, notable info..."
                  placeholderTextColor="#8C8C8C"
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Experience</Text>
              <TouchableOpacity style={styles.smallActionButton} onPress={addExperience}>
                <Text style={styles.smallActionButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {profile.experience.map((item, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>Experience {index + 1}</Text>
                  {profile.experience.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeExperience(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.label}>Company</Text>
                <TextInput
                  style={styles.input}
                  value={item.company}
                  onChangeText={(value) => updateExperienceField(index, 'company', value)}
                  placeholder="University of Ottawa"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Job Title</Text>
                <TextInput
                  style={styles.input}
                  value={item.title}
                  onChangeText={(value) => updateExperienceField(index, 'title', value)}
                  placeholder="Web Developer"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.input}
                  value={item.startDate}
                  onChangeText={(value) => updateExperienceField(index, 'startDate', value)}
                  placeholder="Jan 2024"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>End Date</Text>
                <TextInput
                  style={styles.input}
                  value={item.endDate}
                  onChangeText={(value) => updateExperienceField(index, 'endDate', value)}
                  placeholder="Dec 2024"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={item.location}
                  onChangeText={(value) => updateExperienceField(index, 'location', value)}
                  placeholder="Ottawa, Ontario"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Technologies / Tools</Text>
                <TextInput
                  style={styles.input}
                  value={item.technologies}
                  onChangeText={(value) => updateExperienceField(index, 'technologies', value)}
                  placeholder="React, Node.js, GitHub, REST APIs"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Detailed Description</Text>
                <TextInput
                  style={[styles.input, styles.largeTextArea]}
                  multiline
                  value={item.description}
                  onChangeText={(value) => updateExperienceField(index, 'description', value)}
                  placeholder="Describe responsibilities, impact, tools, collaboration, debugging, performance improvements, etc."
                  placeholderTextColor="#8C8C8C"
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>

          <View style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Projects</Text>
              <TouchableOpacity style={styles.smallActionButton} onPress={addProject}>
                <Text style={styles.smallActionButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {profile.projects.map((item, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>Project {index + 1}</Text>
                  {profile.projects.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeProject(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text style={styles.label}>Project Name</Text>
                <TextInput
                  style={styles.input}
                  value={item.name}
                  onChangeText={(value) => updateProjectField(index, 'name', value)}
                  placeholder="ResumAI"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Role</Text>
                <TextInput
                  style={styles.input}
                  value={item.role}
                  onChangeText={(value) => updateProjectField(index, 'role', value)}
                  placeholder="Full-Stack Developer"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Technologies</Text>
                <TextInput
                  style={styles.input}
                  value={item.technologies}
                  onChangeText={(value) => updateProjectField(index, 'technologies', value)}
                  placeholder="React Native, Expo, Node.js, OpenAI API"
                  placeholderTextColor="#8C8C8C"
                />

                <Text style={styles.label}>Link</Text>
                <TextInput
                  style={styles.input}
                  value={item.link}
                  onChangeText={(value) => updateProjectField(index, 'link', value)}
                  placeholder="GitHub or demo link"
                  placeholderTextColor="#8C8C8C"
                  autoCapitalize="none"
                />

                <Text style={styles.label}>Detailed Description</Text>
                <TextInput
                  style={[styles.input, styles.largeTextArea]}
                  multiline
                  value={item.description}
                  onChangeText={(value) => updateProjectField(index, 'description', value)}
                  placeholder="Describe what you built, why it matters, technical challenges, backend/frontend, APIs, etc."
                  placeholderTextColor="#8C8C8C"
                  textAlignVertical="top"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.primaryButton, saving && styles.disabledButton]}
            onPress={saveProfile}
            disabled={saving}
          >
            <Text style={styles.primaryButtonText}>
              {saving ? 'Saving...' : 'Save Profile'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={resetProfile}>
            <Text style={styles.secondaryButtonText}>Reset Profile</Text>
          </TouchableOpacity>
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
    marginBottom: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  entryCard: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#1E1E1E',
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  textArea: {
    minHeight: 110,
    paddingTop: 14,
  },
  largeTextArea: {
    minHeight: 150,
    paddingTop: 14,
  },
  smallActionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallActionButtonText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 13,
  },
  removeButton: {
    backgroundColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#111111',
    fontWeight: '800',
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#242424',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});