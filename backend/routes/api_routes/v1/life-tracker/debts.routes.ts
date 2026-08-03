import { Router } from 'express';
import * as debtsApiController from '../../../../controllers/api_controllers/v1/life-tracker/debts/debts.api.controller';

const router = Router();

router.get('/', debtsApiController.listDebts);
router.post('/', debtsApiController.createDebt);
router.post('/:id/pay', debtsApiController.payDebt);
router.get('/:id/payments', debtsApiController.listPayments);
router.delete('/:id', debtsApiController.deleteDebt);

export default router;
