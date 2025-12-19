import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  // Schema files location - where Drizzle will read/write schema definitions
  schema: './lib/db/schema.ts',

  // Output directory for migrations
  out: './drizzle',

  // Database driver
  dialect: 'postgresql',

  // Database connection
  dbCredentials: {
    // Supabase provides a direct PostgreSQL connection string
    // Format: postgresql://postgres:[PASSWORD]@[PROJECT_REF].supabase.co:5432/postgres
    url: process.env.DATABASE_URL!
  },

  // Verbose logging for introspection and migrations
  verbose: true,

  // Strict mode - fails on breaking changes
  strict: true
});
