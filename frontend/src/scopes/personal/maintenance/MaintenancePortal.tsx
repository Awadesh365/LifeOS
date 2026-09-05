import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import Header from "../components/Header";
import EmptyState from "../components/EmptyState";
import { useToast } from "../../../components/common/ToastProvider";
import { maintenanceApi } from "./api";
import type {
  MaintenanceArea,
  MaintenanceAsset,
  MaintenanceItem,
  MaintenanceOccurrence,
  MaintenanceSummary,
  NeedState,
  PlanPriority,
  RepairCase,
  ScheduleType,
  WeeklyPlan,
} from "./types";
import "./maintenance.css";

interface DataState {
  summary: MaintenanceSummary | null;
  items: MaintenanceItem[];
  areas: MaintenanceArea[];
  assets: MaintenanceAsset[];
  repairs: RepairCase[];
  plan: WeeklyPlan | null;
}

const EMPTY_DATA: DataState = {
  summary: null,
  items: [],
  areas: [],
  assets: [],
  repairs: [],
  plan: null,
};
const STATE_LABELS: Record<NeedState, string> = {
  can_wait: "Can wait",
  approaching: "Approaching",
  due: "Due",
  needs_attention: "Needs attention",
  overdue: "Overdue",
  backlog: "Backlog",
  paused: "Paused",
};
const SCHEDULE_LABELS: Record<ScheduleType, string> = {
  fixed_recurring: "Fixed recurring",
  interval: "From completion",
  flexible_window: "Flexible window",
  condition: "Condition based",
  hard_deadline: "Hard deadline",
  seasonal: "Seasonal",
  none: "No schedule",
};
const REPAIR_LABELS: Record<RepairCase["state"], string> = {
  reported: "Reported",
  diagnosing: "Diagnosing",
  in_service: "In service",
  waiting: "Waiting",
  ready_to_collect: "Ready to collect",
  resolved: "Resolved",
  closed: "Closed",
};

function useMaintenanceData() {
  const [data, setData] = useState<DataState>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [summary, items, areas, assets, repairs, plan] = await Promise.all([
        maintenanceApi.summary(),
        maintenanceApi.items(),
        maintenanceApi.areas(),
        maintenanceApi.assets(),
        maintenanceApi.repairs(),
        maintenanceApi.plan(),
      ]);
      setData({ summary, items, areas, assets, repairs, plan });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load Maintenance.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);
  return { data, loading, error, reload };
}

