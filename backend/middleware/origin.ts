import type { RequestHandler } from 'express';
import config from '../config/env.js';

export const verifyRequestOrigin: RequestHandler = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    next();
    return;
  }
  const origin = req.get('origin');
  if (!origin || config.cors.origins.includes(origin) || (config.env === 'development' && config.cors.localDevOrigin.test(origin))) {
    next();
    return;
  }
  res.status(403).json({ error: 'Request origin is not allowed' });
};
