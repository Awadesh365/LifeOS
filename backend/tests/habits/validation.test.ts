import assert from "node:assert/strict";
import test from "node:test";
import {
  completionValue,
  habitDate,
  habitInput,
  habitWeek,
} from "../../services/habits/habits.validation.js";

test("civil dates preserve leap days and reject rollover and malformed dates", () => {
  assert.equal(habitDate("2024-02-29"), "2024-02-29");
  for (const invalid of [
    "2025-02-29",
    "2026-04-31",
    "2026-13-01",
    "2026-2-01",
    "",
    null,
    ["2026-01-01"],
  ])
    assert.throws(() => habitDate(invalid));
  assert.deepEqual(habitWeek("2026-01-03"), [
    "2025-12-28",
    "2025-12-29",
    "2025-12-30",
    "2025-12-31",
    "2026-01-01",
    "2026-01-02",
    "2026-01-03",
  ]);
  assert.equal(habitWeek("2024-03-02")[4], "2024-02-29");
});
test("habit writes whitelist fields, normalize text and validate explicit completion", () => {
  assert.deepEqual(
    habitInput({ name: " Read ", id: "overwrite", done: true }),
    { name: "Read", category: "Personal", icon: "✓" },
  );
  assert.deepEqual(habitInput({ name: " Walk " }, true), { name: "Walk" });
  for (const invalid of [
    { name: "" },
    { name: "x".repeat(81) },
    { name: "Read", category: 3 },
    null,
    [],
  ])
    assert.throws(() => habitInput(invalid));
  assert.throws(() => habitInput({}, true));
  assert.equal(completionValue(false), false);
  assert.equal(completionValue(true), true);
  for (const value of ["false", 1, null, undefined])
    assert.throws(() => completionValue(value));
});
