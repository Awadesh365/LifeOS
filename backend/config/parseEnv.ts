export const parsePositiveIntegerEnv = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

export const parseNonNegativeIntegerEnv = (value: string | undefined, fallback: number): number => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : fallback;
};

export const assertMinNotGreaterThanMax = ({
  minName, minValue, maxName, maxValue,
}: { minName: string; minValue: number; maxName: string; maxValue: number }): void => {
  if (minValue > maxValue) {
    throw new Error(`${minName} (${minValue}) must not exceed ${maxName} (${maxValue})`);
  }
};

export const parseBool = (v: string | undefined): boolean =>
  String(v).trim().toLowerCase() === 'true';
