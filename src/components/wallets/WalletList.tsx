import React from 'react';
import {
  Plus,
  ArrowRightLeft,
  Trash2,
  Landmark,
  Banknote,
  Smartphone,
  Wallet as WalletIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';
import { Wallet } from '../../types';

export const WalletList: React.FC = () => {
  const {
    wallets,
    transactions,
    setIsWalletModalOpen,
    setIsTransferOpen,
    deleteWallet
  } = useApp();

  const totalBalance = wallets.reduce((sum, w) => sum + w.currentBalance, 0);

  const getWalletIcon = (wallet: Wallet) => {
    switch (wallet.type) {
      case 'bank':
        return <Landmark className="w-6 h-6 text-blue-600" />;
      case 'cash':
        return <Banknote className="w-6 h-6 text-emerald-600" />;
      case 'e-wallet':
        return <Smartphone className="w-6 h-6 text-fuchsia-600" />;
      default:
        return <WalletIcon className="w-6 h-6 text-slate-600" />;
    }
  };

  const getWalletCount = (wId: string) => {
    return transactions.filter((t) => t.walletId === wId || t.toWalletId === wId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header & Total Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Tổng Tài Sản Tất Cả Các Ví
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1">
              {formatVND(totalBalance)}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Quản lý dòng tiền phân bổ giữa Tiền mặt, Ngân hàng và Ví điện tử
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold backdrop-blur transition-all flex items-center space-x-2 border border-white/10"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Chuyển Tiền Ví</span>
            </button>
            <button
              type="button"
              onClick={() => setIsWalletModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Thêm Ví Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wallets.map((wallet) => {
          const txCount = getWalletCount(wallet.id);

          return (
            <div
              key={wallet.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {getWalletIcon(wallet)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{wallet.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        {wallet.bankName && <span>{wallet.bankName}</span>}
                        {wallet.accountNumber && (
                          <>
                            <span>•</span>
                            <span>{wallet.accountNumber}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {wallets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteWallet(wallet.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                      title="Xóa ví này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="mt-5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Số Dư Khả Dụng
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                    {formatVND(wallet.currentBalance)}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{txCount} giao dịch liên quan</span>
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(true)}
                  className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>Chuyển tiền</span>
                  <ArrowRightLeft className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
