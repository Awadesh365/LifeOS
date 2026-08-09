import { Router } from 'express';
import authApiController from '../../../controllers/api_controllers/v1/auth/auth.api.controller';
import authMiddleware from '../../../middleware/v1/auth.middleware';

const router = Router();

router.post('/auth/register', authApiController.register);
router.post('/auth/login', authApiController.login);
router.get('/auth/me', authMiddleware, authApiController.getMe);

export default router;
