import { Op } from 'sequelize';
import { models, sequelize } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';
import { shortId } from '../../utils/id.js';
import { decideProgression, estimateOneRepMax, type ProgressionSet } from './progression.js';

const asNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asArray = (value: unknown): string[] => Array.isArray(value) ? value.map(String) : [];
const titleCase = (value: string) => value.split('_').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');

const exerciseInclude = { model: models.Exercise, as: 'exercise' };
const workoutInclude = {
  model: models.ProgramWorkout,
  as: 'workouts',
  include: [{ model: models.ProgramExercise, as: 'exercises', include: [exerciseInclude] }],
};

export async function getProfile() {
  return models.TrainingProfile.findByPk('default', { raw: true });
}

export async function updateProfile(input: Record<string, unknown>) {
  const allowedGoals = ['general_fitness', 'hypertrophy', 'strength', 'mixed'];
  const allowedExperience = ['beginner', 'intermediate', 'advanced'];
  const goal = String(input.goal || 'mixed');
  const experience = String(input.experience || 'beginner');
  if (!allowedGoals.includes(goal) || !allowedExperience.includes(experience)) {
    throw createHttpError(400, 'Invalid training goal or experience level');
  }
  const values = {
    id: 'default',
    goal,
    experience,
    daysPerWeek: Math.min(7, Math.max(1, asNumber(input.daysPerWeek, 3))),
    minutesPerSession: Math.min(240, Math.max(15, asNumber(input.minutesPerSession, 60))),
    loadUnit: input.loadUnit === 'lb' ? 'lb' : 'kg',
    smallestIncrement: Math.max(0.25, asNumber(input.smallestIncrement, 2.5)),
    availableEquipment: asArray(input.availableEquipment),
    priorityMuscles: asArray(input.priorityMuscles).slice(0, 6),
    limitations: asArray(input.limitations),
    excludedExerciseIds: asArray(input.excludedExerciseIds),
    updatedAt: new Date(),
  };
  await models.TrainingProfile.upsert(values);
  return getProfile();
}

export async function listExercises(query: Record<string, unknown>) {
  const exercises = await models.Exercise.findAll({ order: [['name', 'ASC']], raw: true });
  const search = String(query.search || '').trim().toLowerCase();
  const muscle = String(query.muscle || '').trim().toLowerCase();
  const equipment = String(query.equipment || '').trim().toLowerCase();
  return exercises.filter((exercise: any) => {
    const searchable = [exercise.name, ...asArray(exercise.aliases), ...asArray(exercise.searchTerms)].join(' ').toLowerCase();
    return (!search || searchable.includes(search))
      && (!muscle || [...asArray(exercise.primaryMuscles), ...asArray(exercise.secondaryMuscles)].map((item) => item.toLowerCase()).includes(muscle))
      && (!equipment || asArray(exercise.equipment).map((item) => item.toLowerCase()).includes(equipment));
  }).map((exercise: any) => ({
    id: exercise.id,
    name: exercise.name,
    aliases: exercise.aliases,
    classification: exercise.classification,
    movementPattern: exercise.movementPattern,
    primaryMuscles: exercise.primaryMuscles,
    secondaryMuscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    coachingCue: exercise.coachingCue,
    evidenceConfidence: exercise.evidenceConfidence,
  }));
}

export async function getExercise(id: string) {
  const exercise = await models.Exercise.findByPk(id, {
    include: [{ model: models.ExerciseAlternative, as: 'alternatives', include: [{ model: models.Exercise, as: 'alternative' }] }],
  });
  if (!exercise) throw createHttpError(404, 'Exercise not found');
  return exercise.toJSON();
}

export async function listPrograms() {
  return models.TrainingProgram.findAll({ include: [workoutInclude], order: [['createdAt', 'ASC']] });
}

