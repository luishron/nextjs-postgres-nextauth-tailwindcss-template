-- ============================================================================
-- SCRIPT MAESTRO: Configuración completa de la base de datos
-- ============================================================================
-- Este script ejecuta TODAS las migraciones en el orden correcto
-- Úsalo para configurar una base de datos nueva desde cero
-- ============================================================================

\echo '════════════════════════════════════════════════════════════════════════'
\echo '    INICIANDO CONFIGURACIÓN COMPLETA DE LA BASE DE DATOS'
\echo '════════════════════════════════════════════════════════════════════════'
\echo ''

-- ============================================================================
-- PASO 1: Crear esquema inicial (tablas base)
-- ============================================================================
\echo '📦 Paso 1/4: Creando esquema inicial...'
\echo ''

\i migrations/00-initial-schema.sql

\echo ''
\echo '✅ Esquema inicial creado'
\echo ''

-- ============================================================================
-- PASO 2: Agregar estado de pago a expenses
-- ============================================================================
\echo '📦 Paso 2/4: Agregando columna de estado de pago...'
\echo ''

\i migrations/01-add-payment-status.sql

\echo ''
\echo '✅ Estado de pago agregado'
\echo ''

-- ============================================================================
-- PASO 3: Crear tabla de métodos de pago
-- ============================================================================
\echo '📦 Paso 3/4: Creando tabla de métodos de pago...'
\echo ''

\i migrations/02-payment-methods.sql

\echo ''
\echo '✅ Métodos de pago creados'
\echo ''

-- ============================================================================
-- PASO 4: Crear sistema de ingresos completo
-- ============================================================================
\echo '📦 Paso 4/4: Configurando sistema de ingresos...'
\echo ''

\i migrations/03-incomes-system.sql

\echo ''
\echo '✅ Sistema de ingresos configurado'
\echo ''

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================
\echo '════════════════════════════════════════════════════════════════════════'
\echo '    VERIFICACIÓN FINAL'
\echo '════════════════════════════════════════════════════════════════════════'

SELECT
  '✅ TABLAS CREADAS:' as info,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'categories',
    'expenses',
    'budgets',
    'incomes',
    'statistics',
    'payment_methods',
    'income_categories'
  )
ORDER BY tablename;

\echo ''
\echo '════════════════════════════════════════════════════════════════════════'
\echo '    ✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE'
\echo '════════════════════════════════════════════════════════════════════════'
\echo ''
\echo 'Próximos pasos:'
\echo '  1. Crea tu usuario con: create-user-complete.sql'
\echo '  2. Inserta categorías iniciales con: insert-categories.sql'
\echo '  3. ¡Comienza a usar la aplicación!'
\echo ''
