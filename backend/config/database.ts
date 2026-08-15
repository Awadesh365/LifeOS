import config from './env.js';

const base = {
  dialect: 'postgres',
  logging: false,
};

const TEST_DB_NAME_PATTERN = /(^|_|-)test($|_|-)/i;

const ensureTestDbName = (dbName?: string) => {
  const normalized = dbName || 'life_tracker';
  return TEST_DB_NAME_PATTERN.test(normalized) ? normalized : `${normalized}_test`;
};

const deriveTestDatabaseUrl = (databaseUrl: string) => {
  try {
    const parsed = new URL(databaseUrl);
    const currentDbName = parsed.pathname.replace(/^\/+/, '') || 'life_tracker';
    parsed.pathname = `/${ensureTestDbName(currentDbName)}`;
    return parsed.toString();
  } catch (err) {
    return null;
  }
};

const fromEnv = (envName: string) => {
  const isTestEnv = envName === 'test';

  if (isTestEnv && process.env.TEST_DATABASE_URL) {
    return { ...base, use_env_variable: 'TEST_DATABASE_URL' };
  }

  if (config.db.url) {
    if (isTestEnv) {
      const derived = deriveTestDatabaseUrl(config.db.url);
      if (derived) {
        process.env.SEQUELIZE_TEST_DATABASE_URL = derived;
        return { ...base, use_env_variable: 'SEQUELIZE_TEST_DATABASE_URL' };
      }
    }
    return { ...base, use_env_variable: 'DATABASE_URL' };
  }

  return {
    ...base,
    host: config.db.host,
    port: config.db.port,
    database: isTestEnv ? ensureTestDbName(process.env.TEST_DB_NAME || config.db.name) : config.db.name,
    username: config.db.user,
    password: config.db.password,
  };
};

export default {
  development: fromEnv('development'),
  test: fromEnv('test'),
  production: fromEnv('production'),
};