function programInput(input: Record<string, any>) {
  const name = String(input.name || '').trim().slice(0, 100);
  const goal = String(input.goal || 'general_fitness');
  const experience = String(input.experience || 'beginner');
  const workouts = Array.isArray(input.workouts) ? input.workouts : [];
  if (!name || !workouts.length || workouts.length > 7) throw createHttpError(400, 'A program needs a name and 1–7 workouts');
  if (!['general_fitness', 'hypertrophy', 'strength', 'mixed'].includes(goal) || !['beginner', 'intermediate', 'advanced'].includes(experience)) throw createHttpError(400, 'Invalid goal or experience');
  const normalized = workouts.map((workout: any, dayIndex: number) => {
    const exercises = Array.isArray(workout.exercises) ? workout.exercises : [];
    if (!String(workout.name || '').trim() || exercises.length < 1 || exercises.length > 12) throw createHttpError(400, 'Each workout needs a name and 1–12 exercises');
    return { name: String(workout.name).trim().slice(0, 100), description: String(workout.description || '').slice(0, 500), dayIndex, exercises: exercises.map((item: any, orderIndex: number) => ({
      exerciseId: String(item.exerciseId || ''), orderIndex,
      targetSets: Math.min(8, Math.max(1, Math.round(asNumber(item.targetSets, 3)))),
      repMin: Math.min(30, Math.max(1, Math.round(asNumber(item.repMin, 8)))),
      repMax: Math.min(30, Math.max(1, Math.round(asNumber(item.repMax, 12)))),
      targetRir: Math.min(5, Math.max(0, Math.round(asNumber(item.targetRir, 2)))),
      restSeconds: Math.min(600, Math.max(30, Math.round(asNumber(item.restSeconds, 120)))),
      setType: 'working', notes: String(item.notes || '').slice(0, 300),
    })) };
  });
  if (normalized.some((workout: any) => workout.exercises.some((item: any) => !item.exerciseId || item.repMin > item.repMax))) throw createHttpError(400, 'Exercise selections or rep ranges are invalid');
  return { name, description: String(input.description || '').slice(0, 1000), goal, experience, durationWeeks: Math.min(52, Math.max(1, Math.round(asNumber(input.durationWeeks, 8)))), daysPerWeek: normalized.length, workouts: normalized };
}

async function persistProgram(input: Record<string, any>, existingId?: string) {
  const value = programInput(input);
  const exerciseIds = [...new Set(value.workouts.flatMap((workout: any) => workout.exercises.map((item: any) => item.exerciseId)))];
  const known = await models.Exercise.findAll({ where: { id: exerciseIds }, attributes: ['id'], raw: true });
  if (known.length !== exerciseIds.length) throw createHttpError(400, 'One or more selected exercises do not exist');
  return sequelize.transaction(async (transaction: any) => {
    let program: any;
    if (existingId) {
      program = await models.TrainingProgram.findByPk(existingId, { transaction });
      if (!program) throw createHttpError(404, 'Training program not found');
      await program.update({ name: value.name, description: value.description, goal: value.goal, experience: value.experience, durationWeeks: value.durationWeeks, daysPerWeek: value.daysPerWeek }, { transaction });
      const currentWorkouts = await models.ProgramWorkout.findAll({ where: { programId: existingId }, attributes: ['id'], raw: true, transaction });
      const workoutIds = currentWorkouts.map((row: any) => row.id);
      if (workoutIds.length) {
        await models.ProgramExercise.destroy({ where: { programWorkoutId: workoutIds }, transaction });
        await models.ProgramWorkout.destroy({ where: { id: workoutIds }, transaction });
      }
    } else {
      program = await models.TrainingProgram.create({ id: shortId(), ...value, isTemplate: false, isActive: false }, { transaction });
    }
    for (const workout of value.workouts) {
      const created = await models.ProgramWorkout.create({ id: shortId(), programId: program.get('id'), name: workout.name, description: workout.description, dayIndex: workout.dayIndex }, { transaction });
      for (const item of workout.exercises) await models.ProgramExercise.create({ id: shortId(), programWorkoutId: created.get('id'), ...item }, { transaction });
    }
    return String(program.get('id'));
  }).then((id: string) => models.TrainingProgram.findByPk(id, { include: [workoutInclude] }));
}

export async function createProgram(input: Record<string, any>) { return persistProgram(input); }
export async function updateProgram(id: string, input: Record<string, any>) { return persistProgram(input, id); }

