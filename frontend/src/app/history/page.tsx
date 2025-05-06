'use client';
import { useEffect, useState } from "react";
import Navbar from "@/app/components/navbar";
import PrevMonth from "@/app/components/prevmonth";

export default function History() {
  const [selectMonth, setSelectMonth] = useState('');
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
  const fetchMonths = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions/months`);
      const data = await res.json();

      if (!data.months || !Array.isArray(data.months)) {
        console.error("Unexpected response:", data);
        setAvailableMonths([]); // prevent crash
        return;
      }

      setAvailableMonths(data.months);
    } catch (err) {
      console.error("Error fetching months:", err);
      setAvailableMonths([]);
    }
  };

  fetchMonths();
}, []);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectMonth(e.target.value);
  };

  return (
    <div className="bg-[#D9E4DD] min-h-screen font-[family-name:var(--font-poppins)] text-black">
      <Navbar />
      <div className="px-4 py-16 max-w-7xl mx-auto">
        <h2 className="text-3xl text-center font-semibold mb-4">Expense History</h2>

        <div className="p-6 flex items-center text-center gap-4">
          <label className="text-2xl whitespace-nowrap font-medium">Month</label>
          <select
            className="p-2 rounded-md border border-gray-300"
            value={selectMonth}
            onChange={handleSelectChange}
          >
            <option value="">Select Month</option>
            {availableMonths.map((month) => {
              const [year, m] = month.split("-");
              const label = new Date(Number(year), Number(m) - 1).toLocaleString("default", {
                month: "long",
                year: "numeric",
              });

              return (
                <option key={month} value={month}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>

        {selectMonth && <PrevMonth month={selectMonth} />}
      </div>
    </div>
  );
}
