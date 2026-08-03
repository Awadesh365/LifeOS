import { Router } from 'express';
import * as dashboardApiController from '../../../../controllers/api_controllers/v1/life-tracker/dashboard/dashboard.api.controller';

const router = Router();

router.get('/', dashboardApiController.getDashboard);

export default router;
