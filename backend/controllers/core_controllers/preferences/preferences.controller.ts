import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as preferencesService from '../../../services/preferences/preferences.service.js';

export const getThemePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.getThemePreference(req.params.userId));
});

export const setThemePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.setThemePreference(req.params.userId, req.body?.theme));
});
