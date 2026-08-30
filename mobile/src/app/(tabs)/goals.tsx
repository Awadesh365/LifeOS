import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Screen } from '@/components/screen';
import { Card, ProgressBar, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';

export default function GoalsScreen() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const queryClient = useQueryClient();
  const goals = useQuery({
    queryKey: ['goals'],
    queryFn: ({ signal }) => api.goals(signal),
  });
  const milestone = useMutation({
    mutationFn: ({ id, done }: { id: string; done: boolean }) => api.updateMilestone(id, done),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['goals'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
    onError: () => Alert.alert('Could not update milestone', 'Please check your connection and try again.'),
  });

  return (
    <Screen
      eyebrow="Keep the long game visible"
      onRefresh={() => void goals.refetch()}
      refreshing={goals.isRefetching}
      title="Goals"
    >
      {goals.isPending ? (
        <StateMessage loading message="Mapping your long game." title="Loading goals" />
      ) : goals.isError ? (
        <StateMessage message="Pull down to try again." title="Goals unavailable" />
      ) : goals.data.length === 0 ? (
        <StateMessage icon="target" message="Create goals on the web workspace; they will appear here immediately." title="No goals yet" />
      ) : (
        goals.data.map((goal) => {
          const target = Number(goal.target) || 0;
          const current = Number(goal.current) || 0;
          const progress = target > 0 ? (current / target) * 100 : 0;
          return (
            <Card key={goal.id}>
              <View style={styles.goalHeading}>
                <View style={styles.goalIcon}>
                  <Text style={styles.goalEmoji}>{goal.icon || '◎'}</Text>
                </View>
                <View style={styles.goalCopy}>
                  <Text style={styles.category}>{goal.category}</Text>
                  <Text style={styles.title}>{goal.title}</Text>
                </View>
                <Text style={styles.percentage}>{Math.round(progress)}%</Text>
              </View>
              <ProgressBar value={progress} />
              <Text style={styles.measure}>{current} / {target} {goal.unit}</Text>

              {goal.milestones.length > 0 ? (
                <View style={styles.milestones}>
                  {goal.milestones.map((item) => (
                    <Pressable
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: item.done }}
                      key={item.id}
                      onPress={() => milestone.mutate({ id: item.id, done: !item.done })}
                      style={styles.milestone}
                    >
                      <MaterialCommunityIcons
                        color={item.done ? colors.success : colors.inkMuted}
                        name={item.done ? 'check-circle' : 'circle-outline'}
                        size={22}
                      />
                      <Text style={[styles.milestoneText, item.done && styles.done]}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </Card>
          );
        })
      )}
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  goalHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
  goalIcon: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: radii.md, height: 48, justifyContent: 'center', width: 48 },
  goalEmoji: { fontSize: 22 },
  goalCopy: { flex: 1, gap: 3 },
  category: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { color: colors.ink, fontSize: 17, fontWeight: '800' },
  percentage: { color: colors.ink, fontSize: 16, fontWeight: '900' },
  measure: { color: colors.inkMuted, fontSize: 12, marginTop: spacing.sm, textAlign: 'right' },
  milestones: { borderTopColor: colors.border, borderTopWidth: 1, gap: spacing.md, marginTop: spacing.lg, paddingTop: spacing.lg },
  milestone: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, minHeight: 32 },
  milestoneText: { color: colors.ink, flex: 1, fontSize: 14, fontWeight: '600' },
  done: { color: colors.inkMuted, textDecorationLine: 'line-through' },
});
