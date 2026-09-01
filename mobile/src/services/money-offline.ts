import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MoneyOverview } from '@/types/api';
import { api } from './api';

const overviewKey = (userId: string) => `lifeos-money-overview-v1:${userId}`;
const pendingKey = (userId: string) => `lifeos-money-pending-v1:${userId}`;

export interface PendingMoneyTransaction {
  localId: string;
  createdAt: string;
  input: Record<string, unknown>;
}

export async function cacheMoneyOverview(userId: string, overview: MoneyOverview) {
  await AsyncStorage.setItem(overviewKey(userId), JSON.stringify(overview));
}

export async function readCachedMoneyOverview(userId: string) {
  const raw = await AsyncStorage.getItem(overviewKey(userId));
  return raw ? JSON.parse(raw) as MoneyOverview : null;
}

export async function readPendingMoneyTransactions(userId: string) {
  const raw = await AsyncStorage.getItem(pendingKey(userId));
  return raw ? JSON.parse(raw) as PendingMoneyTransaction[] : [];
}

export async function queueMoneyTransaction(userId: string, input: Record<string, unknown>) {
  const pending = await readPendingMoneyTransactions(userId);
  pending.push({ localId: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), input });
  await AsyncStorage.setItem(pendingKey(userId), JSON.stringify(pending));
}

export async function flushMoneyTransactions(userId: string) {
  const pending = await readPendingMoneyTransactions(userId);
  if (!pending.length) return 0;
  const remaining: PendingMoneyTransaction[] = [];
  let synced = 0;
  for (const item of pending) {
    try { await api.createMoneyTransaction(item.input); synced += 1; }
    catch { remaining.push(item); }
  }
  await AsyncStorage.setItem(pendingKey(userId), JSON.stringify(remaining));
  return synced;
}
