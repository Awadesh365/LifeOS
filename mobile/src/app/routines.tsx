import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

export default function RoutinesScreen() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const [type, setType] = useState<'weekday' | 'weekend'>('weekday');
  const routines = useQuery({
    queryKey: ['routines'],
    queryFn: ({ signal }) => api.routines(signal),
  });
  const items = routines.data?.find((group) => group.type === type)?.items ?? [];

  return (
    <Screen
      eyebrow="Structure without rigidity"
      onRefresh={() => void routines.refetch()}
      refreshing={routines.isRefetching}
      title="My rhythm"
    >
      <View accessibilityRole="tablist" style={styles.segment}>
        {(['weekday', 'weekend'] as const).map((option) => (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: type === option }}
            key={option}
            onPress={() => setType(option)}
            style={[styles.segmentButton, type === option && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, type === option && styles.segmentTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {routines.isPending ? (
        <StateMessage loading message="Loading your rhythm." title="One moment" />
      ) : routines.isError ? (
        <StateMessage message="Pull down to try again." title="Routine unavailable" />
      ) : items.length === 0 ? (
        <StateMessage icon="calendar-blank-outline" message={`Add a ${type} routine in the web workspace.`} title="No routine yet" />
      ) : (
        <Card>
          {items.map((item, index) => (
            <View key={item.id} style={[styles.item, index > 0 && styles.divider]}>
              <View style={styles.timeColumn}>
                <Text style={styles.time}>{item.time}</Text>
                <View style={styles.line} />
              </View>
              <View style={styles.itemCopy}>
                <Text style={styles.task}>{item.icon}  {item.task}</Text>
                {item.duration ? <Text style={styles.detail}>{item.duration}</Text> : null}
                {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
              </View>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  segment: { backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, flexDirection: 'row', padding: spacing.xs },
  segmentButton: { alignItems: 'center', borderRadius: radii.pill, flex: 1, padding: spacing.md },
  segmentActive: { backgroundColor: colors.ink },
  segmentText: { color: colors.inkMuted, fontSize: 13, fontWeight: '800', textTransform: 'capitalize' },
  segmentTextActive: { color: colors.white },
  item: { flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.lg },
  divider: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
  timeColumn: { alignItems: 'center', width: 62 },
  time: { color: colors.primary, fontSize: 13, fontWeight: '900' },
  line: { backgroundColor: colors.primarySoft, flex: 1, marginTop: spacing.sm, minHeight: 22, width: 2 },
  itemCopy: { flex: 1, gap: spacing.xs },
  task: { color: colors.ink, fontSize: 16, fontWeight: '800' },
  detail: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  note: { color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
});
