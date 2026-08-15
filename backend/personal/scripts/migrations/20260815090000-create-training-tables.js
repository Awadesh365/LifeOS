'use strict';

const id = (Sequelize) => ({ type: Sequelize.STRING, primaryKey: true });
const requiredString = (Sequelize) => ({ type: Sequelize.STRING, allowNull: false });
const jsonArray = (Sequelize) => ({ type: Sequelize.JSONB, allowNull: false, defaultValue: [] });

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('training_profiles', {
      id: id(Sequelize),
      goal: { type: Sequelize.STRING, allowNull: false, defaultValue: 'general_fitness' },
      experience: { type: Sequelize.STRING, allowNull: false, defaultValue: 'beginner' },
      days_per_week: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 3 },
      minutes_per_session: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 60 },
      load_unit: { type: Sequelize.STRING, allowNull: false, defaultValue: 'kg' },
      smallest_increment: { type: Sequelize.FLOAT, allowNull: false, defaultValue: 2.5 },
      available_equipment: jsonArray(Sequelize),
      limitations: jsonArray(Sequelize),
      excluded_exercise_ids: jsonArray(Sequelize),
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('exercises', {
      id: id(Sequelize),
      name: requiredString(Sequelize),
      aliases: jsonArray(Sequelize),
      classification: requiredString(Sequelize),
      movement_pattern: requiredString(Sequelize),
      primary_muscles: jsonArray(Sequelize),
      secondary_muscles: jsonArray(Sequelize),
      equipment: jsonArray(Sequelize),
      difficulty: { type: Sequelize.STRING, allowNull: false, defaultValue: 'beginner' },
      setup_steps: jsonArray(Sequelize),
      execution_steps: jsonArray(Sequelize),
      coaching_cue: { type: Sequelize.TEXT, allowNull: false },
      common_faults: jsonArray(Sequelize),
      safety_notes: jsonArray(Sequelize),
      evidence_summary: { type: Sequelize.TEXT, allowNull: false },
      evidence_confidence: { type: Sequelize.STRING, allowNull: false, defaultValue: 'moderate' },
      default_rest_seconds: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 120 },
      load_unit: { type: Sequelize.STRING, allowNull: false, defaultValue: 'kg' },
      search_terms: jsonArray(Sequelize)
    });

    await queryInterface.createTable('exercise_alternatives', {
      id: id(Sequelize),
      exercise_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'CASCADE' },
      alternative_exercise_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'CASCADE' },
      relationship: { type: Sequelize.STRING, allowNull: false, defaultValue: 'equivalent' },
      rationale: { type: Sequelize.TEXT, allowNull: false }
    });

    await queryInterface.createTable('training_programs', {
      id: id(Sequelize),
      name: requiredString(Sequelize),
      description: { type: Sequelize.TEXT },
      goal: requiredString(Sequelize),
      experience: requiredString(Sequelize),
      duration_weeks: { type: Sequelize.INTEGER, allowNull: false },
      days_per_week: { type: Sequelize.INTEGER, allowNull: false },
      is_template: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('program_workouts', {
      id: id(Sequelize),
      program_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'training_programs', key: 'id' }, onDelete: 'CASCADE' },
      name: requiredString(Sequelize),
      day_index: { type: Sequelize.INTEGER, allowNull: false },
      description: { type: Sequelize.TEXT }
    });

    await queryInterface.createTable('program_exercises', {
      id: id(Sequelize),
      program_workout_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'program_workouts', key: 'id' }, onDelete: 'CASCADE' },
      exercise_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'RESTRICT' },
      order_index: { type: Sequelize.INTEGER, allowNull: false },
      target_sets: { type: Sequelize.INTEGER, allowNull: false },
      rep_min: { type: Sequelize.INTEGER, allowNull: false },
      rep_max: { type: Sequelize.INTEGER, allowNull: false },
      target_rir: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 2 },
      rest_seconds: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 120 },
      set_type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'working' },
      notes: { type: Sequelize.TEXT }
    });

    await queryInterface.createTable('workout_sessions', {
      id: id(Sequelize),
      program_workout_id: { type: Sequelize.STRING, references: { model: 'program_workouts', key: 'id' }, onDelete: 'SET NULL' },
      name: requiredString(Sequelize),
      date: requiredString(Sequelize),
      status: { type: Sequelize.STRING, allowNull: false, defaultValue: 'in_progress' },
      started_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      completed_at: { type: Sequelize.DATE },
      session_rpe: { type: Sequelize.FLOAT },
      notes: { type: Sequelize.TEXT }
    });

    await queryInterface.createTable('performed_sets', {
      id: id(Sequelize),
      workout_session_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'workout_sessions', key: 'id' }, onDelete: 'CASCADE' },
      program_exercise_id: { type: Sequelize.STRING, references: { model: 'program_exercises', key: 'id' }, onDelete: 'SET NULL' },
      exercise_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'exercises', key: 'id' }, onDelete: 'RESTRICT' },
      set_number: { type: Sequelize.INTEGER, allowNull: false },
      set_type: { type: Sequelize.STRING, allowNull: false, defaultValue: 'working' },
      target_reps_min: { type: Sequelize.INTEGER },
      target_reps_max: { type: Sequelize.INTEGER },
      actual_reps: { type: Sequelize.INTEGER, allowNull: false },
      target_load: { type: Sequelize.FLOAT },
      actual_load: { type: Sequelize.FLOAT, allowNull: false },
      target_rir: { type: Sequelize.INTEGER },
      actual_rir: { type: Sequelize.INTEGER },
      rest_seconds: { type: Sequelize.INTEGER },
      technique_quality: { type: Sequelize.STRING, allowNull: false, defaultValue: 'good' },
      pain_score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      pain_location: { type: Sequelize.STRING },
      pain_notes: { type: Sequelize.TEXT },
      source: { type: Sequelize.STRING, allowNull: false, defaultValue: 'manual' },
      completed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('exercises', ['movement_pattern']);
    await queryInterface.addIndex('program_exercises', ['program_workout_id', 'order_index']);
    await queryInterface.addIndex('workout_sessions', ['date', 'status']);
    await queryInterface.addIndex('performed_sets', ['exercise_id', 'completed_at']);
  },

  async down(queryInterface) {
    for (const table of ['performed_sets', 'workout_sessions', 'program_exercises', 'program_workouts', 'training_programs', 'exercise_alternatives', 'exercises', 'training_profiles']) {
      await queryInterface.dropTable(table);
    }
  }
};
