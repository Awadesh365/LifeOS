import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as wealthService from '../../../services/wealth/wealth.service.js';

export const listEntries = asyncHandler(async (req, res) => {
  res.json(await wealthService.listEntries(req.query.month as string | undefined, req.query.year as string | undefined));
});

export const createEntry = asyncHandler(async (req, res) => {
  res.json(await wealthService.createEntry(req.body));
});

export const deleteEntry = asyncHandler(async (req, res) => {
  res.json(await wealthService.deleteEntry(req.params.id));
});

export const listInvestments = asyncHandler(async (_req, res) => {
  res.json(await wealthService.listInvestments());
});

export const createInvestment = asyncHandler(async (req, res) => {
  res.json(await wealthService.createInvestment(req.body));
});

export const updateInvestment = asyncHandler(async (req, res) => {
  res.json(await wealthService.updateInvestment(req.params.id, req.body));
});

export const getSummary = asyncHandler(async (req, res) => {
  res.json(await wealthService.getSummary(req.query.month as string | undefined, req.query.year as string | undefined));
});
