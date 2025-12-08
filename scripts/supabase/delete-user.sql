-- ============================================================================
-- Eliminar usuario completamente de Supabase
-- ============================================================================
-- Este script elimina el usuario y todos sus datos relacionados

DO $$
DECLARE
  user_email_to_delete text := 'luishron@gmail.com';
  user_id_found uuid;
BEGIN
  -- Buscar el user_id
  SELECT id INTO user_id_found
  FROM auth.users
  WHERE email = user_email_to_delete;

  IF user_id_found IS NULL THEN
    RAISE NOTICE 'Usuario % no encontrado', user_email_to_delete;
  ELSE
    RAISE NOTICE '🗑️  Eliminando datos del usuario: % (ID: %)', user_email_to_delete, user_id_found;

    -- Eliminar datos de las tablas de la aplicación
    DELETE FROM categories WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Categorías eliminadas';

    DELETE FROM expenses WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Gastos eliminados';

    DELETE FROM budgets WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Presupuestos eliminados';

    DELETE FROM incomes WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Ingresos eliminados';

    DELETE FROM income_categories WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Categorías de ingresos eliminadas';

    DELETE FROM payment_methods WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Métodos de pago eliminados';

    DELETE FROM statistics WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Estadísticas eliminadas';

    -- Eliminar identidad en auth.identities
    DELETE FROM auth.identities WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Identidad eliminada';

    -- Eliminar sesiones
    DELETE FROM auth.sessions WHERE user_id = user_id_found;
    RAISE NOTICE '✅ Sesiones eliminadas';

    -- Eliminar refresh tokens (convertir UUID a texto)
    DELETE FROM auth.refresh_tokens WHERE user_id = user_id_found::text;
    RAISE NOTICE '✅ Tokens eliminados';

    -- Finalmente eliminar el usuario
    DELETE FROM auth.users WHERE id = user_id_found;
    RAISE NOTICE '✅ Usuario eliminado';

    RAISE NOTICE '====================================';
    RAISE NOTICE '✅ Usuario % eliminado completamente', user_email_to_delete;
    RAISE NOTICE '====================================';
  END IF;
END $$;

-- Verificar que se eliminó
SELECT '=== VERIFICACIÓN ===' as info;
SELECT COUNT(*) as usuarios_restantes
FROM auth.users
WHERE email = 'luishron@gmail.com';
