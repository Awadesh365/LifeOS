'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('users');
    if (!columns.phone) await queryInterface.addColumn('users', 'phone', { type: Sequelize.STRING(20), allowNull: true });
    if (!columns.avatar_url) await queryInterface.addColumn('users', 'avatar_url', { type: Sequelize.STRING(500), allowNull: true });
  },
  async down() {
    // These fields can predate migrations. Retain them to preserve account data.
  },
};
