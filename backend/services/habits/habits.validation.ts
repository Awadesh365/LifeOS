import { createHttpError } from "../../utils/httpError.js";

// Dates are civil dates supplied by the client, never converted to UTC instants.
export function habitDate(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < "1900-01-01" ||
    value > "9999-12-31"
  ) {
    throw createHttpError(400, "Date must be a valid YYYY-MM-DD calendar date");
  }
  const parsed = new Date(`${value}T12:00:00Z`);
  if (
    !Number.isFinite(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw createHttpError(400, "Date must be a valid YYYY-MM-DD calendar date");
  }
  return value;
}

export function habitInput(input: unknown, partial = false) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw createHttpError(400, "Habit details are required");
  const body = input as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const [key, max, fallback] of [
    ["name", 80, ""],
    ["category", 40, "Personal"],
    ["icon", 32, "✓"],
  ] as const) {
    if (partial && body[key] === undefined) continue;
    const value = body[key] === undefined ? fallback : body[key];
    if (
      typeof value !== "string" ||
      !value.trim() ||
      value.trim().length > max
    ) {
      throw createHttpError(400, `${key} must contain 1–${max} characters`);
    }
    result[key] = value.trim();
  }
  if (!Object.keys(result).length)
    throw createHttpError(400, "Provide habit details to update");
  return result;
}

export function completionValue(value: unknown): boolean {
  if (typeof value !== "boolean")
    throw createHttpError(400, "done must be true or false");
  return value;
}

export function habitWeek(end: string) {
  habitDate(end);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(`${end}T12:00:00Z`);
    date.setUTCDate(date.getUTCDate() + i - 6);
    return date.toISOString().slice(0, 10);
  });
}
