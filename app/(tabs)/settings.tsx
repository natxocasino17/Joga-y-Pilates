/**
 * Settings — edit the full profile (name, focus, level, session length, zones,
 * goals, injuries), switch language and appearance, and reset progress.
 * Every change persists immediately via the app-state store.
 */
import React from 'react';
import { Alert, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Segmented } from '@/components/ui/Segmented';
import { Button } from '@/components/ui/Button';
import { useTheme, disciplineColor, Discipline } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { DISCIPLINES, GOALS, INJURIES, LEVELS, SESSION_PRESETS, ZONES } from '@/data/catalog';
import { BodyZone, Goal, Injury, Level } from '@/data/types';
import Constants from 'expo-constants';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 24 }}>
      <AppText variant="overline" color="textTertiary" style={{ marginBottom: 10, marginLeft: 4 }}>
        {title.toUpperCase()}
      </AppText>
      <Card>{children}</Card>
    </View>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <AppText variant="subhead" color="textSecondary" style={{ marginBottom: 10 }}>
        {label}
      </AppText>
      {children}
    </View>
  );
}

export default function Settings() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const { profile, preferences, updateProfile, setLocale, setThemePreference, setDisciplineOrder, resetProgress } =
    useAppState();

  if (!profile) return <Screen />;

  const toggleInArray = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const toggleFocus = (f: Discipline) => {
    if (profile.focus.includes(f)) {
      if (profile.focus.length === 1) return; // keep at least one discipline
      updateProfile({ focus: profile.focus.filter((x) => x !== f) });
    } else {
      updateProfile({ focus: [...profile.focus, f] });
    }
  };

  const moveDiscipline = (d: Discipline, dir: -1 | 1) => {
    const order = preferences.disciplineOrder;
    const i = order.indexOf(d);
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setDisciplineOrder(next);
  };

  const confirmReset = () => {
    if (Platform.OS === 'web') {
      resetProgress();
      return;
    }
    Alert.alert(t('settings.resetProgress'), t('settings.resetConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.reset'), style: 'destructive', onPress: () => resetProgress() },
    ]);
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen scroll>
      <AppText variant="largeTitle" style={{ marginTop: 8 }}>
        {t('settings.title')}
      </AppText>

      <Section title={t('settings.profile')}>
        <Field label={t('settings.name')}>
          <TextInput
            value={profile.name}
            onChangeText={(name) => updateProfile({ name })}
            placeholder={t('onboarding.namePlaceholder')}
            placeholderTextColor={theme.colors.textTertiary}
            style={{
              fontSize: 17,
              fontWeight: '600',
              color: theme.colors.text,
              backgroundColor: theme.colors.surfaceSunken,
              borderRadius: theme.radius.md,
              paddingHorizontal: 14,
              paddingVertical: 12,
            }}
          />
        </Field>

        <Field label={t('settings.focus')}>
          <View style={styles.wrap}>
            {DISCIPLINES.map((f) => (
              <Chip
                key={f}
                label={t(`disciplines.${f}`)}
                selected={profile.focus.includes(f)}
                accent={disciplineColor(theme.colors, f)}
                onPress={() => toggleFocus(f)}
              />
            ))}
          </View>
        </Field>

        <Field label={t('settings.level')}>
          <View style={styles.wrap}>
            {LEVELS.map((l: Level) => (
              <Chip key={l} label={t(`levels.${l}`)} selected={profile.level === l} onPress={() => updateProfile({ level: l })} />
            ))}
          </View>
        </Field>

        <Field label={t('settings.sessionLength')}>
          <View style={styles.wrap}>
            {SESSION_PRESETS.map((m) => (
              <Chip
                key={m}
                label={`${m} ${t('common.min')}`}
                selected={profile.sessionMinutes === m}
                onPress={() => updateProfile({ sessionMinutes: m })}
              />
            ))}
          </View>
        </Field>

        <Field label={t('settings.goals')}>
          <View style={styles.wrap}>
            {ZONES.map((z) => (
              <Chip
                key={z.id}
                label={t(`zones.${z.id}`)}
                icon={z.icon}
                selected={profile.zones.includes(z.id)}
                onPress={() => updateProfile({ zones: toggleInArray<BodyZone>(profile.zones, z.id) })}
              />
            ))}
            {GOALS.map((g) => (
              <Chip
                key={g.id}
                label={t(`goals.${g.id}`)}
                icon={g.icon}
                selected={profile.goals.includes(g.id)}
                onPress={() => updateProfile({ goals: toggleInArray<Goal>(profile.goals, g.id) })}
              />
            ))}
          </View>
        </Field>

        <Field label={t('settings.injuries')}>
          <View style={styles.wrap}>
            {INJURIES.map((i) => (
              <Chip
                key={i.id}
                label={t(`injuries.${i.id}`)}
                icon={i.icon}
                selected={profile.injuries.includes(i.id)}
                onPress={() => updateProfile({ injuries: toggleInArray<Injury>(profile.injuries, i.id) })}
              />
            ))}
          </View>
        </Field>
      </Section>

      <Section title={t('settings.preferences')}>
        <Field label={t('settings.language')}>
          <Segmented
            value={preferences.locale}
            onChange={(v) => setLocale(v)}
            options={[
              { value: 'es', label: 'Español' },
              { value: 'en', label: 'English' },
            ]}
          />
        </Field>
        <Field label={t('settings.appearance')}>
          <Segmented
            value={preferences.theme}
            onChange={(v) => setThemePreference(v)}
            options={[
              { value: 'auto', label: t('settings.themeAuto') },
              { value: 'light', label: t('settings.themeLight') },
              { value: 'dark', label: t('settings.themeDark') },
            ]}
          />
        </Field>
        <Field label={t('settings.disciplineOrder')}>
          {preferences.disciplineOrder.map((d, i) => (
            <View
              key={d}
              style={[
                styles.orderRow,
                { borderColor: theme.colors.border },
                i === preferences.disciplineOrder.length - 1 && { borderBottomWidth: 0 },
              ]}
            >
              <View style={[styles.orderDot, { backgroundColor: disciplineColor(theme.colors, d) }]} />
              <AppText variant="body" style={{ flex: 1, marginLeft: 10 }}>
                {t(`disciplines.${d}`)}
              </AppText>
              <Pressable
                disabled={i === 0}
                onPress={() => moveDiscipline(d, -1)}
                hitSlop={8}
                style={styles.orderBtn}
              >
                <Ionicons name="chevron-up" size={20} color={i === 0 ? theme.colors.textTertiary : theme.colors.text} />
              </Pressable>
              <Pressable
                disabled={i === preferences.disciplineOrder.length - 1}
                onPress={() => moveDiscipline(d, 1)}
                hitSlop={8}
                style={styles.orderBtn}
              >
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={i === preferences.disciplineOrder.length - 1 ? theme.colors.textTertiary : theme.colors.text}
                />
              </Pressable>
            </View>
          ))}
        </Field>
      </Section>

      <Section title={t('settings.about')}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <AppText variant="body">{t('settings.version')}</AppText>
          <AppText variant="body" color="textSecondary">
            {version}
          </AppText>
        </View>
        <AppText variant="footnote" color="textTertiary" style={{ marginTop: 14 }}>
          {t('settings.madeWith')}
        </AppText>
      </Section>

      <View style={{ marginTop: 24 }}>
        <Button label={t('settings.resetProgress')} variant="ghost" color={theme.colors.danger} icon="trash-outline" onPress={confirmReset} />
      </View>

      <AppText variant="caption" color="textTertiary" center style={{ marginTop: 24 }}>
        Flora · {locale === 'en' ? 'Move better, every day.' : 'Muévete mejor, cada día.'}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  orderDot: { width: 10, height: 10, borderRadius: 5 },
  orderBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
});
