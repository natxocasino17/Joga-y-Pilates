/**
 * Session player — the guided workout experience.
 *
 * Builds a flat list of segments from the routine (a "get ready" countdown,
 * one work segment per exercise — split per side for bilateral moves — and
 * rests between them), then walks through them. Timed/hold segments auto-advance
 * via a pausable countdown; rep-based segments wait for the user to tap done.
 * On completion it records the session for streaks and stats.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { PoseIllustration } from '@/components/illustrations/PoseIllustration';
import { useTheme, disciplineColor } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { getExercise } from '@/data/exercises';
import { Exercise } from '@/data/types';
import { formatClock, formatMinutes } from '@/utils/format';

type SegmentKind = 'prepare' | 'work' | 'rest';

interface Segment {
  kind: SegmentKind;
  exerciseId?: string;
  side?: 'left' | 'right';
  durationSec?: number; // for prepare / timed-work / rest
  reps?: number; // for rep-based work
  nextExerciseId?: string; // for rest preview
}

const PREPARE_SEC = 5;

function buildSegments(items: { exerciseId: string; durationSec?: number; reps?: number; restSec: number }[]): Segment[] {
  const segments: Segment[] = [{ kind: 'prepare', durationSec: PREPARE_SEC }];

  items.forEach((it, idx) => {
    const ex = getExercise(it.exerciseId);
    if (!ex) return;
    const sides: (('left' | 'right') | undefined)[] = ex.bilateral ? ['left', 'right'] : [undefined];

    for (const side of sides) {
      if (ex.mode === 'reps') {
        segments.push({ kind: 'work', exerciseId: ex.id, side, reps: it.reps });
      } else {
        segments.push({ kind: 'work', exerciseId: ex.id, side, durationSec: it.durationSec });
      }
    }

    const isLast = idx === items.length - 1;
    if (!isLast && it.restSec > 0) {
      segments.push({ kind: 'rest', durationSec: it.restSec, nextExerciseId: items[idx + 1]?.exerciseId });
    }
  });

  return segments;
}

export default function Player() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();
  const { todayRoutine, recordSession } = useAppState();

  const segments = useMemo(() => (todayRoutine ? buildSegments(todayRoutine.items) : []), [todayRoutine]);

  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(segments[0]?.durationSec ?? 0);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const recorded = useRef(false);

  const current = segments[index];
  const isTimed = current && current.kind !== 'work' ? true : current?.kind === 'work' && current?.durationSec !== undefined;

  const accent =
    todayRoutine && todayRoutine.focus.length === 1
      ? disciplineColor(theme.colors, todayRoutine.focus[0])
      : theme.colors.primary;

  const advance = useCallback(() => {
    setIndex((i) => {
      const nextIndex = i + 1;
      if (nextIndex >= segments.length) {
        setFinished(true);
        return i;
      }
      const seg = segments[nextIndex];
      setRemaining(seg.durationSec ?? 0);
      setPaused(false);
      if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      return nextIndex;
    });
  }, [segments]);

  // Countdown tick for timed segments. Anchored to a wall-clock deadline
  // (rather than decrementing by 1 each tick) so the displayed time stays
  // accurate even if a tick is delayed — e.g. when the JS thread is busy or
  // the app was backgrounded — instead of drifting or looking stuck.
  useEffect(() => {
    if (finished || paused || !current) return;
    const hasTimer = current.kind !== 'work' || current.durationSec !== undefined;
    if (!hasTimer) return;

    const deadline = Date.now() + remaining * 1000;
    const tick = () => {
      const secLeft = Math.ceil((deadline - Date.now()) / 1000);
      if (secLeft <= 0) {
        clearInterval(id);
        setRemaining(0);
        advance();
      } else {
        setRemaining(secLeft);
      }
    };
    const id = setInterval(tick, 200);
    return () => clearInterval(id);
    // `remaining` is intentionally read once as the starting point, not watched —
    // watching it would restart the deadline every tick and defeat the fix.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, finished, current, advance]);

  // Record the completed session once.
  useEffect(() => {
    if (finished && !recorded.current && todayRoutine) {
      recorded.current = true;
      recordSession({
        focus: todayRoutine.focus,
        durationSec: todayRoutine.estimatedSec,
        exerciseCount: todayRoutine.items.length,
      });
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
  }, [finished, todayRoutine, recordSession]);

  const confirmExit = () => {
    if (finished) {
      router.back();
      return;
    }
    if (Platform.OS === 'web') {
      router.back();
      return;
    }
    Alert.alert(t('player.exit'), t('player.exitConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('player.exit'), style: 'destructive', onPress: () => router.back() },
    ]);
  };

  if (!todayRoutine || segments.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <AppText>—</AppText>
      </SafeAreaView>
    );
  }

  if (finished) {
    return <CompletionView accent={accent} onClose={() => router.back()} />;
  }

  const overallProgress = index / segments.length;
  const segDuration = current.durationSec ?? 1;
  const segProgress = isTimed ? 1 - remaining / segDuration : 0;

  const workEx: Exercise | undefined = current.exerciseId ? getExercise(current.exerciseId) : undefined;
  const nextEx: Exercise | undefined = current.nextExerciseId ? getExercise(current.nextExerciseId) : undefined;

  const sideLabel = current.side
    ? current.side === 'left'
      ? locale === 'en'
        ? 'Left side'
        : 'Lado izquierdo'
      : locale === 'en'
        ? 'Right side'
        : 'Lado derecho'
    : undefined;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={confirmExit} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="close" size={28} color={theme.colors.textSecondary} />
        </Pressable>
        <View style={[styles.overallTrack, { backgroundColor: theme.colors.separator }]}>
          <View style={{ width: `${overallProgress * 100}%`, height: '100%', backgroundColor: accent, borderRadius: 3 }} />
        </View>
        <View style={styles.iconBtn} />
      </View>

      {/* Main */}
      <View style={styles.main}>
        {current.kind === 'prepare' ? (
          <PrepareView remaining={remaining} accent={accent} nextEx={getExercise(todayRoutine.items[0]?.exerciseId)} />
        ) : current.kind === 'rest' ? (
          <RestView remaining={remaining} total={current.durationSec ?? 1} accent={accent} nextEx={nextEx} />
        ) : workEx ? (
          <WorkView
            exercise={workEx}
            accent={accent}
            isTimed={!!current.durationSec}
            remaining={remaining}
            segProgress={segProgress}
            reps={current.reps}
            sideLabel={sideLabel}
          />
        ) : null}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {isTimed ? (
          <Pressable
            onPress={() => setPaused((p) => !p)}
            style={[styles.controlBtn, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}
          >
            <Ionicons name={paused ? 'play' : 'pause'} size={22} color={theme.colors.text} />
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }}>
          <Button
            label={current.kind === 'work' && !current.durationSec ? t('player.complete') : t('player.skip')}
            icon={current.kind === 'work' && !current.durationSec ? 'checkmark' : 'play-skip-forward'}
            color={accent}
            onPress={advance}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function PrepareView({ remaining, accent, nextEx }: { remaining: number; accent: string; nextEx?: Exercise }) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  return (
    <View style={styles.centered}>
      <AppText variant="overline" color="textTertiary">
        {t('player.getReady').toUpperCase()}
      </AppText>
      <ProgressRing progress={1 - remaining / PREPARE_SEC} color={accent} trackColor={theme.colors.separator} size={200}>
        <AppText style={{ fontSize: 72, fontWeight: '700', color: theme.colors.text }}>{remaining}</AppText>
      </ProgressRing>
      {nextEx ? (
        <AppText variant="title3" center style={{ marginTop: 24 }}>
          {nextEx.name[locale]}
        </AppText>
      ) : null}
    </View>
  );
}

