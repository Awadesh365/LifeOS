import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as dreamsService from '../../../../services/life-tracker/dreams/dreams.service.js';

export const listDreams = asyncHandler(async (_req, res) => {
  res.json(await dreamsService.listDreams());
});

export const createDream = asyncHandler(async (req, res) => {
  res.json(await dreamsService.createDream(req.body));
});

export const updateDream = asyncHandler(async (req, res) => {
  res.json(await dreamsService.updateDream(req.params.id, req.body));
});

export const deleteDream = asyncHandler(async (req, res) => {
  res.json(await dreamsService.deleteDream(req.params.id));
});

export const reorderDreams = asyncHandler(async (req, res) => {
  res.json(await dreamsService.reorderDreams(req.body.order));
});
