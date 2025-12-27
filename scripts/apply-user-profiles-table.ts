import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;

async function applyUserProfilesTable() {
  console.log('🚀 Creando tabla user_profiles con Supabase Client...\n');

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // SQL solo para user_profiles (las otras tablas ya existen)
  const sql = `
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

  try {
    // Verificar si ya existe
    const { data: existingTable, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(0);

    if (!checkError) {
      console.log('✅ La tabla user_profiles ya existe!');
      console.log('🎉 Todo listo para Magic Links + Onboarding\n');
      return;
    }

    console.log('📋 La tabla no existe. Necesitas ejecutar este SQL en Supabase SQL Editor:\n');
    console.log('─'.repeat(70));
    console.log(sql);
    console.log('─'.repeat(70));
    console.log('\n🔗 Link directo:');
    console.log('https://supabase.com/dashboard/project/jpotgomhqqygtdfwjfuz/sql/new');
    console.log('\nCopia el SQL de arriba, pégalo y haz clic en Run.\n');

  } catch (err) {
    console.error('Error:', err);
  }
}

applyUserProfilesTable();
