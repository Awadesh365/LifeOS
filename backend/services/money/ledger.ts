export const ACCOUNT_TYPES = [
  'bank',
  'cash',
  'credit_card',
  'loan',
  'deposit',
  'investment',
  'manual_asset',
  'manual_liability',
] as const;

export const TRANSACTION_TYPES = [
  'income',
  'expense',
  'transfer',
  'refund',
  'fee',
  'deposit_funding',
  'investment_contribution',
  'debt_payment',
  'adjustment',
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export interface PostingDraft {
  accountId: string;
  amount: string;
  role: string;
}

export interface TransactionDraft {
  type: TransactionType;
  amount: string;
  sourceAccountId?: string | null;
  destinationAccountId?: string | null;
  sourceAccountType?: AccountType | null;
  destinationAccountType?: AccountType | null;
}

const MONEY_PATTERN = /^\d{1,16}(?:\.\d{1,2})?$/;

export function parseMoneyToMinor(value: unknown, field = 'amount'): bigint {
  const normalized = typeof value === 'number' ? String(value) : String(value ?? '').trim();
  if (!MONEY_PATTERN.test(normalized)) throw new Error(`${field} must be a positive amount with at most 2 decimal places`);
  const [whole, fraction = ''] = normalized.split('.');
  const minor = BigInt(whole) * 100n + BigInt((fraction + '00').slice(0, 2));
  if (minor <= 0n) throw new Error(`${field} must be greater than zero`);
  return minor;
}

export function minorToMoney(value: bigint): string {
  const sign = value < 0n ? '-' : '';
  const absolute = value < 0n ? -value : value;
  return `${sign}${absolute / 100n}.${String(absolute % 100n).padStart(2, '0')}`;
}

export function isLiability(type: AccountType): boolean {
  return type === 'credit_card' || type === 'loan' || type === 'manual_liability';
}

export function displayBalance(rawMinor: bigint, type: AccountType): bigint {
  return isLiability(type) ? -rawMinor : rawMinor;
}

export function buildPostings(input: TransactionDraft): PostingDraft[] {
  const amount = parseMoneyToMinor(input.amount);
  const source = input.sourceAccountId ?? null;
  const destination = input.destinationAccountId ?? null;
  const sourceType = input.sourceAccountType ?? null;
  const destinationType = input.destinationAccountType ?? null;

  if (input.type === 'income' || input.type === 'refund') {
    if (!destination || !destinationType) throw new Error('A destination account is required');
    return [{ accountId: destination, amount: minorToMoney(amount), role: input.type }];
  }

  if (input.type === 'expense' || input.type === 'fee') {
    if (!source || !sourceType) throw new Error('A source account is required');
    return [{ accountId: source, amount: minorToMoney(-amount), role: input.type }];
  }

  if (input.type === 'adjustment') {
    const accountId = destination ?? source;
    const accountType = destinationType ?? sourceType;
    if (!accountId || !accountType) throw new Error('An account is required');
    return [{ accountId, amount: minorToMoney(isLiability(accountType) ? -amount : amount), role: 'opening_balance' }];
  }

  if (!source || !destination || !sourceType || !destinationType) {
    throw new Error('Source and destination accounts are required');
  }
  if (source === destination) throw new Error('Source and destination accounts must be different');

  return [
    { accountId: source, amount: minorToMoney(-amount), role: 'source' },
    { accountId: destination, amount: minorToMoney(amount), role: 'destination' },
  ];
}

export function isCashflowExpense(type: TransactionType): boolean {
  return type === 'expense' || type === 'fee';
}

export function isCashflowIncome(type: TransactionType): boolean {
  return type === 'income' || type === 'refund';
}
