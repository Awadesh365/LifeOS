import { Router } from 'express';
import * as habitsApiController from '../../../../controllers/api_controllers/v1/life-tracker/habits/habits.api.controller';

const router = Router();

router.get('/', habitsApiController.listHabits);
router.post('/', habitsApiController.createHabit);
router.put('/:id', habitsApiController.updateHabit);
router.delete('/:id', habitsApiController.deleteHabit);
router.post('/:id/toggle', habitsApiController.toggleHabit);
router.get('/history/:date', habitsApiController.getHabitHistory);

export default router;
