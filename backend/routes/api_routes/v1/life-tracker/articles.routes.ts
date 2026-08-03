import { Router } from 'express';
import * as articlesApiController from '../../../../controllers/api_controllers/v1/life-tracker/articles/articles.api.controller';

const router = Router();

router.get('/', articlesApiController.listArticles);

export default router;
