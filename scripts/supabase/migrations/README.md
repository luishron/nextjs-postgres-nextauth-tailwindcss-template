# Database Migrations

This folder contains database migrations for the Homelas application.

## Running Migrations

### Automatic Migration (Recommended)

Run migrations automatically using the migration script:

```bash
npm run migrate
```

**Requirements:**
- Add `DATABASE_URL` to your `.env.local` file
- Get the connection string from: Supabase Dashboard > Project Settings > Database > Connection string (Direct connection)

Example `.env.local`:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project.supabase.co:5432/postgres
```

### Manual Migration (Alternative)

If the automatic migration fails, you can run migrations manually:

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Click on **SQL Editor** in the sidebar
4. Click **New Query**
5. Copy the SQL from the migration file
6. Paste and click **Run**

## Available Migrations

### 04-add-category-favorites.sql
**Date:** 2025-12-19

Adds favorite functionality to categories:
- Adds `is_favorite` boolean column to `categories` table
- Creates index `idx_categories_user_favorite` for performance
- Sets default value to `false` for all existing categories

**Features enabled:**
- Mark categories as favorites
- Favorites appear first in all views
- Persistent favorite status in database

---

## Migration Status

To check if a migration has been applied:

```sql
-- Check if is_favorite column exists
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'categories'
AND column_name = 'is_favorite';
```

## Troubleshooting

### Error: Connection refused
- Check your `DATABASE_URL` is correct
- Ensure your IP is allowed in Supabase settings
- Try using the connection pooler URL instead

### Error: Column already exists
- Migration has already been applied
- No action needed

### Error: Permission denied
- Make sure you're using the database owner credentials
- Check your database password is correct

---

## Creating New Migrations

When creating new migrations:

1. Name files sequentially: `XX-description.sql` (e.g., `05-add-budgets.sql`)
2. Include descriptive comments at the top
3. Use `IF NOT EXISTS` for idempotency
4. Add verification queries in comments
5. Update this README with migration details
