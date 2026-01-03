import { getDailyExpenseFrequency } from '@/lib/db';
import type { CurrencyCode } from '@/lib/config/currencies';
import { ExpenseHeatmapClient } from './expense-heatmap-client';

interface ExpenseHeatmapProps {
  userId: string;
  currency: CurrencyCode;
}

export async function ExpenseHeatmap({
  userId,
  currency,
}: ExpenseHeatmapProps) {
  // Always fetch last year of data (365 days)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const data = await getDailyExpenseFrequency(
    userId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );

  return <ExpenseHeatmapClient data={data} currency={currency} />;
}
