-- Agregar columna de estado de pago a la tabla expenses
ALTER TABLE expenses
ADD COLUMN payment_status TEXT DEFAULT 'pendiente'
CHECK (payment_status IN ('pagado', 'pendiente', 'vencido'));

-- Actualizar gastos existentes con estado por defecto
UPDATE expenses
SET payment_status = 'pendiente'
WHERE payment_status IS NULL;

-- Crear índice para mejorar consultas por estado de pago
CREATE INDEX idx_expenses_payment_status ON expenses(payment_status);

-- Comentarios para documentación
COMMENT ON COLUMN expenses.payment_status IS 'Estado del pago: pagado (ya pagado), pendiente (por pagar), vencido (no pagado después de la fecha)';
