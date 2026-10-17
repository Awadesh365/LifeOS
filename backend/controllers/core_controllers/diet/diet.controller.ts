import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as dietService from '../../../services/diet/diet.service.js';
import * as dietAiService from '../../../services/diet/ai.service.js';
import * as productScanService from '../../../services/diet/product-scan.service.js';

export const listLogs = asyncHandler(async (req, res) => {
  res.json(await dietService.listLogs(req.query.date as string | undefined));
});

export const createLog = asyncHandler(async (req, res) => {
  res.json(await dietService.createLog(req.body));
});

export const deleteLog = asyncHandler(async (req, res) => {
  res.json(await dietService.deleteLog(req.params.id));
});

export const listSupplements = asyncHandler(async (_req, res) => {
  res.json(await dietService.listSupplements());
});

export const createSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.createSupplement(req.body));
});

export const updateSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.updateSupplement(req.params.id, req.body));
});

export const consumeSupplement = asyncHandler(async (req, res) => {
  res.json(await dietService.consumeSupplement(req.params.id, req.body.amount));
});

export const getRecord = asyncHandler(async (req, res) => {
  res.json(await dietService.getRecord(req.params.key, String(req.session.userId || '')));
});

export const upsertRecord = asyncHandler(async (req, res) => {
  res.json(await dietService.upsertRecord(req.params.key, req.body.value, String(req.session.userId || '')));
});

export const scanMeal = asyncHandler(async (req, res) => {
  res.json(await dietAiService.scanMeal(req.body));
});

export const askFitnessAssistant = asyncHandler(async (req, res) => {
  res.json(await dietAiService.askFitnessAssistant(req.body));
});

export const scanNutritionLabel = asyncHandler(async (req, res) => {
  res.json(await dietAiService.scanNutritionLabel(req.body));
});

export const lookupProductByBarcode = asyncHandler(async (req, res) => {
  res.json(await productScanService.lookupProductByBarcode(req.params.barcode));
});
