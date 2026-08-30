import dotenv from 'dotenv';
import path from 'node:path';

// Load backend/.env in both source (config/) and compiled (dist/config/) runs.
[
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
].forEach((envPath) => dotenv.config({ path: envPath }));

const parseCorsOrigins = (value: string | undefined) => (
  value
    ? value.split(',').map((origin) => origin.trim()).filter(Boolean)
    : []
);

const numberFromEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const config = {
  env: process.env.NODE_ENV || 'development',
  port: numberFromEnv(process.env.BACKEND_PORT || process.env.PORT, 5000),
  cors: {
    origins: parseCorsOrigins(process.env.CORS_ORIGINS),
    localDevOrigin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
  },
  session: {
    secret: process.env.SESSION_SECRET || 'development-only-change-this-session-secret',
    maxAgeMs: numberFromEnv(process.env.SESSION_MAX_AGE_MS, 7 * 24 * 60 * 60 * 1000),
  },
  db: {
    url: process.env.DATABASE_URL || null,
    directUrl: process.env.DATABASE_DIRECT_URL || null,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'life_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    pool: {
      max: numberFromEnv(process.env.DB_POOL_MAX, 5),
      min: numberFromEnv(process.env.DB_POOL_MIN, 0),
      idle: numberFromEnv(process.env.DB_POOL_IDLE_MS, 10_000),
      acquire: numberFromEnv(process.env.DB_POOL_ACQUIRE_MS, 30_000),
      evict: numberFromEnv(process.env.DB_POOL_EVICT_MS, 10_000),
    },
  },
};

if (config.env === 'production' && config.session.secret.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters in production');
}

export default config;
