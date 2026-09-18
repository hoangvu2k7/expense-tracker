import React from 'react';
import {
  Plus,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Trash2,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  formatVND,
  getRemainingDaysInMonth,
  getTotalDaysInMonth
} from '../../utils/formatters';

export const BudgetList: React.FC = () => {
  const {
    budgets,
    categories,
    transactions,
    selectedMonth,
    setIsBudgetModalOpen,
    deleteBudget
  } = useApp();

  const remainingDays = getRemainingDaysInMonth();
  const totalDays = getTotalDaysInMonth();
  const currentDay = new Date().getDate();
  const monthProgress = Math.min(100, Math.round((currentDay / totalDays) * 100));

  // Current month expense transactions
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(selectedMonth)
  );

  // Filter budgets for selected month
  const currentBudgets = budgets.filter((b) => b.month === selectedMonth);

  // Overall budget numbers
  const totalBudgetAmount = currentBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalBudgetSpent = currentBudgets.reduce((sum, b) => {
    const spent = monthExpenses
      .filter((t) => t.categoryId === b.categoryId)
      .reduce((s, t) => s + t.amount, 0);
    return sum + spent;
  }, 0);

  const overallProgress =
    totalBudgetAmount > 0 ? (totalBudgetSpent / totalBudgetAmount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header card with month budget summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Hạn Mức Ngân Sách Chi Tiêu
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm soát chi tiêu theo từng danh mục, tự động cảnh báo đổi màu thanh tiến trình khi vượt 80% & 100%
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thiết Lập Ngân Sách</span>
          </button>
        </div>

        {/* Overall progress indicator */}
        {totalBudgetAmount > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-800">
                Tổng hạn mức các danh mục:
              </span>
              <div className="space-x-1">
                <span className="font-extrabold text-slate-900">
                  {formatVND(totalBudgetSpent)}
                </span>
                <span className="text-slate-400">/</span>
                <span className="font-semibold text-slate-500">
                  {formatVND(totalBudgetAmount)}
                </span>
              </div>
            </div>

            {/* Combined Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallProgress >= 100
                    ? 'bg-rose-500'
                    : overallProgress >= 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, overallProgress)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  Tháng đã qua <strong>{monthProgress}%</strong> ({currentDay}/{totalDays} ngày)
                </span>
              </div>
              <span>Đã dùng <strong>{overallProgress.toFixed(0)}%</strong> hạn mức</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Budget Cards */}
      {currentBudgets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700">Chưa có ngân sách nào cho tháng này</p>
          <p className="text-xs mt-1 text-slate-500">
            Hãy thiết lập hạn mức cho các danh mục tiêu biểu như Ăn uống, Mua sắm, Đi lại để kiểm soát dòng tiền.
          </p>
          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Tạo hạn mức ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentBudgets.map((budget) => {
            const category = categories.find((c) => c.id === budget.categoryId);
            const spent = monthExpenses
              .filter((t) => t.categoryId === budget.categoryId)
              .reduce((sum, t) => sum + t.amount, 0);

            const percent = (spent / budget.amount) * 100;
            const remaining = budget.amount - spent;
            const isExceeded = spent > budget.amount;
            const isWarning = !isExceeded && percent >= 80;

            // Daily allowance for remaining days
            const dailyAllowance = Math.max(0, Math.round(remaining / remainingDays));

            return (
              <div
                key={budget.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all relative group flex flex-col justify-between ${
                  isExceeded
                    ? 'border-rose-300 bg-rose-50/20'
                    : isWarning
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color || '#10b981'}20` }}
                      >
                        <CategoryIcon
                          name={category?.icon || 'Tag'}
                          className="w-5 h-5"
                          color={category?.color}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {category?.name || 'Danh mục'}
                        </h4>
                        <span className="text-xs text-slate-500">
                          Hạn mức: {formatVND(budget.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isExceeded ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700 flex items-center space-x-1">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>Vượt mức!</span>
                        </span>
                      ) : isWarning ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 flex items-center space-x-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Cảnh báo 80%</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>An toàn</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => deleteBudget(budget.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                        title="Xóa hạn mức"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Numbers & Progress Bar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Đã chi: <strong className="text-slate-900">{formatVND(spent)}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          isExceeded
                            ? 'text-rose-600'
                            : isWarning
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {percent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isExceeded
                            ? 'bg-rose-600'
                            : isWarning
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Smart daily allowance banner */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {isExceeded ? (
                    <span className="text-rose-600 font-semibold">
                      Đã vượt quá hạn mức {formatVND(Math.abs(remaining))}
                    </span>
                  ) : (
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>
                        Cho phép tiêu tối đa <strong>{formatVND(dailyAllowance)}</strong>/ngày ({remainingDays} ngày tới)
                      </span>
                    </div>
                  )}

                  <span className="font-semibold text-slate-700">
                    Còn lại: {formatVND(remaining)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
