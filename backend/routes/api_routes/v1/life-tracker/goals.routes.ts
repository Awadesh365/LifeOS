import { Router } from 'express';
import * as goalsApiController from '../../../../controllers/api_controllers/v1/life-tracker/goals/goals.api.controller';

const router = Router();

router.get('/', goalsApiController.listGoals);
router.post('/', goalsApiController.createGoal);
router.put('/:id', goalsApiController.updateGoal);
router.delete('/:id', goalsApiController.deleteGoal);
router.post('/:id/milestone', goalsApiController.createMilestone);
router.patch('/milestone/:id', goalsApiController.updateMilestoneStatus);
router.delete('/milestone/:id', goalsApiController.deleteMilestone);

export default router;
