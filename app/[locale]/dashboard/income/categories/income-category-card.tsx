'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { deleteIncomeCategory } from '../../actions';
import { useRouter } from 'next/navigation';
import { CategoryIcon } from '@/components/ui/category-icon';

type IncomeCategory = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
};

export function IncomeCategoryCard({ category }: { category: IncomeCategory }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(category.id));
    await deleteIncomeCategory(formData);
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: category.color }}
          >
            <CategoryIcon
              icon={category.icon}
              color="white"
              size={24}
              fallback="DollarSign"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="line-clamp-1">{category.name}</CardTitle>
        {category.description && (
          <CardDescription className="line-clamp-2">{category.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Categoría de ingreso</span>
          <div
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: category.color }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
