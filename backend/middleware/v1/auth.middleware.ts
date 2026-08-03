import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/env';

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as { sub: string; tenantId: string; companyId?: string };
    (req as any).user = { id: payload.sub, tenantId: payload.tenantId, companyId: payload.companyId };
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
