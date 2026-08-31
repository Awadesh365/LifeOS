import { Algorithm, hash, verify } from '@node-rs/argon2';
import { compare as verifyBcrypt } from 'bcryptjs';
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
const LEGACY_SEEDED_PASSWORD_HASH = '$2b$10$dZ9jgn7RJZh8/04llj7wYuRKvbjnoCoDQHG2pPGSGUDpMFBwYoKWm';

export interface AuthInput {
  email?: unknown;
  password?: unknown;
  displayName?: unknown;
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

const publicUser = (row: Record<string, unknown>) => ({
  id: String(row.id),
  email: String(row.email),
  displayName: String(row.name),
});

export async function registrationOpen() {
  const rows = await models.User.findAll({ attributes: ['email', 'name', 'passwordHash'], raw: true }) as unknown as Record<string, unknown>[];
  return rows.length === 0 || (
    rows.length === 1
    && String(rows[0].email).toLowerCase() === 'admin@lifeos.local'
    && String(rows[0].name).toLowerCase() === 'admin'
    && String(rows[0].passwordHash) === LEGACY_SEEDED_PASSWORD_HASH
  );
}

export async function register(input: AuthInput) {
  const email = normalizeEmail(input.email);
  const password = normalizePassword(input.password);
  const displayName = normalizeDisplayName(input.displayName);
  const passwordHash = await hash(password, HASH_OPTIONS);

  return sequelize.transaction(async (transaction) => {
    await sequelize.query('SELECT pg_advisory_xact_lock(72460391)', { transaction });
    const rows = await models.User.findAll({ transaction });
    const legacyOwner = rows.length === 1
      && String(rows[0].get('email')).toLowerCase() === 'admin@lifeos.local'
      && String(rows[0].get('name')).toLowerCase() === 'admin'
      && String(rows[0].get('passwordHash')) === LEGACY_SEEDED_PASSWORD_HASH;
    if (rows.length > 0 && !legacyOwner) {
      throw createHttpError(403, 'Owner account setup is already complete');
    }
    const row = legacyOwner
      ? await rows[0].update({ email, name: displayName, passwordHash, isVerified: true, isActive: true, updatedAt: new Date() }, { transaction })
      : await models.User.create(
        { email, name: displayName, passwordHash, role: 'admin', isVerified: true, isActive: true, createdAt: new Date(), updatedAt: new Date() },
        { transaction },
      );
    await sequelize.query(
      `UPDATE user_preferences SET user_id = :userId
       WHERE user_id = 'awadesh'
       AND NOT EXISTS (SELECT 1 FROM user_preferences WHERE user_id = :userId)`,
      { replacements: { userId: String(row.get('id')) }, transaction },
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
    ? passwordHash.startsWith('$argon2')
      ? await verify(passwordHash, password)
      : passwordHash.startsWith('$2') && await verifyBcrypt(password, passwordHash)
    : await verify(await dummyHash, password).then(() => false);

  if (!row || !valid || row.get('isActive') !== true) throw createHttpError(401, 'Email or password is incorrect');
  await row.update({
    passwordHash: typeof passwordHash === 'string' && passwordHash.startsWith('$argon2')
      ? passwordHash
      : await hash(password, HASH_OPTIONS),
    updatedAt: new Date(),
  });
  return publicUser(row.get({ plain: true }) as Record<string, unknown>);
}

export async function getUser(userId: string) {
  const row = await models.User.findByPk(userId, { raw: true }) as Record<string, unknown> | null;
  if (!row) throw createHttpError(401, 'Authentication required');
  return publicUser(row);
}
