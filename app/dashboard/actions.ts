'use server';

import {
  deleteExpenseById,
  deleteCategoryById,
  createExpense,
  updateExpense as updateExpenseInDb,
  createCategory,
  updateCategory as updateCategoryInDb,
  toggleCategoryFavorite,
  createPaymentMethod,
  updatePaymentMethod as updatePaymentMethodInDb,
  deletePaymentMethodById,
  createIncome,
  updateIncome as updateIncomeInDb,
  deleteIncomeById,
  createIncomeCategory,
  updateIncomeCategory as updateIncomeCategoryInDb,
  deleteIncomeCategoryById
} from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/auth';
import {
  expenseSchema,
  updateExpenseSchema,
  incomeSchema,
  updateIncomeSchema,
  deleteIncomeSchema,
  categorySchema,
  updateCategorySchema,
  deleteCategorySchema,
  paymentMethodSchema,
  updatePaymentMethodSchema,
  deletePaymentMethodSchema,
  validateFormData
} from '@/lib/validations/schemas';

export async function saveExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(expenseSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await createExpense({
      user_id: user.id,
      category_id: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date,
      payment_method: String(data.paymentMethodId),
      payment_status: data.paymentStatus as 'pagado' | 'pendiente' | 'vencido',
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: data.notes
    });

    revalidatePath('/dashboard/gastos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[saveExpense]', { error: message });

    if (message.includes('constraint') || message.includes('foreign key')) {
      return { error: 'Datos inválidos. Verifica la categoría y método de pago.' };
    }

    return { error: 'Error al guardar el gasto. Intenta nuevamente.' };
  }
}

export async function updateExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(updateExpenseSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await updateExpenseInDb(data.id, {
      category_id: data.categoryId,
      amount: data.amount,
      description: data.description,
      date: data.date,
      payment_method: String(data.paymentMethodId),
      payment_status: data.paymentStatus as 'pagado' | 'pendiente' | 'vencido',
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: data.notes
    });

    revalidatePath('/dashboard/gastos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[updateExpense]', { error: message });

    if (message.includes('constraint') || message.includes('foreign key')) {
      return { error: 'Datos inválidos. Verifica la categoría y método de pago.' };
    }

    return { error: 'Error al actualizar el gasto. Intenta nuevamente.' };
  }
}

export async function deleteExpense(formData: FormData) {
  const user = await getUser();

  if (!user) {
    return { error: 'No estás autenticado' };
  }

  const id = Number(formData.get('id'));
  await deleteExpenseById(id);
  revalidatePath('/dashboard/gastos');
  revalidatePath('/dashboard');
}

export async function markExpenseAsPaid(expenseId: number) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    await updateExpenseInDb(expenseId, {
      payment_status: 'pagado'
    });

    revalidatePath('/dashboard/gastos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al marcar gasto como pagado:', error);
    return { error: 'Error al marcar el gasto como pagado' };
  }
}

export async function deleteCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(deleteCategorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await deleteCategoryById(data.id);
    revalidatePath('/dashboard/categorias');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    return { error: 'Error al eliminar la categoría' };
  }
}

export async function updateCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(updateCategorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await updateCategoryInDb(data.id, {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidatePath('/dashboard/categorias');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return { error: 'Error al actualizar la categoría' };
  }
}

export async function toggleFavoriteCategory(categoryId: number) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    await toggleCategoryFavorite(user.id, categoryId);

    revalidatePath('/dashboard/categorias');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al cambiar estado de favorito:', error);
    return { error: 'Error al cambiar estado de favorito' };
  }
}

export async function saveCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(categorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await createCategory({
      user_id: user.id,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidatePath('/dashboard/categorias');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    return { error: 'Error al guardar la categoría' };
  }
}

export async function payRecurringExpense(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    const userId = user.id;

    const nextDate = formData.get('nextDate') as string;
    const amount = formData.get('amount') as string;
    const description = formData.get('description') as string;
    const categoryId = formData.get('categoryId') as string;
    const paymentMethodId = formData.get('paymentMethodId') as string;
    const notes = formData.get('notes') as string;

    // Crear el gasto real para esta instancia recurrente
    await createExpense({
      user_id: userId,
      category_id: parseInt(categoryId),
      amount,
      description: `${description} (${nextDate})`,
      date: nextDate,
      payment_method: paymentMethodId,
      payment_status: 'pagado',
      is_recurring: 0, // Marcar como no recurrente (es una instancia individual)
      recurrence_frequency: null,
      notes
    });

    revalidatePath('/dashboard/gastos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al pagar gasto recurrente:', error);
    return { error: 'Error al pagar el gasto recurrente' };
  }
}

