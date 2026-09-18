import React from 'react';
import { ExpensePieChart } from './ExpensePieChart';
import { IncomeExpenseBarChart } from './IncomeExpenseBarChart';
import { SpendingTrendChart } from './SpendingTrendChart';
import { StatCards } from '../dashboard/StatCards';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* High-level Stats Overview */}
      <StatCards />

      {/* Main Charts: Pie breakdown & 6-month Bar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart />
        <IncomeExpenseBarChart />
      </div>

      {/* Daily spending trend */}
      <SpendingTrendChart />
    </div>
  );
};
