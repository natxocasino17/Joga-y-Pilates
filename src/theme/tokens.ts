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

// Soft, rounded corner radii — bigger than iOS defaults for the calm,
// "soft UI" wellness-app feel (cards read more like pillows than panels).
export const radius = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  pill: 999,
} as const;

// Quicksand — a rounded, friendly geometric sans that gives the app a calm,
// wellness-app voice instead of the default system font.
export const fonts = {
  regular: 'Quicksand_500Medium',
  medium: 'Quicksand_600SemiBold',
  bold: 'Quicksand_700Bold',
} as const;

// Typographic scale.
export const typography = {
  largeTitle: { fontSize: 34, fontFamily: fonts.bold, letterSpacing: 0.2, lineHeight: 41 },
  title1: { fontSize: 28, fontFamily: fonts.bold, letterSpacing: 0.2, lineHeight: 34 },
  title2: { fontSize: 22, fontFamily: fonts.bold, letterSpacing: 0.2, lineHeight: 28 },
  title3: { fontSize: 20, fontFamily: fonts.medium, letterSpacing: 0.2, lineHeight: 25 },
  headline: { fontSize: 17, fontFamily: fonts.medium, letterSpacing: 0, lineHeight: 22 },
  body: { fontSize: 17, fontFamily: fonts.regular, letterSpacing: 0, lineHeight: 24 },
  callout: { fontSize: 16, fontFamily: fonts.regular, letterSpacing: 0, lineHeight: 21 },
  subhead: { fontSize: 15, fontFamily: fonts.regular, letterSpacing: 0, lineHeight: 20 },
  footnote: { fontSize: 13, fontFamily: fonts.regular, letterSpacing: 0, lineHeight: 18 },
  caption: { fontSize: 12, fontFamily: fonts.medium, letterSpacing: 0, lineHeight: 16 },
  overline: { fontSize: 12, fontFamily: fonts.bold, letterSpacing: 1.2, lineHeight: 16 },
} as const;

export type TypographyVariant = keyof typeof typography;
