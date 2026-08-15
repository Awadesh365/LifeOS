import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as routinesService from '../../../services/routines/routines.service.js';

export const listRoutines = asyncHandler(async (req, res) => {
  res.json(await routinesService.listRoutines(req.query.type as string | undefined));
});

export const createRoutine = asyncHandler(async (req, res) => {
  res.json(await routinesService.createRoutine(req.body));
});

export const reorderRoutines = asyncHandler(async (req, res) => {
  res.json(await routinesService.reorderRoutines(req.body.order));
});

export const replaceRoutineType = asyncHandler(async (req, res, next) => {
  const result = await routinesService.replaceRoutineType(req.params.type, req.body.items);
  if (!result) {
    next();
    return;
  }
  res.json(result);
});

export const updateRoutine = asyncHandler(async (req, res) => {
  res.json(await routinesService.updateRoutine(req.params.id, req.body));
});

export const deleteRoutine = asyncHandler(async (req, res) => {
  res.json(await routinesService.deleteRoutine(req.params.id));
});
