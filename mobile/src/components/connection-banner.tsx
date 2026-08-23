import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { API_BASE_URL } from '@/services/api';
import { colors, radii, spacing } from '@/theme';

export function ConnectionBanner() {
  return (
    <View style={styles.banner}>
      <MaterialCommunityIcons color={colors.inkMuted} name="server-network" size={16} />
      <Text numberOfLines={1} style={styles.text}>API · {API_BASE_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
