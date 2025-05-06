'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";

type Transaction = {
  date: string;
  amount: number;
  mode: string;
  payment?: string;
  category: string;
  name: string;
};

export default function ViewAll() {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [income, setIncome] = useState<Transaction[]>([]);

  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const { expenses, incomes } = await res.json();

        const getMonthKey = (dateStr: string) => new Date(dateStr).toISOString().slice(0, 7);
        const currentMonthKey = new Date().toISOString().slice(0, 7);

        setExpenses(expenses.filter((e: Transaction) => getMonthKey(e.date) === currentMonthKey));
        setIncome(incomes.filter((i: Transaction) => getMonthKey(i.date) === currentMonthKey));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const toTitleCase = (str: string) =>
    str.trim().toLowerCase().split(' ')
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const renderTable = (title: string, data: Transaction[], isIncome: boolean) => {
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
      <div className="shadow-md rounded-lg p-6 w-full">
        <h2 className="text-xl font-semibold text-center mb-4">{title}</h2>
        <table className="w-full text-center border-collapse">
          <thead className="bg-[#9CB89D] text-white">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">{isIncome ? "Source" : "Merchant"}</th>
              <th className="p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-[#e3eee6]">
                <td className="p-2">{item.date.split("T")[0].split("-").reverse().join("/")}</td>
                <td className="p-2">{toTitleCase(isIncome ? item.category : item.name)}</td>
                <td className="p-2">{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
  <div className="min-h-screen px-4 py-6 font-[family-name:var(--font-poppins)] text-black">
    <Navbar />
    <div className="text-center text-[26px] font-bold mb-8">
      {month}, {year}
    </div>

    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
      {/* Expenses Table */}
      <div className="w-full md:w-1/2 bg-white shadow rounded-lg">
        {renderTable("Expenses", expenses, false)}
      </div>

      {/* Income Table */}
      <div className="w-full md:w-1/2 bg-white shadow rounded-lg">
        {renderTable("Income", income, true)}
      </div>
    </div>
  </div>
);
}
