import { useCallback, useEffect, useState } from 'react';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogTitle, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { useToast } from '../../../components/common/ToastProvider';
import { moneyApi } from './api';
import type { MoneyAccount, MoneyAccountType, MoneyOverview, MoneyTransaction, MoneyTransactionType } from './types';
import './money.css';

const ACCOUNT_LABELS: Record<MoneyAccountType, string> = {
  bank: 'Bank account', cash: 'Cash', credit_card: 'Credit card', loan: 'Loan', deposit: 'FD / RD deposit',
  investment: 'Investment account', manual_asset: 'Manual asset', manual_liability: 'Manual liability',
};
const TRANSACTION_LABELS: Partial<Record<MoneyTransactionType, string>> = {
  expense: 'Expense', income: 'Income', transfer: 'Transfer', refund: 'Refund', fee: 'Fee',
  deposit_funding: 'Deposit funding', investment_contribution: 'Investment contribution', debt_payment: 'Debt payment', adjustment: 'Adjustment',
};
const CAPTURE_TYPES = ['expense', 'income', 'transfer', 'refund', 'fee', 'deposit_funding', 'investment_contribution', 'debt_payment'] as const;
const LIABILITY_TYPES: MoneyAccountType[] = ['credit_card', 'loan', 'manual_liability'];

function formatMoney(value: string | number, currency = 'INR', hidden = false) {
  if (hidden) return '••••••';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(Number(value));
}

function useMoneyData() {
  const [overview, setOverview] = useState<MoneyOverview | null>(null);
  const [accounts, setAccounts] = useState<MoneyAccount[]>([]);
  const [transactions, setTransactions] = useState<MoneyTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const [nextOverview, nextAccounts, nextTransactions] = await Promise.all([moneyApi.overview(), moneyApi.accounts(), moneyApi.transactions()]);
      setOverview(nextOverview); setAccounts(nextAccounts); setTransactions(nextTransactions);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to load Money.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  return { overview, accounts, transactions, setTransactions, loading, error, reload };
}

export default function MoneyPortal() {
  const location = useLocation();
  const data = useMoneyData();
  const [privacy, setPrivacy] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [detail, setDetail] = useState<MoneyTransaction | null>(null);
  const active = location.pathname.includes('/transactions') ? 1 : location.pathname.includes('/accounts') ? 2 : 0;
  return <>
    <Header title="Money" subtitle="One reconciled view of what happened and where you stand" />
    <Box className="money-shell">
      <Box className="money-toolbar">
        <Tabs value={active} variant="scrollable" allowScrollButtonsMobile>
          <Tab component={NavLink} to="/app/money" label="Overview" />
          <Tab component={NavLink} to="/app/money/transactions" label="Transactions" />
          <Tab component={NavLink} to="/app/money/accounts" label="Accounts" />
        </Tabs>
        <Stack direction="row" spacing={1}>
          <Tooltip title={privacy ? 'Show values' : 'Hide values'}><IconButton onClick={() => setPrivacy((value) => !value)}>{privacy ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}</IconButton></Tooltip>
          <Button variant="outlined" startIcon={<AccountBalanceWalletOutlinedIcon />} onClick={() => setAccountOpen(true)}>Account</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setTransactionOpen(true)}>Transaction</Button>
        </Stack>
      </Box>
      {data.error && <Alert severity="error" action={<Button onClick={() => void data.reload()}>Retry</Button>}>{data.error}</Alert>}
      {data.loading ? <Box className="money-loading"><CircularProgress /></Box> : <Routes>
        <Route index element={<Overview overview={data.overview} privacy={privacy} onDetail={setDetail} onAddAccount={() => setAccountOpen(true)} />} />
        <Route path="transactions" element={<Transactions initial={data.transactions} privacy={privacy} onDetail={setDetail} />} />
        <Route path="accounts" element={<Accounts accounts={data.accounts} privacy={privacy} onAdd={() => setAccountOpen(true)} />} />
        <Route path="*" element={<Navigate to="/app/money" replace />} />
      </Routes>}
    </Box>
    <AccountDialog open={accountOpen} onClose={() => setAccountOpen(false)} onSaved={data.reload} />
    <TransactionDialog accounts={data.accounts} open={transactionOpen} onClose={() => setTransactionOpen(false)} onSaved={data.reload} />
    <TransactionDetail transaction={detail} privacy={privacy} onClose={() => setDetail(null)} />
  </>;
}

