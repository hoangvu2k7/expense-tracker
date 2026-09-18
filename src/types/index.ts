export type TransactionType = 'expense' | 'income' | 'transfer';

export type WalletType = 'cash' | 'bank' | 'e-wallet';

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  initialBalance: number;
  currentBalance: number;
  icon: string;
  color: string;
  bankName?: string;
  accountNumber?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  categoryId?: string; // Optional for transfer
  walletId: string; // Source wallet
  toWalletId?: string; // Target wallet if transfer
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number; // Monthly limit
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  icon: string;
  color: string;
  note?: string;
}

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  type: 'expense' | 'income';
  categoryId: string;
  walletId: string;
  dueDay: number; // Day of month (1-31)
  frequency: 'monthly' | 'weekly' | 'yearly';
  lastPaidDate?: string;
  isActive: boolean;
}

export type InsightType = 'warning' | 'danger' | 'tip' | 'success' | 'info';

export interface SmartInsight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  category?: string;
  actionText?: string;
  actionType?: 'open_budget' | 'open_goals' | 'open_transactions';
}

export type DateFilterPreset = 'today' | 'this_week' | 'this_month' | 'last_month' | 'this_year' | 'all' | 'custom';

export interface DateFilter {
  preset: DateFilterPreset;
  startDate?: string;
  endDate?: string;
}
