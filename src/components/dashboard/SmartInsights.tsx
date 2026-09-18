import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  Lightbulb,
  CheckCircle2,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SmartInsight } from '../../types';
import { useApp } from '../../context/AppContext';

export const SmartInsights: React.FC = () => {
  const { smartInsights, setActiveTab } = useApp();

  if (!smartInsights || smartInsights.length === 0) {
    return null;
  }

  const handleAction = (insight: SmartInsight) => {
    if (insight.actionType === 'open_budget') {
      setActiveTab('budgets');
    } else if (insight.actionType === 'open_goals') {
      setActiveTab('goals');
    } else if (insight.actionType === 'open_transactions') {
      setActiveTab('transactions');
    }
  };

  const getInsightStyle = (type: SmartInsight['type']) => {
    switch (type) {
      case 'danger':
        return {
          cardBg: 'bg-red-50/80 border-red-200 text-red-900',
          icon: AlertOctagon,
          iconColor: 'text-red-600',
          btnClass: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          cardBg: 'bg-amber-50/80 border-amber-200 text-amber-900',
          icon: AlertTriangle,
          iconColor: 'text-amber-600',
          btnClass: 'bg-amber-600 hover:bg-amber-700 text-white'
        };
      case 'success':
        return {
          cardBg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
          icon: CheckCircle2,
          iconColor: 'text-emerald-600',
          btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white'
        };
      case 'tip':
        return {
          cardBg: 'bg-blue-50/80 border-blue-200 text-blue-900',
          icon: Lightbulb,
          iconColor: 'text-blue-600',
          btnClass: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
      default:
        return {
          cardBg: 'bg-slate-50 border-slate-200 text-slate-800',
          icon: Info,
          iconColor: 'text-slate-600',
          btnClass: 'bg-slate-800 hover:bg-slate-900 text-white'
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>Gợi ý & Cảnh báo thông minh (Smart Insights)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {smartInsights.slice(0, 4).map((insight) => {
          const style = getInsightStyle(insight.type);
          const Icon = style.icon;

          return (
            <div
              key={insight.id}
              className={`p-4 rounded-2xl border transition-all shadow-sm ${style.cardBg} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start space-x-3 mb-1.5">
                  <div className={`p-1.5 rounded-xl bg-white/80 shrink-0 mt-0.5`}>
                    <Icon className={`w-4 h-4 ${style.iconColor}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold leading-tight">{insight.title}</h4>
                    <p className="text-xs mt-1 text-slate-700 leading-relaxed">
                      {insight.message}
                    </p>
                  </div>
                </div>
              </div>

              {insight.actionText && (
                <div className="mt-3 pt-2 border-t border-black/5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAction(insight)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors ${style.btnClass}`}
                  >
                    <span>{insight.actionText}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
