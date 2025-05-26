'use client';
import { useState } from "react";
import Navbar from "@/app/components/navbar";
import AddExp from "@/app/components/addexp";
import CurrMonth from "@/app/components/currmonth";
import Charts from "@/app/components/charts";
import SummaryPanel from "@/app/components/summarypanel";
import SpendingForecast from "@/app/components/spendingForecast";
import { useTheme } from "@/app/context/themecontext";

export default function Dashboard() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { theme } = useTheme(); // 🎯 Access the theme

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
    setShowForm(false); // Hide form on successful submission
  };

  return (
    <div
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}
    >
      <Navbar />

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300`}
          style={{
            backgroundColor: toast.type === 'success' ? '#16a34a' : '#dc2626'
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="px-4 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Current Month</h2>
              <button
                onClick={() => setShowForm(prev => !prev)}
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff'
                }}
                className="px-4 py-2 rounded hover:opacity-80 transition"
              >
                + Add New Expense
              </button>
            </div>

            {showForm && (
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-md">
                  <AddExp
                    onFeedbackAction={showToast}
                    onExpenseAddedAction={triggerRefresh}
                  />
                </div>
              </div>
            )}

            <CurrMonth refreshFlag={refreshFlag} fullView section="expenses" />
            <CurrMonth refreshFlag={refreshFlag} fullView section="income" />
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <SpendingForecast />
            <SummaryPanel refreshFlag={refreshFlag} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Charts type="payment" refreshFlag={refreshFlag} />
              <Charts type="category" refreshFlag={refreshFlag} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
