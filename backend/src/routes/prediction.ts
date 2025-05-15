// import { Router, Request, Response } from 'express';
// import { PrismaClient } from '../../generated/prisma';
// import { predictNextMonth } from '../utils/predictSpending';
//
// const prisma = new PrismaClient();
// const router = Router();
//
// let cachedPrediction: any = null;
// let lastRun = 0;
// const CACHE_TTL = 12 * 60 * 60 * 1000; // 12 hours
//
// router.get('/', async (req: Request, res: Response) :Promise<any> => {
//   const now = Date.now();
//
//   if (cachedPrediction && now - lastRun < CACHE_TTL) {
//     return res.json({ ...cachedPrediction, cached: true });
//   }
//
//   try {
//     const result = await prisma.$queryRaw<
//       { month: string; total: number }[]
//     >`
//       SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS total
//       FROM Expense
//       GROUP BY month
//       ORDER BY month ASC
//     `;
//
//     const totals = result.map(row => row.total);
//     if (totals.length < 2) {
//       return res.status(400).json({ error: 'Not enough data for prediction.' });
//     }
//
//     // ML prediction
//     const lastMonthTotal = totals[totals.length - 1];
//     const predictedTotal = await predictNextMonth(totals);
//     const percentageChange = ((predictedTotal - lastMonthTotal) / lastMonthTotal) * 100;
//
//     // Pacing estimate for current month
//     const nowDate = new Date();
//     const startOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
//     const endOfMonth = new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 0);
//
//     const currentMonthTotal = await prisma.expense.aggregate({
//       _sum: { amount: true },
//       where: {
//         date: {
//           gte: startOfMonth,
//           lte: nowDate,
//         },
//       },
//     });
//
//     const daysPassed = nowDate.getDate();
//     const daysInMonth = endOfMonth.getDate();
//
//     const pacingTotal =
//       daysPassed > 0
//         ? ((currentMonthTotal._sum.amount ?? 0) / daysPassed) * daysInMonth
//         : 0;
//
//     const response = {
//       predictedTotal: parseFloat(predictedTotal.toFixed(2)),
//       lastMonthTotal: parseFloat(lastMonthTotal.toFixed(2)),
//       percentageChange: parseFloat(percentageChange.toFixed(1)),
//       pacingEstimate: parseFloat(pacingTotal.toFixed(2)),
//     };
//
//     cachedPrediction = response;
//     lastRun = now;
//
//     res.json({ ...response, cached: false });
//   } catch (error) {
//     console.error('[Prediction Error]', error);
//     res.status(500).json({ error: 'Prediction failed.' });
//   }
// });
//
// export default router;

import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({ message: '✅ Prediction route is working!' });
});

export default router;

