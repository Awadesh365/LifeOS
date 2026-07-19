import { Router } from 'express';

import * as wealthApiController from '../../../controllers/api_controllers/life-tracker/wealth/wealth.api.controller.js';

const router = Router();

router.get('/entries', wealthApiController.listEntries);
router.post('/entries', wealthApiController.createEntry);
router.delete('/entries/:id', wealthApiController.deleteEntry);
router.get('/investments', wealthApiController.listInvestments);
router.post('/investments', wealthApiController.createInvestment);
router.put('/investments/:id', wealthApiController.updateInvestment);
router.get('/summary', wealthApiController.getSummary);

export default router;
