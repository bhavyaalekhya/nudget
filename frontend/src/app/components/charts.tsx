'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
    Filler,
  ChartData,
} from 'chart.js';
import {PolarArea, Pie} from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import { Transaction } from "@/types/trans";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
    Filler
);

type ChartsProps = {
  refreshFlag: boolean;
  type: 'payment' | 'category'; // Specify which chart to show
};

export default function Charts({ refreshFlag, type }: ChartsProps) {
  const [paymentData, setPaymentData] = useState<ChartData<'pie'> | null>(null);
  const [categoryData, setCategoryData] = useState<ChartData<'polarArea'> | null>(null);

  const normalizePayment = (raw: string = ''): string => {
    const val = raw.trim().toLowerCase();
    if (val === 'debit') return 'Debit';
    if (val === 'chasecredit') return 'Chase';
    if (val === 'applecredit') return 'Apple';
    return 'Unknown';
  };

  const polarOptions = {
    scales: {
      r: {
        grid: { display: false },
        ticks: { display: false },
      },
    },
  };

  const basePaymentColors: Record<string, string> = {
      debit: '#A66C91',
      chasecredit: '#B08CCC',
      applecredit: '#F3A99F',
      cash: '#FDD49E',
    };

    const fallbackColors = [
      '#D3D3D3', '#A1C6EA', '#FFC5C5', '#C1E1C1', '#F4B183',
      '#B3A1C6', '#F6E2B3', '#B4D2BA', '#F6B5B5', '#CABBE9',
    ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`);
        if (!res.ok) throw new Error("Failed to fetch transactions");

        const { expenses } = await res.json();
        const currMonthKey = new Date().toISOString().slice(0, 7);
        const monthKey = (d: string) => new Date(d).toISOString().slice(0, 7);

        const currentExpenses = expenses.filter(
          (e: Transaction) => monthKey(e.date) === currMonthKey
        );

        const payments: Record<string, number> = {};
        const categories: Record<string, number> = {};

        for (const t of currentExpenses) {
          const method = normalizePayment(t.mode);
          payments[method] = (payments[method] || 0) + t.amount;
          categories[t.category] = (categories[t.category] || 0) + t.amount;
        }

        const paymentLabels = Object.keys(payments);
        setPaymentData({
          labels: paymentLabels,
          datasets: [
            {
              label: 'By Payment Method',
              data: Object.values(payments),
              backgroundColor: paymentLabels.map((p, i) => {
                const key = p.toLowerCase();
                return basePaymentColors[key] || fallbackColors[i % fallbackColors.length];
              }),
            },
          ],
        });

        const categoryLabels = Object.keys(categories);
        setCategoryData({
          labels: categoryLabels,
          datasets: [
            {
              label: 'By Category',
              data: Object.values(categories),
              backgroundColor: [
                '#FC9272', '#9E9AC8', '#66C2A5', '#FDD49E', '#A6BDDB', '#BCBCBC',
              ],
            },
          ],
        });
      } catch (err) {
        console.error("Chart data fetch error:", err);
      }
    };

    fetchData();
  }, [refreshFlag]);

  return (
    <div className="p-4">
      {type === 'payment' && paymentData && (
        <>
          <h3 className="text-lg font-semibold text-center mb-4">Payment Method</h3>
          <Pie data={paymentData} />
        </>
      )}
      {type === 'category' && categoryData && (
        <>
          <h3 className="text-lg font-semibold text-center mb-4">Spending by Category</h3>
          <PolarArea data={categoryData} options={polarOptions} />
        </>
      )}
    </div>
  );
}
