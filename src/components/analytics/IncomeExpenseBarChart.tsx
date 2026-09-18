import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatVND } from '../../utils/formatters';

export const IncomeExpenseBarChart: React.FC = () => {
  const { transactions } = useApp();

  // Generate data for past 6 months
  const chartData = React.useMemo(() => {
    const data = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = `T${d.getMonth() + 1}`;

      const income = transactions
        .filter((t) => t.type === 'income' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = transactions
        .filter((t) => t.type === 'expense' && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        monthKey,
        label: monthLabel,
        income,
        expense,
        net: income - expense
      });
    }

    return data;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const income = payload.find((p: any) => p.dataKey === 'income')?.value || 0;
      const expense = payload.find((p: any) => p.dataKey === 'expense')?.value || 0;
      const net = income - expense;

      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-700">
          <p className="font-bold text-slate-200">Tháng {label}</p>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-emerald-400">Thu nhập (+):</span>
            <strong className="text-white">{formatVND(income)}</strong>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-rose-400">Chi tiêu (-):</span>
            <strong className="text-white">{formatVND(expense)}</strong>
          </div>
          <div className="pt-1 border-t border-slate-700 flex items-center justify-between space-x-4">
            <span className="text-slate-400">Tích lũy ròng:</span>
            <strong className={net >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              {formatVND(net, true)}
            </strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900 text-base">
            So Sánh Thu Nhập vs Chi Tiêu (6 Tháng)
          </h3>
          <p className="text-xs text-slate-500">
            Theo dõi xu hướng tích lũy và kiểm soát chi tiêu dài hạn
          </p>
        </div>
      </div>

      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingBottom: '10px' }}
              formatter={(value) => (value === 'income' ? 'Thu Nhập' : 'Chi Tiêu')}
            />
            <Bar
              dataKey="income"
              name="income"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="expense"
              name="expense"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
