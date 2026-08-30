import { Router } from 'express';

import * as preferencesController from '../../controllers/api_controllers/preferences/preferences.api.controller.js';

const router = Router();

router.get('/:userId/theme', preferencesController.getThemePreference);
router.put('/:userId/theme', preferencesController.setThemePreference);

export default router;
