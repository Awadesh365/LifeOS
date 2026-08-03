import { Request, Response, NextFunction } from 'express';

const authorize = (_moduleKey: string, _action: string) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    next();
  };

export default authorize;
