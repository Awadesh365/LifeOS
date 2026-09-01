'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const id = { type: Sequelize.STRING, primaryKey: true };
    const owner = { type: Sequelize.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' };
    const createdAt = { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') };

    await queryInterface.createTable('financial_accounts', {
      id, user_id: owner,
      name: { type: Sequelize.STRING(140), allowNull: false },
      type: { type: Sequelize.STRING(32), allowNull: false },
      institution: { type: Sequelize.STRING(140) },
      currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'INR' },
      include_in_net_worth: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      status: { type: Sequelize.STRING(24), allowNull: false, defaultValue: 'active' },
      valuation_as_of: { type: Sequelize.STRING(10) },
      created_at: createdAt, updated_at: createdAt,
    });
    await queryInterface.addIndex('financial_accounts', ['user_id', 'status']);

    await queryInterface.createTable('money_transactions', {
      id, user_id: owner,
      semantic_type: { type: Sequelize.STRING(40), allowNull: false },
      occurred_on: { type: Sequelize.STRING(10), allowNull: false },
      amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
      currency: { type: Sequelize.STRING(3), allowNull: false, defaultValue: 'INR' },
      description: { type: Sequelize.STRING(180), allowNull: false },
      merchant: { type: Sequelize.STRING(180) },
      category: { type: Sequelize.STRING(100) },
      notes: { type: Sequelize.TEXT },
      source: { type: Sequelize.STRING(24), allowNull: false, defaultValue: 'manual' },
      raw_narration: { type: Sequelize.TEXT },
      reconciliation_status: { type: Sequelize.STRING(30), allowNull: false, defaultValue: 'unreconciled' },
      created_at: createdAt, updated_at: createdAt,
    });
    await queryInterface.addIndex('money_transactions', ['user_id', 'occurred_on']);
    await queryInterface.addIndex('money_transactions', ['user_id', 'semantic_type']);

    await queryInterface.createTable('ledger_postings', {
      id, user_id: owner,
      transaction_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'money_transactions', key: 'id' }, onDelete: 'CASCADE' },
      account_id: { type: Sequelize.STRING, allowNull: false, references: { model: 'financial_accounts', key: 'id' }, onDelete: 'RESTRICT' },
      amount: { type: Sequelize.DECIMAL(18, 2), allowNull: false },
      role: { type: Sequelize.STRING(40), allowNull: false },
      created_at: createdAt,
    });
    await queryInterface.addIndex('ledger_postings', ['user_id', 'account_id']);
    await queryInterface.addIndex('ledger_postings', ['transaction_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('ledger_postings');
    await queryInterface.dropTable('money_transactions');
    await queryInterface.dropTable('financial_accounts');
  },
};