function Overview({ overview, privacy, onDetail, onAddAccount }: { overview: MoneyOverview | null; privacy: boolean; onDetail: (transaction: MoneyTransaction) => void; onAddAccount: () => void }) {
  if (!overview || !overview.accounts.length) return <EmptyState title="Start with where your money lives" description="Add a bank, cash, card, deposit, investment, or liability account. Opening balances are recorded as adjustments—not income." action={<Button variant="contained" onClick={onAddAccount}>Add first account</Button>} />;
  const cards = [
    ['Net worth', overview.totals.netWorth, 'position'], ['Cash available', overview.totals.cash, 'cash'],
    ['Investments', overview.totals.investments, 'investment'], ['Liabilities', overview.totals.liabilities, 'liability'],
  ];
  return <Stack spacing={2.5}>
    <Box className="money-hero">
      <Box><Typography variant="overline">Financial position</Typography><Typography variant="h4">Know where you stand.</Typography><Typography color="text.secondary">Account movements drive every number below.</Typography></Box>
      <Chip color="success" variant="outlined" label={`${overview.completeness.current} sources current`} />
    </Box>
    <Box className="money-kpis">{cards.map(([label, value, tone]) => <Card variant="outlined" className={`money-kpi money-kpi--${tone}`} key={label}><Typography variant="caption">{label}</Typography><Typography variant="h4">{formatMoney(value, 'INR', privacy)}</Typography></Card>)}</Box>
    <Box className="money-grid">
      <Panel title="This month cashflow"><Box className="money-cashflow">{[
        ['Income', overview.cashflow.income], ['Spending', overview.cashflow.spending], ['Saved / invested', overview.cashflow.savedInvested], ['Debt cost / fees', overview.cashflow.debtCost],
      ].map(([label, value]) => <Box key={label}><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h6">{formatMoney(value, 'INR', privacy)}</Typography></Box>)}</Box><Typography variant="caption" color="text.secondary">Transfers between your own accounts are excluded.</Typography></Panel>
      <Panel title="Accounts"><Stack divider={<Divider flexItem />}>{overview.accounts.slice(0, 6).map((account) => <Box className="money-row" key={account.id}><Box><Typography fontWeight={700}>{account.name}</Typography><Typography variant="caption" color="text.secondary">{ACCOUNT_LABELS[account.type]}</Typography></Box><Typography fontWeight={800}>{formatMoney(account.balance, account.currency, privacy)}</Typography></Box>)}</Stack></Panel>
    </Box>
    <Panel title="Recent transactions">{overview.recent.length ? <TransactionTable rows={overview.recent} privacy={privacy} onDetail={onDetail} /> : <Typography color="text.secondary">No activity yet. Add income, an expense, or a transfer.</Typography>}</Panel>
  </Stack>;
}

function Transactions({ initial, privacy, onDetail }: { initial: MoneyTransaction[]; privacy: boolean; onDetail: (transaction: MoneyTransaction) => void }) {
  const [rows, setRows] = useState(initial); const [search, setSearch] = useState(''); const [type, setType] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { const timer = window.setTimeout(async () => { setLoading(true); try { setRows(await moneyApi.transactions(search, type)); } finally { setLoading(false); } }, 250); return () => window.clearTimeout(timer); }, [search, type]);
  return <Stack spacing={2}><Box className="money-filters"><TextField size="small" label="Search description, merchant, category" value={search} onChange={(event) => setSearch(event.target.value)} /><FormControl size="small" sx={{ minWidth: 190 }}><InputLabel>Semantic type</InputLabel><Select label="Semantic type" value={type} onChange={(event) => setType(event.target.value)}><MenuItem value="">All types</MenuItem>{CAPTURE_TYPES.map((item) => <MenuItem value={item} key={item}>{TRANSACTION_LABELS[item]}</MenuItem>)}</Select></FormControl>{loading && <CircularProgress size={22} />}</Box><Panel title={`${rows.length} money events`}>{rows.length ? <TransactionTable rows={rows} privacy={privacy} onDetail={onDetail} /> : <Typography color="text.secondary">No matching transactions.</Typography>}</Panel></Stack>;
}

function Accounts({ accounts, privacy, onAdd }: { accounts: MoneyAccount[]; privacy: boolean; onAdd: () => void }) {
  if (!accounts.length) return <EmptyState title="No financial accounts" description="Add an account to start a reconciled ledger." action={<Button variant="contained" onClick={onAdd}>Add account</Button>} />;
  return <Panel title="Financial accounts"><TableContainer><Table><TableHead><TableRow><TableCell>Account</TableCell><TableCell>Type</TableCell><TableCell>Source</TableCell><TableCell>Net worth</TableCell><TableCell align="right">Balance</TableCell></TableRow></TableHead><TableBody>{accounts.map((account) => <TableRow key={account.id}><TableCell><Typography fontWeight={700}>{account.name}</Typography><Typography variant="caption" color="text.secondary">{account.institution || account.currency}</Typography></TableCell><TableCell>{ACCOUNT_LABELS[account.type]}</TableCell><TableCell><Chip size="small" variant="outlined" label={account.valuationAsOf ? `Manual · ${account.valuationAsOf}` : 'Manual'} /></TableCell><TableCell>{account.includeInNetWorth ? 'Included' : 'Excluded'}</TableCell><TableCell align="right"><Typography fontWeight={800} color={account.balanceKind === 'liability' ? 'error.main' : 'text.primary'}>{formatMoney(account.balance, account.currency, privacy)}</Typography></TableCell></TableRow>)}</TableBody></Table></TableContainer></Panel>;
}

function TransactionTable({ rows, privacy, onDetail }: { rows: MoneyTransaction[]; privacy: boolean; onDetail: (transaction: MoneyTransaction) => void }) {
  return <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Date</TableCell><TableCell>Description</TableCell><TableCell>Type</TableCell><TableCell>Account movement</TableCell><TableCell>Category</TableCell><TableCell align="right">Amount</TableCell><TableCell>Status</TableCell></TableRow></TableHead><TableBody>{rows.map((row) => <TableRow hover tabIndex={0} className="money-transaction-row" key={row.id} onClick={() => onDetail(row)} onKeyDown={(event) => { if (event.key === 'Enter') onDetail(row); }}><TableCell>{row.occurredOn}</TableCell><TableCell><Typography fontWeight={700}>{row.description}</Typography><Typography variant="caption" color="text.secondary">{row.merchant || row.source}</Typography></TableCell><TableCell><Chip size="small" className={`money-type money-type--${row.semanticType}`} label={TRANSACTION_LABELS[row.semanticType] || row.semanticType} icon={row.semanticType === 'transfer' ? <CompareArrowsIcon /> : undefined} /></TableCell><TableCell>{row.postings?.map((posting) => posting.account?.name).filter(Boolean).join(' → ') || '—'}</TableCell><TableCell>{row.category || '—'}</TableCell><TableCell align="right"><Typography fontWeight={800}>{formatMoney(row.amount, row.currency, privacy)}</Typography></TableCell><TableCell><Chip size="small" variant="outlined" label={row.reconciliationStatus} /></TableCell></TableRow>)}</TableBody></Table></TableContainer>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <Card variant="outlined" className="money-panel"><Box className="money-panel__header"><Typography variant="h6">{title}</Typography></Box><Divider /><CardContent>{children}</CardContent></Card>; }

function AccountDialog({ open, onClose, onSaved }: { open: boolean; onClose: () => void; onSaved: () => Promise<void> }) {
  const toast = useToast(); const [saving, setSaving] = useState(false); const [form, setForm] = useState({ name: '', type: 'bank' as MoneyAccountType, institution: '', openingBalance: '', currency: 'INR', includeInNetWorth: true });
  const save = async () => { setSaving(true); try { await moneyApi.createAccount(form); toast.showSuccess('Account added to Money.'); onClose(); setForm({ name: '', type: 'bank', institution: '', openingBalance: '', currency: 'INR', includeInNetWorth: true }); await onSaved(); } catch (reason) { toast.showError(reason instanceof Error ? reason.message : 'Could not create account.'); } finally { setSaving(false); } };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>Add financial account</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField autoFocus label="Account name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /><TextField select label="Account type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as MoneyAccountType })}>{Object.entries(ACCOUNT_LABELS).map(([value, label]) => <MenuItem key={value} value={value}>{label}</MenuItem>)}</TextField><TextField label="Institution (optional)" value={form.institution} onChange={(event) => setForm({ ...form, institution: event.target.value })} /><TextField type="number" label={LIABILITY_TYPES.includes(form.type) ? 'Opening amount owed' : 'Opening balance'} value={form.openingBalance} onChange={(event) => setForm({ ...form, openingBalance: event.target.value })} helperText="Recorded as an opening adjustment, never as income." inputProps={{ min: 0, step: '0.01' }} /></Stack></DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" disabled={saving || !form.name.trim()} onClick={() => void save()}>{saving ? 'Saving…' : 'Add account'}</Button></DialogActions></Dialog>;
}

