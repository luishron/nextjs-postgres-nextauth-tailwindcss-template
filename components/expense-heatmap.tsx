import { getDailyExpenseFrequency } from '@/lib/db';
import type { CurrencyCode } from '@/lib/config/currencies';
import { ExpenseHeatmapClient } from './expense-heatmap-client';

interface ExpenseHeatmapProps {
  userId: string;
  currency: CurrencyCode;
  initialView?: 'month' | 'quarter' | 'year';
}

export async function ExpenseHeatmap({
  userId,
  currency,
  initialView = 'month',
}: ExpenseHeatmapProps) {
  // Calculate date range based on initial view
  const endDate = new Date();
  const startDate = new Date();

  switch (initialView) {
    case 'month':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case 'quarter':
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }

  const data = await getDailyExpenseFrequency(
    userId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  return (
    <ExpenseHeatmapClient
      data={data}
      currency={currency}
      initialView={initialView}
    />
  );
}
