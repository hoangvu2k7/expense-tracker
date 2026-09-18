import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WalletType } from '../../types';
import { formatNumberInput, parseCurrencyInput } from '../../utils/formatters';

export const WalletModal: React.FC = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, addWallet } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('bank');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [initialBalanceStr, setInitialBalanceStr] = useState('');
  const [error, setError] = useState('');

  if (!isWalletModalOpen) return null;

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setInitialBalanceStr(formatNumberInput(raw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên ví hoặc tài khoản');
      return;
    }

    const initialBalance = parseCurrencyInput(initialBalanceStr);

    let icon = 'Landmark';
    let color = '#2563eb';

    if (type === 'cash') {
      icon = 'Banknote';
      color = '#10b981';
    } else if (type === 'e-wallet') {
      icon = 'Smartphone';
      color = '#d946ef';
    }

    addWallet({
      name: name.trim(),
      type,
      bankName: bankName.trim() || undefined,
      accountNumber: accountNumber.trim() || undefined,
      initialBalance,
      icon,
      color
    });

    setIsWalletModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Thêm Ví / Tài Khoản Nguồn Tiền</h3>
          <button
            type="button"
            onClick={() => setIsWalletModalOpen(false)}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Wallet Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Loại Nguồn Tiền
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bank', label: 'Ngân hàng' },
                { id: 'cash', label: 'Tiền mặt' },
                { id: 'e-wallet', label: 'Ví điện tử' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id as WalletType)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    type === t.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Wallet Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Tên Ví / Tài Khoản
            </label>
            <input
              type="text"
              placeholder="VD: MB Bank, Vietcombank, Ví MoMo, Heo đất..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {/* Bank / E-wallet detail */}
          {type !== 'cash' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Đơn Vị / Tên Ngân Hàng
                </label>
                <input
                  type="text"
                  placeholder="VD: MB, VCB, MoMo..."
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Số Tài Khoản (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="VD: ****9999"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Initial Balance */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Số Dư Khởi Tạo Ban Đầu
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={initialBalanceStr}
                onChange={handleBalanceChange}
                className="w-full text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 focus:bg-white focus:border-emerald-500 focus:outline-none pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VNĐ
              </span>
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Tạo Ví Mới</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
