import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as dashboardService from '../../../services/dashboard/dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  res.json(await dashboardService.getDashboardSummary(req.query.date));
});
