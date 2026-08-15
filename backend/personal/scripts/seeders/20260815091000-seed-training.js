'use strict';

const q = (value) => `"${String(value).replace(/"/g, '""')}"`;
const json = (value) => JSON.stringify(value);

const upsert = async (queryInterface, table, rows, updates) => {
  if (!rows.length) return;
  const columns = Object.keys(rows[0]);
  const replacements = [];
  const values = rows.map((row) => {
    columns.forEach((column) => replacements.push(row[column]));
    return `(${columns.map(() => '?').join(', ')})`;
  });
  const update = updates.length
    ? `DO UPDATE SET ${updates.map((column) => `${q(column)} = EXCLUDED.${q(column)}`).join(', ')}`
    : 'DO NOTHING';
  await queryInterface.sequelize.query(
    `INSERT INTO ${q(table)} (${columns.map(q).join(', ')}) VALUES ${values.join(', ')} ON CONFLICT ("id") ${update}`,
    { replacements },
  );
};

const makeExercise = (id, name, classification, movement, primary, secondary, equipment, cue, fault, rest = 120, difficulty = 'beginner') => ({
  id,
  name,
  aliases: json([]),
  classification,
  movement_pattern: movement,
  primary_muscles: json(primary),
  secondary_muscles: json(secondary),
  equipment: json(equipment),
  difficulty,
  setup_steps: json([
    'Adjust the equipment and starting position to a stable, comfortable setup.',
    'Use a repeatable range of motion and brace before beginning the repetition.',
  ]),
  execution_steps: json([
    'Move through the intended joint action under control.',
    'Finish the repetition without changing position to manufacture range.',
  ]),
  coaching_cue: cue,
  common_faults: json([{ fault, cue }]),
  safety_notes: json(['Stop for sharp or sudden pain, instability, numbness, or radiating symptoms.', 'Use only a controlled, pain-free range.']),
  evidence_summary: 'Resistance training is strongly supported; this exercise is recommended by intent, comfort, equipment, and progressability rather than a universal ranking.',
  evidence_confidence: 'principle_high_exercise_moderate',
  default_rest_seconds: rest,
  load_unit: equipment.includes('bodyweight') ? 'bodyweight' : 'kg',
  search_terms: json([name.toLowerCase(), movement, ...primary, ...equipment]),
});

