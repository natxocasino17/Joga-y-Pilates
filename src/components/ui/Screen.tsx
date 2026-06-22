/** Safe-area screen container with a themed background. */
import React from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/theme';
import { spacing } from '@/theme/tokens';

interface ScreenProps {
  children?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  children,
  scroll,
  padded = true,
  edges = ['top'],
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const pad = padded ? { paddingHorizontal: spacing.xl } : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={edges}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[pad, { paddingBottom: spacing.huge }, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[{ flex: 1 }, pad, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}
