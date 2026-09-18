import React, { useState } from 'react';
import { X, ArrowDownRight, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { formatNumberInput, parseCurrencyInput, formatVND } from '../../utils/formatters';

export const DepositModal: React.FC = () => {
  const {
    depositGoalModal,
    setDepositGoalModal,
    wallets,
    depositToGoal
  } = useApp();

  const [amountStr, setAmountStr] = useState('');
  const [walletId, setWalletId] = useState(wallets.length > 0 ? wallets[0].id : '');
  const [error, setError] = useState('');

  if (!depositGoalModal) return null;

  const remainingToGoal = Math.max(0, depositGoalModal.targetAmount - depositGoalModal.currentAmount);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setAmountStr(formatNumberInput(raw));
  };

  const handleQuickFillRemaining = () => {
    setAmountStr(formatNumberInput(remainingToGoal));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseCurrencyInput(amountStr);

    if (!amount || amount <= 0) {
      setError('Vui lòng nhập số tiền nạp hợp lệ');
      return;
    }

    const selectedWallet = wallets.find((w) => w.id === walletId);
    if (selectedWallet && selectedWallet.currentBalance < amount) {
      setError(`Số dư ${selectedWallet.name} không đủ (${formatVND(selectedWallet.currentBalance)})`);
      return;
    }

    depositToGoal(depositGoalModal.id, amount, walletId);

    // If goal reached 100%, trigger confetti!
    if (depositGoalModal.currentAmount + amount >= depositGoalModal.targetAmount) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setDepositGoalModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold uppercase text-emerald-600 tracking-wider">
              Nạp Tiền Vào Hũ
            </span>
            <h3 className="text-lg font-bold text-slate-900">{depositGoalModal.name}</h3>
          </div>
          <button
            type="button"
            onClick={() => setDepositGoalModal(null)}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Goal progress card */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500">Đã có:</span>{' '}
              <strong className="text-emerald-700 font-bold">
                {formatVND(depositGoalModal.currentAmount)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Còn thiếu:</span>{' '}
              <strong className="text-slate-900 font-bold">
                {formatVND(remainingToGoal)}
              </strong>
            </div>
          </div>

          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Số Tiền Nạp
              </label>
              <button
                type="button"
                onClick={handleQuickFillRemaining}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nạp đủ mục tiêu</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amountStr}
                onChange={handleAmountChange}
                className="w-full text-2xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors pr-14"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                VNĐ
              </span>
            </div>
          </div>

          {/* Source Wallet */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Trích Từ Ví / Nguồn Tiền
            </label>
            <select
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} (Số dư: {formatVND(w.currentBalance)})
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Xác Nhận Nạp Tiền</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
