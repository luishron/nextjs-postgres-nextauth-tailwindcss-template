-- ============================================================================
-- Script para obtener tu user_id de Supabase
-- Ejecuta esto en el SQL Editor para ver tu ID de usuario
-- ============================================================================

SELECT
  id as user_id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
