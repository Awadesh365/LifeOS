import { useQuery } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Screen } from '@/components/screen';
import { Card, ProgressBar, SectionTitle, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';
import { friendlyDate } from '@/utils/date';

export default function TodayScreen() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const summary = useQuery({
    queryKey: ['dashboard'],
    queryFn: ({ signal }) => api.dashboard(signal),
  });
  const routines = useQuery({
    queryKey: ['routines'],
    queryFn: ({ signal }) => api.routines(signal),
  });

  const refresh = () => Promise.all([summary.refetch(), routines.refetch()]);
  const habitProgress = summary.data?.habits.total
    ? (summary.data.habits.completedToday / summary.data.habits.total) * 100
    : 0;
  const milestoneProgress = summary.data?.goals.milestones
    ? (summary.data.goals.completedMilestones / summary.data.goals.milestones) * 100
    : 0;
  const routineType = [0, 6].includes(new Date().getDay()) ? 'weekend' : 'weekday';
  const todayRoutine = routines.data?.find((group) => group.type === routineType)?.items.slice(0, 4) ?? [];

  return (
    <Screen
      eyebrow={friendlyDate()}
      onRefresh={() => void refresh()}
      refreshing={summary.isRefetching || routines.isRefetching}
      title="Your day, clearly."
    >
      {summary.isPending ? (
        <StateMessage loading message="Bringing your system into focus." title="Loading today" />
      ) : summary.isError ? (
        <StateMessage
          action={<Pressable onPress={() => void refresh()}><Text style={styles.retry}>Try again</Text></Pressable>}
          message="Check that the LifeOS backend is running and your API URL is reachable."
          title="LifeOS is offline"
        />
      ) : (
        <>
          <Card>
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroLabel}>TODAY&apos;S MOMENTUM</Text>
                <Text style={styles.heroValue}>{summary.data.habits.completedToday}/{summary.data.habits.total}</Text>
                <Text style={styles.heroCaption}>daily habits complete</Text>
              </View>
              <View style={styles.heroIcon}>
                <MaterialCommunityIcons color={colors.white} name="compass-outline" size={28} />
              </View>
            </View>
            <ProgressBar color={colors.accent} value={habitProgress} />
          </Card>

          <View style={styles.metricGrid}>
            <Metric icon="target" label="Active goals" value={summary.data.goals.total} />
            <Metric icon="school-outline" label="Learning done" value={summary.data.learning.completed} />
            <Metric icon="weather-sunset" label="Long dreams" value={summary.data.dreams} />
            <Metric icon="briefcase-outline" label="Job moves" value={summary.data.jobs} />
          </View>

          <View style={styles.section}>
            <SectionTitle detail={`${Math.round(milestoneProgress)}% complete`} title="Long-game progress" />
            <Card>
              <View style={styles.goalRow}>
                <Text style={styles.goalValue}>{summary.data.goals.completedMilestones}</Text>
                <Text style={styles.goalCopy}>of {summary.data.goals.milestones} milestones complete</Text>
              </View>
              <ProgressBar value={milestoneProgress} />
            </Card>
          </View>
        </>
      )}

      <View style={styles.section}>
        <SectionTitle detail={routineType} title="Next in your rhythm" />
        <Card>
          {routines.isPending ? (
            <Text style={styles.muted}>Loading your routine…</Text>
          ) : todayRoutine.length === 0 ? (
            <Text style={styles.muted}>No {routineType} routine has been added yet.</Text>
          ) : (
            todayRoutine.map((item, index) => (
              <View key={item.id} style={[styles.routineRow, index > 0 && styles.divider]}>
                <Text style={styles.routineTime}>{item.time}</Text>
                <View style={styles.routineCopy}>
                  <Text style={styles.routineTask}>{item.task}</Text>
                  {item.duration ? <Text style={styles.muted}>{item.duration}</Text> : null}
                </View>
              </View>
            ))
          )}
          <Link asChild href="/routines">
            <Pressable style={styles.linkButton}>
              <Text style={styles.linkText}>See full routine</Text>
              <MaterialCommunityIcons color={colors.primary} name="arrow-right" size={18} />
            </Pressable>
          </Link>
        </Card>
      </View>
    </Screen>
  );
}

function Metric({ icon, label, value }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; value: number }) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.metric}>
      <MaterialCommunityIcons color={colors.primary} name={icon} size={20} />
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  heroTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  heroLabel: { color: colors.inkMuted, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroValue: { color: colors.ink, fontSize: 38, fontWeight: '900', letterSpacing: -1.5, marginTop: spacing.xs },
  heroCaption: { color: colors.inkMuted, fontSize: 13 },
  heroIcon: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.md, height: 52, justifyContent: 'center', width: 52 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: spacing.xs, padding: spacing.lg, width: '48%' },
  metricValue: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  metricLabel: { color: colors.inkMuted, fontSize: 12, fontWeight: '600' },
  section: { gap: spacing.md },
  goalRow: { alignItems: 'baseline', flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  goalValue: { color: colors.ink, fontSize: 28, fontWeight: '900' },
  goalCopy: { color: colors.inkMuted, fontSize: 13 },
  muted: { color: colors.inkMuted, fontSize: 13, lineHeight: 19 },
  routineRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.lg, paddingVertical: spacing.md },
  divider: { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth },
  routineTime: { color: colors.primary, fontSize: 13, fontWeight: '800', width: 58 },
  routineCopy: { flex: 1, gap: 2 },
  routineTask: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  linkButton: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm, paddingTop: spacing.lg },
  linkText: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  retry: { color: colors.primary, fontWeight: '800', padding: spacing.md },
});
