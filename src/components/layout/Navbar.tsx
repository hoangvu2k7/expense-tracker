import React, { useState } from 'react';
import {
  Plus,
  ArrowRightLeft,
  FileSpreadsheet,
  Download,
  RotateCcw,
  Sparkles,
  Trash2,
  Calendar,
  Wallet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportTransactionsReport } from '../../utils/exportExcel';
import { getCurrentMonth } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const {
    isDemoMode,
    loadDemoData,
    resetToCleanSlate,
    setIsQuickAddOpen,
    setIsTransferOpen,
    selectedMonth,
    setSelectedMonth,
    transactions,
    categories,
    wallets
  } = useApp();

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleExport = (type: 'xlsx' | 'csv') => {
    exportTransactionsReport({
      transactions,
      categories,
      wallets,
      type
    });
    setShowExportMenu(false);
  };

  // Generate list of 6 months for the selector
  const monthOptions = React.useMemo(() => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`;
      options.push({ value: val, label });
    }
    return options;
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">FinSmart</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Quản Lý Chi Tiêu Cá Nhân Thông Minh</p>
            </div>
          </div>

          {/* Month Filter Selector */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Calendar className="w-4 h-4 text-slate-500 ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="Chọn tháng xem báo cáo"
              className="bg-transparent text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer pr-2"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} {opt.value === getCurrentMonth() ? '(Hiện tại)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Demo Mode indicator & reset actions */}
            {isDemoMode ? (
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium hover:bg-amber-100 transition-colors"
                  title="Đang dùng dữ liệu mẫu. Bấm để xóa dữ liệu và dùng thật."
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chế độ Demo</span>
                  <Trash2 className="w-3 h-3 text-amber-500 ml-1" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={loadDemoData}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 text-xs font-medium hover:bg-slate-200 transition-colors"
                title="Bấm để nạp dữ liệu mẫu trải nghiệm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Nạp Dữ Liệu Mẫu</span>
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Xuất File</span>
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Tùy chọn tải về
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExport('xlsx')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Xuất file Excel (.xlsx)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                  >
                    <Download className="w-4 h-4 text-blue-600" />
                    <span>Xuất file CSV (.csv)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Internal Transfer Button */}
            <button
              type="button"
              onClick={() => setIsTransferOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <ArrowRightLeft className="w-4 h-4 text-slate-600" />
              <span>Chuyển Tiền Ví</span>
            </button>

            {/* Quick Add Expense / Income Button */}
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md shadow-emerald-600/25 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Ghi Chép</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset confirmation modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Chuyển sang dữ liệu thật?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Hệ thống sẽ làm sạch các giao dịch và ngân sách mẫu để bạn bắt đầu ghi chép chi tiêu thực tế của riêng mình.
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToCleanSlate();
                  setShowResetConfirm(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
              >
                Xóa & Dùng Thật
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
