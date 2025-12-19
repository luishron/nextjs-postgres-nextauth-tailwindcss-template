'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoneyDisplay } from '@/components/ui/money-display';
import { Trash2, Receipt, Star, ChevronRight } from 'lucide-react';
import { deleteCategory, toggleFavoriteCategory } from '../actions';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';
import type { CategoryWithStats } from '@/lib/db';

export function CategoryListItem({ category }: { category: CategoryWithStats }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const formData = new FormData();
    formData.set('id', String(category.id));
    await deleteCategory(formData);

    toast({
      title: 'Categoría eliminada',
      description: `La categoría "${category.name}" se ha eliminado exitosamente`
    });

    router.refresh();
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsTogglingFavorite(true);
    const result = await toggleFavoriteCategory(category.id);

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive'
      });
    } else {
      toast({
        title: category.is_favorite ? 'Quitado de favoritos' : 'Agregado a favoritos',
        description: `La categoría "${category.name}" ${category.is_favorite ? 'ya no es favorita' : 'ahora es favorita'}`
      });
    }

    setIsTogglingFavorite(false);
    router.refresh();
  };

  return (
    <>
      <Link href={`/dashboard/categorias/${category.id}`}>
        <div className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:bg-accent/50">
          {/* Icon */}
          <div className="relative">
            <div
              className="absolute inset-0 rounded-lg blur-sm opacity-20"
              style={{ backgroundColor: category.color }}
            />
            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-lg text-xl"
              style={{
                backgroundColor: `${category.color}20`,
                color: category.color
              }}
            >
              {category.icon || '📦'}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{category.name}</h3>
              {category.is_favorite && (
                <Star className="h-3.5 w-3.5 text-yellow-500" fill="currentColor" />
              )}
            </div>
            {category.description && (
              <p className="text-sm text-muted-foreground truncate">
                {category.description}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-6">
            {/* Expense count */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4" />
              <span className="font-medium">{category.expenseCount || 0}</span>
            </div>

            {/* Total */}
            <MoneyDisplay amount={category.total || 0} size="md" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleToggleFavorite}
              disabled={isTogglingFavorite}
              className={
                category.is_favorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-muted-foreground hover:text-yellow-500'
              }
            >
              <Star
                className="h-4 w-4"
                fill={category.is_favorite ? 'currentColor' : 'none'}
              />
            </Button>

            {/* Delete button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDeleteClick}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {/* Chevron */}
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Eliminar categoría"
        description={`¿Estás seguro de que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </>
  );
}
