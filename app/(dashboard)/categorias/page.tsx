import { Button } from '@/components/ui/button';
import { getCategoriesByUser, getCategoryTotalExpenses } from '@/lib/db';
import { getUser } from '@/lib/auth';
import { AddCategoryDialog } from './add-category-dialog';
import { CategoryCard } from './category-card';

export const dynamic = 'force-dynamic';

export default async function CategoriasPage() {
  const user = await getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const categories = await getCategoriesByUser(user.id);

  // Obtener el total de gastos para cada categoría
  const categoriesWithTotals = await Promise.all(
    categories.map(async (category) => {
      const total = await getCategoryTotalExpenses(user.id, category.id);
      return { ...category, total };
    })
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categorías</h1>
        <AddCategoryDialog />
      </div>

      {categoriesWithTotals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">
              No hay categorías
            </h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              Crea tu primera categoría para comenzar a organizar tus gastos.
            </p>
            <AddCategoryDialog />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoriesWithTotals.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
