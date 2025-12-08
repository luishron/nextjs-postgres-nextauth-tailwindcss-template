-- ============================================================================
-- MIGRACIÓN INICIAL: Crear todas las tablas base de la aplicación
-- ============================================================================
-- Este es el script que DEBE ejecutarse PRIMERO antes de cualquier otra migración
-- Crea todas las tablas principales y sus políticas RLS
-- ============================================================================

-- ============================================================================
-- 1. TABLA: categories (Categorías de gastos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6B7280',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Índices para categories
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Habilitar RLS en categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para categories
CREATE POLICY IF NOT EXISTS "Users can view their own categories"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own categories"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own categories"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own categories"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 2. TABLA: expenses (Gastos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  payment_method TEXT,
  notes TEXT,
  is_recurring INTEGER DEFAULT 0 CHECK (is_recurring IN (0, 1)),
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para expenses
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON expenses(user_id, is_recurring) WHERE is_recurring = 1;

-- Habilitar RLS en expenses
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para expenses
CREATE POLICY IF NOT EXISTS "Users can view their own expenses"
  ON expenses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own expenses"
  ON expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own expenses"
  ON expenses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own expenses"
  ON expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at en expenses
CREATE OR REPLACE FUNCTION update_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_expenses_updated_at ON expenses;
CREATE TRIGGER trigger_update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_expenses_updated_at();

-- ============================================================================
-- 3. TABLA: budgets (Presupuestos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, month, year)
);

-- Índices para budgets
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(year, month);

-- Habilitar RLS en budgets
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para budgets
CREATE POLICY IF NOT EXISTS "Users can view their own budgets"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own budgets"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own budgets"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own budgets"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 4. TABLA: incomes (Ingresos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para incomes
CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_date ON incomes(date DESC);

-- Habilitar RLS en incomes
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para incomes
CREATE POLICY IF NOT EXISTS "Users can view their own incomes"
  ON incomes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own incomes"
  ON incomes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own incomes"
  ON incomes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own incomes"
  ON incomes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. TABLA: statistics (Estadísticas mensuales)
-- ============================================================================
CREATE TABLE IF NOT EXISTS statistics (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL,
  total_expenses TEXT NOT NULL DEFAULT '0',
  total_income TEXT NOT NULL DEFAULT '0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month, year)
);

-- Índices para statistics
CREATE INDEX IF NOT EXISTS idx_statistics_user_id ON statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_month_year ON statistics(year DESC, month DESC);

-- Habilitar RLS en statistics
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para statistics
CREATE POLICY IF NOT EXISTS "Users can view their own statistics"
  ON statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own statistics"
  ON statistics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own statistics"
  ON statistics FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own statistics"
  ON statistics FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VERIFICACIÓN: Mostrar todas las tablas creadas
-- ============================================================================
SELECT
  'TABLAS CREADAS:' as info,
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('categories', 'expenses', 'budgets', 'incomes', 'statistics')
ORDER BY tablename;

-- ============================================================================
-- NOTAS:
-- ============================================================================
-- 1. Este script crea las 5 tablas principales de la aplicación
-- 2. Todas las tablas tienen RLS (Row Level Security) habilitado
-- 3. Todas las políticas aseguran que cada usuario solo vea sus propios datos
-- 4. Los índices mejoran el rendimiento de las consultas
-- 5. Después de ejecutar esto, ejecuta las migraciones 01, 02 y 03 en orden
-- ============================================================================
