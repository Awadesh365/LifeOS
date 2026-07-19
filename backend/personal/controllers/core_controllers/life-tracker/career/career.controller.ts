import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as careerService from '../../../../services/life-tracker/career/career.service.js';

export const listCareerEntries = asyncHandler(async (_req, res) => {
  res.json(await careerService.listCareerEntries());
});

export const createCareerEntry = asyncHandler(async (req, res) => {
  res.json(await careerService.createCareerEntry(req.body));
});

export const updateCareerEntry = asyncHandler(async (req, res) => {
  res.json(await careerService.updateCareerEntry(req.params.id, req.body));
});

export const deleteCareerEntry = asyncHandler(async (req, res) => {
  res.json(await careerService.deleteCareerEntry(req.params.id));
});
