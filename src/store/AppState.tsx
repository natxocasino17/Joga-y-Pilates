/**
 * Global app state: user profile, progress, preferences and the derived
 * "routine of the day". Hydrates from AsyncStorage on mount and persists every
 * change. Exposes a small, intention-revealing API to the rest of the app.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Locale } from '@/i18n/translations';
import { generateRoutine, todayKey } from '@/logic/routineGenerator';
import { Progress, Routine, SessionRecord, ThemePreference, UserProfile } from '@/data/types';
import { Discipline } from '@/theme/theme';
import { clearAll, loadItem, saveItem, StorageKeys } from './storage';

const DEFAULT_DISCIPLINE_ORDER: Discipline[] = ['yoga', 'pilates', 'gym'];

interface Preferences {
  locale: Locale;
  theme: ThemePreference;
  /** Order disciplines are grouped in the library — editable in Settings. */
  disciplineOrder: Discipline[];
}

interface DailySalt {
  date: string;
  salt: number;
}

const emptyProgress: Progress = {
  sessions: [],
  currentStreak: 0,
  bestStreak: 0,
  totalSessions: 0,
  totalSeconds: 0,
};

interface AppStateValue {
  hydrated: boolean;
  onboarded: boolean;
  profile: UserProfile | null;
  progress: Progress;
  preferences: Preferences;
  todayRoutine: Routine | null;
  isTodayComplete: boolean;
  completeOnboarding: (profile: UserProfile) => Promise<void>;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  setLocale: (locale: Locale) => Promise<void>;
  setThemePreference: (theme: ThemePreference) => Promise<void>;
  setDisciplineOrder: (order: Discipline[]) => Promise<void>;
  regenerateToday: () => Promise<void>;
  recordSession: (record: Omit<SessionRecord, 'date'>) => Promise<void>;
  resetProgress: () => Promise<void>;
}

const AppStateContext = createContext<AppStateValue | null>(null);

function computeStreak(dates: Set<string>): number {
  let streak = 0;
  const cursor = new Date();
  // Grace: if today isn't done yet, the streak can still stand on yesterday.
  if (!dates.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!dates.has(todayKey(cursor))) return 0;
  }
  while (dates.has(todayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [onboarded, setOnboarded] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [preferences, setPreferences] = useState<Preferences>({
    locale: 'es',
    theme: 'auto',
    disciplineOrder: DEFAULT_DISCIPLINE_ORDER,
  });
  const [dailySalt, setDailySalt] = useState<DailySalt>({ date: todayKey(), salt: 0 });

  // Hydrate persisted state once.
  useEffect(() => {
    (async () => {
      const [p, pr, prefs, ob, salt] = await Promise.all([
        loadItem<UserProfile>(StorageKeys.profile),
        loadItem<Progress>(StorageKeys.progress),
        loadItem<Preferences>(StorageKeys.preferences),
        loadItem<boolean>(StorageKeys.onboarded),
        loadItem<DailySalt>(StorageKeys.dailySalt),
      ]);
      if (p) setProfile(p);
      if (pr) setProgress(pr);
      if (prefs) setPreferences((prev) => ({ ...prev, ...prefs }));
      if (ob) setOnboarded(true);
      if (salt && salt.date === todayKey()) setDailySalt(salt);
      setHydrated(true);
    })();
  }, []);

  const todayRoutine = useMemo(() => {
    if (!profile) return null;
    return generateRoutine({ profile, date: todayKey(), salt: dailySalt.salt });
  }, [profile, dailySalt]);

  const isTodayComplete = useMemo(
    () => progress.sessions.some((s) => s.date === todayKey()),
    [progress]
  );

  const completeOnboarding = useCallback(async (next: UserProfile) => {
    setProfile(next);
    setOnboarded(true);
    await Promise.all([
      saveItem(StorageKeys.profile, next),
      saveItem(StorageKeys.onboarded, true),
    ]);
  }, []);

  const updateProfile = useCallback(
    async (patch: Partial<UserProfile>) => {
      setProfile((prev) => {
        if (!prev) return prev;
        const next = { ...prev, ...patch };
        saveItem(StorageKeys.profile, next);
        return next;
      });
    },
    []
  );

  const setLocale = useCallback(async (locale: Locale) => {
    setPreferences((prev) => {
      const next = { ...prev, locale };
      saveItem(StorageKeys.preferences, next);
      return next;
    });
  }, []);

  const setThemePreference = useCallback(async (theme: ThemePreference) => {
    setPreferences((prev) => {
      const next = { ...prev, theme };
      saveItem(StorageKeys.preferences, next);
      return next;
    });
  }, []);

  const setDisciplineOrder = useCallback(async (disciplineOrder: Discipline[]) => {
    setPreferences((prev) => {
      const next = { ...prev, disciplineOrder };
      saveItem(StorageKeys.preferences, next);
      return next;
    });
  }, []);

  const regenerateToday = useCallback(async () => {
    setDailySalt((prev) => {
      const next = { date: todayKey(), salt: prev.date === todayKey() ? prev.salt + 1 : 1 };
      saveItem(StorageKeys.dailySalt, next);
      return next;
    });
  }, []);

  const recordSession = useCallback(async (record: Omit<SessionRecord, 'date'>) => {
    setProgress((prev) => {
      const date = todayKey();
      const already = prev.sessions.some((s) => s.date === date);
      const sessions = [...prev.sessions, { ...record, date }];
      const dates = new Set(sessions.map((s) => s.date));
      const currentStreak = computeStreak(dates);
      const next: Progress = {
        sessions,
        currentStreak,
        bestStreak: Math.max(prev.bestStreak, currentStreak),
        // Count one "session" per calendar day for tidy stats.
        totalSessions: already ? prev.totalSessions : prev.totalSessions + 1,
        totalSeconds: prev.totalSeconds + record.durationSec,
      };
      saveItem(StorageKeys.progress, next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(async () => {
    setProgress(emptyProgress);
    await saveItem(StorageKeys.progress, emptyProgress);
  }, []);

  const value: AppStateValue = {
    hydrated,
    onboarded,
    profile,
    progress,
    preferences,
    todayRoutine,
    isTodayComplete,
    completeOnboarding,
    updateProfile,
    setLocale,
    setThemePreference,
    setDisciplineOrder,
    regenerateToday,
    recordSession,
    resetProgress,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
