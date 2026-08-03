import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as futurePlansService from '../../../../../services/v1/life-tracker/futurePlans/futurePlans.service';

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
