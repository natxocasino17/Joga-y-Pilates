/**
 * Onboarding flow — a single screen with internal steps. Collects everything
 * the routine generator needs (focus, level, time, zones, goals, injuries),
 * builds a UserProfile and hands off to the main app.
 */
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { PoseIllustration } from '@/components/illustrations/PoseIllustration';
import { useTheme, disciplineColor, Discipline } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { DISCIPLINES, DISCIPLINE_ICONS, GOALS, INJURIES, LEVELS, SESSION_PRESETS, ZONES } from '@/data/catalog';
import { BodyZone, Goal, Injury, Level, UserProfile } from '@/data/types';

const STEP_COUNT = 8;

export default function Onboarding() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { completeOnboarding } = useAppState();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [focus, setFocus] = useState<Discipline[]>([]);
  const [level, setLevel] = useState<Level | null>(null);
  const [minutes, setMinutes] = useState<number>(15);
  const [zones, setZones] = useState<BodyZone[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [injuries, setInjuries] = useState<Injury[]>([]);

  const tap = () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
  };

  const toggle = <T,>(arr: T[], val: T, set: (v: T[]) => void) => {
    tap();
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  const canAdvance = (): boolean => {
    switch (step) {
      case 2:
        return focus.length > 0;
      case 3:
        return level !== null;
      default:
        return true;
    }
  };

  const finish = async () => {
    const profile: UserProfile = {
      name: name.trim() || (locale === 'en' ? 'friend' : 'amiga'),
      focus,
      level: level ?? 'beginner',
      sessionMinutes: minutes,
      zones,
      goals,
      injuries,
    };
    await completeOnboarding(profile);
    router.replace('/(tabs)');
  };

  const next = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (step >= STEP_COUNT - 1) {
      finish();
    } else {
      setStep((s) => s + 1);
    }
  };

  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <Screen padded={false} edges={['top', 'bottom']}>
      {/* Progress + back */}
      <View style={styles.topBar}>
        {step > 0 ? (
          <Pressable onPress={back} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={theme.colors.text} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <View style={styles.progressTrack}>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                {
                  backgroundColor: i <= step ? theme.colors.primary : theme.colors.separator,
                  flex: i <= step ? 1.4 : 1,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.backBtn} />
      </View>

      <View style={styles.body}>
        {step === 0 && <WelcomeStep />}
        {step === 1 && <NameStep name={name} setName={setName} />}
        {step === 2 && <FocusStep focus={focus} toggleFocus={(f) => toggle(focus, f, setFocus)} />}
        {step === 3 && <LevelStep level={level} setLevel={setLevel} />}
        {step === 4 && <TimeStep minutes={minutes} setMinutes={setMinutes} />}
        {step === 5 && (
          <WorkStep
            zones={zones}
            goals={goals}
            toggleZone={(z) => toggle(zones, z, setZones)}
            toggleGoal={(g) => toggle(goals, g, setGoals)}
          />
        )}
        {step === 6 && (
          <InjuriesStep
            injuries={injuries}
            toggle={(i) => toggle(injuries, i, setInjuries)}
            clear={() => {
              tap();
              setInjuries([]);
            }}
          />
        )}
        {step === 7 && <FinishStep name={name} />}
      </View>

      <View style={styles.footer}>
        <Button
          label={
            step === 0
              ? t('onboarding.getStarted')
              : step === STEP_COUNT - 1
                ? t('onboarding.finishCta')
                : t('common.continue')
          }
          onPress={next}
          disabled={!canAdvance()}
        />
      </View>
    </Screen>
  );
}

// ── Steps ──────────────────────────────────────────────────────────────────

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: 28 }}>
      <AppText variant="title1">{title}</AppText>
      {subtitle ? (
        <AppText variant="body" color="textSecondary" style={{ marginTop: 8 }}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

function WelcomeStep() {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 160,
          height: 160,
          borderRadius: 80,
          backgroundColor: theme.colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
        }}
      >
        <PoseIllustration name="tree" color={theme.colors.primary} size={120} />
      </View>
      <AppText variant="largeTitle" center>
        {t('onboarding.welcomeTitle')}
      </AppText>
      <AppText variant="body" color="textSecondary" center style={{ marginTop: 12, paddingHorizontal: 8 }}>
        {t('onboarding.welcomeSubtitle')}
      </AppText>
    </View>
  );
}

function NameStep({ name, setName }: { name: string; setName: (v: string) => void }) {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View>
      <StepHeader title={t('onboarding.nameTitle')} subtitle={t('onboarding.nameSubtitle')} />
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('onboarding.namePlaceholder')}
        placeholderTextColor={theme.colors.textTertiary}
        autoFocus
        returnKeyType="done"
        style={{
          fontSize: 22,
          fontWeight: '600',
          color: theme.colors.text,
          borderBottomWidth: 2,
          borderBottomColor: theme.colors.primary,
          paddingVertical: 12,
        }}
      />
    </View>
  );
}

function BigOption({
  title,
  subtitle,
  icon,
  selected,
  accent,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  accent: string;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.bigOption,
        {
          backgroundColor: selected ? accent : theme.colors.surfaceElevated,
          borderColor: selected ? accent : theme.colors.border,
          borderRadius: theme.radius.lg,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View
        style={{
          width: 46,
          height: 46,
          borderRadius: 23,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selected ? 'rgba(255,255,255,0.2)' : theme.colors.surfaceSunken,
        }}
      >
        <Ionicons name={icon} size={24} color={selected ? theme.colors.onPrimary : accent} />
      </View>
      <View style={{ flex: 1, marginLeft: 14 }}>
        <AppText variant="headline" style={{ color: selected ? theme.colors.onPrimary : theme.colors.text }}>
          {title}
        </AppText>
        <AppText
          variant="footnote"
          style={{ color: selected ? theme.colors.onPrimary : theme.colors.textSecondary, marginTop: 2 }}
        >
          {subtitle}
        </AppText>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={24} color={theme.colors.onPrimary} /> : null}
    </Pressable>
  );
}

