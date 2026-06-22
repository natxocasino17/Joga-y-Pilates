/**
 * Bridges persisted preferences (locale + theme choice) and the OS color
 * scheme into the Theme and i18n contexts that the UI consumes.
 */
import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { I18nContext, makeT } from '@/i18n/i18n';
import { useAppState } from '@/store/AppState';
import { buildTheme, ThemeContext } from './theme';

export function ThemeBridge({ children }: { children: React.ReactNode }) {
  const { preferences } = useAppState();
  const system = useColorScheme();

  const scheme =
    preferences.theme === 'auto' ? (system === 'light' ? 'light' : 'dark') : preferences.theme;

  const theme = useMemo(() => buildTheme(scheme), [scheme]);
  const i18n = useMemo(
    () => ({ locale: preferences.locale, t: makeT(preferences.locale) }),
    [preferences.locale]
  );

  return (
    <ThemeContext.Provider value={theme}>
      <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>
    </ThemeContext.Provider>
  );
}
