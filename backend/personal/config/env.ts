import dotenv from 'dotenv';
import path from 'node:path';

// Prefer a Personal-specific environment file. During the Personal-only
// migration, fall back to the existing backend/.env so local credentials keep
// working without duplicating secrets. dotenv never overwrites variables that
// are already present in the process environment.
[
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
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