const exercises = [
  makeExercise('barbell_bench_press', 'Barbell Bench Press', 'compound', 'horizontal_push', ['chest'], ['triceps', 'anterior_deltoid'], ['barbell', 'bench'], 'Control down; keep your upper back planted; press from a stable base.', 'Bouncing the bar or losing shoulder position', 180, 'intermediate'),
  makeExercise('machine_chest_press', 'Machine Chest Press', 'compound', 'horizontal_push', ['chest'], ['triceps', 'anterior_deltoid'], ['machine'], 'Set the seat so the pressing path feels natural through the shoulder.', 'Handle and shoulder path are poorly aligned', 150),
  makeExercise('push_up', 'Push-Up', 'compound', 'horizontal_push', ['chest'], ['triceps', 'anterior_deltoid', 'serratus'], ['bodyweight'], 'Move ribs and pelvis together as one unit.', 'Hips sag or the head reaches forward', 90),
  makeExercise('back_squat', 'Back Squat', 'compound', 'squat', ['quadriceps', 'glutes'], ['adductors', 'erectors'], ['barbell', 'rack'], 'Choose a stance you control; keep the load balanced over mid-foot.', 'Position changes under load', 180, 'intermediate'),
  makeExercise('leg_press', 'Leg Press', 'compound', 'squat', ['quadriceps', 'glutes'], ['adductors'], ['machine'], 'Stop before your pelvis rolls away from the pad.', 'Pelvis curls under at depth', 150),
  makeExercise('romanian_deadlift', 'Romanian Deadlift', 'compound', 'hip_hinge', ['hamstrings', 'glutes'], ['erectors'], ['barbell', 'dumbbell'], 'Push hips back; keep the load close; stop when position changes.', 'The hinge turns into a squat or lumbar position changes', 180, 'intermediate'),
  makeExercise('seated_leg_curl', 'Seated Leg Curl', 'isolation', 'knee_flexion', ['hamstrings'], [], ['machine'], 'Keep the pelvis quiet and curl through the knee.', 'Hips move to manufacture repetitions', 105),
  makeExercise('overhead_press', 'Overhead Press', 'compound', 'vertical_push', ['anterior_deltoid', 'lateral_deltoid'], ['triceps', 'upper_chest'], ['barbell', 'dumbbell'], 'Brace ribs over pelvis and press without leaning back.', 'Rib cage extends to finish the repetition', 180, 'intermediate'),
  makeExercise('dumbbell_lateral_raise', 'Dumbbell Lateral Raise', 'isolation', 'shoulder_abduction', ['lateral_deltoid'], ['upper_trapezius'], ['dumbbell'], 'Lead with the arm; stop before momentum takes over.', 'Swinging and shrugging dominate', 90),
  makeExercise('reverse_pec_deck', 'Reverse Pec Deck', 'isolation', 'horizontal_pull', ['posterior_deltoid'], ['mid_back'], ['machine'], 'Move the upper arm back without turning it into a shrug.', 'The repetition turns into a large scapular row', 90),
  makeExercise('lat_pulldown', 'Lat Pulldown', 'compound', 'vertical_pull', ['lats'], ['biceps', 'upper_back'], ['cable', 'machine'], 'Bring the elbows down and keep the torso angle deliberate.', 'Excessive lean or pulling behind the neck', 150),
  makeExercise('chest_supported_row', 'Chest-Supported Row', 'compound', 'horizontal_pull', ['mid_back', 'lats'], ['biceps', 'posterior_deltoid'], ['dumbbell', 'machine'], 'Drive elbows back without pulling shoulders toward your ears.', 'Shrugging every repetition', 150),
  makeExercise('assisted_pull_up', 'Assisted Pull-Up', 'compound', 'vertical_pull', ['lats', 'upper_back'], ['biceps', 'forearms'], ['machine', 'bodyweight'], 'Start under control and drive elbows toward your sides.', 'Kicking or shortening range', 150),
  makeExercise('cable_curl', 'Cable Curl', 'isolation', 'elbow_flexion', ['biceps'], ['forearms'], ['cable'], 'Keep the upper arm quiet and curl through the elbow.', 'Shoulder motion replaces elbow flexion', 90),
  makeExercise('hammer_curl', 'Hammer Curl', 'isolation', 'elbow_flexion', ['biceps', 'brachialis'], ['forearms'], ['dumbbell'], 'Keep wrists neutral and avoid swinging the torso.', 'Momentum moves the load', 90),
  makeExercise('triceps_pressdown', 'Triceps Pressdown', 'isolation', 'elbow_extension', ['triceps'], [], ['cable'], 'Pin the upper arms and extend through the elbow.', 'Shoulders rock forward and back', 90),
  makeExercise('overhead_triceps_extension', 'Overhead Triceps Extension', 'isolation', 'elbow_extension', ['triceps'], [], ['cable', 'dumbbell'], 'Keep upper arms stable and use a controlled elbow arc.', 'Rib flare and shoulder motion dominate', 90),
];

const alternatives = [
  ['bench_machine', 'barbell_bench_press', 'machine_chest_press', 'equivalent', 'Similar horizontal pressing intent with more external stability.'],
  ['bench_pushup', 'barbell_bench_press', 'push_up', 'regression', 'Maintains horizontal pressing when a barbell or spotter is unavailable.'],
  ['squat_legpress', 'back_squat', 'leg_press', 'equivalent', 'Trains knee and hip extension with less balance and skill demand.'],
  ['press_machine', 'overhead_press', 'machine_chest_press', 'alternative', 'A stable press when overhead work is not appropriate or available.'],
  ['pulldown_pullup', 'lat_pulldown', 'assisted_pull_up', 'equivalent', 'Maintains vertical-pull intent with a different loading method.'],
  ['row_pulldown', 'chest_supported_row', 'lat_pulldown', 'alternative', 'Preserves back training while shifting from horizontal to vertical pull.'],
].map(([id, exercise_id, alternative_exercise_id, relationship, rationale]) => ({ id, exercise_id, alternative_exercise_id, relationship, rationale }));

