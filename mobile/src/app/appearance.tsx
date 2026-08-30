import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, SectionTitle } from '@/components/ui';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme, type ThemePreference } from '@/theme/provider';

const options: {
  value: ThemePreference;
  label: string;
  description: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}[] = [
  { value: 'system', label: 'System', description: 'Match this device automatically.', icon: 'theme-light-dark' },
  { value: 'light', label: 'Light', description: 'Use the bright LifeOS palette.', icon: 'white-balance-sunny' },
  { value: 'dark', label: 'Dark', description: 'Use the low-light LifeOS palette.', icon: 'moon-waning-crescent' },
];

export default function AppearanceScreen() {
  const { colors, preference, setPreference } = useLifeOSTheme();
  const styles = createStyles(colors);

  return (
    <Screen eyebrow="Settings" title="Appearance">
      <Card>
        <SectionTitle detail="Across LifeOS" title="Theme" />
        <Text style={styles.intro}>
          Choose a theme for every screen, card, button, and table in your workspace.
        </Text>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {options.map((option) => {
            const selected = preference === option.value;
            return (
              <Pressable
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={option.value}
                onPress={() => setPreference(option.value)}
                style={({ pressed }) => [
                  styles.option,
                  selected && styles.optionActive,
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                  <MaterialCommunityIcons
                    color={selected ? colors.primary : colors.inkMuted}
                    name={option.icon}
                    size={22}
                  />
                </View>
                <View style={styles.optionCopy}>
                  <Text style={styles.optionTitle}>{option.label}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <MaterialCommunityIcons
                  color={selected ? colors.primary : colors.border}
                  name={selected ? 'radiobox-marked' : 'radiobox-blank'}
                  size={23}
                />
              </Pressable>
            );
          })}
        </View>
        <View style={styles.syncNote}>
          <MaterialCommunityIcons color={colors.inkMuted} name="cloud-check-outline" size={18} />
          <Text style={styles.syncText}>Saved to your profile and shared with the web portal.</Text>
        </View>
      </Card>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  intro: { color: colors.inkMuted, fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
  options: { gap: spacing.md, marginTop: spacing.xl },
  option: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  optionActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  optionIcon: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: radii.sm, height: 42, justifyContent: 'center', width: 42 },
  optionIconActive: { backgroundColor: colors.surface },
  optionCopy: { flex: 1, gap: 3 },
  optionTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  optionDescription: { color: colors.inkMuted, fontSize: 12, lineHeight: 17 },
  pressed: { opacity: 0.75 },
  syncNote: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl, paddingTop: spacing.lg },
  syncText: { color: colors.inkMuted, flex: 1, fontSize: 12, lineHeight: 18 },
});
