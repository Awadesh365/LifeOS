'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nutrition_records', {
      key: { type: Sequelize.STRING, primaryKey: true },
      value: { type: Sequelize.JSONB, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nutrition_records');
  },
};
