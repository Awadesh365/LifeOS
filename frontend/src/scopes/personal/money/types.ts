export type MoneyAccountType = 'bank' | 'cash' | 'credit_card' | 'loan' | 'deposit' | 'investment' | 'manual_asset' | 'manual_liability';
export type MoneyTransactionType = 'income' | 'expense' | 'transfer' | 'refund' | 'fee' | 'deposit_funding' | 'investment_contribution' | 'debt_payment' | 'adjustment';

export interface MoneyAccount {
  id: string;
  name: string;
  type: MoneyAccountType;
  institution?: string | null;
  currency: string;
  includeInNetWorth: boolean;
  status: string;
  valuationAsOf?: string | null;
  balance: string;
  balanceKind: 'asset' | 'liability';
}

export interface LedgerPosting {
  id: string;
  accountId: string;
  amount: string;
  role: string;
  account: Pick<MoneyAccount, 'id' | 'name' | 'type'>;
}

export interface MoneyTransaction {
  id: string;
  semanticType: MoneyTransactionType;
  occurredOn: string;
  amount: string;
  currency: string;
  description: string;
  merchant?: string | null;
  category?: string | null;
  notes?: string | null;
  source: string;
  reconciliationStatus: string;
  postings: LedgerPosting[];
}

export interface MoneyOverview {
  period: { month: number; year: number; from: string; toExclusive: string };
  totals: { netWorth: string; assets: string; liabilities: string; cash: string; investments: string };
  cashflow: { income: string; spending: string; savedInvested: string; debtCost: string; net: string };
  completeness: { current: number; stale: number; issues: number; status: 'current' | 'empty' };
  accounts: MoneyAccount[];
  recent: MoneyTransaction[];
}
