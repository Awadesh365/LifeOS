import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { models } from '../../../models';
import config from '../../../config/env';

interface RegisterParams {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: 'customer' | 'provider' | 'admin';
}

interface LoginParams {
  email: string;
  password: string;
}

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

const SALT_ROUNDS = 10;

function generateToken(user: { id: string; email: string; role: string }): string {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn as any });
}

function sanitizeUser(user: any) {
  const { password_hash, ...safe } = user.toJSON ? user.toJSON() : user;
  return safe;
}

export const register = async ({ email, password, name, phone, role }: RegisterParams) => {
  const existing = await models.User.findOne({ where: { email: email.toLowerCase() } });
  if (existing) {
    throw Object.assign(new Error('Email already registered'), { status: 409 });
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await models.User.create({
    email: email.toLowerCase(),
    password_hash,
    name,
    phone,
    role: role || 'customer',
  });

  const token = generateToken({
    id: user.get('id') as string,
    email: user.get('email') as string,
    role: user.get('role') as string,
  });
  return { user: sanitizeUser(user), token };
};

export const login = async ({ email, password }: LoginParams) => {
  const user = await models.User.findOne({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  if (!user.get('is_active')) {
    throw Object.assign(new Error('Account is deactivated'), { status: 403 });
  }

  const valid = await bcrypt.compare(password, user.get('password_hash') as string);
  if (!valid) {
    throw Object.assign(new Error('Invalid email or password'), { status: 401 });
  }

  const token = generateToken({
    id: user.get('id') as string,
    email: user.get('email') as string,
    role: user.get('role') as string,
  });
  return { user: sanitizeUser(user), token };
};

export const getProfile = async (userId: string) => {
  const user = await models.User.findByPk(userId);
  if (!user) {
    throw Object.assign(new Error('User not found'), { status: 404 });
  }
  return sanitizeUser(user);
};
