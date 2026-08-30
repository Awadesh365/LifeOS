import type { ErrorRequestHandler } from 'express';
import config from '../config/env.js';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err?.status === 'number' ? err.status : 500;

  if (err?.details) {
    res.status(status).json({
      error: err.message || 'Validation error',
      details: err.details,
    });
    return;
  }

  const message = status >= 500 && config.env === 'production'
    ? 'Internal server error'
    : err?.message || 'Internal error';
  res.status(status).json({ error: message });
};

export default errorHandler;
