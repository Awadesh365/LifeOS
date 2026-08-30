import type { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { radii, shadows, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

export function Card({ children }: PropsWithChildren) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return <View style={styles.card}>{children}</View>;
}

export function SectionTitle({ title, detail }: { title: string; detail?: string }) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionHeading}>{title}</Text>
      {detail ? <Text style={styles.sectionDetail}>{detail}</Text> : null}
    </View>
  );
}

export function ProgressBar({ value, color }: { value: number; color?: string }) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const progressColor = color ?? colors.primary;
  const percentage = Math.max(0, Math.min(100, value));
  return (
    <View
      accessibilityLabel={`${Math.round(percentage)} percent complete`}
      accessibilityRole="progressbar"
      style={styles.progressTrack}
    >
      <View style={[styles.progressValue, { backgroundColor: progressColor, width: `${percentage}%` }]} />
    </View>
  );
}

export function StateMessage({
  icon,
  title,
  message,
  loading = false,
  action,
}: {
  icon?: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  message: string;
  loading?: boolean;
  action?: ReactNode;
}) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return (
    <Card>
      <View style={styles.state}>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" />
        ) : (
          <MaterialCommunityIcons color={colors.primary} name={icon ?? 'cloud-alert-outline'} size={30} />
        )}
        <Text style={styles.stateTitle}>{title}</Text>
        <Text style={styles.stateMessage}>{message}</Text>
        {action}
      </View>
    </Card>
  );
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[`button_${variant}`],
        pressed && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text style={[styles.buttonText, variant === 'primary' ? { color: colors.primaryContrast } : styles.buttonTextDark]}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: spacing.lg,
    ...shadows.card,
  },
  sectionTitle: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeading: { color: colors.ink, fontSize: 18, fontWeight: '800' },
  sectionDetail: { color: colors.inkMuted, fontSize: 12, fontWeight: '600' },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    height: 7,
    overflow: 'hidden',
  },
  progressValue: { borderRadius: radii.pill, height: '100%' },
  state: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  stateTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', textAlign: 'center' },
  stateMessage: { color: colors.inkMuted, fontSize: 14, lineHeight: 21, textAlign: 'center' },
  button: {
    alignItems: 'center',
    borderRadius: radii.pill,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  button_primary: { backgroundColor: colors.primary },
  button_secondary: { backgroundColor: colors.primarySoft },
  button_danger: { backgroundColor: colors.dangerSoft },
  buttonPressed: { opacity: 0.78 },
  buttonDisabled: { opacity: 0.48 },
  buttonText: { color: colors.white, fontSize: 14, fontWeight: '800' },
  buttonTextDark: { color: colors.ink },
});
