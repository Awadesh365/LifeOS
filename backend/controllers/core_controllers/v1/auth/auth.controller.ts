import { Request, Response, NextFunction } from 'express';
import * as authService from '../../../../services/v1/auth/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, name, phone, role } = req.body;
    const result = await authService.register({ email, password, name, phone, role });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const user = await authService.getProfile(userId);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};
