import { Router } from 'express';

import * as dietApiController from '../../controllers/api_controllers/diet/diet.api.controller.js';

const router = Router();

router.get('/logs', dietApiController.listLogs);
router.post('/logs', dietApiController.createLog);
router.delete('/logs/:id', dietApiController.deleteLog);
router.get('/supplements', dietApiController.listSupplements);
router.post('/supplements', dietApiController.createSupplement);
router.put('/supplements/:id', dietApiController.updateSupplement);
router.post('/supplements/:id/consume', dietApiController.consumeSupplement);

export default router;
