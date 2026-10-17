import { Router } from 'express';
import * as controller from '../../controllers/api_controllers/training/training.api.controller.js';

const router = Router();

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.get('/exercises', controller.listExercises);
router.get('/exercises/:id/history', controller.getExerciseHistory);
router.get('/exercises/:id/progression', controller.getProgression);
router.get('/exercises/:id', controller.getExercise);
router.get('/programs', controller.listPrograms);
router.post('/programs/generate', controller.generateProgram);
router.post('/programs', controller.createProgram);
router.put('/programs/:id', controller.updateProgram);
router.post('/programs/:id/duplicate', controller.duplicateProgram);
router.post('/programs/:id/activate', controller.activateProgram);
router.get('/today', controller.getToday);
router.post('/sessions', controller.startSession);
router.post('/sessions/:id/sets', controller.logSet);
router.patch('/sets/:id', controller.updatePerformedSet);
router.patch('/sessions/:id/complete', controller.completeSession);
router.get('/review', controller.getReview);

export default router;
