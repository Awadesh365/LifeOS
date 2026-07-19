import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as goalsService from '../../../../services/life-tracker/goals/goals.service.js';

export const listGoals = asyncHandler(async (_req, res) => {
  res.json(await goalsService.listGoals());
});

export const createGoal = asyncHandler(async (req, res) => {
  res.json(await goalsService.createGoal(req.body));
});

export const updateGoal = asyncHandler(async (req, res) => {
  res.json(await goalsService.updateGoal(req.params.id, req.body));
});

export const deleteGoal = asyncHandler(async (req, res) => {
  res.json(await goalsService.deleteGoal(req.params.id));
});

export const createMilestone = asyncHandler(async (req, res) => {
  res.json(await goalsService.createMilestone(req.params.id, req.body));
});

export const updateMilestoneStatus = asyncHandler(async (req, res) => {
  res.json(await goalsService.updateMilestoneStatus(req.params.id, req.body.done));
});

export const deleteMilestone = asyncHandler(async (req, res) => {
  res.json(await goalsService.deleteMilestone(req.params.id));
});
