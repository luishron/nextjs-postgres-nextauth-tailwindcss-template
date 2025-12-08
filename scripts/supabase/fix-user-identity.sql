-- ============================================================================
-- Script para ARREGLAR usuarios creados sin identidad
-- Ejecuta esto si ya creaste el usuario pero obtienes "Database error querying schema"
-- ============================================================================

-- IMPORTANTE: Este script arregla el error "Database error querying schema"
-- que ocurre cuando falta la entrada en auth.identities

-- ============================================================================
-- PASO 1: Ver los usuarios que no tienen identidad
-- ============================================================================
SELECT
  u.id as user_id,
  u.email,
  u.created_at,
  CASE
    WHEN i.id IS NULL THEN 'SIN IDENTIDAD (PROBLEMA)'
    ELSE 'CON IDENTIDAD (OK)'
  END as status
FROM auth.users u
LEFT JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC;

-- ============================================================================
-- PASO 2: Crear identidades para usuarios que no la tienen
-- ============================================================================
DO $$
DECLARE
  user_record RECORD;
  identities_created INTEGER := 0;
BEGIN
  -- Recorrer usuarios sin identidad
  FOR user_record IN
    SELECT u.id, u.email
    FROM auth.users u
    LEFT JOIN auth.identities i ON u.id = i.user_id
    WHERE i.id IS NULL
  LOOP
    -- Crear la identidad faltante
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
      user_record.id,
      user_record.id,
      user_record.id::text,
      jsonb_build_object(
        'sub', user_record.id::text,
        'email', user_record.email,
        'email_verified', true,
        'phone_verified', false
      ),
      'email',
      NOW(),
      NOW(),
      NOW()
    );

    identities_created := identities_created + 1;
    RAISE NOTICE 'Identidad creada para: % (ID: %)', user_record.email, user_record.id;
  END LOOP;

  IF identities_created = 0 THEN
    RAISE NOTICE 'No se encontraron usuarios sin identidad. Todo está OK!';
  ELSE
    RAISE NOTICE 'Total de identidades creadas: %', identities_created;
  END IF;
END $$;

-- ============================================================================
-- PASO 3: Verificar que todo esté correcto ahora
-- ============================================================================
SELECT
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  i.provider as identity_provider,
  i.created_at as identity_created_at,
  'OK - Puede hacer login' as status
FROM auth.users u
INNER JOIN auth.identities i ON u.id = i.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- 1. Este script busca usuarios en auth.users que NO tienen entrada en auth.identities
-- 2. Crea automáticamente las identidades faltantes
-- 3. Después de ejecutar esto, podrás hacer login sin problemas
-- 4. Es seguro ejecutar este script múltiples veces (no crea duplicados)
-- ============================================================================
