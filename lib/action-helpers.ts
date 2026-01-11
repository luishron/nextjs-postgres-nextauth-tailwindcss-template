import 'server-only';
import { getUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { PAYMENT_METHOD_TYPE, type PaymentMethodType } from '@/lib/constants/enums';

//==============================================================================
// TIPOS
//==============================================================================

export type ActionResult<T = void> =
  | { success: true; data?: T; error?: never }
  | { success?: false; error: string; data?: never };

export type ActionHandler<T = void> = () => Promise<T>;

//==============================================================================
// HELPERS DE VALIDACIÓN
//==============================================================================

/**
 * Valida que el usuario esté autenticado
 * @returns User ID si está autenticado, null si no
 */
export async function requireAuth(): Promise<string | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }
  return user.id;
}

/**
 * Wrapper para server actions que requieren autenticación
 * Maneja automáticamente:
 * - Validación de autenticación
 * - Manejo de errores
 * - Mensajes de error consistentes
 */
export async function withAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<ActionResult<T>> {
  try {
    const userId = await requireAuth();

    if (!userId) {
      return { error: 'No estás autenticado' };
    }

    const data = await handler(userId);
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    console.error('[Action Error] Full error:', error);
    console.error('[Action Error] Message:', message);

    // Detectar errores de BD comunes
    if (message.includes('constraint') || message.includes('foreign key')) {
      return { error: 'Datos inválidos. Verifica los campos requeridos.' };
    }

    return { error: 'Ocurrió un error. Intenta nuevamente.' };
  }
}

//==============================================================================
// HELPERS DE REVALIDACIÓN
//==============================================================================

/**
 * Rutas que necesitan revalidación después de cambios
 */
const REVALIDATE_PATHS = {
  dashboard: '/dashboard',
  gastos: '/dashboard/gastos',
  categorias: '/dashboard/categorias',
  metodosPago: '/dashboard/metodos-pago',
  ingresos: '/dashboard/ingresos',
} as const;

/**
 * Revalida rutas del dashboard de gastos
 */
export function revalidateGastos(): void {
  revalidatePath(REVALIDATE_PATHS.gastos);
  revalidatePath(REVALIDATE_PATHS.dashboard);
}

/**
 * Revalida rutas del dashboard de categorías
 */
export function revalidateCategorias(): void {
  revalidatePath(REVALIDATE_PATHS.categorias);
  revalidatePath(REVALIDATE_PATHS.dashboard);
}

/**
 * Revalida rutas del dashboard de métodos de pago
 */
export function revalidateMetodosPago(): void {
  revalidatePath(REVALIDATE_PATHS.metodosPago);
  revalidatePath(REVALIDATE_PATHS.dashboard);
}

/**
 * Revalida rutas del dashboard de ingresos
 */
export function revalidateIngresos(): void {
  revalidatePath(REVALIDATE_PATHS.ingresos);
  revalidatePath(REVALIDATE_PATHS.dashboard);
}

/**
 * Revalida todo el dashboard
 */
export function revalidateDashboard(): void {
  Object.values(REVALIDATE_PATHS).forEach((path) => revalidatePath(path));
}

//==============================================================================
// HELPERS DE VALIDACIÓN DE DATOS
//==============================================================================

// Re-export PaymentMethodType for backwards compatibility
export type { PaymentMethodType };

/**
 * Valida que un tipo de método de pago sea válido
 */
export function isValidPaymentMethodType(type: string): type is PaymentMethodType {
  return Object.values(PAYMENT_METHOD_TYPE).includes(type as PaymentMethodType);
}
