'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { deleteCategory } from '../actions';
import { useRouter } from 'next/navigation';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
  total?: number;
};

export function CategoryCard({ category }: { category: Category }) {
  const router = useRouter();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  };

  const handleDeleteClick = () => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-2xl text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.icon || '📦'}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteClick}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle>{category.name}</CardTitle>
        {category.description && (
          <CardDescription>{category.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total gastado:</span>
          <span className="text-lg font-bold">
            {formatCurrency(category.total || 0)}
          </span>
        </div>
      </CardContent>

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
    </Card>
  );
}
