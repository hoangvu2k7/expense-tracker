import { Category, Wallet } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  // Chi tiêu
  { id: 'cat_food', name: 'Ăn uống', type: 'expense', icon: 'Utensils', color: '#f97316', isDefault: true },
  { id: 'cat_shopping', name: 'Mua sắm', type: 'expense', icon: 'ShoppingBag', color: '#ec4899', isDefault: true },
  { id: 'cat_transport', name: 'Di chuyển', type: 'expense', icon: 'Car', color: '#3b82f6', isDefault: true },
  { id: 'cat_bills', name: 'Hóa đơn & Dịch vụ', type: 'expense', icon: 'Receipt', color: '#eab308', isDefault: true },
  { id: 'cat_entertainment', name: 'Giải trí', type: 'expense', icon: 'Film', color: '#a855f7', isDefault: true },
  { id: 'cat_health', name: 'Sức khỏe & Y tế', type: 'expense', icon: 'HeartPulse', color: '#ef4444', isDefault: true },
  { id: 'cat_education', name: 'Giáo dục & Sách', type: 'expense', icon: 'GraduationCap', color: '#06b6d4', isDefault: true },
  { id: 'cat_house', name: 'Nhà cửa & Nội thất', type: 'expense', icon: 'Home', color: '#14b8a6', isDefault: true },
  { id: 'cat_other_exp', name: 'Chi tiêu khác', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', isDefault: true },

  // Thu nhập
  { id: 'cat_salary', name: 'Tiền lương', type: 'income', icon: 'Briefcase', color: '#10b981', isDefault: true },
  { id: 'cat_bonus', name: 'Thưởng & Bonus', type: 'income', icon: 'Award', color: '#f59e0b', isDefault: true },
  { id: 'cat_investment', name: 'Đầu tư & Lãi', type: 'income', icon: 'TrendingUp', color: '#6366f1', isDefault: true },
  { id: 'cat_secondhand', name: 'Bán đồ cũ', type: 'income', icon: 'RotateCcw', color: '#8b5cf6', isDefault: true },
  { id: 'cat_gift', name: 'Được tặng / Hỗ trợ', type: 'income', icon: 'Gift', color: '#d946ef', isDefault: true },
  { id: 'cat_other_inc', name: 'Thu nhập khác', type: 'income', icon: 'PlusCircle', color: '#64748b', isDefault: true },
];

export const DEFAULT_WALLETS: Wallet[] = [
  {
    id: 'wallet_cash',
    name: 'Ví tiền mặt',
    type: 'cash',
    initialBalance: 0,
    currentBalance: 0,
    icon: 'Banknote',
    color: '#10b981'
  },
  {
    id: 'wallet_mb',
    name: 'Tài khoản MB Bank',
    type: 'bank',
    bankName: 'MB Bank Quân Đội',
    accountNumber: '****8888',
    initialBalance: 0,
    currentBalance: 0,
    icon: 'Landmark',
    color: '#2563eb'
  },
  {
    id: 'wallet_momo',
    name: 'Ví MoMo',
    type: 'e-wallet',
    bankName: 'Ví điện tử MoMo',
    accountNumber: '098***999',
    initialBalance: 0,
    currentBalance: 0,
    icon: 'Smartphone',
    color: '#d946ef'
  }
];