function TransactionDialog({ accounts, open, onClose, onSaved }: { accounts: MoneyAccount[]; open: boolean; onClose: () => void; onSaved: () => Promise<void> }) {
  const toast = useToast(); const today = new Date().toISOString().slice(0, 10); const [saving, setSaving] = useState(false); const [form, setForm] = useState({ semanticType: 'expense' as MoneyTransactionType, amount: '', occurredOn: today, description: '', merchant: '', category: '', sourceAccountId: '', destinationAccountId: '', notes: '' });
  const needsSource = !['income', 'refund'].includes(form.semanticType); const needsDestination = !['expense', 'fee'].includes(form.semanticType); const isTwoLeg = !['income', 'refund', 'expense', 'fee'].includes(form.semanticType);
  const save = async () => { setSaving(true); try { await moneyApi.createTransaction(form); toast.showSuccess(`${TRANSACTION_LABELS[form.semanticType]} saved with account movements.`); onClose(); setForm({ ...form, amount: '', description: '', merchant: '', category: '', notes: '' }); await onSaved(); } catch (reason) { toast.showError(reason instanceof Error ? reason.message : 'Could not save transaction.'); } finally { setSaving(false); } };
  return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>Add money event</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField select label="What happened?" value={form.semanticType} onChange={(event) => setForm({ ...form, semanticType: event.target.value as MoneyTransactionType, sourceAccountId: '', destinationAccountId: '' })}>{CAPTURE_TYPES.map((type) => <MenuItem key={type} value={type}>{TRANSACTION_LABELS[type]}</MenuItem>)}</TextField><Alert severity="info" icon={<PaymentsOutlinedIcon />}>{isTwoLeg ? 'This moves value between two owned positions and is excluded from spending.' : form.semanticType === 'expense' || form.semanticType === 'fee' ? 'This is consumption or cost and counts in cashflow.' : 'This brings external value into an account.'}</Alert><TextField type="number" label="Amount" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} inputProps={{ min: 0, step: '0.01' }} />{needsSource && <AccountSelect label={isTwoLeg ? 'From account' : 'Paid from'} value={form.sourceAccountId} accounts={accounts} onChange={(value) => setForm({ ...form, sourceAccountId: value })} />}{needsDestination && <AccountSelect label={isTwoLeg ? 'To account / position' : 'Received into'} value={form.destinationAccountId} accounts={accounts} onChange={(value) => setForm({ ...form, destinationAccountId: value })} exclude={form.sourceAccountId} />}<TextField label="Description" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /><Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr' }} gap={2}><TextField label="Merchant / counterparty" value={form.merchant} onChange={(event) => setForm({ ...form, merchant: event.target.value })} /><TextField label="Category" value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></Box><TextField type="date" label="Date" value={form.occurredOn} onChange={(event) => setForm({ ...form, occurredOn: event.target.value })} slotProps={{ inputLabel: { shrink: true } }} /><TextField multiline minRows={2} label="Notes (never enter PIN, CVV, or OTP)" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Stack></DialogContent><DialogActions><Button onClick={onClose}>Cancel</Button><Button variant="contained" disabled={saving || !form.amount || (needsSource && !form.sourceAccountId) || (needsDestination && !form.destinationAccountId)} onClick={() => void save()}>{saving ? 'Saving…' : 'Save event'}</Button></DialogActions></Dialog>;
}

