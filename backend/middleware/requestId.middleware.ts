import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';

const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  (req as any).id = requestId;
  (req as any).log = logger.child({ requestId });
  res.setHeader('x-request-id', requestId);
  next();
};

export default requestIdMiddleware;