function StateChip({ state }: { state: NeedState }) {
  return (
    <Chip
      size="small"
      className={`maintenance-state maintenance-state--${state}`}
      label={STATE_LABELS[state]}
    />
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined" className="maintenance-panel">
      <Box className="maintenance-panel__header">
        <Typography variant="h6">{title}</Typography>
        {action}
      </Box>
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ItemRow({
  item,
  onComplete,
  compact = false,
}: {
  item: MaintenanceItem;
  onComplete?: (item: MaintenanceItem) => void;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  return (
    <Box
      className={`maintenance-row ${compact ? "maintenance-row--compact" : ""}`}
    >
      <Box className="maintenance-row__identity">
        <Button
          className="maintenance-row__link"
          onClick={() => navigate(`/app/maintenance/items/${item.id}`)}
          size="small"
        >
          {item.name}
        </Button>
        <Typography variant="caption" color="text.secondary">
          {item.area?.name ?? "Maintenance"} · {item.needReason}
        </Typography>
      </Box>
      <StateChip state={item.needState} />
      {!compact && (
        <Typography variant="body2" color="text.secondary">
          {SCHEDULE_LABELS[item.scheduleType]}
        </Typography>
      )}
      <Typography variant="body2" color="text.secondary">
        ~{item.durationMinutes}m
      </Typography>
      {onComplete && item.status === "active" && (
        <Tooltip title="Record completion">
          <Button
            size="small"
            variant="outlined"
            onClick={() => onComplete(item)}
            startIcon={<CheckIcon />}
          >
            Done
          </Button>
        </Tooltip>
      )}
    </Box>
  );
}

function ItemDetail({
  onComplete,
}: {
  onComplete: (item: MaintenanceItem) => Promise<void>;
}) {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<MaintenanceItem | null>(null);
  const [history, setHistory] = useState<MaintenanceOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [nextItem, nextHistory] = await Promise.all([
        maintenanceApi.item(id),
        maintenanceApi.itemHistory(id),
      ]);
      setItem(nextItem);
      setHistory(nextHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load this item.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <Box className="maintenance-loading"><CircularProgress size={28} /><Typography color="text.secondary">Loading maintenance history…</Typography></Box>;
  }
  if (error || !item) {
    return <Alert severity="error" action={<Button onClick={() => void load()}>Retry</Button>}>{error || "Maintenance item not found."}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Button size="small" onClick={() => navigate("/app/maintenance/items")}>← All items</Button>
          <Typography variant="h5" sx={{ mt: 1 }}>{item.name}</Typography>
          <Typography variant="body2" color="text.secondary">{item.area?.name ?? "Maintenance"} · {SCHEDULE_LABELS[item.scheduleType]}</Typography>
        </Box>
        {item.status === "active" && <Button variant="contained" startIcon={<CheckIcon />} onClick={async () => { await onComplete(item); await load(); }}>Record completion</Button>}
      </Box>

      <Box className="maintenance-detail-grid">
        <Panel title="Current state">
          <Stack spacing={1.5}>
            <StateChip state={item.needState} />
            <Typography>{item.needReason}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.calculatedTargetDate ? `Target ${item.calculatedTargetDate}` : "No calendar target"} · about {item.durationMinutes} minutes · {item.effort} effort
            </Typography>
          </Stack>
        </Panel>
        <Panel title="Schedule and links">
          <Stack spacing={1}>
            <Typography variant="body2"><strong>Timing:</strong> {SCHEDULE_LABELS[item.scheduleType]}</Typography>
            <Typography variant="body2"><strong>Work type:</strong> {item.workKind.replace(/_/g, " ")}</Typography>
            <Typography variant="body2"><strong>Linked asset:</strong> {item.asset?.name ?? "None"}</Typography>
            <Typography variant="caption" color="text.secondary">Schedule version {item.scheduleVersion}. Historical completions retain the version that produced them.</Typography>
          </Stack>
        </Panel>
      </Box>

      <Panel title="Completion history">
        {history.length ? <Stack divider={<Divider flexItem />}>
          {history.map((occurrence) => <Box className="maintenance-history-row" key={occurrence.id}>
            <Box><Typography fontWeight={700}>{occurrence.action === "completed" ? "Completed" : occurrence.action}</Typography><Typography variant="caption" color="text.secondary">{new Date(occurrence.completedAt ?? occurrence.createdAt).toLocaleString()}</Typography></Box>
            <Typography variant="caption" color="text.secondary">Schedule v{occurrence.scheduleVersion}{occurrence.windowStart && occurrence.windowEnd ? ` · window ${occurrence.windowStart}–${occurrence.windowEnd}` : occurrence.hardDueAt ? ` · deadline ${occurrence.hardDueAt}` : occurrence.plannedDate ? ` · planned ${occurrence.plannedDate}` : ""}</Typography>
          </Box>)}
        </Stack> : <EmptyState title="No completion history" description="The first completion will appear here with the schedule context that was active at the time." />}
      </Panel>
    </Stack>
  );
}

function Overview({
  data,
  onNewItem,
  onComplete,
}: {
  data: DataState;
  onNewItem: () => void;
  onComplete: (item: MaintenanceItem) => void;
}) {
  const navigate = useNavigate();
  const summary = data.summary;
  if (!summary) return null;
  const selectedMinutes = summary.plan.selectedItems.reduce(
    (total, selected) =>
      total +
      (data.items.find((item) => item.id === selected.itemId)
        ?.durationMinutes ?? 0),
    0,
  );
  return (
    <Stack spacing={2.5}>
      <Box className="maintenance-hero">
        <Box>
          <Typography variant="overline">Personal operations</Typography>
          <Typography variant="h4">Keep life operational, calmly.</Typography>
          <Typography color="text.secondary">
            See genuine deadlines, flexible needs, and unresolved work in one
            place.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onNewItem}>
          New maintenance item
        </Button>
      </Box>
      <Box className="maintenance-kpis">
        {[
          ["Hard deadlines", summary.counts.hardDeadlines, "deadline"],
          ["Needs attention", summary.counts.needsAttention, "attention"],
          ["Open repairs", summary.counts.openRepairs, "repairs"],
          ["Waiting", summary.counts.waiting, "waiting"],
        ].map(([label, value, tone]) => (
          <Card
            variant="outlined"
            className={`maintenance-kpi maintenance-kpi--${tone}`}
            key={label}
          >
            <Typography variant="caption">{label}</Typography>
            <Typography variant="h4">{value}</Typography>
          </Card>
        ))}
      </Box>
      <Box className="maintenance-grid maintenance-grid--wide">
        <Panel
          title="Needs attention"
          action={
            <Button size="small" onClick={() => navigate("items")}>
              All items
            </Button>
          }
        >
          {summary.attention.length ? (
            <Stack divider={<Divider flexItem />}>
              {summary.attention.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  compact
                  onComplete={onComplete}
                />
              ))}
            </Stack>
          ) : (
            <EmptyState
              compact
              title="Nothing needs attention"
              description="Flexible maintenance will appear here as its preferred window approaches."
            />
          )}
        </Panel>
        <Panel
          title="This week"
          action={
            <Button size="small" onClick={() => navigate("review")}>
              Plan week
            </Button>
          }
        >
          <Stack spacing={1.5}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">
                Selected {Math.round(selectedMinutes / 6) / 10}h
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Capacity {Math.round(summary.plan.capacityMinutes / 6) / 10}h
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(
                100,
                (selectedMinutes / Math.max(1, summary.plan.capacityMinutes)) *
                  100,
              )}
              color={
                selectedMinutes > summary.plan.capacityMinutes
                  ? "warning"
                  : "primary"
              }
            />
            {summary.plan.selectedItems.length ? (
              summary.plan.selectedItems.slice(0, 5).map((selection) => {
                const item = data.items.find(
                  (candidate) => candidate.id === selection.itemId,
                );
                return item ? (
                  <ItemRow
                    key={item.id}
                    item={item}
                    compact
                    onComplete={onComplete}
                  />
                ) : null;
              })
            ) : (
              <Typography variant="body2" color="text.secondary">
                No week committed yet. Set your capacity and choose only what
                realistically fits.
              </Typography>
            )}
          </Stack>
        </Panel>
      </Box>
      <Panel
        title="Areas"
        action={
          <Button size="small" onClick={() => navigate("areas")}>
            Manage areas
          </Button>
        }
      >
        <Box className="maintenance-area-grid">
          {summary.areas.map((area) => (
            <Box className="maintenance-area-card" key={area.id}>
              <span className="material-symbols-outlined">{area.icon}</span>
              <Box>
                <Typography fontWeight={700}>{area.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {area.itemCount} active item{area.itemCount === 1 ? "" : "s"}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Panel>
      <Box className="maintenance-grid">
        <Panel
          title="Repairs & waiting"
          action={
            <Button size="small" onClick={() => navigate("repairs")}>
              Open cases
            </Button>
          }
        >
          {summary.repairs.length ? (
            summary.repairs.map((repair) => (
              <Box className="maintenance-repair-row" key={repair.id}>
                <BuildOutlinedIcon fontSize="small" />
                <Box flex={1}>
                  <Typography fontWeight={700}>{repair.title}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {repair.nextAction || repair.issue}
                  </Typography>
                </Box>
                <Chip size="small" label={REPAIR_LABELS[repair.state]} />
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No open repair cases.
            </Typography>
          )}
        </Panel>
        <Panel title="Coming up">
          {summary.upcoming.length ? (
            <Stack divider={<Divider flexItem />}>
              {summary.upcoming.map((item) => (
                <ItemRow key={item.id} item={item} compact />
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Nothing is approaching its preferred window.
            </Typography>
          )}
        </Panel>
      </Box>
    </Stack>
  );
}

function ItemsPage({
  data,
  onNewItem,
  onComplete,
  backlog = false,
}: {
  data: DataState;
  onNewItem: () => void;
  onComplete: (item: MaintenanceItem) => void;
  backlog?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("all");
  const items = data.items.filter(
    (item) =>
      (backlog ? item.status === "backlog" : item.status !== "backlog") &&
      (area === "all" || item.areaId === area) &&
      item.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Typography variant="h5">
            {backlog ? "Maintenance backlog" : "All maintenance items"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {backlog
              ? "Useful work with no urgency inflation or overdue labels."
              : "Recurring responsibilities, timing semantics, and reliable history."}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={onNewItem}>
          New item
        </Button>
      </Box>
      <Box className="maintenance-filters">
        <TextField
          size="small"
          label="Search maintenance"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <FormControl size="small" sx={{ minWidth: 190 }}>
          <InputLabel>Area</InputLabel>
          <Select
            label="Area"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            <MenuItem value="all">All areas</MenuItem>
            {data.areas.map((entry) => (
              <MenuItem key={entry.id} value={entry.id}>
                {entry.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Card variant="outlined" className="maintenance-table-card">
        {items.length ? (
          <Stack divider={<Divider flexItem />}>
            {items.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onComplete={backlog ? undefined : onComplete}
              />
            ))}
          </Stack>
        ) : (
          <EmptyState
            title={
              backlog ? "Your backlog is clear" : "No maintenance items yet"
            }
            description={
              backlog
                ? "Non-urgent operational improvements can live here without reminder clutter."
                : "Create a responsibility with an honest interval, window, condition, or deadline."
            }
            action={<Button onClick={onNewItem}>Create first item</Button>}
          />
        )}
      </Card>
    </Stack>
  );
}

function AreasPage({ data }: { data: DataState }) {
  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Typography variant="h5">Responsibility areas</Typography>
          <Typography variant="body2" color="text.secondary">
            Ongoing standards, not finishable projects or scores.
          </Typography>
        </Box>
      </Box>
      <Box className="maintenance-area-directory">
        {data.areas.map((area) => {
          const areaItems = data.items.filter(
            (item) => item.areaId === area.id && item.status !== "archived",
          );
          const attention = areaItems.filter((item) =>
            ["due", "needs_attention", "overdue"].includes(item.needState),
          ).length;
          return (
            <Card variant="outlined" key={area.id}>
              <CardContent>
                <Box className="maintenance-area-title">
                  <span className="material-symbols-outlined">{area.icon}</span>
                  <Box>
                    <Typography variant="h6">{area.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {area.standard ||
                        "Keep this area at a personally acceptable standard."}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" gap={3}>
                  <Box>
                    <Typography variant="h6">{areaItems.length}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Items
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h6">{attention}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Need attention
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Stack>
  );
}

function AssetsPage({
  data,
  onNewAsset,
}: {
  data: DataState;
  onNewAsset: () => void;
}) {
  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Typography variant="h5">Asset library</Typography>
          <Typography variant="body2" color="text.secondary">
            Keep purchase, warranty, upkeep, and repairs together.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewAsset}
        >
          Add asset
        </Button>
      </Box>
      {data.assets.length ? (
        <Box className="maintenance-asset-grid">
          {data.assets.map((asset) => {
            const openCases = data.repairs.filter(
              (entry) =>
                entry.assetId === asset.id &&
                !["resolved", "closed"].includes(entry.state),
            ).length;
            return (
              <Card variant="outlined" key={asset.id}>
                <CardContent>
                  <Box className="maintenance-asset-icon">
                    <Inventory2OutlinedIcon />
                  </Box>
                  <Typography variant="h6">{asset.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[asset.brand, asset.model].filter(Boolean).join(" · ") ||
                      asset.category}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Stack spacing={0.8}>
                    <Typography variant="caption">
                      Warranty{" "}
                      {asset.warrantyEndsAt
                        ? `until ${asset.warrantyEndsAt}`
                        : "not recorded"}
                    </Typography>
                    <Typography variant="caption">
                      {openCases} open repair{openCases === 1 ? "" : "s"}
                    </Typography>
                    <Typography variant="caption">
                      {
                        data.items.filter((item) => item.assetId === asset.id)
                          .length
                      }{" "}
                      linked maintenance items
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      ) : (
        <EmptyState
          icon={<Inventory2OutlinedIcon />}
          title="No assets added"
          description="Add important devices or possessions when their warranty, service history, or documents are worth keeping."
          action={<Button onClick={onNewAsset}>Add an asset</Button>}
        />
      )}
    </Stack>
  );
}

function RepairsPage({
  data,
  onNewRepair,
  onAdvance,
}: {
  data: DataState;
  onNewRepair: () => void;
  onAdvance: (repair: RepairCase) => void;
}) {
  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Typography variant="h5">Repair cases</Typography>
          <Typography variant="body2" color="text.secondary">
            Track issue resolution, waiting, follow-ups, and evidence beyond one
            checkbox.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewRepair}
        >
          Report issue
        </Button>
      </Box>
      {data.repairs.length ? (
        <Stack spacing={1.5}>
          {data.repairs.map((repair) => (
            <Card variant="outlined" key={repair.id}>
              <CardContent className="maintenance-case">
                <Box>
                  <Chip size="small" label={REPAIR_LABELS[repair.state]} />
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {repair.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {repair.asset?.name || "Unlinked case"} · Opened{" "}
                    {new Date(repair.openedAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box className="maintenance-case__action">
                  <Typography variant="caption" color="text.secondary">
                    Next action
                  </Typography>
                  <Typography variant="body2" fontWeight={650}>
                    {repair.nextAction || "Decide the next step"}
                  </Typography>
                  {!["resolved", "closed"].includes(repair.state) && (
                    <Button size="small" onClick={() => onAdvance(repair)}>
                      Update state
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState
          icon={<BuildOutlinedIcon />}
          title="No repair cases"
          description="When an issue becomes multi-step, open a case so waiting and follow-up work stay visible."
          action={<Button onClick={onNewRepair}>Report an issue</Button>}
        />
      )}
    </Stack>
  );
}

function ReviewPage({
  data,
  onSave,
}: {
  data: DataState;
  onSave: (plan: Partial<WeeklyPlan>) => Promise<void>;
}) {
  const [capacity, setCapacity] = useState(data.plan?.capacityMinutes ?? 240);
  const [selected, setSelected] = useState<
    Array<{ itemId: string; priority: PlanPriority }>
  >(data.plan?.selectedItems ?? []);
  useEffect(() => {
    setCapacity(data.plan?.capacityMinutes ?? 240);
    setSelected(data.plan?.selectedItems ?? []);
  }, [data.plan]);
  const candidates = data.items.filter(
    (item) =>
      item.status === "active" &&
      item.needState !== "can_wait" &&
      item.needState !== "paused",
  );
  const selectedMinutes = selected.reduce(
    (total, entry) =>
      total +
      (data.items.find((item) => item.id === entry.itemId)?.durationMinutes ??
        0),
    0,
  );
  const toggle = (item: MaintenanceItem) =>
    setSelected((current) =>
      current.some((entry) => entry.itemId === item.id)
        ? current.filter((entry) => entry.itemId !== item.id)
        : [...current, { itemId: item.id, priority: item.priority }],
    );
  const changePriority = (itemId: string, priority: PlanPriority) =>
    setSelected((current) =>
      current.map((entry) =>
        entry.itemId === itemId ? { ...entry, priority } : entry,
      ),
    );
  return (
    <Stack spacing={2}>
      <Box className="maintenance-page-heading">
        <Box>
          <Typography variant="h5">Weekly maintenance review</Typography>
          <Typography variant="body2" color="text.secondary">
            Review what changed, declare capacity, then commit a realistic week.
          </Typography>
        </Box>
        <Chip
          icon={<EventAvailableOutlinedIcon />}
          label={
            data.plan?.status === "committed" ? "Week committed" : "Draft saved"
          }
        />
      </Box>
      <Box className="maintenance-review-grid">
        <Panel title="1. Set capacity">
          <Stack spacing={2}>
            <TextField
              label="Available maintenance minutes"
              type="number"
              value={capacity}
              onChange={(event) =>
                setCapacity(Math.max(1, Number(event.target.value)))
              }
              inputProps={{ min: 1, max: 10080 }}
            />
            <Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  Selected {selectedMinutes}m
                </Typography>
                <Typography variant="body2">Capacity {capacity}m</Typography>
              </Box>
              <LinearProgress
                sx={{ mt: 1 }}
                variant="determinate"
                value={Math.min(
                  100,
                  (selectedMinutes / Math.max(capacity, 1)) * 100,
                )}
                color={selectedMinutes > capacity ? "warning" : "success"}
              />
            </Box>
            {selectedMinutes > capacity && (
              <Alert severity="warning">
                This plan exceeds your declared capacity by{" "}
                {selectedMinutes - capacity} minutes.
              </Alert>
            )}
          </Stack>
        </Panel>
        <Panel title="2. Build the week">
          {candidates.length ? (
            <Stack divider={<Divider flexItem />}>
              {candidates.map((item) => {
                const choice = selected.find(
                  (entry) => entry.itemId === item.id,
                );
                return (
                  <Box className="maintenance-review-item" key={item.id}>
                    <Button
                      variant={choice ? "contained" : "outlined"}
                      color={choice ? "primary" : "inherit"}
                      onClick={() => toggle(item)}
                    >
                      {choice ? "Selected" : "Add"}
                    </Button>
                    <Box flex={1}>
                      <Typography fontWeight={700}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {STATE_LABELS[item.needState]} · {item.durationMinutes}m
                      </Typography>
                    </Box>
                    {choice && (
                      <Select
                        size="small"
                        value={choice.priority}
                        onChange={(event) =>
                          changePriority(
                            item.id,
                            event.target.value as PlanPriority,
                          )
                        }
                      >
                        <MenuItem value="must">Must</MenuItem>
                        <MenuItem value="should">Should</MenuItem>
                        <MenuItem value="can_wait">Can wait</MenuItem>
                      </Select>
                    )}
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <EmptyState
              compact
              title="No candidates need review"
              description="Approaching and due items will appear here without turning every responsibility into an emergency."
            />
          )}
        </Panel>
      </Box>
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button
          onClick={() =>
            onSave({
              capacityMinutes: capacity,
              selectedItems: selected,
              status: "draft",
            })
          }
        >
          Save draft
        </Button>
        <Button
          variant="contained"
          disabled={selectedMinutes > capacity}
          onClick={() =>
            onSave({
              capacityMinutes: capacity,
              selectedItems: selected,
              status: "committed",
            })
          }
        >
          Commit week
        </Button>
      </Box>
    </Stack>
  );
}

function NewItemDialog({
  open,
  areas,
  assets,
  onClose,
  onSave,
}: {
  open: boolean;
  areas: MaintenanceArea[];
  assets: MaintenanceAsset[];
  onClose: () => void;
  onSave: (data: Partial<MaintenanceItem>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: "",
    areaId: "",
    assetId: "",
    workKind: "routine" as MaintenanceItem["workKind"],
    scheduleType: "flexible_window" as ScheduleType,
    intervalDays: 30,
    windowStartDays: 10,
    windowEndDays: 14,
    nextDate: "",
    durationMinutes: 30,
    effort: "light",
    priority: "should",
    status: "active",
  });
  const set = (key: string, value: unknown) =>
    setForm((current) => ({ ...current, [key]: value }));
  const timingFields =
    form.scheduleType === "flexible_window" ? (
      <Box className="maintenance-dialog-grid">
        <TextField
          type="number"
          label="Window starts (days)"
          value={form.windowStartDays}
          onChange={(event) =>
            set("windowStartDays", Number(event.target.value))
          }
        />
        <TextField
          type="number"
          label="Window ends (days)"
          value={form.windowEndDays}
          onChange={(event) => set("windowEndDays", Number(event.target.value))}
        />
      </Box>
    ) : form.scheduleType === "interval" ? (
      <TextField
        fullWidth
        type="number"
        label="Usual interval (days)"
        value={form.intervalDays}
        onChange={(event) => set("intervalDays", Number(event.target.value))}
      />
    ) : form.scheduleType === "fixed_recurring" ? (
      <Box className="maintenance-dialog-grid">
        <TextField
          fullWidth
          type="date"
          label="Next calendar date"
          value={form.nextDate}
          onChange={(event) => set("nextDate", event.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="number"
          label="Repeat every (days)"
          value={form.intervalDays}
          onChange={(event) => set("intervalDays", Number(event.target.value))}
        />
      </Box>
    ) : ["hard_deadline", "seasonal"].includes(form.scheduleType) ? (
      <TextField
        fullWidth
        type="date"
        label={
          form.scheduleType === "hard_deadline"
            ? "External deadline"
            : "Next date"
        }
        value={form.nextDate}
        onChange={(event) => set("nextDate", event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
    ) : null;
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New maintenance item</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            label="What needs maintaining?"
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
          />
          <FormControl>
            <InputLabel>Work type</InputLabel>
            <Select label="Work type" value={form.workKind} onChange={(event) => set("workKind", event.target.value)}>
              <MenuItem value="routine">Routine</MenuItem>
              <MenuItem value="repair">Repair</MenuItem>
              <MenuItem value="improvement_project">Improvement project</MenuItem>
            </Select>
          </FormControl>
          <Box className="maintenance-dialog-grid">
            <FormControl>
              <InputLabel>Area</InputLabel>
              <Select
                label="Area"
                value={form.areaId}
                onChange={(event) => set("areaId", event.target.value)}
              >
                {areas.map((area) => (
                  <MenuItem value={area.id} key={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>Timing</InputLabel>
              <Select
                label="Timing"
                value={form.scheduleType}
                onChange={(event) => set("scheduleType", event.target.value)}
              >
                {Object.entries(SCHEDULE_LABELS)
                  .map(([value, label]) => (
                    <MenuItem value={value} key={value}>
                      {label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
          {timingFields}
          <Box className="maintenance-dialog-grid">
            <TextField
              type="number"
              label="Estimated minutes"
              value={form.durationMinutes}
              onChange={(event) =>
                set("durationMinutes", Number(event.target.value))
              }
            />
            <FormControl>
              <InputLabel>Weekly priority</InputLabel>
              <Select
                label="Weekly priority"
                value={form.priority}
                onChange={(event) => set("priority", event.target.value)}
              >
                <MenuItem value="must">Must</MenuItem>
                <MenuItem value="should">Should</MenuItem>
                <MenuItem value="can_wait">Can wait</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {assets.length > 0 && (
            <FormControl>
              <InputLabel>Linked asset (optional)</InputLabel>
              <Select
                label="Linked asset (optional)"
                value={form.assetId}
                onChange={(event) => set("assetId", event.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {assets.map((asset) => (
                  <MenuItem value={asset.id} key={asset.id}>
                    {asset.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!form.name.trim() || !form.areaId}
          onClick={() => onSave(form as Partial<MaintenanceItem>)}
        >
          Create item
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function SimpleCreateDialog({
  kind,
  open,
  assets,
  onClose,
  onSave,
}: {
  kind: "asset" | "repair";
  open: boolean;
  assets: MaintenanceAsset[];
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    category: "device",
    brand: "",
    model: "",
    warrantyEndsAt: "",
    title: "",
    issue: "",
    assetId: "",
    areaId: "",
    nextAction: "",
    followUpDate: "",
  });
  const set = (key: string, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const valid =
    kind === "asset"
      ? form.name.trim()
      : form.title.trim() && form.issue.trim();
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {kind === "asset" ? "Add an asset" : "Report an issue"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {kind === "asset" ? (
            <>
              <TextField
                autoFocus
                label="Asset name"
                value={form.name}
                onChange={(event) => set("name", event.target.value)}
              />
              <Box className="maintenance-dialog-grid">
                <TextField
                  label="Brand"
                  value={form.brand}
                  onChange={(event) => set("brand", event.target.value)}
                />
                <TextField
                  label="Model"
                  value={form.model}
                  onChange={(event) => set("model", event.target.value)}
                />
              </Box>
              <TextField
                type="date"
                label="Warranty ends"
                value={form.warrantyEndsAt}
                onChange={(event) => set("warrantyEndsAt", event.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </>
          ) : (
            <>
              <TextField
                autoFocus
                label="Case title"
                value={form.title}
                onChange={(event) => set("title", event.target.value)}
              />
              <TextField
                multiline
                minRows={3}
                label="What is wrong?"
                value={form.issue}
                onChange={(event) => set("issue", event.target.value)}
              />
              <FormControl>
                <InputLabel>Asset (optional)</InputLabel>
                <Select
                  label="Asset (optional)"
                  value={form.assetId}
                  onChange={(event) => set("assetId", event.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  {assets.map((asset) => (
                    <MenuItem key={asset.id} value={asset.id}>
                      {asset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Next action"
                value={form.nextAction}
                onChange={(event) => set("nextAction", event.target.value)}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          disabled={!valid}
          onClick={() => onSave(form)}
        >
          {kind === "asset" ? "Add asset" : "Open case"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function MaintenancePortal() {
  const { data, loading, error, reload } = useMaintenanceData();
  const [dialog, setDialog] = useState<"item" | "asset" | "repair" | null>(
    null,
  );
  const { showError, showSuccess } = useToast();
  const location = useLocation();
  const activeTab = useMemo(
    () =>
      location.pathname.split("/maintenance/")[1]?.split("/")[0] || "overview",
    [location.pathname],
  );
  const mutate = async (action: () => Promise<unknown>, message: string) => {
    try {
      await action();
      setDialog(null);
      await reload();
      showSuccess(message);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unable to save change.");
    }
  };
  const completionOperations = useRef(new Map<string, { id: string; pending: boolean }>());
  const complete = async (item: MaintenanceItem) => {
    const operation = completionOperations.current.get(item.id) ?? { id: crypto.randomUUID(), pending: false };
    if (operation.pending) return;
    operation.pending = true;
    completionOperations.current.set(item.id, operation);
    try {
      await maintenanceApi.completeItem(item.id, operation.id);
      completionOperations.current.delete(item.id);
      await reload();
      showSuccess(`${item.name} recorded as complete.`);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Unable to record completion.");
    } finally {
      operation.pending = false;
    }
  };
  const advanceRepair = (repair: RepairCase) => {
    const flow: RepairCase["state"][] = [
      "reported",
      "diagnosing",
      "in_service",
      "waiting",
      "ready_to_collect",
      "resolved",
    ];
    const next =
      flow[Math.min(flow.indexOf(repair.state) + 1, flow.length - 1)];
    void mutate(
      () => maintenanceApi.updateRepair(repair.id, { state: next }),
      `Repair moved to ${REPAIR_LABELS[next].toLowerCase()}.`,
    );
  };

  return (
    <>
      <Header
        title="Maintenance"
        subtitle="Personal operations and ongoing upkeep"
      />
      <Box className="maintenance-shell">
        <Tabs
          value={activeTab}
          variant="scrollable"
          scrollButtons="auto"
          className="maintenance-tabs"
        >
          <Tab
            component={NavLink}
            value="overview"
            to="/app/maintenance"
            label="Overview"
          />
          <Tab
            component={NavLink}
            value="items"
            to="/app/maintenance/items"
            label="All items"
          />
          <Tab
            component={NavLink}
            value="areas"
            to="/app/maintenance/areas"
            label="Areas"
          />
          <Tab
            component={NavLink}
            value="backlog"
            to="/app/maintenance/backlog"
            label="Backlog"
          />
          <Tab
            component={NavLink}
            value="review"
            to="/app/maintenance/review"
            label="Weekly review"
          />
          <Tab
            component={NavLink}
            value="assets"
            to="/app/maintenance/assets"
            label="Assets"
          />
          <Tab
            component={NavLink}
            value="repairs"
            to="/app/maintenance/repairs"
            label="Repairs"
          />
        </Tabs>
        {loading ? (
          <Box className="maintenance-loading">
            <CircularProgress size={32} />
            <Typography color="text.secondary">
              Loading your operational picture…
            </Typography>
          </Box>
        ) : error ? (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            action={
              <Button color="inherit" onClick={() => void reload()}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <Routes>
            <Route
              index
              element={
                <Overview
                  data={data}
                  onNewItem={() => setDialog("item")}
                  onComplete={complete}
                />
              }
            />
            <Route
              path="items"
              element={
                <ItemsPage
                  data={data}
                  onNewItem={() => setDialog("item")}
                  onComplete={complete}
                />
              }
            />
            <Route path="items/:id" element={<ItemDetail onComplete={complete} />} />
            <Route path="areas" element={<AreasPage data={data} />} />
            <Route
              path="backlog"
              element={
                <ItemsPage
                  backlog
                  data={data}
                  onNewItem={() => setDialog("item")}
                  onComplete={complete}
                />
              }
            />
            <Route
              path="review"
              element={
                <ReviewPage
                  data={data}
                  onSave={(plan) =>
                    mutate(
                      () => maintenanceApi.updatePlan(plan),
                      plan.status === "committed"
                        ? "Maintenance week committed."
                        : "Review draft saved.",
                    )
                  }
                />
              }
            />
            <Route
              path="assets"
              element={
                <AssetsPage data={data} onNewAsset={() => setDialog("asset")} />
              }
            />
            <Route
              path="repairs"
              element={
                <RepairsPage
                  data={data}
                  onNewRepair={() => setDialog("repair")}
                  onAdvance={advanceRepair}
                />
              }
            />
            <Route
              path="*"
              element={<Navigate to="/app/maintenance" replace />}
            />
          </Routes>
        )}
      </Box>
      <NewItemDialog
        open={dialog === "item"}
        areas={data.areas}
        assets={data.assets}
        onClose={() => setDialog(null)}
        onSave={(form) =>
          mutate(
            () => maintenanceApi.createItem(form),
            "Maintenance item created.",
          )
        }
      />
      <SimpleCreateDialog
        kind="asset"
        open={dialog === "asset"}
        assets={data.assets}
        onClose={() => setDialog(null)}
        onSave={(form) =>
          mutate(() => maintenanceApi.createAsset(form), "Asset added.")
        }
      />
      <SimpleCreateDialog
        kind="repair"
        open={dialog === "repair"}
        assets={data.assets}
        onClose={() => setDialog(null)}
        onSave={(form) =>
          mutate(() => maintenanceApi.createRepair(form), "Repair case opened.")
        }
      />
    </>
  );
}
