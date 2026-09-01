'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const id = { type: Sequelize.STRING, primaryKey: true };
    const userId = {
      type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE',
    };
    const createdAt = { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') };

    await queryInterface.createTable('maintenance_areas', {
      id,
      user_id: userId,
      parent_area_id: { type: Sequelize.STRING, allowNull: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      type: { type: Sequelize.STRING(40), allowNull: false },
      icon: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'home_repair_service' },
      standard: { type: Sequelize.TEXT },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_default: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: createdAt,
    });
    await queryInterface.addConstraint('maintenance_areas', { fields: ['parent_area_id'], type: 'foreign key', references: { table: 'maintenance_areas', field: 'id' }, onDelete: 'SET NULL' });
    await queryInterface.addIndex('maintenance_areas', ['user_id', 'type']);

    await queryInterface.createTable('maintenance_assets', {
      id,
      user_id: userId,
      area_id: { type: Sequelize.STRING, references: { model: 'maintenance_areas', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING(140), allowNull: false },
      category: { type: Sequelize.STRING(60), allowNull: false, defaultValue: 'other' },
      brand: { type: Sequelize.STRING(100) }, model: { type: Sequelize.STRING(100) },
      serial_number: { type: Sequelize.STRING(160) }, purchase_date: { type: Sequelize.STRING(10) },
      purchase_cost: { type: Sequelize.DECIMAL(12, 2) }, warranty_ends_at: { type: Sequelize.STRING(10) },
      location: { type: Sequelize.STRING(140) }, status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'active' },
      notes: { type: Sequelize.TEXT }, created_at: createdAt,
    });
    await queryInterface.addIndex('maintenance_assets', ['user_id', 'status']);

    await queryInterface.createTable('maintenance_items', {
      id,
      user_id: userId,
      area_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'maintenance_areas', key: 'id' }, onDelete: 'RESTRICT' },
      asset_id: { type: Sequelize.STRING, references: { model: 'maintenance_assets', key: 'id' }, onDelete: 'SET NULL' },
      name: { type: Sequelize.STRING(160), allowNull: false }, schedule_type: { type: Sequelize.STRING(40), allowNull: false },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'active' },
      interval_days: { type: Sequelize.INTEGER }, window_start_days: { type: Sequelize.INTEGER }, window_end_days: { type: Sequelize.INTEGER },
      next_date: { type: Sequelize.STRING(10) }, last_completed_at: { type: Sequelize.DATE }, condition_state: { type: Sequelize.STRING(30) },
      effort: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'light' },
      duration_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 30 },
      priority: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'should' }, notes: { type: Sequelize.TEXT },
      created_at: createdAt, updated_at: createdAt,
    });
    await queryInterface.addIndex('maintenance_items', ['user_id', 'status']);
    await queryInterface.addIndex('maintenance_items', ['area_id']);

    await queryInterface.createTable('maintenance_occurrences', {
      id, user_id: userId,
      item_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'maintenance_items', key: 'id' }, onDelete: 'CASCADE' },
      action: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'completed' }, planned_date: { type: Sequelize.STRING(10) },
      completed_at: { type: Sequelize.DATE }, deferred_until: { type: Sequelize.STRING(10) }, duration_minutes: { type: Sequelize.INTEGER },
      cost: { type: Sequelize.DECIMAL(12, 2) }, notes: { type: Sequelize.TEXT }, created_at: createdAt,
    });
    await queryInterface.addIndex('maintenance_occurrences', ['user_id', 'item_id', 'created_at']);

    await queryInterface.createTable('repair_cases', {
      id, user_id: userId,
      asset_id: { type: Sequelize.STRING, references: { model: 'maintenance_assets', key: 'id' }, onDelete: 'SET NULL' },
      area_id: { type: Sequelize.STRING, references: { model: 'maintenance_areas', key: 'id' }, onDelete: 'SET NULL' },
      title: { type: Sequelize.STRING(160), allowNull: false }, issue: { type: Sequelize.TEXT, allowNull: false },
      state: { type: Sequelize.STRING(40), allowNull: false, defaultValue: 'reported' }, next_action: { type: Sequelize.TEXT },
      waiting_on: { type: Sequelize.STRING(140) }, follow_up_date: { type: Sequelize.STRING(10) }, opened_at: createdAt,
      closed_at: { type: Sequelize.DATE }, outcome: { type: Sequelize.TEXT }, cost: { type: Sequelize.DECIMAL(12, 2) }, updated_at: createdAt,
    });
    await queryInterface.addIndex('repair_cases', ['user_id', 'state']);

    await queryInterface.createTable('weekly_maintenance_plans', {
      id, user_id: userId, week_start: { type: Sequelize.STRING(10), allowNull: false },
      capacity_minutes: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 240 },
      selected_items: { type: Sequelize.JSONB, allowNull: false, defaultValue: [] },
      status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'draft' }, notes: { type: Sequelize.TEXT },
      committed_at: { type: Sequelize.DATE }, updated_at: createdAt,
    });
    await queryInterface.addConstraint('weekly_maintenance_plans', { fields: ['user_id', 'week_start'], type: 'unique', name: 'weekly_maintenance_plans_user_week_unique' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('weekly_maintenance_plans');
    await queryInterface.dropTable('repair_cases');
    await queryInterface.dropTable('maintenance_occurrences');
    await queryInterface.dropTable('maintenance_items');
    await queryInterface.dropTable('maintenance_assets');
    await queryInterface.dropTable('maintenance_areas');
  },
};
