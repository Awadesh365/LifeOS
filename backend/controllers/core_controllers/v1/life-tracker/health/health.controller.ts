import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as healthService from '../../../../../services/v1/life-tracker/health/health.service';

export const getHealthLog = asyncHandler(async (req, res) => {
  res.json(await healthService.getHealthLog(req.query.date as string | undefined));
});

export const upsertHealthLog = asyncHandler(async (req, res) => {
  res.json(await healthService.upsertHealthLog(req.body));
});

export const getWeeklyHealthLogs = asyncHandler(async (_req, res) => {
  res.json(await healthService.getWeeklyHealthLogs());
});
