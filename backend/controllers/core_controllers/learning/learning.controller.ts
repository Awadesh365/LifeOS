import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as learningService from '../../../services/learning/learning.service.js';

export const getLearningTree = asyncHandler(async (_req, res) => {
  res.json(await learningService.getLearningTree());
});

export const createSection = asyncHandler(async (req, res) => {
  res.json(await learningService.createSection(req.body.title));
});

export const updateSection = asyncHandler(async (req, res) => {
  res.json(await learningService.updateSection(req.params.id, req.body.title));
});

export const deleteSection = asyncHandler(async (req, res) => {
  res.json(await learningService.deleteSection(req.params.id));
});

export const createItem = asyncHandler(async (req, res) => {
  res.json(await learningService.createItem(req.body));
});

export const updateItem = asyncHandler(async (req, res) => {
  res.json(await learningService.updateItem(req.params.id, req.body));
});

export const updateItemStatus = asyncHandler(async (req, res) => {
  res.json(await learningService.updateItemStatus(req.params.id, req.body.status));
});

export const deleteItem = asyncHandler(async (req, res) => {
  res.json(await learningService.deleteItem(req.params.id));
});

export const reorderItems = asyncHandler(async (req, res) => {
  res.json(await learningService.reorderItems(req.body.order));
});
