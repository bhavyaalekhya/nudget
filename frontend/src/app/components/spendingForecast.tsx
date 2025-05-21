'use client';

import { useEffect, useState } from 'react';
import { fetchPrediction, PredictionResponse } from '@/utils/fetchPrediction';

export default function SpendingForecast() {
  const [data, setData] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPrediction()
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return <p>Loading...</p>;

  const {
    predictedTotal = 0,
    previousMonthTotal = 0,
    percentageChange = 0,
    pacingEstimate = 0,
    predictedChange = 0,
  } = data;

  {console.log(predictedChange);}

  return (
    <div className="p-4 rounded-xl bg-white shadow space-y-2">
      <h2 className="text-lg font-bold">Spending Forecast</h2>
      <p>
        At your current pace, you're projected to spend{' '}
        <strong>${pacingEstimate.toFixed(2)}</strong> this month.
      </p>
      {/*<p>*/}
      {/*  Our model predicts a total of{' '}*/}
      {/*  <strong>${predictedTotal.toFixed(2)}</strong>, which is{' '}*/}
      {/*  <strong>{Math.abs(predictedChange).toFixed(1)}%</strong>{' '}*/}
      {/*  {predictedChange > 0 ? 'more' : 'less'} than last month (${previousMonthTotal.toFixed(2)}).*/}
      {/*</p>*/}
    </div>
  );
}
