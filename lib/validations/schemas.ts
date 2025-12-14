/**
 * Schemas de validación centralizados con Zod
 */

import { z } from 'zod';
import { PAYMENT_STATUS, RECURRENCE_FREQUENCY } from '@/lib/constants/enums';

// ==================== Schemas de Gastos ====================

export const expenseSchema = z.object({
  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .max(255, 'La descripción no puede exceder 255 caracteres'),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), 'El monto debe ser un número válido')
    .refine((val) => parseFloat(val) > 0, 'El monto debe ser mayor a 0')
    .refine(
      (val) => parseFloat(val) <= 999999999.99,
      'El monto es demasiado grande'
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .refine((val) => !isNaN(Date.parse(val)), 'La fecha no es válida'),
  categoryId: z
    .string()
    .regex(/^\d+$/, 'El ID de categoría debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'La categoría es requerida'),
  paymentMethodId: z
    .string()
    .regex(/^\d+$/, 'El ID de método de pago debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'El método de pago es requerido'),
  paymentStatus: z
    .string()
    .refine(
      (val) =>
        Object.values(PAYMENT_STATUS).includes(
          val as (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]
        ),
      'Estado de pago inválido'
    ),
  isRecurring: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  recurrenceFrequency: z
    .string()
    .refine(
      (val) =>
        !val ||
        Object.values(RECURRENCE_FREQUENCY).includes(
          val as (typeof RECURRENCE_FREQUENCY)[keyof typeof RECURRENCE_FREQUENCY]
        ),
      'Frecuencia de recurrencia inválida'
    )
    .optional(),
  notes: z.string().max(500, 'Las notas no pueden exceder 500 caracteres').optional()
});

export const updateExpenseSchema = expenseSchema.extend({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

// ==================== Schemas de Ingresos ====================

export const incomeSchema = z.object({
  source: z
    .string()
    .min(1, 'La fuente es requerida')
    .max(255, 'La fuente no puede exceder 255 caracteres'),
  amount: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), 'El monto debe ser un número válido')
    .refine((val) => parseFloat(val) > 0, 'El monto debe ser mayor a 0')
    .refine(
      (val) => parseFloat(val) <= 999999999.99,
      'El monto es demasiado grande'
    ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe estar en formato YYYY-MM-DD')
    .refine((val) => !isNaN(Date.parse(val)), 'La fecha no es válida'),
  categoryId: z
    .string()
    .regex(/^\d+$/, 'El ID de categoría debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'La categoría es requerida'),
  isRecurring: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean()),
  recurrenceFrequency: z
    .string()
    .refine(
      (val) =>
        !val ||
        Object.values(RECURRENCE_FREQUENCY).includes(
          val as (typeof RECURRENCE_FREQUENCY)[keyof typeof RECURRENCE_FREQUENCY]
        ),
      'Frecuencia de recurrencia inválida'
    )
    .optional(),
  description: z
    .string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
});

export const updateIncomeSchema = incomeSchema.extend({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

export const deleteIncomeSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

// ==================== Schemas de Categorías ====================

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido'),
  icon: z.string().max(10, 'El ícono no puede exceder 10 caracteres').optional(),
  description: z
    .string()
    .max(255, 'La descripción no puede exceder 255 caracteres')
    .optional()
});

export const updateCategorySchema = categorySchema.extend({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

export const deleteCategorySchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

// ==================== Schemas de Métodos de Pago ====================

export const paymentMethodSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  type: z.string().min(1, 'El tipo es requerido'),
  bank: z.string().max(100, 'El banco no puede exceder 100 caracteres').optional(),
  lastFourDigits: z
    .string()
    .regex(/^\d{4}$/, 'Deben ser exactamente 4 dígitos')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'El color debe ser un código hexadecimal válido'),
  isDefault: z
    .string()
    .transform((val) => val === 'true')
    .pipe(z.boolean())
});

export const updatePaymentMethodSchema = paymentMethodSchema.extend({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

export const deletePaymentMethodSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'El ID debe ser un número')
    .transform(Number)
    .refine((val) => val > 0, 'ID inválido')
});

// ==================== Helper para validar FormData ====================

export function validateFormData<T>(
  schema: z.ZodType<T, any, any>,
  formData: FormData
): { success: true; data: T } | { success: false; error: string } {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const result = schema.safeParse(rawData);

    if (!result.success) {
      const firstError = result.error.errors[0];
      return {
        success: false,
        error: firstError.message
      };
    }

    return {
      success: true,
      data: result.data
    };
  } catch (error) {
    return {
      success: false,
      error: 'Error al procesar los datos del formulario'
    };
  }
}
