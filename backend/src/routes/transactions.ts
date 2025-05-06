import { Router, Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const expenses = await prisma.expense.findMany();
    const incomes = await prisma.income.findMany();

    res.status(200).json({ expenses, incomes });
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { mode, amount, name, category, date, payment } = req.body;

  if (!mode || !amount || !name || !category || !date) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  try {
    if (mode === 'expense') {
      const newExpense = await prisma.expense.create({
        data: {
          name,
          amount: parseFloat(amount),
          category,
          date: new Date(date),
          mode: payment ?? 'N/A',
        },
      });

      res.status(201).json(newExpense);
      return;
    }

    if (mode === 'income') {
      const newIncome = await prisma.income.create({
        data: {
          name,
          amount: parseFloat(amount),
          category,
          date: new Date(date),
        },
      });

      res.status(201).json(newIncome);
      return;
    }

    res.status(400).json({ error: 'Invalid mode value' });
    return;
  } catch (err) {
    console.error('[CREATE TRANSACTION ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// This must come FIRST
router.get('/months', async (req: Request, res: Response) => {
  try {
    const expenseMonths = await prisma.expense.findMany({
      select: { date: true },
    });

    const incomeMonths = await prisma.income.findMany({
      select: { date: true },
    });

    const allDates = [...expenseMonths, ...incomeMonths].map((entry) => {
      const date = new Date(entry.date);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    });

    // Remove duplicates, only if truly present
    const unique = Array.from(new Set(allDates));

    res.json({ months: unique.sort().reverse() });
  } catch (err) {
    console.error("Error in /months route:", err);
    res.status(500).json({ error: 'Failed to retrieve available months' });
  }
});

router.get('/payment-modes', async (req: Request, res: Response) => {
  const payments = await prisma.expense.findMany({
    select: { mode: true },
    distinct: ['mode']
  });

  const uniqueModes = [...new Set(payments.map(p => p.mode).filter(Boolean))];
  res.json({ modes: uniqueModes });
});

// This must come AFTER
router.get('/:month', async (req: Request, res: Response): Promise<void> => {
  const { month } = req.params;

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    res.status(400).json({ error: 'Invalid month format (expected YYYY-MM)' });
    return;
  }

  try {
    const [year, monthNum] = month.split('-');
    const startDate = new Date(Number(year), Number(monthNum) - 1, 1);
    const endDate = new Date(Number(year), Number(monthNum), 1);

    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const incomes = await prisma.income.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    res.status(200).json({ expenses, incomes });
  } catch (error) {
    console.error("Error fetching transactions by month:", error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
});

export default router;
