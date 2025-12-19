/**
 * Funciones para límites de categorías usando Supabase client
 * Compatible con desarrollo local y producción
 */

import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type CategoryLimitMetadata = {
  limitesMensuales?: {
    limite: number;
    alertaEn?: number;
    activo?: boolean;
  };
  [key: string]: any;
};

export type CategoryBudgetStatus = {
  categoryId: number;
  categoryName: string;
  limite: number;
  gastado: number;
  disponible: number;
  porcentajeUsado: number;
  excedido: boolean;
  alertaActiva: boolean;
  mes: number;
  año: number;
};

export async function setCategoryMonthlyLimit(
  categoryId: number,
  limite: number,
  alertaEn: number = 80
): Promise<void> {
  const supabase = await createClient();

  // Obtener categoría actual
  const { data: category, error: fetchError } = await supabase
    .from('categories')
    .select('metadata')
    .eq('id', categoryId)
    .single();

  if (fetchError) throw fetchError;

  // Actualizar metadata
  const { error: updateError } = await supabase
    .from('categories')
    .update({
      metadata: {
        ...(category.metadata || {}),
        limitesMensuales: {
          limite,
          alertaEn,
          activo: true
        }
      }
    })
    .eq('id', categoryId);

  if (updateError) throw updateError;
}

export async function disableCategoryLimit(categoryId: number): Promise<void> {
  const supabase = await createClient();

  const { data: category, error: fetchError } = await supabase
    .from('categories')
    .select('metadata')
    .eq('id', categoryId)
    .single();

  if (fetchError) throw fetchError;

  const { error: updateError } = await supabase
    .from('categories')
    .update({
      metadata: {
        ...(category.metadata || {}),
        limitesMensuales: {
          ...(category.metadata?.limitesMensuales || {}),
          activo: false
        }
      }
    })
    .eq('id', categoryId);

  if (updateError) throw updateError;
}

export async function getCategoryMonthlySpending(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<number> {
  const supabase = await createClient();
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  const firstDay = new Date(targetYear, targetMonth - 1, 1)
    .toISOString()
    .split('T')[0];
  const lastDay = new Date(targetYear, targetMonth, 0).toISOString().split('T')[0];

  const { data: expenses, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('category_id', categoryId)
    .eq('user_id', userId)
    .gte('date', firstDay)
    .lte('date', lastDay);

  if (error) throw error;

  const total = (expenses || []).reduce((sum, expense) => {
    return sum + parseFloat(expense.amount);
  }, 0);

  return total;
}

export async function getCategoryBudgetStatus(
  categoryId: number,
  userId: string,
  mes?: number,
  año?: number
): Promise<CategoryBudgetStatus | null> {
  const supabase = await createClient();
  const now = new Date();
  const targetMonth = mes || now.getMonth() + 1;
  const targetYear = año || now.getFullYear();

  const { data: category, error: categoryError } = await supabase
    .from('categories')
    .select('id, name, metadata')
    .eq('id', categoryId)
    .single();

  if (categoryError || !category) {
    return null;
  }

  const metadata = category.metadata as CategoryLimitMetadata;
  const limiteConfig = metadata?.limitesMensuales;

  if (!limiteConfig || !limiteConfig.activo) {
    return null;
  }

  const limite = limiteConfig.limite;
  const alertaEn = limiteConfig.alertaEn || 80;

  const gastado = await getCategoryMonthlySpending(
    categoryId,
    userId,
    targetMonth,
    targetYear
  );

  const disponible = limite - gastado;
  const porcentajeUsado = (gastado / limite) * 100;
  const excedido = gastado > limite;
  const alertaActiva = porcentajeUsado >= alertaEn;

  return {
    categoryId: category.id,
    categoryName: category.name,
    limite,
    gastado,
    disponible,
    porcentajeUsado,
    excedido,
    alertaActiva,
    mes: targetMonth,
    año: targetYear
  };
}
