import { asyncHandler } from '../../../../../utils/asyncHandler';
import * as dashboardService from '../../../../../services/v1/life-tracker/dashboard/dashboard.service';

export const getDashboard = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getDashboardSummary());
});
