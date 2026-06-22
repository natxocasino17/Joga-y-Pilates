/** Selectable pill — used for filters and multi-select onboarding options. */
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/theme';
import { AppText } from './AppText';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  accent?: string;
}

export function Chip({ label, selected, onPress, icon, accent }: ChipProps) {
  const theme = useTheme();
  const color = accent ?? theme.colors.primary;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? color : theme.colors.surfaceElevated,
          borderColor: selected ? color : theme.colors.border,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={16}
          color={selected ? theme.colors.onPrimary : theme.colors.textSecondary}
          style={{ marginRight: 6 }}
        />
      ) : null}
      <AppText
        variant="subhead"
        style={{
          color: selected ? theme.colors.onPrimary : theme.colors.text,
          fontWeight: selected ? '600' : '500',
        }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
});
