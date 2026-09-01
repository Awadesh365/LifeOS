import { Router } from 'express';
import * as controller from '../../controllers/api_controllers/money/money.api.controller.js';

const router = Router();
router.get('/overview', controller.overview);
router.get('/accounts', controller.listAccounts);
router.post('/accounts', controller.createAccount);
router.get('/transactions', controller.listTransactions);
router.get('/transactions/:id', controller.getTransaction);
router.post('/transactions', controller.createTransaction);

export default router;
