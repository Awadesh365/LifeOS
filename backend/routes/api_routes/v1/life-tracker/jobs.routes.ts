import { Router } from 'express';
import * as jobsApiController from '../../../../controllers/api_controllers/v1/life-tracker/jobs/jobs.api.controller';

const router = Router();

router.get('/', jobsApiController.listJobs);
router.post('/', jobsApiController.createJob);
router.put('/:id', jobsApiController.updateJob);
router.patch('/:id/status', jobsApiController.updateJobStatus);
router.delete('/:id', jobsApiController.deleteJob);

export default router;
