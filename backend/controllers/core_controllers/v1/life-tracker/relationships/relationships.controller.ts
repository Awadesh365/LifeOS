import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as relationshipsService from '../../../../../services/v1/life-tracker/relationships/relationships.service';

export const getRelationships = asyncHandler(async (_req, res) => {
  res.json(await relationshipsService.getRelationships());
});

export const upsertRelationship = asyncHandler(async (req, res) => {
  res.json(await relationshipsService.upsertRelationship(req.body));
});

export const createRelative = asyncHandler(async (req, res) => {
  res.json(await relationshipsService.createRelative(req.body));
});

export const updateRelative = asyncHandler(async (req, res) => {
  res.json(await relationshipsService.updateRelative(req.params.id, req.body));
});

export const deleteRelative = asyncHandler(async (req, res) => {
  res.json(await relationshipsService.deleteRelative(req.params.id));
});
