-- ============================================================================
-- Script para crear un usuario en Supabase
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================================================

-- IMPORTANTE: Reemplaza los valores entre comillas simples con tus datos
-- Email: El correo electrónico del usuario
-- Password: La contraseña (mínimo 6 caracteres recomendado)

-- ============================================================================
-- OPCIÓN 1: Crear usuario con email y password
-- ============================================================================
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  email_change_token_new,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'luishron@gmail.com', -- CAMBIA ESTO: Tu email
  crypt('Anna1985**', gen_salt('bf')), -- CAMBIA ESTO: Tu contraseña
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  FALSE,
  '',
  '',
  ''
);

-- ============================================================================
-- OPCIÓN 2: Verificar que el usuario fue creado
-- ============================================================================
-- Descomenta las siguientes líneas para ver los usuarios creados:

-- SELECT
--   id as user_id,
--   email,
--   email_confirmed_at,
--   created_at
-- FROM auth.users
-- ORDER BY created_at DESC
-- LIMIT 5;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- 1. El usuario se crea con el email ya confirmado (email_confirmed_at = NOW())
-- 2. La contraseña se encripta automáticamente con bcrypt
-- 3. Después de crear el usuario, puedes obtener su ID con get-user-id.sql
-- 4. Si obtienes un error de "duplicate key", el email ya existe en el sistema
-- ============================================================================
