-- ============================================================================
-- VERIFICACIÓN RÁPIDA - Una sola consulta
-- ============================================================================

-- Ver tablas y usuario en una sola query
SELECT 'TABLAS:' as tipo, tablename as nombre, 'tabla' as categoria
FROM pg_tables
WHERE schemaname = 'public'

UNION ALL

SELECT 'USUARIO:' as tipo, email as nombre,
  CASE
    WHEN EXISTS (SELECT 1 FROM auth.identities WHERE user_id = auth.users.id)
    THEN '✅ con identidad'
    ELSE '❌ sin identidad'
  END as categoria
FROM auth.users
ORDER BY tipo, nombre;
