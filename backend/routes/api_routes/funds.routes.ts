import { Router } from 'express';

import * as fundsApiController from '../../controllers/api_controllers/funds/funds.api.controller.js';

const router = Router();

router.get('/', fundsApiController.listFunds);
router.post('/', fundsApiController.createFund);
router.put('/:id', fundsApiController.updateFund);
router.post('/:id/deposit', fundsApiController.depositFund);
router.get('/summary', fundsApiController.getSummary);

export default router;
