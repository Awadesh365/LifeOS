import type { PropsWithChildren, ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '@/theme';

interface ScreenProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function Screen({
  title,
  eyebrow,
  action,
  children,
  refreshing = false,
  onRefresh,
}: ScreenProps) {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              colors={[colors.primary]}
              refreshing={refreshing}
              tintColor={colors.primary}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
      >
        <View style={styles.header}>
          <View style={styles.heading}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            <Text accessibilityRole="header" style={styles.title}>{title}</Text>
          </View>
          {action}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 120, gap: spacing.lg },
  header: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  heading: { flex: 1, gap: 3 },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: { color: colors.ink, fontSize: 31, fontWeight: '800', letterSpacing: -1 },
});
