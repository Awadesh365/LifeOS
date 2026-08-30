import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, SectionTitle } from '@/components/ui';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme, type ThemePreference } from '@/theme/provider';

const modeOptions: {
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
  const { colors, preference, brandColors, setPreference, setBrandColors, resetBrandColors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const primaryPresets = ['#E55555', '#7C3AED', '#156BBA', '#0F766E', '#C17400'];
  const secondaryPresets = ['#1E2530', '#243B53', '#312E81', '#134E4A', '#4A2C2A'];

  return (
    <Screen eyebrow="Settings" title="Appearance">
      <Card>
        <SectionTitle detail="Your personal palette" title="Brand colors" />
        <Text style={styles.intro}>
          Primary changes buttons and accents. Secondary changes navigation and table headers.
        </Text>
        <Text style={styles.colorTitle}>Primary color</Text>
        <View accessibilityRole="radiogroup" style={styles.swatches}>
          {primaryPresets.map((color) => {
            const selected = brandColors.primaryColor === color;
            return (
              <Pressable
                accessibilityLabel={`Set primary color to ${color}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={color}
                onPress={() => setBrandColors({ primaryColor: color })}
                style={[styles.swatchRing, selected && styles.swatchRingActive]}
              >
                <View style={[styles.swatch, { backgroundColor: color }]}>
                  {selected ? <MaterialCommunityIcons color={colors.primaryContrast} name="check" size={18} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.colorTitle}>Secondary color</Text>
        <View accessibilityRole="radiogroup" style={styles.swatches}>
          {secondaryPresets.map((color) => {
            const selected = brandColors.secondaryColor === color;
            return (
              <Pressable
                accessibilityLabel={`Set secondary color to ${color}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                key={color}
                onPress={() => setBrandColors({ secondaryColor: color })}
                style={[styles.swatchRing, selected && styles.swatchRingActive]}
              >
                <View style={[styles.swatch, { backgroundColor: color }]}>
                  {selected ? <MaterialCommunityIcons color={colors.secondaryContrast} name="check" size={18} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.previewRow}>
          <View style={styles.primaryPreview}><Text style={styles.primaryPreviewText}>Primary button</Text></View>
          <View style={styles.secondaryPreview}><Text style={styles.secondaryPreviewText}>Navigation</Text></View>
        </View>
        <Pressable accessibilityRole="button" onPress={resetBrandColors} style={styles.resetButton}>
          <MaterialCommunityIcons color={colors.inkMuted} name="restart" size={18} />
          <Text style={styles.resetText}>Reset colors</Text>
        </Pressable>
        <View style={styles.syncNote}>
          <MaterialCommunityIcons color={colors.inkMuted} name="cloud-check-outline" size={18} />
          <Text style={styles.syncText}>Saved to your profile and shared with the web portal.</Text>
        </View>
      </Card>

      <Card>
        <SectionTitle detail="Light and dark" title="Color mode" />
        <Text style={styles.intro}>Use your chosen colors with the system, light, or dark interface.</Text>
        <View accessibilityRole="radiogroup" style={styles.options}>
          {modeOptions.map((option) => {
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
      </Card>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  intro: { color: colors.inkMuted, fontSize: 13, lineHeight: 20, marginTop: spacing.sm },
  colorTitle: { color: colors.ink, fontSize: 14, fontWeight: '800', marginTop: spacing.xl },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.md },
  swatchRing: { alignItems: 'center', borderColor: 'transparent', borderRadius: radii.pill, borderWidth: 2, height: 44, justifyContent: 'center', width: 44 },
  swatchRingActive: { borderColor: colors.ink },
  swatch: { alignItems: 'center', borderRadius: radii.pill, height: 34, justifyContent: 'center', width: 34 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl },
  primaryPreview: { backgroundColor: colors.primary, borderRadius: radii.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  primaryPreviewText: { color: colors.primaryContrast, fontSize: 13, fontWeight: '800' },
  secondaryPreview: { backgroundColor: colors.secondary, borderRadius: radii.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  secondaryPreviewText: { color: colors.secondaryContrast, fontSize: 13, fontWeight: '800' },
  resetButton: { alignItems: 'center', alignSelf: 'flex-start', flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg, paddingVertical: spacing.sm },
  resetText: { color: colors.inkMuted, fontSize: 13, fontWeight: '700' },
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
