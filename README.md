# 💰 Sistema de Gestión de Gastos Personales

> Aplicación web moderna para gestionar gastos personales con soporte para gastos recurrentes, categorización inteligente y seguimiento de estados de pago.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/luishron/nextjs-postgres-nextauth-tailwindcss-template/releases/tag/v1.0.0)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.9-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green)](https://supabase.com/)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Principales](#-módulos-principales)
- [Documentación de la Base de Datos](#-documentación-de-la-base-de-datos)
- [Roadmap](#-roadmap)

---

## ✨ Características

### 🎯 Gestión de Gastos

- **CRUD Completo**: Crear, leer, actualizar y eliminar gastos
- **Estados de Pago**: Seguimiento automático (pendiente, pagado, vencido)
- **Detección de Vencimientos**: Marcado automático de gastos vencidos por fecha
- **Métodos de Pago**: Efectivo, tarjeta de débito/crédito, transferencia
- **Notas Personalizadas**: Agregar contexto adicional a cada gasto
- **Filtros Inteligentes**: Por tipo (todos, recurrentes, únicos)

### 🔄 Gastos Recurrentes Avanzados

- **Generación Virtual**: Cálculo automático de próximas instancias sin saturar la BD
- **Mensajes Inteligentes**: "Vence en X días/semanas/meses"
- **Pago Anticipado**: Posibilidad de pagar instancias futuras
- **Filtrado Automático**: Oculta instancias ya pagadas
- **Frecuencias Soportadas**: Semanal, mensual, anual
- **Vista Dedicada**: Pestaña especializada para gastos recurrentes

### 🏷️ Categorías Personalizables

- **CRUD Completo**: Gestión total de categorías
- **Personalización Visual**: Colores e iconos emoji
- **Totales Automáticos**: Cálculo en tiempo real del gasto por categoría
- **Descripción**: Contexto adicional para cada categoría
- **Cards Visuales**: Presentación clara con totales destacados

### 🎨 Interfaz de Usuario

- **Diseño Moderno**: UI basada en shadcn/ui
- **Responsive**: Adaptable a móvil, tablet y desktop
- **Badges Semánticos**: Colores según urgencia y estado
- **Tablas Interactivas**: Acciones contextuales (editar, eliminar)
- **Diálogos Modales**: Experiencia fluida sin cambios de página
- **Formato MXN**: Moneda mexicana con separadores correctos

---

## 🛠 Stack Tecnológico

### Frontend
- **[Next.js 15](https://nextjs.org/)** - Framework React con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes accesibles y personalizables
- **[Lucide React](https://lucide.dev/)** - Iconos modernos

### Backend & Base de Datos
- **[Supabase](https://supabase.com/)** - Base de datos PostgreSQL + Auth
- **[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)** - Mutaciones del lado del servidor
- **[Auth.js (NextAuth)](https://authjs.dev/)** - Autenticación con GitHub OAuth

### Desarrollo
- **[pnpm](https://pnpm.io/)** - Package manager eficiente
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formateo de código

---

## 🏗 Arquitectura

### Patrón de Diseño

El proyecto sigue una arquitectura **Server-First** con Next.js App Router:

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                     │
│  - React Components (Client Components)                 │
│  - UI State Management                                  │
│  - Optimistic Updates                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ Server Actions / API Routes
┌─────────────────────────────────────────────────────────┐
│                  Servidor (Next.js)                      │
│  - Server Components (RSC)                              │
│  - Server Actions (Mutations)                           │
│  - Authentication Middleware                            │
│  - Business Logic                                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ↓ Supabase Client
┌─────────────────────────────────────────────────────────┐
│                Base de Datos (Supabase)                  │
│  - PostgreSQL Database                                  │
│  - Row Level Security (RLS)                             │
│  - Real-time Subscriptions                             │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Server Components** → Fetch inicial de datos en el servidor
2. **Client Components** → Interacción del usuario
3. **Server Actions** → Mutaciones seguras en el servidor
4. **Supabase Client** → Operaciones de base de datos
5. **Revalidation** → Actualización automática de la UI

---

## 📦 Instalación

### Prerequisitos

- Node.js 18.17 o superior
- pnpm 8.0 o superior
- Cuenta de Supabase
- Cuenta de GitHub (para OAuth)

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/luishron/nextjs-postgres-nextauth-tailwindcss-template.git
cd nextjs-postgres-nextauth-tailwindcss-template
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Edita `.env` y configura:
- Credenciales de Supabase
- GitHub OAuth credentials
- NextAuth secret

4. **Configurar Supabase**

Ejecuta el script SQL en Supabase SQL Editor:

```bash
# Ver archivo: supabase-init.sql
```

5. **Agregar estados de pago** (Opcional para MVP v1.0.0)

```bash
# Ver archivo: supabase-add-payment-status.sql
```

6. **Iniciar servidor de desarrollo**

```bash
pnpm dev
```

Visita [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuración

### Supabase

Ver documentación detallada en [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### GitHub OAuth

Ver documentación detallada en [GITHUB_OAUTH_SETUP.md](./GITHUB_OAUTH_SETUP.md)

### Variables de Entorno

```env
# Supabase
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# NextAuth
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
```

---

## 🎮 Uso

### Crear un Gasto

1. Navega a la pestaña "Gastos"
2. Click en "Agregar Gasto"
3. Completa el formulario:
   - Descripción
   - Monto
   - Fecha
   - Categoría
   - Método de pago
   - Estado de pago
   - Tipo (único o recurrente)
4. Si es recurrente, selecciona la frecuencia
5. Guarda

### Gestionar Gastos Recurrentes

1. Crea un gasto marcándolo como "Recurrente"
2. Ve a la pestaña "Recurrentes"
3. Visualiza las próximas instancias en la sección "Próximos Gastos Recurrentes"
4. Click en "Pagar" para registrar el pago de una instancia
5. La instancia desaparece de "Próximos" y se registra en el historial

### Categorías

1. Navega a "Categorías"
2. Click en "Agregar Categoría"
3. Define:
   - Nombre
   - Color (selector visual)
   - Icono emoji
   - Descripción
4. Visualiza el total gastado en cada categoría

---

## 📁 Estructura del Proyecto

```
gastos/
├── app/
│   ├── (dashboard)/          # Grupo de rutas del dashboard
│   │   ├── actions.ts        # Server Actions globales
│   │   ├── layout.tsx        # Layout compartido
│   │   ├── page.tsx          # Página principal
│   │   ├── categorias/       # Módulo de categorías
│   │   │   ├── page.tsx
│   │   │   ├── category-card.tsx
│   │   │   └── add-category-dialog.tsx
│   │   └── gastos/           # Módulo de gastos
│   │       ├── page.tsx
│   │       ├── expenses-table.tsx
│   │       ├── add-expense-dialog.tsx
│   │       ├── edit-expense-dialog.tsx
│   │       └── upcoming-expenses-card.tsx
│   ├── login/                # Autenticación
│   └── layout.tsx            # Layout raíz
├── components/
│   └── ui/                   # Componentes shadcn/ui
├── lib/
│   ├── auth.ts               # Configuración de Auth.js
│   ├── db.ts                 # Cliente Supabase + Queries
│   └── supabase/
│       └── server.ts         # Cliente servidor de Supabase
├── types/                    # Tipos TypeScript compartidos
├── public/                   # Assets estáticos
├── supabase-init.sql         # Script de inicialización
├── supabase-add-payment-status.sql  # Script estados de pago
└── package.json
```

---

## 🧩 Módulos Principales

### 1. Autenticación (`lib/auth.ts`)

Gestiona la autenticación de usuarios con GitHub OAuth:

```typescript
export async function getUser(): Promise<User | null>
```

**Características:**
- GitHub OAuth integration
- Session management
- Protected routes

---

### 2. Base de Datos (`lib/db.ts`)

Cliente central de Supabase con todas las queries:

#### Tipos Principales

```typescript
export type Category = {
  id: number;
  user_id: string;
  name: string;
  color: string;
  icon?: string | null;
  description?: string | null;
}

export type PaymentStatus = 'pagado' | 'pendiente' | 'vencido';

export type Expense = {
  id: number;
  user_id: string;
  category_id: number;
  amount: string;
  description?: string | null;
  date: string;
  payment_method?: string;
  payment_status?: PaymentStatus;
  notes?: string | null;
  is_recurring?: number;
  recurrence_frequency?: string | null;
}

export type UpcomingExpense = Expense & {
  isVirtual: true;
  daysUntilDue: number;
  dueMessage: string;
  nextDate: string;
  templateId: number;
}
```

#### Funciones de Gastos

```typescript
// Obtener gastos con paginación y filtros
getExpensesByUser(userId: string, options?: {
  search?: string;
  isRecurring?: boolean;
  offset?: number;
  limit?: number;
}): Promise<{
  expenses: Expense[];
  newOffset: number | null;
  totalExpenses: number;
}>

// CRUD de gastos
createExpense(expense: InsertExpense): Promise<Expense>
updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense>
deleteExpenseById(id: number): Promise<void>
```

#### Funciones de Categorías

```typescript
// Obtener categorías del usuario
getCategoriesByUser(userId: string): Promise<Category[]>

// Calcular total gastado por categoría
getCategoryTotalExpenses(userId: string, categoryId: number): Promise<number>

// CRUD de categorías
createCategory(category: InsertCategory): Promise<Category>
updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>
deleteCategoryById(id: number): Promise<void>
```

#### Funciones de Gastos Recurrentes

```typescript
// Generar próximas instancias virtuales
getUpcomingRecurringExpenses(
  userId: string,
  monthsAhead?: number
): Promise<UpcomingExpense[]>
```

**Algoritmo de Generación Virtual:**

1. Obtiene templates recurrentes de la BD
2. Calcula próximas fechas según frecuencia
3. Genera mensajes inteligentes de vencimiento
4. Filtra instancias ya pagadas
5. Ordena por proximidad

---

### 3. Server Actions (`app/(dashboard)/actions.ts`)

Mutaciones seguras del lado del servidor:

```typescript
// Gastos
export async function saveExpense(formData: FormData): Promise<ActionResult>
export async function updateExpense(formData: FormData): Promise<ActionResult>
export async function deleteExpense(formData: FormData): Promise<void>

// Categorías
export async function saveCategory(formData: FormData): Promise<ActionResult>
export async function updateCategory(formData: FormData): Promise<ActionResult>
export async function deleteCategory(formData: FormData): Promise<void>

// Gastos Recurrentes
export async function payRecurringExpense(formData: FormData): Promise<ActionResult>
```

**Características:**
- Validación de autenticación
- Manejo de errores centralizado
- Revalidación automática de paths
- Type-safe con FormData

---

### 4. Componentes de UI

#### ExpensesTable (`expenses-table.tsx`)

Tabla interactiva de gastos con:
- Formateo de moneda MXN
- Badges de estado con colores semánticos
- Detección automática de vencimientos
- Acciones contextuales (editar, eliminar)
- Diálogo de edición inline

#### UpcomingExpensesCard (`upcoming-expenses-card.tsx`)

Card de próximos gastos recurrentes:
- Lista de instancias virtuales
- Mensajes de vencimiento dinámicos
- Botón de pago anticipado
- Badges de urgencia por color

#### CategoryCard (`category-card.tsx`)

Card visual de categoría:
- Icono emoji personalizado
- Color de fondo configurable
- Total gastado destacado
- Acciones de eliminación

---

## 🗄️ Documentación de la Base de Datos

### Esquema de Tablas

#### `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `categories`
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  icon TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### `expenses`
```sql
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pendiente'
    CHECK (payment_status IN ('pagado', 'pendiente', 'vencido')),
  notes TEXT,
  is_recurring INTEGER DEFAULT 0,
  recurrence_frequency TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_category_id ON expenses(category_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_payment_status ON expenses(payment_status);
```

### Relaciones

```
users (1) ──< (N) categories
users (1) ──< (N) expenses
categories (1) ──< (N) expenses
```

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

```sql
-- Users solo pueden ver sus propios datos
CREATE POLICY "Users can view own data" ON expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

---

## 🗺️ Roadmap

### v1.1.0 - Reportes y Análisis
- [ ] Dashboard con gráficas
- [ ] Reporte mensual de gastos
- [ ] Análisis por categoría
- [ ] Exportación a CSV/Excel
- [ ] Comparativa mes a mes

### v1.2.0 - Presupuestos
- [ ] Definir presupuesto por categoría
- [ ] Alertas de sobre-gasto
- [ ] Progreso visual del presupuesto
- [ ] Presupuesto mensual global

### v1.3.0 - Mejoras de Recurrentes
- [ ] Edición de monto por instancia
- [ ] Pausar/reanudar recurrentes
- [ ] Historial de cambios
- [ ] Predicción de gastos futuros

### v2.0.0 - Ingresos y Balance
- [ ] Gestión de ingresos
- [ ] Cálculo de balance (ingresos - gastos)
- [ ] Proyecciones financieras
- [ ] Metas de ahorro

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👤 Autor

**Luis Naranja**

- GitHub: [@luishron](https://github.com/luishron)

---

## 🙏 Agradecimientos

- Template base de [Next.js Admin Dashboard](https://github.com/vercel/nextjs-postgres-nextauth-tailwindcss-template)
- Componentes UI de [shadcn/ui](https://ui.shadcn.com/)
- Iconos de [Lucide](https://lucide.dev/)

---

<div align="center">
  <strong>Hecho con ❤️ y Claude Code</strong>
</div>
