-- ============================================================================
-- Script para insertar categorías de ejemplo
-- ============================================================================
-- IMPORTANTE: Reemplaza 'TU-USER-ID-AQUI' con tu user_id real
-- Obtén tu user_id ejecutando primero get-user-id.sql
-- ============================================================================

INSERT INTO categories (user_id, name, color, icon, description)
VALUES
  ('TU-USER-ID-AQUI', 'Alimentos', '#10B981', '🍔', 'Supermercado, restaurantes'),
  ('TU-USER-ID-AQUI', 'Transporte', '#F59E0B', '🚗', 'Gasolina, Uber, transporte público'),
  ('TU-USER-ID-AQUI', 'Servicios', '#3B82F6', '⚡', 'Luz, agua, internet, teléfono'),
  ('TU-USER-ID-AQUI', 'Entretenimiento', '#8B5CF6', '🎮', 'Streaming, juegos, salidas'),
  ('TU-USER-ID-AQUI', 'Salud', '#EF4444', '❤️', 'Medicinas, doctor, gym'),
  ('TU-USER-ID-AQUI', 'Educación', '#6366F1', '📚', 'Cursos, libros, materiales'),
  ('TU-USER-ID-AQUI', 'Hogar', '#EC4899', '🏠', 'Renta, mantenimiento, decoración'),
  ('TU-USER-ID-AQUI', 'Otros', '#6B7280', '📦', 'Gastos varios')
ON CONFLICT (user_id, name) DO NOTHING;

-- Verificar categorías creadas
SELECT
  id,
  name,
  color,
  icon,
  description
FROM categories
ORDER BY id;
