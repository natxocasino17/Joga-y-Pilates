/** Entry gate: waits for hydration, then routes to onboarding or the app. */
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppState } from '@/store/AppState';
import { useTheme } from '@/theme/theme';

export default function Index() {
  const { hydrated, onboarded } = useAppState();
  const theme = useTheme();

  if (!hydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={onboarded ? '/(tabs)' : '/onboarding'} />;
}
