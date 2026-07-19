import { Router } from 'express';

import * as debtsApiController from '../../../controllers/api_controllers/life-tracker/debts/debts.api.controller.js';

const router = Router();

router.get('/', debtsApiController.listDebts);
router.post('/', debtsApiController.createDebt);
router.post('/:id/pay', debtsApiController.payDebt);
router.get('/:id/payments', debtsApiController.listPayments);
router.delete('/:id', debtsApiController.deleteDebt);

export default router;
