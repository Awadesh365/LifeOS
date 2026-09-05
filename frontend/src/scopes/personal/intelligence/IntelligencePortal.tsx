import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  CircularProgress,
} from "@mui/material";
import { intelligenceApi as api } from "./api";
import type {
  Summary,
  Consent,
  Diagnostics,
  IntelligenceArtifact,
  Readiness,
  Version,
} from "./types";
import pages from "./pages.json";
import "./intelligence.css";
const ROOT = "/app/intelligence";
const stamp = (v?: string | null) =>
  v ? new Date(v).toLocaleString() : "No source timestamp";
const display = (v: unknown) =>
  v == null ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);
const title = (v: string) => v.replace(/_/g, " ");
const Json = ({ value }: { value: unknown }) => (
  <pre className="intel-json">{JSON.stringify(value, null, 2)}</pre>
);
const Empty = ({ children }: { children: ReactNode }) => (
  <div className="intel-empty">
    <strong>No eligible records yet</strong>
    <p className="intel-muted">{children}</p>
  </div>
);
const Panel = ({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) => (
  <section className="intel-panel">
    <h2>{heading}</h2>
    {children}
  </section>
);
function Table({
  rows,
  columns,
}: {
  rows: Record<string, unknown>[];
  columns: string[];
}) {
  return rows.length ? (
    <div className="intel-table-wrap">
      <table className="intel-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{title(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={String(r.id ?? i)}>
              {columns.map((c) => (
                <td key={c}>{display(r[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty>Records appear after the relevant operation produces them.</Empty>
  );
}
function ReadinessTable({ rows }: { rows: Readiness[] }) {
  return (
    <div className="intel-table-wrap">
      <table className="intel-table">
        <thead>
          <tr>
            <th>Definition</th>
            <th>Evidence</th>
            <th>Readiness</th>
            <th>Requirements</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>
                <Link to={`${ROOT}/models/${r.id}`}>{r.name}</Link>
                <p className="intel-muted">
                  {r.domain} · {r.id}
                </p>
              </td>
              <td>
                {r.events} events
                <br />
                {r.labels} resolved labels
                <br />
                {r.historyDays} days
              </td>
              <td>
                <span className="intel-status">{title(r.state)}</span>
              </td>
              <td>
                {r.minimumLabels} labels / {r.minimumDays} days
                <p className="intel-muted">{r.reason}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function ArtifactList({ rows }: { rows: IntelligenceArtifact[] }) {
  return rows.length ? (
    <div className="intel-table-wrap">
      <table className="intel-table">
        <thead>
          <tr>
            <th>Artifact</th>
            <th>Result</th>
            <th>Horizon</th>
            <th>Freshness / readiness</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                <Link
                  to={`${ROOT}/${a.kind === "recommendation" ? "recommendations" : a.kind === "prediction" ? "predictions" : "projections"}/${a.id}`}
                >
                  {a.payload.title}
                </Link>
                <p className="intel-muted">
                  {a.domain} · {a.kind}
                </p>
              </td>
              <td>
                {a.payload.value ?? "Review options"} {a.payload.unit}
                <p className="intel-muted">
                  {a.payload.lower != null
                    ? `${a.payload.lower}–${a.payload.upper}`
                    : a.payload.uncertainty}
                </p>
              </td>
              <td>{a.payload.horizon ?? "Until expiry"}</td>
              <td>
                {stamp(a.generatedAt)}
                <p className="intel-muted">
                  {title(a.payload.readiness ?? a.state)}
                  {a.payload.expiresAt &&
                  Date.parse(a.payload.expiresAt) < Date.now()
                    ? " · expired"
                    : ""}
                  <br />
                  Data through {stamp(a.dataThrough)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty>
      Enable a domain, import available history, or run a scenario. Learned
      predictions require a validated champion.
    </Empty>
  );
}
function VersionTable({
  rows,
  onStage,
}: {
  rows: Version[];
  onStage?: (v: Version, stage: string) => void;
}) {
  return rows.length ? (
    <div className="intel-table-wrap">
      <table className="intel-table">
        <thead>
          <tr>
            <th>Version</th>
            <th>Validation</th>
            <th>Quality</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={v.id}>
              <td>
                <Link to={`${ROOT}/models/${v.definitionId}/versions/${v.id}`}>
                  {v.id.slice(0, 8)}
                </Link>
                <p>
                  {v.definitionId} · {v.payload.currency}
                </p>
              </td>
              <td>
                {v.payload.validation}
                <p className="intel-muted">
                  {v.payload.trainingWindow.join(" → ")}
                </p>
              </td>
              <td>
                MAE {v.payload.metrics.mae}
                <br />
                Baseline MAE {v.payload.metrics.baselineMae}
                <br />
                Coverage {Math.round(v.payload.metrics.coverage * 100)}%
              </td>
              <td>
                {v.stage}
                {onStage && (
                  <div className="intel-actions">
                    <Button size="small" onClick={() => onStage(v, "champion")}>
                      Review promotion
                    </Button>
                    <Button size="small" onClick={() => onStage(v, "retired")}>
                      Retire
                    </Button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty>
      No model has been trained. Readiness and temporal validation are mandatory
      before serving.
    </Empty>
  );
}
const templates = {
  "money-run-rate": {
    domain: "money",
    label: "Money · monthly run rate",
    fields: {
      spent: 0,
      elapsedDays: 10,
      periodDays: 30,
      remainingCommitments: 0,
    },
  },
  "learning-pace": {
    domain: "learning",
    label: "Learning · completion pace",
    fields: { remainingUnits: 10, unitsPerWeek: 2 },
  },
  workload: {
    domain: "productivity",
    label: "Productivity · workload",
    fields: { plannedMinutes: 300, capacityMinutes: 240 },
  },
  adherence: {
    domain: "fitness",
    label: "Fitness · observed adherence",
    fields: { completed: 3, planned: 4 },
  },
};
export default function IntelligencePortal() {
  const location = useLocation(),
    navigate = useNavigate();
  const path = location.pathname.replace(/^\/app\/intelligence\/?/, "");
  const [data, setData] = useState<Summary>(),
    [consents, setConsents] = useState<Consent[]>([]),
    [diag, setDiag] = useState<Diagnostics>(),
    [isAdmin, setAdmin] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0);
  const [filter, setFilter] = useState("all"),
    [kind, setKind] = useState("all"),
    [search, setSearch] = useState("");
  const [template, setTemplate] =
      useState<keyof typeof templates>("money-run-rate"),
    [assumptions, setAssumptions] = useState<Record<string, number>>({
      ...templates["money-run-rate"].fields,
    }),
    [scenarioName, setScenarioName] = useState(""),
    [scenarioDomain, setScenarioDomain] = useState("money"),
    [comparison, setComparison] = useState<IntelligenceArtifact[]>([]);
  const [confirmation, setConfirmation] = useState(""),
    [feedbackNote, setFeedbackNote] = useState(""),
    [actual, setActual] = useState(""),
    [reason, setReason] = useState(""),
    [stageReview, setStageReview] = useState<{ v: Version; stage: string }>();
  useEffect(() => {
    let active = true;
    setError("");
    Promise.all([
      api.summary(),
      api.consents(),
      api.request<{ admin: boolean }>("/capabilities"),
    ])
      .then(([s, c, cap]) => {
        if (active) {
          setData(s);
          setConsents(c);
          setAdmin(cap.admin);
        }
      })
      .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [revision]);
  const page = pages.find((p) =>
    new RegExp("^" + p.path.replace(/:[^/]+/g, "[^/]+") + "$").test(path),
  );
  const operational = page
    ? (Number(page.id.slice(1)) >= 20 && Number(page.id.slice(1)) <= 24) ||
      (Number(page.id.slice(1)) >= 31 && Number(page.id.slice(1)) <= 40) ||
      page.id === "P45"
    : false;
  useEffect(() => {
    let active = true;
    if (isAdmin && operational)
      api
        .diagnostics()
        .then((d) => active && setDiag(d))
        .catch((e) => active && setError(e.message));
    return () => {
      active = false;
    };
  }, [isAdmin, operational, revision]);
  async function action(fn: () => Promise<unknown>, message = "Saved") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      setNotice(message);
      setRevision((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  function download(value: unknown) {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "wholesignal-intelligence.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  const artifactId = path.match(
    /^(?:predictions|projections|recommendations)\/([^/]+)/,
  )?.[1];
  const artifact = data?.artifacts.find((a) => a.id === artifactId);
  const modelId = path.match(/^models\/([^/]+)/)?.[1];
  const definition = data?.readiness.find((r) => r.id === modelId);
  const modelVersions =
    data?.versions.filter((v) => v.definitionId === modelId) ?? [];
  const versionId = path.match(/^models\/[^/]+\/versions\/([^/]+)/)?.[1];
  const version = modelVersions.find((v) => v.id === versionId);
  const domainPath = path.startsWith("domains/") ? path.split("/")[1] : null;
  const artifacts = (data?.artifacts ?? []).filter(
    (a) =>
      (filter === "all" || a.domain === filter) &&
      (kind === "all" || a.kind === kind) &&
      (!domainPath || a.domain === domainPath) &&
      a.payload.title.toLowerCase().includes(search.toLowerCase()),
  );
  const filterBar = (
    <div className="intel-actions">
      <TextField
        size="small"
        label="Domain"
        select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <MenuItem value="all">All domains</MenuItem>
        {consents.map((c) => (
          <MenuItem value={c.domain} key={c.domain}>
            {c.domain}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        label="Artifact type"
        select
        value={kind}
        onChange={(e) => setKind(e.target.value)}
      >
        {["all", "projection", "prediction", "recommendation"].map((k) => (
          <MenuItem key={k} value={k}>
            {title(k)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        size="small"
        label="Search titles"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
  const navGroups = [
    {
      name: "Intelligence",
      links: [
        ["", "Overview"],
        ["forecasts", "Forecasts"],
        ["scenarios", "Scenario lab"],
        ["recommendations", "Recommendations"],
      ],
    },
    {
      name: "Your domains",
      links: consents.map((c) => ["domains/" + c.domain, title(c.domain)]),
    },
    {
      name: "Trust",
      links: [
        ["history", "Prediction history"],
        ["outcomes", "Outcomes"],
        ["quality", "Quality"],
        ["quality/calibration", "Calibration"],
        ["readiness", "Data readiness"],
        ["data-sources", "Data sources"],
        ["models", "Model catalog"],
      ],
    },
    {
      name: "Preferences",
      links: [
        ["privacy", "Privacy & consent"],
        ["notifications", "Notifications"],
        ["export", "Export"],
        ["delete", "Delete data"],
        ["settings", "Settings"],
      ],
    },
    ...(isAdmin
      ? [
          {
            name: "Administration",
            links: [
              ["registry", "Model registry"],
              ["events", "Event explorer"],
              ["events/schemas", "Event schemas"],
              ["features", "Feature catalog"],
              ["monitoring", "Monitoring"],
              ["monitoring/data-quality", "Data quality"],
              ["monitoring/drift", "Drift"],
              ["monitoring/performance", "Performance"],
              ["jobs/training", "Training jobs"],
              ["diagnostics/inference", "Inference diagnostics"],
              ["recommendation-engine", "Recommendation rules"],
              ["agent-contracts", "Agent contracts"],
              ["agent-traces", "Agent traces"],
              ["audit", "Audit log"],
            ],
          },
        ]
      : []),
  ];
  let content: ReactNode;
  if (!data)
    content = error ? (
      <Button onClick={() => setRevision((v) => v + 1)}>Retry loading</Button>
    ) : (
      <div role="status">
        <CircularProgress size={24} /> Loading Intelligence…
      </div>
    );
  else if (operational && !isAdmin)
    content = (
      <Alert severity="info">
        This diagnostic surface requires administrator access. Your forecasts
        and privacy controls remain available.
      </Alert>
    );
  else if (artifactId) {
    content = artifact ? (
      <>
        <Panel heading={artifact.payload.title}>
          <span className="intel-status">{artifact.kind}</span>
          {artifact.payload.value != null && (
            <div className="intel-value">
              {artifact.payload.value.toLocaleString()}{" "}
              <small>{artifact.payload.unit}</small>
            </div>
          )}
          {artifact.payload.lower != null && (
            <p>
              Interval: {artifact.payload.lower}–{artifact.payload.upper}{" "}
              {artifact.payload.unit}
            </p>
          )}
          {artifact.payload.expiresAt &&
            Date.parse(artifact.payload.expiresAt) < Date.now() && (
              <Alert severity="warning">
                This artifact has expired. Refresh the source and generate a new
                result before acting.
              </Alert>
            )}
          <p>{artifact.payload.uncertainty ?? artifact.payload.rationale}</p>
          <dl className="intel-detail">
            <dt>Horizon</dt>
            <dd>{artifact.payload.horizon ?? "Until expiry"}</dd>
            <dt>Generated</dt>
            <dd>{stamp(artifact.generatedAt)}</dd>
            <dt>Data through</dt>
            <dd>{stamp(artifact.dataThrough)}</dd>
            <dt>Readiness</dt>
            <dd>{title(artifact.payload.readiness ?? artifact.state)}</dd>
            <dt>Version</dt>
            <dd>
              {artifact.payload.modelVersion ??
                artifact.payload.formulaVersion ??
                "capacity-v1"}
            </dd>
            <dt>Baseline</dt>
            <dd>{artifact.payload.baseline ?? "Deterministic assumptions"}</dd>
          </dl>
        </Panel>
        <Panel
          heading={
            artifact.kind === "prediction"
              ? "Why this prediction"
              : "Assumptions and rationale"
          }
        >
          {artifact.payload.explanation?.map((e) => <p key={e}>{e}</p>)}
          {artifact.payload.formula && <p>{artifact.payload.formula}</p>}
          {artifact.payload.caveat && <p>{artifact.payload.caveat}</p>}
          {artifact.payload.assumptions && (
            <Table
              columns={["assumption", "value"]}
              rows={Object.entries(artifact.payload.assumptions).map(
                ([assumption, value]) => ({ assumption, value }),
              )}
            />
          )}
          <p className="intel-muted">{artifact.payload.source}</p>
          {artifact.payload.constraints?.map((c) => <p key={c}>{c}</p>)}
          {artifact.payload.options?.map((o) => <p key={o}>{o}</p>)}
          <div className="intel-actions">
            <Button onClick={() => download(artifact)}>
              Export exact payload
            </Button>
            {artifact.kind === "projection" && (
              <Button
                onClick={() => {
                  setTemplate(
                    artifact.payload.template as keyof typeof templates,
                  );
                  setAssumptions(artifact.payload.assumptions ?? {});
                  setScenarioDomain(artifact.domain);
                  navigate(ROOT + "/scenarios");
                }}
              >
                Clone scenario
              </Button>
            )}
            {artifact.payload.template === "workload" && (
              <Button
                disabled={busy}
                onClick={() =>
                  void action(
                    () =>
                      api.request("/recommendations", "POST", {
                        artifactId: artifact.id,
                      }),
                    "Recommendation generated",
                  )
                }
              >
                Suggest options
              </Button>
            )}
            {artifact.payload.action && (
              <Button
                component={Link}
                to={"/app" + artifact.payload.action.path}
              >
                Review in domain planner
              </Button>
            )}
          </div>
        </Panel>
        {artifact.kind === "prediction" && (
          <Panel heading="Outcome and feature snapshot">
            {artifact.payload.outcome ? (
              <Json value={artifact.payload.outcome} />
            ) : (
              <p>
                Unresolved predictions are excluded from performance metrics.
              </p>
            )}
            <Json value={artifact.payload.featureSnapshot} />
            <Button
              component={Link}
              to={ROOT + "/models/" + String(artifact.payload.definitionId)}
            >
              Model details
            </Button>
          </Panel>
        )}
        <Panel heading="Feedback">
          <p>Your feedback is kept separate from the actual outcome.</p>
          <TextField
            fullWidth
            multiline
            label="Optional feedback"
            value={feedbackNote}
            onChange={(e) => setFeedbackNote(e.target.value)}
          />
          <div className="intel-actions">
            {[
              "helpful",
              "not_helpful",
              "incorrect_data",
              ...(artifact.kind === "recommendation"
                ? ["dismissed", "accepted"]
                : []),
            ].map((response) => (
              <Button
                disabled={busy}
                key={response}
                onClick={() =>
                  void action(
                    () =>
                      api.request(
                        `/artifacts/${artifact.id}/feedback`,
                        "POST",
                        { response, note: feedbackNote },
                      ),
                    "Feedback saved",
                  )
                }
              >
                {title(response)}
              </Button>
            ))}
          </div>
        </Panel>
      </>
    ) : (
      <Empty>
        The artifact is unavailable, deleted, or outside your current consent
        scopes.
      </Empty>
    );
  } else if (path === "privacy") {
    content = (
      <>
        <Panel heading="Choose what Intelligence can use">
          <p>
            Opt in by domain. Each enabled domain permits personal analytics,
            deterministic scenarios and validated predictions. Revoking consent
            stops processing and hides its artifacts. Core tracking records
            remain available.
          </p>
          {consents.map((c) => (
            <div
              key={c.domain}
              className="intel-panel"
              style={{ marginTop: 12 }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={c.enabled}
                    disabled={busy}
                    onChange={(_, enabled) =>
                      void action(
                        () =>
                          api.request("/consents", "PUT", {
                            domain: c.domain,
                            enabled,
                          }),
                        "Consent updated",
                      )
                    }
                  />
                }
                label={title(c.domain)}
              />
              <p className="intel-muted">{c.purpose}</p>
              {c.domain === "cross-domain" && (
                <p>
                  Separate consent is required. Associations never establish
                  causation.
                </p>
              )}
            </div>
          ))}
        </Panel>
        <div className="intel-actions">
          <Button component={Link} to={ROOT + "/export"}>
            Export derived data
          </Button>
          <Button component={Link} to={ROOT + "/delete"}>
            Delete derived data
          </Button>
        </div>
      </>
    );
  } else if (path === "scenarios") {
    content = (
      <>
        <Panel heading="Compare assumptions before changing your plan">
          <p className="intel-muted">
            These reproducible calculations use the assumptions you enter.
            Saving a scenario never changes your tracking records.
          </p>
          <div className="intel-form">
            <TextField
              select
              label="Template"
              value={template}
              onChange={(e) => {
                const key = e.target.value as keyof typeof templates;
                setTemplate(key);
                setAssumptions({ ...templates[key].fields });
                setScenarioDomain(templates[key].domain);
              }}
            >
              {Object.entries(templates).map(([k, v]) => (
                <MenuItem value={k} key={k}>
                  {v.label}
                </MenuItem>
              ))}
            </TextField>
            {template === "workload" && (
              <TextField
                label="Domain"
                select
                value={scenarioDomain}
                onChange={(e) => setScenarioDomain(e.target.value)}
              >
                <MenuItem value="productivity">Productivity</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </TextField>
            )}
            <TextField
              label="Scenario name"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
            {Object.entries(assumptions).map(([k, v]) => (
              <TextField
                key={k}
                label={k.replace(/([A-Z])/g, " $1")}
                type="number"
                value={v}
                onChange={(e) =>
                  setAssumptions((a) => ({ ...a, [k]: Number(e.target.value) }))
                }
              />
            ))}
          </div>
          <Button
            variant="contained"
            disabled={busy}
            onClick={() =>
              void action(async () => {
                const a = await api.request<IntelligenceArtifact>(
                  "/projections",
                  "POST",
                  {
                    domain: scenarioDomain,
                    template,
                    assumptions,
                    name: scenarioName || undefined,
                    save: true,
                  },
                );
                setComparison((c) => [...c.slice(-2), a]);
              }, "Scenario saved")
            }
          >
            Run and save scenario
          </Button>
        </Panel>
        {comparison.length > 0 && (
          <Panel heading="Scenario comparison">
            <ArtifactList rows={comparison} />
          </Panel>
        )}
        <Panel heading="Saved scenarios">
          <ArtifactList
            rows={data.artifacts.filter((a) => a.kind === "projection")}
          />
        </Panel>
      </>
    );
  } else if (path === "readiness") {
    content = (
      <Panel heading="Evidence before predictions">
        <ReadinessTable rows={data.readiness} />
      </Panel>
    );
  } else if (path === "data-sources") {
    content = (
      <Panel heading="Source history and ownership">
        <p>
          Import your existing Money and Maintenance records with a truthful
          “recorded now” timestamp. Importing old records does not create
          historical point-in-time training labels.
        </p>
        <Table columns={["domain", "owned"]} rows={data.sourceStatus} />
        <Button
          disabled={busy}
          onClick={() =>
            void action(
              () => api.request("/sources/import", "POST", {}),
              "Available source history imported",
            )
          }
        >
          Import available history
        </Button>
        <p className="intel-muted">
          Other source modules need user ownership and target resolution before
          personalized models can use them. New Money and Maintenance mutations
          emit events atomically while consent is enabled.
        </p>
      </Panel>
    );
  } else if (path === "delete") {
    content = (
      <Panel heading="Delete Intelligence data">
        <p>
          This removes your events, projections, predictions, recommendations,
          feedback, model versions, and preferences. Consent is disabled. Core
          Money, Maintenance and other tracking records are preserved. One
          minimal deletion audit record remains.
        </p>
        <TextField
          fullWidth
          label="Type DELETE INTELLIGENCE"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <Button
          color="error"
          disabled={busy || confirmation !== "DELETE INTELLIGENCE"}
          onClick={() =>
            void action(
              () => api.request("/data", "DELETE", { confirmation }),
              "Intelligence data deleted and processing disabled",
            )
          }
        >
          Delete derived data
        </Button>
      </Panel>
    );
  } else if (path === "export") {
    content = (
      <Panel heading="Export your Intelligence records">
        <p>
          Download structured JSON containing your derived events, artifacts,
          model metadata, consent, and preferences. This export does not include
          source-domain records.
        </p>
        <Button
          variant="contained"
          disabled={busy}
          onClick={() =>
            void action(
              async () => download(await api.request("/export")),
              "Export downloaded",
            )
          }
        >
          Download JSON export
        </Button>
      </Panel>
    );
  } else if (path === "settings" || path === "notifications") {
    content = (
      <Panel
        heading={
          path === "settings"
            ? "Intelligence preferences"
            : "Notification preferences"
        }
      >
        <p>
          Notification delivery is not connected. Preferences are saved for
          future delivery; no alerts are sent from this build.
        </p>
        <div className="intel-form">
          {(
            [
              "materialChangePercent",
              "quietStart",
              "quietEnd",
              "retentionDays",
            ] as const
          ).map((k) => (
            <TextField
              type="number"
              key={k}
              label={k.replace(/([A-Z])/g, " $1")}
              value={data.preferences[k]}
              onChange={(e) =>
                setData({
                  ...data,
                  preferences: {
                    ...data.preferences,
                    [k]: Number(e.target.value),
                  },
                })
              }
            />
          ))}
        </div>
        <FormControlLabel
          control={
            <Checkbox
              checked={data.preferences.explanations}
              onChange={(_, v) =>
                setData({
                  ...data,
                  preferences: { ...data.preferences, explanations: v },
                })
              }
            />
          }
          label="Show explanations"
        />
        <p className="intel-muted">
          Retention is a saved preference; automatic pruning is not enabled.
          Delete derived data explicitly from the Deletion Center.
        </p>
        <Button
          disabled={busy}
          onClick={() =>
            void action(() =>
              api.request("/preferences", "PUT", data.preferences),
            )
          }
        >
          Save preferences
        </Button>
      </Panel>
    );
  } else if (path === "models") {
    content = (
      <Panel heading="Domain-specific model contracts">
        <ReadinessTable rows={data.readiness} />
      </Panel>
    );
  } else if (modelId) {
    content = definition ? (
      <>
        <Panel heading={definition.name}>
          <dl className="intel-detail">
            {Object.entries({
              target: definition.target,
              horizon: definition.horizon,
              baseline: definition.baseline,
              metric: definition.metric,
              "product metric": definition.productMetric,
              readiness: title(definition.state),
            }).map(([k, v]) => (
              <div key={k} style={{ display: "contents" }}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p>{definition.reason}</p>
          <div className="intel-actions">
            {["versions", "backtests", "compare"].map((p) => (
              <Button
                key={p}
                component={Link}
                to={`${ROOT}/models/${modelId}/${p}`}
              >
                {title(p)}
              </Button>
            ))}
            {isAdmin && definition.id === "FIN-01" && (
              <Button
                disabled={busy || definition.state !== "ready_for_validation"}
                onClick={() =>
                  void action(
                    () =>
                      api.request("/models/train", "POST", {
                        definitionId: modelId,
                        currency: "INR",
                      }),
                    "Training completed",
                  )
                }
              >
                Train candidate
              </Button>
            )}
          </div>
        </Panel>
        {version ? (
          <Panel heading="Reproducibility and validation">
            <Json value={version} />
          </Panel>
        ) : path.endsWith("/backtests") ? (
          <Panel heading="Chronological validation folds">
            {modelVersions.map((v) => (
              <div key={v.id}>
                <h3>{v.id.slice(0, 8)}</h3>
                <Table
                  rows={v.payload.folds}
                  columns={[
                    "trainFrom",
                    "trainThrough",
                    "testMonth",
                    "actual",
                    "predicted",
                    "baseline",
                    "error",
                  ]}
                />
              </div>
            ))}
            {!modelVersions.length && (
              <Empty>No temporal evaluation runs yet.</Empty>
            )}
          </Panel>
        ) : (
          <Panel
            heading={
              path.endsWith("/compare")
                ? "Candidate and champion comparison"
                : "Version history"
            }
          >
            <VersionTable
              rows={modelVersions}
              onStage={
                isAdmin ? (v, stage) => setStageReview({ v, stage }) : undefined
              }
            />
          </Panel>
        )}
      </>
    ) : (
      <Empty>Unknown model definition.</Empty>
    );
  } else if (path === "registry") {
    content = (
      <Panel heading="Validation-gated registry">
        <VersionTable
          rows={data.versions}
          onStage={(v, stage) => setStageReview({ v, stage })}
        />
      </Panel>
    );
  } else if (path === "outcomes") {
    const unresolved = data.artifacts.filter(
      (a) => a.kind === "prediction" && !a.payload.outcome,
    );
    content = (
      <Panel heading="Resolve observed outcomes">
        <p>
          Manual labels are identified and audited. A target cannot be resolved
          before its horizon ends.
        </p>
        {unresolved.map((a) => (
          <div className="intel-panel" key={a.id}>
            <h3>
              {a.payload.title} · {a.payload.horizon}
            </h3>
            <div className="intel-form">
              <TextField
                label="Observed value"
                type="number"
                value={actual}
                onChange={(e) => setActual(e.target.value)}
              />
              <TextField
                label="Evidence / reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <Button
              disabled={busy || !actual || !reason}
              onClick={() =>
                void action(
                  () =>
                    api.request(`/artifacts/${a.id}/outcome`, "POST", {
                      actual: Number(actual),
                      reason,
                    }),
                  "Outcome resolved",
                )
              }
            >
              Resolve manually
            </Button>
          </div>
        ))}
        {!unresolved.length && <Empty>No unresolved predictions.</Empty>}
      </Panel>
    );
  } else if (
    path === "quality" ||
    path === "quality/calibration" ||
    path === "monitoring/performance"
  ) {
    content = (
      <>
        <Panel heading="Quality by model and currency">
          <VersionTable rows={data.versions} />
          <p className="intel-muted">
            MAE is measured in each model’s currency. Coverage must be read
            alongside interval width and sample count. Unresolved predictions
            are excluded.
          </p>
        </Panel>
        <Panel heading="Resolved outcomes">
          <ArtifactList
            rows={data.artifacts.filter(
              (a) => a.kind === "prediction" && a.payload.outcome,
            )}
          />
        </Panel>
      </>
    );
  } else if (path === "events" || path === "audit") {
    content = (
      <Panel
        heading={path === "events" ? "Immutable event history" : "Audit trail"}
      >
        <Table
          rows={(path === "events" ? diag?.events : diag?.audit) ?? []}
          columns={
            path === "events"
              ? [
                  "eventType",
                  "entityId",
                  "eventTime",
                  "recordedAt",
                  "schemaVersion",
                  "attributes",
                ]
              : ["action", "entityId", "createdAt", "detail"]
          }
        />
      </Panel>
    );
  } else if (path === "events/schemas") {
    content = (
      <Panel heading="Versioned event contracts">
        <Table
          rows={diag?.schemas ?? []}
          columns={[
            "domain",
            "version",
            "entityType",
            "types",
            "fields",
            "cutoff",
          ]}
        />
        <p>Schema changes require a versioned code and migration review.</p>
      </Panel>
    );
  } else if (path.startsWith("features")) {
    content = (
      <Panel heading="Feature catalog and cutoff semantics">
        <Table
          rows={[
            {
              id: "monthly-spend-v1",
              source: "consented transaction events",
              transform:
                "Latest known transaction version per entity; expense minus refund, grouped by currency and month",
              cutoff:
                "Both eventTime and recordedAt ≤ featureTime. Historical labels reconstructed at month end.",
              consumers: "FIN-01",
            },
          ]}
          columns={["id", "source", "transform", "cutoff", "consumers"]}
        />
      </Panel>
    );
  } else if (path === "agent-contracts") {
    content = (
      <Panel heading="Structured read tools">
        <Table
          rows={diag?.contracts ?? []}
          columns={["name", "method", "path", "permission", "mutatesDomain"]}
        />
        <p>
          These API contracts supply structured numbers and lineage. A
          conversational agent and domain write tools are not connected in this
          build.
        </p>
      </Panel>
    );
  } else if (path === "recommendation-engine") {
    content = (
      <Panel heading="Capacity rule v1">
        <p>
          A workload projection above capacity can produce a review
          recommendation. Hard deadlines remain unchanged. Recommendation
          feedback never changes prediction outcomes.
        </p>
        <Button component={Link} to={ROOT + "/scenarios"}>
          Test with a workload scenario
        </Button>
      </Panel>
    );
  } else if (
    path.startsWith("monitoring") ||
    path === "diagnostics/inference"
  ) {
    content = (
      <>
        <Panel heading={page?.title ?? "Monitoring"}>
          <ReadinessTable rows={data.readiness} />
          <p className="intel-muted">
            Unavailable predictions are distinguished from measured prediction
            errors. No drift estimate is published without a distribution
            comparison.
          </p>
        </Panel>
        <Panel heading="Model status">
          <VersionTable rows={data.versions} />
        </Panel>
      </>
    );
  } else if (path === "jobs/training") {
    content = (
      <Panel heading="Recorded training runs">
        <VersionTable rows={data.versions} />
        <p>
          Training runs synchronously and registers a candidate only after
          evaluation completes. Failed training never changes the champion.
        </p>
      </Panel>
    );
  } else if (path === "agent-traces") {
    content = (
      <Empty>
        No agent is connected. Structured read contracts are available for
        integration.
      </Empty>
    );
  } else if (
    path === "" ||
    path === "forecasts" ||
    path === "history" ||
    path === "recommendations" ||
    domainPath
  ) {
    const rows =
      path === "history"
        ? artifacts.filter((a) => a.kind === "prediction")
        : path === "recommendations"
          ? artifacts.filter((a) => a.kind === "recommendation")
          : artifacts;
    content = (
      <>
        {path === "" && (
          <>
            <div className="intel-stats">
              {[
                "projections",
                "predictions",
                "recommendations",
                "resolved",
              ].map((k) => (
                <div className="intel-stat" key={k}>
                  <strong>{data.counts[k]}</strong>
                  <span>{k}</span>
                </div>
              ))}
            </div>
            <Panel heading="A clearer view of what comes next">
              <p>
                Explore facts, test assumptions, and inspect predictions only
                when there is enough evidence.
              </p>
              <div className="intel-actions">
                <Button
                  variant="contained"
                  component={Link}
                  to={ROOT + "/scenarios"}
                >
                  Explore a scenario
                </Button>
                <Button component={Link} to={ROOT + "/privacy"}>
                  Manage consent
                </Button>
                <Button
                  disabled={busy}
                  onClick={() =>
                    void action(
                      () => api.request("/sources/import", "POST", {}),
                      "History refreshed",
                    )
                  }
                >
                  Refresh source history
                </Button>
              </div>
            </Panel>
          </>
        )}
        {domainPath === "cross-domain" && (
          <Alert severity="info">
            Cross-domain associations require separate consent and sufficient
            overlapping observations. No causal claim or cross-domain model is
            available yet.
          </Alert>
        )}
        {filterBar}
        <Panel
          heading={
            path === "history"
              ? "Predictions and outcomes"
              : path === "recommendations"
                ? "Recommendations"
                : "Forecasts and scenarios"
          }
        >
          <ArtifactList rows={rows} />
        </Panel>
        {(path === "" || domainPath) && (
          <Panel heading="Prediction readiness">
            <ReadinessTable
              rows={data.readiness.filter(
                (r) => !domainPath || r.domain === domainPath,
              )}
            />
          </Panel>
        )}
        {domainPath === "money" && <Button disabled={busy} onClick={() => void action(async () => { const a = await api.request<IntelligenceArtifact>("/sources/projection", "POST", {currency:"INR"}); navigate(`${ROOT}/projections/${a.id}`); }, "Ledger projection generated")}>Project from current ledger</Button>}
        {domainPath === "money" && (
          <Button
            disabled={busy}
            onClick={() =>
              void action(
                () => api.request("/predictions", "POST", { currency: "INR" }),
                "Prediction generated",
              )
            }
          >
            Generate validated forecast
          </Button>
        )}
      </>
    );
  } else
    content = (
      <Empty>
        This page does not exist. <Link to={ROOT}>Return to overview</Link>.
      </Empty>
    );
  return (
    <main className="intelligence">
      <header className="intel-header">
        <div>
          <div className="intel-eyebrow">WholeSignal / Intelligence</div>
          <h1>{page?.title ?? "Intelligence"}</h1>
          <p className="intel-muted">
            {page?.purpose ??
              "Data, projections, and predictions you can inspect."}
          </p>
        </div>
        <div className="intel-muted">
          {data ? `Updated ${stamp(data.generatedAt)}` : "Connecting…"}
          <br />
          {data?.enabledDomains.length ?? 0} domains enabled
        </div>
      </header>
      <div className="intel-layout">
        <nav className="intel-nav" aria-label="Intelligence navigation">
          {navGroups.map((g) => (
            <div key={g.name} style={{ display: "contents" }}>
              <div className="intel-nav-label">{g.name}</div>
              {g.links.map(([p, label]) => (
                <NavLink end key={p} to={ROOT + (p ? "/" + p : "")}>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="intel-content">
          {error && (
            <Alert
              severity="error"
              className="intel-error"
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}
          {notice && (
            <Alert severity="success" onClose={() => setNotice("")}>
              {notice}
            </Alert>
          )}
          {data && !data.enabledDomains.length && path !== "privacy" && (
            <Alert
              severity="info"
              action={
                <Button component={Link} to={ROOT + "/privacy"}>
                  Choose domains
                </Button>
              }
            >
              Intelligence is opt-in. Enable a domain to begin.
            </Alert>
          )}
          {stageReview && (
            <Panel heading="Review model stage change">
              <p>
                {stageReview.v.id} → {stageReview.stage}. Promotion replaces the
                current champion for this definition and currency. This action
                is audited.
              </p>
              <Json value={stageReview.v.payload.gates} />
              <Button
                disabled={busy}
                onClick={() =>
                  void action(async () => {
                    await api.request(
                      `/models/${stageReview.v.id}/stage`,
                      "POST",
                      { stage: stageReview.stage },
                    );
                    setStageReview(undefined);
                  }, "Registry updated")
                }
              >
                Confirm stage change
              </Button>
              <Button onClick={() => setStageReview(undefined)}>Cancel</Button>
            </Panel>
          )}
          {content}
        </div>
      </div>
    </main>
  );
}
