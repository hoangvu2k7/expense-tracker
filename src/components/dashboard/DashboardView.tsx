import React from 'react';
import {
  Plus,
  ArrowRightLeft,
  Target,
  PiggyBank,
  ArrowRight,
  TrendingDown,
  Sparkles
} from 'lucide-react';
import { StatCards } from './StatCards';
import { SmartInsights } from './SmartInsights';
import { RecentTransactions } from './RecentTransactions';
import { ExpensePieChart } from '../analytics/ExpensePieChart';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';

export const DashboardView: React.FC = () => {
  const {
    setIsQuickAddOpen,
    setQuickAddType,
    setIsTransferOpen,
    setActiveTab,
    budgets,
    categories,
    transactions,
    selectedMonth,
    goals
  } = useApp();

  const currentBudgets = budgets.filter((b) => b.month === selectedMonth);
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(selectedMonth)
  );

  return (
    <div className="space-y-6">
      {/* 1. Stat Cards Overview */}
      <StatCards />

      {/* 2. Smart Insights */}
      <SmartInsights />

      {/* Quick Action Shortcuts Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setQuickAddType('expense');
            setIsQuickAddOpen(true);
          }}
          className="p-3.5 bg-rose-50/80 hover:bg-rose-100/80 text-rose-800 rounded-2xl border border-rose-100 flex items-center space-x-3 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block">Ghi Chi Tiêu</span>
            <span className="text-[11px] text-rose-600">Trừ tiền ví</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setQuickAddType('income');
            setIsQuickAddOpen(true);
          }}
          className="p-3.5 bg-emerald-50/80 hover:bg-emerald-100/80 text-emerald-800 rounded-2xl border border-emerald-100 flex items-center space-x-3 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block">Ghi Thu Nhập</span>
            <span className="text-[11px] text-emerald-600">Cộng tiền ví</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsTransferOpen(true)}
          className="p-3.5 bg-indigo-50/80 hover:bg-indigo-100/80 text-indigo-800 rounded-2xl border border-indigo-100 flex items-center space-x-3 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block">Chuyển Tiền Ví</span>
            <span className="text-[11px] text-indigo-600">Giữa các tài khoản</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budgets')}
          className="p-3.5 bg-amber-50/80 hover:bg-amber-100/80 text-amber-800 rounded-2xl border border-amber-100 flex items-center space-x-3 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold block">Đặt Ngân Sách</span>
            <span className="text-[11px] text-amber-700">Hạn mức chi tiêu</span>
          </div>
        </button>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Category breakdown chart */}
        <div className="lg:col-span-7 space-y-6">
          <ExpensePieChart />
        </div>

        {/* Right column: Recent transactions & Quick Budget preview */}
        <div className="lg:col-span-5 space-y-6">
          <RecentTransactions />

          {/* Quick Mini Budget Progress in Dashboard */}
          {currentBudgets.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-slate-900 text-sm">
                    Tiến độ ngân sách tháng
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('budgets')}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
                >
                  <span>Chi tiết</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>

              <div className="space-y-2.5">
                {currentBudgets.slice(0, 3).map((b) => {
                  const cat = categories.find((c) => c.id === b.categoryId);
                  const spent = monthExpenses
                    .filter((t) => t.categoryId === b.categoryId)
                    .reduce((sum, t) => sum + t.amount, 0);
                  const pct = Math.min(100, Math.round((spent / b.amount) * 100));
                  const isOver = spent > b.amount;

                  return (
                    <div key={b.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{cat?.name}</span>
                        <span className={`font-bold ${isOver ? 'text-rose-600' : 'text-slate-600'}`}>
                          {formatVND(spent)} / {formatVND(b.amount)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver ? 'bg-rose-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
