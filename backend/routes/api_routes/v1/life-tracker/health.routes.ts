import { Router } from 'express';
import * as healthApiController from '../../../../controllers/api_controllers/v1/life-tracker/health/health.api.controller';

const router = Router();

router.get('/', healthApiController.getHealthLog);
router.post('/', healthApiController.upsertHealthLog);
router.get('/weekly', healthApiController.getWeeklyHealthLogs);

export default router;
