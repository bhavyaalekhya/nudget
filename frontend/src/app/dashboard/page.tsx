'use client';
import { useState } from "react";
import Navbar from "@/app/components/navbar";
import AddExp from "@/app/components/addexp";
import CurrMonth from "@/app/components/currmonth";
import Charts from "@/app/components/charts";
import SummaryPanel from "@/app/components/summarypanel";
import SpendingForecast from "@/app/components/spendingForecast";

export default function Dashboard() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const triggerRefresh = () => {
    setRefreshFlag(prev => !prev);
    setShowForm(false); // Hide form on successful submission
  };

  return (
    <div className="bg-[#D9E4DD] min-h-screen font-[family-name:var(--font-poppins)] text-black">
      <Navbar />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg shadow-lg text-white transition-all duration-300
          ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="px-4 py-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Section: Transactions and Add Button */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Current Month</h2>
              <button
                onClick={() => setShowForm(prev => !prev)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add New Expense
              </button>
            </div>

            {showForm && (
              <div className="flex justify-center mb-6">
                {/* Remove bg-white, shadow, p-6 from here */}
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

          {/* Right Section: Charts */}
          {/* Charts column (3rd column) */}
          <div className="w-full lg:w-1/2 space-y-6">
            <SpendingForecast />
            <SummaryPanel refreshFlag={refreshFlag} budgetLimit={1000}/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Charts type="payment" refreshFlag={refreshFlag}/>
              <Charts type="category" refreshFlag={refreshFlag}/>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
