import 'server-only';
import { createClient } from '@/lib/supabase/server';

//==============================================================================
// TIPOS GENÉRICOS
//==============================================================================

export type DateRange = {
  firstDay: string;
  lastDay: string;
};

export type MonthlySummary = {
  total: number;
  count: number;
};

//==============================================================================
// HELPERS PARA FECHAS
//==============================================================================

/**
 * Calcula el primer y último día de un mes
 */
export function getMonthDateRange(year: number, month: number): DateRange {
  const firstDay = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const lastDay = new Date(year, month, 0).toISOString().split('T')[0];

  return { firstDay, lastDay };
}

/**
 * Obtiene el año y mes actual
 */
export function getCurrentYearMonth(): { year: number; month: number } {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
}

//==============================================================================
// QUERIES GENÉRICAS REUTILIZABLES
//==============================================================================

/**
 * Query genérica para obtener el total y conteo de registros en un rango de fechas
 * Funciona para expenses e incomes
 */
export async function getMonthlySummaryGeneric(
  tableName: 'expenses' | 'incomes',
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummary> {
  const supabase = await createClient();
  const { firstDay, lastDay } = getMonthDateRange(year, month);

  const { data, error } = await supabase
    .from(tableName)
    .select('amount')
    .eq('user_id', userId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;

  const total = (data || []).reduce((sum, record) => {
    return sum + parseFloat(record.amount);
  }, 0);

  return { total, count: data?.length || 0 };
}

/**
 * Calcula estadísticas de un mes usando reduce
 */
export type ExpenseStats = {
  totalSpent: number;
  expenseCount: number;
  paidTotal: number;
  pendingTotal: number;
  overdueTotal: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
};

export function calculateExpenseStats(
  expenses: Array<{ amount: string; payment_status?: string; date: string }>,
  today: string
): ExpenseStats {
  return expenses.reduce(
    (acc, expense) => {
      const amount = parseFloat(expense.amount);
      acc.totalSpent += amount;
      acc.expenseCount++;

      const isOverdue = expense.date < today && expense.payment_status !== 'pagado';

      if (expense.payment_status === 'pagado') {
        acc.paidTotal += amount;
        acc.paidCount++;
      } else if (isOverdue) {
        acc.overdueTotal += amount;
        acc.overdueCount++;
      } else {
        acc.pendingTotal += amount;
        acc.pendingCount++;
      }

      return acc;
    },
    {
      totalSpent: 0,
      expenseCount: 0,
      paidTotal: 0,
      pendingTotal: 0,
      overdueTotal: 0,
      paidCount: 0,
      pendingCount: 0,
      overdueCount: 0
    }
  );
}