export async function duplicateProgram(id: string) {
  const source: any = await models.TrainingProgram.findByPk(id, { include: [workoutInclude] });
  if (!source) throw createHttpError(404, 'Training program not found');
  const value = source.toJSON();
  return createProgram({ ...value, id: undefined, name: `${value.name} copy`, workouts: value.workouts.map((workout: any) => ({ ...workout, exercises: workout.exercises.map((item: any) => ({ ...item, exerciseId: item.exerciseId })) })) });
}

export async function generateProgram(input: Record<string, any>) {
  const profile: any = await getProfile();
  const goal = ['general_fitness', 'hypertrophy', 'strength', 'mixed'].includes(String(input.goal)) ? String(input.goal) : String(profile?.goal || 'general_fitness');
  const experience = ['beginner', 'intermediate', 'advanced'].includes(String(input.experience)) ? String(input.experience) : String(profile?.experience || 'beginner');
  const days = Math.min(6, Math.max(1, Math.round(asNumber(input.daysPerWeek, Number(profile?.daysPerWeek) || 3))));
  const equipment = asArray(input.availableEquipment ?? profile?.availableEquipment).map((item) => item.toLowerCase());
  const priorities = asArray(input.priorityMuscles ?? profile?.priorityMuscles).map((item) => item.toLowerCase());
  const all: any[] = await models.Exercise.findAll({ raw: true, order: [['name', 'ASC']] });
  const candidates = all.filter((exercise) => !asArray(profile?.excludedExerciseIds).includes(exercise.id)
    && (!equipment.length || asArray(exercise.equipment).every((item) => equipment.includes(item.toLowerCase()) || item.toLowerCase() === 'bodyweight')));
  if (candidates.length < 4) throw createHttpError(422, 'The exercise library has too few movements for this equipment selection');
  const split = days === 1 ? ['Full body'] : days === 2 ? ['Full body A', 'Full body B'] : days === 3 ? ['Full body A', 'Full body B', 'Full body C'] : days === 4 ? ['Upper A', 'Lower A', 'Upper B', 'Lower B'] : ['Push', 'Pull', 'Legs', 'Upper', 'Lower', 'Full body'];
  const splitPatterns = days <= 3
    ? [
      ['squat', 'horizontal_push', 'horizontal_pull', 'hip_hinge', 'vertical_pull', 'elbow_extension'],
      ['hip_hinge', 'vertical_push', 'vertical_pull', 'knee_flexion', 'horizontal_push', 'elbow_flexion'],
      ['squat', 'horizontal_pull', 'horizontal_push', 'hip_hinge', 'shoulder_abduction', 'elbow_extension'],
    ]
    : split.map((name) => name.startsWith('Upper') ? ['horizontal_push', 'horizontal_pull', 'vertical_push', 'vertical_pull', 'elbow_flexion', 'elbow_extension'] : ['squat', 'hip_hinge', 'knee_flexion', 'shoulder_abduction']);
  const usedByDay = new Set<string>();
  const workouts = split.map((name, dayIndex) => {
    const chosen: any[] = [];
    const dayPatterns = splitPatterns[dayIndex] || splitPatterns[splitPatterns.length - 1];
    for (const pattern of dayPatterns) {
      const ranked = candidates.filter((exercise) => exercise.movementPattern === pattern && !usedByDay.has(`${dayIndex}:${exercise.id}`)).sort((a, b) => {
        const aPriority = asArray(a.primaryMuscles).some((muscle) => priorities.includes(muscle.toLowerCase())) ? 1 : 0;
        const bPriority = asArray(b.primaryMuscles).some((muscle) => priorities.includes(muscle.toLowerCase())) ? 1 : 0;
        const aCompound = a.classification === 'compound' ? 1 : 0;
        const bCompound = b.classification === 'compound' ? 1 : 0;
        return (bPriority - aPriority) || (bCompound - aCompound) || a.name.localeCompare(b.name);
      });
      const selected = ranked.find((exercise) => !chosen.some((item) => item.exerciseId === exercise.id));
      if (selected && chosen.length < (Number(profile?.minutesPerSession) <= 35 ? 4 : 6)) chosen.push({ exerciseId: selected.id, targetSets: experience === 'beginner' ? 3 : 4, repMin: goal === 'strength' ? 4 : 8, repMax: goal === 'strength' ? 6 : 12, targetRir: 2, restSeconds: goal === 'strength' ? 180 : 120 });
    }
    const maxExercises = Number(profile?.minutesPerSession) <= 35 ? 4 : 6;
    const remaining = candidates.filter((exercise) => !chosen.some((item) => item.exerciseId === exercise.id)).sort((a, b) => {
      const aPriority = asArray(a.primaryMuscles).filter((muscle) => priorities.includes(muscle.toLowerCase())).length;
      const bPriority = asArray(b.primaryMuscles).filter((muscle) => priorities.includes(muscle.toLowerCase())).length;
      return bPriority - aPriority || a.name.localeCompare(b.name);
    });
    for (const selected of remaining) {
      if (chosen.length >= maxExercises) break;
      chosen.push({ exerciseId: selected.id, targetSets: experience === 'beginner' ? 3 : 4, repMin: goal === 'strength' ? 4 : 8, repMax: goal === 'strength' ? 6 : 12, targetRir: 2, restSeconds: goal === 'strength' ? 180 : 120 });
    }
    chosen.forEach((item) => usedByDay.add(`${dayIndex}:${item.exerciseId}`));
    return { name, description: 'Generated from your goal, schedule, available equipment, experience, and muscle priorities. Review and edit before activating.', exercises: chosen };
  });
  return { name: `${titleCase(goal)} · ${days}-day plan`, description: 'A starting template generated from your training context. Adjust it to your preferences before use.', goal, experience, durationWeeks: 8, daysPerWeek: days, workouts };
}

