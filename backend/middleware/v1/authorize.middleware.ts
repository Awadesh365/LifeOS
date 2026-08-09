import { Request, Response, NextFunction } from 'express';

const authorize = (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }

    next();
  };

export default authorize;