const workouts = [
  { id: 'beginner_a', program_id: 'beginner_foundation', name: 'Full Body A', day_index: 0, description: 'Repeatable full-body session emphasizing squat, press and vertical pull.' },
  { id: 'beginner_b', program_id: 'beginner_foundation', name: 'Full Body B', day_index: 1, description: 'Full-body variation emphasizing hinge, row and shoulder press.' },
];

const prescription = (id, workout, exercise, order, sets, min, max, rir, rest) => ({
  id, program_workout_id: workout, exercise_id: exercise, order_index: order,
  target_sets: sets, rep_min: min, rep_max: max, target_rir: rir, rest_seconds: rest,
  set_type: 'working', notes: null,
});

const programExercises = [
  prescription('a_squat', 'beginner_a', 'back_squat', 0, 2, 6, 10, 3, 180),
  prescription('a_press', 'beginner_a', 'machine_chest_press', 1, 2, 6, 10, 3, 150),
  prescription('a_pull', 'beginner_a', 'lat_pulldown', 2, 2, 8, 12, 3, 150),
  prescription('a_hinge', 'beginner_a', 'romanian_deadlift', 3, 2, 8, 12, 3, 180),
  prescription('a_lateral', 'beginner_a', 'dumbbell_lateral_raise', 4, 2, 10, 15, 2, 90),
  prescription('a_curl', 'beginner_a', 'cable_curl', 5, 2, 8, 15, 2, 90),
  prescription('a_triceps', 'beginner_a', 'triceps_pressdown', 6, 2, 8, 15, 2, 90),
  prescription('b_press', 'beginner_b', 'overhead_press', 0, 2, 8, 12, 3, 180),
  prescription('b_legs', 'beginner_b', 'leg_press', 1, 2, 8, 12, 3, 150),
  prescription('b_row', 'beginner_b', 'chest_supported_row', 2, 2, 8, 12, 3, 150),
  prescription('b_curl', 'beginner_b', 'seated_leg_curl', 3, 2, 8, 15, 2, 105),
  prescription('b_chest', 'beginner_b', 'push_up', 4, 2, 8, 15, 2, 90),
  prescription('b_biceps', 'beginner_b', 'hammer_curl', 5, 2, 8, 15, 2, 90),
  prescription('b_triceps', 'beginner_b', 'overhead_triceps_extension', 6, 2, 8, 15, 2, 90),
];

const exerciseColumns = Object.keys(exercises[0]).filter((column) => column !== 'id');

module.exports = {
  async up(queryInterface) {
    await upsert(queryInterface, 'training_profiles', [{
      id: 'default', goal: 'mixed', experience: 'beginner', days_per_week: 3,
      minutes_per_session: 60, load_unit: 'kg', smallest_increment: 2.5,
      available_equipment: json(['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bench', 'rack']),
      limitations: json([]), excluded_exercise_ids: json([]), updated_at: new Date(),
    }], ['goal', 'experience', 'days_per_week', 'minutes_per_session', 'load_unit', 'smallest_increment', 'available_equipment', 'limitations', 'excluded_exercise_ids', 'updated_at']);
    await upsert(queryInterface, 'exercises', exercises, exerciseColumns);
    await upsert(queryInterface, 'exercise_alternatives', alternatives, ['exercise_id', 'alternative_exercise_id', 'relationship', 'rationale']);
    await upsert(queryInterface, 'training_programs', [{
      id: 'beginner_foundation', name: 'Beginner Foundation',
      description: 'Six-week alternating full-body program. Build technique and comparable performance before adding complexity.',
      goal: 'mixed', experience: 'beginner', duration_weeks: 6, days_per_week: 3,
      is_template: true, is_active: true, created_at: new Date(),
    }], ['name', 'description', 'goal', 'experience', 'duration_weeks', 'days_per_week', 'is_template', 'is_active']);
    await upsert(queryInterface, 'program_workouts', workouts, ['program_id', 'name', 'day_index', 'description']);
    await upsert(queryInterface, 'program_exercises', programExercises, ['program_workout_id', 'exercise_id', 'order_index', 'target_sets', 'rep_min', 'rep_max', 'target_rir', 'rest_seconds', 'set_type', 'notes']);
  },
  async down() { return Promise.resolve(); },
};
