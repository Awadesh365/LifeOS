import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as jobsService from '../../../../services/life-tracker/jobs/jobs.service.js';

export const listJobs = asyncHandler(async (_req, res) => {
  res.json(await jobsService.listJobs());
});

export const createJob = asyncHandler(async (req, res) => {
  res.json(await jobsService.createJob(req.body));
});

export const updateJob = asyncHandler(async (req, res) => {
  res.json(await jobsService.updateJob(req.params.id, req.body));
});

export const updateJobStatus = asyncHandler(async (req, res) => {
  res.json(await jobsService.updateJobStatus(req.params.id, req.body.status));
});

export const deleteJob = asyncHandler(async (req, res) => {
  res.json(await jobsService.deleteJob(req.params.id));
});
