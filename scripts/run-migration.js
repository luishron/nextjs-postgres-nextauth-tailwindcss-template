#!/usr/bin/env node

/**
 * Migration Runner Script
 * Executes pending database migrations automatically
 *
 * Usage: npm run migrate
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

async function runMigration() {
  let client;

  try {
    console.log(`${colors.cyan}
╔════════════════════════════════════════╗
║   🗄️  Database Migration Runner       ║
╚════════════════════════════════════════╝${colors.reset}\n`);

    // Get database connection string
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.SUPABASE_DB_URL ||
      process.env.POSTGRES_URL;

    if (!connectionString) {
      console.error(
        `${colors.red}❌ Error: No database connection string found${colors.reset}\n`
      );
      console.log(`${colors.yellow}Please set one of these environment variables in .env.local:${colors.reset}`);
      console.log(`  - DATABASE_URL`);
      console.log(`  - SUPABASE_DB_URL`);
      console.log(`  - POSTGRES_URL\n`);
      console.log(`${colors.cyan}💡 You can find your connection string in:${colors.reset}`);
      console.log(`   Supabase Dashboard > Project Settings > Database > Connection string\n`);
      process.exit(1);
    }

    // Create PostgreSQL client
    client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log(`${colors.blue}🔌 Connecting to database...${colors.reset}`);
    await client.connect();
    console.log(`${colors.green}✅ Connected successfully!${colors.reset}\n`);

    // Check if migration is already applied
    console.log(`${colors.blue}🔍 Checking if migration is needed...${colors.reset}`);

    const checkQuery = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'categories'
      AND column_name = 'is_favorite';
    `;

    const checkResult = await client.query(checkQuery);

    if (checkResult.rows.length > 0) {
      console.log(`${colors.yellow}⚠️  Migration already applied!${colors.reset}`);
      console.log(`${colors.green}✨ The 'is_favorite' column already exists.${colors.reset}\n`);
      await client.end();
      return;
    }

    // Read migration file
    const migrationPath = path.join(
      __dirname,
      'supabase',
      'migrations',
      '04-add-category-favorites.sql'
    );

    console.log(`${colors.blue}📄 Reading migration file...${colors.reset}`);

    if (!fs.existsSync(migrationPath)) {
      console.error(
        `${colors.red}❌ Migration file not found: ${migrationPath}${colors.reset}`
      );
      await client.end();
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Execute migration
    console.log(`${colors.blue}⚡ Executing migration...${colors.reset}`);
    await client.query(migrationSQL);

    // Verify migration was successful
    console.log(`${colors.blue}🔍 Verifying migration...${colors.reset}`);
    const verifyResult = await client.query(checkQuery);

    if (verifyResult.rows.length === 0) {
      throw new Error('Migration verification failed: column not found after execution');
    }

    // Count categories and verify default values
    const countQuery = `
      SELECT COUNT(*) as total,
             COUNT(*) FILTER (WHERE is_favorite = false) as with_default
      FROM categories;
    `;
    const countResult = await client.query(countQuery);
    const { total, with_default } = countResult.rows[0];

    console.log(`\n${colors.green}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.green}║  ✅  Migration Successful!            ║${colors.reset}`);
    console.log(`${colors.green}╚════════════════════════════════════════╝${colors.reset}\n`);

    console.log(`${colors.cyan}📊 Migration Summary:${colors.reset}`);
    console.log(`  ✓ Added 'is_favorite' column to categories table`);
    console.log(`  ✓ Created index 'idx_categories_user_favorite'`);
    console.log(`  ✓ Set default value (false) for ${with_default} existing categories`);
    console.log(`  ✓ Total categories in database: ${total}\n`);

    console.log(`${colors.green}✨ Your app is now ready to use favorites!${colors.reset}`);
    console.log(`${colors.cyan}🚀 Start your app with: npm run dev${colors.reset}\n`);

    await client.end();
  } catch (error) {
    console.error(
      `\n${colors.red}╔════════════════════════════════════════╗${colors.reset}`
    );
    console.error(
      `${colors.red}║  ❌  Migration Failed                 ║${colors.reset}`
    );
    console.error(
      `${colors.red}╚════════════════════════════════════════╝${colors.reset}\n`
    );

    console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);

    if (error.message.includes('connect')) {
      console.log(`${colors.yellow}💡 Connection issues detected. Please check:${colors.reset}`);
      console.log(`  1. Your DATABASE_URL is correct`);
      console.log(`  2. Your database is accessible`);
      console.log(`  3. Your IP is allowed in Supabase (if using connection pooler)\n`);
    }

    console.log(`${colors.cyan}📝 Manual migration instructions:${colors.reset}`);
    console.log(`  1. Go to https://supabase.com`);
    console.log(`  2. Select your project > SQL Editor`);
    console.log(`  3. Copy SQL from: scripts/supabase/migrations/04-add-category-favorites.sql`);
    console.log(`  4. Paste and click "Run"\n`);

    if (client) {
      await client.end();
    }

    process.exit(1);
  }
}

// Run migration
runMigration();
