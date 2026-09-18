import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { CategoryIcon } from '../common/CategoryIcon';
import { formatVND } from '../../utils/formatters';

export const ExpensePieChart: React.FC = () => {
  const { transactions, categories, selectedMonth } = useApp();

  // Filter expenses for selected month
  const monthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(selectedMonth)
  );

  const totalExpense = monthExpenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap = new Map<string, number>();
  monthExpenses.forEach((tx) => {
    const catId = tx.categoryId || 'unknown';
    categoryMap.set(catId, (categoryMap.get(catId) || 0) + tx.amount);
  });

  const chartData = Array.from(categoryMap.entries())
    .map(([catId, amount]) => {
      const cat = categories.find((c) => c.id === catId);
      return {
        id: catId,
        name: cat?.name || 'Khác',
        icon: cat?.icon || 'Tag',
        color: cat?.color || '#94a3b8',
        amount,
        percent: totalExpense > 0 ? (amount / totalExpense) * 100 : 0
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-bold flex items-center space-x-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: data.color }}
            />
            <span>{data.name}</span>
          </div>
          <p className="text-slate-300">
            Số tiền: <strong className="text-white">{formatVND(data.amount)}</strong>
          </p>
          <p className="text-slate-400">
            Chiếm: {data.percent.toFixed(1)}% tổng chi tiêu
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-bold text-slate-900 text-base">
          Phân Bổ Chi Tiêu Theo Danh Mục
        </h3>
        <p className="text-xs text-slate-500">
          Xem ngay tiền đang "ngốn" vào đâu nhiều nhất trong tháng
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          Chưa có dữ liệu chi tiêu trong tháng này.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Pie / Donut Chart */}
          <div className="lg:col-span-5 h-64 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {chartData.map((entry) => (
                    <Cell key={`cell-${entry.id}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Total text in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                Tổng Chi
              </span>
              <span className="text-sm font-extrabold text-slate-900">
                {formatVND(totalExpense)}
              </span>
            </div>
          </div>

          {/* Ranked breakdown list */}
          <div className="lg:col-span-7 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {chartData.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <CategoryIcon
                      name={item.icon}
                      className="w-3.5 h-3.5"
                      color={item.color}
                    />
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">
                      {formatVND(item.amount)}
                    </span>
                    <span className="text-slate-400 font-medium w-10 text-right">
                      {item.percent.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percent}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
