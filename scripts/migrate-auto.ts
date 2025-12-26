#!/usr/bin/env tsx
/**
 * Script de migración automática para CI/CD
 *
 * Este script se ejecuta antes del build en producción para:
 * 1. Validar la conexión a la base de datos
 * 2. Aplicar schemas de Drizzle automáticamente
 * 3. Manejar errores sin romper el build
 *
 * Uso: tsx scripts/migrate-auto.ts
 * En Vercel: Se ejecuta automáticamente con pnpm build:prod
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local (desarrollo) o del sistema (producción)
dotenv.config({ path: '.env.local' });

const execAsync = promisify(exec);

// Colores para logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function validateEnvironment() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    log('❌ ERROR: DATABASE_URL no está configurada', 'red');
    log('Configura DATABASE_URL en tus variables de entorno', 'yellow');
    process.exit(1);
  }

  log('✅ DATABASE_URL configurada', 'green');
  log('', 'reset');
  return true;
}

async function runMigrations() {
  log('🚀 Aplicando migraciones de Drizzle...', 'blue');
  log('', 'reset');

  try {
    // Ejecutar drizzle-kit push
    const { stdout, stderr } = await execAsync('pnpm drizzle-kit push');

    // Mostrar output
    if (stdout) {
      log(stdout.trim(), 'gray');
    }

    // Si hay warnings pero no errors, continuar
    if (stderr && !stderr.includes('Error')) {
      log(stderr.trim(), 'yellow');
    } else if (stderr) {
      throw new Error(stderr);
    }

    log('', 'reset');
    log('✅ Migraciones aplicadas exitosamente', 'green');
    return true;
  } catch (error) {
    log('❌ Error al aplicar migraciones:', 'red');
    console.error(error);

    // En producción, podemos decidir si fallar el build o continuar
    const shouldFailOnError = process.env.FAIL_ON_MIGRATION_ERROR === 'true';

    if (shouldFailOnError) {
      log('', 'reset');
      log('⚠️  Build fallará por error en migración (FAIL_ON_MIGRATION_ERROR=true)', 'red');
      process.exit(1);
    } else {
      log('', 'reset');
      log('⚠️  Continuando con el build a pesar del error', 'yellow');
      log('💡 Configura FAIL_ON_MIGRATION_ERROR=true para fallar el build en este caso', 'gray');
      return false;
    }
  }
}

async function main() {
  log('', 'reset');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('  🗄️  Sistema de Migraciones Automáticas', 'blue');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
  log('', 'reset');

  const startTime = Date.now();

  // 1. Validar variables de entorno
  await validateEnvironment();

  // 2. Ejecutar migraciones (drizzle-kit maneja la conexión)
  await runMigrations();

  log('', 'reset');
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`⏱️  Tiempo total: ${duration}s`, 'gray');
  log('', 'reset');
}

// Ejecutar
main().catch((error) => {
  log('', 'reset');
  log('❌ Error fatal:', 'red');
  console.error(error);
  process.exit(1);
});
