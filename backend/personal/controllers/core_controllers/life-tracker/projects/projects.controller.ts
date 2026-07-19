import { asyncHandler } from '../../../../utils/asyncHandler.js';
import * as projectsService from '../../../../services/life-tracker/projects/projects.service.js';

export const listProjects = asyncHandler(async (_req, res) => {
  res.json(await projectsService.listProjects());
});

export const createProject = asyncHandler(async (req, res) => {
  res.json(await projectsService.createProject(req.body));
});

export const updateProject = asyncHandler(async (req, res) => {
  res.json(await projectsService.updateProject(req.params.id, req.body));
});

export const deleteProject = asyncHandler(async (req, res) => {
  res.json(await projectsService.deleteProject(req.params.id));
});
