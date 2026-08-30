import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { ConnectionBanner } from '@/components/connection-banner';
import { Screen } from '@/components/screen';
import { Card, SectionTitle } from '@/components/ui';
import { modules } from '@/config/modules';
import { api } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme, type ThemePreference } from '@/theme/provider';

export default function MoreScreen() {
  const router = useRouter();
  const { colors, preference, setPreference } = useLifeOSTheme();
  const styles = createStyles(colors);
  const connection = useQuery({
    queryKey: ['health-check'],
    queryFn: ({ signal }) => api.healthCheck(signal),
    retry: 0,
  });

  return (
    <Screen eyebrow="One coherent system" title="All modules">
      <Card>
        <SectionTitle detail="Saved on this device" title="Appearance" />
        <View accessibilityRole="radiogroup" style={styles.themeOptions}>
          {([
            ['system', 'theme-light-dark', 'System'],
            ['light', 'white-balance-sunny', 'Light'],
            ['dark', 'moon-waning-crescent', 'Dark'],
          ] as const).map(([value, icon, label]) => (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: preference === value }}
              key={value}
              onPress={() => setPreference(value as ThemePreference)}
              style={[styles.themeOption, preference === value && styles.themeOptionActive]}
            >
              <MaterialCommunityIcons color={preference === value ? colors.primary : colors.inkMuted} name={icon} size={20} />
              <Text style={[styles.themeLabel, preference === value && styles.themeLabelActive]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.systemRow}>
          <View style={[styles.statusDot, connection.data?.ok ? styles.online : styles.offline]} />
          <View style={styles.systemCopy}>
            <Text style={styles.systemTitle}>{connection.data?.ok ? 'Backend connected' : 'Backend not reachable'}</Text>
            <Text style={styles.systemMessage}>The web workspace and Android app share this API.</Text>
          </View>
        </View>
        <ConnectionBanner />
      </Card>

      <View style={styles.section}>
        <SectionTitle detail={`${modules.length + 5} connected areas`} title="Explore LifeOS" />
        <View style={styles.grid}>
          <Pressable onPress={() => router.push('/routines')} style={styles.module}>
            <View style={styles.icon}><MaterialCommunityIcons color={colors.primary} name="calendar-clock" size={22} /></View>
            <Text style={styles.moduleTitle}>Routines</Text>
            <Text style={styles.moduleDescription}>Weekday and weekend rhythm</Text>
          </Pressable>
          {modules.map((item) => (
            <Pressable
              key={item.slug}
              onPress={() => router.push({ pathname: '/module/[slug]', params: { slug: item.slug } })}
              style={({ pressed }) => [styles.module, pressed && styles.pressed]}
            >
              <View style={styles.icon}><MaterialCommunityIcons color={colors.primary} name={item.icon} size={22} /></View>
              <Text style={styles.moduleTitle}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.moduleDescription}>{item.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  themeOptions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  themeOption: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.sm, borderWidth: 1, flex: 1, gap: spacing.xs, padding: spacing.md },
  themeOptionActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  themeLabel: { color: colors.inkMuted, fontSize: 12, fontWeight: '700' },
  themeLabelActive: { color: colors.primary },
  systemRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  statusDot: { borderRadius: radii.pill, height: 10, width: 10 },
  online: { backgroundColor: colors.success },
  offline: { backgroundColor: colors.danger },
  systemCopy: { flex: 1, gap: 3 },
  systemTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  systemMessage: { color: colors.inkMuted, fontSize: 12, lineHeight: 18 },
  section: { gap: spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  module: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: spacing.sm, minHeight: 154, padding: spacing.lg, width: '48%' },
  pressed: { opacity: 0.72 },
  icon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.sm, height: 40, justifyContent: 'center', width: 40 },
  moduleTitle: { color: colors.ink, fontSize: 15, fontWeight: '800', marginTop: spacing.xs },
  moduleDescription: { color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
});
