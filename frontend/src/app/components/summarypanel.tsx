'use client';

import { useEffect, useState } from "react";
import { Transaction } from '@/types/trans';

type Props = {
  refreshFlag: boolean;
  budgetLimit?: number;
};

export default function SummaryPanel({ refreshFlag, budgetLimit = 10000 }: Props) {
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`);
        if (!res.ok) throw new Error("Failed to fetch");

        const { expenses, incomes } = await res.json();
        const currentMonthKey = new Date().toISOString().slice(0, 7);
        const getMonthKey = (d: string) => new Date(d).toISOString().slice(0, 7);

        const monthlyExpenses = expenses.filter((e: Transaction) => getMonthKey(e.date) === currentMonthKey);
        const monthlyIncome = incomes.filter((i: Transaction) => getMonthKey(i.date) === currentMonthKey);

        const totalExpense = monthlyExpenses.reduce((sum: number, e: Transaction) => sum + e.amount, 0);
        const totalIncome = monthlyIncome.reduce((sum: number, i: Transaction) => sum + i.amount, 0);

        setTotals({ income: totalIncome, expenses: totalExpense });
      } catch (err) {
        console.error("Error fetching totals:", err);
      }
    };

    fetchTotals();
  }, [refreshFlag]);

  const usagePercent = (totals.expenses / budgetLimit) * 100;

  const getProgressColor = () => {
    if (usagePercent < 70) return '#7FAF7C';
    if (usagePercent < 90) return '#D3B86A';
    return '#C28585';
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow text-center space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="text-sm font-medium text-gray-600 mb-1 text-left">Monthly Budget Usage</div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(usagePercent, 100)}%`,
                backgroundColor: getProgressColor()
              }}
          />
        </div>
        <div className="text-sm text-gray-600 mt-1 text-left">
          {usagePercent.toFixed(1)}% of ${budgetLimit} used
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="font-medium text-black">Total Income</div>
          <div className="text-[#7FAF7C] text-2xl font-bold mt-1">${totals.income}</div>
        </div>
        <div>
          <div className="font-medium text-black">Total Expenses</div>
          <div className="text-[#C28585] text-2xl font-bold mt-1">${totals.expenses}</div>
        </div>
      </div>
    </div>
  );
}
