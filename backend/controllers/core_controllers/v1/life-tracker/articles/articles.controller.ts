import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as articlesService from '../../../../../services/v1/life-tracker/articles/articles.service';

export const listArticles = asyncHandler(async (_req, res) => {
  res.json(articlesService.readArticleTree());
});