export async function savePaymentMethod(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(paymentMethodSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    // Validar tipo de método de pago
    const validTypes = ['tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia', 'otro'];
    if (!validTypes.includes(data.type)) {
      return { error: 'Tipo de método de pago inválido' };
    }

    await createPaymentMethod({
      user_id: user.id,
      name: data.name,
      type: data.type as 'tarjeta_credito' | 'tarjeta_debito' | 'efectivo' | 'transferencia' | 'otro',
      bank: data.bank || null,
      last_four_digits: data.lastFourDigits || null,
      icon: null,
      color: data.color,
      is_default: data.isDefault
    });

    revalidatePath('/dashboard/metodos-pago');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar método de pago:', error);
    return { error: 'Error al guardar el método de pago' };
  }
}

export async function updatePaymentMethod(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(updatePaymentMethodSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    // Validar tipo de método de pago
    const validTypes = ['tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia', 'otro'];
    if (!validTypes.includes(data.type)) {
      return { error: 'Tipo de método de pago inválido' };
    }

    await updatePaymentMethodInDb(data.id, {
      name: data.name,
      type: data.type as 'tarjeta_credito' | 'tarjeta_debito' | 'efectivo' | 'transferencia' | 'otro',
      bank: data.bank || null,
      last_four_digits: data.lastFourDigits || null,
      icon: null,
      color: data.color,
      is_default: data.isDefault
    });

    revalidatePath('/dashboard/metodos-pago');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar método de pago:', error);
    return { error: 'Error al actualizar el método de pago' };
  }
}

export async function deletePaymentMethod(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(deletePaymentMethodSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await deletePaymentMethodById(data.id);
    revalidatePath('/dashboard/metodos-pago');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar método de pago:', error);
    return { error: 'Error al eliminar el método de pago' };
  }
}

//==============================================================================
// SERVER ACTIONS - Ingresos
//==============================================================================

export async function saveIncome(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(incomeSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await createIncome({
      user_id: user.id,
      source: data.source,
      amount: data.amount,
      date: data.date,
      description: data.description || null,
      category_id: data.categoryId,
      payment_method: null, // Los ingresos no requieren método de pago
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: null
    });

    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar ingreso:', error);
    return { error: 'Error al guardar el ingreso' };
  }
}

export async function updateIncome(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(updateIncomeSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await updateIncomeInDb(data.id, {
      source: data.source,
      amount: data.amount,
      date: data.date,
      description: data.description || null,
      category_id: data.categoryId,
      payment_method: null,
      is_recurring: data.isRecurring ? 1 : 0,
      recurrence_frequency: data.isRecurring ? data.recurrenceFrequency : null,
      notes: null
    });

    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar ingreso:', error);
    return { error: 'Error al actualizar el ingreso' };
  }
}

export async function deleteIncome(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(deleteIncomeSchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await deleteIncomeById(data.id);
    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar ingreso:', error);
    return { error: 'Error al eliminar el ingreso' };
  }
}

//==============================================================================
// SERVER ACTIONS - Categorías de Ingresos
//==============================================================================

export async function saveIncomeCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(categorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await createIncomeCategory({
      user_id: user.id,
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar categoría de ingreso:', error);
    return { error: 'Error al guardar la categoría' };
  }
}

export async function updateIncomeCategoryAction(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(updateCategorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await updateIncomeCategoryInDb(data.id, {
      name: data.name,
      color: data.color,
      icon: data.icon || null,
      description: data.description || null
    });

    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al actualizar categoría de ingreso:', error);
    return { error: 'Error al actualizar la categoría' };
  }
}

export async function deleteIncomeCategory(formData: FormData) {
  try {
    const user = await getUser();

    if (!user) {
      return { error: 'No estás autenticado' };
    }

    // Validar datos con Zod
    const validation = validateFormData(deleteCategorySchema, formData);

    if (!validation.success) {
      return { error: validation.error };
    }

    const data = validation.data;

    await deleteIncomeCategoryById(data.id);
    revalidatePath('/dashboard/ingresos');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar categoría de ingreso:', error);
    return { error: 'Error al eliminar la categoría' };
  }
}
