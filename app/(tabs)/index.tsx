/**
 * Today — the home screen. Greets the user, shows their streak and the
 * generated routine of the day with a clear call to start the session.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Glow } from '@/components/ui/Glow';
import { ExerciseListItem } from '@/components/ExerciseListItem';
import { PoseIllustration } from '@/components/illustrations/PoseIllustration';
import { useTheme, disciplineColor } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { getExercise } from '@/data/exercises';
import { darken, focusLabel, formatMinutes } from '@/utils/format';

function greetingKey(): 'home.greetingMorning' | 'home.greetingAfternoon' | 'home.greetingEvening' {
  const h = new Date().getHours();
  if (h < 12) return 'home.greetingMorning';
  if (h < 19) return 'home.greetingAfternoon';
  return 'home.greetingEvening';
}

export default function Today() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { profile, todayRoutine, isTodayComplete, progress, regenerateToday } = useAppState();
  const router = useRouter();

  if (!profile || !todayRoutine) return <Screen />;

  const accent =
    todayRoutine.focus.length === 1
      ? disciplineColor(theme.colors, todayRoutine.focus[0])
      : theme.colors.primary;
  const heroGradient: [string, string] = [accent, darken(accent, 0.28)];

  const items = todayRoutine.items;
  const minutes = formatMinutes(todayRoutine.estimatedSec);

  return (
    <Screen scroll>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <AppText variant="subhead" color="textSecondary">
            {t(greetingKey())},
          </AppText>
          <AppText variant="largeTitle">{profile.name}</AppText>
        </View>
        <View style={[styles.streakPill, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
          <Ionicons name="flame" size={18} color={theme.colors.warning} />
          <AppText variant="headline" style={{ marginLeft: 4 }}>
            {progress.currentStreak}
          </AppText>
        </View>
      </View>

      {isTodayComplete ? (
        <CompletedCard />
      ) : (
        <>
          {/* Hero routine card */}
          <Card style={styles.hero} elevated={false} padded={false}>
            <LinearGradient colors={heroGradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
            <Glow color="#FFFFFF" opacity={0.3} cx="80%" cy="0%" r="85%" />
            <View style={styles.heroContent}>
              <AppText variant="overline" style={{ color: 'rgba(255,255,255,0.8)' }}>
                {t('home.todaySubtitle').toUpperCase()}
              </AppText>
              <AppText variant="title1" style={{ color: '#fff', marginTop: 6 }}>
                {focusLabel(t, todayRoutine.focus)} · {t(`levels.${todayRoutine.level}`)}
              </AppText>
              <View style={styles.heroMeta}>
                <View style={styles.heroMetaItem}>
                  <Ionicons name="time-outline" size={16} color="#fff" />
                  <AppText variant="subhead" style={{ color: '#fff', marginLeft: 5 }}>
                    ~{minutes} {t('common.min')}
                  </AppText>
                </View>
                <View style={styles.heroMetaItem}>
                  <Ionicons name="layers-outline" size={16} color="#fff" />
                  <AppText variant="subhead" style={{ color: '#fff', marginLeft: 5 }}>
                    {items.length} {t('home.exercises')}
                  </AppText>
                </View>
              </View>
            </View>
            {/* Preview illustrations */}
            <View style={styles.previewStrip}>
              {items.slice(0, 4).map((it, i) => {
                const ex = getExercise(it.exerciseId);
                if (!ex) return null;
                return (
                  <View key={i} style={styles.previewBubble}>
                    <PoseIllustration name={ex.illustration} color="#fff" size={40} strokeWidth={5} />
                  </View>
                );
              })}
            </View>
          </Card>

          <View style={{ marginTop: 16 }}>
            <Button label={t('home.startSession')} icon="play" onPress={() => router.push('/player')} />
          </View>

          {/* Exercise list */}
          <View style={styles.listHeader}>
            <AppText variant="title3">{t('home.todayRoutine')}</AppText>
            <Button
              label={t('home.regenerate')}
              variant="ghost"
              fullWidth={false}
              icon="refresh-outline"
              onPress={regenerateToday}
              style={{ paddingVertical: 6, paddingHorizontal: 0 }}
            />
          </View>

          {items.map((it, i) => {
            const ex = getExercise(it.exerciseId);
            if (!ex) return null;
            return (
              <ExerciseListItem
                key={`${it.exerciseId}-${i}`}
                exercise={ex}
                durationSec={it.durationSec}
                reps={it.reps}
                index={i}
                onPress={() => router.push(`/exercise/${ex.id}`)}
              />
            );
          })}
        </>
      )}
    </Screen>
  );
}

function CompletedCard() {
  const theme = useTheme();
  const { t } = useI18n();
  return (
    <Card style={{ alignItems: 'center', paddingVertical: 40, marginTop: 8 }}>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          backgroundColor: theme.colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        <Ionicons name="checkmark-done" size={48} color={theme.colors.primary} />
      </View>
      <AppText variant="title2" center>
        {t('home.completedToday')}
      </AppText>
      <AppText variant="body" color="textSecondary" center style={{ marginTop: 8 }}>
        {t('home.completedSubtitle')}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 20 },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
  },
  hero: { overflow: 'hidden' },
  heroContent: { padding: 22 },
  heroMeta: { flexDirection: 'row', gap: 18, marginTop: 16 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center' },
  previewStrip: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    paddingBottom: 22,
  },
  previewBubble: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 28,
    marginBottom: 12,
  },
});
