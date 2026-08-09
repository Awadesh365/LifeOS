'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const SALT_ROUNDS = 10;

module.exports = {
  async up(queryInterface) {
    const adminId = uuidv4();
    const passwordHash = await bcrypt.hash('admin123', SALT_ROUNDS);

    await queryInterface.sequelize.query(
      `INSERT INTO "users" ("id", "email", "password_hash", "name", "role", "is_verified", "is_active", "created_at", "updated_at")
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
       ON CONFLICT ("email") DO NOTHING;`,
      {
        replacements: [
          adminId,
          'admin@lifeos.local',
          passwordHash,
          'Admin',
          'admin',
          true,
          true,
        ],
      }
    );

    console.log('Seeded admin user: admin@lifeos.local / admin123');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `DELETE FROM "users" WHERE "email" = 'admin@lifeos.local';`
    );
  },
};
