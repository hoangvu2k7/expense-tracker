import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Transaction,
  Wallet,
  Category,
  Budget,
  SavingsGoal,
  RecurringTransaction,
  SmartInsight
} from '../types';
import { DEFAULT_CATEGORIES, DEFAULT_WALLETS } from '../data/initialData';
import {
  getDemoWallets,
  getDemoTransactions,
  getDemoBudgets,
  getDemoGoals,
  getDemoRecurring
} from '../data/mockData';
import { getCurrentMonth, getTodayDate } from '../utils/formatters';
import { generateSmartInsights } from '../utils/insights';

interface AppContextType {
  // State
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Category[];
  budgets: Budget[];
  goals: SavingsGoal[];
  recurring: RecurringTransaction[];
  isDemoMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  smartInsights: SmartInsight[];

  // Modal controls
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: 'expense' | 'income';
  setQuickAddType: (type: 'expense' | 'income') => void;
  isTransferOpen: boolean;
  setIsTransferOpen: (open: boolean) => void;
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  isBudgetModalOpen: boolean;
  setIsBudgetModalOpen: (open: boolean) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isRecurringModalOpen: boolean;
  setIsRecurringModalOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (t: Transaction | null) => void;
  depositGoalModal: SavingsGoal | null;
  setDepositGoalModal: (g: SavingsGoal | null) => void;

  // Actions
  addTransaction: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  addWallet: (wallet: Omit<Wallet, 'id' | 'currentBalance'>) => void;
  updateWallet: (id: string, data: Partial<Wallet>) => void;
  deleteWallet: (id: string) => void;
  transferMoney: (fromWalletId: string, toWalletId: string, amount: number, note?: string, date?: string) => void;

  setCategoryBudget: (categoryId: string, amount: number, month?: string) => void;
  deleteBudget: (id: string) => void;

  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => void;
  updateSavingsGoal: (id: string, data: Partial<SavingsGoal>) => void;
  depositToGoal: (goalId: string, amount: number, walletId: string) => void;
  deleteSavingsGoal: (id: string) => void;

  addRecurring: (data: Omit<RecurringTransaction, 'id' | 'isActive'>) => void;
  payRecurringNow: (recurringItem: RecurringTransaction) => void;
  toggleRecurring: (id: string) => void;
  deleteRecurring: (id: string) => void;

  // Demo / Reset
  loadDemoData: () => void;
  resetToCleanSlate: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'expense_tracker_transactions',
  WALLETS: 'expense_tracker_wallets',
  CATEGORIES: 'expense_tracker_categories',
  BUDGETS: 'expense_tracker_budgets',
  GOALS: 'expense_tracker_goals',
  RECURRING: 'expense_tracker_recurring',
  IS_DEMO: 'expense_tracker_is_demo'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Month
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'expense' | 'income'>('expense');
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [depositGoalModal, setDepositGoalModal] = useState<SavingsGoal | null>(null);

