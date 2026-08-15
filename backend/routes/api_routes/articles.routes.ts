import { Router } from 'express';

import * as articlesApiController from '../../controllers/api_controllers/articles/articles.api.controller.js';

const router = Router();

router.get('/', articlesApiController.listArticles);

export default router;
