import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as fundsService from '../../../../../services/v1/life-tracker/funds/funds.service';

export const listFunds = asyncHandler(async (_req, res) => {
  res.json(await fundsService.listFunds());
});

export const createFund = asyncHandler(async (req, res) => {
  res.json(await fundsService.createFund(req.body));
});

export const updateFund = asyncHandler(async (req, res) => {
  res.json(await fundsService.updateFund(req.params.id, req.body));
});

export const depositFund = asyncHandler(async (req, res) => {
  res.json(await fundsService.depositFund(req.params.id, req.body.amount));
});

export const getSummary = asyncHandler(async (_req, res) => {
  res.json(await fundsService.getSummary());
});