export async function activateProgram(id: string) {
  const program = await models.TrainingProgram.findByPk(id);
  if (!program) throw createHttpError(404, 'Training program not found');
  await models.TrainingProgram.update({ isActive: false }, { where: {} });
  await program.update({ isActive: true });
  return listPrograms();
}

async function getActiveProgram() {
  return models.TrainingProgram.findOne({ where: { isActive: true }, include: [workoutInclude] });
}

export async function getToday(date: string) {
  const program = await getActiveProgram();
  if (!program) return { program: null, workout: null, activeSession: null };
  const json: any = program.toJSON();
  json.workouts.sort((a: any, b: any) => a.dayIndex - b.dayIndex);
  json.workouts.forEach((workout: any) => workout.exercises.sort((a: any, b: any) => a.orderIndex - b.orderIndex));

  const activeSession = await models.WorkoutSession.findOne({
    where: { date, status: 'in_progress' },
    include: [{ model: models.PerformedSet, as: 'sets', include: [exerciseInclude] }],
    order: [['startedAt', 'DESC']],
  });
  const completedCount = await models.WorkoutSession.count({ where: { status: 'completed', programWorkoutId: { [Op.ne]: null } } });
  const selectedWorkout = activeSession
    ? json.workouts.find((workout: any) => workout.id === activeSession.get('programWorkoutId'))
    : json.workouts[completedCount % json.workouts.length];

  const previousByExercise: Record<string, any[]> = {};
  for (const item of selectedWorkout.exercises) {
    const previous = await models.PerformedSet.findAll({
      where: { exerciseId: item.exerciseId, setType: 'working' },
      include: [{ model: models.WorkoutSession, as: 'session', where: { status: 'completed' }, attributes: ['date'] }],
      order: [['completedAt', 'DESC']], limit: item.targetSets, raw: true, nest: true,
    });
    previousByExercise[item.exerciseId] = previous;
  }
  return { program: { id: json.id, name: json.name, goal: json.goal }, workout: selectedWorkout, activeSession, previousByExercise };
}

export async function startSession(input: Record<string, unknown>) {
  const programWorkoutId = String(input.programWorkoutId || '');
  const workout = await models.ProgramWorkout.findByPk(programWorkoutId);
  if (!workout) throw createHttpError(404, 'Program workout not found');
  const date = String(input.date || new Date().toISOString().slice(0, 10));
  const existing = await models.WorkoutSession.findOne({ where: { date, status: 'in_progress' } });
  if (existing) return existing.toJSON();
  const created = await models.WorkoutSession.create({ id: shortId(), programWorkoutId, name: workout.get('name'), date, status: 'in_progress', startedAt: new Date() });
  return created.toJSON();
}

