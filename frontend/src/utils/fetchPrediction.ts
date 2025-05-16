export type PredictionResponse = {
  predictedTotal: number;
  lastMonthTotal: number;
  percentageChange: number;
  pacingEstimate: number;
  cached: boolean;
};

export async function fetchPrediction(): Promise<PredictionResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prediction`, { method: "GET"});

  if (!res.ok) {
    throw new Error('Failed to fetch prediction');
  }

  return res.json();
}
