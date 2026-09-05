import { randomUUID } from "node:crypto";
import { Op, type Transaction } from "sequelize";
import { models, sequelize } from "../../models/index.js";
import { createHttpError } from "../../utils/httpError.js";
import {
  DOMAINS,
  DEFINITIONS,
  EVENT_SCHEMAS,
  AGENT_CONTRACTS,
  type Domain,
  type Event,
} from "./contracts.js";
import {
  Consent,
  LifeEvent,
  ArtifactRecord,
  ModelVersion,
  Audit,
  Preference,
} from "./store.js";
import {
  numeric,
  project,
  readiness,
  monthlySpend,
  trainFinance,
  round,
  median,
} from "./engine.js";
type Row = Record<string, any>;
const plain = (r: any): Row => JSON.parse(JSON.stringify(r));
const now = () => new Date().toISOString();
const domain = (d: unknown): Domain => {
  if (!DOMAINS.includes(d as Domain))
    throw createHttpError(400, "Unknown intelligence domain");
  return d as Domain;
};
const str = (v: unknown, name: string, max = 200) => {
  if (typeof v !== "string" || !v.trim() || v.length > max)
    throw createHttpError(
      400,
      `${name} is required (maximum ${max} characters)`,
    );
  return v.trim();
};
export async function lock(userId: string, transaction: Transaction) {
  await sequelize.query(
    "SELECT pg_advisory_xact_lock(73406201, hashtext(:userId))",
    { replacements: { userId }, transaction },
  );
}
export async function enabledDomains(
  userId: string,
  transaction?: Transaction,
) {
  return (
    await Consent.findAll({ where: { userId, enabled: true }, transaction })
  ).map((r) => String(r.get("domain")));
}
async function requireConsent(
  userId: string,
  d: string,
  transaction?: Transaction,
) {
  if (!(await enabledDomains(userId, transaction)).includes(d))
    throw createHttpError(
      403,
      "Intelligence consent is required for this domain",
    );
}
const audit = (
  userId: string,
  action: string,
  entityId: string | null,
  detail: Row,
  transaction?: Transaction,
) => Audit.create({ userId, action, entityId, detail }, { transaction });
export async function consents(userId: string) {
  const rows = await Consent.findAll({ where: { userId } });
  return DOMAINS.map((d) => ({
    domain: d,
    enabled: false,
    purpose:
      d === "cross-domain"
        ? "Compare explicitly approved domain aggregates"
        : "Personal analytics, projections and validated predictions",
    ...plain(rows.find((r) => r.get("domain") === d) ?? {}),
  }));
}
export async function setConsent(userId: string, body: Row) {
  const d = domain(body.domain);
  if (typeof body.enabled !== "boolean")
    throw createHttpError(400, "enabled must be boolean");
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const [r] = await Consent.findOrCreate({
      where: { userId, domain: d },
      defaults: { id: randomUUID(), enabled: false },
      transaction,
    });
    const before = r.get("enabled");
    await r.update(
      { enabled: body.enabled, updatedAt: now() },
      { transaction },
    );
    await audit(
      userId,
      "consent_changed",
      String(r.get("id")),
      { domain: d, before, enabled: body.enabled },
      transaction,
    );
    return plain(r);
  });
}
export async function recordEvent(
  userId: string,
  body: Row,
  transaction: Transaction,
) {
  const d = domain(body.domain);
  await requireConsent(userId, d, transaction);
  const schema = EVENT_SCHEMAS.find(
    (s) => s.domain === d && s.entityType === body.entityType,
  );
  if (
    !schema ||
    body.schemaVersion !== 1 ||
    !schema.types.includes(body.eventType)
  )
    throw createHttpError(400, "Unsupported event schema or type");
  if(typeof body.eventTime !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(body.eventTime)) throw createHttpError(400,"eventTime must be an ISO timestamp");
  const eventTime = new Date(body.eventTime);
  if (
    !Number.isFinite(eventTime.getTime()) ||
    eventTime.getTime() > Date.now() + 60000
  )
    throw createHttpError(400, "eventTime must be a valid past timestamp");
  const attributes: Row = {};
  for (const [key, value] of Object.entries(body.attributes ?? {})) {
    if (!schema.fields.includes(key))
      throw createHttpError(
        400,
        `Attribute ${key} is not in the approved event schema`,
      );
    if (typeof value === "number") numeric(value, key, 0, 1e12);
    else if (typeof value !== "string" || value.length > 120)
      throw createHttpError(400, `Invalid ${key}`);
    attributes[key] = value;
  }
  const deduplicationKey = str(body.deduplicationKey, "deduplicationKey");
  const values = {
    userId,
    domain: d,
    entityType: schema.entityType,
    entityId: str(body.entityId, "entityId"),
    eventType: body.eventType,
    eventTime: eventTime.toISOString(),
    recordedAt: now(),
    schemaVersion: 1,
    attributes,
    deduplicationKey,
  };
  const existing = await LifeEvent.findOne({
    where: { userId, deduplicationKey },
    transaction,
  });
  if (existing) {
    const old = plain(existing);
    if (
      old.entityId !== values.entityId ||
      old.eventType !== values.eventType ||
      JSON.stringify(old.attributes) !== JSON.stringify(attributes)
    )
      throw createHttpError(
        409,
        "Event key already used with different content",
      );
    return old;
  }
  return plain(await LifeEvent.create(values, { transaction }));
}
export async function ingest(userId: string, body: Row) {
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    return recordEvent(userId, body, transaction);
  });
}
export async function events(userId: string) {
  const enabled = await enabledDomains(userId);
  return plain(
    await LifeEvent.findAll({
      where: { userId, domain: { [Op.in]: enabled } },
      order: [
        ["recordedAt", "ASC"],
        ["id", "ASC"],
      ],
    }),
  ) as Event[];
}
export async function importSources(userId: string) {
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const enabled = await enabledDomains(userId, transaction);
    let imported = 0;
    if (enabled.includes("money"))
      for (const r of await models.MoneyTransaction.findAll({
        where: { userId },
        transaction,
      })) {
        const a = plain(r);
        const attributes = {
          amount: Number(a.amount),
          currency: a.currency,
          semanticType: a.semanticType,
          occurredOn: a.occurredOn,
        };
        const key = `money:${a.id}:${a.updatedAt}`;
        if (
          await LifeEvent.findOne({
            where: { userId, deduplicationKey: key },
            transaction,
          })
        )
          continue;
        await recordEvent(
          userId,
          {
            domain: "money",
            entityType: "transaction",
            entityId: a.id,
            eventType: "TRANSACTION_RECORDED",
            eventTime: `${a.occurredOn}T00:00:00Z`,
            schemaVersion: 1,
            deduplicationKey: key,
            attributes,
          },
          transaction,
        );
        imported++;
      }
    if (enabled.includes("maintenance"))
      for (const r of await models.MaintenanceOccurrence.findAll({
        where: { userId },
        transaction,
      })) {
        const a = plain(r),
          key = `maintenance:${a.id}`;
        if (
          await LifeEvent.findOne({
            where: { userId, deduplicationKey: key },
            transaction,
          })
        )
          continue;
        const attrs: Row = { action: a.action, itemId: a.itemId };
        if (a.durationMinutes != null)
          attrs.durationMinutes = Number(a.durationMinutes);
        await recordEvent(
          userId,
          {
            domain: "maintenance",
            entityType: "maintenance",
            entityId: a.id,
            eventType: a.action === "completed" ? "COMPLETED" : "DEFERRED",
            eventTime: a.createdAt ?? now(),
            schemaVersion: 1,
            deduplicationKey: key,
            attributes: attrs,
          },
          transaction,
        );
        imported++;
      }
    await audit(
      userId,
      "sources_imported",
      null,
      { imported, recordedAt: now() },
      transaction,
    );
    return { imported };
  });
}
export async function createProjection(userId: string, body: Row) {
  const d = domain(body.domain);
  const allowed: Row = {
    "money-run-rate": ["money"],
    "learning-pace": ["learning"],
    workload: ["productivity", "maintenance"],
    adherence: ["fitness"],
  };
  if (!allowed[body.template]?.includes(d))
    throw createHttpError(400, "Projection template does not match domain");
  const result = project(body);
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    await requireConsent(userId, d, transaction);
    return plain(
      await ArtifactRecord.create(
        {
          userId,
          domain: d,
          kind: "projection",
          generatedAt: now(),
          dataThrough: null,
          payload: {
            ...result,
            title: body.name ? str(body.name, "name", 100) : body.template,
            template: body.template,
            formulaVersion: "projection-v1",
            readiness: "user_assumptions",
            source: "User supplied assumptions; no source records changed",
            uncertainty: "Deterministic scenario; not a learned prediction",
            saved: body.save === true,
          },
        },
        { transaction },
      ),
    );
  });
}
export async function listArtifacts(userId: string, query: Row = {}) {
  const enabled = await enabledDomains(userId);
  const where: Row = { userId, domain: { [Op.in]: enabled } };
  if (query.kind) where.kind = str(query.kind, "kind");
  if (query.domain) {
    const d = domain(query.domain);
    await requireConsent(userId, d);
    where.domain = d;
  }
  return plain(
    await ArtifactRecord.findAll({
      where,
      order: [["generatedAt", "DESC"]],
      limit: 500,
    }),
  );
}
export async function getArtifact(userId: string, id: string) {
  if(!/^[0-9a-f-]{36}$/i.test(id)) throw createHttpError(404,"Intelligence artifact not found");
  const r = await ArtifactRecord.findOne({ where: { userId, id } });
  if (!r) throw createHttpError(404, "Intelligence artifact not found");
  await requireConsent(userId, String(r.get("domain")));
  return plain(r);
}
export async function feedback(userId: string, id: string, body: Row) {
  if (
    ![
      "helpful",
      "not_helpful",
      "incorrect_data",
      "dismissed",
      "accepted",
    ].includes(body.response)
  )
    throw createHttpError(400, "Invalid feedback response");
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const a = await getArtifact(userId, id);
    await ArtifactRecord.create(
      {
        userId,
        domain: a.domain,
        kind: "feedback",
        generatedAt: now(),
        payload: {
          artifactId: id,
          response: body.response,
          note: typeof body.note === "string" ? body.note.slice(0, 1000) : null,
          groundTruth: false,
        },
      },
      { transaction },
    );
    if (a.kind === "recommendation")
      await ArtifactRecord.update(
        { state: body.response },
        { where: { userId, id }, transaction },
      );
    await audit(
      userId,
      "feedback_recorded",
      id,
      { response: body.response },
      transaction,
    );
    return { ok: true };
  });
}
export async function versions(userId: string) {
  const ds = await enabledDomains(userId);
  const ids = DEFINITIONS.filter((d) => ds.includes(d.domain)).map((d) => d.id);
  return plain(
    await ModelVersion.findAll({
      where: { userId, definitionId: { [Op.in]: ids } },
      order: [["createdAt", "DESC"]],
    }),
  );
}
export async function train(userId: string, body: Row) {
  if (body.definitionId !== "FIN-01")
    throw createHttpError(
      409,
      "This definition does not yet have an eligible supervised dataset builder",
    );
  const currency = str(body.currency ?? "INR", "currency", 3);
  if (!/^[A-Z]{3}$/.test(currency))
    throw createHttpError(400, "Invalid currency");
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    await requireConsent(userId, "money", transaction);
    const es = await events(userId);
    const gate = readiness(es, ["money"], now(), currency)[0];
    if (gate.state !== "ready_for_validation")
      throw createHttpError(409, gate.reason);
    const payload = trainFinance(es, now(), currency);
    const v = await ModelVersion.create(
      { userId, definitionId: "FIN-01", stage: "candidate", payload },
      { transaction },
    );
    await audit(
      userId,
      "training_completed",
      String(v.get("id")),
      { validation: payload.validation },
      transaction,
    );
    return plain(v);
  });
}
export async function transition(userId: string, id: string, body: Row) {
  if (!["champion", "retired", "shadow"].includes(body.stage))
    throw createHttpError(400, "Invalid registry stage");
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const v = await ModelVersion.findOne({
      where: { id, userId },
      transaction,
    });
    if (!v) throw createHttpError(404, "Model version not found");
    const p = v.get("payload") as Row;
    const def = DEFINITIONS.find((d) => d.id === v.get("definitionId"));
    if (!def) throw createHttpError(409, "Unknown model definition");
    await requireConsent(userId, def.domain, transaction);
    if (body.stage === "champion") {
      if (
        p.validation !== "passed" ||
        !p.gates ||
        !Object.values(p.gates).every((x) => x === true) ||
        Date.now() - new Date(p.trainedAt).getTime() > 90 * 86400000
      )
        throw createHttpError(
          409,
          "Promotion blocked by validation or freshness gates",
        );
      const champions = await ModelVersion.findAll({
        where: {
          userId,
          definitionId: v.get("definitionId"),
          stage: "champion",
        },
        transaction,
      });
      for (const old of champions)
        if ((old.get("payload") as Row).currency === p.currency)
          await old.update({ stage: "shadow" }, { transaction });
    }
    const before = v.get("stage");
    await v.update({ stage: body.stage }, { transaction });
    await audit(
      userId,
      "model_stage_changed",
      id,
      { before, after: body.stage },
      transaction,
    );
    return plain(v);
  });
}
export async function predict(userId: string, body: Row) {
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    await requireConsent(userId, "money", transaction);
    const currency = str(body.currency ?? "INR", "currency", 3),
      vs = await versions(userId);
    const v = vs.find(
      (r: Row) => r.stage === "champion" && r.payload.currency === currency,
    );
    if (
      !v ||
      Date.now() - new Date(v.payload.trainedAt).getTime() > 90 * 86400000
    )
      throw createHttpError(
        409,
        "No fresh validated champion. Use a deterministic projection.",
      );
    const es = await events(userId);
    const through = es.filter((e) => e.domain === "money").at(-1)?.recordedAt;
    if (!through || Date.now() - new Date(through).getTime() > 7 * 86400000)
      throw createHttpError(
        409,
        "Source data is stale. Refresh sources or use a projection.",
      );
    const generatedAt = now(),
      month = generatedAt.slice(0, 7),
      spend = monthlySpend(es, generatedAt, currency),
      actual = spend.find((r) => r.month === month)?.value ?? 0;
    const p = v.payload,
      value = median(spend.filter(r => r.month < month).slice(-6).map(r => r.value)),
      lower = Math.max(0, value - p.parameters.width),
      upper = value + p.parameters.width;
    if (actual > upper) throw createHttpError(409, "Recorded spending is outside the validated range. Use the run-rate projection and review the model.");
    const payload = {
      title: "Month-end spend forecast",
      definitionId: "FIN-01",
      value: round(value),
      lower: round(lower),
      upper: round(upper),
      unit: currency,
      horizon: month,
      modelVersion: v.id,
      featureSetVersion: p.featureSetVersion,
      baseline: spend.filter((r) => r.month < month).at(-1)?.value ?? null,
      readiness: "validated",
      uncertainty: `${Math.round(p.metrics.coverage * 100)}% measured holdout coverage; ${p.metrics.holdoutSamples} samples`,
      featureSnapshot: {
        featureTime: generatedAt,
        featureSetVersion: p.featureSetVersion,
        actualToDate: actual,
        recentMonthTotals: spend.filter(r => r.month < month).slice(-6),
        sourceTimestamps: [through],
      },
      explanation: [
        "Median spending across the six most recent complete observed months.",
        "Coverage is evaluated on chronological month-start forecasts; within-month accuracy may differ.",
        "Patterns are associations, not causes.",
      ],
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
    };
    const r = await ArtifactRecord.create(
      {
        userId,
        domain: "money",
        kind: "prediction",
        generatedAt,
        dataThrough: through,
        payload,
      },
      { transaction },
    );
    await audit(
      userId,
      "prediction_generated",
      String(r.get("id")),
      { modelVersion: v.id },
      transaction,
    );
    return plain(r);
  });
}
export async function resolveOutcome(userId: string, id: string, body: Row) {
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const a = await getArtifact(userId, id);
    if (a.kind !== "prediction")
      throw createHttpError(400, "Only predictions have outcomes");
    if (a.payload.horizon >= now().slice(0, 7))
      throw createHttpError(409, "Prediction horizon has not ended");
    if (a.payload.outcome)
      throw createHttpError(409, "Outcome already resolved");
    const actual = numeric(body.actual, "actual");
    const outcome = {
      actual,
      resolvedAt: now(),
      source: "manual",
      reason: str(body.reason, "resolution reason", 500),
      absoluteError: round(Math.abs(actual - a.payload.value)),
      covered: actual >= a.payload.lower && actual <= a.payload.upper,
    };
    await ArtifactRecord.update(
      { payload: { ...a.payload, outcome } },
      { where: { id, userId }, transaction },
    );
    await audit(
      userId,
      "outcome_resolved",
      id,
      { source: "manual", actual },
      transaction,
    );
    return outcome;
  });
}
export async function recommend(userId: string, body: Row) {
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const a = await getArtifact(userId, str(body.artifactId, "artifactId"));
    if (a.kind !== "projection" || a.payload.template !== "workload")
      throw createHttpError(400, "Select a workload projection");
    if (a.payload.value <= 0)
      throw createHttpError(409, "This projection is within capacity");
    const payload = {
      title: "Review workload before committing",
      rationale: `The scenario exceeds capacity by ${a.payload.value} minutes.`,
      facts: [a.payload.assumptions],
      artifactIds: [a.id],
      usesML: false,
      ruleVersion: "capacity-v1",
      options: [
        "Increase available capacity if feasible",
        "Review optional work in the owning planner",
      ],
      constraints: [
        "Keep hard deadlines and appointments",
        "Do not change source records without domain validation",
      ],
      expiresAt: new Date(Date.now() + 86400000).toISOString(),
      action: {
        type: "open_domain",
        path: a.domain === "maintenance" ? "/maintenance" : "/routine",
      },
    };
    return plain(
      await ArtifactRecord.create(
        {
          userId,
          domain: a.domain,
          kind: "recommendation",
          generatedAt: now(),
          dataThrough: a.dataThrough,
          payload,
        },
        { transaction },
      ),
    );
  });
}
export async function preferences(userId: string, body?: Row) {
  const defaults = {
    notifications: false,
    materialChangePercent: 20,
    quietStart: 22,
    quietEnd: 8,
    retentionDays: 365,
    explanations: true,
  };
  if (!body)
    return {
      ...defaults,
      ...plain(
        (await Preference.findOne({ where: { userId } }))?.get("payload") ?? {},
      ),
    };
  const p: Row = { ...defaults, ...body };
  if (
    typeof p.notifications !== "boolean" ||
    typeof p.explanations !== "boolean"
  )
    throw createHttpError(400, "Preferences must be boolean");
  numeric(p.materialChangePercent, "materialChangePercent", 5, 100);
  numeric(p.quietStart, "quietStart", 0, 23);
  numeric(p.quietEnd, "quietEnd", 0, 23);
  numeric(p.retentionDays, "retentionDays", 30, 3650);
  const payload = Object.fromEntries(
    Object.keys(defaults).map((k) => [k, p[k]]),
  );
  await sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    const [r] = await Preference.findOrCreate({
      where: { userId },
      defaults: { payload },
      transaction,
    });
    await r.update({ payload }, { transaction });
    await audit(
      userId,
      "preferences_changed",
      String(r.get("id")),
      payload,
      transaction,
    );
  });
  return payload;
}
export async function exportData(userId: string) {
  return {
    exportedAt: now(),
    scope: "derived intelligence only",
    consents: await consents(userId),
    events: plain(await LifeEvent.findAll({where:{userId},order:[["recordedAt","ASC"]]})),
    artifacts: plain(await ArtifactRecord.findAll({where:{userId},order:[["generatedAt","ASC"]]})),
    models: plain(await ModelVersion.findAll({where:{userId}})),
    preferences: await preferences(userId),
  };
}
export async function deleteData(userId: string, body: Row) {
  if (body.confirmation !== "DELETE INTELLIGENCE")
    throw createHttpError(400, "Type DELETE INTELLIGENCE to confirm");
  return sequelize.transaction(async (transaction) => {
    await lock(userId, transaction);
    for (const m of [ArtifactRecord, ModelVersion, LifeEvent, Preference])
      await m.destroy({ where: { userId }, transaction });
    await Consent.update(
      { enabled: false, updatedAt: now() },
      { where: { userId }, transaction },
    );
    await Audit.destroy({ where: { userId }, transaction });
    await audit(
      userId,
      "intelligence_deleted",
      null,
      {
        scope:
          "all derived artifacts; processing disabled; core records preserved",
      },
      transaction,
    );
    return { deleted: true };
  });
}
export async function summary(userId: string) {
  const [enabled, es, artifacts, vs, prefs] = await Promise.all([
    enabledDomains(userId),
    events(userId),
    listArtifacts(userId),
    versions(userId),
    preferences(userId),
  ]);
  const predictions = artifacts.filter((a: Row) => a.kind === "prediction"),
    resolved = predictions.filter((a: Row) => a.payload.outcome);
  return {
    generatedAt: now(),
    enabledDomains: enabled,
    readiness: readiness(es, enabled, now()),
    counts: {
      events: es.length,
      projections: artifacts.filter((a: Row) => a.kind === "projection").length,
      predictions: predictions.length,
      recommendations: artifacts.filter(
        (a: Row) => a.kind === "recommendation" && a.state === "active",
      ).length,
      resolved: resolved.length,
    },
    artifacts: artifacts.filter((a: Row) =>
      ["projection", "prediction", "recommendation"].includes(a.kind),
    ),
    versions: vs,
    preferences: prefs,
    sourceStatus: [
      { domain: "money", owned: true },
      { domain: "maintenance", owned: true },
      { domain: "productivity", owned: false },
      { domain: "learning", owned: false },
      { domain: "fitness", owned: false },
    ],
    quality: resolved.length
      ? {
          sampleCount: resolved.length,
          mae: round(
            resolved.reduce(
              (s: number, a: Row) => s + a.payload.outcome.absoluteError,
              0,
            ) / resolved.length,
          ),
          scope:
            "Resolved FIN-01 outcomes; do not compare different currencies",
        }
      : null,
  };
}
export async function diagnostics(userId: string) {
  const [s, es, audits] = await Promise.all([
    summary(userId),
    events(userId),
    Audit.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      limit: 500,
    }),
  ]);
  return {
    ...s,
    events: es.slice(-500).reverse(),
    audit: plain(audits),
    schemas: EVENT_SCHEMAS,
    contracts: AGENT_CONTRACTS,
    definitions: DEFINITIONS,
  };
}
