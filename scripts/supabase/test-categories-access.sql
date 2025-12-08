-- ============================================================================
-- Probar acceso a la tabla categories
-- ============================================================================

-- 1. Ver si hay categorías (sin RLS)
SELECT 'Total de categorías en la DB:' as info, COUNT(*) as total
FROM categories;

-- 2. Ver categorías del usuario específico
SELECT 'Categorías de luishron@gmail.com:' as info;
SELECT *
FROM categories
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'luishron@gmail.com');

-- 3. Ver políticas RLS de categories
SELECT 'Políticas RLS en categories:' as info;
SELECT
  policyname,
  cmd,
  qual::text,
  with_check::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'categories';

-- 4. Verificar que RLS está habilitado
SELECT 'RLS habilitado:' as info, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'categories';

-- 5. Probar insertar una categoría de prueba
INSERT INTO categories (user_id, name, color, icon, description)
VALUES
  ((SELECT id FROM auth.users WHERE email = 'luishron@gmail.com'),
   'Prueba',
   '#000000',
   '🧪',
   'Categoría de prueba')
ON CONFLICT (user_id, name) DO NOTHING
RETURNING id, name;
