import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  WalletCards,
  PieChart,
  Target,
  PiggyBank,
  CalendarClock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, wallets } = useApp();

  const totalAssets = wallets.reduce((sum, w) => sum + w.currentBalance, 0);

  const navItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
    { id: 'transactions', label: 'Sổ Giao Dịch', icon: ReceiptText },
    { id: 'wallets', label: 'Ví & Tài Khoản', icon: WalletCards },
    { id: 'analytics', label: 'Báo Cáo & Biểu Đồ', icon: PieChart },
    { id: 'budgets', label: 'Hạn Mức Chi Tiêu', icon: Target },
    { id: 'goals', label: 'Hũ Tiết Kiệm', icon: PiggyBank },
    { id: 'recurring', label: 'Hóa Đơn Định Kỳ', icon: CalendarClock },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 justify-between select-none">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini Wallet Balance Widget in Sidebar */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-3 -translate-y-3 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-400">Tổng tài sản các ví</span>
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="text-lg font-bold tracking-tight text-white mb-3">
          {formatVND(totalAssets)}
        </div>
        <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span>{wallets.length} nguồn tiền</span>
          <button
            type="button"
            onClick={() => setActiveTab('wallets')}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Quản lý ví →
          </button>
        </div>
      </div>
    </aside>
  );
};