function FocusStep({ focus, toggleFocus }: { focus: Discipline[]; toggleFocus: (f: Discipline) => void }) {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View>
      <StepHeader title={t('onboarding.focusTitle')} subtitle={t('onboarding.focusSubtitle')} />
      {DISCIPLINES.map((f) => (
        <BigOption
          key={f}
          title={t(`disciplines.${f}`)}
          subtitle={t(`focusDesc.${f}`)}
          icon={DISCIPLINE_ICONS[f]}
          selected={focus.includes(f)}
          accent={disciplineColor(theme.colors, f)}
          onPress={() => toggleFocus(f)}
        />
      ))}
    </View>
  );
}

function LevelStep({ level, setLevel }: { level: Level | null; setLevel: (l: Level) => void }) {
  const { t } = useI18n();
  const theme = useTheme();
  const icons: Record<Level, keyof typeof Ionicons.glyphMap> = {
    beginner: 'leaf-outline',
    intermediate: 'trending-up-outline',
    advanced: 'flame-outline',
  };
  return (
    <View>
      <StepHeader title={t('onboarding.levelTitle')} subtitle={t('onboarding.levelSubtitle')} />
      {LEVELS.map((l) => (
        <BigOption
          key={l}
          title={t(`levels.${l}`)}
          subtitle={t(`levelDesc.${l}`)}
          icon={icons[l]}
          selected={level === l}
          accent={theme.colors.primary}
          onPress={() => setLevel(l)}
        />
      ))}
    </View>
  );
}

function TimeStep({ minutes, setMinutes }: { minutes: number; setMinutes: (m: number) => void }) {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View>
      <StepHeader title={t('onboarding.timeTitle')} subtitle={t('onboarding.timeSubtitle')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {SESSION_PRESETS.map((m) => {
          const selected = minutes === m;
          return (
            <Pressable
              key={m}
              onPress={() => {
                if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
                setMinutes(m);
              }}
              style={{
                width: '47%',
                paddingVertical: 22,
                borderRadius: theme.radius.lg,
                alignItems: 'center',
                backgroundColor: selected ? theme.colors.primary : theme.colors.surfaceElevated,
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
              }}
            >
              <AppText
                variant="title1"
                style={{ color: selected ? theme.colors.onPrimary : theme.colors.text }}
              >
                {m}
              </AppText>
              <AppText
                variant="footnote"
                style={{ color: selected ? theme.colors.onPrimary : theme.colors.textSecondary }}
              >
                {t('common.minutes')}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function WorkStep({
  zones,
  goals,
  toggleZone,
  toggleGoal,
}: {
  zones: BodyZone[];
  goals: Goal[];
  toggleZone: (z: BodyZone) => void;
  toggleGoal: (g: Goal) => void;
}) {
  const { t } = useI18n();
  return (
    <View>
      <StepHeader title={t('onboarding.goalsTitle')} subtitle={t('onboarding.goalsSubtitle')} />
      <AppText variant="overline" color="textTertiary" style={{ marginBottom: 12 }}>
        {t('library.byZone').toUpperCase()}
      </AppText>
      <View style={styles.chipWrap}>
        {ZONES.map((z) => (
          <Chip
            key={z.id}
            label={t(`zones.${z.id}`)}
            icon={z.icon}
            selected={zones.includes(z.id)}
            onPress={() => toggleZone(z.id)}
          />
        ))}
      </View>
      <AppText variant="overline" color="textTertiary" style={{ marginTop: 24, marginBottom: 12 }}>
        {t('settings.goals').toUpperCase()}
      </AppText>
      <View style={styles.chipWrap}>
        {GOALS.map((g) => (
          <Chip
            key={g.id}
            label={t(`goals.${g.id}`)}
            icon={g.icon}
            selected={goals.includes(g.id)}
            onPress={() => toggleGoal(g.id)}
          />
        ))}
      </View>
    </View>
  );
}

function InjuriesStep({
  injuries,
  toggle,
  clear,
}: {
  injuries: Injury[];
  toggle: (i: Injury) => void;
  clear: () => void;
}) {
  const { t } = useI18n();
  return (
    <View>
      <StepHeader title={t('onboarding.injuriesTitle')} subtitle={t('onboarding.injuriesSubtitle')} />
      <View style={styles.chipWrap}>
        <Chip label={t('onboarding.injuriesNone')} selected={injuries.length === 0} onPress={clear} icon="happy-outline" />
        {INJURIES.map((i) => (
          <Chip
            key={i.id}
            label={t(`injuries.${i.id}`)}
            icon={i.icon}
            selected={injuries.includes(i.id)}
            onPress={() => toggle(i.id)}
          />
        ))}
      </View>
    </View>
  );
}

function FinishStep({ name }: { name: string }) {
  const { t } = useI18n();
  const theme = useTheme();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: theme.colors.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
        }}
      >
        <Ionicons name="sparkles" size={52} color={theme.colors.primary} />
      </View>
      <AppText variant="largeTitle" center>
        {t('onboarding.finishTitle')}
      </AppText>
      <AppText variant="body" color="textSecondary" center style={{ marginTop: 12 }}>
        {t('onboarding.finishSubtitle')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 8,
  },
  backBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  progressTrack: { flex: 1, flexDirection: 'row', gap: 5, alignItems: 'center' },
  progressDot: { height: 5, borderRadius: 3 },
  body: { flex: 1, paddingHorizontal: 20 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  bigOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
