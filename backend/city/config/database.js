require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const parsePositiveInteger = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

const pool = {
  max: parsePositiveInteger(process.env.DB_POOL_MAX, 5),
  min: Math.min(parsePositiveInteger(process.env.DB_POOL_MIN, 0), parsePositiveInteger(process.env.DB_POOL_MAX, 5)),
  idle: parsePositiveInteger(process.env.DB_POOL_IDLE_MS, 10000),
  acquire: parsePositiveInteger(process.env.DB_POOL_ACQUIRE_MS, 30000),
};

const base = { dialect: 'postgres', logging: false, pool };

const ensureTestDbName = (name) =>
  (/(^|_|-)test($|_|-)/i.test(name) ? name : `${name}_test`);

module.exports = {
  development: { ...base, use_env_variable: 'DATABASE_URL' },
  test:        { ...base, use_env_variable: 'TEST_DATABASE_URL', ensureTestDbName },
  production:  { ...base, use_env_variable: 'DATABASE_URL' },
};
