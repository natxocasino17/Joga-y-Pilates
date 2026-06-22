/** A rounded surface container with an optional soft shadow. */
import React from 'react';
import { Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, onPress, elevated = true, padded = true, style }: CardProps) {
  const theme = useTheme();

  const shadow =
    elevated && theme.scheme === 'light'
      ? Platform.select({
          ios: {
            shadowColor: '#1A1C1A',
            shadowOpacity: 0.06,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 6 },
          },
          android: { elevation: 2 },
          default: {},
        })
      : {};

  const content = (
    <View
      style={[
        {
          backgroundColor: elevated ? theme.colors.surfaceElevated : theme.colors.surface,
          borderRadius: theme.radius.xl,
          padding: padded ? theme.spacing.lg : 0,
          borderWidth: theme.scheme === 'dark' ? StyleSheet.hairlineWidth : 0,
          borderColor: theme.colors.border,
        },
        shadow,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        {content}
      </Pressable>
    );
  }
  return content;
}
