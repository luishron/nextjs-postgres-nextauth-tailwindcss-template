-- ============================================================================
-- Script COMPLETO para crear un usuario en Supabase (SIN ERRORES)
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================================================

-- IMPORTANTE: Reemplaza los valores en las variables con tus datos
-- Este script crea tanto el usuario como su identidad (crítico para el login)

DO $$
DECLARE
  new_user_id uuid;
  user_email text := 'luishron@gmail.com'; -- CAMBIA ESTO: Tu email
  user_password text := 'Anna1985**'; -- CAMBIA ESTO: Tu contraseña
BEGIN
  -- ============================================================================
  -- PASO 1: Generar un nuevo UUID para el usuario
  -- ============================================================================
  new_user_id := gen_random_uuid();

  RAISE NOTICE 'Creando usuario con email: %', user_email;
  RAISE NOTICE 'User ID generado: %', new_user_id;

  -- ============================================================================
  -- PASO 2: Crear el usuario en auth.users
  -- ============================================================================
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    recovery_sent_at,
    email_change_sent_at,
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
    new_user_id,
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    jsonb_build_object('provider', 'email', 'providers', jsonb_build_array('email')),
    '{}'::jsonb,
    FALSE,
    '',
    '',
    ''
  );

  RAISE NOTICE 'Usuario creado en auth.users';

  -- ============================================================================
  -- PASO 3: Crear la identidad del usuario (CRÍTICO para evitar errores)
  -- ============================================================================
  INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
  VALUES (
    new_user_id,
    new_user_id,
    new_user_id::text,
    jsonb_build_object(
      'sub', new_user_id::text,
      'email', user_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    NOW(),
    NOW(),
    NOW()
  );

  RAISE NOTICE 'Identidad creada en auth.identities';
  RAISE NOTICE '✅ Usuario creado exitosamente! Ya puedes hacer login.';

EXCEPTION
  WHEN unique_violation THEN
    RAISE EXCEPTION 'El email % ya existe en el sistema', user_email;
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error al crear usuario: %', SQLERRM;
END $$;

-- ============================================================================
-- PASO 4: Verificar que el usuario fue creado correctamente
-- ============================================================================
SELECT
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  i.provider as identity_provider,
  i.created_at as identity_created_at,
  '✅ OK - Listo para login' as status
FROM auth.users u
INNER JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'tu-email@ejemplo.com' -- CAMBIA ESTO: Tu email
ORDER BY u.created_at DESC;

-- ============================================================================
-- NOTAS IMPORTANTES:
-- ============================================================================
-- 1. Este script crea TANTO el usuario COMO su identidad (ambos son necesarios)
-- 2. El usuario se crea con el email ya confirmado
-- 3. La contraseña se encripta automáticamente con bcrypt
-- 4. Si obtienes "duplicate key", el email ya existe
-- 5. Después de ejecutar esto, puedes hacer login normalmente desde tu app
-- 6. Para insertar categorías iniciales, ejecuta: insert-categories.sql
-- ============================================================================
