import { Request, Response, NextFunction } from 'express';

interface ErrorBody {
  error: string;
  code?: string;
  details?: Array<{ field?: string; message: string }>;
}

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  let status = err.status || 500;
  const body: ErrorBody = { error: err.message || 'Internal error' };
  if (err.code) body.code = err.code;

  if (err.name === 'SequelizeValidationError') {
    status = 400;
    body.details = err.errors?.map((e: any) => ({ field: e.path, message: e.message }));
  }
  if (err.name === 'SequelizeUniqueConstraintError') {
    status = 409;
    body.error = 'Conflict';
  }
  if (Array.isArray(err.details)) body.details = err.details;

  if (status >= 500) (req as any).log?.error({ err, reqId: (req as any).id }, 'Unhandled error');
  res.status(status).json(body);
};

export default errorHandler;
