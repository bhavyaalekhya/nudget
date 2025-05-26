'use client';

import { ChangeEvent, useEffect, useState } from 'react';
import { Transaction } from '@/types/trans';
import { useTheme } from '@/app/context/themecontext';

type Props = {
  refreshFlag: boolean;
  budgetLimit?: number;
};

export default function SummaryPanel({ refreshFlag, budgetLimit }: Props) {
  const { theme } = useTheme();
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });
  const [budget, setBudget] = useState<number | undefined>();
  const [editingBudget, setEditingBudget] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('user-budget');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed)) {
        setBudget(parsed);
      }
    }
  }, []);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`);
        if (!res.ok) throw new Error('Failed to fetch');

        const { expenses, incomes } = await res.json();
        const currentMonthKey = new Date().toISOString().slice(0, 7);
        const getMonthKey = (d: string) => new Date(d).toISOString().slice(0, 7);

        const monthlyExpenses = expenses.filter((e: Transaction) => getMonthKey(e.date) === currentMonthKey);
        const monthlyIncome = incomes.filter((i: Transaction) => getMonthKey(i.date) === currentMonthKey);

        const totalExpense = monthlyExpenses.reduce((sum: number, e: Transaction) => sum + e.amount, 0);
        const totalIncome = monthlyIncome.reduce((sum: number, i: Transaction) => sum + i.amount, 0);

        setTotals({ income: totalIncome, expenses: totalExpense });
      } catch (err) {
        console.error('Error fetching totals:', err);
      }
    };

    fetchTotals();
  }, [refreshFlag]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(event.target.value);
    if (!isNaN(parsed)) {
      setBudget(parsed);
      localStorage.setItem('user-budget', parsed.toString());
    }
  };

  const activeBudget = budget ?? budgetLimit ?? 1; // avoid div by 0
  const usagePercent = (totals.expenses / activeBudget) * 100;

  const getProgressColor = () => {
    if (usagePercent < 70) return '#7FAF7C'; // green
    if (usagePercent < 90) return '#D3B86A'; // yellow
    return '#C28585'; // red
  };

  return (
    <div
      className="p-4 rounded-xl shadow text-center space-y-4"
      style={{
        backgroundColor: theme.cardColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header and Modify Button */}
      <div>
        <div className="flex justify-between text-sm font-medium mb-1" style={{ color: theme.textColor }}>
          <span>Monthly Budget Usage</span>
          <button
            onClick={() => setEditingBudget(prev => !prev)}
            style={{
              backgroundColor: theme.primaryColor,
              color: '#fff',
            }}
            className="px-4 py-1 rounded hover:opacity-80 text-xs transition"
          >
            + Modify Budget
          </button>
        </div>

        {/* Budget Input */}
        {editingBudget && (
          <input
            type="number"
            placeholder="Enter budget"
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setEditingBudget(false);
              }
            }}
            className="w-full border rounded px-3 py-1 mb-2"
            defaultValue={budget ?? ''}
          />
        )}

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(usagePercent, 100)}%`,
              backgroundColor: getProgressColor(),
            }}
          />
        </div>
        <div className="text-sm mt-1 text-left" style={{ color: theme.textColor }}>
          {usagePercent.toFixed(1)}% of ${activeBudget} used
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium" style={{ color: theme.textColor }}>Total Income</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#7FAF7C' }}>
            ${totals.income.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="font-medium" style={{ color: theme.textColor }}>Total Expenses</div>
          <div className="text-2xl font-bold mt-1" style={{ color: '#C28585' }}>
            ${totals.expenses.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
