'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.STRING(64), primaryKey: true },
      email: { type: Sequelize.STRING(254), allowNull: false, unique: true },
      display_name: { type: Sequelize.STRING(80), allowNull: false },
      password_hash: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      last_login_at: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable('user_sessions', {
      sid: { type: Sequelize.STRING, primaryKey: true },
      sess: { type: Sequelize.JSON, allowNull: false },
      expire: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('user_sessions', ['expire'], { name: 'user_sessions_expire_idx' });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_sessions');
    await queryInterface.dropTable('users');
  },
};
