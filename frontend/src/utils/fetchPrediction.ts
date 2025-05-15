export type PredictionResponse = {
  predictedTotal: number;
  lastMonthTotal: number;
  percentageChange: number;
  pacingEstimate: number;
  cached: boolean;
};

export async function fetchPrediction(): Promise<PredictionResponse> {
  const res = await fetch('http://localhost:5050/api/predictions');

  if (!res.ok) {
    throw new Error('Failed to fetch prediction');
  }

  return res.json();
}
