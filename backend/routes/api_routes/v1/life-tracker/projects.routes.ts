import { Router } from 'express';
import * as projectsApiController from '../../../../controllers/api_controllers/v1/life-tracker/projects/projects.api.controller';

const router = Router();

router.get('/', projectsApiController.listProjects);
router.post('/', projectsApiController.createProject);
router.put('/:id', projectsApiController.updateProject);
router.delete('/:id', projectsApiController.deleteProject);

export default router;
