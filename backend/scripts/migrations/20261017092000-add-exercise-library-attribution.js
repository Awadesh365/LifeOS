'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('exercises', 'demo_videos', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: [],
    });
    await queryInterface.addColumn('exercises', 'source', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('exercises', 'license', { type: Sequelize.STRING, allowNull: true });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn('exercises', 'license');
    await queryInterface.removeColumn('exercises', 'source');
    await queryInterface.removeColumn('exercises', 'demo_videos');
  },
};
