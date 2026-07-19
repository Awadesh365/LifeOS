import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as contentService from '../../../../services/life-tracker/content/content.service.js';

export const getContent = asyncHandler(async (_req, res) => {
  res.json(contentService.getContent());
});

export const getStrongStack = asyncHandler(async (_req, res) => {
  res.json(contentService.getStrongStack());
});

export const getRandomQuote = asyncHandler(async (_req, res) => {
  res.json(contentService.getRandomQuote());
});
