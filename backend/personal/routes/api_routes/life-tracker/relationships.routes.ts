import { Router } from 'express';

import * as relationshipsApiController from '../../../controllers/api_controllers/life-tracker/relationships/relationships.api.controller.js';

const router = Router();

router.get('/', relationshipsApiController.getRelationships);
router.post('/', relationshipsApiController.upsertRelationship);
router.post('/relatives', relationshipsApiController.createRelative);
router.put('/relatives/:id', relationshipsApiController.updateRelative);
router.delete('/relatives/:id', relationshipsApiController.deleteRelative);

export default router;