export async function logSet(sessionId: string, input: Record<string, unknown>) {
  const session = await models.WorkoutSession.findByPk(sessionId);
  if (!session || session.get('status') !== 'in_progress') throw createHttpError(409, 'An active workout session is required');
  const programExerciseId = String(input.programExerciseId || '');
  const prescription = await models.ProgramExercise.findByPk(programExerciseId);
  if (!prescription) throw createHttpError(404, 'Program exercise not found');
  const prescribedExerciseId = String(prescription.get('exerciseId'));
  const requestedExerciseId = String(input.exerciseId || prescribedExerciseId);
  if (requestedExerciseId !== prescribedExerciseId) {
    const approvedAlternative = await models.ExerciseAlternative.findOne({
      where: { exerciseId: prescribedExerciseId, alternativeExerciseId: requestedExerciseId },
    });
    if (!approvedAlternative) throw createHttpError(400, 'The requested substitution does not preserve an approved training intent');
  }
  const reps = asNumber(input.actualReps, -1);
  const load = asNumber(input.actualLoad, -1);
  const rir = input.actualRir === null || input.actualRir === '' || input.actualRir === undefined ? null : asNumber(input.actualRir, -1);
  const painScore = Math.round(asNumber(input.painScore, 0));
  if (!Number.isInteger(reps) || reps < 0 || reps > 200 || load < 0 || (rir !== null && (rir < 0 || rir > 10)) || painScore < 0 || painScore > 10) {
    throw createHttpError(400, 'Set values are outside accepted ranges');
  }
  const setNumber = await models.PerformedSet.count({ where: { workoutSessionId: sessionId, programExerciseId } }) + 1;
  const created = await models.PerformedSet.create({
    id: shortId(), workoutSessionId: sessionId, programExerciseId,
    exerciseId: requestedExerciseId, setNumber,
    setType: input.setType || prescription.get('setType') || 'working',
    targetRepsMin: prescription.get('repMin'), targetRepsMax: prescription.get('repMax'),
    actualReps: reps, targetLoad: input.targetLoad ?? null, actualLoad: load,
    targetRir: prescription.get('targetRir'), actualRir: rir,
    restSeconds: input.restSeconds === undefined ? null : Math.max(0, asNumber(input.restSeconds)),
    techniqueQuality: ['good', 'acceptable', 'poor'].includes(String(input.techniqueQuality)) ? input.techniqueQuality : 'good',
    painScore, painLocation: input.painLocation || null, painNotes: input.painNotes || null,
    source: 'manual', completedAt: new Date(),
  });
  const safety = painScore >= 7
    ? { level: 'urgent', message: 'Stop this exercise. Sudden or severe pain, neurological symptoms, instability, chest pressure, dizziness, or unusual breathlessness needs appropriate medical assessment.' }
    : painScore > 0
      ? { level: 'caution', message: 'Stop the painful set. Reduce load or range only if a comfortable option exists; persistent or worsening pain should be professionally assessed.' }
      : null;
  return { set: created.toJSON(), safety };
}

export async function updatePerformedSet(id: string, input: Record<string, unknown>) {
  const set = await models.PerformedSet.findByPk(id);
  if (!set) throw createHttpError(404, 'Performed set not found');
  const current: any = set.toJSON();
  const reps = asNumber(input.actualReps ?? current.actualReps, -1);
  const load = asNumber(input.actualLoad ?? current.actualLoad, -1);
  const rirValue = input.actualRir === undefined ? current.actualRir : input.actualRir;
  const rir = rirValue === null || rirValue === '' ? null : asNumber(rirValue, -1);
  const painScore = Math.round(asNumber(input.painScore ?? current.painScore, 0));
  const techniqueQuality = String(input.techniqueQuality ?? current.techniqueQuality);
  if (!Number.isInteger(reps) || reps < 0 || reps > 200 || load < 0 || (rir !== null && (rir < 0 || rir > 10)) || painScore < 0 || painScore > 10 || !['good', 'acceptable', 'poor'].includes(techniqueQuality)) throw createHttpError(400, 'Set values are outside accepted ranges');
  await set.update({ actualReps: reps, actualLoad: load, actualRir: rir, painScore, techniqueQuality, painLocation: input.painLocation === undefined ? current.painLocation : String(input.painLocation || '').slice(0, 120) });
  return set.toJSON();
}

