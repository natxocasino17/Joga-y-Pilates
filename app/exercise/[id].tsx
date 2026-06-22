/** Exercise detail: big illustration, step-by-step cues, tips and breathing. */
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { PoseIllustration } from '@/components/illustrations/PoseIllustration';
import { useTheme, disciplineColor } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { getExercise } from '@/data/exercises';
import { formatClock } from '@/utils/format';

export default function ExerciseDetail() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const exercise = getExercise(id);

  if (!exercise) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>Not found</AppText>
      </SafeAreaView>
    );
  }

  const accent = disciplineColor(theme.colors, exercise.discipline);
  const meta =
    exercise.mode === 'reps'
      ? `${exercise.reps} ${t('common.reps')}`
      : formatClock(exercise.durationSec);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Hero illustration */}
      <SafeAreaView edges={['top']} style={{ backgroundColor: accent }}>
        <View style={styles.heroHeader}>
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </Pressable>
          <View style={styles.disciplineTag}>
            <AppText variant="caption" style={{ color: '#fff' }}>
              {t(`disciplines.${exercise.discipline}`).toUpperCase()}
            </AppText>
          </View>
        </View>
        <View style={styles.heroIllustration}>
          <PoseIllustration name={exercise.illustration} color="#fff" size={150} strokeWidth={4} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <AppText variant="title1">{exercise.name[locale]}</AppText>
        <AppText variant="body" color="textSecondary" style={{ marginTop: 6 }}>
          {exercise.summary[locale]}
        </AppText>

        {/* Quick meta */}
        <View style={styles.metaRow}>
          <MetaPill icon={exercise.mode === 'reps' ? 'repeat-outline' : 'time-outline'} text={meta} />
          {exercise.levels.map((l) => (
            <MetaPill key={l} icon="podium-outline" text={t(`levels.${l}`)} />
          ))}
          {exercise.bilateral ? <MetaPill icon="swap-horizontal-outline" text={locale === 'en' ? 'Both sides' : 'Ambos lados'} /> : null}
        </View>

        {/* Instructions */}
        <SectionTitle icon="list-outline" text={t('player.instructions')} />
        {exercise.steps[locale].map((step, i) => (
          <View key={i} style={styles.step}>
            <View style={[styles.stepNum, { backgroundColor: theme.colors.primarySoft }]}>
              <AppText variant="caption" style={{ color: theme.colors.primary }}>
                {i + 1}
              </AppText>
            </View>
            <AppText variant="body" style={{ flex: 1 }}>
              {step}
            </AppText>
          </View>
        ))}

        {/* Breathing */}
        <SectionTitle icon="water-outline" text={t('player.breathing')} />
        <Card>
          <AppText variant="body">{exercise.breathing[locale]}</AppText>
        </Card>

        {/* Tips */}
        {exercise.tips[locale].length > 0 ? (
          <>
            <SectionTitle icon="bulb-outline" text={t('player.tips')} />
            {exercise.tips[locale].map((tip, i) => (
              <View key={i} style={styles.step}>
                <Ionicons name="leaf" size={16} color={accent} style={{ marginTop: 3 }} />
                <AppText variant="body" color="textSecondary" style={{ flex: 1, marginLeft: 10 }}>
                  {tip}
                </AppText>
              </View>
            ))}
          </>
        ) : null}

        {/* Tags */}
        <SectionTitle icon="pricetags-outline" text={t('library.byZone')} />
        <View style={styles.tagWrap}>
          {exercise.zones.map((z) => (
            <View key={z} style={[styles.tag, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
              <AppText variant="footnote" color="textSecondary">
                {t(`zones.${z}`)}
              </AppText>
            </View>
          ))}
          {exercise.goals.map((g) => (
            <View key={g} style={[styles.tag, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
              <AppText variant="footnote" color="textSecondary">
                {t(`goals.${g}`)}
              </AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function MetaPill({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const theme = useTheme();
  return (
    <View style={[styles.metaPill, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
      <Ionicons name={icon} size={14} color={theme.colors.textSecondary} />
      <AppText variant="footnote" color="textSecondary" style={{ marginLeft: 5 }}>
        {text}
      </AppText>
    </View>
  );
}

function SectionTitle({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.sectionTitle}>
      <Ionicons name={icon} size={18} color={theme.colors.primary} />
      <AppText variant="title3" style={{ marginLeft: 8 }}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  disciplineTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  heroIllustration: { alignItems: 'center', paddingBottom: 24, paddingTop: 4 },
  content: { padding: 20, paddingBottom: 56 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', marginTop: 28, marginBottom: 14 },
  step: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  stepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
