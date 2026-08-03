import { Router } from 'express';
import * as dietApiController from '../../../../controllers/api_controllers/v1/life-tracker/diet/diet.api.controller';

const router = Router();

router.get('/', dietApiController.listLogs);
router.post('/', dietApiController.createLog);
router.delete('/:id', dietApiController.deleteLog);
router.get('/supplements', dietApiController.listSupplements);
router.post('/supplements', dietApiController.createSupplement);
router.put('/supplements/:id', dietApiController.updateSupplement);
router.post('/supplements/:id/consume', dietApiController.consumeSupplement);

export default router;
