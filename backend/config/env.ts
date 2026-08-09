import path from 'path';
import dotenv from 'dotenv';
import {
  parsePositiveIntegerEnv,
  parseNonNegativeIntegerEnv,
  assertMinNotGreaterThanMax,
  parseBool,
} from './parseEnv';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const dbPool = {
  max: parsePositiveIntegerEnv(process.env.DB_POOL_MAX, 5),
  min: parseNonNegativeIntegerEnv(process.env.DB_POOL_MIN, 0),
  idle: parsePositiveIntegerEnv(process.env.DB_POOL_IDLE_MS, 10000),
  acquire: parsePositiveIntegerEnv(process.env.DB_POOL_ACQUIRE_MS, 30000),
};

assertMinNotGreaterThanMax({
  minName: 'DB_POOL_MIN',
  minValue: dbPool.min,
  maxName: 'DB_POOL_MAX',
  maxValue: dbPool.max,
});

const env: string = process.env.NODE_ENV || 'development';
const isProd: boolean = env === 'production';

const requireInProd = (value: string | undefined, name: string, devDefault: string): string => {
  if (value) return value;
  if (isProd) throw new Error(`${name} must be set in production`);
  return devDefault;
};

interface JwtConfig {
  secret: string;
  expiresIn: string;
}

interface RedisConfig {
  enabled: boolean;
  host: string;
  port: number;
  password: string;
  keyPrefix: string;
  connectTimeoutMs: number;
  rateLimitDb: number;
  cacheDb: number;
}

interface FlagsConfig {
  recommendationsEnabled: boolean;
  analyticsEnabled: boolean;
  emailsEnabled: boolean;
}

interface DbPool {
  max: number;
  min: number;
  idle: number;
  acquire: number;
}

interface DbConfig {
  url: string;
  directUrl: string | null;
  pool: DbPool;
}

interface Config {
  env: string;
  isProd: boolean;
  port: number;
  trustedProxyCount: number;
  rabbitUrl: string;
  flags: FlagsConfig;
  redis: RedisConfig;
  db: DbConfig;
  jwt: JwtConfig;
  customerJwt: JwtConfig;
}

const config: Config = {
  env,
  isProd,
  port: Number(process.env.PORT || 5000),
  trustedProxyCount: Number(process.env.TRUSTED_PROXY_COUNT || 0),
  rabbitUrl: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',

  flags: {
    recommendationsEnabled: parseBool(process.env.RECOMMENDATIONS_ENABLED ?? 'true'),
    analyticsEnabled:       parseBool(process.env.ANALYTICS_ENABLED ?? 'true'),
    emailsEnabled:          parseBool(process.env.EMAILS_ENABLED ?? 'true'),
  },

  redis: {
    enabled: parseBool(process.env.REDIS_ENABLED),
    host: process.env.REDIS_HOST || '',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || '',
    keyPrefix: process.env.REDIS_KEY_PREFIX || 'lifeos',
    connectTimeoutMs: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 2000),
    rateLimitDb: Number(process.env.REDIS_RATELIMIT_DB || 0),
    cacheDb: Number(process.env.REDIS_CACHE_DB || 1),
  },

  db: {
    url: process.env.DATABASE_URL || '',
    directUrl: process.env.DATABASE_DIRECT_URL || null,
    pool: dbPool,
  },

  jwt:         { secret: requireInProd(process.env.JWT_SECRET, 'JWT_SECRET', 'dev-secret'), expiresIn: '7d' },
  customerJwt: { secret: requireInProd(process.env.CUSTOMER_JWT_SECRET, 'CUSTOMER_JWT_SECRET', 'dev-cust'), expiresIn: '7d' },
};

export default config;
