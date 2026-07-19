import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as debtsService from '../../../../services/life-tracker/debts/debts.service.js';

export const listDebts = asyncHandler(async (_req, res) => {
  res.json(await debtsService.listDebts());
});

export const createDebt = asyncHandler(async (req, res) => {
  res.json(await debtsService.createDebt(req.body));
});

export const payDebt = asyncHandler(async (req, res) => {
  res.json(await debtsService.payDebt(req.params.id, req.body));
});

export const listPayments = asyncHandler(async (req, res) => {
  res.json(await debtsService.listPayments(req.params.id));
});

export const deleteDebt = asyncHandler(async (req, res) => {
  res.json(await debtsService.deleteDebt(req.params.id));
});
