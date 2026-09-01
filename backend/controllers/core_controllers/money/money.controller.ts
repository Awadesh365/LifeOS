import { asyncHandler } from '../../../utils/asyncHandler.js';
import * as money from '../../../services/money/money.service.js';

export const overview = asyncHandler(async (req, res) => { res.json(await money.getOverview(req.session.userId, req.query)); });
export const listAccounts = asyncHandler(async (req, res) => { res.json(await money.listAccounts(req.session.userId)); });
export const createAccount = asyncHandler(async (req, res) => { res.status(201).json(await money.createAccount(req.session.userId, req.body)); });
export const listTransactions = asyncHandler(async (req, res) => { res.json(await money.listTransactions(req.session.userId, req.query)); });
export const getTransaction = asyncHandler(async (req, res) => { res.json(await money.getTransaction(req.session.userId, req.params.id)); });
export const createTransaction = asyncHandler(async (req, res) => { res.status(201).json(await money.createTransaction(req.session.userId, req.body)); });
