import { Router, Request, Response } from 'express';

const router = Router();

router.post('/auth/login', (_req: Request, res: Response) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/auth/register', (_req: Request, res: Response) => {
  res.json({ message: 'Register endpoint' });
});

export default router;
