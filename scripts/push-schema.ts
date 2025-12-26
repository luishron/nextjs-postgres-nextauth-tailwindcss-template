import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as dotenv from 'dotenv';
import * as schema from '../lib/drizzle/schema';

dotenv.config({ path: '.env.local' });

async function pushSchema() {
  // Construir URL desde componentes de Supabase
  const supabaseUrl = process.env.SUPABASE_URL;

  if (!supabaseUrl) {
    console.error('❌ SUPABASE_URL no encontrado en .env.local');
    process.exit(1);
  }

  // Extraer el project ref de la URL de Supabase
  const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  if (!projectRef) {
    console.error('❌ No se pudo extraer el project ref de SUPABASE_URL');
    process.exit(1);
  }

  console.log('🔑 Project Ref:', projectRef);
  console.log('📊 Aplicando schema de Drizzle a Supabase...\n');

  // Usar DATABASE_URL directamente
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL no encontrado');
    process.exit(1);
  }

  console.log('🔌 Conectando a Supabase...');

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  try {
    console.log('📦 Aplicando migraciones...');
    await migrate(db, { migrationsFolder: './lib/drizzle/migrations' });

    console.log('✅ Schema aplicado exitosamente!\n');

    // Verificar
    const result = await client`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
    `;

    if (result.length > 0) {
      console.log('✅ Tabla user_profiles creada\n');
    } else {
      console.log('⚠️  Tabla user_profiles no encontrada\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

pushSchema();
