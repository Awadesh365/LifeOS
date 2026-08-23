import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Screen } from '@/components/screen';
import { Button, Card, SectionTitle, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { colors, radii, spacing } from '@/theme';
import type { HealthLog } from '@/types/api';
import { localIsoDate } from '@/utils/date';

type NumberField = Exclude<keyof HealthLog, 'id' | 'date' | 'notes'>;
type Draft = Record<NumberField, string> & { notes: string };

const today = localIsoDate();
const emptyDraft: Draft = {
  gymMinutes: '',
  walkMinutes: '',
  meditationMinutes: '',
  sleepHours: '',
  sleepQuality: '',
  waterLiters: '',
  dietScore: '',
  socializationMinutes: '',
  mentalPeaceScore: '',
  moodScore: '',
  notes: '',
};

const fields: { key: NumberField; label: string; suffix: string; max?: number }[] = [
  { key: 'sleepHours', label: 'Sleep', suffix: 'hours', max: 24 },
  { key: 'waterLiters', label: 'Water', suffix: 'litres' },
  { key: 'walkMinutes', label: 'Walking', suffix: 'minutes' },
  { key: 'gymMinutes', label: 'Training', suffix: 'minutes' },
  { key: 'meditationMinutes', label: 'Meditation', suffix: 'minutes' },
  { key: 'socializationMinutes', label: 'Social time', suffix: 'minutes' },
  { key: 'sleepQuality', label: 'Sleep quality', suffix: '/ 10', max: 10 },
  { key: 'dietScore', label: 'Diet quality', suffix: '/ 10', max: 10 },
  { key: 'mentalPeaceScore', label: 'Mental peace', suffix: '/ 10', max: 10 },
  { key: 'moodScore', label: 'Mood', suffix: '/ 10', max: 10 },
];

export default function HealthScreen() {
  const health = useQuery({
    queryKey: ['health', today],
    queryFn: ({ signal }) => api.health(today, signal),
  });
  const weekly = useQuery({
    queryKey: ['health', 'weekly'],
    queryFn: ({ signal }) => api.weeklyHealth(signal),
  });

  const averages = weekly.data?.length ? {
    sleep: weekly.data.reduce((sum, log) => sum + Number(log.sleepHours || 0), 0) / weekly.data.length,
    water: weekly.data.reduce((sum, log) => sum + Number(log.waterLiters || 0), 0) / weekly.data.length,
    mood: weekly.data.reduce((sum, log) => sum + Number(log.moodScore || 0), 0) / weekly.data.length,
  } : null;

  return (
    <Screen
      eyebrow="Body and mind"
      onRefresh={() => void Promise.all([health.refetch(), weekly.refetch()])}
      refreshing={health.isRefetching || weekly.isRefetching}
      title="Health check-in"
    >
      {averages ? (
        <View style={styles.averageRow}>
          <Average icon="sleep" label="avg sleep" value={`${averages.sleep.toFixed(1)}h`} />
          <Average icon="cup-water" label="avg water" value={`${averages.water.toFixed(1)}L`} />
          <Average icon="emoticon-happy-outline" label="avg mood" value={averages.mood.toFixed(1)} />
        </View>
      ) : null}

      {health.isPending ? (
        <StateMessage loading message="Loading today’s health signals." title="One moment" />
      ) : health.isError ? (
        <StateMessage message="Pull down to try again." title="Check-in unavailable" />
      ) : (
        <HealthForm initialLog={health.data} key={health.data?.id ?? 'new-check-in'} />
      )}
    </Screen>
  );
}

function HealthForm({ initialLog }: { initialLog: HealthLog | null }) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(() => initialLog ? {
    gymMinutes: String(initialLog.gymMinutes ?? ''),
    walkMinutes: String(initialLog.walkMinutes ?? ''),
    meditationMinutes: String(initialLog.meditationMinutes ?? ''),
    sleepHours: String(initialLog.sleepHours ?? ''),
    sleepQuality: String(initialLog.sleepQuality ?? ''),
    waterLiters: String(initialLog.waterLiters ?? ''),
    dietScore: String(initialLog.dietScore ?? ''),
    socializationMinutes: String(initialLog.socializationMinutes ?? ''),
    mentalPeaceScore: String(initialLog.mentalPeaceScore ?? ''),
    moodScore: String(initialLog.moodScore ?? ''),
    notes: initialLog.notes ?? '',
  } : emptyDraft);
  const save = useMutation({
    mutationFn: () => api.saveHealth({
      date: today,
      gymMinutes: Number(draft.gymMinutes) || 0,
      walkMinutes: Number(draft.walkMinutes) || 0,
      meditationMinutes: Number(draft.meditationMinutes) || 0,
      sleepHours: Number(draft.sleepHours) || 0,
      sleepQuality: Number(draft.sleepQuality) || 0,
      waterLiters: Number(draft.waterLiters) || 0,
      dietScore: Number(draft.dietScore) || 0,
      socializationMinutes: Number(draft.socializationMinutes) || 0,
      mentalPeaceScore: Number(draft.mentalPeaceScore) || 0,
      moodScore: Number(draft.moodScore) || 0,
      notes: draft.notes.trim(),
    }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['health'] });
      Alert.alert('Health check-in saved', 'Today’s signals are now part of your LifeOS.');
    },
    onError: () => Alert.alert('Could not save check-in', 'Please check your connection and try again.'),
  });

  return (
    <>
      <SectionTitle detail={today} title="Today’s signals" />
      <View style={styles.fieldGrid}>
        {fields.map((field) => (
          <View key={field.key} style={styles.fieldCard}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              accessibilityLabel={field.label}
              inputMode="decimal"
              maxLength={5}
              onChangeText={(value) => {
                const normalized = value.replace(/[^0-9.]/g, '');
                const bounded = field.max && Number(normalized) > field.max ? String(field.max) : normalized;
                setDraft((current) => ({ ...current, [field.key]: bounded }));
              }}
              placeholder="0"
              placeholderTextColor={colors.inkMuted}
              style={styles.numberInput}
              value={draft[field.key]}
            />
            <Text style={styles.suffix}>{field.suffix}</Text>
          </View>
        ))}
      </View>
      <Card>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          accessibilityLabel="Health notes"
          multiline
          onChangeText={(notes) => setDraft((current) => ({ ...current, notes }))}
          placeholder="Energy, symptoms, context…"
          placeholderTextColor={colors.inkMuted}
          style={styles.notes}
          textAlignVertical="top"
          value={draft.notes}
        />
      </Card>
      <Button
        disabled={save.isPending}
        label={save.isPending ? 'Saving check-in…' : 'Save today’s check-in'}
        onPress={() => save.mutate()}
      />
    </>
  );
}

function Average({ icon, label, value }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; value: string }) {
  return (
    <View style={styles.average}>
      <MaterialCommunityIcons color={colors.primary} name={icon} size={18} />
      <Text style={styles.averageValue}>{value}</Text>
      <Text style={styles.averageLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  averageRow: { flexDirection: 'row', gap: spacing.sm },
  average: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.md, flex: 1, gap: 2, padding: spacing.md },
  averageValue: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  averageLabel: { color: colors.inkMuted, fontSize: 10 },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  fieldCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, padding: spacing.md, width: '48%' },
  label: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  numberInput: { color: colors.ink, fontSize: 28, fontWeight: '900', minHeight: 44, padding: 0 },
  suffix: { color: colors.inkMuted, fontSize: 11 },
  notes: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: radii.sm, borderWidth: 1, color: colors.ink, fontSize: 15, lineHeight: 21, marginTop: spacing.sm, minHeight: 100, padding: spacing.md },
});
