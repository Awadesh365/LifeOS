import { Router } from 'express';

import * as dreamsApiController from '../../../controllers/api_controllers/life-tracker/dreams/dreams.api.controller.js';

const router = Router();

router.get('/', dreamsApiController.listDreams);
router.post('/', dreamsApiController.createDream);
router.put('/:id', dreamsApiController.updateDream);
router.delete('/:id', dreamsApiController.deleteDream);
router.put('/reorder', dreamsApiController.reorderDreams);

export default router;
