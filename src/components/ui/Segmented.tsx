/** iOS-style segmented control for small, mutually-exclusive choices. */
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/theme';
import { AppText } from './AppText';

interface Option<T extends string> {
  value: T;
  label: string;
}

interface SegmentedProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  const theme = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: theme.colors.surfaceSunken, borderRadius: theme.radius.md }]}>
      {options.map((opt) => {
        const selected = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              onChange(opt.value);
            }}
            style={[
              styles.segment,
              {
                backgroundColor: selected ? theme.colors.surfaceElevated : 'transparent',
                borderRadius: theme.radius.md - 3,
              },
            ]}
          >
            <AppText
              variant="subhead"
              style={{
                color: selected ? theme.colors.text : theme.colors.textSecondary,
                fontWeight: selected ? '600' : '500',
              }}
            >
              {opt.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: 'row', padding: 3 },
  segment: { flex: 1, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
});
