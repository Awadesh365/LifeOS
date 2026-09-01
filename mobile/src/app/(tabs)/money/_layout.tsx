import { Stack } from 'expo-router';
import { useLifeOSTheme } from '@/theme/provider';

export default function MoneyLayout() {
  const { colors } = useLifeOSTheme();
  return <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background }, headerShadowVisible: false, headerStyle: { backgroundColor: colors.background }, headerTintColor: colors.ink }}><Stack.Screen name="index" options={{ headerShown: false }} /><Stack.Screen name="add" options={{ title: 'Add to Money' }} /></Stack>;
}
