'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_preferences', 'primary_color', {
      type: Sequelize.STRING(7),
      allowNull: false,
      defaultValue: '#E55555',
    });
    await queryInterface.addColumn('user_preferences', 'secondary_color', {
      type: Sequelize.STRING(7),
      allowNull: false,
      defaultValue: '#1E2530',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_preferences', 'secondary_color');
    await queryInterface.removeColumn('user_preferences', 'primary_color');
  },
};
