import { Router } from 'express';
import * as controller from '../../controllers/api_controllers/maintenance/maintenance.api.controller.js';

const router = Router();

router.get('/summary', controller.summary);
router.get('/areas', controller.listAreas);
router.post('/areas', controller.createArea);
router.get('/items', controller.listItems);
router.post('/items', controller.createItem);
router.get('/items/:id', controller.getItem);
router.put('/items/:id', controller.updateItem);
router.post('/items/:id/complete', controller.completeItem);
router.get('/items/:id/history', controller.itemHistory);
router.get('/assets', controller.listAssets);
router.post('/assets', controller.createAsset);
router.get('/repairs', controller.listRepairs);
router.post('/repairs', controller.createRepair);
router.put('/repairs/:id', controller.updateRepair);
router.get('/plan', controller.getPlan);
router.put('/plan', controller.updatePlan);

export default router;
