/**
 * Theme system: light & dark palettes + a React context to consume them.
 *
 * The palette is a calm, wellness-oriented set: deep ink backgrounds in dark
 * mode, soft paper tones in light mode, and a sage/green primary that reads
 * as "movement & nature". Each discipline (yoga / pilates / gym) also gets an
 * accent so the app feels cohesive but each world has its own identity.
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
  background: '#F6F5F1',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSunken: '#EEEDE7',
  text: '#1A1C1A',
  textSecondary: '#5A615A',
  textTertiary: '#9AA09A',
  primary: '#3E7C5A',
  primarySoft: '#E3EFE7',
  onPrimary: '#FFFFFF',
  yoga: '#7C6BB0',
  pilates: '#C77B8B',
  gym: '#D98E4A',
  border: '#E4E2DA',
  separator: '#ECEAE3',
  success: '#3E7C5A',
  warning: '#D98E4A',
  danger: '#C0564B',
  heroGradient: ['#3E7C5A', '#2C5C42'],
  overlayScrim: 'rgba(14,17,22,0.45)',
};

const dark: Palette = {
  background: '#0E1116',
  surface: '#171B22',
  surfaceElevated: '#1E232C',
  surfaceSunken: '#0A0D11',
  text: '#F2F4F1',
  textSecondary: '#A7AEAA',
  textTertiary: '#6B726E',
  primary: '#6FB68C',
  primarySoft: '#1C2C24',
  onPrimary: '#0E1116',
  yoga: '#A99BDC',
  pilates: '#E0A0AE',
  gym: '#E6A965',
  border: '#262C35',
  separator: '#21262E',
  success: '#6FB68C',
  warning: '#E6A965',
  danger: '#E0796D',
  heroGradient: ['#2C5C42', '#1A3A2A'],
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
