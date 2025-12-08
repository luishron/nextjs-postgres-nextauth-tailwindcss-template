-- ============================================================================
-- Script de inicialización para la base de datos de Gastos
-- Ejecuta este SQL en el SQL Editor de Supabase
-- ============================================================================

-- 1. Crear las tablas si no existen
-- ============================================================================

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Tabla de gastos
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  payment_method TEXT DEFAULT 'efectivo',
  notes TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurrence_frequency TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de presupuestos
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category_id, month, year)
);

-- Tabla de ingresos
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  source TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Crear índices para mejor rendimiento
-- ============================================================================

CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON expenses(user_id);
CREATE INDEX IF NOT EXISTS expenses_date_idx ON expenses(date);
CREATE INDEX IF NOT EXISTS expenses_category_id_idx ON expenses(category_id);
CREATE INDEX IF NOT EXISTS categories_user_id_idx ON categories(user_id);
CREATE INDEX IF NOT EXISTS budgets_user_id_idx ON budgets(user_id);
CREATE INDEX IF NOT EXISTS incomes_user_id_idx ON incomes(user_id);

-- 3. DESHABILITAR RLS temporalmente para desarrollo
-- ============================================================================
-- IMPORTANTE: Esto es SOLO para desarrollo/testing
-- En producción deberías habilitar RLS y crear las políticas correctas

ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE expenses DISABLE ROW LEVEL SECURITY;
ALTER TABLE budgets DISABLE ROW LEVEL SECURITY;
ALTER TABLE incomes DISABLE ROW LEVEL SECURITY;

-- 4. Insertar categorías de ejemplo
-- ============================================================================
-- Reemplaza 'a94bc55f-6367-44b9-86a8-9517b2a94bcc' con tu ADMIN_USER_ID

INSERT INTO categories (user_id, name, color, icon, description)
VALUES
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Servicios', '#3B82F6', '⚡', 'Luz, agua, internet, teléfono'),
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Alimentos', '#10B981', '🍔', 'Supermercado, restaurantes'),
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Transporte', '#F59E0B', '🚗', 'Gasolina, Uber, transporte público'),
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Entretenimiento', '#8B5CF6', '🎮', 'Streaming, juegos, salidas'),
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Salud', '#EF4444', '❤️', 'Medicinas, doctor, gym'),
  ('a94bc55f-6367-44b9-86a8-9517b2a94bcc', 'Otros', '#6B7280', '📦', 'Gastos varios')
ON CONFLICT (user_id, name) DO NOTHING;

-- 5. Verificar que todo se creó correctamente
-- ============================================================================

SELECT 'Categorías creadas:' as info, COUNT(*) as total FROM categories;
SELECT 'Tablas creadas correctamente' as status;
