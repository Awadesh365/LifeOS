import { Router } from 'express';

import * as learningApiController from '../../controllers/api_controllers/learning/learning.api.controller.js';

const router = Router();

router.get('/', learningApiController.getLearningTree);
router.post('/section', learningApiController.createSection);
router.put('/section/:id', learningApiController.updateSection);
router.delete('/section/:id', learningApiController.deleteSection);
router.post('/item', learningApiController.createItem);
router.put('/item/:id', learningApiController.updateItem);
router.patch('/item/:id/status', learningApiController.updateItemStatus);
router.delete('/item/:id', learningApiController.deleteItem);
router.put('/reorder', learningApiController.reorderItems);

export default router;
