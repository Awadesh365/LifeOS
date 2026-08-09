import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/env';
import { models } from '../../models';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const user = await models.User.findByPk(payload.sub);
    if (!user || !user.get('is_active')) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    (req as any).user = {
      id: user.get('id'),
      email: user.get('email'),
      role: user.get('role'),
      name: user.get('name'),
    };

    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
