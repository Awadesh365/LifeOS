const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const base = {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: Number(process.env.DB_POOL_MAX || 5),
    min: Number(process.env.DB_POOL_MIN || 0),
    idle: Number(process.env.DB_POOL_IDLE_MS || 10000),
    acquire: Number(process.env.DB_POOL_ACQUIRE_MS || 30000),
    evict: Number(process.env.DB_POOL_EVICT_MS || 10000)
  }
};

const TEST_DB_NAME_PATTERN = /(^|_|-)test($|_|-)/i;

const ensureTestDbName = (dbName) => {
  const normalized = dbName || 'life_tracker';
  return TEST_DB_NAME_PATTERN.test(normalized) ? normalized : `${normalized}_test`;
};

const deriveTestDatabaseUrl = (databaseUrl) => {
  try {
    const parsed = new URL(databaseUrl);
    const currentDbName = parsed.pathname.replace(/^\/+/, '') || 'life_tracker';
    parsed.pathname = `/${ensureTestDbName(currentDbName)}`;
    return parsed.toString();
  } catch (err) {
    return null;
  }
};

const fromEnv = (envName) => {
  const isTestEnv = envName === 'test';

  if (isTestEnv && process.env.TEST_DATABASE_URL) {
    return { ...base, use_env_variable: 'TEST_DATABASE_URL' };
  }

  const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL;

  if (databaseUrl) {
    if (isTestEnv) {
      const derived = deriveTestDatabaseUrl(databaseUrl);
      if (derived) {
        process.env.SEQUELIZE_TEST_DATABASE_URL = derived;
        return { ...base, use_env_variable: 'SEQUELIZE_TEST_DATABASE_URL' };
      }
    }
    process.env.SEQUELIZE_DATABASE_URL = databaseUrl;
    return { ...base, use_env_variable: 'SEQUELIZE_DATABASE_URL' };
  }

  return {
    ...base,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    database: isTestEnv
      ? ensureTestDbName(process.env.TEST_DB_NAME || process.env.DB_NAME || 'life_tracker')
      : process.env.DB_NAME || 'life_tracker',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres'
  };
};

module.exports = {
  development: fromEnv('development'),
  test: fromEnv('test'),
  production: fromEnv('production')
};
