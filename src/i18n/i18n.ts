/**
 * i18n context. Exposes the active locale and a `t()` helper that resolves
 * dot-paths like t('home.todayRoutine'). Falls back to Spanish, then to the
 * raw key, so a missing string never crashes the UI.
 */
import { createContext, useContext } from 'react';
import { Locale, translations } from './translations';

type Dict = Record<string, unknown>;

function resolve(tree: Dict, path: string): string | undefined {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Dict)) {
      return (acc as Dict)[key];
    }
    return undefined;
  }, tree);
  return typeof value === 'string' ? value : undefined;
}

export interface I18n {
  locale: Locale;
  t: (path: string) => string;
}

export function makeT(locale: Locale): (path: string) => string {
  return (path: string) =>
    resolve(translations[locale] as Dict, path) ??
    resolve(translations.es as Dict, path) ??
    path;
}

export const I18nContext = createContext<I18n>({
  locale: 'es',
  t: makeT('es'),
});

export function useI18n(): I18n {
  return useContext(I18nContext);
}

/** Picks the right localized field from a bilingual content object. */
export function localized<T>(locale: Locale, es: T, en: T): T {
  return locale === 'en' ? en : es;
}
