import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as training from '../../../services/training/training.service.js';

export const getProfile = asyncHandler(async (_req, res) => { res.json(await training.getProfile()); });
export const updateProfile = asyncHandler(async (req, res) => { res.json(await training.updateProfile(req.body)); });
export const listExercises = asyncHandler(async (req, res) => { res.json(await training.listExercises(req.query)); });
export const getExercise = asyncHandler(async (req, res) => { res.json(await training.getExercise(req.params.id)); });
export const getExerciseHistory = asyncHandler(async (req, res) => { res.json(await training.getExerciseHistory(req.params.id)); });
export const getProgression = asyncHandler(async (req, res) => { res.json(await training.getProgression(req.params.id, String(req.query.programExerciseId || ''))); });
export const listPrograms = asyncHandler(async (_req, res) => { res.json(await training.listPrograms()); });
export const activateProgram = asyncHandler(async (req, res) => { res.json(await training.activateProgram(req.params.id)); });
export const getToday = asyncHandler(async (req, res) => { res.json(await training.getToday(String(req.query.date || new Date().toISOString().slice(0, 10)))); });
export const startSession = asyncHandler(async (req, res) => { res.status(201).json(await training.startSession(req.body)); });
export const logSet = asyncHandler(async (req, res) => { res.status(201).json(await training.logSet(req.params.id, req.body)); });
export const completeSession = asyncHandler(async (req, res) => { res.json(await training.completeSession(req.params.id, req.body)); });
export const getReview = asyncHandler(async (req, res) => {
  const to = String(req.query.to || new Date().toISOString().slice(0, 10));
  const fromDate = new Date(`${to}T12:00:00Z`);
  fromDate.setUTCDate(fromDate.getUTCDate() - 27);
  res.json(await training.getReview(String(req.query.from || fromDate.toISOString().slice(0, 10)), to));
});
