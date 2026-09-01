import { Op } from 'sequelize';
import { models, sequelize } from '../../models/index.js';
import { createHttpError } from '../../utils/httpError.js';
import { shortId } from '../../utils/id.js';
import {
  ACCOUNT_TYPES,
  TRANSACTION_TYPES,
  buildPostings,
  displayBalance,
  isCashflowIncome,
  isLiability,
  minorToMoney,
  parseMoneyToMinor,
  type AccountType,
  type TransactionType,
} from './ledger.js';

type Row = Record<string, any>;

function ownerId(value: unknown) {
  if (typeof value !== 'string' || !value.trim()) throw createHttpError(401, 'Authentication required');
  return value.trim().toLowerCase();
}

function requiredString(value: unknown, name: string, max = 180) {
  if (typeof value !== 'string' || !value.trim()) throw createHttpError(400, `${name} is required`);
  return value.trim().slice(0, max);
}

function optionalString(value: unknown, max = 2000) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : null;
}

function enumValue<T extends readonly string[]>(value: unknown, allowed: T, name: string) {
  if (typeof value !== 'string' || !allowed.includes(value as T[number])) {
    throw createHttpError(400, `${name} must be one of: ${allowed.join(', ')}`);
  }
  return value as T[number];
}

function dateValue(value: unknown, name = 'Date') {
  const date = requiredString(value, name, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) {
    throw createHttpError(400, `${name} must be a valid YYYY-MM-DD date`);
  }
  return date;
}

function currencyValue(value: unknown) {
  const currency = typeof value === 'string' && value.trim() ? value.trim().toUpperCase() : 'INR';
  if (!/^[A-Z]{3}$/.test(currency)) throw createHttpError(400, 'Currency must be a 3-letter code');
  return currency;
}

function optionalMoneyToMinor(value: unknown, field: string) {
  const normalized = typeof value === 'number' ? String(value) : String(value ?? '').trim();
  if (!normalized || /^0+(?:\.0{1,2})?$/.test(normalized)) return 0n;
  return parseMoneyToMinor(normalized, field);
}

function safeFreeText(value: unknown, max = 2000) {
  const text = optionalString(value, max);
  if (text && /\b(?:cvv|cvc|upi\s*pin|card\s*pin|otp|one[ -]time password)\b/i.test(text)) {
    throw createHttpError(400, 'Do not store PINs, CVVs, or OTPs in Money');
  }
  return text;
}

function toPlain(row: Row) {
  return typeof row.toJSON === 'function' ? row.toJSON() : row;
}

function postingBalanceMap(postings: Row[]) {
  const balances = new Map<string, bigint>();
  for (const posting of postings) {
    balances.set(posting.accountId, (balances.get(posting.accountId) ?? 0n) + parseSignedMoney(posting.amount));
  }
  return balances;
}

function parseSignedMoney(value: unknown): bigint {
  const normalized = String(value ?? '0').trim();
  const negative = normalized.startsWith('-');
  const absolute = negative ? normalized.slice(1) : normalized;
  if (!/^\d{1,16}(?:\.\d{1,2})?$/.test(absolute)) throw new Error('Stored money value is invalid');
  const [whole, fraction = ''] = absolute.split('.');
  const minor = BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2));
  return negative ? -minor : minor;
}

function serializeAccount(accountInput: Row, rawBalance: bigint) {
  const account = toPlain(accountInput);
  const type = account.type as AccountType;
  return {
    ...account,
    balance: minorToMoney(displayBalance(rawBalance, type)),
    balanceKind: isLiability(type) ? 'liability' : 'asset',
  };
}

async function ownedAccounts(userId: string, ids: string[], transaction?: any) {
  const unique = [...new Set(ids.filter(Boolean))];
  if (!unique.length) return new Map<string, Row>();
  const rows = await models.FinancialAccount.findAll({
    where: { id: unique, userId, status: 'active' },
    ...(transaction ? { transaction, lock: transaction.LOCK.UPDATE } : {}),
  });
  if (rows.length !== unique.length) throw createHttpError(400, 'Choose active accounts that belong to you');
  return new Map(rows.map((row) => [String(row.get('id')), toPlain(row)]));
}

export async function listAccounts(userIdInput: unknown) {
  const userId = ownerId(userIdInput);
  const [accounts, postings] = await Promise.all([
    models.FinancialAccount.findAll({ where: { userId, status: 'active' }, order: [['createdAt', 'ASC']] }),
    models.LedgerPosting.findAll({ where: { userId }, attributes: ['accountId', 'amount'], raw: true }),
  ]);
  const balances = postingBalanceMap(postings as Row[]);
  return accounts.map((account) => serializeAccount(account, balances.get(String(account.get('id'))) ?? 0n));
}

