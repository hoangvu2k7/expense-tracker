import { SmartInsight, Transaction, Budget, Category, RecurringTransaction } from '../types';
import { formatVND, getCurrentMonth, getRemainingDaysInMonth, getTotalDaysInMonth } from './formatters';

export function generateSmartInsights(
  transactions: Transaction[],
  budgets: Budget[],
  categories: Category[],
  recurring: RecurringTransaction[]
): SmartInsight[] {
  const insights: SmartInsight[] = [];
  const currentMonth = getCurrentMonth();
  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = getTotalDaysInMonth();
  const remainingDays = getRemainingDaysInMonth();
  const monthProgressRatio = currentDay / totalDays; // e.g. 18 / 30 = 0.6 (60%)

  // Filter current month expense transactions
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(currentMonth)
  );

  // 1. Check Category Budgets & Spending pacing
  budgets.forEach((budget) => {
    const category = categories.find((c) => c.id === budget.categoryId);
    if (!category) return;

    const spent = currentMonthExpenses
      .filter((t) => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);

    const spendRatio = spent / budget.amount;

    // Over budget danger!
    if (spent > budget.amount) {
      const overAmount = spent - budget.amount;
      insights.push({
        id: `overbudget_${budget.id}`,
        type: 'danger',
        title: `Vượt hạn mức ngân sách ${category.name}!`,
        message: `Bạn đã chi ${formatVND(spent)} cho ${category.name}, vượt hạn mức đặt ra ${formatVND(overAmount)}. Hãy cân nhắc thắt chặt chi tiêu danh mục này.`,
        category: category.name,
        actionText: 'Xem ngân sách',
        actionType: 'open_budget'
      });
    }
    // High burn rate warning (e.g. spent >70% while month is only half or less through, or spendRatio > monthProgressRatio + 0.2)
    else if (spendRatio >= 0.7 && spendRatio > monthProgressRatio + 0.1) {
      const remainingBudget = Math.max(0, budget.amount - spent);
      const dailyAllowance = Math.round(remainingBudget / remainingDays);

      insights.push({
        id: `pacing_warning_${budget.id}`,
        type: 'warning',
        title: `Cảnh báo chi tiêu nhanh: ${category.name}`,
        message: `Tháng này bạn đã tiêu ${(spendRatio * 100).toFixed(0)}% ngân sách ${category.name} dù mới qua ${(monthProgressRatio * 100).toFixed(0)}% số ngày của tháng! Hạn mức cho phép chỉ còn trung bình ${formatVND(dailyAllowance)}/ngày trong ${remainingDays} ngày còn lại.`,
        category: category.name,
        actionText: 'Điều chỉnh hạn mức',
        actionType: 'open_budget'
      });
    } else if (spendRatio >= 0.5 && remainingBudgetPositive(budget.amount, spent)) {
      const remainingBudget = budget.amount - spent;
      const dailyAllowance = Math.round(remainingBudget / remainingDays);
      insights.push({
        id: `daily_allowance_${budget.id}`,
        type: 'tip',
        title: `Gợi ý chi tiêu mỗi ngày: ${category.name}`,
        message: `Bạn còn ${formatVND(remainingBudget)} cho ${category.name}. Trung bình mỗi ngày trong ${remainingDays} ngày còn lại bạn có thể tiêu tối đa ${formatVND(dailyAllowance)}.`,
        category: category.name,
        actionText: 'Xem chi tiết',
        actionType: 'open_budget'
      });
    }
  });

  // Helper
  function remainingBudgetPositive(amount: number, spent: number) {
    return amount > spent;
  }

  // 2. Check Upcoming Recurring Bills
  recurring.forEach((item) => {
    if (!item.isActive) return;
    const daysUntilDue = item.dueDay - currentDay;
    if (daysUntilDue >= 0 && daysUntilDue <= 3) {
      insights.push({
        id: `due_soon_${item.id}`,
        type: 'warning',
        title: `Hóa đơn sắp tới hạn: ${item.name}`,
        message: `Khoản phí ${formatVND(item.amount)} sẽ tới hạn vào ngày ${item.dueDay} (còn ${daysUntilDue === 0 ? 'hôm nay' : daysUntilDue + ' ngày'}). Hãy đảm bảo ví có đủ số dư!`,
        actionText: 'Thanh toán ngay',
        actionType: 'open_transactions'
      });
    }
  });

  // 3. Positive Savings Rate Insight
  const totalIncome = transactions
    .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = currentMonthExpenses.reduce((sum, t) => sum + t.amount, 0);

  if (totalIncome > 0) {
    const netSaving = totalIncome - totalExpense;
    const savingRate = (netSaving / totalIncome) * 100;

    if (savingRate >= 25) {
      insights.push({
        id: 'savings_streak',
        type: 'success',
        title: 'Tài chính tháng này rất khả quan! 🎉',
        message: `Bạn đang giữ lại được ${savingRate.toFixed(1)}% thu nhập (${formatVND(netSaving)} tích lũy ròng). Bạn có thể cân nhắc chuyển một phần vào Hũ Tiết Kiệm để nhanh đạt mục tiêu.`,
        actionText: 'Nạp Hũ Tiết Kiệm',
        actionType: 'open_goals'
      });
    }
  }

  return insights;
}
