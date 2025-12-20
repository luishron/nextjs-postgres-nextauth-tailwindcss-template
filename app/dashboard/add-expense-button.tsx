'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
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
import { saveExpense } from './actions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type Category = {
  id: number;
  name: string;
  color: string;
  icon?: string | null;
};

type PaymentMethod = {
  id: number;
  name: string;
  type: string;
  bank?: string | null;
  last_four_digits?: string | null;
  is_default: boolean;
};

export function AddExpenseButton({
  categories,
  paymentMethods
}: {
  categories: Category[];
  paymentMethods: PaymentMethod[];
}) {
  const [open, setOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const defaultPaymentMethod = paymentMethods.find((pm) => pm.is_default);
  const defaultPaymentMethodId = defaultPaymentMethod
    ? String(defaultPaymentMethod.id)
    : paymentMethods.length > 0
    ? String(paymentMethods[0].id)
    : '';

  const [paymentMethodId, setPaymentMethodId] = useState(defaultPaymentMethodId);
  const [frequency, setFrequency] = useState('monthly');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const todayDate = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!categoryId) {
      toast({
        title: 'Error de validación',
        description: 'Por favor selecciona una categoría',
        variant: 'destructive'
      });
      setIsSubmitting(false);
      return;
    }

    formData.set('categoryId', categoryId);
    formData.set('paymentMethodId', paymentMethodId);
    formData.set('paymentStatus', isPaid ? 'pagado' : 'pendiente');
    formData.set('isRecurring', String(isRecurring));
    if (isRecurring) {
      formData.set('recurrenceFrequency', frequency);
    }

    const result = await saveExpense(formData);

    if (result?.error) {
      toast({
        title: 'Error al guardar',
        description: result.error,
        variant: 'destructive'
      });
      setIsSubmitting(false);
    } else {
      setIsRecurring(false);
      setCategoryId('');
      setPaymentMethodId(defaultPaymentMethodId);
      setIsPaid(false);
      setFrequency('monthly');
      setShowAdvanced(false);
      form.reset();
      setOpen(false);
      setIsSubmitting(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Agregar Gasto
      </Button>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Registra un nuevo gasto rápidamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="description">¿Qué compraste?</Label>
            <Input
              id="description"
              name="description"
              placeholder="ej. Comida del supermercado"
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">¿Cuánto costó?</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                min="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">¿Cuándo?</Label>
              <Input
                id="date"
                name="date"
                type="date"
                defaultValue={todayDate}
                required
              />
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

          <div className="flex items-center space-x-2 p-3 rounded-md border bg-muted/50">
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isPaid" className="cursor-pointer font-normal">
              Ya pagué este gasto
            </Label>
          </div>

          <div className="border-t pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              <span>Detalles adicionales</span>
              <span className="text-muted-foreground">
                {showAdvanced ? '▲' : '▼'}
              </span>
            </Button>

            {showAdvanced && (
              <div className="mt-4 space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="paymentMethod">Método de Pago</Label>
                  <Select value={paymentMethodId} onValueChange={setPaymentMethodId}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Selecciona un método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={String(method.id)}>
                          {method.name}
                          {method.bank && ` - ${method.bank}`}
                          {method.last_four_digits && ` (••${method.last_four_digits})`}
                          {method.is_default && ' ⭐'}
                        </SelectItem>
                      ))}
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
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    placeholder="Agrega notas adicionales..."
                    rows={3}
                  />
                </div>
              </div>
            )}
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
