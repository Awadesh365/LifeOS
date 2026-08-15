import { Router } from 'express';

import * as contentApiController from '../../controllers/api_controllers/content/content.api.controller.js';

const router = Router();

router.get('/', contentApiController.getContent);
router.get('/strong-stack', contentApiController.getStrongStack);
router.get('/quote', contentApiController.getRandomQuote);

export default router;
