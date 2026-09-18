import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionList } from './components/transactions/TransactionList';
import { WalletList } from './components/wallets/WalletList';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { BudgetList } from './components/budgets/BudgetList';
import { GoalList } from './components/goals/GoalList';
import { RecurringList } from './components/recurring/RecurringList';

// Modals
import { TransactionModal } from './components/transactions/TransactionModal';
import { TransferModal } from './components/transactions/TransferModal';
import { WalletModal } from './components/wallets/WalletModal';
import { BudgetModal } from './components/budgets/BudgetModal';
import { GoalModal } from './components/goals/GoalModal';
import { DepositModal } from './components/goals/DepositModal';
import { RecurringModal } from './components/recurring/RecurringModal';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'transactions':
        return <TransactionList />;
      case 'wallets':
        return <WalletList />;
      case 'analytics':
        return <AnalyticsView />;
      case 'budgets':
        return <BudgetList />;
      case 'goals':
        return <GoalList />;
      case 'recurring':
        return <RecurringList />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 md:pb-8">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <TransactionModal />
      <TransferModal />
      <WalletModal />
      <BudgetModal />
      <GoalModal />
      <DepositModal />
      <RecurringModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
