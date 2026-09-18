import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Calendar,
  ArrowRightLeft,
  Trash2,
  Edit2,
  ArrowUpRight,
  ArrowDownLeft,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND, formatDate } from '../../utils/formatters';
import { DateFilterPreset } from '../../types';

export const TransactionList: React.FC = () => {
  const {
    transactions,
    categories,
    wallets,
    setEditingTransaction,
    setIsQuickAddOpen,
    deleteTransaction
  } = useApp();

  // Search & Filter state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterPreset, setFilterPreset] = useState<DateFilterPreset>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWallet, setSelectedWallet] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Filter logic
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);

    return transactions.filter((tx) => {
      // 1. Keyword search in note or category name
      if (searchKeyword.trim()) {
        const cat = categories.find((c) => c.id === tx.categoryId);
        const term = searchKeyword.toLowerCase();
        const noteMatch = tx.note && tx.note.toLowerCase().includes(term);
        const catMatch = cat && cat.name.toLowerCase().includes(term);
        if (!noteMatch && !catMatch) return false;
      }

      // 2. Type filter
      if (selectedType !== 'all' && tx.type !== selectedType) {
        return false;
      }

      // 3. Category filter
      if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) {
        return false;
      }

      // 4. Wallet filter
      if (selectedWallet !== 'all' && tx.walletId !== selectedWallet && tx.toWalletId !== selectedWallet) {
        return false;
      }

      // 5. Time preset filter
      if (filterPreset === 'today') {
        if (tx.date !== todayStr) return false;
      } else if (filterPreset === 'this_week') {
        const txDate = new Date(tx.date);
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
        firstDayOfWeek.setHours(0, 0, 0, 0);
        if (txDate < firstDayOfWeek) return false;
      } else if (filterPreset === 'this_month') {
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        if (!tx.date.startsWith(currentMonth)) return false;
      } else if (filterPreset === 'last_month') {
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}`;
        if (!tx.date.startsWith(prevMonth)) return false;
      } else if (filterPreset === 'custom') {
        if (customStartDate && tx.date < customStartDate) return false;
        if (customEndDate && tx.date > customEndDate) return false;
      }

      return true;
    });
  }, [
    transactions,
    categories,
    searchKeyword,
    selectedType,
    selectedCategory,
    selectedWallet,
    filterPreset,
    customStartDate,
    customEndDate
  ]);

  // Aggregate stats for filtered list
  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-4">
      {/* Top Banner & Quick Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sổ Giao Dịch & Tìm Kiếm</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem toàn bộ lịch sử chi tiêu, lọc nâng cao theo ví, danh mục và khoảng ngày.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Giao Dịch</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        {/* Search bar & Type pills */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo từ khóa ghi chú, tên danh mục..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type selector */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl shrink-0 overflow-x-auto">
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'expense', label: 'Chi tiêu (-)' },
              { id: 'income', label: 'Thu nhập (+)' },
              { id: 'transfer', label: 'Chuyển tiền' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedType === t.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed filters: Time Preset, Category, Wallet */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Time Preset */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Thời gian
            </label>
            <select
              value={filterPreset}
              onChange={(e) => setFilterPreset(e.target.value as DateFilterPreset)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">Toàn bộ thời gian</option>
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
              <option value="last_month">Tháng trước</option>
              <option value="custom">Khoảng ngày tùy chọn</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Danh mục
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === 'expense' ? 'Chi' : 'Thu'})
                </option>
              ))}
            </select>
          </div>

          {/* Wallet Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
              Ví / Tài khoản
            </label>
            <select
              value={selectedWallet}
              onChange={(e) => setSelectedWallet(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">Tất cả các ví</option>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => {
                setSearchKeyword('');
                setFilterPreset('all');
                setSelectedCategory('all');
                setSelectedWallet('all');
                setSelectedType('all');
                setCustomStartDate('');
                setCustomEndDate('');
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        </div>

        {/* Custom date range inputs when selected */}
        {filterPreset === 'custom' && (
          <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-medium text-slate-500">Từ:</span>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
            />
            <span className="text-xs font-medium text-slate-500">Đến:</span>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700"
            />
          </div>
        )}
      </div>

      {/* Filter Result Summary bar */}
      <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-700">
          Hiển thị: <strong className="text-emerald-700">{filteredTransactions.length}</strong> giao dịch
        </span>
        <div className="flex items-center space-x-4 font-bold">
          <span className="text-emerald-700">
            Tổng Thu: +{formatVND(totalIncome)}
          </span>
          <span className="text-rose-700">
            Tổng Chi: -{formatVND(totalExpense)}
          </span>
          <span className="text-slate-900">
            Chênh Lệch: {formatVND(totalIncome - totalExpense, true)}
          </span>
        </div>
      </div>

      {/* Transactions List Table / Card View */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-base font-semibold">Không tìm thấy giao dịch nào phù hợp.</p>
            <p className="text-xs mt-1">Hãy thử nới lỏng bộ lọc hoặc thêm giao dịch mới.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.map((tx) => {
              const category = categories.find((c) => c.id === tx.categoryId);
              const sourceWallet = wallets.find((w) => w.id === tx.walletId);
              const targetWallet = tx.toWalletId ? wallets.find((w) => w.id === tx.toWalletId) : null;

              return (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors group"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: category ? `${category.color}18` : '#f1f5f9'
                      }}
                    >
                      {tx.type === 'transfer' ? (
                        <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <CategoryIcon
                          name={category?.icon || 'Tag'}
                          className="w-5 h-5"
                          color={category?.color || '#64748b'}
                        />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {tx.type === 'transfer'
                            ? `Chuyển sang: ${targetWallet?.name || 'Ví khác'}`
                            : category?.name || 'Chưa phân loại'}
                        </p>
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 font-semibold text-slate-600">
                          {sourceWallet?.name || 'Ví'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                        <span className="font-medium">{formatDate(tx.date)}</span>
                        {tx.note && (
                          <>
                            <span>•</span>
                            <span className="text-slate-600 truncate max-w-[200px] sm:max-w-[320px]">
                              {tx.note}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0 ml-3">
                    <div className="text-right">
                      <p
                        className={`text-sm sm:text-base font-extrabold ${
                          tx.type === 'expense'
                            ? 'text-rose-600'
                            : tx.type === 'income'
                            ? 'text-emerald-600'
                            : 'text-indigo-600'
                        }`}
                      >
                        {tx.type === 'expense' && '-'}
                        {tx.type === 'income' && '+'}
                        {formatVND(tx.amount)}
                      </p>
                    </div>

                    {/* Quick action buttons on hover */}
                    <div className="flex items-center space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setEditingTransaction(tx)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
