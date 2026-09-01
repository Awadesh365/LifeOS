import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type Href, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Screen } from '@/components/screen';
import { Button, Card, SectionTitle, StateMessage } from '@/components/ui';
import { api } from '@/services/api';
import { cacheMoneyOverview, flushMoneyTransactions, readCachedMoneyOverview, readPendingMoneyTransactions } from '@/services/money-offline';
import { radii, spacing, type ThemeColors } from '@/theme';
import { useLifeOSTheme } from '@/theme/provider';
import type { MoneyTransactionType } from '@/types/api';
import { useAuth } from '@/auth/provider';

const LABELS: Record<MoneyTransactionType, string> = { income: 'Income', expense: 'Expense', transfer: 'Transfer', refund: 'Refund', fee: 'Fee', deposit_funding: 'Deposit funding', investment_contribution: 'Investment', debt_payment: 'Debt payment', adjustment: 'Adjustment' };

export default function MoneyHome() {
  const router = useRouter(); const { colors } = useLifeOSTheme(); const { user } = useAuth(); const styles = createStyles(colors); const [hidden, setHidden] = useState(false); const userId = user!.id;
  const overview = useQuery({ queryKey: ['money-overview', userId], queryFn: async ({ signal }) => { await flushMoneyTransactions(userId); try { const current = await api.moneyOverview(signal); await cacheMoneyOverview(userId, current); return { data: current, cached: false }; } catch (error) { const cached = await readCachedMoneyOverview(userId); if (cached) return { data: cached, cached: true }; throw error; } } });
  const pending = useQuery({ queryKey: ['money-pending', userId], queryFn: () => readPendingMoneyTransactions(userId) });
  const money = overview.data?.data;
  const amount = (value: string) => hidden ? '••••••' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value));
  return <Screen eyebrow="Current financial state" title="Money" refreshing={overview.isRefetching} onRefresh={() => void Promise.all([overview.refetch(), pending.refetch()])} action={<Pressable accessibilityLabel={hidden ? 'Show balances' : 'Hide balances'} onPress={() => setHidden((value) => !value)} style={styles.eye}><MaterialCommunityIcons color={colors.ink} name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} /></Pressable>}>
    {overview.data?.cached ? <View style={styles.banner}><MaterialCommunityIcons color={colors.accent} name="cloud-off-outline" size={18} /><Text style={styles.bannerText}>Offline · showing cached state</Text></View> : null}
    {(pending.data?.length ?? 0) > 0 ? <View style={styles.banner}><MaterialCommunityIcons color={colors.accent} name="sync" size={18} /><Text style={styles.bannerText}>{pending.data?.length} manual {pending.data?.length === 1 ? 'entry' : 'entries'} waiting to sync</Text></View> : null}
    {overview.isPending ? <StateMessage loading title="Loading Money" message="Checking your accounts and recent movements." /> : overview.isError || !money ? <StateMessage title="Money unavailable" message="Pull down to retry the connection." /> : money.accounts.length === 0 ? <StateMessage icon="wallet-plus-outline" title="Start with an account" message="Opening balances are adjustments, not income." action={<Button label="Add first account" onPress={() => router.push('/money/add?kind=account' as Href)} />} /> : <>
      <View style={styles.hero}><Text style={styles.heroLabel}>Net worth</Text><Text style={styles.heroValue}>{amount(money.totals.netWorth)}</Text><View style={styles.heroMeta}><Text style={styles.heroMetaText}>Cash {amount(money.totals.cash)}</Text><Text style={styles.heroMetaText}>{money.completeness.current} sources current</Text></View></View>
      <View style={styles.quick}><Quick icon="cart-outline" label="Expense" onPress={() => router.push('/money/add?type=expense' as Href)} /><Quick icon="bank-transfer-in" label="Income" onPress={() => router.push('/money/add?type=income' as Href)} /><Quick icon="swap-horizontal" label="Transfer" onPress={() => router.push('/money/add?type=transfer' as Href)} /><Quick icon="wallet-plus-outline" label="Account" onPress={() => router.push('/money/add?kind=account' as Href)} /></View>
      <View style={styles.section}><SectionTitle title="This month" detail="Transfers excluded" /><Card><View style={styles.metrics}>{[['Income', money.cashflow.income], ['Spent', money.cashflow.spending], ['Saved / invested', money.cashflow.savedInvested], ['Debt cost', money.cashflow.debtCost]].map(([label, value]) => <View key={label} style={styles.metric}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricValue}>{amount(value ?? '0')}</Text></View>)}</View></Card></View>
      <View style={styles.section}><SectionTitle title="Accounts" detail={`${money.accounts.length} active`} />{money.accounts.slice(0, 5).map((account) => <Card key={account.id}><View style={styles.row}><View style={styles.accountIcon}><MaterialCommunityIcons color={colors.primary} name={account.balanceKind === 'liability' ? 'credit-card-outline' : 'bank-outline'} size={20} /></View><View style={styles.copy}><Text style={styles.rowTitle}>{account.name}</Text><Text style={styles.rowMeta}>{account.type.replaceAll('_', ' ')}</Text></View><Text style={[styles.rowAmount, account.balanceKind === 'liability' && { color: colors.danger }]}>{amount(account.balance)}</Text></View></Card>)}</View>
      <View style={styles.section}><SectionTitle title="Recent" detail="Tap web for full reconciliation" />{money.recent.length ? money.recent.slice(0, 6).map((transaction) => <Card key={transaction.id}><View style={styles.row}><View style={styles.copy}><Text style={styles.rowTitle}>{transaction.description}</Text><Text style={styles.rowMeta}>{LABELS[transaction.semanticType]} · {transaction.occurredOn}</Text></View><Text style={styles.rowAmount}>{amount(transaction.amount)}</Text></View></Card>) : <Card><Text style={styles.empty}>No transactions yet.</Text></Card>}</View>
    </>}
  </Screen>;
}

