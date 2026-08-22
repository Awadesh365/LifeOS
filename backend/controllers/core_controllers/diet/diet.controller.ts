import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as dietService from '../../../services/diet/diet.service.js';

export const listLogs = asyncHandler(async (req, res) => {
  res.json(await dietService.listLogs(req.query.date as string | undefined));
});

export const createLog = asyncHandler(async (req, res) => {
  res.json(await dietService.createLog(req.body));
});

export const deleteLog = asyncHandler(async (req, res) => {
  res.json(await dietService.deleteLog(req.params.id));
});

export const listSupplements = asyncHandler(async (_req, res) => {
  res.json(await dietService.listSupplements());
});

export const createSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.createSupplement(req.body));
});

export const updateSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.updateSupplement(req.params.id, req.body));
});

export const consumeSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.consumeSupplement(req.params.id, req.body.amount));
});

export const getRecord = asyncHandler(async (req, res) => {
  res.json(await dietService.getRecord(req.params.key));
});

export const upsertRecord = asyncHandler(async (req, res) => {
  res.json(await dietService.upsertRecord(req.params.key, req.body.value));
});
