/**
 * Helpers server-side para acceso a la moneda del usuario
 *
 * Estos helpers están diseñados para usarse en Server Components y Server Actions
 */

import 'server-only';
import { cache } from 'react';
import { getUserProfile } from '@/lib/profiles';
import { DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/config/currencies';
import { formatCurrency } from '@/lib/utils/formatting';

/**
 * Obtiene la moneda preferida del usuario (cached por request)
 *
 * Estrategia de inferencia inteligente:
 * 1. Si user.preferences.currency existe → usar esa (explícita)
 * 2. Si no, inferir de timezone → locale → moneda
 * 3. Fallback a DEFAULT_CURRENCY
 *
 * Este helper usa React cache() para asegurar que solo se ejecuta
 * una vez por request, incluso si se llama múltiples veces.
 *
 * IMPORTANTE: Nunca bloquea UX - siempre retorna una moneda válida
 *
 * @returns Código de moneda del usuario (explícito o inferido)
 *
 * @example
 * ```tsx
 * // En un Server Component
 * export default async function DashboardPage() {
 *   const currency = await getUserCurrency();
 *   return <DashboardKPIs currency={currency} />;
 * }
 * ```
 */
export const getUserCurrency = cache(async (): Promise<CurrencyCode> => {
  try {
    const profile = await getUserProfile();

    // 1. Preferencia explícita (la que el usuario configuró)
    if (profile?.preferences?.currency) {
      return profile.preferences.currency as CurrencyCode;
    }

    // 2. Inferencia inteligente: timezone → moneda
    if (profile?.timezone) {
      const { inferCurrencyFromTimezone } = await import('@/lib/config/currencies');
      return inferCurrencyFromTimezone(profile.timezone);
    }

    // 3. Fallback
    return DEFAULT_CURRENCY;
  } catch (error) {
    console.error('Error getting user currency:', error);
    return DEFAULT_CURRENCY;
  }
});

/**
 * Wrapper para formatCurrency que automáticamente usa la moneda del usuario
 *
 * Útil para formateo rápido en Server Components sin tener que
 * obtener y pasar la moneda manualmente.
 *
 * @param amount - Monto a formatear
 * @returns String formateado con la moneda del usuario
 *
 * @example
 * ```tsx
 * // En un Server Component
 * const formatted = await formatCurrencyForUser(1500.50);
 * // Resultado: "$1,500.50" (si la moneda del usuario es USD)
 * ```
 */
export async function formatCurrencyForUser(amount: string | number): Promise<string> {
  const currency = await getUserCurrency();
  return formatCurrency(amount, currency);
}
