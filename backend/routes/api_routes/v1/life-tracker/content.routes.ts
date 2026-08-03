import { Router } from 'express';
import * as contentApiController from '../../../../controllers/api_controllers/v1/life-tracker/content/content.api.controller';

const router = Router();

router.get('/', contentApiController.getContent);
router.get('/strong-stack', contentApiController.getStrongStack);
router.get('/quote', contentApiController.getRandomQuote);

export default router;
