export type ProgressionSet = {
  sessionId: string;
  date: string;
  setType: string;
  reps: number;
  load: number;
  rir: number | null;
  techniqueQuality: string;
  painScore: number;
  restSeconds: number | null;
};

export type Prescription = {
  repMin: number;
  repMax: number;
  targetRir: number;
  targetSets: number;
  restSeconds: number;
  increment: number;
};

export type ProgressionDecision = {
  action: 'insufficient_data' | 'increase_load' | 'add_reps' | 'maintain' | 'extend_rest' | 'recalibrate' | 'hold_for_safety' | 'review_recovery';
  recommendedLoad: number | null;
  confidence: 'low' | 'moderate' | 'high';
  reasonCodes: string[];
  explanation: string;
};

const dayDistance = (newer: string, older: string) => Math.floor(
  (new Date(`${newer}T12:00:00Z`).getTime() - new Date(`${older}T12:00:00Z`).getTime()) / 86_400_000,
);

export function decideProgression(sets: ProgressionSet[], prescription: Prescription): ProgressionDecision {
  const working = sets.filter((set) => set.setType === 'working').sort((a, b) => b.date.localeCompare(a.date));
  if (!working.length) {
    return { action: 'insufficient_data', recommendedLoad: null, confidence: 'low', reasonCodes: ['NO_COMPARABLE_SETS'], explanation: 'Log the first comparable working sets before LifeOS changes the prescription.' };
  }

  const latestDate = working[0].date;
  const latest = working.filter((set) => set.date === latestDate);
  const latestLoad = latest[0].load;

  if (latest.some((set) => set.painScore > 0 || set.techniqueQuality === 'poor')) {
    return { action: 'hold_for_safety', recommendedLoad: latestLoad, confidence: 'high', reasonCodes: ['PAIN_OR_TECHNIQUE_FLAG'], explanation: 'Do not progress this exercise while pain or technique breakdown is recorded. Modify or stop the movement and reassess.' };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (dayDistance(today, latestDate) >= 21) {
    return { action: 'recalibrate', recommendedLoad: Math.max(0, latestLoad - prescription.increment), confidence: 'high', reasonCodes: ['LONG_TRAINING_GAP'], explanation: 'This exercise has not been performed recently. Recalibrate conservatively instead of restoring the old load automatically.' };
  }

  const sessions = [...new Set(working.map((set) => set.sessionId))].slice(0, 2);
  const exposures = sessions.map((sessionId) => working.filter((set) => set.sessionId === sessionId));
  const twoTopExposures = exposures.length >= 2 && exposures.every((exposure) =>
    exposure.length >= prescription.targetSets
    && exposure.every((set) => set.reps >= prescription.repMax && (set.rir === null || set.rir >= Math.max(0, prescription.targetRir - 1))),
  );

  if (twoTopExposures) {
    return { action: 'increase_load', recommendedLoad: latestLoad + prescription.increment, confidence: 'high', reasonCodes: ['TOP_RANGE_REPEATED', 'TECHNIQUE_ACCEPTABLE', 'NO_PAIN'], explanation: `Add the smallest available increment. You reached the top of the rep range across two comparable exposures without a safety flag.` };
  }

  const repDrop = latest.length > 1 ? latest[0].reps - latest[latest.length - 1].reps : 0;
  const restTooShort = latest.some((set) => set.restSeconds !== null && set.restSeconds < prescription.restSeconds * 0.75);
  if (repDrop >= 3 && restTooShort) {
    return { action: 'extend_rest', recommendedLoad: latestLoad, confidence: 'moderate', reasonCodes: ['LARGE_REP_DROP', 'REST_BELOW_TARGET'], explanation: 'Keep the load and take the full rest interval before reducing the prescription.' };
  }

  if (latest.every((set) => set.reps >= prescription.repMin)) {
    return { action: 'add_reps', recommendedLoad: latestLoad, confidence: 'high', reasonCodes: ['WITHIN_REP_RANGE'], explanation: 'Keep the load and build repetitions toward the top of the range.' };
  }

  if (exposures.length >= 2 && exposures.every((exposure) => exposure.some((set) => set.reps < prescription.repMin))) {
    return { action: 'review_recovery', recommendedLoad: latestLoad, confidence: 'moderate', reasonCodes: ['REPEATED_TARGET_MISS'], explanation: 'Targets were missed repeatedly. Review fatigue, recovery, rest, and exercise fit before adding work.' };
  }

  return { action: 'maintain', recommendedLoad: latestLoad, confidence: 'moderate', reasonCodes: ['SINGLE_EXPOSURE_VARIATION'], explanation: 'Hold the current prescription and collect another comparable exposure.' };
}

export function estimateOneRepMax(load: number, reps: number) {
  if (load <= 0 || reps <= 0) return 0;
  return Math.round(load * (1 + Math.min(reps, 12) / 30) * 10) / 10;
}