function Quick({ icon, label, onPress }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>['name']; label: string; onPress: () => void }) { const { colors } = useLifeOSTheme(); const styles = createStyles(colors); return <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.quickItem, pressed && { opacity: .7 }]}><MaterialCommunityIcons color={colors.primary} name={icon} size={22} /><Text style={styles.quickLabel}>{label}</Text></Pressable>; }

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  eye: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.pill, borderWidth: 1, height: 42, justifyContent: 'center', width: 42 },
  banner: { alignItems: 'center', backgroundColor: colors.accentSoft, borderRadius: radii.sm, flexDirection: 'row', gap: spacing.sm, padding: spacing.md }, bannerText: { color: colors.ink, flex: 1, fontSize: 12, fontWeight: '700' },
  hero: { backgroundColor: colors.secondary, borderRadius: radii.lg, gap: spacing.sm, padding: spacing.xl }, heroLabel: { color: colors.secondaryContrast, fontSize: 12, fontWeight: '700', opacity: .72, textTransform: 'uppercase' }, heroValue: { color: colors.secondaryContrast, fontSize: 36, fontWeight: '900', letterSpacing: -1.2 }, heroMeta: { flexDirection: 'row', justifyContent: 'space-between' }, heroMetaText: { color: colors.secondaryContrast, fontSize: 12, opacity: .8 },
  quick: { flexDirection: 'row', gap: spacing.sm }, quickItem: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, gap: spacing.xs, paddingVertical: spacing.md }, quickLabel: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  section: { gap: spacing.md }, metrics: { flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.lg }, metric: { width: '50%' }, metricLabel: { color: colors.inkMuted, fontSize: 11, fontWeight: '700' }, metricValue: { color: colors.ink, fontSize: 17, fontWeight: '800', marginTop: 3 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md }, accountIcon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.sm, height: 38, justifyContent: 'center', width: 38 }, copy: { flex: 1, gap: 3 }, rowTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' }, rowMeta: { color: colors.inkMuted, fontSize: 11, textTransform: 'capitalize' }, rowAmount: { color: colors.ink, fontSize: 14, fontWeight: '800' }, empty: { color: colors.inkMuted, textAlign: 'center' },
});
