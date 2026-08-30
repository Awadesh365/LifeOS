import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as preferencesService from '../../../services/preferences/preferences.service.js';

export const getThemePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.getThemePreference(req.session.userId));
});

export const setThemePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.setThemePreference(req.session.userId, req.body?.theme));
});

export const getAppearancePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.getAppearancePreference(req.session.userId));
});

export const setAppearancePreference = asyncHandler(async (req, res) => {
  res.json(await preferencesService.setAppearancePreference(req.session.userId, req.body));
});
