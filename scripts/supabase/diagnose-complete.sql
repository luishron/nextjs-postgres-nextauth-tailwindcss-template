-- ============================================================================
-- DIAGNÓSTICO COMPLETO - Ver todo el estado de la base de datos
-- ============================================================================

-- 1. Ver todas las tablas que existen
SELECT '=== TABLAS EXISTENTES ===' as info;
SELECT
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname IN ('public', 'auth')
ORDER BY schemaname, tablename;

-- 2. Ver usuarios en auth.users
SELECT '=== USUARIOS EN auth.users ===' as info;
SELECT
  id,
  email,
  email_confirmed_at,
  aud,
  role,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 3. Ver identidades en auth.identities
SELECT '=== IDENTIDADES EN auth.identities ===' as info;
SELECT
  id,
  user_id,
  provider,
  provider_id,
  created_at
FROM auth.identities
ORDER BY created_at DESC;

-- 4. Ver relación usuarios-identidades
SELECT '=== RELACIÓN USUARIOS-IDENTIDADES ===' as info;
SELECT
  u.id as user_id,
  u.email,
  u.aud,
  u.role,
  i.provider,
  CASE
    WHEN i.id IS NULL THEN '❌ SIN IDENTIDAD'
    ELSE '✅ CON IDENTIDAD'
  END as status
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC;

-- 5. Ver políticas RLS en todas las tablas
SELECT '=== POLÍTICAS RLS ===' as info;
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 6. Ver si RLS está habilitado en las tablas
SELECT '=== ESTADO DE RLS POR TABLA ===' as info;
SELECT
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 7. Contar registros en tablas (si existen)
SELECT '=== CONTEO DE REGISTROS ===' as info;

DO $$
DECLARE
  table_record RECORD;
  row_count INTEGER;
BEGIN
  FOR table_record IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  LOOP
    EXECUTE format('SELECT COUNT(*) FROM %I', table_record.tablename) INTO row_count;
    RAISE NOTICE 'Tabla %: % registros', table_record.tablename, row_count;
  END LOOP;
END $$;