  // Initialize state from LocalStorage or Load Demo as default on first visit
  const [isDemoMode, setIsDemoMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IS_DEMO);
    return saved !== null ? JSON.parse(saved) : true; // Default to true so user immediately sees rich data!
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WALLETS);
    if (saved) return JSON.parse(saved);
    return getDemoWallets();
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (saved) return JSON.parse(saved);
    return getDemoTransactions();
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (saved) return JSON.parse(saved);
    return getDemoBudgets();
  });

  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (saved) return JSON.parse(saved);
    return getDemoGoals();
  });

  const [recurring, setRecurring] = useState<RecurringTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECURRING);
    if (saved) return JSON.parse(saved);
    return getDemoRecurring();
  });

  // Keep wallet balances automatically synchronized based on transactions & initial balances
  useEffect(() => {
    setWallets((prevWallets) => {
      return prevWallets.map((wallet) => {
        let balance = wallet.initialBalance || 0;
        transactions.forEach((tx) => {
          if (tx.walletId === wallet.id) {
            if (tx.type === 'expense') balance -= tx.amount;
            else if (tx.type === 'income') balance += tx.amount;
            else if (tx.type === 'transfer') balance -= tx.amount;
          }
          if (tx.type === 'transfer' && tx.toWalletId === wallet.id) {
            balance += tx.amount;
          }
        });
        return { ...wallet, currentBalance: balance };
      });
    });
  }, [transactions]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WALLETS, JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(recurring));
  }, [recurring]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IS_DEMO, JSON.stringify(isDemoMode));
  }, [isDemoMode]);

  // Compute Smart Insights
  const smartInsights = useMemo(() => {
    return generateSmartInsights(transactions, budgets, categories, recurring);
  }, [transactions, budgets, categories, recurring]);

  // Actions
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...data } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };

  const addWallet = (data: Omit<Wallet, 'id' | 'currentBalance'>) => {
    const newWallet: Wallet = {
      ...data,
      id: `wallet_${Date.now()}`,
      currentBalance: data.initialBalance
    };
    setWallets((prev) => [...prev, newWallet]);
  };

  const updateWallet = (id: string, data: Partial<Wallet>) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...data } : w))
    );
  };

  const deleteWallet = (id: string) => {
    // Delete wallet and related transactions
    setWallets((prev) => prev.filter((w) => w.id !== id));
    setTransactions((prev) => prev.filter((t) => t.walletId !== id && t.toWalletId !== id));
  };

  const transferMoney = (
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    note?: string,
    date?: string
  ) => {
    const fromW = wallets.find((w) => w.id === fromWalletId);
    const toW = wallets.find((w) => w.id === toWalletId);
    const defaultNote = `Chuyển tiền: ${fromW?.name || ''} ➔ ${toW?.name || ''}`;

    const newTx: Transaction = {
      id: `tx_transfer_${Date.now()}`,
      amount,
      type: 'transfer',
      walletId: fromWalletId,
      toWalletId,
      date: date || getTodayDate(),
      note: note || defaultNote,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const setCategoryBudget = (categoryId: string, amount: number, month?: string) => {
    const targetMonth = month || selectedMonth;
    setBudgets((prev) => {
      const existingIndex = prev.findIndex(
        (b) => b.categoryId === categoryId && b.month === targetMonth
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], amount };
        return updated;
      }
      return [
        ...prev,
        {
          id: `bdg_${Date.now()}`,
          categoryId,
          amount,
          month: targetMonth
        }
      ];
    });
  };

  const deleteBudget = (id: string) => {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      currentAmount: 0
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const updateSavingsGoal = (id: string, data: Partial<SavingsGoal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...data } : g))
    );
  };

  const depositToGoal = (goalId: string, amount: number, walletId: string) => {
    const targetGoal = goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    // Create a transaction of expense under goal category or house/investment
    const newTx: Transaction = {
      id: `tx_goal_${Date.now()}`,
      amount,
      type: 'expense',
      categoryId: 'cat_investment',
      walletId,
      date: getTodayDate(),
      note: `Nạp tiền vào Hũ tiết kiệm: ${targetGoal.name}`,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g
      )
    );
  };

  const deleteSavingsGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const addRecurring = (data: Omit<RecurringTransaction, 'id' | 'isActive'>) => {
    const newItem: RecurringTransaction = {
      ...data,
      id: `rec_${Date.now()}`,
      isActive: true
    };
    setRecurring((prev) => [...prev, newItem]);
  };

  const payRecurringNow = (recurringItem: RecurringTransaction) => {
    const today = getTodayDate();
    const newTx: Transaction = {
      id: `tx_rec_${Date.now()}`,
      amount: recurringItem.amount,
      type: recurringItem.type,
      categoryId: recurringItem.categoryId,
      walletId: recurringItem.walletId,
      date: today,
      note: `Thanh toán định kỳ: ${recurringItem.name}`,
      createdAt: new Date().toISOString()
    };
    setTransactions((prev) => [newTx, ...prev]);

    setRecurring((prev) =>
      prev.map((r) =>
        r.id === recurringItem.id ? { ...r, lastPaidDate: today } : r
      )
    );
  };

  const toggleRecurring = (id: string) => {
    setRecurring((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  };

  const deleteRecurring = (id: string) => {
    setRecurring((prev) => prev.filter((r) => r.id !== id));
  };

  const loadDemoData = () => {
    setIsDemoMode(true);
    setCategories(DEFAULT_CATEGORIES);
    setWallets(getDemoWallets());
    setTransactions(getDemoTransactions());
    setBudgets(getDemoBudgets());
    setGoals(getDemoGoals());
    setRecurring(getDemoRecurring());
  };

  const resetToCleanSlate = () => {
    setIsDemoMode(false);
    setCategories(DEFAULT_CATEGORIES);
    setWallets(DEFAULT_WALLETS);
    setTransactions([]);
    setBudgets([]);
    setGoals([]);
    setRecurring([]);
  };

  return (
    <AppContext.Provider
      value={{
        transactions,
        wallets,
        categories,
        budgets,
        goals,
        recurring,
        isDemoMode,
        activeTab,
        setActiveTab,
        selectedMonth,
        setSelectedMonth,
        smartInsights,

        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddType,
        setQuickAddType,
        isTransferOpen,
        setIsTransferOpen,
        isWalletModalOpen,
        setIsWalletModalOpen,
        isBudgetModalOpen,
        setIsBudgetModalOpen,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isRecurringModalOpen,
        setIsRecurringModalOpen,
        editingTransaction,
        setEditingTransaction,
        depositGoalModal,
        setDepositGoalModal,

        addTransaction,
        updateTransaction,
        deleteTransaction,
        addWallet,
        updateWallet,
        deleteWallet,
        transferMoney,
        setCategoryBudget,
        deleteBudget,
        addSavingsGoal,
        updateSavingsGoal,
        depositToGoal,
        deleteSavingsGoal,
        addRecurring,
        payRecurringNow,
        toggleRecurring,
        deleteRecurring,
        loadDemoData,
        resetToCleanSlate
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