export async function createAccount(userIdInput: unknown, input: unknown) {
  const userId = ownerId(userIdInput);
  const body = (input ?? {}) as Row;
  const type = enumValue(body.type, ACCOUNT_TYPES, 'Account type');
  const name = requiredString(body.name, 'Account name', 140);
  const openingMinor = optionalMoneyToMinor(body.openingBalance, 'Opening balance');
  const currency = currencyValue(body.currency);

  return sequelize.transaction(async (transaction) => {
    const created = await models.FinancialAccount.create({
      id: shortId(), userId, name, type,
      institution: safeFreeText(body.institution, 140), currency,
      includeInNetWorth: body.includeInNetWorth !== false,
      status: 'active', valuationAsOf: new Date().toISOString().slice(0, 10),
    }, { transaction });
    if (openingMinor > 0n) {
      const moneyTransaction = await models.MoneyTransaction.create({
        id: shortId(), userId, semanticType: 'adjustment', occurredOn: dateValue(body.openingDate ?? new Date().toISOString().slice(0, 10)),
        amount: minorToMoney(openingMinor), currency, description: `Opening balance · ${name}`,
        source: 'manual', reconciliationStatus: 'unreconciled',
      }, { transaction });
      await models.LedgerPosting.create({
        id: shortId(), userId, transactionId: moneyTransaction.get('id'), accountId: created.get('id'),
        amount: minorToMoney(isLiability(type) ? -openingMinor : openingMinor), role: 'opening_balance',
      }, { transaction });
    }
    return serializeAccount(created, isLiability(type) ? -openingMinor : openingMinor);
  });
}

export async function listTransactions(userIdInput: unknown, query: Row = {}) {
  const userId = ownerId(userIdInput);
  const where: Row = { userId };
  if (query.type) where.semanticType = enumValue(query.type, TRANSACTION_TYPES, 'Transaction type');
  if (query.from || query.to) where.occurredOn = {
    ...(query.from ? { [Op.gte]: dateValue(query.from, 'From date') } : {}),
    ...(query.to ? { [Op.lte]: dateValue(query.to, 'To date') } : {}),
  };
  if (query.search) {
    const search = String(query.search).trim().slice(0, 80);
    (where as any)[Op.or] = [
      { description: { [Op.iLike]: `%${search}%` } },
      { merchant: { [Op.iLike]: `%${search}%` } },
      { category: { [Op.iLike]: `%${search}%` } },
    ];
  }
  const limit = Math.min(200, Math.max(1, Number(query.limit) || 100));
  return models.MoneyTransaction.findAll({
    where,
    include: [{ model: models.LedgerPosting, as: 'postings', include: [{ model: models.FinancialAccount, as: 'account', attributes: ['id', 'name', 'type'] }] }],
    order: [['occurredOn', 'DESC'], ['createdAt', 'DESC']], limit,
  });
}

export async function getTransaction(userIdInput: unknown, id: string) {
  const userId = ownerId(userIdInput);
  const found = await models.MoneyTransaction.findOne({
    where: { id, userId },
    include: [{ model: models.LedgerPosting, as: 'postings', include: [{ model: models.FinancialAccount, as: 'account', attributes: ['id', 'name', 'type'] }] }],
  });
  if (!found) throw createHttpError(404, 'Transaction not found');
  return found;
}

export async function createTransaction(userIdInput: unknown, input: unknown) {
  const userId = ownerId(userIdInput);
  const body = (input ?? {}) as Row;
  const semanticType = enumValue(body.semanticType, TRANSACTION_TYPES, 'Transaction type');
  let amountMinor: bigint;
  try { amountMinor = parseMoneyToMinor(body.amount); } catch (error) { throw createHttpError(400, (error as Error).message); }
  const sourceAccountId = optionalString(body.sourceAccountId, 80);
  const destinationAccountId = optionalString(body.destinationAccountId, 80);

  return sequelize.transaction(async (dbTransaction) => {
    const accounts = await ownedAccounts(userId, [sourceAccountId ?? '', destinationAccountId ?? ''], dbTransaction);
    const source = sourceAccountId ? accounts.get(sourceAccountId) : null;
    const destination = destinationAccountId ? accounts.get(destinationAccountId) : null;
    if (source && destination && source.currency !== destination.currency) throw createHttpError(400, 'Cross-currency transfers are not supported yet');
    if (semanticType === 'income' && destination && isLiability(destination.type)) throw createHttpError(400, 'Income must enter an asset account');
    if (semanticType === 'deposit_funding' && destination?.type !== 'deposit') throw createHttpError(400, 'Deposit funding must go to a deposit account');
    if (semanticType === 'investment_contribution' && destination?.type !== 'investment') throw createHttpError(400, 'Investment contributions must go to an investment account');
    if (semanticType === 'debt_payment' && destination && !isLiability(destination.type)) throw createHttpError(400, 'Debt payments must go to a liability account');
    let postingDrafts;
    try {
      postingDrafts = buildPostings({
        type: semanticType, amount: minorToMoney(amountMinor), sourceAccountId, destinationAccountId,
        sourceAccountType: source?.type, destinationAccountType: destination?.type,
      });
    } catch (error) {
      throw createHttpError(400, (error as Error).message);
    }
    const currency = currencyValue(body.currency ?? source?.currency ?? destination?.currency);
    if ((source && source.currency !== currency) || (destination && destination.currency !== currency)) {
      throw createHttpError(400, 'Transaction currency must match the selected accounts');
    }
    const description = optionalString(body.description, 180) ?? optionalString(body.merchant, 180) ?? semanticType.replaceAll('_', ' ');
    const created = await models.MoneyTransaction.create({
      id: shortId(), userId, semanticType, occurredOn: dateValue(body.occurredOn),
      amount: minorToMoney(amountMinor), currency, description,
      merchant: optionalString(body.merchant, 180), category: optionalString(body.category, 100),
      notes: safeFreeText(body.notes), source: 'manual', reconciliationStatus: 'unreconciled',
    }, { transaction: dbTransaction });
    await models.LedgerPosting.bulkCreate(postingDrafts.map((posting) => ({
      id: shortId(), userId, transactionId: created.get('id'), ...posting,
    })), { transaction: dbTransaction });
    return getTransactionWithin(userId, String(created.get('id')), dbTransaction);
  });
}

