'use client';

import React, { useEffect, useState } from "react";
import { Transaction } from "@/types/trans";
import { useTheme } from "@/app/context/themecontext";

type CurrMonthProps = {
  refreshFlag: boolean;
  fullView?: boolean;
  onViewMore?: () => void;
  section?: 'expenses' | 'income' | 'both';
};

export default function CurrMonth({
  refreshFlag,
  fullView = false,
  onViewMore,
  section = 'both',
}: CurrMonthProps) {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  const { theme } = useTheme();

  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);

  function toTitleCase(input: string): string {
    return input
      .trim()
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const { expenses, incomes } = await res.json();

        const getMonthKey = (dateStr: string) =>
          new Date(dateStr).toISOString().slice(0, 7);
        const currentMonthKey = new Date().toISOString().slice(0, 7);

        setExpenses(expenses.filter((e: Transaction) => getMonthKey(e.date) === currentMonthKey));
        setIncome(incomes.filter((i: Transaction) => getMonthKey(i.date) === currentMonthKey));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [refreshFlag]);

  const renderTable = (title: string, data: Transaction[], isIncome: boolean) => {
    const sortedData = [...data].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const visibleData = fullView ? sortedData : sortedData.slice(0, 3);

    return (
      <div className="w-full" style={{ color: theme.textColor, fontFamily: theme.fontFamily }}>
        <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
        <table className="w-full text-center border-collapse">
          <thead style={{ backgroundColor: theme.secondaryColor, color: '#fff' }}>
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">{isIncome ? "Source" : "Merchant"}</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b hover:brightness-95"
                style={{
                  backgroundColor: idx % 2 === 1 ? theme.cardColor : undefined,
                }}
              >
                <td className="p-2">
                  {item.date.split("T")[0].split("-").reverse().join("/")}
                </td>
                <td className="p-2">
                  {toTitleCase(isIncome ? item.category : item.name)}
                </td>
                <td className="p-2">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      className={`mx-auto ${fullView ? "max-w-4xl" : "max-w-2xl"}`}
      style={{ color: theme.textColor, fontFamily: theme.fontFamily }}
    >
      {(section === 'both' || section === 'expenses' || section === 'income') && (
        <div className="text-center font-bold text-[26px] py-4">
          {month}, {year}
        </div>
      )}

      <div className="flex flex-col gap-6">
        {section === 'expenses' && renderTable("Expenses", expenses, false)}
        {section === 'income' && renderTable("Income", income, true)}
        {section === 'both' && (
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            {renderTable("Expenses", expenses, false)}
            {renderTable("Income", income, true)}
          </div>
        )}
      </div>

      {!fullView && onViewMore && (
        <div className="flex justify-center mt-4 mb-6">
          <button
            onClick={onViewMore}
            className="text-sm hover:underline font-medium"
            style={{ color: theme.primaryColor }}
          >
            View More →
          </button>
        </div>
      )}
    </div>
  );
}
