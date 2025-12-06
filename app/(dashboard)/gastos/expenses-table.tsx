'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar, Repeat } from 'lucide-react';
import type { SelectExpense, Category } from '@/lib/db';
import { deleteExpense } from '../actions';
import { useRouter } from 'next/navigation';
import { EditExpenseDialog } from './edit-expense-dialog';

interface ExpensesTableProps {
  expenses: SelectExpense[];
  totalExpenses: number;
  categories: Category[];
}

export function ExpensesTable({
  expenses,
  totalExpenses,
  categories
}: ExpensesTableProps) {
  const router = useRouter();
  const [editingExpense, setEditingExpense] = useState<SelectExpense | null>(
    null
  );
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? `${category.icon || ''} ${category.name}`.trim() : 'Sin categoría';
  };

  const formatPaymentMethod = (method: string | null | undefined) => {
    const methods: Record<string, string> = {
      efectivo: 'Efectivo',
      tarjeta_debito: 'Tarjeta de Débito',
      tarjeta_credito: 'Tarjeta de Crédito',
      transferencia: 'Transferencia'
    };
    return methods[method || 'efectivo'] || method || 'Efectivo';
  };

  const getPaymentStatusBadge = (status: string | null | undefined, expenseDate: string) => {
    // Verificar si el gasto está vencido (fecha pasada y no pagado)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expenseDateObj = new Date(expenseDate);
    expenseDateObj.setHours(0, 0, 0, 0);

    const isOverdue = expenseDateObj < today && status !== 'pagado';

    const statusConfig = {
      pagado: { label: 'Pagado', variant: 'default' as const, className: 'bg-green-500 hover:bg-green-600' },
      pendiente: { label: 'Pendiente', variant: 'secondary' as const, className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
      vencido: { label: 'Vencido', variant: 'destructive' as const, className: '' }
    };

    // Si está vencido automáticamente, mostrar como vencido
    if (isOverdue) {
      return statusConfig.vencido;
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pendiente;
    return { ...config };
  };

  const handleEdit = (expense: SelectExpense) => {
    setEditingExpense(expense);
    setEditDialogOpen(true);
  };

  const handleDelete = async (expenseId: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) {
      return;
    }

    const formData = new FormData();
    formData.set('id', String(expenseId));
    await deleteExpense(formData);
    router.refresh();
  };

  return (
    <>
      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          categories={categories}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
        />
      )}
      <Card>
      <CardHeader>
        <CardTitle>Lista de Gastos</CardTitle>
        <CardDescription>
          Administra y visualiza todos tus gastos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descripción</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="hidden lg:table-cell">
                Método de Pago
              </TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <p className="text-muted-foreground">
                    No hay gastos registrados.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.description || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(expense.category_id)}</Badge>
                  </TableCell>
                  <TableCell>
                    {expense.is_recurring === 1 ? (
                      <Badge className="gap-1">
                        <Repeat className="h-3 w-3" />
                        Recurrente
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <Calendar className="h-3 w-3" />
                        Único
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {(() => {
                      const statusBadge = getPaymentStatusBadge(expense.payment_status, expense.date);
                      return (
                        <Badge variant={statusBadge.variant} className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      );
                    })()}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {formatDate(expense.date)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {formatPaymentMethod(expense.payment_method)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(expense)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(expense.id)}
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="mt-4 text-xs text-muted-foreground">
          Mostrando {expenses.length} de {totalExpenses} gastos
        </div>
      </CardContent>
    </Card>
    </>
  );
}
