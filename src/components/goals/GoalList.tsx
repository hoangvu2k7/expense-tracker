import React from 'react';
import {
  Plus,
  PiggyBank,
  Calendar,
  Sparkles,
  Trash2,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND, formatDate } from '../../utils/formatters';

export const GoalList: React.FC = () => {
  const {
    goals,
    setIsGoalModalOpen,
    setDepositGoalModal,
    deleteSavingsGoal
  } = useApp();

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const overallPercent = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <PiggyBank className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-slate-900">
                Mục Tiêu Tiết Kiệm (Hũ Tích Lũy)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Đặt mục tiêu mua sắm, du lịch, mua sắm thiết bị hoặc quỹ khẩn cấp và theo dõi tiến độ từng tháng.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Mục Tiêu Mới</span>
          </button>
        </div>

        {/* Global Progress bar across all goals */}
        {totalTarget > 0 && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-800">
                Tổng tích lũy các hũ tiết kiệm:
              </span>
              <div className="space-x-1">
                <span className="font-extrabold text-emerald-600">
                  {formatVND(totalSaved)}
                </span>
                <span className="text-slate-400">/</span>
                <span className="font-semibold text-slate-500">
                  {formatVND(totalTarget)}
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, overallPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{goals.length} mục tiêu đang theo đuổi</span>
              <span>Đã hoàn thành <strong>{overallPercent.toFixed(0)}%</strong> tổng kỳ vọng</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid of Goals */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
          <PiggyBank className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-base font-bold text-slate-700">Chưa có hũ tiết kiệm nào</p>
          <p className="text-xs mt-1 text-slate-500">
            Tạo mục tiêu để phân bổ tiền nhàn rỗi và có động lực tích lũy mỗi tháng!
          </p>
          <button
            type="button"
            onClick={() => setIsGoalModalOpen(true)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
          >
            Tạo hũ tiết kiệm ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const percent = (goal.currentAmount / goal.targetAmount) * 100;
            const isCompleted = goal.currentAmount >= goal.targetAmount;
            const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center"
                        style={{ backgroundColor: `${goal.color}20` }}
                      >
                        <CategoryIcon
                          name={goal.icon}
                          className="w-5 h-5"
                          color={goal.color}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{goal.name}</h4>
                        {goal.deadline && (
                          <div className="flex items-center space-x-1 text-xs text-slate-500 mt-0.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Hạn: {formatDate(goal.deadline)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                      title="Xóa mục tiêu này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Note if any */}
                  {goal.note && (
                    <p className="text-xs text-slate-500 italic mt-3 bg-slate-50 p-2 rounded-xl">
                      "{goal.note}"
                    </p>
                  )}

                  {/* Progress Numbers */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        Đã tích lũy: <strong className="text-slate-900">{formatVND(goal.currentAmount)}</strong>
                      </span>
                      <span
                        className={`font-bold ${
                          isCompleted ? 'text-emerald-600' : 'text-slate-700'
                        }`}
                      >
                        {percent.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, percent)}%`,
                          backgroundColor: isCompleted ? '#10b981' : goal.color
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Mục tiêu: {formatVND(goal.targetAmount)}</span>
                      {!isCompleted && <span>Còn thiếu: {formatVND(remaining)}</span>}
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  {isCompleted ? (
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Đã Đạt Mục Tiêu! 🎉</span>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-slate-600">
                      Cần thêm: <strong>{formatVND(remaining)}</strong>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setDepositGoalModal(goal)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 border border-emerald-200"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Nạp Thêm</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
