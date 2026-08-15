import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as futurePlansService from '../../../services/futurePlans/futurePlans.service.js';

export const listFuturePlans = asyncHandler(async (_req, res) => {
  res.json(await futurePlansService.listFuturePlans());
});

export const createFuturePlan = asyncHandler(async (req, res) => {
  res.json(await futurePlansService.createFuturePlan(req.body));
});

export const updateFuturePlan = asyncHandler(async (req, res) => {
  res.json(await futurePlansService.updateFuturePlan(req.params.id, req.body));
});

export const deleteFuturePlan = asyncHandler(async (req, res) => {
  res.json(await futurePlansService.deleteFuturePlan(req.params.id));
});
