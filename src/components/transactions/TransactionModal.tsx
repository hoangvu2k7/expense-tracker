import React, { useState, useEffect } from 'react';
import { X, Calendar, Wallet, Tag, FileText, Trash2, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatNumberInput, parseCurrencyInput, getTodayDate, formatVND } from '../../utils/formatters';

export const TransactionModal: React.FC = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddType,
    setQuickAddType,
    editingTransaction,
    setEditingTransaction,
    categories,
    wallets,
    addTransaction,
    updateTransaction,
    deleteTransaction
  } = useApp();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [walletId, setWalletId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDate());
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string>('');

  const isOpen = isQuickAddOpen || !!editingTransaction;

  // Initialize form when opened or when editing
  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type === 'income' ? 'income' : 'expense');
      setAmountStr(formatNumberInput(editingTransaction.amount));
      setCategoryId(editingTransaction.categoryId || '');
      setWalletId(editingTransaction.walletId);
      setDate(editingTransaction.date);
      setNote(editingTransaction.note);
    } else {
      setType(quickAddType);
      setAmountStr('');
      setDate(getTodayDate());
      setNote('');
      if (wallets.length > 0) {
        setWalletId(wallets[0].id);
      }
      const filteredCats = categories.filter((c) => c.type === quickAddType);
      if (filteredCats.length > 0) {
        setCategoryId(filteredCats[0].id);
      }
    }
    setError('');
  }, [editingTransaction, isQuickAddOpen, quickAddType, wallets, categories]);

  // When type changes, adjust category selection if not compatible
  const handleTypeChange = (newType: 'expense' | 'income') => {
    setType(newType);
    setQuickAddType(newType);
    const available = categories.filter((c) => c.type === newType);
    if (available.length > 0 && !available.some((c) => c.id === categoryId)) {
      setCategoryId(available[0].id);
    }
  };

  const handleClose = () => {
    setIsQuickAddOpen(false);
    setEditingTransaction(null);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setAmountStr(formatNumberInput(raw));
  };

  const addQuickAmount = (added: number) => {
    const current = parseCurrencyInput(amountStr);
    setAmountStr(formatNumberInput(current + added));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseCurrencyInput(amountStr);
    if (!amount || amount <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ lớn hơn 0');
      return;
    }
    if (!walletId) {
      setError('Vui lòng chọn ví thanh toán');
      return;
    }
    if (!categoryId) {
      setError('Vui lòng chọn danh mục');
      return;
    }

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        amount,
        type,
        categoryId,
        walletId,
        date,
        note
      });
    } else {
      addTransaction({
        amount,
        type,
        categoryId,
        walletId,
        date,
        note
      });
    }

    handleClose();
  };

  const handleDelete = () => {
    if (editingTransaction) {
      deleteTransaction(editingTransaction.id);
      handleClose();
    }
  };

  if (!isOpen) return null;

  const currentCategories = categories.filter((c) => c.type === type);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {editingTransaction ? 'Chỉnh Sửa Giao Dịch' : 'Ghi Chép Giao Dịch Mới'}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Type Toggle: Chi tiêu / Thu nhập */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tiền Chi (-)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-xl text-sm font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tiền Thu (+)
            </button>
          </div>

          {/* Big Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Số tiền (VNĐ)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountStr}
                onChange={handleAmountChange}
                className="w-full text-3xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors pr-14"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                VNĐ
              </span>
            </div>

            {/* Quick Increment Badges */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[20000, 50000, 100000, 200000, 500000].map((quick) => (
                <button
                  key={quick}
                  type="button"
                  onClick={() => addQuickAmount(quick)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  +{formatVND(quick)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Picker Grid */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Danh Mục
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-100">
              {currentCategories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex flex-col items-center p-2 rounded-xl text-center border transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'border-transparent hover:bg-white/80'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-1"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" color={cat.color} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-800 truncate w-full">
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wallet Selector & Date in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Tài Khoản / Ví
              </label>
              <div className="relative">
                <select
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                >
                  {wallets.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} ({formatVND(w.currentBalance)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Ngày Giao Dịch
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Ghi Chú / Chi Tiết
            </label>
            <input
              type="text"
              placeholder="VD: Đi siêu thị, ăn trưa với bạn bè..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 font-medium">{error}</p>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-2">
            {editingTransaction && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors"
                title="Xóa giao dịch này"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>{editingTransaction ? 'Cập Nhật Giao Dịch' : 'Lưu Giao Dịch'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
