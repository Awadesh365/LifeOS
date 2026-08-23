import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Screen } from '@/components/screen';
import { Button, Card, ProgressBar, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { colors, radii, spacing } from '@/theme';
import type { Habit } from '@/types/api';
import { localIsoDate } from '@/utils/date';

const today = localIsoDate();

export default function HabitsScreen() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Personal');
  const queryKey = ['habits', today] as const;
  const habits = useQuery({
    queryKey,
    queryFn: ({ signal }) => api.habits(today, signal),
  });

  const toggle = useMutation({
    mutationFn: ({ id }: { id: string; done: boolean }) => api.toggleHabit(id, today),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<Habit[]>(queryKey);
      queryClient.setQueryData<Habit[]>(queryKey, (current = []) =>
        current.map((habit) => habit.id === id ? { ...habit, done: !habit.done } : habit),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
      Alert.alert('Could not update habit', 'Your change was restored. Please try again.');
    },
    onSettled: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]);
    },
  });

  const create = useMutation({
    mutationFn: () => api.createHabit({ name: name.trim(), category: category.trim(), icon: '✓' }),
    onSuccess: async () => {
      setName('');
      setCategory('Personal');
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: () => Alert.alert('Could not add habit', 'Check your connection and try again.'),
  });

  const completed = habits.data?.filter((habit) => habit.done).length ?? 0;
  const progress = habits.data?.length ? (completed / habits.data.length) * 100 : 0;

  return (
    <Screen
      action={
        <Pressable accessibilityLabel="Add habit" onPress={() => setModalOpen(true)} style={styles.addButton}>
          <MaterialCommunityIcons color={colors.white} name="plus" size={24} />
        </Pressable>
      }
      eyebrow="Daily practice"
      onRefresh={() => void habits.refetch()}
      refreshing={habits.isRefetching}
      title="Habits"
    >
      <Card>
        <View style={styles.progressHeading}>
          <Text style={styles.progressTitle}>{completed} of {habits.data?.length ?? 0}</Text>
          <Text style={styles.progressLabel}>complete today</Text>
        </View>
        <ProgressBar value={progress} />
      </Card>

      {habits.isPending ? (
        <StateMessage loading message="Loading today’s practices." title="One moment" />
      ) : habits.isError ? (
        <StateMessage message="Pull down to try the connection again." title="Habits unavailable" />
      ) : habits.data.length === 0 ? (
        <StateMessage
          action={<Button label="Create your first habit" onPress={() => setModalOpen(true)} />}
          icon="sprout-outline"
          message="Start with one small practice you want to repeat."
          title="Build your rhythm"
        />
      ) : (
        <View style={styles.list}>
          {habits.data.map((habit) => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: habit.done }}
              key={habit.id}
              onPress={() => toggle.mutate({ id: habit.id, done: habit.done })}
              style={({ pressed }) => [styles.habit, pressed && styles.pressed]}
            >
              <View style={[styles.check, habit.done && styles.checkDone]}>
                {habit.done ? <MaterialCommunityIcons color={colors.white} name="check" size={20} /> : null}
              </View>
              <View style={styles.habitCopy}>
                <Text style={[styles.habitName, habit.done && styles.habitNameDone]}>{habit.name}</Text>
                <Text style={styles.category}>{habit.category}</Text>
              </View>
              <MaterialCommunityIcons color={colors.inkMuted} name="chevron-right" size={20} />
            </Pressable>
          ))}
        </View>
      )}

      <Modal animationType="slide" onRequestClose={() => setModalOpen(false)} transparent visible={modalOpen}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New habit</Text>
              <Pressable accessibilityLabel="Close" onPress={() => setModalOpen(false)}>
                <MaterialCommunityIcons color={colors.ink} name="close" size={24} />
              </Pressable>
            </View>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              autoFocus
              maxLength={80}
              onChangeText={setName}
              placeholder="e.g. Read for 20 minutes"
              placeholderTextColor={colors.inkMuted}
              style={styles.input}
              value={name}
            />
            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              maxLength={40}
              onChangeText={setCategory}
              placeholder="Personal"
              placeholderTextColor={colors.inkMuted}
              style={styles.input}
              value={category}
            />
            <Button
              disabled={!name.trim() || create.isPending}
              label={create.isPending ? 'Saving…' : 'Add habit'}
              onPress={() => create.mutate()}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radii.pill, height: 46, justifyContent: 'center', width: 46 },
  progressHeading: { alignItems: 'baseline', flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  progressTitle: { color: colors.ink, fontSize: 25, fontWeight: '900' },
  progressLabel: { color: colors.inkMuted, fontSize: 13 },
  list: { gap: spacing.sm },
  habit: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, minHeight: 76, padding: spacing.lg },
  pressed: { opacity: 0.72 },
  check: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.pill, borderWidth: 2, height: 30, justifyContent: 'center', width: 30 },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
  habitCopy: { flex: 1, gap: 3 },
  habitName: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  habitNameDone: { color: colors.inkMuted, textDecorationLine: 'line-through' },
  category: { color: colors.inkMuted, fontSize: 12 },
  modalBackdrop: { backgroundColor: 'rgba(7, 19, 31, 0.45)', flex: 1, justifyContent: 'flex-end' },
  modalCard: { backgroundColor: colors.surface, borderTopLeftRadius: radii.lg, borderTopRightRadius: radii.lg, gap: spacing.md, padding: spacing.xl, paddingBottom: 40 },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  modalTitle: { color: colors.ink, fontSize: 24, fontWeight: '900' },
  inputLabel: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  input: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.sm, borderWidth: 1, color: colors.ink, fontSize: 16, minHeight: 50, paddingHorizontal: spacing.md },
});
