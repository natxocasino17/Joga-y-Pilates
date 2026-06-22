/**
 * Theme system: light & dark palettes + a React context to consume them.
 *
 * The palette is a calm, wellness-oriented set: warm cream/paper backgrounds
 * in light mode, deep warm-ink backgrounds in dark mode, a sage/green primary
 * that reads as "movement & nature", and a coral/amber hero gradient for the
 * "glow" accents. Each discipline (yoga / pilates / gym) also gets an accent
 * so the app feels cohesive but each world has its own identity.
 */
import { createContext, useContext } from 'react';
import { radius, spacing, typography } from './tokens';

export type Discipline = 'yoga' | 'pilates' | 'gym';

export interface Palette {
  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  // Content
  text: string;
  textSecondary: string;
  textTertiary: string;
  // Brand
  primary: string;
  primarySoft: string;
  onPrimary: string;
  // Discipline accents
  yoga: string;
  pilates: string;
  gym: string;
  // Utility
  border: string;
  separator: string;
  success: string;
  warning: string;
  danger: string;
  // Gradients (start -> end)
  heroGradient: [string, string];
  overlayScrim: string;
}

const light: Palette = {
  background: '#FBF5EB',
  surface: '#FFFCF6',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#F3E9D7',
  text: '#2E2A23',
  textSecondary: '#827A6C',
  textTertiary: '#B3A996',
  primary: '#7CA889',
  primarySoft: '#E7F0E5',
  onPrimary: '#FFFFFF',
  yoga: '#9C8CC9',
  pilates: '#E59689',
  gym: '#E3A857',
  border: '#ECE1CB',
  separator: '#F1E8D4',
  success: '#7CA889',
  warning: '#E3A857',
  danger: '#D17B65',
  heroGradient: ['#F2AC8B', '#E3A857'],
  overlayScrim: 'rgba(43,30,18,0.45)',
};

const dark: Palette = {
  background: '#1C1712',
  surface: '#241E18',
  surfaceElevated: '#2C2520',
  surfaceSunken: '#15110D',
  text: '#F6EFE4',
  textSecondary: '#BBB0A0',
  textTertiary: '#7C7265',
  primary: '#8FC09D',
  primarySoft: '#263428',
  onPrimary: '#15110D',
  yoga: '#B9A8E0',
  pilates: '#E8A599',
  gym: '#E8BD7A',
  border: '#352D24',
  separator: '#2D261F',
  success: '#8FC09D',
  warning: '#E8BD7A',
  danger: '#E2937F',
  heroGradient: ['#9C5F44', '#5C3A29'],
  overlayScrim: 'rgba(0,0,0,0.55)',
};

export const palettes = { light, dark };

export interface Theme {
  scheme: 'light' | 'dark';
  colors: Palette;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export function buildTheme(scheme: 'light' | 'dark'): Theme {
  return {
    scheme,
    colors: palettes[scheme],
    spacing,
    radius,
    typography,
  };
}

export const ThemeContext = createContext<Theme>(buildTheme('dark'));

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** Returns the accent color for a given discipline. */
export function disciplineColor(colors: Palette, discipline: Discipline): string {
  return colors[discipline];
}
