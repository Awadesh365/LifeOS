import type { ComponentProps } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import type { ColorValue } from 'react-native';

import { useLifeOSTheme } from '@/theme/provider';

const icon = (name: ComponentProps<typeof MaterialCommunityIcons>['name']) =>
  function TabIcon({ color, size }: { color: ColorValue; size: number }) {
    return <MaterialCommunityIcons color={color} name={name} size={size} />;
  };

export default function TabsLayout() {
  const { colors } = useLifeOSTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.secondaryContrast,
        tabBarInactiveTintColor: '#91A0B2',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', paddingBottom: 2 },
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopWidth: 0,
          height: 72,
          paddingTop: 7,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: icon('view-dashboard-outline') }} />
      <Tabs.Screen name="money" options={{ title: 'Money', tabBarIcon: icon('wallet-outline') }} />
      <Tabs.Screen name="habits" options={{ title: 'Habits', tabBarIcon: icon('check-circle-outline') }} />
      <Tabs.Screen name="goals" options={{ title: 'Goals', tabBarIcon: icon('target') }} />
      <Tabs.Screen name="health" options={{ title: 'Health', tabBarIcon: icon('heart-pulse') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: icon('dots-grid') }} />
    </Tabs>
  );
}
