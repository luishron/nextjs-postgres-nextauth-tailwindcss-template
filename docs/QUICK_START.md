# Quick Start Guide - Tallify

Get up and running with Tallify in 5 minutes.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (install with `npm install -g pnpm`)
- **Supabase account** (free tier available at [supabase.com](https://supabase.com))
- **Git** for cloning the repository

---

## 5-Minute Setup

### Step 1: Clone and Install (1 min)

```bash
# Clone the repository
git clone <repository-url>
cd gastos

# Install dependencies
pnpm install
```

### Step 2: Configure Environment (2 min)

```bash
# Copy environment template
cp .env.example .env.local
```

Open `.env.local` and configure your Supabase credentials:

```env
# Required: Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Site URL (for production)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Database URL (for migrations)
DATABASE_URL=postgresql://postgres:PASSWORD@db.PROJECT.supabase.co:5432/postgres?sslmode=require
```

**Where to find your Supabase credentials:**
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **URL** and **anon/public** key

### Step 3: Setup Database (1 min)

Run the automatic migration script:

```bash
pnpm db:migrate
```

This will:
- Apply all Drizzle migrations
- Create necessary tables and indexes
- Set up triggers for user registration
- Insert default expense categories

**Troubleshooting:** If migrations fail, see [MIGRATION-GUIDE.md](./deployment/MIGRATION-GUIDE.md) for detailed instructions.

### Step 4: Run Development Server (30 sec)

```bash
pnpm dev
```

The app will be available at **http://localhost:3000**

### Step 5: Create Your First User (30 sec)

1. Open http://localhost:3000
2. Click "Magic Link" tab
3. Enter your email
4. Check your inbox for the magic link
5. Click the link to log in
6. Complete the onboarding flow (name, currency, categories)

**Development Shortcut:** Use the "Modo desarrollo" section on the login page to auto-fill test credentials (only visible in dev mode).

---

## Verification Checklist

After setup, verify everything works:

- [ ] Dev server runs without errors at `localhost:3000`
- [ ] Login page loads correctly
- [ ] Magic Link authentication works
- [ ] Onboarding flow completes successfully
- [ ] Dashboard displays with KPI cards
- [ ] Can create a new expense
- [ ] Can create a new income
- [ ] Can create a new category

---

## Next Steps

### 🎨 Explore the App

- **Dashboard**: View KPIs, upcoming expenses, and top categories
- **Gastos**: Manage expenses with smart sorting and filtering
- **Ingresos**: Track income sources
- **Categorías**: Customize expense categories
- **Métodos de Pago**: Configure payment methods
- **Configuración**: Change currency and preferences

### 📚 Learn More

- **[README.md](../README.md)** - Project overview and features
- **[CLAUDE.md](../CLAUDE.md)** - Development patterns and conventions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and design
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - UI component catalog

### 🛠️ Development Workflow

```bash
# Run development server with Turbopack
pnpm dev

# Type check (no emit)
npx tsc --noEmit

# Format code with Prettier
npx prettier --write .

# Build for production
pnpm build

# Run production server
pnpm start
```

### 🗄️ Database Commands

```bash
# Generate new migration from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Direct push schema changes (no migration files)
pnpm db:push

# Build with automatic migrations (for deployments)
pnpm build:prod
```

---

## Common Issues

### Issue: `ECONNREFUSED` when connecting to database

**Solution:** Check that your `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct in `.env.local`

### Issue: Migrations fail with "relation already exists"

**Solution:** Your database may have partial schema. See [MIGRATION-GUIDE.md](./deployment/MIGRATION-GUIDE.md) for reset instructions.

### Issue: "Failed to fetch" error on login

**Solution:** Ensure your Supabase project has Email Auth enabled:
1. Go to **Authentication** → **Providers**
2. Enable "Email" provider
3. Configure redirect URLs: `http://localhost:3000/auth/callback`

### Issue: No default categories after setup

**Solution:** Categories are auto-inserted by migration. If missing, run:
```bash
pnpm db:migrate
```

---

## Getting Help

- **Documentation Index**: See [docs/INDEX.md](./INDEX.md) for all documentation
- **Issues**: Report bugs at [GitHub Issues](https://github.com/anthropics/claude-code/issues)
- **Questions**: Check [CLAUDE.md](../CLAUDE.md) for development patterns

---

**Setup Time:** ~5 minutes
**Last Updated:** January 7, 2026
**Version:** 0.1.0-beta
