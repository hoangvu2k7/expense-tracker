import { Wallet, Transaction, Budget, SavingsGoal, RecurringTransaction } from '../types';
import { getCurrentMonth } from '../utils/formatters';

export function getDemoWallets(): Wallet[] {
  return [
    {
      id: 'wallet_cash',
      name: 'Ví tiền mặt',
      type: 'cash',
      initialBalance: 1500000,
      currentBalance: 1850000,
      icon: 'Banknote',
      color: '#10b981'
    },
    {
      id: 'wallet_mb',
      name: 'Tài khoản MB Bank',
      type: 'bank',
      bankName: 'MB Bank Quân Đội',
      accountNumber: '****8888',
      initialBalance: 20000000,
      currentBalance: 24700000,
      icon: 'Landmark',
      color: '#2563eb'
    },
    {
      id: 'wallet_momo',
      name: 'Ví MoMo',
      type: 'e-wallet',
      bankName: 'Ví điện tử MoMo',
      accountNumber: '098***999',
      initialBalance: 500000,
      currentBalance: 820000,
      icon: 'Smartphone',
      color: '#d946ef'
    }
  ];
}

export function getDemoTransactions(): Transaction[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Helper to get formatted date in current month
  const d = (day: number) => {
    const validDay = Math.min(day, 28);
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(validDay).padStart(2, '0');
    return `${year}-${mStr}-${dStr}`;
  };

  // Helper for previous month
  const prevMonthDate = (monthsAgo: number, day: number) => {
    const targetDate = new Date(year, month - monthsAgo, day);
    const yStr = targetDate.getFullYear();
    const mStr = String(targetDate.getMonth() + 1).padStart(2, '0');
    const dStr = String(targetDate.getDate()).padStart(2, '0');
    return `${yStr}-${mStr}-${dStr}`;
  };

  return [
    // Current month transactions
    {
      id: 'tx_1',
      amount: 18000000,
      type: 'income',
      categoryId: 'cat_salary',
      walletId: 'wallet_mb',
      date: d(5),
      note: 'Nhận lương tháng công ty TechCorp',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_2',
      amount: 2500000,
      type: 'income',
      categoryId: 'cat_bonus',
      walletId: 'wallet_mb',
      date: d(10),
      note: 'Thưởng KPI dự án Q3',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_3',
      amount: 3500000,
      type: 'expense',
      categoryId: 'cat_house',
      walletId: 'wallet_mb',
      date: d(5),
      note: 'Thanh toán tiền trọ tháng này',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_4',
      amount: 450000,
      type: 'expense',
      categoryId: 'cat_bills',
      walletId: 'wallet_momo',
      date: d(7),
      note: 'Tiền điện & nước tháng',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_5',
      amount: 2150000,
      type: 'expense',
      categoryId: 'cat_food',
      walletId: 'wallet_mb',
      date: d(12),
      note: 'Đi chợ siêu thị Co.opmart & ăn tối buffet',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_6',
      amount: 120000,
      type: 'expense',
      categoryId: 'cat_food',
      walletId: 'wallet_cash',
      date: d(14),
      note: 'Ăn trưa bún chả + trà đá vỉa hè',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_7',
      amount: 85000,
      type: 'expense',
      categoryId: 'cat_transport',
      walletId: 'wallet_momo',
      date: d(15),
      note: 'GrabBike đi gặp đối tác',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_8',
      amount: 650000,
      type: 'expense',
      categoryId: 'cat_shopping',
      walletId: 'wallet_mb',
      date: d(16),
      note: 'Săn sale Shopee bàn phím cơ và chuột',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_9',
      amount: 260000,
      type: 'expense',
      categoryId: 'cat_entertainment',
      walletId: 'wallet_mb',
      date: d(17),
      note: 'Gia hạn gói tài khoản Netflix & Spotify',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_10',
      amount: 1000000,
      type: 'transfer',
      walletId: 'wallet_mb',
      toWalletId: 'wallet_cash',
      date: d(8),
      note: 'Rút tiền ATM tiêu vặt tiền mặt',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_11',
      amount: 500000,
      type: 'transfer',
      walletId: 'wallet_mb',
      toWalletId: 'wallet_momo',
      date: d(11),
      note: 'Nạp tiền vào ví MoMo thanh toán online',
      createdAt: new Date().toISOString()
    },

    // Historical transactions (past 1-3 months) for analytics & charts
    {
      id: 'tx_hist_1',
      amount: 18000000,
      type: 'income',
      categoryId: 'cat_salary',
      walletId: 'wallet_mb',
      date: prevMonthDate(1, 5),
      note: 'Lương tháng trước',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_hist_2',
      amount: 7200000,
      type: 'expense',
      categoryId: 'cat_food',
      walletId: 'wallet_mb',
      date: prevMonthDate(1, 15),
      note: 'Tổng chi ăn uống tháng trước',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_hist_3',
      amount: 3500000,
      type: 'expense',
      categoryId: 'cat_house',
      walletId: 'wallet_mb',
      date: prevMonthDate(1, 5),
      note: 'Tiền trọ tháng trước',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_hist_4',
      amount: 17500000,
      type: 'income',
      categoryId: 'cat_salary',
      walletId: 'wallet_mb',
      date: prevMonthDate(2, 5),
      note: 'Lương 2 tháng trước',
      createdAt: new Date().toISOString()
    },
    {
      id: 'tx_hist_5',
      amount: 8100000,
      type: 'expense',
      categoryId: 'cat_food',
      walletId: 'wallet_mb',
      date: prevMonthDate(2, 18),
      note: 'Chi tiêu tổng hợp 2 tháng trước',
      createdAt: new Date().toISOString()
    }
  ];
}

