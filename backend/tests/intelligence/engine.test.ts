import test from "node:test";
import assert from "node:assert/strict";
import {
  atCutoff,
  project,
  monthlySpend,
  financeDataset,
  trainFinance,
  readiness,
} from "../../services/intelligence/engine.js";
import type { Event } from "../../services/intelligence/contracts.js";
const event = (overrides: Partial<Event> = {}): Event => ({
  id: "1",
  domain: "money",
  entityId: "t1",
  eventType: "TRANSACTION_RECORDED",
  eventTime: "2024-01-10T00:00:00Z",
  recordedAt: "2024-01-10T00:00:00Z",
  attributes: {
    amount: 100,
    currency: "INR",
    semanticType: "expense",
    occurredOn: "2024-01-10",
  },
  ...overrides,
});
test("both occurrence and availability timestamps gate features", () => {
  assert.equal(
    atCutoff(
      [
        event({ recordedAt: "2025-01-01T00:00:00Z" }),
        event({ eventTime: "2025-01-01T00:00:00Z" }),
      ],
      "2024-02-01T00:00:00Z",
    ).length,
    0,
  );
});
test("projections are reproducible and reject invalid denominators", () => {
  const input = {
    template: "money-run-rate",
    assumptions: { spent: 100, elapsedDays: 10, periodDays: 30 },
  };
  assert.deepEqual(project(input), project(input));
  assert.equal(project(input).value, 300);
  assert.throws(() =>
    project({
      template: "learning-pace",
      assumptions: { remainingUnits: 2, unitsPerWeek: 0 },
    }),
  );
  assert.throws(() =>
    project({
      template: "adherence",
      assumptions: { completed: 3, planned: 2 },
    }),
  );
});
test("finance does not mix currencies, transfers, refunds, or deleted records", () => {
  const es = [
    event(),
    event({
      id: "2",
      entityId: "t2",
      attributes: {
        amount: 80,
        currency: "USD",
        semanticType: "expense",
        occurredOn: "2024-01-10",
      },
    }),
    event({
      id: "3",
      entityId: "t3",
      attributes: {
        amount: 20,
        currency: "INR",
        semanticType: "refund",
        occurredOn: "2024-01-10",
      },
    }),
    event({
      id: "4",
      entityId: "t4",
      attributes: {
        amount: 900,
        currency: "INR",
        semanticType: "transfer",
        occurredOn: "2024-01-10",
      },
    }),
  ];
  assert.equal(monthlySpend(es, "2024-02-01T00:00:00Z", "INR")[0].value, 80);
  assert.equal(
    monthlySpend(
      [
        ...es,
        event({
          id: "5",
          recordedAt: "2024-01-11T00:00:00Z",
          eventType: "TRANSACTION_DELETED",
        }),
      ],
      "2024-02-01T00:00:00Z",
      "INR",
    )[0].value,
    0,
  );
});
test("backfill cannot retroactively create a historical label", () => {
  assert.equal(
    financeDataset(
      [event({ recordedAt: "2025-01-01T00:00:00Z" })],
      "2025-02-01T00:00:00Z",
      "INR",
    ).length,
    0,
  );
});
test("readiness never exposes probabilities without consent or labels", () => {
  assert.equal(
    readiness([event()], [], "2025-01-01T00:00:00Z")[0].state,
    "consent_required",
  );
  assert.equal(
    readiness([event()], ["money"], "2025-01-01T00:00:00Z")[0].state,
    "insufficient_history",
  );
  assert.throws(() => trainFinance([event()], "2025-01-01T00:00:00Z", "INR"));
});
test("temporal validation windows never overlap future targets", () => {
  const es = Array.from({ length: 24 }, (_, i) => {
    const date = new Date(Date.UTC(2022, i, 10)).toISOString();
    return event({
      id: String(i),
      entityId: String(i),
      eventTime: date,
      recordedAt: date,
      attributes: {
        amount: 100 + (i % 3) * 10,
        currency: "INR",
        semanticType: "expense",
        occurredOn: date.slice(0, 10),
      },
    });
  });
  const v = trainFinance(es, "2025-01-01T00:00:00Z", "INR");
  assert.ok(v.folds.every((f) => f.trainThrough < f.testMonth));
  assert.equal(
    v.dataHash,
    trainFinance(es, "2025-01-01T00:00:00Z", "INR").dataHash,
  );
  assert.ok(v.metrics.holdoutSamples > 0);
  assert.equal(
    v.validation,
    Object.values(v.gates).every(Boolean) ? "passed" : "failed",
  );
});
