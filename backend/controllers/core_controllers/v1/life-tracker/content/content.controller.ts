import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as contentService from '../../../../../services/v1/life-tracker/content/content.service';

export const getContent = asyncHandler(async (_req, res) => {
  res.json(contentService.getContent());
});

export const getStrongStack = asyncHandler(async (_req, res) => {
  res.json(contentService.getStrongStack());
});

export const getRandomQuote = asyncHandler(async (_req, res) => {
  res.json(contentService.getRandomQuote());
});
