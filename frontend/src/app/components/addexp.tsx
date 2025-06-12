'use client';

import React, { useState, useEffect } from "react";
import { useTheme } from "@/app/context/themecontext";

type AddExpProps = {
  onFeedbackAction: (message: string, type: 'success' | 'error') => void;
  onExpenseAddedAction: () => void;
};

const HF_API_URL = "https://balekhya-nudget.hf.space";

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

  const [availablePayments, setAvailablePayments] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

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

  useEffect(() => {
    const fetchCategory = async () => {
      if (form.mode !== "expense" || !form.name) return;

      try {
        const res = await fetch(`${HF_API_URL}/categorize?description=${encodeURIComponent(form.name)}`);
        const data = await res.json();
        if (data?.category) {
          setForm(prev => ({ ...prev, category: data.category }));
        } else {
          setForm(prev => ({ ...prev, category: "other" }));
        }
      } catch (err) {
        console.error("Failed to fetch category:", err);
        setForm(prev => ({ ...prev, category: "other" }));
      }
    };

    fetchCategory();
  }, [form.name, form.mode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation check: Required fields
    if (!form.mode || !form.exp || !form.currDate || !form.name || !form.category) {
      onFeedbackAction("Please fill in all required fields.", "error");
      return;
    }

    const finalPayment =
      (form.payment === "custom" ? form.customPayment : form.payment).replace(/\s+/g, '') || "unknown";

    const payload = {
      mode: form.mode,
      name: form.name.trim().toLowerCase() || "untitled",
      amount: parseFloat(form.exp),
      category: form.category.toLowerCase() || "other",
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


  return (
    <div className="shadow rounded-[12px] max-w-md"
         style={{
           backgroundColor: theme.cardColor,
           color: theme.textColor,
           fontFamily: theme.fontFamily,
           transition: 'all 0.3s ease',
         }}>
      <div className="flex flex-col items-center justify-between font-bold text-[26px]">Add</div>
      <div className="p-6 h-[85%] flex items-start justify-center">
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-[18px]">

          <div>
            <label>Type</label>
            <select name="mode" value={form.mode} onChange={handleChange} className="w-full p-2 rounded-md border border-gray-300 mt-1">
              <option value="">Select Type</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label>Date</label>
            <input type="date" name="currDate" value={form.currDate} onChange={handleChange}
                   className="w-full p-2 rounded-md border border-gray-300 mt-1" />
          </div>

          <div>
            <label>Amount</label>
            <input type="number" name="exp" value={form.exp} onChange={handleChange}
                   className="w-full p-2 rounded-md border border-gray-300 mt-1" placeholder="e.g., 50" />
          </div>

          {form.mode === "expense" && (
            <div>
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                     className="w-full p-2 rounded-md border border-gray-300 mt-1" placeholder="e.g., Groceries" />

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
              <input type="text" name="customPayment" value={form.customPayment} onChange={handleChange}
                     className="w-full p-2 rounded-md border border-gray-300 mt-1" placeholder="Enter new payment" />
            </div>
          )}

          {/*<div>*/}
          {/*  <label>Category</label>*/}
          {/*  <select name="category" value={form.category} onChange={handleChange}*/}
          {/*          className="w-full p-2 rounded-md border border-gray-300 mt-1">*/}
          {/*    <option value="">Select Category</option>*/}
          {/*    {form.mode === "expense" && (*/}
          {/*      <>*/}
          {/*        <option value="food">Food</option>*/}
          {/*        <option value="transport">Transport</option>*/}
          {/*        <option value="shopping">Shopping</option>*/}
          {/*        <option value="utilities">Utilities</option>*/}
          {/*      </>*/}
          {/*    )}*/}
          {/*    {form.mode === "income" && (*/}
          {/*      <>*/}
          {/*        <option value="salary">Salary</option>*/}
          {/*        <option value="freelance">Freelance</option>*/}
          {/*        <option value="bonus">Bonus</option>*/}
          {/*      </>*/}
          {/*    )}*/}
          {/*    <option value="custom">+ Add New Category</option>*/}
          {/*  </select>*/}
          {/*</div>*/}

          {/*{form.category === "custom" && (*/}
          {/*  <div>*/}
          {/*    <label>New Category</label>*/}
          {/*    <input type="text" name="customCategory" value={form.customCategory} onChange={handleChange}*/}
          {/*           className="w-full p-2 rounded-md border border-gray-300 mt-1" placeholder="Enter new category" />*/}
          {/*  </div>*/}
          {/*)}*/}

          {form.mode === "expense" && form.category && (
            <div>
              <label>Predicted Category</label>
              <input
                type="text"
                value={form.category}
                readOnly
                className="w-full p-2 rounded-md border border-gray-300 mt-1 bg-gray-100 text-gray-600"
              />
            </div>
          )}

          <button type="submit"
                  className="w-full bg-[#9CB89D] text-black py-2 rounded-md hover:bg-[#7ea185] transition font-semibold mt-4">
            Add {form.mode === "income" ? "Income" : "Expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
