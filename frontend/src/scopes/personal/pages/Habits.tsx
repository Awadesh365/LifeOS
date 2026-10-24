import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../components/Header";
import { api } from "../api/client";
import type { HabitWithDone } from "../types";
import { localHabitDate, shiftHabitDate } from "../habits/date";

type Week = Awaited<ReturnType<typeof api.getHabitWeek>>;
const blank = { name: "", category: "Personal", icon: "✓" };

export default function Habits({ isMobile = false }: { isMobile?: boolean }) {
  const [today, setToday] = useState(localHabitDate);
  const [date, setDate] = useState(localHabitDate);
  const [week, setWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  const requestId = useRef(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState("all");
  const [editor, setEditor] = useState<HabitWithDone | "new" | null>(null);
  const [form, setForm] = useState(blank);
  const [formError, setFormError] = useState("");
  const [deleting, setDeleting] = useState<HabitWithDone | null>(null);

  const refresh = useCallback(async () => {
    const current = ++requestId.current;
    setLoading(true);
    setError("");
    try {
      const result = await api.getHabitWeek(date);
      if (current === requestId.current) setWeek(result);
    } catch (reason) {
      if (current === requestId.current) {
        setWeek(null);
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not load habits. Retry to reconnect.",
        );
      }
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  }, [date]);

  const latestRefresh = useRef(refresh);
  latestRefresh.current = refresh;

  useEffect(() => {
    void refresh();
    return () => {
      requestId.current++;
    };
  }, [refresh]);
  useEffect(() => {
    const update = () => {
      const next = localHabitDate();
      if (today !== next) {
        setDate((selected) => (selected === today ? next : selected));
        setToday(next);
      }
    };
    const timer = window.setInterval(update, 30_000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, [today]);

  const selected = week?.days.find((day) => day.date === date);
  const habits = selected?.habits ?? [];
  const completed = selected?.completed ?? 0;
  const percent = habits.length
    ? Math.round((completed / habits.length) * 100)
    : 0;
  const visible = habits.filter(
    (habit) =>
      filter === "all" ||
      (filter === "done"
        ? habit.done
        : filter === "open"
          ? !habit.done
          : habit.category === filter.slice(9)),
  );
  const filters = [
    { value: "all", label: "All" },
    { value: "open", label: "Open" },
    { value: "done", label: "Done" },
    ...[...new Set(habits.map((habit) => habit.category))].map((category) => ({
      value: `category:${category}`,
      label: category,
    })),
  ];
  const disabled = busy || loading || !week;

  async function mutate(
    action: () => Promise<unknown>,
    success: string,
    close?: () => void,
  ) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    setFormError("");
    setNotice("");
    try {
      await action();
      close?.();
      setNotice(success);
      await latestRefresh.current();
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : "Save failed. Please retry.";
      setError(message);
      setFormError(message);
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  function openEditor(habit?: HabitWithDone) {
    setEditor(habit ?? "new");
    setForm(
      habit
        ? { name: habit.name, category: habit.category, icon: habit.icon }
        : blank,
    );
    setFormError("");
  }

  return (
    <>
      <Header
        title="Daily Tracker"
        subtitle="Build a daily rhythm, one practice at a time"
      />
      <Box sx={{ p: isMobile ? 2 : 3 }}>
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={1}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Button
            disabled={busy || date <= "1900-01-08"}
            onClick={() => setDate(shiftHabitDate(date, -1))}
          >
            Previous day
          </Button>
          <TextField
            label="Habit date"
            type="date"
            value={date}
            disabled={busy}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: "1900-01-07", max: today },
            }}
            onChange={(event) => {
              const next = event.target.value;
              if (
                /^\d{4}-\d{2}-\d{2}$/.test(next) &&
                next <= today &&
                next >= "1900-01-07"
              )
                setDate(next);
            }}
          />
          <Button
            disabled={busy || date >= today}
            onClick={() => setDate(shiftHabitDate(date, 1))}
          >
            Next day
          </Button>
          <Button disabled={busy} onClick={() => setDate(today)}>
            Today
          </Button>
          <Button disabled={busy || loading} onClick={() => void refresh()}>
            Refresh
          </Button>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() => openEditor()}
          >
            Add habit
          </Button>
        </Stack>
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <Button disabled={busy || loading} onClick={() => void refresh()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        {notice && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {notice}
          </Alert>
        )}
        {loading ? (
          <Box role="status" sx={{ p: 4 }}>
            <CircularProgress size={24} /> Loading habits…
          </Box>
        ) : (
          week && (
            <>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h5">
                    {completed} of {habits.length} complete · {percent}%
                  </Typography>
                  <Typography color="text.secondary">
                    {date === today ? "Today" : date}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={percent}
                    sx={{ my: 2, height: 8, borderRadius: 4 }}
                  />
                  <Stack direction="row" gap={1}>
                    <Button
                      disabled={disabled || completed === habits.length}
                      onClick={() =>
                        void mutate(
                          () =>
                            api.setHabitCompletions(
                              habits.map((h) => h.id),
                              date,
                              true,
                            ),
                          "All habits marked complete.",
                        )
                      }
                    >
                      Mark all done
                    </Button>
                    <Button
                      disabled={disabled || !completed}
                      onClick={() =>
                        void mutate(
                          () =>
                            api.setHabitCompletions(
                              habits.map((h) => h.id),
                              date,
                              false,
                            ),
                          "All habits marked incomplete.",
                        )
                      }
                    >
                      Reset day
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6">Seven-day progress</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Seven days ending {date}. Counts use your current habit
                    list; deleting a habit removes its history.
                  </Typography>
                  <Stack direction="row" gap={1} sx={{ overflowX: "auto" }}>
                    {week.days.map((day) => (
                      <Button
                        key={day.date}
                        variant={day.date === date ? "contained" : "outlined"}
                        disabled={busy}
                        onClick={() => setDate(day.date)}
                        aria-label={`View ${day.date}: ${day.completed} of ${day.total} complete`}
                        sx={{ minWidth: 90, flexDirection: "column" }}
                      >
                        <span>
                          {new Date(`${day.date}T12:00:00`).toLocaleDateString(
                            "en",
                            { weekday: "short", day: "numeric" },
                          )}
                        </span>
                        <strong>
                          {day.completed}/{day.total}
                        </strong>
                      </Button>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
              <Stack direction="row" gap={1} sx={{ mb: 2 }}>
                {filters.map(({ value, label }) => (
                  <Chip
                    key={value}
                    label={label}
                    color={filter === value ? "primary" : "default"}
                    onClick={() => setFilter(value)}
                  />
                ))}
              </Stack>
              {!habits.length ? (
                <Alert severity="info">
                  No habits yet. Add your first habit to start tracking.
                </Alert>
              ) : !visible.length ? (
                <Alert severity="info">No habits match this filter.</Alert>
              ) : (
                <Stack gap={1}>
                  {visible.map((habit) => (
                    <Card key={habit.id} variant="outlined">
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Checkbox
                          checked={habit.done}
                          disabled={disabled}
                          inputProps={{
                            "aria-label": `Complete ${habit.name}`,
                          }}
                          onChange={(_, done) =>
                            void mutate(
                              () =>
                                api.setHabitCompletion(habit.id, date, done),
                              done
                                ? "Habit completed."
                                : "Habit marked incomplete.",
                            )
                          }
                        />
                        <Box sx={{ flex: 1, minWidth: 120 }}>
                          <Typography
                            sx={{
                              textDecoration: habit.done
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {habit.icon} {habit.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {habit.category}
                          </Typography>
                        </Box>
                        <Button
                          disabled={disabled}
                          aria-label={`Edit ${habit.name}`}
                          onClick={() => openEditor(habit)}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          disabled={disabled}
                          aria-label={`Delete ${habit.name}`}
                          onClick={() => {
                            setDeleting(habit);
                            setFormError("");
                          }}
                        >
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </>
          )
        )}
        <Dialog
          open={Boolean(editor)}
          onClose={() => {
            if (!busy) setEditor(null);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editor === "new" ? "Add habit" : "Edit habit"}
          </DialogTitle>
          <DialogContent>
            <Stack gap={2} sx={{ pt: 1 }}>
              {formError && <Alert severity="error">{formError}</Alert>}
              {(["name", "category", "icon"] as const).map((key) => (
                <TextField
                  key={key}
                  autoFocus={key === "name"}
                  label={
                    key === "name"
                      ? "Name"
                      : key === "category"
                        ? "Category"
                        : "Icon"
                  }
                  value={form[key]}
                  disabled={busy}
                  inputProps={{
                    maxLength:
                      key === "name" ? 80 : key === "category" ? 40 : 32,
                  }}
                  onChange={(event) =>
                    setForm({ ...form, [key]: event.target.value })
                  }
                />
              ))}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={
                busy ||
                !form.name.trim() ||
                !form.category.trim() ||
                !form.icon.trim()
              }
              onClick={() =>
                void mutate(
                  () =>
                    editor === "new"
                      ? api.createHabit(form)
                      : api.updateHabit((editor as HabitWithDone).id, form),
                  "Habit saved.",
                  () => setEditor(null),
                )
              }
            >
              {busy ? "Saving…" : "Save habit"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={Boolean(deleting)}
          onClose={() => {
            if (!busy) setDeleting(null);
          }}
        >
          <DialogTitle>Delete {deleting?.name}?</DialogTitle>
          <DialogContent>
            {formError && <Alert severity="error">{formError}</Alert>}This
            permanently deletes the habit and all its completion history on web
            and mobile.
          </DialogContent>
          <DialogActions>
            <Button disabled={busy} onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button
              color="error"
              disabled={busy}
              onClick={() =>
                void mutate(
                  () => api.deleteHabit(deleting!.id),
                  "Habit and history deleted.",
                  () => setDeleting(null),
                )
              }
            >
              {busy ? "Deleting…" : "Delete permanently"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
