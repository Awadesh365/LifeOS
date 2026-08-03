import { Router } from 'express';
import * as routinesApiController from '../../../../controllers/api_controllers/v1/life-tracker/routines/routines.api.controller';

const router = Router();

router.get('/', routinesApiController.listRoutines);
router.post('/', routinesApiController.createRoutine);
router.put('/reorder', routinesApiController.reorderRoutines);
router.put('/:type', routinesApiController.replaceRoutineType);
router.put('/:id', routinesApiController.updateRoutine);
router.delete('/:id', routinesApiController.deleteRoutine);

export default router;
