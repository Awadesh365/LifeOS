import { Router } from 'express';
import * as relationshipsApiController from '../../../../controllers/api_controllers/v1/life-tracker/relationships/relationships.api.controller';

const router = Router();

router.get('/', relationshipsApiController.getRelationships);
router.post('/', relationshipsApiController.upsertRelationship);
router.post('/relative', relationshipsApiController.createRelative);
router.put('/relative/:id', relationshipsApiController.updateRelative);
router.delete('/relative/:id', relationshipsApiController.deleteRelative);

export default router;
