-- Crear tabla de métodos de pago
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

-- Crear índice para mejorar consultas por usuario
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);

-- Crear índice para métodos de pago por defecto
CREATE INDEX idx_payment_methods_is_default ON payment_methods(user_id, is_default);

-- Habilitar Row Level Security
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver sus propios métodos de pago
CREATE POLICY "Users can view their own payment methods"
  ON payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden insertar sus propios métodos de pago
CREATE POLICY "Users can insert their own payment methods"
  ON payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios solo pueden actualizar sus propios métodos de pago
CREATE POLICY "Users can update their own payment methods"
  ON payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los usuarios solo pueden eliminar sus propios métodos de pago
CREATE POLICY "Users can delete their own payment methods"
  ON payment_methods
  FOR DELETE
  USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_payment_methods_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_methods_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE payment_methods IS 'Métodos de pago configurables por usuario';
COMMENT ON COLUMN payment_methods.type IS 'Tipo de método de pago: tarjeta_credito, tarjeta_debito, efectivo, transferencia, otro';
COMMENT ON COLUMN payment_methods.bank IS 'Nombre del banco (opcional)';
COMMENT ON COLUMN payment_methods.last_four_digits IS 'Últimos 4 dígitos de la tarjeta (opcional)';
COMMENT ON COLUMN payment_methods.is_default IS 'Si es el método de pago por defecto del usuario';
