import { useQuery } from '@tanstack/react-query';
import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/screen';
import { Card, StateMessage } from '@/components/ui';
import { findModule } from '@/config/modules';
import { api } from '@/services/api';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';
import type { GenericRecord } from '@/types/api';

export default function ModuleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const module = findModule(slug);
  const records = useQuery({
    enabled: Boolean(module),
    queryKey: ['module', module?.slug],
    queryFn: ({ signal }) => api.module(module!.endpoint, signal),
  });

  if (!module) return <Redirect href="/(tabs)/more" />;

  return (
    <>
      <Stack.Screen options={{ title: module.title }} />
      <Screen
        eyebrow={module.description}
        onRefresh={() => void records.refetch()}
        refreshing={records.isRefetching}
        title={module.title}
      >
        {records.isPending ? (
          <StateMessage loading message={`Loading ${module.title.toLowerCase()}.`} title="One moment" />
        ) : records.isError ? (
          <StateMessage message="Pull down to retry the connection." title={`${module.title} unavailable`} />
        ) : records.data.length === 0 ? (
          <StateMessage icon={module.icon} message="Add your first entry in the web workspace; it will appear here immediately." title="Nothing here yet" />
        ) : (
          records.data.map((record, index) => (
            <RecordCard
              key={typeof record.id === 'string' ? record.id : `${module.slug}-${index}`}
              primaryKeys={module.primaryKeys}
              record={record}
              secondaryKeys={module.secondaryKeys}
            />
          ))
        )}
      </Screen>
    </>
  );
}

function RecordCard({
  record,
  primaryKeys,
  secondaryKeys,
}: {
  record: GenericRecord;
  primaryKeys: string[];
  secondaryKeys: string[];
}) {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const titleEntry = primaryKeys.find((key) => hasValue(record[key]));
  const title = titleEntry ? formatValue(record[titleEntry]) : 'Untitled entry';
  const details = secondaryKeys
    .filter((key) => hasValue(record[key]))
    .map((key) => ({ key, value: formatValue(record[key]) }));

  return (
    <Card>
      <Text style={styles.title}>{title}</Text>
      {details.length > 0 ? (
        <View style={styles.details}>
          {details.map((detail) => (
            <View key={detail.key} style={styles.detailRow}>
              <Text style={styles.label}>{humanize(detail.key)}</Text>
              <Text numberOfLines={3} style={styles.value}>{detail.value}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {Array.isArray(record.items) ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{record.items.length} items</Text>
        </View>
      ) : null}
    </Card>
  );
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function formatValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return new Intl.NumberFormat('en-IN').format(value);
  if (typeof value === 'string') return value;
  return Array.isArray(value) ? `${value.length} items` : '—';
}

function humanize(value: string): string {
  return value.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase());
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  title: { color: colors.ink, fontSize: 18, fontWeight: '800', lineHeight: 24 },
  details: { borderTopColor: colors.border, borderTopWidth: 1, gap: spacing.md, marginTop: spacing.md, paddingTop: spacing.md },
  detailRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  label: { color: colors.inkMuted, fontSize: 11, fontWeight: '700', paddingTop: 2, width: 86 },
  value: { color: colors.ink, flex: 1, fontSize: 13, lineHeight: 19 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: radii.pill, marginTop: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  badgeText: { color: colors.primary, fontSize: 11, fontWeight: '800' },
});
