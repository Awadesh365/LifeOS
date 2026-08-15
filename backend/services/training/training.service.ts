import { Op } from 'sequelize';
import { models } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';
import { shortId } from '../../utils/id.js';
import { decideProgression, estimateOneRepMax, type ProgressionSet } from './progression.js';

const asNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const asArray = (value: unknown): string[] => Array.isArray(value) ? value.map(String) : [];

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
  });
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
