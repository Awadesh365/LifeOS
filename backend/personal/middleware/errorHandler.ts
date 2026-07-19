import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = typeof err?.status === 'number' ? err.status : 500;

  if (err?.details) {
    res.status(status).json({
      error: err.message || 'Validation error',
      details: err.details,
    });
    return;
  }

  res.status(status).json({ error: err?.message || 'Internal error' });
};

export default errorHandler;
