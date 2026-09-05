import { createHash } from "node:crypto";
import { DEFINITIONS, type Event } from "./contracts.js";
import { createHttpError } from "../../utils/httpError.js";
const DAY = 86400000;
export const median = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length
    ? (s[Math.floor((s.length - 1) / 2)] + s[Math.ceil((s.length - 1) / 2)]) / 2
    : 0;
};
export const round = (n: number) => Math.round(n * 100) / 100;
export function numeric(value: unknown, name: string, min = 0, max = 1e9) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  )
    throw createHttpError(
      400,
      `${name} must be a number from ${min} to ${max}`,
    );
  return value;
}
export function atCutoff(events: Event[], cutoff: string) {
  const time = new Date(cutoff).getTime();
  return events
    .filter(
      (e) =>
        new Date(e.eventTime).getTime() <= time &&
        new Date(e.recordedAt).getTime() <= time,
    )
    .sort(
      (a, b) =>
        a.recordedAt.localeCompare(b.recordedAt) ||
        (a.sequence && b.sequence
          ? BigInt(a.sequence) < BigInt(b.sequence)
            ? -1
            : BigInt(a.sequence) > BigInt(b.sequence)
              ? 1
              : 0
          : a.id.localeCompare(b.id)),
    );
}
export function project(input: Record<string, any>) {
  const type = input.template;
  const a = input.assumptions ?? {};
  if (type === "money-run-rate") {
    const currency = a.currency ?? "INR";
    if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency))
      throw createHttpError(
        400,
        "currency must be a three-letter uppercase code",
      );
    const spent = numeric(a.spent, "spent"),
      elapsedDays = numeric(a.elapsedDays, "elapsedDays", 1, 31),
      periodDays = numeric(a.periodDays, "periodDays", elapsedDays, 31),
      remainingCommitments = numeric(
        a.remainingCommitments ?? 0,
        "remainingCommitments",
      );
    return {
      value: round((spent / elapsedDays) * periodDays + remainingCommitments),
      unit: currency,
      assumptions: { spent, elapsedDays, periodDays, remainingCommitments },
      formula:
        "spent / elapsedDays × periodDays + additional remaining commitments",
      caveat:
        "Additional commitments must exclude spending already represented in the run rate.",
      horizon: `${periodDays - elapsedDays} remaining days`,
    };
  }
  if (type === "learning-pace") {
    const remainingUnits = numeric(a.remainingUnits, "remainingUnits"),
      unitsPerWeek = numeric(a.unitsPerWeek, "unitsPerWeek", 0.01);
    return {
      value: round(remainingUnits / unitsPerWeek),
      unit: "weeks",
      assumptions: { remainingUnits, unitsPerWeek },
      formula: "remainingUnits / unitsPerWeek",
      horizon: "completion at assumed pace",
    };
  }
  if (type === "workload") {
    const plannedMinutes = numeric(a.plannedMinutes, "plannedMinutes"),
      capacityMinutes = numeric(a.capacityMinutes, "capacityMinutes", 1, 10080);
    return {
      value: round(plannedMinutes - capacityMinutes),
      unit: "minutes over capacity",
      assumptions: { plannedMinutes, capacityMinutes },
      formula: "plannedMinutes − capacityMinutes",
      horizon: "planned week",
    };
  }
  if (type === "adherence") {
    const completed = numeric(a.completed, "completed"),
      planned = numeric(a.planned, "planned", 1);
    numeric(completed, "completed", 0, planned);
    return {
      value: round((completed / planned) * 100),
      unit: "% observed adherence",
      assumptions: { completed, planned },
      formula: "completed / planned × 100",
      horizon: "recorded period only",
    };
  }
  throw createHttpError(400, "Unknown projection template");
}
export function monthlySpend(
  events: Event[],
  cutoff: string,
  currency: string,
) {
  const latest = new Map<string, Event>();
  for (const e of atCutoff(events, cutoff).filter((e) => e.domain === "money"))
    latest.set(e.entityId, e);
  const months = new Map<string, number>();
  for (const e of latest.values()) {
    const a = e.attributes;
    if (
      e.eventType === "TRANSACTION_DELETED" ||
      a.currency !== currency ||
      !["expense", "fee", "refund"].includes(a.semanticType)
    )
      continue;
    const month = String(a.occurredOn).slice(0, 7);
    months.set(
      month,
      (months.get(month) ?? 0) +
        Number(a.amount) * (a.semanticType === "refund" ? -1 : 1),
    );
  }
  return [...months]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value: round(Math.max(0, value)) }));
}
// Each monthly target is reconstructed from records known at the END of that month.
// Imported/backdated transactions cannot become historical training labels retroactively.
export function financeDataset(
  events: Event[],
  cutoff: string,
  currency: string,
) {
  const months = [
    ...new Set(
      events
        .filter((e) => e.domain === "money")
        .map((e) => String(e.attributes.occurredOn).slice(0, 7)),
    ),
  ]
    .filter((m) => /^\d{4}-\d{2}$/.test(m) && m < cutoff.slice(0, 7))
    .sort();
  return months.flatMap((month) => {
    const end = new Date(`${month}-01T00:00:00Z`);
    end.setUTCMonth(end.getUTCMonth() + 1);
    end.setTime(end.getTime() - 1);
    const row = monthlySpend(events, end.toISOString(), currency).find(
      (r) => r.month === month,
    );
    return row ? [row] : [];
  });
}
export function readiness(
  events: Event[],
  enabled: string[],
  now: string,
  currency = "INR",
) {
  return DEFINITIONS.map((d) => {
    const es = atCutoff(events, now).filter((e) => e.domain === d.domain);
    const days = es.length
      ? Math.floor(
          (new Date(now).getTime() -
            Math.min(...es.map((e) => new Date(e.recordedAt).getTime()))) /
            DAY,
        )
      : 0;
    const labels =
      d.id === "FIN-01" ? financeDataset(es, now, currency).length : 0;
    const state = !enabled.includes(d.domain)
      ? "consent_required"
      : !es.length
        ? "no_history"
        : labels < d.minimumLabels || days < d.minimumDays
          ? "insufficient_history"
          : "ready_for_validation";
    return {
      ...d,
      policyVersion: "readiness-v1",
      events: es.length,
      labels,
      historyDays: days,
      state,
      fallback:
        d.domain === "learning"
          ? "learning-pace"
          : d.domain === "money"
            ? "money-run-rate"
            : "workload",
      reason: !enabled.includes(d.domain)
        ? "Enable this domain to begin processing."
        : d.id !== "FIN-01"
          ? "Observed transitions are available; supervised target resolution is not yet enabled for this definition."
          : `${labels}/${d.minimumLabels} complete monthly labels; ${days}/${d.minimumDays} days of recorded history.`,
      dataThrough: es.at(-1)?.recordedAt ?? null,
    };
  });
}
export function trainFinance(
  events: Event[],
  cutoff: string,
  currency: string,
) {
  const rows = financeDataset(events, cutoff, currency);
  if (rows.length < 18)
    throw createHttpError(
      409,
      "At least 18 point-in-time monthly labels are required. Backfilled history cannot bypass this gate.",
    );
  const folds = rows.slice(6).map((row, i) => {
    const train = rows.slice(i, i + 6);
    const predicted = median(train.map((r) => r.value));
    const baseline = train.at(-1)!.value;
    return {
      trainFrom: train[0].month,
      trainThrough: train.at(-1)!.month,
      testMonth: row.month,
      actual: row.value,
      predicted,
      baseline,
      error: Math.abs(predicted - row.value),
      baselineError: Math.abs(baseline - row.value),
    };
  });
  const calibration = folds.slice(0, Math.floor(folds.length / 2));
  const holdout = folds.slice(calibration.length);
  const errors = calibration.map((f) => f.error).sort((a, b) => a - b);
  const width =
    errors[
      Math.min(errors.length - 1, Math.ceil((errors.length + 1) * 0.8) - 1)
    ];
  const mae = holdout.reduce((s, f) => s + f.error, 0) / holdout.length;
  const baselineMae =
    holdout.reduce((s, f) => s + f.baselineError, 0) / holdout.length;
  const coverage =
    holdout.filter(
      (f) =>
        f.actual >= Math.max(0, f.predicted - width) &&
        f.actual <= f.predicted + width,
    ).length / holdout.length;
  const lastTrainingMonth = new Date(`${rows.at(-1)!.month}-01T00:00:00Z`);
  const lastCompleteMonth = new Date(cutoff);
  lastCompleteMonth.setUTCDate(1);
  lastCompleteMonth.setUTCMonth(lastCompleteMonth.getUTCMonth()-1);
  const gates = {
    recentTrainingData: rows.at(-1)!.month === lastCompleteMonth.toISOString().slice(0,7),
    temporalHoldout: true,
    sufficientLabels: rows.length >= 18,
    beatsBaseline: mae < baselineMae,
    intervalCoverage: coverage >= 0.8,
    finiteMetrics: [mae, baselineMae, width, coverage].every(Number.isFinite),
  };
  return {
    definitionId: "FIN-01",
    algorithm: "rolling-median-v1",
    featureSetVersion: "monthly-spend-v1",
    seed: 0,
    currency,
    dataHash: createHash("sha256").update(JSON.stringify(rows)).digest("hex"),
    trainingWindow: [rows[0].month, rows.at(-1)!.month],
    trainedAt: cutoff,
    dataThrough: new Date(Date.UTC(lastTrainingMonth.getUTCFullYear(), lastTrainingMonth.getUTCMonth()+1,1)-1).toISOString(),
    parameters: { center: median(rows.slice(-6).map((r) => r.value)), width },
    metrics: {
      mae: round(mae),
      baselineMae: round(baselineMae),
      coverage,
      intervalWidth: round(width * 2),
      nominalCoverage: 0.8,
      holdoutSamples: holdout.length,
    },
    gates,
    folds,
    validation: Object.values(gates).every(Boolean) ? "passed" : "failed",
    limitation:
      "Small personal sample; interval coverage is measured on chronological holdout and is not a guarantee.",
  };
}

