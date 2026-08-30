import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';

import * as authController from '../../controllers/api_controllers/auth/auth.api.controller.js';
import { requireAuth, requireCsrf } from '../../middleware/auth.js';

const router = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
});

router.get('/session', authController.session);
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', requireAuth, requireCsrf, authController.logout);

export default router;
