/** Themed Text. Picks a typographic variant and a semantic color role. */
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useTheme } from '@/theme/theme';
import { TypographyVariant } from '@/theme/tokens';

type ColorRole = 'text' | 'textSecondary' | 'textTertiary' | 'primary' | 'onPrimary' | 'danger';

interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: ColorRole;
  center?: boolean;
}

export function AppText({
  variant = 'body',
  color = 'text',
  center,
  style,
  ...rest
}: AppTextProps) {
  const theme = useTheme();
  const base = theme.typography[variant] as TextStyle;
  return (
    <Text
      style={[base, { color: theme.colors[color] }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
