import { Algorithm, hash, verify } from '@node-rs/argon2';
import { randomUUID } from 'node:crypto';

import { models, sequelize } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';

const HASH_OPTIONS = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  outputLen: 32,
};
const dummyHash = hash(randomUUID(), HASH_OPTIONS);

export interface AuthInput {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
  username?: unknown;
}

const normalizeEmail = (value: unknown) => {
  const email = String(value ?? '').trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createHttpError(400, 'Enter a valid email address');
  }
  return email;
};

const normalizePassword = (value: unknown) => {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) {
    throw createHttpError(400, 'Password must be between 12 and 128 characters');
  }
  return value;
};

const normalizeDisplayName = (value: unknown) => {
  const displayName = String(value ?? '').trim();
  if (displayName.length < 2 || displayName.length > 80) {
    throw createHttpError(400, 'Name must be between 2 and 80 characters');
  }
  return displayName;
};

const normalizeUsername = (value: unknown) => {
  const username = String(value ?? '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9_-]{2,31}$/.test(username)) {
    throw createHttpError(400, 'Username must use 3–32 lowercase letters, numbers, underscores, or hyphens');
  }
  return username;
};

const publicUser = (row: Record<string, unknown>) => ({
  id: String(row.id),
  email: String(row.email),
  displayName: String(row.displayName),
});

export async function registrationOpen() {
  return await models.User.count() === 0;
}

export async function register(input: AuthInput) {
  const email = normalizeEmail(input.email);
  const password = normalizePassword(input.password);
  const displayName = normalizeDisplayName(input.displayName);
  const id = normalizeUsername(input.username);
  const passwordHash = await hash(password, HASH_OPTIONS);

  return sequelize.transaction(async (transaction) => {
    await sequelize.query('SELECT pg_advisory_xact_lock(72460391)', { transaction });
    if (await models.User.count({ transaction }) > 0) {
      throw createHttpError(403, 'Owner account setup is already complete');
    }
    const row = await models.User.create(
      { id, email, displayName, passwordHash, createdAt: new Date(), lastLoginAt: new Date() },
      { transaction },
    );
    return publicUser(row.get({ plain: true }) as Record<string, unknown>);
  });
}

export async function login(input: AuthInput) {
  const email = normalizeEmail(input.email);
  const password = normalizePassword(input.password);
  const row = await models.User.findOne({ where: { email } });
  const passwordHash = row?.get('passwordHash');
  const valid = typeof passwordHash === 'string'
    ? await verify(passwordHash, password)
    : await verify(await dummyHash, password).then(() => false);

  if (!row || !valid) throw createHttpError(401, 'Email or password is incorrect');
  await row.update({ lastLoginAt: new Date() });
  return publicUser(row.get({ plain: true }) as Record<string, unknown>);
}

export async function getUser(userId: string) {
  const row = await models.User.findByPk(userId, { raw: true }) as Record<string, unknown> | null;
  if (!row) throw createHttpError(401, 'Authentication required');
  return publicUser(row);
}
