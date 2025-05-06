'use client';

import React, { useEffect, useState } from "react";
import {Transaction} from "@/types/trans";

type PrevMonthProps = {
  month: string; // Format: "YYYY-MM"
};

export default function PrevMonth({ month }: PrevMonthProps) {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ income: 0, expenses: 0 });

  // Fetch and process transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?month=${month}`);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const { expenses, incomes } = await res.json();

        const getMonthKey = (dateStr: string) =>
          new Date(dateStr).toISOString().slice(0, 7);

        // Sort and set data
        const filteredExpenses = expenses.filter((e: Transaction) => getMonthKey(e.date) === month);
        const filteredIncome = incomes.filter((i: Transaction) => getMonthKey(i.date) === month);

        setExpenses(filteredExpenses);
        setIncome(filteredIncome);

        // Calculate totals
        const totalExpense = filteredExpenses.reduce((sum: number, e: Transaction) => sum + e.amount, 0);
        const totalIncome = filteredIncome.reduce((sum: number, i: Transaction) => sum + i.amount, 0);

        setTotals({ income: totalIncome, expenses: totalExpense });
      } catch (error) {
        console.error("Error fetching previous month data:", error);
      }
    };

    fetchData();
  }, [month]);

  const [year, monthNumber] = month.split('-');
  const displayMonth = new Date(Number(year), Number(monthNumber) - 1, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const toTitleCase = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const renderTable = (title: string, data: Transaction[], isIncome: boolean) => (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-[#9CB89D] text-white">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">{isIncome ? "Source" : "Merchant"}</th>
            <th className="p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr key={idx} className="border-b hover:bg-[#e3eee6]">
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

  return (
    <div className="text-black mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* Title */}
      <div className="text-center font-bold text-2xl">{displayMonth}</div>

      {/* Totals */}
      <div className="grid grid-cols-2 items-center text-center gap-4 bg-white p-4 rounded-xl shadow w-full">
        <div>
          <div className="font-medium text-black">Total Income</div>
          <div className="text-[#7FAF7C] text-2xl font-bold mt-1">
            ${totals.income}
          </div>
        </div>
        <div>
          <div className="font-medium text-black">Total Expenses</div>
          <div className="text-[#C28585] text-2xl font-bold mt-1">
            ${totals.expenses}
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="flex flex-col md:flex-row gap-6">
        {renderTable("Expenses", expenses, false)}
        {renderTable("Income", income, true)}
      </div>
    </div>
  );
}
