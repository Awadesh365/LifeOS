import { Router } from 'express';

import * as habitsApiController from '../../controllers/api_controllers/habits/habits.api.controller.js';

const router = Router();

router.get('/week', habitsApiController.getHabitWeek);
router.put('/completion', habitsApiController.setCompletions);
router.put('/:id/completion', habitsApiController.setCompletion);

router.get('/', habitsApiController.listHabits);
router.post('/', habitsApiController.createHabit);
router.put('/:id', habitsApiController.updateHabit);
router.delete('/:id', habitsApiController.deleteHabit);
router.post('/:id/toggle', habitsApiController.toggleHabit);
router.get('/history/:date', habitsApiController.getHabitHistory);

export default router;
