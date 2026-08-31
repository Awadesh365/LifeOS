'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      name: { type: Sequelize.STRING(255), allowNull: false },
      password_hash: { type: Sequelize.TEXT, allowNull: false },
      role: { type: Sequelize.STRING(32), allowNull: false, defaultValue: 'admin' },
      is_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
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
    // Keep users: some LifeOS databases already had the owner table before
    // session authentication was introduced, so dropping it would destroy accounts.
  },
};
