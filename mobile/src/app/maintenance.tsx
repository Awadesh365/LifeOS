import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, ProgressBar, SectionTitle, StateMessage } from '@/components/ui';
import { api, type MobileMaintenanceItem } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

const STATE_LABELS: Record<MobileMaintenanceItem['needState'], string> = {
  can_wait: 'Can wait', approaching: 'Approaching', due: 'Due', needs_attention: 'Needs attention', overdue: 'Overdue', backlog: 'Backlog', paused: 'Paused',
};

export default function MaintenanceScreen() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const queryClient = useQueryClient();
  const summary = useQuery({ queryKey: ['maintenance', 'summary'], queryFn: ({ signal }) => api.maintenanceSummary(signal) });
  const completion = useMutation({
    mutationFn: (id: string) => api.completeMaintenanceItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const data = summary.data;
  const selectedMinutes = data?.plan.selectedItems.reduce((total, selection) => total + (data.attention.find((item) => item.id === selection.itemId)?.durationMinutes ?? 0), 0) ?? 0;
  const capacity = data?.plan.capacityMinutes ?? 240;

  return (
    <>
      <Stack.Screen options={{ title: 'Maintenance' }} />
      <Screen eyebrow="Personal operations" onRefresh={() => void summary.refetch()} refreshing={summary.isRefetching} title="Maintenance">
        {summary.isPending ? <StateMessage loading message="Building your operational picture." title="One moment" /> : summary.isError || !data ? <StateMessage icon="cloud-alert-outline" message="Pull down to retry. Sign in first if your session has expired." title="Maintenance unavailable" /> : <>
          <View style={styles.metrics}>
            <Metric label="Attention" value={data.counts.needsAttention} colors={colors} />
            <Metric label="Deadlines" value={data.counts.hardDeadlines} colors={colors} />
            <Metric label="Repairs" value={data.counts.openRepairs} colors={colors} />
          </View>

          <Card>
            <SectionTitle detail={`${selectedMinutes}m / ${capacity}m`} title="This week" />
            <View style={styles.progress}><ProgressBar value={selectedMinutes / Math.max(1, capacity) * 100} /></View>
            <Text style={styles.helper}>Your committed maintenance stays bounded by the capacity you chose in weekly review.</Text>
          </Card>

          <View style={styles.section}>
            <SectionTitle detail={`${data.attention.length} surfaced`} title="Needs attention" />
            {data.attention.length ? data.attention.map((item) => <Card key={item.id}>
              <View style={styles.itemRow}>
                <View style={styles.itemCopy}><Text style={styles.itemTitle}>{item.name}</Text><Text style={styles.itemMeta}>{item.area?.name ?? 'Maintenance'} · {STATE_LABELS[item.needState]} · ~{item.durationMinutes}m</Text><Text numberOfLines={2} style={styles.reason}>{item.needReason}</Text></View>
                <Pressable accessibilityLabel={`Complete ${item.name}`} accessibilityRole="button" disabled={completion.isPending} onPress={() => completion.mutate(item.id)} style={({ pressed }) => [styles.complete, pressed && styles.pressed]}><MaterialCommunityIcons color={colors.primaryContrast} name="check" size={20} /></Pressable>
              </View>
            </Card>) : <StateMessage icon="check-circle-outline" message="Flexible maintenance will surface as it approaches its preferred window." title="Nothing needs attention" />}
          </View>

          <View style={styles.section}>
            <SectionTitle detail="No health scores" title="Areas" />
            <View style={styles.areaGrid}>{data.areas.map((area) => <View style={styles.area} key={area.id}><MaterialCommunityIcons color={colors.primary} name="toolbox-outline" size={21} /><Text numberOfLines={1} style={styles.areaName}>{area.name}</Text><Text style={styles.areaCount}>{area.itemCount} items</Text></View>)}</View>
          </View>

          {data.repairs.length ? <View style={styles.section}><SectionTitle detail={`${data.counts.waiting} waiting`} title="Open repairs" />{data.repairs.map((repair) => <Card key={repair.id}><View style={styles.repairRow}><MaterialCommunityIcons color={colors.accent} name="wrench-clock" size={24} /><View style={styles.itemCopy}><Text style={styles.itemTitle}>{repair.title}</Text><Text style={styles.itemMeta}>{repair.nextAction || repair.state.replaceAll('_', ' ')}</Text></View></View></Card>)}</View> : null}
        </>}
      </Screen>
    </>
  );
}

function Metric({ label, value, colors }: { label: string; value: number; colors: ThemeColors }) {
  const styles = createStyles(colors);
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  metrics: { flexDirection: 'row', gap: spacing.sm },
  metric: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, padding: spacing.md },
  metricValue: { color: colors.ink, fontSize: 25, fontWeight: '900' },
  metricLabel: { color: colors.inkMuted, fontSize: 11, fontWeight: '700', marginTop: 2 },
  progress: { marginTop: spacing.md },
  helper: { color: colors.inkMuted, fontSize: 12, lineHeight: 18, marginTop: spacing.md },
  section: { gap: spacing.md },
  itemRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  itemCopy: { flex: 1 },
  itemTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  itemMeta: { color: colors.inkMuted, fontSize: 11, fontWeight: '600', marginTop: 3, textTransform: 'capitalize' },
  reason: { color: colors.inkMuted, fontSize: 12, lineHeight: 17, marginTop: spacing.sm },
  complete: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.pill, height: 42, justifyContent: 'center', width: 42 },
  pressed: { opacity: .72 },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  area: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: 4, padding: spacing.md, width: '48%' },
  areaName: { color: colors.ink, fontSize: 13, fontWeight: '800', marginTop: spacing.sm },
  areaCount: { color: colors.inkMuted, fontSize: 11 },
  repairRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
});
