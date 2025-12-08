# 🗄️ Configuración de Supabase

Guía para configurar las bases de datos de desarrollo y producción.

---

## 📦 Scripts esenciales

### 1. `setup-all-in-one-v2.sql`
**Cuándo**: Primera vez configurando una base de datos nueva.

**Ejecutar en**: Supabase Dashboard → SQL Editor

**Qué hace**:
- ✅ Crea todas las tablas (categories, expenses, budgets, incomes, etc.)
- ✅ Configura políticas RLS (Row Level Security)
- ✅ Crea índices y triggers

### 2. `get-user-id.sql`
Ver IDs de usuarios existentes.

### 3. `quick-check.sql`
Verificación rápida de tablas y usuarios.

### 4. `delete-user.sql`
Eliminar un usuario y todos sus datos.

### 5. `insert-categories.sql`
Agregar categorías de ejemplo (reemplaza `TU-USER-ID-AQUI`).

---

## 🚀 Setup completo (Paso a paso)

### Para LOCAL (jpotgomhqqygtdfwjfuz):

```bash
# 1. Ejecuta setup-all-in-one-v2.sql en Supabase Dashboard

# 2. Crea tu usuario
curl -X POST 'https://jpotgomhqqygtdfwjfuz.supabase.co/auth/v1/signup' \
  -H "apikey: YOUR_LOCAL_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "password": "tu-password"}'

# 3. Obtén tu user_id ejecutando get-user-id.sql

# 4. Inserta categorías con insert-categories.sql (reemplaza el user_id)

# 5. ✅ Listo!
```

### Para PRODUCCIÓN (hcmyikosoayumtcnqrbv):

```bash
# 1. Ejecuta setup-all-in-one-v2.sql en Supabase Dashboard

# 2. Crea tu usuario
curl -X POST 'https://hcmyikosoayumtcnqrbv.supabase.co/auth/v1/signup' \
  -H "apikey: YOUR_PROD_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "tu-email@ejemplo.com", "password": "tu-password"}'

# 3-5: Mismo proceso que local
```

---

## ⚙️ Cambiar entre ambientes

### Archivos de configuración:

```
.env.local  → Desarrollo local (jpotgomhqqygtdfwjfuz)
.env        → Producción (hcmyikosoayumtcnqrbv)
```

### Desarrollo:
```bash
cp .env.local .env
npm run dev
```

### Producción:
```bash
# Las variables se configuran en Vercel/tu plataforma de deployment
```

---

## ⚠️ Importante

- **NO uses SQL para crear usuarios** - El hash de `crypt()` no es compatible
- **Siempre usa la API de Supabase** para crear usuarios (curl arriba)
- Los scripts SQL son solo para **configurar tablas**, no usuarios

---

## 📁 Estructura de scripts

```
scripts/supabase/
├── setup-all-in-one-v2.sql    # Setup inicial ⭐
├── get-user-id.sql             # Utilidad
├── quick-check.sql             # Verificación
├── delete-user.sql             # Limpieza
├── insert-categories.sql       # Datos de ejemplo
└── migrations/                 # Migraciones de esquema
    ├── 00-initial-schema.sql
    ├── 01-add-payment-status.sql
    ├── 02-payment-methods.sql
    └── 03-incomes-system.sql
```
