import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/services/query-client';
import { LifeOSThemeProvider, useLifeOSTheme } from '@/theme/provider';
import { AuthProvider, useAuth } from '@/auth/provider';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider><AuthThemeBridge /></AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AuthThemeBridge() {
  const { user } = useAuth();
  return <LifeOSThemeProvider key={user?.id ?? 'guest'} syncEnabled={Boolean(user)}><ThemedStack /></LifeOSThemeProvider>;
}

function ThemedStack() {
  const { colors, resolvedTheme } = useLifeOSTheme();
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) void SplashScreen.hideAsync();
  }, [loading]);

  if (loading) return null;
  return (
    <>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.ink,
        }}
      >
        <Stack.Protected guard={authenticated}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="routines" options={{ title: 'My routine' }} />
          <Stack.Screen name="appearance" options={{ title: 'Appearance' }} />
          <Stack.Screen name="module/[slug]" options={{ title: 'LifeOS' }} />
        </Stack.Protected>
        <Stack.Protected guard={!authenticated}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </>
  );
}
