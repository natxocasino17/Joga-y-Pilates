/**
 * Progress — streaks, lifetime stats, a 7-day activity chart and achievements.
 * All derived from locally-stored session records.
 */
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { useTheme } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { todayKey } from '@/logic/routineGenerator';
import { formatMinutes } from '@/utils/format';

export default function ProgressScreen() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { progress } = useAppState();

  const last7 = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const s of progress.sessions) {
      byDate.set(s.date, (byDate.get(s.date) ?? 0) + s.durationSec);
    }
    const days: { key: string; label: string; seconds: number }[] = [];
    const dayLabels = locale === 'en'
      ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
      : ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      days.push({ key, label: dayLabels[d.getDay()], seconds: byDate.get(key) ?? 0 });
    }
    return days;
  }, [progress.sessions, locale]);

  const maxSeconds = Math.max(60, ...last7.map((d) => d.seconds));
  const totalMinutes = formatMinutes(progress.totalSeconds);

  const achievements = useMemo(
    () => [
      { id: 'first', icon: 'footsteps', unlocked: progress.totalSessions >= 1, es: 'Primer paso', en: 'First step' },
      { id: 'streak3', icon: 'flame', unlocked: progress.bestStreak >= 3, es: 'Racha de 3', en: '3-day streak' },
      { id: 'streak7', icon: 'bonfire', unlocked: progress.bestStreak >= 7, es: 'Una semana', en: 'One week' },
      { id: 'sessions10', icon: 'ribbon', unlocked: progress.totalSessions >= 10, es: '10 sesiones', en: '10 sessions' },
      { id: 'minutes60', icon: 'hourglass', unlocked: progress.totalSeconds >= 3600, es: '1 hora movida', en: '1 hour moved' },
      { id: 'sessions30', icon: 'trophy', unlocked: progress.totalSessions >= 30, es: 'Constancia', en: 'Consistency' },
    ],
    [progress]
  );

  const hasActivity = progress.totalSessions > 0;

  return (
    <Screen scroll>
      <AppText variant="largeTitle" style={{ marginTop: 8 }}>
        {t('progress.title')}
      </AppText>
      <AppText variant="subhead" color="textSecondary" style={{ marginBottom: 20 }}>
        {t('progress.subtitle')}
      </AppText>

      {/* Stat grid */}
      <View style={styles.statGrid}>
        <StatCard icon="flame" iconColor={theme.colors.warning} value={`${progress.currentStreak}`} label={t('progress.currentStreak')} />
        <StatCard icon="trophy-outline" iconColor={theme.colors.primary} value={`${progress.bestStreak}`} label={t('progress.bestStreak')} />
        <StatCard icon="checkmark-done" iconColor={theme.colors.primary} value={`${progress.totalSessions}`} label={t('progress.totalSessions')} />
        <StatCard icon="time-outline" iconColor={theme.colors.yoga} value={`${totalMinutes}`} label={t('progress.totalMinutes')} />
      </View>

      {/* 7-day chart */}
      <AppText variant="title3" style={{ marginTop: 28, marginBottom: 14 }}>
        {t('progress.last7days')}
      </AppText>
      <Card>
        {hasActivity ? (
          <View style={styles.chart}>
            {last7.map((d) => {
              const ratio = d.seconds / maxSeconds;
              const isToday = d.key === todayKey();
              return (
                <View key={d.key} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View
                      style={{
                        width: '100%',
                        height: `${Math.max(d.seconds > 0 ? 8 : 0, ratio * 100)}%`,
                        backgroundColor: d.seconds > 0 ? theme.colors.primary : 'transparent',
                        borderRadius: 6,
                      }}
                    />
                  </View>
                  <AppText
                    variant="caption"
                    style={{ marginTop: 8, color: isToday ? theme.colors.primary : theme.colors.textTertiary }}
                  >
                    {d.label}
                  </AppText>
                </View>
              );
            })}
          </View>
        ) : (
          <AppText variant="body" color="textSecondary" center style={{ paddingVertical: 24 }}>
            {t('progress.noActivity')}
          </AppText>
        )}
      </Card>

      {/* Achievements */}
      <AppText variant="title3" style={{ marginTop: 28, marginBottom: 14 }}>
        {t('progress.achievements')}
      </AppText>
      <View style={styles.achGrid}>
        {achievements.map((a) => (
          <View
            key={a.id}
            style={[
              styles.achItem,
              {
                backgroundColor: a.unlocked ? theme.colors.primarySoft : theme.colors.surfaceElevated,
                borderColor: a.unlocked ? theme.colors.primary : theme.colors.border,
              },
            ]}
          >
            <Ionicons
              name={a.icon as keyof typeof Ionicons.glyphMap}
              size={26}
              color={a.unlocked ? theme.colors.primary : theme.colors.textTertiary}
            />
            <AppText
              variant="caption"
              center
              style={{ marginTop: 6, color: a.unlocked ? theme.colors.text : theme.colors.textTertiary }}
            >
              {locale === 'en' ? a.en : a.es}
            </AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function StatCard({
  icon,
  iconColor,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string;
  label: string;
}) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={22} color={iconColor} />
      <AppText variant="title1" style={{ marginTop: 8 }}>
        {value}
      </AppText>
      <AppText variant="footnote" color="textSecondary" numberOfLines={1}>
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { width: '47%', alignItems: 'flex-start' },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 160 },
  barColumn: { flex: 1, alignItems: 'center' },
  barTrack: { width: 14, height: 120, justifyContent: 'flex-end' },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  achItem: {
    width: '30.7%',
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    padding: 8,
  },
});
