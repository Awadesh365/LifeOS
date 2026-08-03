import { Request, Response } from 'express';

const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
};

export default notFound;
