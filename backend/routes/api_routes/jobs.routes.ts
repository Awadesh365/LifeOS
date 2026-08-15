import { Router } from 'express';

import * as jobsApiController from '../../controllers/api_controllers/jobs/jobs.api.controller.js';

const router = Router();

router.get('/', jobsApiController.listJobs);
router.post('/', jobsApiController.createJob);
router.put('/:id', jobsApiController.updateJob);
router.patch('/:id/status', jobsApiController.updateJobStatus);
router.delete('/:id', jobsApiController.deleteJob);

export default router;
