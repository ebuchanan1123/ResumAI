import React from 'react';
import { Link } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const featureCards = [
  {
    title: 'Resume Tailoring',
    body: 'Generate a tailored resume from your saved profile and a pasted job description or job link.',
  },
  {
    title: 'ATS Insights',
    body: 'See keyword coverage, recruiter-style feedback, missing signals, and fit guidance before you apply.',
  },
  {
    title: 'Application Kit',
    body: 'Package your resume, cover letter, optimized bullets, and application messaging in one place.',
  },
  {
    title: 'Interview Prep',
    body: 'Turn the tailored resume into likely questions, strongest talking points, and fit explanations.',
  },
];

const workflowSteps = [
  'Save your profile once',
  'Paste a job link or description',
  'Generate a tailored resume in seconds',
  'Export the PDF, build the cover letter, and prep for the interview',
];

export default function HomePage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.contentContainer}>
        <View style={styles.heroShell}>
          <View style={styles.heroCopy}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>AI Job Application Copilot</Text>
            </View>

            <Text style={styles.title}>Paste the role. ResumAI does the heavy lifting.</Text>

            <Text style={styles.subtitle}>
              ResumAI helps you tailor your resume, generate a cover letter, rewrite bullets,
              analyze ATS fit, and prepare for the interview from one saved profile.
            </Text>

            <View style={styles.ctaRow}>
              <Link href="/resume" asChild>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Start With A Job Posting</Text>
                </TouchableOpacity>
              </Link>

              <Link href="/profile" asChild>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Build Your Profile</Text>
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.inlineTrustRow}>
              <Text style={styles.inlineTrustText}>Stored locally on your device</Text>
              <Text style={styles.inlineTrustDivider}>•</Text>
              <Text style={styles.inlineTrustText}>Export-ready PDFs</Text>
              <Text style={styles.inlineTrustDivider}>•</Text>
              <Text style={styles.inlineTrustText}>Job-link import supported</Text>
            </View>
          </View>

          <View style={styles.heroPanel}>
            <View style={styles.heroPanelCard}>
              <Text style={styles.heroPanelEyebrow}>What ResumAI handles</Text>
              {workflowSteps.map((step, index) => (
                <View key={step} style={styles.workflowRow}>
                  <View style={styles.workflowDot}>
                    <Text style={styles.workflowDotText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.workflowText}>{step}</Text>
                </View>
              ))}
            </View>

            <View style={styles.heroPanelCardAlt}>
              <Text style={styles.heroPanelTitle}>One input, multiple outputs</Text>
              <Text style={styles.heroPanelBody}>
                Resume, cover letter, ATS guidance, recruiter message, bullet rewrites, and
                interview prep all built around the same target role.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.featureSection}>
          <Text style={styles.sectionEyebrow}>Why It Helps</Text>
          <Text style={styles.sectionTitle}>A faster application workflow from start to finish</Text>
          <Text style={styles.sectionSubtitle}>
            Instead of rewriting everything manually for every posting, ResumAI keeps your core
            profile in place and adapts the application around the role.
          </Text>

          <View style={styles.featureGrid}>
            {featureCards.map((card) => (
              <View key={card.title} style={styles.featureCard}>
                <Text style={styles.featureTitle}>{card.title}</Text>
                <Text style={styles.featureBody}>{card.body}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.valueStrip}>
          <View style={styles.valueStripItem}>
            <Text style={styles.valueStripTitle}>Paste the job link</Text>
            <Text style={styles.valueStripBody}>
              Import supported job postings and auto-fill the role details faster.
            </Text>
          </View>
          <View style={styles.valueStripItem}>
            <Text style={styles.valueStripTitle}>See the gaps</Text>
            <Text style={styles.valueStripBody}>
              Get ATS feedback, keyword alignment, and fit guidance before you hit apply.
            </Text>
          </View>
          <View style={styles.valueStripItem}>
            <Text style={styles.valueStripTitle}>Show up prepared</Text>
            <Text style={styles.valueStripBody}>
              Use tailored interview prep so the story you tell matches the resume you send.
            </Text>
          </View>
        </View>

        <View style={styles.finalCard}>
          <Text style={styles.finalTitle}>Build stronger applications without rewriting everything by hand.</Text>
          <Text style={styles.finalSubtitle}>
            Save your profile once, target each role faster, and let ResumAI handle the tailoring,
            export, and prep workflow around it.
          </Text>

          <View style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>Privacy note</Text>
            <Text style={styles.privacyText}>
              Your saved profile and drafts stay stored locally on your device while you use
              ResumAI. We do not have access to your saved application data.
            </Text>
          </View>

          <Link href="/resume" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Try ResumAI</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 80,
  },
  heroShell: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    marginBottom: 36,
  },
  heroCopy: {
    flex: 1.05,
    minWidth: 320,
    paddingRight: 16,
    paddingBottom: 16,
  },
  heroPanel: {
    flex: 0.95,
    minWidth: 320,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 18,
  },
  badgeText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: '#0F172A',
    fontSize: 58,
    lineHeight: 64,
    fontWeight: '900',
    marginBottom: 16,
    maxWidth: 720,
  },
  subtitle: {
    color: '#475569',
    fontSize: 19,
    lineHeight: 29,
    marginBottom: 24,
    maxWidth: 680,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontWeight: '800',
    fontSize: 16,
  },
  inlineTrustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  inlineTrustText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
    marginRight: 8,
    marginBottom: 8,
  },
  inlineTrustDivider: {
    color: '#94A3B8',
    marginRight: 8,
    marginBottom: 8,
  },
  heroPanelCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 22,
    marginBottom: 14,
  },
  heroPanelCardAlt: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    padding: 20,
  },
  heroPanelEyebrow: {
    color: '#93C5FD',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  heroPanelTitle: {
    color: '#0F172A',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 10,
  },
  heroPanelBody: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 24,
  },
  workflowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  workflowDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workflowDotText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  workflowText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },
  featureSection: {
    marginBottom: 32,
  },
  sectionEyebrow: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#1E293B',
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#64748B',
    fontSize: 17,
    lineHeight: 26,
    maxWidth: 760,
    marginBottom: 18,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  featureCard: {
    flexGrow: 1,
    flexBasis: 260,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 22,
    padding: 20,
    marginRight: 14,
    marginBottom: 14,
  },
  featureTitle: {
    color: '#1E293B',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 8,
  },
  featureBody: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 23,
  },
  valueStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 32,
  },
  valueStripItem: {
    flexGrow: 1,
    flexBasis: 280,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 22,
    padding: 18,
    marginRight: 14,
    marginBottom: 14,
  },
  valueStripTitle: {
    color: '#1D4ED8',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  valueStripBody: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
  finalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 28,
    padding: 24,
  },
  finalTitle: {
    color: '#1E293B',
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
    marginBottom: 10,
    maxWidth: 760,
  },
  finalSubtitle: {
    color: '#64748B',
    fontSize: 18,
    lineHeight: 27,
    marginBottom: 20,
    maxWidth: 760,
  },
  privacyCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 20,
    width: '100%',
    maxWidth: 760,
  },
  privacyTitle: {
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  privacyText: {
    color: '#475569',
    fontSize: 14,
    lineHeight: 22,
  },
});
