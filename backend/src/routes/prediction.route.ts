import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';
import { predictNextMonth } from '../utils/predictSpending';

const prisma = new PrismaClient();
const router = Router();

let cachedPrediction: any = null;
let lastRun = 0;
const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours

router.get('/', async (req: Request, res: Response): Promise<any> => {
  const now = new Date();
  const nowMs = now.getTime();

  if (cachedPrediction && nowMs - lastRun < CACHE_TTL) {
    return res.json({ ...cachedPrediction, cached: true });
  }

  try {
    // Get all monthly totals (grouped by month)
    const result = await prisma.$queryRaw<
      { month: string; total: number }[]
    >`
      SELECT strftime('%Y-%m', datetime(date / 1000, 'unixepoch')) AS month, SUM(amount) AS total
      FROM Expense
      GROUP BY month
      ORDER BY month ASC
    `;

    const totals = result.map(row => row.total ?? 0);
    const validTotals = totals.filter(t => t > 0); // remove empty months

    if (validTotals.length < 2) {
      return res.status(400).json({ error: 'Not enough data for prediction.' });
    }

    // Drop current month if it's still in progress
    const completedMonths = validTotals.slice(0, -1);
    const previousMonthTotal = validTotals[validTotals.length - 2];
    console.log(previousMonthTotal); // most recent completed

    const predictedTotal = await predictNextMonth(completedMonths);

    // Guard against divide-by-zero
    const percentageChange = previousMonthTotal > 0
      ? ((predictedTotal - previousMonthTotal) / previousMonthTotal) * 100
      : 0;

    // Get current month spend
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysPassed = now.getDate();
    const daysInMonth = endOfMonth.getDate();

    const currentMonthTotal = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        date: {
          gte: startOfMonth,
          lte: now,
        },
      },
    });

    const currentSpending = currentMonthTotal._sum.amount ?? 0;
    const pacingEstimate = daysPassed > 0
      ? (currentSpending / daysPassed) * daysInMonth
      : 0;

    const predictedChange = previousMonthTotal > 0
      ? ((pacingEstimate - previousMonthTotal) / previousMonthTotal) * 100
      : 0;

    const response = {
      predictedTotal: parseFloat((predictedTotal ?? 0).toFixed(2)),
      previousMonthTotal: parseFloat((previousMonthTotal ?? 0).toFixed(2)),
      percentageChange: parseFloat((percentageChange ?? 0).toFixed(1)),
      pacingEstimate: parseFloat((pacingEstimate ?? 0).toFixed(2)),
      predictedChange: parseFloat((predictedChange ?? 0).toFixed(2)),
    };

    cachedPrediction = response;
    lastRun = nowMs;

    res.json({ ...response, cached: false });
  } catch (error) {
    console.error('[Prediction Error]', error);
    res.status(500).json({ error: 'Prediction failed.' });
  }
});

export default router;
