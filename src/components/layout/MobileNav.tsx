import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Plus,
  PieChart,
  Target
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsQuickAddOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2">
      <div className="flex items-center justify-around">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Tổng quan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'transactions' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ReceiptText className="w-5 h-5 mb-0.5" />
          <span>Sổ GD</span>
        </button>

        {/* Center Prominent Add Button */}
        <button
          type="button"
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center justify-center -top-4 relative w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 active:scale-95"
          aria-label="Thêm giao dịch mới"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'analytics' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PieChart className="w-5 h-5 mb-0.5" />
          <span>Báo cáo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budgets')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-xs font-medium ${
            activeTab === 'budgets' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span>Ngân sách</span>
        </button>
      </div>
    </div>
  );
};
