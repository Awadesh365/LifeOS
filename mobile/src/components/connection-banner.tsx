import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { API_BASE_URL } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

export function ConnectionBanner() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons color={colors.inkMuted} name="server-network" size={16} />
      <Text numberOfLines={1} style={styles.text}>API · {API_BASE_URL}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  banner: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    maxWidth: '100%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  text: { color: colors.inkMuted, flexShrink: 1, fontSize: 11, fontWeight: '600' },
});
