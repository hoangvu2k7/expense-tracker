import React from 'react';
import {
  Plus,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
  Clock,
  Trash2,
  Check,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND, getCurrentMonth } from '../../utils/formatters';
import { RecurringTransaction } from '../../types';

export const RecurringList: React.FC = () => {
  const {
    recurring,
    categories,
    wallets,
    setIsRecurringModalOpen,
    payRecurringNow,
    toggleRecurring,
    deleteRecurring
  } = useApp();

  const currentMonth = getCurrentMonth();
  const currentDay = new Date().getDate();

  // Calculate status for each recurring item
  const getItemStatus = (item: RecurringTransaction) => {
    // If paid this month
    if (item.lastPaidDate && item.lastPaidDate.startsWith(currentMonth)) {
      return {
        code: 'paid',
        label: 'Đã thanh toán tháng này',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle
      };
    }

    const diff = item.dueDay - currentDay;
    if (diff < 0) {
      return {
        code: 'overdue',
        label: `Quá hạn ${Math.abs(diff)} ngày`,
        badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: AlertTriangle
      };
    } else if (diff === 0) {
      return {
        code: 'due_today',
        label: 'Hạn chót hôm nay!',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock
      };
    } else if (diff <= 3) {
      return {
        code: 'due_soon',
        label: `Sắp tới hạn (còn ${diff} ngày)`,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Clock
      };
    } else {
      return {
        code: 'upcoming',
        label: `Còn ${diff} ngày nữa`,
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
        icon: Clock
      };
    }
  };

  const totalMonthlyCommitment = recurring
    .filter((r) => r.isActive)
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CalendarClock className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Hóa Đơn & Chi Phí Định Kỳ
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Quản lý các khoản chi cố định hàng tháng (Tiền nhà, điện nước, internet, subscription). 1-click thanh toán ghi chép tức thì.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsRecurringModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Hóa Đơn Mới</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs sm:text-sm">
          <span className="font-semibold text-slate-700">
            Tổng chi phí cố định định kỳ hàng tháng:
          </span>
          <strong className="text-base sm:text-lg font-extrabold text-slate-900">
            {formatVND(totalMonthlyCommitment)}
          </strong>
        </div>
      </div>

      {/* List */}
      {recurring.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <CalendarClock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700">Chưa có hóa đơn định kỳ nào</p>
          <p className="text-xs mt-1 text-slate-500">
            Cài đặt tiền nhà, tiền mạng, các gói Netflix, Spotify để không bao giờ bị quên hạn nộp.
          </p>
          <button
            type="button"
            onClick={() => setIsRecurringModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Thêm hóa đơn ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recurring.map((item) => {
            const category = categories.find((c) => c.id === item.categoryId);
            const wallet = wallets.find((w) => w.id === item.walletId);
            const status = getItemStatus(item);
            const StatusIcon = status.icon;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${category?.color || '#3b82f6'}20` }}
                      >
                        <CategoryIcon
                          name={category?.icon || 'Receipt'}
                          className="w-5 h-5"
                          color={category?.color || '#3b82f6'}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                          <span>Ngày {item.dueDay} hàng tháng</span>
                          <span>•</span>
                          <span>Trích từ: {wallet?.name || 'Ví'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteRecurring(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                      title="Xóa hóa đơn này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatVND(item.amount)}
                    </span>

                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${status.badgeClass}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{status.label}</span>
                    </span>
                  </div>
                </div>

                {/* Action button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {item.lastPaidDate
                      ? `Lần trả gần nhất: ${item.lastPaidDate}`
                      : 'Chưa có lịch sử trả'}
                  </span>

                  {status.code === 'paid' ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-4 h-4" />
                      <span>Đã xong kỳ này</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => payRecurringNow(item)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Thanh Toán Ngay</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