export function getDemoBudgets(): Budget[] {
  const currentMonth = getCurrentMonth();
  return [
    {
      id: 'bdg_1',
      categoryId: 'cat_food',
      amount: 3000000, // Đã tiêu 2,270,000 (~75% -> Kích hoạt cảnh báo thông minh!)
      month: currentMonth
    },
    {
      id: 'bdg_2',
      categoryId: 'cat_shopping',
      amount: 1500000,
      month: currentMonth
    },
    {
      id: 'bdg_3',
      categoryId: 'cat_transport',
      amount: 800000,
      month: currentMonth
    },
    {
      id: 'bdg_4',
      categoryId: 'cat_entertainment',
      amount: 600000,
      month: currentMonth
    }
  ];
}

export function getDemoGoals(): SavingsGoal[] {
  return [
    {
      id: 'goal_1',
      name: 'Mua Laptop MacBook Pro M3',
      targetAmount: 35000000,
      currentAmount: 22500000,
      deadline: '2026-12-31',
      icon: 'Laptop',
      color: '#3b82f6',
      note: 'Quỹ mua máy tính phục vụ công việc lập trình'
    },
    {
      id: 'goal_2',
      name: 'Du lịch Đà Lạt cuối năm',
      targetAmount: 8000000,
      currentAmount: 5600000,
      deadline: '2026-11-20',
      icon: 'Palmtree',
      color: '#10b981',
      note: 'Chuyến đi nghỉ mát cùng bạn thân 3 ngày 2 đêm'
    },
    {
      id: 'goal_3',
      name: 'Quỹ khẩn cấp (Emergency Fund)',
      targetAmount: 50000000,
      currentAmount: 30000000,
      icon: 'ShieldCheck',
      color: '#8b5cf6',
      note: 'Dự phòng tài chính tương đương 3-6 tháng sinh hoạt'
    }
  ];
}

export function getDemoRecurring(): RecurringTransaction[] {
  return [
    {
      id: 'rec_1',
      name: 'Tiền thuê trọ & chung cư',
      amount: 3500000,
      type: 'expense',
      categoryId: 'cat_house',
      walletId: 'wallet_mb',
      dueDay: 5,
      frequency: 'monthly',
      isActive: true
    },
    {
      id: 'rec_2',
      name: 'Tiền điện & Nước sinh hoạt',
      amount: 550000,
      type: 'expense',
      categoryId: 'cat_bills',
      walletId: 'wallet_momo',
      dueDay: 20,
      frequency: 'monthly',
      isActive: true
    },
    {
      id: 'rec_3',
      name: 'Gói Netflix + Spotify Premium',
      amount: 260000,
      type: 'expense',
      categoryId: 'cat_entertainment',
      walletId: 'wallet_mb',
      dueDay: 25,
      frequency: 'monthly',
      isActive: true
    }
  ];
}
