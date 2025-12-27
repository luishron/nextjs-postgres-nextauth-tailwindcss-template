/**
 * Funciones de formato centralizadas para toda la aplicación
 */

import type { Category, PaymentMethod } from '@/lib/db';

/**
 * Formatea un número como moneda mexicana (USD)
 */
export function formatCurrency(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD'
  }).format(num);
}

/**
 * Formatea una fecha como texto corto en español (ej: "15 ene 2024")
 * Parsea la fecha como local sin conversión de zona horaria
 */
export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Formatea una fecha completa con día de la semana
 */
export function formatDateLong(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Obtiene el nombre de una categoría con su ícono
 */
export function getCategoryName(
  categoryId: number,
  categories: Category[]
): string {
  const category = categories.find((c) => c.id === categoryId);
  return category
    ? `${category.icon || ''} ${category.name}`.trim()
    : 'Sin categoría';
}

/**
 * Obtiene el nombre de un método de pago con formato completo
 */
export function getPaymentMethodName(
  methodId: string | null | undefined,
  paymentMethods: PaymentMethod[]
): string {
  if (!methodId) return 'No especificado';

  // Buscar el método de pago por ID
  const paymentMethod = paymentMethods.find((pm) => pm.id === parseInt(methodId));

  if (paymentMethod) {
    let displayName = paymentMethod.name;
    if (paymentMethod.bank) {
      displayName += ` (${paymentMethod.bank})`;
    }
    if (paymentMethod.last_four_digits) {
      displayName += ` ••${paymentMethod.last_four_digits}`;
    }
    return displayName;
  }

  // Fallback para gastos antiguos con valores hardcodeados
  const legacyMethods: Record<string, string> = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta de Débito',
    tarjeta_credito: 'Tarjeta de Crédito',
    transferencia: 'Transferencia'
  };
  return legacyMethods[methodId] || methodId;
}

/**
 * Calcula días entre hoy y una fecha
 * Retorna número positivo si la fecha es futura, negativo si es pasada
 */
export function getDaysUntil(dateString: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  return Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Verifica si una fecha está vencida (pasada y no pagada)
 */
export function isExpenseOverdue(
  dateString: string,
  paymentStatus: string | null | undefined
): boolean {
  if (paymentStatus === 'pagado') return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateString.split('-').map(Number);
  const expenseDate = new Date(year, month - 1, day);
  expenseDate.setHours(0, 0, 0, 0);

  return expenseDate < today;
}
