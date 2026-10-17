'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const columns = await queryInterface.describeTable('nutrition_records');
    if (!columns.user_id) {
      await queryInterface.addColumn('nutrition_records', 'user_id', { type: Sequelize.STRING, allowNull: true });
      await queryInterface.sequelize.query("UPDATE nutrition_records SET user_id = 'legacy' WHERE user_id IS NULL");
      await queryInterface.changeColumn('nutrition_records', 'user_id', { type: Sequelize.STRING, allowNull: false });
      await queryInterface.removeConstraint('nutrition_records', 'nutrition_records_pkey');
      await queryInterface.addConstraint('nutrition_records', {
        fields: ['user_id', 'key'],
        type: 'primary key',
        name: 'nutrition_records_pkey',
      });
    }
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('nutrition_records', 'nutrition_records_pkey');
    await queryInterface.addConstraint('nutrition_records', { fields: ['key'], type: 'primary key', name: 'nutrition_records_pkey' });
    await queryInterface.removeColumn('nutrition_records', 'user_id');
  },
};
