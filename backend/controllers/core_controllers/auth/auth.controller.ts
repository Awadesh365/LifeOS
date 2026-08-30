import { randomBytes } from 'node:crypto';
import type { Request } from 'express';

import config from '../../../config/env.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as authService from '../../../services/auth/auth.service.js';

const regenerate = (req: Request) => new Promise<void>((resolve, reject) => {
  req.session.regenerate((error) => error ? reject(error) : resolve());
});

const destroy = (req: Request) => new Promise<void>((resolve, reject) => {
  req.session.destroy((error) => error ? reject(error) : resolve());
});

const establishSession = async (req: Request, userId: string) => {
  await regenerate(req);
  req.session.userId = userId;
  req.session.csrfToken = randomBytes(32).toString('base64url');
  req.session.authenticatedAt = Date.now();
};

export const session = asyncHandler(async (req, res) => {
  const registrationOpen = await authService.registrationOpen();
  if (!req.session.userId) {
    res.json({ authenticated: false, registrationOpen });
    return;
  }
  const user = await authService.getUser(req.session.userId);
  res.json({ authenticated: true, registrationOpen, user, csrfToken: req.session.csrfToken });
});

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  await establishSession(req, user.id);
  res.status(201).json({ authenticated: true, user, csrfToken: req.session.csrfToken });
});

export const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body);
  await establishSession(req, user.id);
  res.json({ authenticated: true, user, csrfToken: req.session.csrfToken });
});

export const logout = asyncHandler(async (req, res) => {
  await destroy(req);
  res.clearCookie(config.env === 'production' ? '__Host-lifeos.sid' : 'lifeos.sid', {
    httpOnly: true,
    secure: config.env === 'production',
    sameSite: config.env === 'production' ? 'strict' : 'lax',
    path: '/',
  });
  res.status(204).end();
});
