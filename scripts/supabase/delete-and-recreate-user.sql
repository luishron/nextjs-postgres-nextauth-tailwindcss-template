-- ============================================================================
-- Script para ELIMINAR y RECREAR el usuario correctamente
-- Usa esto si fix-user-identity.sql no funcionó
-- ============================================================================

-- IMPORTANTE: Este script elimina el usuario existente y lo crea correctamente
-- Solo úsalo si estás seguro de que quieres empezar de cero

-- ============================================================================
-- PASO 1: ELIMINAR el usuario existente (y su identidad si existe)
-- ============================================================================
DO $$
DECLARE
  user_email_to_delete text := 'luishron@gmail.com'; -- Tu email
  user_id_found uuid;
BEGIN
  -- Buscar el user_id
  SELECT id INTO user_id_found
  FROM auth.users
  WHERE email = user_email_to_delete;

  IF user_id_found IS NULL THEN
    RAISE NOTICE 'Usuario % no encontrado', user_email_to_delete;
  ELSE
    RAISE NOTICE 'Eliminando usuario: % (ID: %)', user_email_to_delete, user_id_found;

    -- Eliminar identidad primero (si existe)
    DELETE FROM auth.identities WHERE user_id = user_id_found;
    RAISE NOTICE 'Identidad eliminada';

    -- Eliminar usuario
    DELETE FROM auth.users WHERE id = user_id_found;
    RAISE NOTICE 'Usuario eliminado';

    RAISE NOTICE '✅ Usuario eliminado completamente';
  END IF;
END $$;

-- ============================================================================
-- PASO 2: CREAR el usuario correctamente (con identidad)
-- ============================================================================
DO $$
DECLARE
  new_user_id uuid;
  user_email text := 'luishron@gmail.com'; -- Tu email
  user_password text := 'Anna1985**'; -- Tu contraseña
BEGIN
  -- Generar nuevo UUID
  new_user_id := gen_random_uuid();

  RAISE NOTICE '====================================';
  RAISE NOTICE 'Creando usuario nuevo';
  RAISE NOTICE 'Email: %', user_email;
  RAISE NOTICE 'User ID: %', new_user_id;
  RAISE NOTICE '====================================';

  -- Crear usuario en auth.users
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

  RAISE NOTICE '✅ Usuario creado en auth.users';

  -- Crear identidad en auth.identities
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

  RAISE NOTICE '✅ Identidad creada en auth.identities';
  RAISE NOTICE '====================================';
  RAISE NOTICE '✅✅✅ USUARIO CREADO EXITOSAMENTE ✅✅✅';
  RAISE NOTICE 'Ya puedes hacer login con:';
  RAISE NOTICE 'Email: %', user_email;
  RAISE NOTICE '====================================';
END $$;

-- ============================================================================
-- PASO 3: Verificar que todo está correcto
-- ============================================================================
SELECT
  '✅ VERIFICACIÓN FINAL' as info,
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  u.aud,
  u.role,
  i.provider as identity_provider,
  i.provider_id,
  i.created_at as identity_created_at
FROM auth.users u
INNER JOIN auth.identities i ON u.id = i.user_id
WHERE u.email = 'luishron@gmail.com'
ORDER BY u.created_at DESC;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- 1. Este script elimina completamente el usuario anterior (limpia todo)
-- 2. Crea un nuevo usuario con TODOS los campos necesarios
-- 3. Crea la identidad correctamente vinculada
-- 4. Después de esto, deberías poder hacer login sin problemas
-- ============================================================================
