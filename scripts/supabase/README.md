# Supabase Scripts

Scripts SQL para configurar y mantener la base de datos.

## 📁 Estructura

```
scripts/supabase/
├── setup/                          # Scripts de configuración inicial
│   ├── supabase-production-setup.sql   # ⭐ USAR ESTE para producción
│   ├── development.sql                 # Setup para desarrollo (RLS deshabilitado)
│   └── alternative-setup.sql           # Setup alternativo
├── migrations/                     # Migraciones incrementales
│   ├── 01-add-payment-status.sql      # Añade columna payment_status
│   ├── 02-payment-methods.sql         # Crea tabla payment_methods
│   └── 03-incomes-system.sql          # Sistema completo de ingresos
├── get-user-id.sql                # Utilidad: obtener user_id
└── insert-categories.sql          # Utilidad: insertar categorías de ejemplo
```

## 🚀 Configuración Inicial

### Producción (RECOMENDADO)

1. Crea un nuevo proyecto en [Supabase](https://app.supabase.com)
2. Ve al **SQL Editor**
3. Ejecuta: `setup/supabase-production-setup.sql`
4. Configura las variables de entorno en tu plataforma de deployment

**Características:**
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de seguridad por usuario
- ✅ Todas las tablas y migraciones incluidas
- ✅ Índices optimizados
- ✅ Triggers configurados

### Desarrollo

Si prefieres desarrollo sin RLS (más simple para testing):
1. Ejecuta: `setup/development.sql`

## 📊 Tablas Creadas

- `categories` - Categorías de gastos
- `expenses` - Gastos
- `budgets` - Presupuestos por categoría
- `incomes` - Ingresos
- `income_categories` - Categorías de ingresos
- `payment_methods` - Métodos de pago configurables

## 🔧 Migraciones

Las migraciones en `migrations/` son **incrementales** y ya están incluidas en el script de producción. Solo úsalas si necesitas aplicarlas individualmente a una base de datos existente.

## 📝 Utilidades

- `get-user-id.sql` - Query para obtener el ID de usuario
- `insert-categories.sql` - Insertar categorías de ejemplo

## ⚙️ Variables de Entorno Necesarias

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key
```

Obtén estos valores en: **Project Settings → API**
