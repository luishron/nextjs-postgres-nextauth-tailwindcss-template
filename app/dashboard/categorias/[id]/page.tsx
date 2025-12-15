import { notFound } from 'next/navigation';
import { getUser } from '@/lib/auth';
import {
  getCategoryById,
  getExpensesByCategoryId,
  getCategoryStatistics,
  getCategoryMonthlyTrend,
  getCategoriesByUser,
  getPaymentMethodsByUser
} from '@/lib/db';
import { CategoryHeader } from './category-header';
import { CategoryStatsCards } from './category-stats-cards';
import { CategoryTrendChart } from './category-trend-chart';
import { ExpensesTable } from '../../gastos/expenses-table';
import { AddExpenseDialog } from '../../gastos/add-expense-dialog';
import { EditCategoryDialog } from '../edit-category-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function CategoryDetailsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = parseInt(id);
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Fetch all data in parallel
  const [category, expenses, statistics, monthlyTrend, allCategories, paymentMethods] =
    await Promise.all([
      getCategoryById(user.id, categoryId),
      getExpensesByCategoryId(user.id, categoryId),
      getCategoryStatistics(user.id, categoryId),
      getCategoryMonthlyTrend(user.id, categoryId, 6),
      getCategoriesByUser(user.id),
      getPaymentMethodsByUser(user.id)
    ]);

  // Handle 404
  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <CategoryHeader category={category} />

      <CategoryStatsCards statistics={statistics} />

      <div className="grid gap-6 md:grid-cols-2">
        <CategoryTrendChart data={monthlyTrend} category={category} />

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {allCategories.length > 0 && paymentMethods.length > 0 && (
              <AddExpenseDialog
                categories={allCategories}
                paymentMethods={paymentMethods}
                defaultCategoryId={categoryId}
                lockCategory={true}
              />
            )}
            <EditCategoryDialog category={category} />
          </CardContent>
        </Card>
      </div>

      {expenses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              No hay gastos en esta categoría
            </p>
            {allCategories.length > 0 && paymentMethods.length > 0 && (
              <AddExpenseDialog
                categories={allCategories}
                paymentMethods={paymentMethods}
                defaultCategoryId={categoryId}
                lockCategory={true}
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <ExpensesTable
          expenses={expenses}
          totalExpenses={expenses.length}
          categories={allCategories}
          paymentMethods={paymentMethods}
        />
      )}
    </div>
  );
}
