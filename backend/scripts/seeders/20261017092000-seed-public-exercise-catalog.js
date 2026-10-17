'use strict';

const path = require('path');
const catalog = require(path.resolve(__dirname, '../../data/public-exercise-catalog.json'));
const sourceUrl = 'https://github.com/rthepen/workout-database';
const license = 'MIT';
const json = (value) => JSON.stringify(value);
const title = (value) => String(value || '').replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const muscleNames = {
  pectorals: 'chest', latissimus_dorsi: 'lats', rhomboids: 'mid_back', biceps_brachii: 'biceps',
  triceps_brachii: 'triceps', gluteus_maximus: 'glutes', glutes: 'glutes', rectus_abdominis: 'abs',
  transverse_abdominis: 'abs', obliques: 'abs', erector_spinae: 'erectors', deltoids: 'shoulders',
  anterior_deltoid: 'anterior_deltoid', posterior_deltoid: 'posterior_deltoid',
  trapezius: 'traps', cardiovascular_system: 'cardio',
};
const equipmentNames = {
  dumbbells: 'dumbbell', resistance_band: 'band', resistance_bands: 'band', squat_rack: 'rack',
  smith_machine: 'machine', cable_machine: 'cable', bodyweight: 'bodyweight',
};
const movementFor = (name) => {
  const value = name.toLowerCase();
  if (/squat|lunge|step[- ]?up|leg press/.test(value)) return 'squat';
  if (/deadlift|hinge|hip thrust|glute bridge|good morning/.test(value)) return 'hip_hinge';
  if (/row|reverse fly|face pull/.test(value)) return 'horizontal_pull';
  if (/pull[- ]?up|chin[- ]?up|pulldown/.test(value)) return 'vertical_pull';
  if (/overhead press|shoulder press|push press/.test(value)) return 'vertical_push';
  if (/bench press|push[- ]?up|chest press|dip/.test(value)) return 'horizontal_push';
  if (/curl/.test(value)) return 'elbow_flexion';
  if (/triceps|pressdown|pushdown/.test(value)) return 'elbow_extension';
  if (/extension/.test(value)) return 'joint_extension';
  if (/raise|fly/.test(value)) return 'shoulder_abduction';
  if (/crunch|sit[- ]?up|rollout|plank/.test(value)) return 'trunk_flexion';
  return 'other';
};
const muscles = (items) => (Array.isArray(items) ? items : []).map((item) => muscleNames[item] || item).filter((item, index, all) => all.indexOf(item) === index);
const getVideos = (item) => (item.media?.videos || [])
  .filter((video) => /^[A-Za-z0-9_-]{6,20}$/.test(video.youtube_id || ''))
  .sort((a, b) => (a.priority || 99) - (b.priority || 99))
  .slice(0, 4)
  .map((video) => ({ youtube_id: video.youtube_id, type: video.type || 'video', start_seconds: Number(video.start_seconds) || 0, channel: String(video.channel || '').slice(0, 120), duration_seconds: Number(video.duration_seconds) || null }));
const records = catalog.map((item) => {
  const name = item.exercise_name?.en || item.id.replace(/_/g, ' ');
  const instructions = (item.instructions?.en || []).filter((step) => typeof step === 'string' && step.trim()).slice(0, 12);
  const cues = (item.form_cues?.en || []).filter((cue) => typeof cue === 'string' && cue.trim());
  const material = item.material?.id || (typeof item.material === 'string' ? item.material : '');
  const materialName = item.material?.name?.en || title(material);
  const equipment = [equipmentNames[material] || material].filter(Boolean);
  const primary = muscles(item.target_muscles?.primary);
  const secondary = muscles(item.target_muscles?.secondary).filter((muscle) => !primary.includes(muscle));
  const classification = item.attributes?.mechanics === 'isolation' ? 'isolation' : 'compound';
  const difficulty = ['beginner', 'intermediate', 'advanced'].includes(item.attributes?.difficulty) ? item.attributes.difficulty : 'beginner';
  const cue = cues[0] || instructions[0] || 'Use a controlled range that remains comfortable and repeatable.';
  const videos = getVideos(item);
  return {
    id: `public_${item.id}`,
    name,
    aliases: json(item.aliases?.en || []),
    classification,
    movement_pattern: movementFor(name),
    primary_muscles: json(primary),
    secondary_muscles: json(secondary),
    equipment: json(equipment),
    difficulty,
    setup_steps: json([`Prepare ${materialName.toLowerCase()} and take a stable starting position.`]),
    execution_steps: json(instructions.length ? instructions : [cue]),
    coaching_cue: cue,
    common_faults: json([]),
    safety_notes: json(['Stop if you experience sharp pain, instability, numbness, or radiating symptoms.']),
    evidence_summary: `Exercise name, instructions, and demo references are from the public workout-database dataset. This is a reference catalog, not clinical or evidence grading. Dataset source: ${sourceUrl}.`,
    evidence_confidence: 'reference_only',
    default_rest_seconds: classification === 'compound' ? 120 : 90,
    load_unit: equipment.includes('bodyweight') ? 'bodyweight' : 'kg',
    search_terms: json([name.toLowerCase(), item.category?.en || '', materialName, ...primary, ...secondary].filter(Boolean)),
    demo_videos: json(videos),
    source: sourceUrl,
    license,
  };
});

const q = (value) => `"${String(value).replace(/"/g, '""')}"`;
async function insertChunk(queryInterface, rows) {
  const columns = Object.keys(rows[0]);
  const replacements = [];
  const tuples = rows.map((row) => {
    columns.forEach((column) => replacements.push(row[column]));
    return `(${columns.map(() => '?').join(', ')})`;
  });
  const updates = columns.filter((column) => column !== 'id');
  await queryInterface.sequelize.query(
    `INSERT INTO ${q('exercises')} (${columns.map(q).join(', ')}) VALUES ${tuples.join(', ')} ON CONFLICT (${q('id')}) DO UPDATE SET ${updates.map((column) => `${q(column)} = EXCLUDED.${q(column)}`).join(', ')}`,
    { replacements },
  );
}

module.exports = {
  async up(queryInterface) {
    for (let start = 0; start < records.length; start += 100) {
      await insertChunk(queryInterface, records.slice(start, start + 100));
    }
  },
  async down() { return Promise.resolve(); },
};
