import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no está configurado en .env.local');
  process.exit(1);
}

async function applyMigration() {
  console.log('🚀 Iniciando migración de user_profiles...\n');

  const sql = postgres(DATABASE_URL);

  try {
    // Leer el archivo SQL de migración
    const migrationPath = path.join(__dirname, 'supabase', 'apply-user-profiles.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Ejecutando migración desde:', migrationPath);
    console.log('─'.repeat(50));

    // Ejecutar el script SQL completo
    await sql.unsafe(migrationSQL);

    console.log('─'.repeat(50));
    console.log('✅ Migración aplicada exitosamente!\n');

    // Verificar que la tabla existe
    const result = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'user_profiles'
    `;

    if (result.length > 0) {
      console.log('✅ Tabla user_profiles creada correctamente\n');
    }

    // Contar usuarios y perfiles
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM auth.users) AS total_users,
        (SELECT COUNT(*) FROM user_profiles) AS total_profiles
    `;

    console.log('📊 Estadísticas:');
    console.log(`   Usuarios totales: ${stats[0].total_users}`);
    console.log(`   Perfiles creados: ${stats[0].total_profiles}`);

    if (stats[0].total_users === stats[0].total_profiles) {
      console.log('   ✅ Todos los usuarios tienen perfil\n');
    } else {
      console.log('   ⚠️  Algunos usuarios no tienen perfil\n');
    }

    // Mostrar últimos perfiles creados
    const profiles = await sql`
      SELECT id, role, onboarding_completed, full_name, created_at
      FROM user_profiles
      ORDER BY created_at DESC
      LIMIT 5
    `;

    if (profiles.length > 0) {
      console.log('📋 Últimos perfiles creados:');
      profiles.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.full_name || 'Sin nombre'} - Role: ${p.role} - Onboarding: ${p.onboarding_completed}`);
      });
      console.log('');
    }

    console.log('🎉 ¡Migración completada exitosamente!\n');

  } catch (error) {
    console.error('❌ ERROR al aplicar migración:');
    console.error(error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

applyMigration();