function RestView({ remaining, total, accent, nextEx }: { remaining: number; total: number; accent: string; nextEx?: Exercise }) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  return (
    <View style={styles.centered}>
      <AppText variant="overline" style={{ color: accent }}>
        {t('player.rest').toUpperCase()}
      </AppText>
      <ProgressRing
        progress={1 - remaining / total}
        color={accent}
        trackColor={theme.colors.separator}
        size={200}
      >
        <AppText style={{ fontSize: 60, fontWeight: '700', color: theme.colors.text }}>{formatClock(remaining)}</AppText>
      </ProgressRing>
      {nextEx ? (
        <View style={{ alignItems: 'center', marginTop: 28 }}>
          <AppText variant="footnote" color="textTertiary">
            {t('player.next').toUpperCase()}
          </AppText>
          <View style={[styles.nextChip, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
            <PoseIllustration name={nextEx.illustration} color={accent} size={32} strokeWidth={5} />
            <AppText variant="headline" style={{ marginLeft: 10 }}>
              {nextEx.name[locale]}
            </AppText>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function WorkView({
  exercise,
  accent,
  isTimed,
  remaining,
  segProgress,
  reps,
  sideLabel,
}: {
  exercise: Exercise;
  accent: string;
  isTimed: boolean;
  remaining: number;
  segProgress: number;
  reps?: number;
  sideLabel?: string;
}) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  return (
    <View style={{ flex: 1, justifyContent: 'space-between', paddingVertical: 8 }}>
      <View style={styles.workHeader}>
        {sideLabel ? (
          <AppText variant="caption" style={{ color: accent, marginBottom: 4 }}>
            {sideLabel.toUpperCase()}
          </AppText>
        ) : null}
        <AppText variant="title1" center>
          {exercise.name[locale]}
        </AppText>
      </View>

      <View style={{ alignItems: 'center' }}>
        {isTimed ? (
          <ProgressRing progress={segProgress} color={accent} trackColor={theme.colors.separator} size={230} strokeWidth={14}>
            <View style={{ alignItems: 'center' }}>
              <PoseIllustration name={exercise.illustration} color={accent} size={96} strokeWidth={4} />
              <AppText style={{ fontSize: 40, fontWeight: '700', color: theme.colors.text, marginTop: 4 }}>
                {formatClock(remaining)}
              </AppText>
            </View>
          </ProgressRing>
        ) : (
          <View style={{ alignItems: 'center' }}>
            <View style={[styles.repsBubble, { backgroundColor: theme.colors.surfaceElevated }]}>
              <PoseIllustration name={exercise.illustration} color={accent} size={120} strokeWidth={4} />
            </View>
            <AppText style={{ fontSize: 56, fontWeight: '700', color: theme.colors.text, marginTop: 16 }}>
              {reps ?? exercise.reps}
            </AppText>
            <AppText variant="headline" color="textSecondary">
              {t('common.reps')}
            </AppText>
          </View>
        )}
      </View>

      {/* Cue + breathing */}
      <View style={styles.cueBox}>
        <AppText variant="body" color="textSecondary" center>
          {exercise.steps[locale][0]}
        </AppText>
        <View style={styles.breatheRow}>
          <Ionicons name="water-outline" size={15} color={accent} />
          <AppText variant="footnote" style={{ color: accent, marginLeft: 5 }}>
            {exercise.breathing[locale]}
          </AppText>
        </View>
      </View>
    </View>
  );
}

function CompletionView({ accent, onClose }: { accent: string; onClose: () => void }) {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { todayRoutine } = useAppState();
  const minutes = todayRoutine ? formatMinutes(todayRoutine.estimatedSec) : 0;
  const count = todayRoutine?.items.length ?? 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.centered, { flex: 1, paddingHorizontal: 28 }]}>
        <View style={{ width: 130, height: 130, borderRadius: 65, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="checkmark" size={72} color="#fff" />
        </View>
        <AppText variant="largeTitle" center style={{ marginTop: 28 }}>
          {t('player.sessionComplete')}
        </AppText>
        <AppText variant="body" color="textSecondary" center style={{ marginTop: 8 }}>
          {t('player.youMoved')}
        </AppText>

        <View style={styles.completionStats}>
          <View style={styles.completionStat}>
            <AppText variant="title1" style={{ color: accent }}>
              {minutes}
            </AppText>
            <AppText variant="footnote" color="textSecondary">
              {locale === 'en' ? 'minutes' : 'minutos'}
            </AppText>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.colors.separator }]} />
          <View style={styles.completionStat}>
            <AppText variant="title1" style={{ color: accent }}>
              {count}
            </AppText>
            <AppText variant="footnote" color="textSecondary">
              {locale === 'en' ? 'exercises' : 'ejercicios'}
            </AppText>
          </View>
        </View>
      </View>
      <View style={{ padding: 24 }}>
        <Button label={t('player.backHome')} color={accent} onPress={onClose} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, gap: 12 },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  overallTrack: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  main: { flex: 1, paddingHorizontal: 24 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingBottom: 12, paddingTop: 8 },
  controlBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  workHeader: { alignItems: 'center', minHeight: 70, justifyContent: 'center' },
  repsBubble: { width: 180, height: 180, borderRadius: 90, alignItems: 'center', justifyContent: 'center' },
  cueBox: { paddingHorizontal: 8, minHeight: 80 },
  breatheRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  nextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 10,
  },
  completionStats: { flexDirection: 'row', alignItems: 'center', marginTop: 40, gap: 24 },
  completionStat: { alignItems: 'center' },
  statDivider: { width: StyleSheet.hairlineWidth, height: 40 },
});
