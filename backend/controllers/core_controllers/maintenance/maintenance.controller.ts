import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as maintenance from '../../../services/maintenance/maintenance.service.js';

export const summary = asyncHandler(async (req, res) => { res.json(await maintenance.getSummary(req.session.userId)); });
export const listAreas = asyncHandler(async (req, res) => { res.json(await maintenance.listAreas(req.session.userId)); });
export const createArea = asyncHandler(async (req, res) => { res.status(201).json(await maintenance.createArea(req.session.userId, req.body)); });
export const listItems = asyncHandler(async (req, res) => { res.json(await maintenance.listItems(req.session.userId, req.query)); });
export const createItem = asyncHandler(async (req, res) => { res.status(201).json(await maintenance.createItem(req.session.userId, req.body)); });
export const updateItem = asyncHandler(async (req, res) => { res.json(await maintenance.updateItem(req.session.userId, req.params.id, req.body)); });
export const completeItem = asyncHandler(async (req, res) => { res.status(201).json(await maintenance.completeItem(req.session.userId, req.params.id, req.body)); });
export const itemHistory = asyncHandler(async (req, res) => { res.json(await maintenance.getItemHistory(req.session.userId, req.params.id)); });
export const listAssets = asyncHandler(async (req, res) => { res.json(await maintenance.listAssets(req.session.userId)); });
export const createAsset = asyncHandler(async (req, res) => { res.status(201).json(await maintenance.createAsset(req.session.userId, req.body)); });
export const listRepairs = asyncHandler(async (req, res) => { res.json(await maintenance.listRepairs(req.session.userId)); });
export const createRepair = asyncHandler(async (req, res) => { res.status(201).json(await maintenance.createRepair(req.session.userId, req.body)); });
export const updateRepair = asyncHandler(async (req, res) => { res.json(await maintenance.updateRepair(req.session.userId, req.params.id, req.body)); });
export const getPlan = asyncHandler(async (req, res) => { res.json(await maintenance.getCurrentPlan(req.session.userId)); });
export const updatePlan = asyncHandler(async (req, res) => { res.json(await maintenance.updateCurrentPlan(req.session.userId, req.body)); });