export function monitorEvents(events: Event[], cutoff: string) {
  const end = Date.parse(cutoff),
    currentStart = end - 30 * DAY,
    previousStart = end - 60 * DAY;
  const quality = [
    "money",
    "productivity",
    "learning",
    "maintenance",
    "fitness",
  ].map((domain) => {
    const rows = events.filter((e) => e.domain === domain);
    return {
      domain,
      events: rows.length,
      lateEvents: rows.filter(
        (e) => Date.parse(e.recordedAt) - Date.parse(e.eventTime) > DAY,
      ).length,
      invalidTimestamps: rows.filter(
        (e) =>
          !Number.isFinite(Date.parse(e.eventTime)) ||
          !Number.isFinite(Date.parse(e.recordedAt)) ||
          Date.parse(e.recordedAt) > end,
      ).length,
      dataThrough:
        rows
          .map((e) => e.recordedAt)
          .sort()
          .at(-1) ?? null,
      status: rows.length ? "observed" : "no_history",
    };
  });
  const currencies = [
    ...new Set(
      events
        .filter((e) => e.domain === "money")
        .map((e) => String(e.attributes.currency)),
    ),
  ];
  const drift = currencies.map((currency) => {
    const rows = events.filter(
      (e) =>
        e.domain === "money" &&
        e.attributes.currency === currency &&
        e.eventType !== "TRANSACTION_DELETED" &&
        Number.isFinite(Number(e.attributes.amount)),
    );
    const current = rows
      .filter(
        (e) =>
          Date.parse(e.recordedAt) > currentStart &&
          Date.parse(e.recordedAt) <= end,
      )
      .map((e) => Number(e.attributes.amount));
    const previous = rows
      .filter(
        (e) =>
          Date.parse(e.recordedAt) > previousStart &&
          Date.parse(e.recordedAt) <= currentStart,
      )
      .map((e) => Number(e.attributes.amount));
    if (current.length < 30 || previous.length < 30)
      return {
        currency,
        currentSamples: current.length,
        previousSamples: previous.length,
        state: "insufficient_samples",
        standardizedMeanShift: null,
      };
    const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;
    const baseline = mean(previous),
      sd = Math.sqrt(
        previous.reduce((s, x) => s + (x - baseline) ** 2, 0) / previous.length,
      );
    const shift =
      sd === 0 ? null : round(Math.abs(mean(current) - baseline) / sd);
    return {
      currency,
      currentSamples: current.length,
      previousSamples: previous.length,
      state:
        shift === null
          ? "constant_baseline"
          : shift > 1
            ? "review_shift"
            : "no_large_mean_shift",
      standardizedMeanShift: shift,
    };
  });
  return {
    quality,
    drift,
    window: "Latest 30 recorded days compared with preceding 30 days",
    driftDefinition:
      "Absolute difference in mean event amount divided by baseline standard deviation. Event distribution only; does not measure prediction correctness or cause automatic retraining.",
  };
}
