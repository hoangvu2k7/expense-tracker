import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND, formatRelativeDate } from '../../utils/formatters';

export const RecentTransactions: React.FC = () => {
  const { transactions, categories, wallets, setActiveTab, setEditingTransaction } = useApp();

  const recent = transactions.slice(0, 6);

  const getCategory = (catId?: string) => categories.find((c) => c.id === catId);
  const getWallet = (wId: string) => wallets.find((w) => w.id === wId);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-900 text-base">Giao dịch gần đây</h3>
        </div>
        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          Chưa có giao dịch nào được ghi lại.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {recent.map((tx) => {
            const category = getCategory(tx.categoryId);
            const sourceWallet = getWallet(tx.walletId);
            const targetWallet = tx.toWalletId ? getWallet(tx.toWalletId) : null;

            return (
              <div
                key={tx.id}
                onClick={() => setEditingTransaction(tx)}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: category ? `${category.color}15` : '#f1f5f9'
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

                  {/* Title & Notes */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {tx.type === 'transfer'
                        ? `Chuyển sang ${targetWallet?.name || 'Ví khác'}`
                        : category?.name || 'Chưa phân loại'}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                      <span>{formatRelativeDate(tx.date)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[150px] sm:max-w-[220px]">
                        {tx.note || sourceWallet?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="text-right shrink-0 ml-3">
                  <span
                    className={`text-sm font-bold ${
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
                  </span>
                  <div className="text-[11px] text-slate-400">
                    {sourceWallet?.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