export async function completeSession(id: string, input: Record<string, unknown>) {
  const session = await models.WorkoutSession.findByPk(id);
  if (!session) throw createHttpError(404, 'Workout session not found');
  await session.update({ status: 'completed', completedAt: new Date(), sessionRpe: input.sessionRpe ?? null, notes: input.notes ?? null });
  return session.toJSON();
}

export async function getExerciseHistory(exerciseId: string) {
  const exercise = await models.Exercise.findByPk(exerciseId);
  if (!exercise) throw createHttpError(404, 'Exercise not found');
  const sets = await models.PerformedSet.findAll({
    where: { exerciseId, setType: 'working' },
    include: [{ model: models.WorkoutSession, as: 'session', attributes: ['id', 'date', 'name', 'status'] }],
    order: [['completedAt', 'DESC']], limit: 100,
  });
  return sets.map((model: any) => {
    const row = model.toJSON();
    return { ...row, estimatedOneRepMax: estimateOneRepMax(asNumber(row.actualLoad), asNumber(row.actualReps)) };
  });
}

export async function getProgression(exerciseId: string, programExerciseId: string) {
  const [profile, prescription, history] = await Promise.all([
    getProfile(),
    models.ProgramExercise.findByPk(programExerciseId, { raw: true }),
    getExerciseHistory(exerciseId),
  ]);
  if (!prescription) throw createHttpError(404, 'Program prescription not found');
  const sets: ProgressionSet[] = history.map((row: any) => ({
    sessionId: row.workoutSessionId, date: row.session.date, setType: row.setType,
    reps: asNumber(row.actualReps), load: asNumber(row.actualLoad),
    rir: row.actualRir === null ? null : asNumber(row.actualRir), techniqueQuality: row.techniqueQuality,
    painScore: asNumber(row.painScore), restSeconds: row.restSeconds === null ? null : asNumber(row.restSeconds),
  }));
  return decideProgression(sets, {
    repMin: asNumber((prescription as any).repMin), repMax: asNumber((prescription as any).repMax),
    targetRir: asNumber((prescription as any).targetRir), targetSets: asNumber((prescription as any).targetSets),
    restSeconds: asNumber((prescription as any).restSeconds), increment: asNumber((profile as any)?.smallestIncrement, 2.5),
  });
}

export async function getReview(from: string, to: string) {
  const sessions = await models.WorkoutSession.findAll({
    where: { date: { [Op.between]: [from, to] } },
    include: [{ model: models.PerformedSet, as: 'sets', include: [exerciseInclude] }],
    order: [['date', 'ASC']],
  });
  const rows: any[] = sessions.map((session) => session.toJSON());
  const completed = rows.filter((session) => session.status === 'completed');
  const workingSets = completed.flatMap((session) => session.sets.filter((set: any) => set.setType === 'working'));
  const muscleSets: Record<string, number> = {};
  let bestE1rm = 0;
  let bestSet: any = null;
  workingSets.forEach((set: any) => {
    asArray(set.exercise?.primaryMuscles).forEach((muscle) => { muscleSets[muscle] = (muscleSets[muscle] || 0) + 1; });
    const e1rm = estimateOneRepMax(asNumber(set.actualLoad), asNumber(set.actualReps));
    if (e1rm > bestE1rm) { bestE1rm = e1rm; bestSet = set; }
  });
  const painFlags = workingSets.filter((set: any) => asNumber(set.painScore) > 0).length;
  return {
    from, to,
    sessionsPlanned: Math.max(completed.length, (await getProfile() as any)?.daysPerWeek || 0),
    sessionsCompleted: completed.length,
    workingSets: workingSets.length,
    muscleSets,
    painFlags,
    bestPerformance: bestSet ? { exercise: bestSet.exercise?.name, estimatedOneRepMax: bestE1rm, load: bestSet.actualLoad, reps: bestSet.actualReps } : null,
    sessions: rows,
  };
}
