/**
 * Design tokens — the static foundation of the visual system.
 * Spacing, radii, typography scale and shadows. Colors live in theme.ts
 * because they depend on the active color scheme (light / dark).
 */

// 4pt spacing scale — keeps vertical rhythm tight and consistent (iOS-like).
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

// Generous, soft corner radii — the rounded, friendly feel of modern iOS.
export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  pill: 999,
} as const;

// Typographic scale. We lean on system fonts for a native, professional feel.
export const typography = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37, lineHeight: 41 },
  title1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: 0.36, lineHeight: 34 },
  title2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: 0.35, lineHeight: 28 },
  title3: { fontSize: 20, fontWeight: '600' as const, letterSpacing: 0.38, lineHeight: 25 },
  headline: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.41, lineHeight: 22 },
  body: { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.41, lineHeight: 24 },
  callout: { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.32, lineHeight: 21 },
  subhead: { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.24, lineHeight: 20 },
  footnote: { fontSize: 13, fontWeight: '400' as const, letterSpacing: -0.08, lineHeight: 18 },
  caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0, lineHeight: 16 },
  overline: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 1.2, lineHeight: 16 },
} as const;

export type TypographyVariant = keyof typeof typography;
