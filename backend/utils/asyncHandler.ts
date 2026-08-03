import type { NextFunction, Request, RequestHandler, Response } from 'express';

type RouteParams = Record<string, string>;
type AsyncHandler = (req: Request<RouteParams>, res: Response, next: NextFunction) => Promise<void> | void;

export const asyncHandler = (handler: AsyncHandler): RequestHandler => (
  async (req, res, next) => {
    try {
      await handler(req as Request<RouteParams>, res, next);
    } catch (err) {
      next(err);
    }
  }
);
