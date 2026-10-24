import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AppState,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Screen } from "@/components/screen";
import { Button, Card, ProgressBar, StateMessage } from "@/components/ui";
import { api } from "@/services/api";
import { radii, spacing, type ThemeColors } from "@/theme";
import { useLifeOSTheme } from "@/theme/provider";
import type { Habit } from "@/types/api";
import { localIsoDate } from "@/utils/date";

function shiftDate(value: string, offset: number) {
  const day = new Date(`${value}T12:00:00`);
  day.setDate(day.getDate() + offset);
  return localIsoDate(day);
}
const blank = { name: "", category: "Personal", icon: "✓" };

export default function HabitsScreen() {
  const { colors } = useLifeOSTheme();
  const styles = createStyles(colors);
  const queryClient = useQueryClient();
  const [today, setToday] = useState(localIsoDate);
  const [date, setDate] = useState(localIsoDate);
  const [editor, setEditor] = useState<Habit | "new" | null>(null);
  const [deleting, setDeleting] = useState<Habit | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const habits = useQuery({
    queryKey: ["habit-week", date],
    queryFn: ({ signal }) => api.habitWeek(date, signal),
  });
  const day = habits.data?.days.find((item) => item.date === date);

  useEffect(() => {
    const update = () => {
      const next = localIsoDate();
      if (today !== next) {
        setDate((selected) => (selected === today ? next : selected));
        setToday(next);
      }
    };
    const interval = setInterval(update, 30_000);
    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") update();
    });
    return () => {
      clearInterval(interval);
      listener.remove();
    };
  }, [today]);

  async function mutate(
    action: () => Promise<unknown>,
    message: string,
    close?: () => void,
  ) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setSaved("");
    try {
      await action();
      close?.();
      setSaved(message);
      await Promise.all(
        ["habit-week", "habits", "dashboard"].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Save failed. Please retry.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function edit(habit?: Habit) {
    setEditor(habit ?? "new");
    setError("");
    setForm(
      habit
        ? { name: habit.name, category: habit.category, icon: habit.icon }
        : blank,
    );
  }
  const disabled = busy || habits.isFetching || habits.isError;
  return (
    <Screen
      title="Habits"
      eyebrow="Daily practice"
      refreshing={habits.isRefetching}
      onRefresh={() => {
        if (!busy) void habits.refetch();
      }}
      action={
        <Button label="Add habit" disabled={busy} onPress={() => edit()} />
      }
    >
      <View style={styles.list}>
        <View style={styles.progressHeading}>
          <Button
            label="Previous day"
            disabled={busy || date <= "1900-01-08"}
            onPress={() => setDate(shiftDate(date, -1))}
          />
          <Text style={styles.category}>{date}</Text>
          <Button
            label="Next day"
            disabled={busy || date >= today}
            onPress={() => setDate(shiftDate(date, 1))}
          />
        </View>
        <View style={styles.progressHeading}>
          <Button
            label="Today"
            disabled={busy}
            onPress={() => setDate(today)}
          />
          <Button
            label="Refresh"
            disabled={busy || habits.isFetching}
            onPress={() => void habits.refetch()}
          />
        </View>
        {error ? (
          <Text accessibilityRole="alert" style={styles.category}>
            {error}
          </Text>
        ) : null}
        {saved ? (
          <Text accessibilityRole="alert" style={styles.category}>
            {saved}
          </Text>
        ) : null}
        {habits.isPending ? (
          <StateMessage
            loading
            title="Loading habits"
            message="Getting your daily history."
          />
        ) : habits.isError ? (
          <StateMessage
            title="Habits unavailable"
            message="Pull down or retry to reconnect."
            action={
              <Button label="Retry" onPress={() => void habits.refetch()} />
            }
          />
        ) : (
          <>
            <Card>
              <Text style={styles.progressTitle}>
                {day?.completed ?? 0} of {day?.total ?? 0} complete
              </Text>
              <ProgressBar
                value={day?.total ? (day.completed / day.total) * 100 : 0}
              />
            </Card>
            <Card>
              <Text style={styles.habitName}>Seven-day progress</Text>
              <Text style={styles.category}>
                Seven days ending {date}. Counts use your current habit list;
                deleting a habit removes its history.
              </Text>
              {habits.data.days.map((item) => (
                <Pressable
                  key={item.date}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${item.date}: ${item.completed} of ${item.total} complete`}
                  disabled={busy}
                  onPress={() => setDate(item.date)}
                  style={styles.progressHeading}
                >
                  <Text style={styles.category}>{item.date}</Text>
                  <Text style={styles.habitName}>
                    {item.completed}/{item.total}
                  </Text>
                </Pressable>
              ))}
            </Card>
            {!day?.habits.length ? (
              <StateMessage
                title="Build your rhythm"
                message="Start with one small practice."
                action={
                  <Button
                    label="Create your first habit"
                    onPress={() => edit()}
                  />
                }
              />
            ) : (
              day.habits.map((habit) => (
                <Card key={habit.id}>
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityLabel={`Complete ${habit.name}`}
                    accessibilityState={{ checked: habit.done, disabled }}
                    aria-checked={habit.done}
                    aria-disabled={disabled}
                    disabled={disabled}
                    onPress={() =>
                      void mutate(
                        () =>
                          api.setHabitCompletion(habit.id, date, !habit.done),
                        habit.done
                          ? "Habit marked incomplete."
                          : "Habit completed.",
                      )
                    }
                    style={styles.habit}
                  >
                    <View
                      style={[styles.check, habit.done && styles.checkDone]}
                    >
                      {habit.done ? (
                        <MaterialCommunityIcons
                          color={colors.white}
                          name="check"
                          size={20}
                        />
                      ) : null}
                    </View>
                    <View style={styles.habitCopy}>
                      <Text
                        style={[
                          styles.habitName,
                          habit.done && styles.habitNameDone,
                        ]}
                      >
                        {habit.icon} {habit.name}
                      </Text>
                      <Text style={styles.category}>{habit.category}</Text>
                    </View>
                  </Pressable>
                  <View style={styles.progressHeading}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Edit ${habit.name}`}
                      disabled={disabled}
                      aria-disabled={disabled}
                      onPress={() => edit(habit)}
                      style={styles.manageButton}
                    >
                      <Text style={styles.manageText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Delete ${habit.name}`}
                      disabled={disabled}
                      aria-disabled={disabled}
                      onPress={() => {
                        setDeleting(habit);
                        setError("");
                      }}
                      style={styles.manageButton}
                    >
                      <Text style={styles.manageText}>Delete</Text>
                    </Pressable>
                  </View>
                </Card>
              ))
            )}
          </>
        )}
      </View>
      <Modal
        animationType="slide"
        transparent
        visible={Boolean(editor)}
        onRequestClose={() => {
          if (!busy) setEditor(null);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalBackdrop}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: "90%", flexGrow: 0 }}
            contentContainerStyle={styles.modalCard}
          >
            <Text style={styles.modalTitle}>
              {editor === "new" ? "Add habit" : "Edit habit"}
            </Text>
            {error ? (
              <Text accessibilityRole="alert" style={styles.category}>
                {error}
              </Text>
            ) : null}
            {(["name", "category", "icon"] as const).map((key) => (
              <View key={key}>
                <Text style={styles.inputLabel}>{key}</Text>
                <TextInput
                  accessibilityLabel={key}
                  autoFocus={key === "name"}
                  editable={!busy}
                  maxLength={key === "name" ? 80 : key === "category" ? 40 : 32}
                  style={styles.input}
                  value={form[key]}
                  onChangeText={(value) => setForm({ ...form, [key]: value })}
                />
              </View>
            ))}
            <Button
              disabled={
                busy ||
                !form.name.trim() ||
                !form.category.trim() ||
                !form.icon.trim()
              }
              label={busy ? "Saving…" : "Save habit"}
              onPress={() =>
                void mutate(
                  () =>
                    editor === "new"
                      ? api.createHabit(form)
                      : api.updateHabit((editor as Habit).id, form),
                  "Habit saved.",
                  () => setEditor(null),
                )
              }
            />
            <Button
              disabled={busy}
              label="Cancel"
              onPress={() => setEditor(null)}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <Modal
        transparent
        visible={Boolean(deleting)}
        onRequestClose={() => {
          if (!busy) setDeleting(null);
        }}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Delete {deleting?.name}?</Text>
            <Text style={styles.category}>
              This permanently deletes the habit and all its completion history
              on web and mobile.
            </Text>
            {error ? (
              <Text accessibilityRole="alert" style={styles.category}>
                {error}
              </Text>
            ) : null}
            <Button
              disabled={busy}
              label={busy ? "Deleting…" : "Delete permanently"}
              onPress={() =>
                void mutate(
                  () => api.deleteHabit(deleting!.id),
                  "Habit and history deleted.",
                  () => setDeleting(null),
                )
              }
            />
            <Button
              disabled={busy}
              label="Cancel"
              onPress={() => setDeleting(null)}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    addButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: radii.pill,
      height: 46,
      justifyContent: "center",
      width: 46,
    },
    manageButton: {
      borderColor: colors.border,
      borderWidth: 1,
      borderRadius: radii.sm,
      minHeight: 44,
      paddingHorizontal: spacing.lg,
      justifyContent: "center",
    },
    manageText: { color: colors.ink, fontWeight: "700" },
    progressHeading: {
      flexWrap: "wrap",
      alignItems: "baseline",
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    progressTitle: { color: colors.ink, fontSize: 25, fontWeight: "900" },
    progressLabel: { color: colors.inkMuted, fontSize: 13 },
    list: { gap: spacing.sm },
    habit: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radii.md,
      borderWidth: 1,
      flexDirection: "row",
      gap: spacing.md,
      minHeight: 76,
      padding: spacing.lg,
    },
    pressed: { opacity: 0.72 },
    check: {
      alignItems: "center",
      borderColor: colors.border,
      borderRadius: radii.pill,
      borderWidth: 2,
      height: 30,
      justifyContent: "center",
      width: 30,
    },
    checkDone: { backgroundColor: colors.success, borderColor: colors.success },
    habitCopy: { flex: 1, gap: 3 },
    habitName: { color: colors.ink, fontSize: 16, fontWeight: "700" },
    habitNameDone: {
      color: colors.inkMuted,
      textDecorationLine: "line-through",
    },
    category: { color: colors.inkMuted, fontSize: 12 },
    modalBackdrop: {
      backgroundColor: "rgba(7, 19, 31, 0.45)",
      flex: 1,
      justifyContent: "flex-end",
    },
    modalCard: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: radii.lg,
      borderTopRightRadius: radii.lg,
      gap: spacing.md,
      padding: spacing.xl,
      paddingBottom: 40,
    },
    modalHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
    },
    modalTitle: { color: colors.ink, fontSize: 24, fontWeight: "900" },
    inputLabel: { color: colors.ink, fontSize: 13, fontWeight: "800" },
    input: {
      backgroundColor: colors.background,
      borderColor: colors.border,
      borderRadius: radii.sm,
      borderWidth: 1,
      color: colors.ink,
      fontSize: 16,
      minHeight: 50,
      paddingHorizontal: spacing.md,
    },
  });
