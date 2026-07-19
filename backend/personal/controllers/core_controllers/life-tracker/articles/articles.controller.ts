import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as articlesService from '../../../../services/life-tracker/articles/articles.service.js';

export const listArticles = asyncHandler(async (_req, res) => {
  res.json(articlesService.readArticleTree());
});
