import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNumberInput, parseCurrencyInput } from '../../utils/formatters';

export const GoalModal: React.FC = () => {
  const { isGoalModalOpen, setIsGoalModalOpen, addSavingsGoal } = useApp();

  const [name, setName] = useState('');
  const [targetAmountStr, setTargetAmountStr] = useState('');
  const [deadline, setDeadline] = useState('');
  const [note, setNote] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('PiggyBank');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [error, setError] = useState('');

  if (!isGoalModalOpen) return null;

  const iconOptions = [
    { name: 'PiggyBank', label: 'Hũ heo' },
    { name: 'Laptop', label: 'Công nghệ' },
    { name: 'Palmtree', label: 'Du lịch' },
    { name: 'Car', label: 'Xe cộ' },
    { name: 'Home', label: 'Nhà cửa' },
    { name: 'ShieldCheck', label: 'Khẩn cấp' },
    { name: 'GraduationCap', label: 'Học tập' },
    { name: 'HeartHandshake', label: 'Gia đình' }
  ];

  const colorOptions = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'];

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseCurrencyInput(e.target.value);
    setTargetAmountStr(formatNumberInput(raw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập tên mục tiêu tiết kiệm');
      return;
    }
    const targetAmount = parseCurrencyInput(targetAmountStr);
    if (!targetAmount || targetAmount <= 0) {
      setError('Vui lòng nhập số tiền mục tiêu hợp lệ');
      return;
    }

    addSavingsGoal({
      name: name.trim(),
      targetAmount,
      deadline: deadline || undefined,
      icon: selectedIcon,
      color: selectedColor,
      note: note.trim() || undefined
    });

    setIsGoalModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Tạo Mục Tiêu Tiết Kiệm Mới</h3>
          <button
            type="button"
            onClick={() => setIsGoalModalOpen(false)}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Tên Mục Tiêu / Hũ Tiết Kiệm
            </label>
            <input
              type="text"
              placeholder="VD: Mua Macbook Pro, Du lịch Đà Lạt, Quỹ khẩn cấp..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Số Tiền Cần Tích Lũy (VNĐ)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={targetAmountStr}
                onChange={handleTargetChange}
                className="w-full text-2xl font-extrabold text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl py-3 px-4 focus:bg-white focus:border-emerald-500 focus:outline-none transition-colors pr-14"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                VNĐ
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Thời Hạn Dự Kiến (Tùy chọn)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Icon & Color selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Biểu Tượng & Màu Sắc
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {iconOptions.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedIcon(item.name)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedIcon === item.name
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex space-x-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    selectedColor === c ? 'scale-110 border-slate-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Chọn màu ${c}`}
                />
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Ghi Chú Động Lực
            </label>
            <input
              type="text"
              placeholder="VD: Cố gắng tiết kiệm mỗi tháng 2 triệu để đạt trước Tết..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
            >
              <Check className="w-5 h-5" />
              <span>Tạo Mục Tiêu</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
