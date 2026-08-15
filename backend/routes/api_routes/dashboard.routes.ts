import { Router } from 'express';

import * as dashboardApiController from '../../controllers/api_controllers/dashboard/dashboard.api.controller.js';

const router = Router();

router.get('/', dashboardApiController.getDashboard);

export default router;