async function getTransactionWithin(userId: string, id: string, transaction: any) {
  return models.MoneyTransaction.findOne({
    where: { id, userId }, transaction,
    include: [{ model: models.LedgerPosting, as: 'postings', include: [{ model: models.FinancialAccount, as: 'account', attributes: ['id', 'name', 'type'] }] }],
  });
}

export async function getOverview(userIdInput: unknown, query: Row = {}) {
  const userId = ownerId(userIdInput);
  const now = new Date();
  const year = Number(query.year) || now.getFullYear();
  const month = Number(query.month) || now.getMonth() + 1;
  if (!Number.isInteger(year) || year < 2000 || year > 2200 || !Number.isInteger(month) || month < 1 || month > 12) {
    throw createHttpError(400, 'Choose a valid month and year');
  }
  const from = `${year}-${String(month).padStart(2, '0')}-01`;
  const nextMonth = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const [accounts, postings, periodTransactions, periodPostings, recent] = await Promise.all([
    models.FinancialAccount.findAll({ where: { userId, status: 'active' }, order: [['createdAt', 'ASC']] }),
    models.LedgerPosting.findAll({ where: { userId }, attributes: ['accountId', 'amount'], raw: true }),
    models.MoneyTransaction.findAll({ where: { userId, occurredOn: { [Op.gte]: from, [Op.lt]: nextMonth } }, raw: true }),
    models.LedgerPosting.findAll({
      where: { userId }, attributes: ['accountId', 'amount'], raw: true,
      include: [{ model: models.MoneyTransaction, as: 'transaction', required: true, attributes: [], where: { userId, semanticType: { [Op.ne]: 'adjustment' }, occurredOn: { [Op.gte]: from, [Op.lt]: nextMonth } } }],
    }),
    listTransactions(userId, { limit: 8 }),
  ]);
  const balances = postingBalanceMap(postings as Row[]);
  const serializedAccounts = accounts.map((account) => serializeAccount(account, balances.get(String(account.get('id'))) ?? 0n));
  let assets = 0n; let liabilities = 0n; let cash = 0n; let investments = 0n; let income = 0n; let spending = 0n; let savedInvested = 0n; let debtCost = 0n;
  for (const account of serializedAccounts) {
    const value = parseSignedMoney(account.balance);
    if (account.includeInNetWorth) (account.balanceKind === 'liability' ? liabilities += value : assets += value);
    if (account.type === 'bank' || account.type === 'cash') cash += value;
    if (account.type === 'investment') investments += value;
  }
  for (const transaction of periodTransactions as Row[]) {
    const value = parseSignedMoney(transaction.amount);
    const type = transaction.semanticType as TransactionType;
    if (isCashflowIncome(type)) income += value;
    if (type === 'expense') spending += value;
    if (type === 'deposit_funding' || type === 'investment_contribution') savedInvested += value;
    if (type === 'fee') debtCost += value;
  }
  const cashAccountIds = new Set(serializedAccounts.filter((account) => account.type === 'bank' || account.type === 'cash').map((account) => account.id));
  const netCashChange = (periodPostings as Row[]).reduce((total, posting) => cashAccountIds.has(posting.accountId) ? total + parseSignedMoney(posting.amount) : total, 0n);
  return {
    period: { month, year, from, toExclusive: nextMonth },
    totals: {
      netWorth: minorToMoney(assets - liabilities), assets: minorToMoney(assets), liabilities: minorToMoney(liabilities),
      cash: minorToMoney(cash), investments: minorToMoney(investments),
    },
    cashflow: {
      income: minorToMoney(income), spending: minorToMoney(spending), savedInvested: minorToMoney(savedInvested),
      debtCost: minorToMoney(debtCost), net: minorToMoney(netCashChange),
    },
    completeness: { current: serializedAccounts.length, stale: 0, issues: 0, status: serializedAccounts.length ? 'current' : 'empty' },
    accounts: serializedAccounts,
    recent,
  };
}
