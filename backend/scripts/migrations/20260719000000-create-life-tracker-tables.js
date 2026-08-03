'use strict';

const stringId = (Sequelize) => ({
  type: Sequelize.STRING,
  primaryKey: true
});

const nullableString = (Sequelize) => ({ type: Sequelize.STRING });
const nullableText = (Sequelize) => ({ type: Sequelize.TEXT });
const requiredString = (Sequelize) => ({ type: Sequelize.STRING, allowNull: false });
const requiredText = (Sequelize) => ({ type: Sequelize.TEXT, allowNull: false });
const nullableFloat = (Sequelize) => ({ type: Sequelize.FLOAT });
const requiredFloat = (Sequelize) => ({ type: Sequelize.FLOAT, allowNull: false });

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('habits', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      icon: requiredString(Sequelize),
      category: requiredString(Sequelize)
    });

    await queryInterface.createTable('habit_logs', {
      id: stringId(Sequelize),
      habit_id: {
        type: Sequelize.STRING,
        references: { model: 'habits', key: 'id' },
        onDelete: 'CASCADE'
      },
      date: requiredString(Sequelize),
      done: { type: Sequelize.BOOLEAN, defaultValue: false }
    });

    await queryInterface.createTable('routines', {
      id: stringId(Sequelize),
      type: requiredString(Sequelize),
      time: requiredString(Sequelize),
      task: requiredString(Sequelize),
      icon: requiredString(Sequelize),
      duration: nullableString(Sequelize),
      note: nullableText(Sequelize),
      order_index: { type: Sequelize.INTEGER, allowNull: false }
    });

    await queryInterface.createTable('learning_sections', {
      id: stringId(Sequelize),
      title: requiredString(Sequelize),
      order_index: { type: Sequelize.INTEGER, allowNull: false }
    });

    await queryInterface.createTable('learning_items', {
      id: stringId(Sequelize),
      section_id: {
        type: Sequelize.STRING,
        references: { model: 'learning_sections', key: 'id' },
        onDelete: 'CASCADE'
      },
      topic: requiredString(Sequelize),
      date: nullableString(Sequelize),
      info: nullableText(Sequelize),
      source: nullableText(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'not_started' },
      order_index: { type: Sequelize.INTEGER, allowNull: false }
    });

    await queryInterface.createTable('goals', {
      id: stringId(Sequelize),
      title: requiredString(Sequelize),
      category: requiredString(Sequelize),
      icon: requiredString(Sequelize),
      target: requiredFloat(Sequelize),
      current: { type: Sequelize.FLOAT, defaultValue: 0 },
      unit: nullableString(Sequelize)
    });

    await queryInterface.createTable('milestones', {
      id: stringId(Sequelize),
      goal_id: {
        type: Sequelize.STRING,
        references: { model: 'goals', key: 'id' },
        onDelete: 'CASCADE'
      },
      label: requiredString(Sequelize),
      value: requiredFloat(Sequelize),
      done: { type: Sequelize.BOOLEAN, defaultValue: false },
      order_index: { type: Sequelize.INTEGER, allowNull: false }
    });

    await queryInterface.createTable('dreams', {
      id: stringId(Sequelize),
      text: requiredText(Sequelize),
      icon: requiredString(Sequelize),
      priority: requiredString(Sequelize),
      order_index: { type: Sequelize.INTEGER, allowNull: false }
    });

    await queryInterface.createTable('jobs', {
      id: stringId(Sequelize),
      company: requiredString(Sequelize),
      role: requiredString(Sequelize),
      date: nullableString(Sequelize),
      salary: nullableString(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'applied' },
      link: nullableText(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('health_logs', {
      id: stringId(Sequelize),
      date: requiredString(Sequelize),
      gym_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
      walk_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
      meditation_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
      sleep_hours: { type: Sequelize.FLOAT, defaultValue: 0 },
      sleep_quality: { type: Sequelize.INTEGER, defaultValue: 0 },
      water_liters: { type: Sequelize.FLOAT, defaultValue: 0 },
      diet_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      socialization_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
      mental_peace_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      mood_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('wealth_entries', {
      id: stringId(Sequelize),
      date: requiredString(Sequelize),
      type: requiredString(Sequelize),
      amount: requiredFloat(Sequelize),
      category: requiredString(Sequelize),
      account: nullableString(Sequelize),
      recurring: { type: Sequelize.BOOLEAN, defaultValue: false },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('investments', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      type: requiredString(Sequelize),
      monthly_amount: { type: Sequelize.FLOAT, defaultValue: 0 },
      invested_amount: { type: Sequelize.FLOAT, defaultValue: 0 },
      current_value: { type: Sequelize.FLOAT, defaultValue: 0 },
      start_date: nullableString(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('debts', {
      id: stringId(Sequelize),
      person_name: requiredString(Sequelize),
      total_amount: requiredFloat(Sequelize),
      paid_amount: { type: Sequelize.FLOAT, defaultValue: 0 },
      remaining_amount: requiredFloat(Sequelize),
      target_month: nullableString(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'active' },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('debt_payments', {
      id: stringId(Sequelize),
      debt_id: {
        type: Sequelize.STRING,
        references: { model: 'debts', key: 'id' },
        onDelete: 'CASCADE'
      },
      amount: requiredFloat(Sequelize),
      payment_date: requiredString(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('emergency_funds', {
      id: stringId(Sequelize),
      bank_name: requiredString(Sequelize),
      amount: requiredFloat(Sequelize),
      target_amount: { type: Sequelize.FLOAT, defaultValue: 100000 },
      type: { type: Sequelize.STRING, defaultValue: 'fd' },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('contacts', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      type: requiredString(Sequelize),
      priority: { type: Sequelize.STRING, defaultValue: 'medium' },
      last_contact_date: nullableString(Sequelize),
      next_follow_up_date: nullableString(Sequelize),
      circle_quality_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      discard_flag: { type: Sequelize.BOOLEAN, defaultValue: false },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('projects', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      description: nullableText(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'planned' },
      next_action: nullableText(Sequelize),
      start_date: nullableString(Sequelize),
      target_date: nullableString(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('relationships', {
      id: stringId(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'single' },
      partner_name: nullableString(Sequelize),
      since_date: nullableString(Sequelize),
      family_relationship_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('relatives', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      relation: requiredString(Sequelize),
      closeness_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      last_contact_date: nullableString(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('future_plans', {
      id: stringId(Sequelize),
      plan_type: requiredString(Sequelize),
      title: requiredString(Sequelize),
      target_date: nullableString(Sequelize),
      status: { type: Sequelize.STRING, defaultValue: 'planned' },
      budget: nullableFloat(Sequelize),
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('diet_logs', {
      id: stringId(Sequelize),
      date: requiredString(Sequelize),
      meal_type: requiredString(Sequelize),
      items: requiredText(Sequelize),
      protein: { type: Sequelize.FLOAT, defaultValue: 0 },
      calories: { type: Sequelize.FLOAT, defaultValue: 0 },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('supplements', {
      id: stringId(Sequelize),
      name: requiredString(Sequelize),
      quantity: { type: Sequelize.FLOAT, defaultValue: 0 },
      unit: { type: Sequelize.STRING, defaultValue: 'g' },
      daily_usage: { type: Sequelize.FLOAT, defaultValue: 0 },
      remaining_days: { type: Sequelize.FLOAT, defaultValue: 0 },
      notes: nullableText(Sequelize)
    });

    await queryInterface.createTable('career_entries', {
      id: stringId(Sequelize),
      company_name: requiredString(Sequelize),
      role_title: requiredString(Sequelize),
      start_date: nullableString(Sequelize),
      pay_amount: { type: Sequelize.FLOAT, defaultValue: 0 },
      company_health_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      manager_behavior_score: { type: Sequelize.INTEGER, defaultValue: 0 },
      work_environment_notes: nullableText(Sequelize),
      stay_leave_plan: { type: Sequelize.STRING, defaultValue: 'unsure' },
      target_exit_date: nullableString(Sequelize),
      notes: nullableText(Sequelize)
    });
  },

  async down(queryInterface) {
    const tables = [
      'career_entries',
      'supplements',
      'diet_logs',
      'future_plans',
      'relatives',
      'relationships',
      'projects',
      'contacts',
      'emergency_funds',
      'debt_payments',
      'debts',
      'investments',
      'wealth_entries',
      'health_logs',
      'jobs',
      'dreams',
      'milestones',
      'goals',
      'learning_items',
      'learning_sections',
      'routines',
      'habit_logs',
      'habits'
    ];

    for (const table of tables) {
      await queryInterface.dropTable(table);
    }
  }
};
