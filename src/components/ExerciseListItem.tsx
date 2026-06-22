/** A compact exercise row: illustration thumbnail + name + prescription. */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './ui/AppText';
import { Card } from './ui/Card';
import { PoseIllustration } from './illustrations/PoseIllustration';
import { disciplineColor, useTheme } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { Exercise } from '@/data/types';
import { formatClock } from '@/utils/format';

interface Props {
  exercise: Exercise;
  /** Optional resolved prescription to display instead of the defaults. */
  durationSec?: number;
  reps?: number;
  index?: number;
  onPress?: () => void;
}

export function ExerciseListItem({ exercise, durationSec, reps, index, onPress }: Props) {
  const theme = useTheme();
  const { locale, t } = useI18n();
  const accent = disciplineColor(theme.colors, exercise.discipline);

  const meta = (() => {
    if (exercise.mode === 'reps') {
      const r = reps ?? exercise.reps ?? 0;
      return `${r} ${t('common.reps')}${exercise.bilateral ? ' ×2' : ''}`;
    }
    const d = durationSec ?? exercise.durationSec;
    return `${formatClock(d)}${exercise.bilateral ? ' ×2' : ''}`;
  })();

  return (
    <Card onPress={onPress} padded={false} elevated={false} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.thumb, { backgroundColor: theme.colors.surfaceSunken }]}>
          <PoseIllustration name={exercise.illustration} color={accent} size={52} strokeWidth={4.5} />
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          {index !== undefined ? (
            <AppText variant="caption" style={{ color: accent, marginBottom: 2 }}>
              {String(index + 1).padStart(2, '0')} · {t(`disciplines.${exercise.discipline}`)}
            </AppText>
          ) : null}
          <AppText variant="headline" numberOfLines={1}>
            {exercise.name[locale]}
          </AppText>
          <View style={styles.metaRow}>
            <Ionicons
              name={exercise.mode === 'reps' ? 'repeat-outline' : 'time-outline'}
              size={14}
              color={theme.colors.textTertiary}
            />
            <AppText variant="footnote" color="textSecondary" style={{ marginLeft: 4 }}>
              {meta}
            </AppText>
          </View>
        </View>
        {onPress ? <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});
