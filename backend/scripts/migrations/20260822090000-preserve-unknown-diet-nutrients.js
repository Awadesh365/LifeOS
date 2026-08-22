'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('diet_logs', 'protein', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
    await queryInterface.changeColumn('diet_logs', 'calories', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('UPDATE diet_logs SET protein = 0 WHERE protein IS NULL');
    await queryInterface.sequelize.query('UPDATE diet_logs SET calories = 0 WHERE calories IS NULL');
    await queryInterface.changeColumn('diet_logs', 'protein', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });
    await queryInterface.changeColumn('diet_logs', 'calories', {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0,
    });
  },
};
