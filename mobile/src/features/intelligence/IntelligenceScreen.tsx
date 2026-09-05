import { useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, type Href } from "expo-router";
import { Share, Text, TextInput, View, Switch, StyleSheet } from "react-native";
import { Screen } from "@/components/screen";
import { Card, Button, StateMessage } from "@/components/ui";
import { useAuth } from "@/auth/provider";
import { useLifeOSTheme } from "@/theme/provider";
import { intelligenceApi as api } from "./api";
import type { IntelligenceArtifact, Domain } from "./types";
import pages from "./pages.json";
const fmt = (s?: string | null) =>
  s ? new Date(s).toLocaleString() : "No source timestamp";
const label = (s: string) => s.replaceAll("_", " ");
const templates: Record<
  string,
  { domain: Domain; fields: Record<string, number> }
> = {
  "money-run-rate": {
    domain: "money",
    fields: {
      spent: 0,
      elapsedDays: 10,
      periodDays: 30,
      remainingCommitments: 0,
    },
  },
  "learning-pace": {
    domain: "learning",
    fields: { remainingUnits: 10, unitsPerWeek: 2 },
  },
  workload: {
    domain: "productivity",
    fields: { plannedMinutes: 300, capacityMinutes: 240 },
  },
  adherence: { domain: "fitness", fields: { completed: 3, planned: 4 } },
};
export default function IntelligenceScreen({ path = "" }: { path?: string }) {
  const router = useRouter(),
    client = useQueryClient(),
    { user } = useAuth(),
    { colors } = useLifeOSTheme();
  const query = useQuery({
    queryKey: ["intelligence", user?.id],
    queryFn: api.summary,
    enabled: !!user,
    staleTime: 30000,
    retry: 1,
  });
  const consentQuery = useQuery({
    queryKey: ["intelligence-consents", user?.id],
    queryFn: api.consents,
    enabled: !!user,
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [filter, setFilter] = useState("all"),
    [template, setTemplate] = useState("money-run-rate"),
    [assumptions, setAssumptions] = useState<Record<string, string>>(
      Object.fromEntries(
        Object.entries(templates["money-run-rate"]!.fields).map(([k, v]) => [
          k,
          String(v),
        ]),
      ),
    ),
    [scenarioDomain, setScenarioDomain] = useState<Domain>("money"),
    [scenarioName, setScenarioName] = useState(""),
    [result, setResult] = useState<IntelligenceArtifact>(),
    [note, setNote] = useState(""),
    [confirmation, setConfirmation] = useState("");
  const data = query.data;
  const go = (p: string) =>
    router.push(("/intelligence" + (p ? "/" + p : "")) as Href);
  const text = (children: ReactNode, muted = false) => (
    <Text
      style={{
        color: muted ? colors.inkMuted : colors.ink,
        fontSize: 14,
        lineHeight: 22,
      }}
    >
      {children}
    </Text>
  );
  const heading = (children: ReactNode) => (
    <Text
      accessibilityRole="header"
      style={{
        color: colors.ink,
        fontSize: 19,
        fontWeight: "800",
        marginBottom: 10,
      }}
    >
      {children}
    </Text>
  );
  const input = (
    name: string,
    value: string,
    onChangeText: (v: string) => void,
    numeric = false,
  ) => (
    <View key={name} style={{ gap: 6, marginVertical: 8 }}>
      {text(name)}
      <TextInput
        accessibilityLabel={name}
        value={value}
        onChangeText={onChangeText}
        keyboardType={numeric ? "decimal-pad" : "default"}
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          padding: 12,
          color: colors.ink,
          backgroundColor: colors.surfaceMuted,
        }}
      />
    </View>
  );
  async function act(fn: () => Promise<unknown>, message = "Saved") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await fn();
      await client.invalidateQueries({ queryKey: ["intelligence", user?.id] });
      await client.invalidateQueries({
        queryKey: ["intelligence-consents", user?.id],
      });
      setNotice(message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const route = pages.find((p) =>
    new RegExp("^" + p.path.replace(/:[^/]+/g, "[^/]+") + "$").test(path),
  );
  const artifactId = path.match(
    /^(?:predictions|projections|recommendations|history|agent-handoff|status)\/([^/]+)/,
  )?.[1];
  const artifact = data?.artifacts.find((a) => a.id === artifactId);
  const artifactCard = (a: IntelligenceArtifact) => (
    <Card key={a.id}>
      {text(a.kind.toUpperCase() + " · " + a.domain, true)}
      {heading(a.payload.title)}
      {a.payload.value != null && (
        <Text
          style={{
            color: colors.ink,
            fontSize: 29,
            fontWeight: "800",
            marginVertical: 10,
          }}
        >
          {a.payload.value} {a.payload.unit}
        </Text>
      )}
      {a.payload.lower != null &&
        text(`Interval ${a.payload.lower}–${a.payload.upper}`)}
      {text(
        a.payload.uncertainty ??
          a.payload.rationale ??
          "Deterministic scenario",
        true,
      )}
      {text(`Horizon: ${a.payload.horizon ?? "Until expiry"}`, true)}
      {text(`Generated: ${fmt(a.generatedAt)}`, true)}
      {text(`Data through: ${fmt(a.dataThrough)}`, true)}
      {text(`Readiness: ${label(a.payload.readiness ?? a.state)}`, true)}
      {a.payload.expiresAt &&
        Date.parse(a.payload.expiresAt) < Date.now() &&
        text("Expired — refresh before acting.")}
      {
        <Button
          variant="secondary"
          label="Inspect details"
          onPress={() =>
            go(
              `${a.kind === "recommendation" ? "recommendations" : a.kind === "prediction" ? "predictions" : "projections"}/${a.id}`,
            )
          }
        />
      }
    </Card>
  );
  const readinessCards = (domain?: string) =>
    data?.readiness
      .filter((r) => !domain || r.domain === domain)
      .map((r) => (
        <Card key={r.id}>
          {heading(r.name)}
          {text(label(r.state))}
          {text(
            `${r.events} events · ${r.labels}/${r.minimumLabels} labels · ${r.historyDays}/${r.minimumDays} days`,
            true,
          )}
          {text(r.reason, true)}
          <Button
            label="Model requirements"
            variant="secondary"
            onPress={() => go("models/" + r.id)}
          />
        </Card>
      ));
  let content: ReactNode;
  if (query.isPending)
    content = (
      <StateMessage
        title="Loading Intelligence"
        message="Reading your consent and available history."
        loading
      />
    );
  else if (!data)
    content = (
      <StateMessage
        title="Intelligence unavailable"
        message={query.error?.message ?? "Could not connect."}
        action={<Button label="Retry" onPress={() => void query.refetch()} />}
      />
    );
  else if (["onboarding/consent", "settings/privacy"].includes(path)) {
    content = (
      <>
        <Card>
          {heading("Your data, your choice")}
          {text(
            "Each domain is optional. Revoking consent stops processing and hides derived artifacts. It preserves your tracking records.",
          )}
        </Card>
        {(consentQuery.data ?? []).map((c) => (
          <Card key={c.domain}>
            <View style={styles.row}>
              {heading(label(c.domain))}
              <Switch
                accessibilityLabel={`Enable ${c.domain} intelligence`}
                value={c.enabled}
                disabled={busy || query.isError}
                onValueChange={(enabled) =>
                  void act(
                    () =>
                      api.mutate(
                        "/consents",
                        { domain: c.domain, enabled },
                        "PUT",
                      ),
                    "Consent updated",
                  )
                }
              />
            </View>
            {text(c.purpose, true)}
            {c.domain === "cross-domain" &&
              text(
                "Separate opt-in. Associations are not proof of causation.",
                true,
              )}
          </Card>
        ))}
        <Button
          label="Review data readiness"
          onPress={() => go("onboarding/readiness")}
        />
        <Button
          variant="secondary"
          label="Export or delete data"
          onPress={() => go("settings")}
        />
      </>
    );
  } else if (path === "onboarding") {
    content = (
      <>
        <Card>
          {heading("From records to decisions")}
          {text(
            "Analytics describe recorded facts. Projections calculate what happens under your assumptions. Predictions estimate an observable future outcome and require validated models.",
          )}
        </Card>
        <Card>
          {heading("Numbers you can inspect")}
          {text(
            "Predictions include a horizon, uncertainty, source freshness and model version. No probability is shown just because a model exists.",
          )}
        </Card>
        <Button
          label="Choose data domains"
          onPress={() => go("onboarding/consent")}
        />
        <Button
          variant="secondary"
          label="Skip Intelligence"
          onPress={() => router.back()}
        />
      </>
    );
  } else if (path === "readiness" || path === "onboarding/readiness") {
    content = (
      <>
        {readinessCards()}
        <Button label="Open Intelligence home" onPress={() => go("home")} />
      </>
    );
  } else if (path === "scenarios/new") {
    content = (
      <>
        <Card>
          {heading("What if your assumptions change?")}
          {text(
            "All results are deterministic. Saving never changes your tracking records.",
            true,
          )}
          <View style={styles.gap}>
            {Object.keys(templates).map((k) => (
              <Button
                key={k}
                variant={k === template ? "primary" : "secondary"}
                label={label(k)}
                onPress={() => {
                  setTemplate(k);
                  setScenarioDomain(templates[k]!.domain);
                  setAssumptions(
                    Object.fromEntries(
                      Object.entries(templates[k]!.fields).map(([name, v]) => [
                        name,
                        String(v),
                      ]),
                    ),
                  );
                }}
              />
            ))}
          </View>
          {template === "workload" && (
            <Button
              variant="secondary"
              label={`Domain: ${scenarioDomain} (tap to change)`}
              onPress={() =>
                setScenarioDomain(
                  scenarioDomain === "maintenance"
                    ? "productivity"
                    : "maintenance",
                )
              }
            />
          )}{" "}
          {input("Scenario name", scenarioName, setScenarioName)}
          {Object.entries(assumptions).map(([k, v]) =>
            input(
              k.replace(/([A-Z])/g, " $1"),
              v,
              (n) => setAssumptions((a) => ({ ...a, [k]: n })),
              true,
            ),
          )}
          <Button
            label="Run and save scenario"
            disabled={busy || query.isError}
            onPress={() =>
              void act(async () => {
                const a = await api.mutate<IntelligenceArtifact>(
                  "/projections",
                  {
                    domain: scenarioDomain,
                    template,
                    assumptions: Object.fromEntries(
                      Object.entries(assumptions).map(([k, v]) => [
                        k,
                        Number(v),
                      ]),
                    ),
                    name: scenarioName || undefined,
                    save: true,
                  },
                );
                setResult(a);
              }, "Scenario saved")
            }
          />
        </Card>
        {result && artifactCard(result)}
      </>
    );
  } else if (path === "settings/delete") {
    content = (
      <Card>
        {heading("Delete derived intelligence")}
        {text(
          "This deletes events, scenarios, predictions, recommendations, feedback, models, and preferences. Consent is disabled. Core tracking records are preserved. A minimal deletion audit remains.",
        )}
        {input("Type DELETE INTELLIGENCE", confirmation, setConfirmation)}
        <Button
          variant="danger"
          label="Delete Intelligence data"
          disabled={
            busy || query.isError || confirmation !== "DELETE INTELLIGENCE"
          }
          onPress={() =>
            void act(async () => {
              await api.mutate("/data", { confirmation }, "DELETE");
              setResult(undefined);
              client.removeQueries({ queryKey: ["intelligence", user?.id] });
              go("");
            }, "Derived data deleted")
          }
        />
      </Card>
    );
  } else if (path === "settings/export") {
    content = (
      <Card>
        {heading("Export Intelligence")}
        {text(
          "Export your derived records as JSON. Source-domain records are excluded. The share sheet lets you choose where to save or send it.",
        )}
        <Button
          label="Export JSON"
          disabled={busy || query.isError}
          onPress={() =>
            void act(async () => {
              const exported = await api.export();
              await Share.share({
                title: "WholeSignal Intelligence export",
                message: JSON.stringify(exported, null, 2),
              });
            }, "Export prepared")
          }
        />
      </Card>
    );
  } else if (
    path === "settings" ||
    path === "settings/notifications" ||
    path === "notifications"
  ) {
    content = (
      <Card>
        {heading("Intelligence controls")}
        <View style={styles.gap}>
          {[
            ["settings/privacy", "Privacy & domain consent"],
            ["settings/export", "Export data"],
            ["settings/delete", "Delete derived data"],
            ["models", "Model transparency"],
            ["data-sources", "Data sources"],
            ["trust", "Quality & trust"],
          ].map(([p, n]) => (
            <Button
              key={p}
              label={n!}
              variant="secondary"
              onPress={() => go(p!)}
            />
          ))}
        </View>
        {text(
          "Notification delivery is not connected. No automatic alerts are sent in this build.",
          true,
        )}
      </Card>
    );
  } else if (path === "data-sources") {
    content = (
      <Card>
        {heading("Import available source history")}
        {text(
          "Money and Maintenance are user-owned sources. Imported history is recorded now, so it cannot masquerade as earlier training data. Other domains need attributed event history and target resolution.",
        )}
        <Button
          label="Import source history"
          disabled={busy || query.isError}
          onPress={() =>
            void act(
              () => api.mutate("/sources/import", {}),
              "Source history imported",
            )
          }
        />
      </Card>
    );
  } else if (path === "models" || path.startsWith("models/")) {
    const id = path.split("/")[1];
    content = (
      <>
        {data.readiness
          .filter((r) => !id || r.id === id)
          .map((r) => (
            <Card key={r.id}>
              {heading(r.name)}
              {text(`Target: ${r.target}`)}
              {text(`Horizon: ${r.horizon}`)}
              {text(`Baseline: ${r.baseline}`)}
              {text(`Evaluation: ${r.metric}`)}
              {text(r.reason, true)}
              {data.versions
                .filter((v) => v.definitionId === r.id)
                .map((v) => (
                  <View key={v.id} style={{ marginTop: 14 }}>
                    {text(`Version ${v.id} · ${v.stage}`)}
                    {text(
                      `Validation ${v.payload.validation} · ${v.payload.currency}`,
                      true,
                    )}
                    {text(JSON.stringify(v.payload.metrics), true)}
                  </View>
                ))}
            </Card>
          ))}
      </>
    );
  } else if (path === "trust") {
    content = (
      <>
        <Card>
          {heading("Reliability depends on the target")}
          {text(
            "Spend forecasts use currency errors and interval coverage. Completion models use probability calibration. There is no combined accuracy score.",
          )}
          {text(
            "Unresolved outcomes are excluded from quality statistics.",
            true,
          )}
        </Card>
        {data.versions.map((v) => (
          <Card key={v.id}>
            {heading(v.definitionId + " · " + v.payload.currency)}
            {text(
              `MAE ${v.payload.metrics.mae}; baseline MAE ${v.payload.metrics.baselineMae}`,
            )}
            {text(
              `Coverage ${Math.round((v.payload.metrics.coverage ?? 0) * 100)}%; interval width ${v.payload.metrics.intervalWidth}; ${v.payload.metrics.holdoutSamples} holdout samples`,
            )}
          </Card>
        ))}
        {!data.versions.length && readinessCards()}
      </>
    );
  } else if (artifactId) {
    content = artifact ? (
      <>
        {artifactCard(artifact)}
        <Card>
          {heading(
            path.endsWith("/feedback")
              ? "Prediction feedback"
              : "Why this result?",
          )}
          {artifact.payload.formula && text(artifact.payload.formula)}
          {artifact.payload.assumptions &&
            Object.entries(artifact.payload.assumptions).map(([k, v]) => (
              <View key={k}>{text(`${k}: ${v}`)}</View>
            ))}
          {artifact.payload.explanation?.map((e) => (
            <View key={e}>{text(e)}</View>
          ))}
          {text(
            `Version: ${artifact.payload.modelVersion ?? artifact.payload.formulaVersion ?? "capacity-v1"}`,
            true,
          )}
          {artifact.payload.baseline != null &&
            text(`Baseline: ${artifact.payload.baseline}`)}
          {artifact.payload.outcome
            ? text(
                `Actual: ${artifact.payload.outcome.actual}; absolute error: ${artifact.payload.outcome.absoluteError}`,
              )
            : artifact.kind === "prediction" &&
              text("Outcome unresolved. This prediction is not scored.", true)}
          {artifact.payload.constraints?.map((c) => (
            <View key={c}>{text(c)}</View>
          ))}
          {input("Optional feedback", note, setNote)}
          <View style={styles.gap}>
            {[
              "helpful",
              "not_helpful",
              "incorrect_data",
              ...(artifact.kind === "recommendation"
                ? ["dismissed", "accepted"]
                : []),
            ].map((response) => (
              <Button
                key={response}
                label={label(response)}
                variant="secondary"
                disabled={busy || query.isError}
                onPress={() =>
                  void act(
                    () =>
                      api.mutate(`/artifacts/${artifact.id}/feedback`, {
                        response,
                        note,
                      }),
                    "Feedback saved separately from outcomes",
                  )
                }
              />
            ))}
            {artifact.payload.template === "workload" && (
              <Button
                label="Suggest workload options"
                disabled={busy || query.isError}
                onPress={() =>
                  void act(
                    () =>
                      api.mutate("/recommendations", {
                        artifactId: artifact.id,
                      }),
                    "Recommendation created",
                  )
                }
              />
            )}
            <Button
              label="Try a scenario"
              onPress={() => go("scenarios/new")}
            />
            {artifact.payload.action && (
              <Button
                label="Review in domain planner"
                onPress={() =>
                  router.push(artifact.payload.action!.path as Href)
                }
              />
            )}
          </View>
          {text(
            "Feedback does not change actual outcomes. Domain plans require review in the owning planner.",
            true,
          )}
          {path.startsWith("agent-handoff") &&
            text(
              "Structured artifact available. Conversational assistant integration is not connected.",
              true,
            )}
        </Card>
      </>
    ) : (
      <StateMessage
        title="Artifact unavailable"
        message="It may be deleted, outside your consent scopes, or absent from the cached history."
      />
    );
  } else {
    const d = (
      [
        "money",
        "productivity",
        "learning",
        "maintenance",
        "fitness",
        "cross-domain",
      ] as string[]
    ).find((d) => path === d || path.startsWith(d + "/"));
    const rows = data.artifacts.filter(
      (a) =>
        (!d || a.domain === d) &&
        (path === "history"
          ? a.kind === "prediction"
          : path === "recommendations"
            ? a.kind === "recommendation"
            : true) &&
        (filter === "all" || a.kind === filter),
    );
    content = (
      <>
        {(!path || path === "home") && (
          <Card>
            {heading("A clearer view of what comes next")}
            {text(
              `${data.counts.projections} projections · ${data.counts.predictions} predictions · ${data.counts.recommendations} recommendations`,
              true,
            )}
            <View style={styles.gap}>
              <Button
                label="Explore a scenario"
                onPress={() => go("scenarios/new")}
              />
              <Button
                label="Choose your data domains"
                variant="secondary"
                onPress={() => go("onboarding/consent")}
              />
            </View>
          </Card>
        )}
        <View style={styles.gap}>
          {["all", "projection", "prediction", "recommendation"].map((k) => (
            <Button
              key={k}
              label={label(k)}
              variant={k === filter ? "primary" : "secondary"}
              onPress={() => setFilter(k)}
            />
          ))}
        </View>
        {d === "cross-domain" && (
          <Card>
            {text(
              "Cross-domain comparisons require separate consent and enough overlapping observations. Associations are not proof of causation.",
            )}
          </Card>
        )}
        {rows.length ? (
          rows.map(artifactCard)
        ) : (
          <StateMessage
            title="No eligible artifacts"
            message="Run a scenario or inspect readiness. Predictions stay hidden until validation and consent gates pass."
          />
        )}
        {d && readinessCards(d)}
        {!d && (
          <Card>
            {heading("Your domains")}
            <View style={styles.gap}>
              {[
                "money",
                "productivity",
                "learning",
                "maintenance",
                "fitness",
                "cross-domain",
              ].map((d) => (
                <Button
                  key={d}
                  label={label(d)}
                  variant="secondary"
                  onPress={() => go(d)}
                />
              ))}
            </View>
          </Card>
        )}
        {d === "money" && <Button label="Project from current ledger" disabled={busy || query.isError} onPress={() => void act(async () => { const a = await api.mutate<IntelligenceArtifact>("/sources/projection", {currency:"INR"}); go(`projections/${a.id}`); }, "Ledger projection generated")}/>}
        {d === "money" && (
          <Button
            label="Generate validated forecast"
            disabled={busy || query.isError}
            onPress={() =>
              void act(
                () => api.mutate("/predictions", { currency: "INR" }),
                "Prediction generated",
              )
            }
          />
        )}
      </>
    );
  }
  return (
    <Screen
      title={route?.title ?? "Intelligence"}
      eyebrow="WholeSignal"
      refreshing={query.isRefetching}
      onRefresh={() => void query.refetch()}
    >
      <View style={styles.nav}>
        {[
          ["", "Home"],
          ["forecasts", "Forecasts"],
          ["history", "History"],
          ["readiness", "Readiness"],
          ["settings", "Settings"],
        ].map(([p, n]) => (
          <Button
            key={p}
            label={n!}
            variant="secondary"
            onPress={() => go(p!)}
          />
        ))}
      </View>
      {query.isError && data && (
        <Card>
          {heading("Offline or unavailable — cached view")}
          {text(
            `Last fetched ${fmt(new Date(query.dataUpdatedAt).toISOString())}. Cached artifacts retain original timestamps. Changes are disabled until reconnected.`,
          )}
        </Card>
      )}
      {error && (
        <StateMessage title="Could not complete action" message={error} />
      )}{" "}
      {!!notice && <Card>{text(notice)}</Card>}
      {content}
    </Screen>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gap: { gap: 10, marginTop: 14 },
  nav: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
});
