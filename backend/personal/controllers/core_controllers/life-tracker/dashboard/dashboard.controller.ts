import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as dashboardService from '../../../../services/life-tracker/dashboard/dashboard.service.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getDashboardSummary());
});
