import config from './env';

const base = { dialect: 'postgres', logging: false, pool: config.db.pool };

const ensureTestDbName = (name: string): string =>
  (/(^|_|-)test($|_|-)/i.test(name) ? name : `${name}_test`);

export = {
  development: { ...base, use_env_variable: 'DATABASE_URL' },
  test:        { ...base, use_env_variable: 'TEST_DATABASE_URL', ensureTestDbName },
  production:  { ...base, use_env_variable: 'DATABASE_URL' },
};
