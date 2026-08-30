import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

const unauthorized = { error: 'Authentication required' };

export const requireAuth: RequestHandler = (req, res, next) => {
  if (!req.session.userId) {
    res.status(401).json(unauthorized);
    return;
  }
  next();
};

export const requireCsrf: RequestHandler = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  const supplied = req.get('x-csrf-token') ?? '';
  const expected = req.session.csrfToken ?? '';
  const suppliedBuffer = Buffer.from(supplied);
  const expectedBuffer = Buffer.from(expected);
  if (!supplied || suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    res.status(403).json({ error: 'Invalid CSRF token' });
    return;
  }
  next();
};