function AccountSelect({ label, value, accounts, onChange, exclude }: { label: string; value: string; accounts: MoneyAccount[]; onChange: (value: string) => void; exclude?: string }) { return <TextField select label={label} value={value} onChange={(event) => onChange(event.target.value)}>{accounts.filter((account) => account.id !== exclude).map((account) => <MenuItem key={account.id} value={account.id}>{account.name} · {ACCOUNT_LABELS[account.type]} · {formatMoney(account.balance, account.currency)}</MenuItem>)}</TextField>; }

function TransactionDetail({ transaction, privacy, onClose }: { transaction: MoneyTransaction | null; privacy: boolean; onClose: () => void }) {
  return <Dialog open={Boolean(transaction)} onClose={onClose} fullWidth maxWidth="sm"><DialogTitle>{transaction?.description}</DialogTitle><DialogContent>{transaction && <Stack spacing={2}><Box><Typography variant="h4">{formatMoney(transaction.amount, transaction.currency, privacy)}</Typography><Chip size="small" label={TRANSACTION_LABELS[transaction.semanticType] || transaction.semanticType} /></Box><Divider /><Typography variant="overline">Account movement</Typography>{transaction.postings.map((posting) => <Box className="money-row" key={posting.id}><Box><Typography fontWeight={700}>{posting.account?.name}</Typography><Typography variant="caption" color="text.secondary">{posting.role}</Typography></Box><Typography fontWeight={800}>{formatMoney(posting.amount, transaction.currency, privacy)}</Typography></Box>)}<Divider /><Typography variant="body2">{transaction.occurredOn} · {transaction.category || 'Uncategorized'} · {transaction.source}</Typography>{transaction.notes && <Typography color="text.secondary">{transaction.notes}</Typography>}<Alert severity="info">Raw imported source and user enrichment remain separate. This record is {transaction.reconciliationStatus}.</Alert></Stack>}</DialogContent><DialogActions><Button onClick={onClose}>Close</Button></DialogActions></Dialog>;
}
