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

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || process.env.BACKEND_PORT || 3001),
  cors: {
    origins: parseCorsOrigins(process.env.CORS_ORIGINS),
    localDevOrigin: /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
  },
  db: {
    url: process.env.DATABASE_URL || null,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    name: process.env.DB_NAME || 'life_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  },
};

export default config;
