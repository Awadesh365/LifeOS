'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('maintenance_items', 'work_kind', {
      type: Sequelize.STRING(30), allowNull: false, defaultValue: 'routine',
    });
    await queryInterface.addColumn('maintenance_items', 'schedule_version', {
      type: Sequelize.INTEGER, allowNull: false, defaultValue: 1,
    });
    await queryInterface.addColumn('maintenance_items', 'version', {
      type: Sequelize.INTEGER, allowNull: false, defaultValue: 1,
    });

    await queryInterface.sequelize.query(`
      UPDATE maintenance_items
      SET work_kind = CASE
        WHEN schedule_type = 'repair' THEN 'repair'
        WHEN schedule_type = 'project' THEN 'improvement_project'
        ELSE 'routine'
      END,
      schedule_type = CASE
        WHEN schedule_type IN ('repair', 'project') THEN 'none'
        ELSE schedule_type
      END
    `);

    await queryInterface.addColumn('maintenance_occurrences', 'client_operation_id', {
      type: Sequelize.STRING(120), allowNull: true,
    });
    await queryInterface.addColumn('maintenance_occurrences', 'schedule_version', {
      type: Sequelize.INTEGER, allowNull: false, defaultValue: 1,
    });
    await queryInterface.addColumn('maintenance_occurrences', 'window_start', {
      type: Sequelize.STRING(10), allowNull: true,
    });
    await queryInterface.addColumn('maintenance_occurrences', 'window_end', {
      type: Sequelize.STRING(10), allowNull: true,
    });
    await queryInterface.addColumn('maintenance_occurrences', 'hard_due_at', {
      type: Sequelize.STRING(10), allowNull: true,
    });
    await queryInterface.addIndex('maintenance_occurrences', ['user_id', 'client_operation_id'], {
      unique: true,
      name: 'maintenance_occurrences_user_operation_unique',
      where: { client_operation_id: { [Sequelize.Op.ne]: null } },
    });
  },

  async down(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(
      "SELECT id FROM maintenance_items WHERE work_kind IN ('repair', 'improvement_project') AND schedule_type <> 'none' LIMIT 1"
    );
    if (rows.length) throw new Error('Cannot rollback scheduled repair/project items: the legacy schema cannot preserve both category and timing.');

    await queryInterface.removeIndex('maintenance_occurrences', 'maintenance_occurrences_user_operation_unique');
    await queryInterface.removeColumn('maintenance_occurrences', 'hard_due_at');
    await queryInterface.removeColumn('maintenance_occurrences', 'window_end');
    await queryInterface.removeColumn('maintenance_occurrences', 'window_start');
    await queryInterface.removeColumn('maintenance_occurrences', 'schedule_version');
    await queryInterface.removeColumn('maintenance_occurrences', 'client_operation_id');
    await queryInterface.removeColumn('maintenance_items', 'version');
    await queryInterface.removeColumn('maintenance_items', 'schedule_version');
    // Restore the legacy category before dropping its replacement.
    await queryInterface.sequelize.query(`
      UPDATE maintenance_items SET schedule_type = CASE
        WHEN work_kind = 'repair' THEN 'repair'
        WHEN work_kind = 'improvement_project' THEN 'project'
        ELSE schedule_type END
    `);
    await queryInterface.removeColumn('maintenance_items', 'work_kind');
  },
};
