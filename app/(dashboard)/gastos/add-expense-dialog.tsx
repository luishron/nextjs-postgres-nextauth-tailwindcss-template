'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { saveExpense } from '../actions';
import { useRouter } from 'next/navigation';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
};

export function AddExpenseDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [paymentStatus, setPaymentStatus] = useState('pendiente');
  const [frequency, setFrequency] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Validar que se haya seleccionado una categoría
    if (!categoryId) {
      alert('Por favor selecciona una categoría');
      setIsSubmitting(false);
      return;
    }

    formData.set('categoryId', categoryId);
    formData.set('paymentMethod', paymentMethod);
    formData.set('paymentStatus', paymentStatus);
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await saveExpense(formData);

    if (result?.error) {
      alert(result.error);
      setIsSubmitting(false);
    } else {
      // Reset form state
      setIsRecurring(false);
      setCategoryId('');
      setPaymentMethod('efectivo');
      setPaymentStatus('pendiente');
      setFrequency('monthly');
      form.reset();

      // Close dialog and refresh
      setOpen(false);
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Agregar Gasto
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Registra un nuevo gasto único o recurrente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              placeholder="ej. Factura de luz"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" required />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                    No hay categorías. Por favor crea una primero.
                  </div>
                ) : (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.icon && `${category.icon} `}
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Método de Pago</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger id="paymentMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="efectivo">Efectivo</SelectItem>
                <SelectItem value="tarjeta_debito">
                  Tarjeta de Débito
                </SelectItem>
                <SelectItem value="tarjeta_credito">
                  Tarjeta de Crédito
                </SelectItem>
                <SelectItem value="transferencia">Transferencia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="paymentStatus">Estado de Pago</Label>
            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
              <SelectTrigger id="paymentStatus">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="pagado">Pagado</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expenseType">Tipo de Gasto</Label>
            <Select
              value={isRecurring ? 'recurrente' : 'unico'}
              onValueChange={(value) => setIsRecurring(value === 'recurrente')}
            >
              <SelectTrigger id="expenseType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unico">Único</SelectItem>
                <SelectItem value="recurrente">Recurrente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isRecurring && (
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frecuencia</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Agrega notas adicionales..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Gasto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
