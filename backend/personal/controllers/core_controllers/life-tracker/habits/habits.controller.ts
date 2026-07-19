import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as habitsService from '../../../../services/life-tracker/habits/habits.service.js';

export const listHabits = asyncHandler(async (req, res) => {
  res.json(await habitsService.listHabits(req.query.date as string | undefined));
});

export const createHabit = asyncHandler(async (req, res) => {
  res.json(await habitsService.createHabit(req.body));
});

export const updateHabit = asyncHandler(async (req, res) => {
  res.json(await habitsService.updateHabit(req.params.id, req.body));
});

export const deleteHabit = asyncHandler(async (req, res) => {
  res.json(await habitsService.deleteHabit(req.params.id));
});

export const toggleHabit = asyncHandler(async (req, res) => {
  res.json(await habitsService.toggleHabit(req.params.id, req.body.date));
});

export const getHabitHistory = asyncHandler(async (req, res) => {
  res.json(await habitsService.getHabitHistory(req.params.date));
});
