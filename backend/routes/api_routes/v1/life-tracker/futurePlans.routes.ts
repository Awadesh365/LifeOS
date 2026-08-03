import { Router } from 'express';
import * as futurePlansApiController from '../../../../controllers/api_controllers/v1/life-tracker/futurePlans/futurePlans.api.controller';

const router = Router();

router.get('/', futurePlansApiController.listFuturePlans);
router.post('/', futurePlansApiController.createFuturePlan);
router.put('/:id', futurePlansApiController.updateFuturePlan);
router.delete('/:id', futurePlansApiController.deleteFuturePlan);

export default router;
