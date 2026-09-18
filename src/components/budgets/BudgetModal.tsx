import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumberInput, parseCurrencyInput } from '../../utils/formatters';

export const BudgetModal: React.FC = () => {
  const {
    isBudgetModalOpen,
    setIsBudgetModalOpen,
    categories,
    budgets,
    setCategoryBudget,
    selectedMonth
  } = useApp();

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const [categoryId, setCategoryId] = useState<string>(
    expenseCategories.length > 0 ? expenseCategories[0].id : ''
  );
  const [amountStr, setAmountStr] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!isBudgetModalOpen) return null;

  // Check if current category already has budget
  const existingBudget = budgets.find(
    (b) => b.categoryId === categoryId && b.month === selectedMonth
  );

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setAmountStr(formatNumberInput(raw));
  };

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    const existing = budgets.find((b) => b.categoryId === id && b.month === selectedMonth);
    if (existing) {
      setAmountStr(formatNumberInput(existing.amount));
    } else {
      setAmountStr('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseCurrencyInput(amountStr);
    if (!amount || amount <= 0) {
      setError('Vui lòng nhập hạn mức ngân sách hợp lệ');
      return;
    }
    if (!categoryId) {
      setError('Vui lòng chọn danh mục');
      return;
    }

    setCategoryBudget(categoryId, amount, selectedMonth);
    setIsBudgetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {existingBudget ? 'Chỉnh Sửa Hạn Mức Ngân Sách' : 'Đặt Hạn Mức Chi Tiêu Tháng'}
          </h3>
          <button
            type="button"
            onClick={() => setIsBudgetModalOpen(false)}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Category Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Danh Mục Chi Tiêu
            </label>
            <select
              value={categoryId}
              onChange={(e) => handleCategorySelect(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget Limit Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Hạn Mức Tối Đa Trong Tháng
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="VD: 3,000,000"
                value={amountStr}
                onChange={handleAmountChange}
                className="w-full text-2xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors pr-14"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                VNĐ
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Hệ thống sẽ gửi cảnh báo thông minh khi bạn tiêu chạm 80% hoặc 100% hạn mức này.
            </p>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>{existingBudget ? 'Cập Nhật Hạn Mức' : 'Thiết Lập Ngân Sách'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
