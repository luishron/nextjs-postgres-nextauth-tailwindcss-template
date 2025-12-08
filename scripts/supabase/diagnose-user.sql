-- ============================================================================
-- Script de DIAGNÓSTICO completo para usuarios
-- ============================================================================

-- PASO 1: Ver todos los usuarios
SELECT
  'USUARIOS EN auth.users' as tabla,
  id as user_id,
  email,
  email_confirmed_at,
  aud,
  role,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- PASO 2: Ver todas las identidades
SELECT
  'IDENTIDADES EN auth.identities' as tabla,
  id,
  user_id,
  provider,
  provider_id,
  identity_data,
  created_at
FROM auth.identities
ORDER BY created_at DESC;

-- PASO 3: Ver relación usuarios-identidades
SELECT
  'RELACIÓN USUARIOS-IDENTIDADES' as info,
  u.id as user_id,
  u.email,
  u.aud,
  u.role,
  i.id as identity_id,
  i.provider,
  CASE
    WHEN i.id IS NULL THEN '❌ SIN IDENTIDAD'
    ELSE '✅ CON IDENTIDAD'
  END as status
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC;

-- PASO 4: Verificar esquema de la tabla users
SELECT
  'COLUMNAS DE auth.users' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'users'
ORDER BY ordinal_position;

-- PASO 5: Verificar esquema de la tabla identities
SELECT
  'COLUMNAS DE auth.identities' as info,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'auth'
  AND table_name = 'identities'
ORDER BY ordinal_position;

-- PASO 6: Verificar raw_app_meta_data
SELECT
  'METADATA DE USUARIOS' as info,
  email,
  raw_app_meta_data,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;
