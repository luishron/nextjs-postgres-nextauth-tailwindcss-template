-- ============================================================================
-- CONFIGURACIÓN COMPLETA - TODO EN UNO (Compatible con todas las versiones)
-- ============================================================================
-- Copia y pega TODO este archivo en el SQL Editor de Supabase
-- Esto creará todas las tablas y configuraciones necesarias
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. CREAR TABLAS BASE
-- ============================================================================

-- Tabla: categories
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

CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Drop políticas existentes y crear nuevas
DROP POLICY IF EXISTS "Users can view their own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert their own categories" ON categories;
DROP POLICY IF EXISTS "Users can update their own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete their own categories" ON categories;

CREATE POLICY "Users can view their own categories"
  ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own categories"
  ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own categories"
  ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own categories"
  ON categories FOR DELETE USING (auth.uid() = user_id);

-- Tabla: expenses
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pendiente' CHECK (payment_status IN ('pagado', 'pendiente', 'vencido')),
  notes TEXT,
  is_recurring INTEGER DEFAULT 0 CHECK (is_recurring IN (0, 1)),
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'yearly')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_payment_status ON expenses(payment_status);
CREATE INDEX IF NOT EXISTS idx_expenses_recurring ON expenses(user_id, is_recurring) WHERE is_recurring = 1;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can insert their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can update their own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can delete their own expenses" ON expenses;

CREATE POLICY "Users can view their own expenses"
  ON expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses"
  ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own expenses"
  ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own expenses"
  ON expenses FOR DELETE USING (auth.uid() = user_id);

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

-- Tabla: budgets
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

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_budgets_month_year ON budgets(year, month);
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can insert their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON budgets;

CREATE POLICY "Users can view their own budgets"
  ON budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own budgets"
  ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own budgets"
  ON budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own budgets"
  ON budgets FOR DELETE USING (auth.uid() = user_id);

-- Tabla: incomes
CREATE TABLE IF NOT EXISTS incomes (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  source TEXT NOT NULL,
  amount TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  payment_method TEXT,
  is_recurring INTEGER DEFAULT 0 CHECK (is_recurring IN (0, 1)),
  recurrence_frequency TEXT CHECK (recurrence_frequency IN ('weekly', 'monthly', 'yearly')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incomes_user_id ON incomes(user_id);
CREATE INDEX IF NOT EXISTS idx_incomes_date ON incomes(date DESC);
CREATE INDEX IF NOT EXISTS idx_incomes_recurring ON incomes(user_id, is_recurring) WHERE is_recurring = 1;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can insert their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can update their own incomes" ON incomes;
DROP POLICY IF EXISTS "Users can delete their own incomes" ON incomes;

CREATE POLICY "Users can view their own incomes"
  ON incomes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own incomes"
  ON incomes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own incomes"
  ON incomes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own incomes"
  ON incomes FOR DELETE USING (auth.uid() = user_id);

-- Trigger para updated_at en incomes
CREATE OR REPLACE FUNCTION update_incomes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_incomes_updated_at ON incomes;
CREATE TRIGGER trigger_update_incomes_updated_at
  BEFORE UPDATE ON incomes
  FOR EACH ROW
  EXECUTE FUNCTION update_incomes_updated_at();

-- Tabla: income_categories
CREATE TABLE IF NOT EXISTS income_categories (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#10B981',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_income_categories_user_id ON income_categories(user_id);
ALTER TABLE income_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own income categories" ON income_categories;
DROP POLICY IF EXISTS "Users can insert their own income categories" ON income_categories;
DROP POLICY IF EXISTS "Users can update their own income categories" ON income_categories;
DROP POLICY IF EXISTS "Users can delete their own income categories" ON income_categories;

CREATE POLICY "Users can view their own income categories"
  ON income_categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own income categories"
  ON income_categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own income categories"
  ON income_categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own income categories"
  ON income_categories FOR DELETE USING (auth.uid() = user_id);

-- Agregar foreign key a incomes después de crear income_categories
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints
             WHERE constraint_name = 'incomes_category_id_fkey') THEN
    ALTER TABLE incomes DROP CONSTRAINT incomes_category_id_fkey;
  END IF;

  ALTER TABLE incomes
    ADD CONSTRAINT incomes_category_id_fkey
      FOREIGN KEY (category_id)
      REFERENCES income_categories(id)
      ON DELETE SET NULL;
END $$;

-- Tabla: payment_methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('tarjeta_credito', 'tarjeta_debito', 'efectivo', 'transferencia', 'otro')),
  bank TEXT,
  last_four_digits TEXT,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(user_id, is_default);
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can insert their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can update their own payment methods" ON payment_methods;
DROP POLICY IF EXISTS "Users can delete their own payment methods" ON payment_methods;

CREATE POLICY "Users can view their own payment methods"
  ON payment_methods FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own payment methods"
  ON payment_methods FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods FOR DELETE USING (auth.uid() = user_id);

-- Trigger para updated_at en payment_methods
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

-- Tabla: statistics
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

CREATE INDEX IF NOT EXISTS idx_statistics_user_id ON statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_statistics_month_year ON statistics(year DESC, month DESC);
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own statistics" ON statistics;
DROP POLICY IF EXISTS "Users can insert their own statistics" ON statistics;
DROP POLICY IF EXISTS "Users can update their own statistics" ON statistics;
DROP POLICY IF EXISTS "Users can delete their own statistics" ON statistics;

CREATE POLICY "Users can view their own statistics"
  ON statistics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own statistics"
  ON statistics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own statistics"
  ON statistics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own statistics"
  ON statistics FOR DELETE USING (auth.uid() = user_id);

COMMIT;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================
SELECT
  '✅ Tabla creada: ' || tablename as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'categories',
    'expenses',
    'budgets',
    'incomes',
    'statistics',
    'payment_methods',
    'income_categories'
  )
ORDER BY tablename;

-- ============================================================================
-- ¡COMPLETADO!
-- ============================================================================
-- Todas las tablas han sido creadas con éxito
-- Próximos pasos:
--   1. Ejecuta: delete-and-recreate-user.sql para crear tu usuario
--   2. Ejecuta: insert-categories.sql para agregar categorías iniciales
--   3. ¡Inicia sesión en tu aplicación!
-- ============================================================================
