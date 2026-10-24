import { describe, expect, it } from "vitest";
import { localHabitDate, shiftHabitDate } from "./date";

describe("habit civil dates", () => {
  it("keeps the local calendar date instead of converting through UTC", () => {
    const local = new Date(2026, 8, 8, 0, 1);
    expect(localHabitDate(local)).toBe("2026-09-08");
  });
  it("moves through leap days and year boundaries without skipping a day", () => {
    expect(shiftHabitDate("2024-03-01", -1)).toBe("2024-02-29");
    expect(shiftHabitDate("2026-01-01", -1)).toBe("2025-12-31");
    expect(shiftHabitDate("2026-03-08", 1)).toBe("2026-03-09");
  });
});
