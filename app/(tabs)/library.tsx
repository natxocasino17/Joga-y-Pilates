/**
 * Library — browse and filter the full exercise catalog. Filter by discipline,
 * level and body zone, or search by name. Tapping a row opens the detail.
 */
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from '@/components/ui/Screen';
import { AppText } from '@/components/ui/AppText';
import { Chip } from '@/components/ui/Chip';
import { ExerciseListItem } from '@/components/ExerciseListItem';
import { useTheme, disciplineColor, Discipline } from '@/theme/theme';
import { useI18n } from '@/i18n/i18n';
import { exercises } from '@/data/exercises';
import { ZONES } from '@/data/catalog';
import { BodyZone, Level } from '@/data/types';

const DISCIPLINES: Discipline[] = ['yoga', 'pilates', 'gym'];
const LEVELS: Level[] = ['beginner', 'intermediate', 'advanced'];

export default function Library() {
  const theme = useTheme();
  const { t, locale } = useI18n();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [zone, setZone] = useState<BodyZone | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return exercises.filter((ex) => {
      if (discipline && ex.discipline !== discipline) return false;
      if (level && !ex.levels.includes(level)) return false;
      if (zone && !ex.zones.includes(zone)) return false;
      if (q) {
        const name = `${ex.name.es} ${ex.name.en}`.toLowerCase();
        if (!name.includes(q)) return false;
      }
      return true;
    });
  }, [query, discipline, level, zone]);

  return (
    <Screen scroll>
      <AppText variant="largeTitle" style={{ marginTop: 8 }}>
        {t('library.title')}
      </AppText>
      <AppText variant="subhead" color="textSecondary" style={{ marginBottom: 16 }}>
        {t('library.subtitle')}
      </AppText>

      {/* Search */}
      <View style={[styles.search, { backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border }]}>
        <Ionicons name="search" size={18} color={theme.colors.textTertiary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('library.search')}
          placeholderTextColor={theme.colors.textTertiary}
          style={{ flex: 1, marginLeft: 8, color: theme.colors.text, fontSize: 16 }}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Discipline filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        <Chip label={t('common.all')} selected={discipline === null} onPress={() => setDiscipline(null)} />
        {DISCIPLINES.map((d) => (
          <Chip
            key={d}
            label={t(`disciplines.${d}`)}
            selected={discipline === d}
            accent={disciplineColor(theme.colors, d)}
            onPress={() => setDiscipline(discipline === d ? null : d)}
          />
        ))}
      </ScrollView>

      {/* Level filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        <Chip label={t('common.level')} selected={level === null} onPress={() => setLevel(null)} icon="podium-outline" />
        {LEVELS.map((l) => (
          <Chip key={l} label={t(`levels.${l}`)} selected={level === l} onPress={() => setLevel(level === l ? null : l)} />
        ))}
      </ScrollView>

      {/* Zone filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        <Chip label={t('library.byZone')} selected={zone === null} onPress={() => setZone(null)} icon="body-outline" />
        {ZONES.map((z) => (
          <Chip key={z.id} label={t(`zones.${z.id}`)} icon={z.icon} selected={zone === z.id} onPress={() => setZone(zone === z.id ? null : z.id)} />
        ))}
      </ScrollView>

      <AppText variant="footnote" color="textTertiary" style={{ marginTop: 18, marginBottom: 12 }}>
        {results.length} {t('library.results')}
      </AppText>

      {results.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Ionicons name="leaf-outline" size={40} color={theme.colors.textTertiary} />
          <AppText variant="body" color="textSecondary" center style={{ marginTop: 12 }}>
            {t('library.noResults')}
          </AppText>
        </View>
      ) : (
        results.map((ex) => (
          <ExerciseListItem key={ex.id} exercise={ex} onPress={() => router.push(`/exercise/${ex.id}`)} />
        ))
      )}

      <View style={{ height: 8 }} />
      <AppText variant="caption" color="textTertiary" center>
        {locale === 'en'
          ? 'Bodyweight exercises for home. Not medical advice.'
          : 'Ejercicios de peso corporal para casa. No es consejo médico.'}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
  },
  filterRow: { marginHorizontal: -20 },
  filterContent: { paddingHorizontal: 20, gap: 8, paddingVertical: 4 },
});
