import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';

export const SpendingTrendChart: React.FC = () => {
  const { transactions, selectedMonth } = useApp();

  // Generate data per day in the selected month
  const chartData = React.useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const daysInMonth = new Date(year, month, 0).getDate();

    const dailyExpenses = new Array(daysInMonth).fill(0);

    transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(selectedMonth))
      .forEach((tx) => {
        const day = parseInt(tx.date.split('-')[2], 10);
        if (day >= 1 && day <= daysInMonth) {
          dailyExpenses[day - 1] += tx.amount;
        }
      });

    return dailyExpenses.map((amount, idx) => ({
      day: `N${idx + 1}`,
      dayNum: idx + 1,
      amount
    }));
  }, [transactions, selectedMonth]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-300">Ngày {data.dayNum}</p>
          <p className="text-emerald-400 font-extrabold text-sm">
            {formatVND(data.amount)}
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
          Dòng Tiền Chi Tiêu Từng Ngày Trong Tháng
        </h3>
        <p className="text-xs text-slate-500">
          Xem biến động chi tiêu hàng ngày để kịp thời điều chỉnh tốc độ tiêu tiền
        </p>
      </div>

      <div className="h-60 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
              interval={2}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => (val > 0 ? `${(val / 1000).toFixed(0)}k` : '0')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
