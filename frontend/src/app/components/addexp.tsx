'use client';

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/themecontext";

type AddExpProps = {
  onFeedbackAction: (message: string, type: 'success' | 'error') => void;
  onExpenseAddedAction: () => void;
};

export default function AddExp({ onFeedbackAction, onExpenseAddedAction }: AddExpProps) {
  const { theme } = useTheme();
  const [form, setForm] = useState({
    currDate: "",
    exp: "",
    mode: "",
    name: "",
    payment: "",
    category: "",
    customCategory: "",
    customPayment: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalCategory = form.category === "custom" ? form.customCategory : form.category;
    let finalPayment = form.payment === "custom" ? form.customPayment : form.payment;

    finalPayment = finalPayment.replace(/\s+/g, '');

    const payload = {
      mode: form.mode,
      name: form.name.trim().toLowerCase() || "untitled",
      amount: parseFloat(form.exp),
      category: finalCategory.toLowerCase(),
      date: form.currDate,
      payment: finalPayment.toLowerCase(),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        onFeedbackAction("Expense added successfully", "success");
        onExpenseAddedAction();
        setForm({
          currDate: "",
          exp: "",
          mode: "",
          name: "",
          payment: "",
          category: "",
          customCategory: "",
          customPayment: ""
        });
      } else {
        onFeedbackAction(result.error || "Failed to add expense", "error");
      }
    } catch (err) {
      console.error("Server error:", err);
      onFeedbackAction("Server error. Please try again.", "error");
    }
  };

  const [availablePayments, setAvailablePayments] = useState<string[]>([]);

  useEffect(() => {
    const fetchPaymentModes = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/payment-modes`);
        const data = await res.json();
        setAvailablePayments(data.modes || []);
      } catch (err) {
        console.error("Failed to fetch payment modes:", err);
      }
    };

    fetchPaymentModes();
  }, []);

  return (
    <div className="shadow rounded-[12px] max-w-md"
         style={{ backgroundColor: theme.cardColor,
         color: theme.textColor,
         fontFamily: theme.fontFamily,
         transition: 'all 0.3s ease',
         }}>
      <div className="flex flex-col items-center justify-between font-bold text-[26px]">Add</div>
      <div className="p-6 h-[85%] flex items-start justify-center">
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-[18px]">

          {/* Type */}
          <div>
            <label>Type</label>
            <select name="mode" value={form.mode} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300 mt-1">
              <option value="">Select Type</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label>Date</label>
            <input
              type="date"
              name="currDate"
              value={form.currDate}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 mt-1"
            />
          </div>

          {/* Amount */}
          <div>
            <label>Amount</label>
            <input
              type="number"
              name="exp"
              value={form.exp}
              onChange={handleChange}
              className="w-full p-2 rounded-md border border-gray-300 mt-1"
              placeholder="e.g., 50"
            />
          </div>

          {/* Payment (Only for Expense) */}
          {form.mode === "expense" && (
              <div>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 mt-1"
                    placeholder="e.g., Groceries"
                />

                <label>Payment</label>
                <select name="payment" value={form.payment} onChange={handleChange}
                        className="w-full p-2 rounded-md border border-gray-300 mt-1">
                  <option value="">Select Payment</option>
                  {availablePayments.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                  <option value="custom">+ Add New Payment</option>
                </select>
              </div>
          )}

          {form.payment === "custom" && (
            <div>
              <label>New Payment</label>
              <input
                type="text"
                name="customPayment"
                value={form.customPayment}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 mt-1"
                placeholder="Enter new payment"
              />
            </div>
          )}

          {/* Category */}
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}
                    className="w-full p-2 rounded-md border border-gray-300 mt-1">
              <option value="">Select Category</option>
              {form.mode === "expense" && (
                <>
                  <option value="food">Food</option>
                  <option value="transport">Transport</option>
                  <option value="shopping">Shopping</option>
                  <option value="utilities">Utilities</option>
                </>
              )}
              {form.mode === "income" && (
                <>
                  <option value="salary">Salary</option>
                  <option value="freelance">Freelance</option>
                  <option value="bonus">Bonus</option>
                </>
              )}
              <option value="custom">+ Add New Category</option>
            </select>
          </div>

          {/* Custom Category */}
          {form.category === "custom" && (
            <div>
              <label>New Category</label>
              <input
                type="text"
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                className="w-full p-2 rounded-md border border-gray-300 mt-1"
                placeholder="Enter new category"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#9CB89D] text-black py-2 rounded-md hover:bg-[#7ea185] transition font-semibold mt-4"
          >
            Add {form.mode === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
