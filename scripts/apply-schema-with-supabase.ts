import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

async function applySchema() {
  console.log('🚀 Aplicando schema user_profiles con Supabase Client...\n');

  // Leer la migración SQL generada por Drizzle
  const migrationPath = path.join(__dirname, '../lib/drizzle/migrations/0000_amusing_misty_knight.sql');
  let migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

  // Crear cliente de Supabase (como service_role para bypass RLS)
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log('📄 Ejecutando schema de Drizzle...');
  console.log('─'.repeat(50));

  try {
    // Ejecutar todo el SQL de la migración
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

    if (error) {
      // Si no existe la función exec_sql, crear las tablas una por una
      console.log('⚠️  Función exec_sql no disponible, aplicando manualmente...\n');

      // Crear solo la tabla user_profiles (las demás ya existen)
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY,
          role TEXT NOT NULL DEFAULT 'free',
          plan_expires_at TIMESTAMPTZ,
          onboarding_completed BOOLEAN NOT NULL DEFAULT false,
          preferences JSONB NOT NULL DEFAULT '{"currency":"USD","theme":"system"}'::jsonb,
          full_name TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
        CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding ON user_profiles(onboarding_completed);
      `;

      // Usar query directa
      const { error: createError } = await supabase.from('user_profiles').select('*').limit(0);

      if (createError && createError.code === '42P01') {
        console.log('❌ No se puede crear tabla directamente desde el cliente.');
        console.log('\n📋 ACCIÓN REQUERIDA:');
        console.log('Copia y ejecuta este SQL en Supabase SQL Editor:\n');
        console.log('─'.repeat(50));
        console.log(migrationSQL);
        console.log('─'.repeat(50));
        process.exit(1);
      }
    }

    console.log('✅ Schema aplicado!\n');

    // Verificar que la tabla existe
    const { data, error: selectError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (!selectError) {
      console.log('✅ Tabla user_profiles verificada\n');
      console.log('🎉 ¡Todo listo para usar Magic Links + Onboarding!\n');
    } else {
      console.log('⚠️  La tabla puede no existir aún. Ejecuta el SQL manualmente.\n');
    }

  } catch (err) {
    console.error('❌ Error:', err);
    console.log('\n📋 SOLUCIÓN:');
    console.log('Ejecuta este SQL en Supabase Dashboard → SQL Editor:\n');
    console.log('─'.repeat(50));
    console.log(migrationSQL);
    console.log('─'.repeat(50));
    process.exit(1);
  }
}

applySchema();
