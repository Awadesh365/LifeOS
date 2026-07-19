import { Router } from 'express';

import * as careerApiController from '../../../controllers/api_controllers/life-tracker/career/career.api.controller.js';

const router = Router();

router.get('/', careerApiController.listCareerEntries);
router.post('/', careerApiController.createCareerEntry);
router.put('/:id', careerApiController.updateCareerEntry);
router.delete('/:id', careerApiController.deleteCareerEntry);

export default router;
