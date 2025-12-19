# Configuración de Drizzle ORM

## ✅ Instalación Completa

Drizzle ORM está instalado y configurado. **Tu base de datos NO ha sido modificada.**

## 📋 Próximo Paso: Configurar DATABASE_URL

Para usar Drizzle necesitas la URL de conexión directa a PostgreSQL de Supabase.

### Cómo Obtener tu DATABASE_URL:

1. **Ve a tu proyecto en Supabase Dashboard**
   - https://supabase.com/dashboard

2. **Navega a Database Settings**
   - Click en "Settings" (⚙️) en el sidebar
   - Click en "Database"

3. **Copia la Connection String**
   - Scroll hasta "Connection string"
   - Selecciona la pestaña **"URI"**
   - Copia la URL completa
   - Se verá algo como:
     ```
     postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

4. **Reemplaza [YOUR-PASSWORD]** con tu database password
   - Si no recuerdas tu password, puedes resetearlo en Database Settings

### Configurar el archivo .env:

Crea un archivo `.env` en la raíz del proyecto con:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Database Direct Connection (para Drizzle ORM)
DATABASE_URL=postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**⚠️ IMPORTANTE:** El archivo `.env` ya está en `.gitignore` - NO lo commitees.

---

## 🔄 Comandos Disponibles

Una vez configurado el `.env`, podrás usar estos comandos:

### 1. **Introspección** (Leer DB actual → Generar schemas)
```bash
npm run db:introspect
```
Este comando **solo lee** tu base de datos y genera archivos TypeScript con los schemas en `lib/db/schema.ts`.
**No modifica nada en la base de datos.**

### 2. **Generate** (Schema → SQL migrations)
```bash
npm run db:generate
```
Cuando modifiques los schemas, este comando genera archivos SQL con las migraciones.
Útil para futuras actualizaciones.

### 3. **Push** (Aplicar cambios a DB)
```bash
npm run db:push
```
⚠️ Este comando **SÍ modifica** la base de datos.
Aplica los cambios de tus schemas directamente a la DB.
Úsalo solo cuando estés listo para actualizar la estructura.

### 4. **Studio** (UI visual para explorar DB)
```bash
npm run db:studio
```
Abre una interfaz web en `https://local.drizzle.studio` para ver y editar datos.

---

## 🎯 Siguiente Paso

Una vez que configures el `.env`:

1. Ejecuta `npm run db:introspect`
2. Verifica que se generó `lib/db/schema.ts` correctamente
3. Listo! Ya podrás usar Drizzle para futuras actualizaciones basadas en schema

---

## 📚 Ventajas de Drizzle

### Antes (SQL manual):
```sql
-- Crear archivo: scripts/supabase/migrations/04-add-field.sql
ALTER TABLE expenses ADD COLUMN new_field TEXT;
```
Luego ejecutar manualmente el SQL en Supabase.

### Ahora (Drizzle):
```typescript
// Editar: lib/db/schema.ts
export const expenses = pgTable('expenses', {
  // ... campos existentes
  newField: text('new_field') // ← Agregar aquí
});
```
```bash
npm run db:push  # Aplica el cambio automáticamente
```

**TypeScript detecta errores ANTES de ejecutar.**
**No más SQL manual.**
**Schemas versionados en tu código.**
