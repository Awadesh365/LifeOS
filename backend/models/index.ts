import { Sequelize } from 'sequelize';

import config from '../config/env.js';
import { defineLifeTrackerModels } from './schema.js';

const sequelize = config.db.url
  ? new Sequelize(config.db.url, { logging: false, pool: config.db.pool })
  : new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: false,
    pool: config.db.pool,
  });

const models = defineLifeTrackerModels(sequelize);

export async function initDb() {
  await sequelize.authenticate();

  if (process.env.DB_SYNC === 'true') {
    await sequelize.sync({ alter: false, force: false });
  }
}

export { sequelize, models };
export * from './schema.js';
