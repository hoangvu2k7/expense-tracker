import React from 'react';
import {
  WalletCards,
  TrendingDown,
  TrendingUp,
  Scale,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';

export const StatCards: React.FC = () => {
  const { wallets, transactions, selectedMonth } = useApp();

  // Total balance across all wallets
  const totalBalance = wallets.reduce((sum, w) => sum + w.currentBalance, 0);

  // Filter transactions for selected month
  const monthTransactions = transactions.filter((t) =>
    t.date.startsWith(selectedMonth)
  );

  const monthIncome = monthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpense = monthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = monthIncome - monthExpense;
  const savingsRate = monthIncome > 0 ? (netSavings / monthIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Balance Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng Tài Sản Hiện Có
          </span>
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
            <WalletCards className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {formatVND(totalBalance)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span className="font-medium text-emerald-600">{wallets.length} ví</span>
            <span>đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* Month Income Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng Thu Nhập Tháng
          </span>
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
            {formatVND(monthIncome)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
            <span>Tiền vào tài khoản</span>
          </div>
        </div>
      </div>

      {/* Month Expense Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng Chi Tiêu Tháng
          </span>
          <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-extrabold text-rose-600 tracking-tight">
            {formatVND(monthExpense)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            <span>Đã thanh toán</span>
          </div>
        </div>
      </div>

      {/* Net Income Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Thu Nhập Ròng (Tích Lũy)
          </span>
          <div className={`p-2 rounded-xl ${netSavings >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className={`text-2xl font-extrabold tracking-tight ${netSavings >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {formatVND(netSavings, true)}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <span className={`font-semibold px-1.5 py-0.5 rounded ${netSavings >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              {savingsRate.toFixed(1)}%
            </span>
            <span>tỷ lệ tiết kiệm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
