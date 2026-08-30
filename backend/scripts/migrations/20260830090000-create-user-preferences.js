'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_preferences', {
      user_id: { type: Sequelize.STRING(64), primaryKey: true },
      theme: { type: Sequelize.STRING(16), allowNull: false, defaultValue: 'system' },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addConstraint('user_preferences', {
      fields: ['theme'],
      type: 'check',
      name: 'user_preferences_theme_check',
      where: { theme: ['system', 'light', 'dark'] },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_preferences');
  },
};
