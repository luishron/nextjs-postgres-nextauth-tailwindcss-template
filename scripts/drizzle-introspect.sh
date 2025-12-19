#!/bin/bash

# Script helper para introspección de Drizzle
# Verifica que DATABASE_URL esté configurado antes de ejecutar

set -e

echo "🔍 Verificando configuración de DATABASE_URL..."

# Cargar .env si existe
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "❌ Error: Archivo .env no encontrado"
  echo ""
  echo "Por favor crea un archivo .env con:"
  echo "DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/postgres"
  echo ""
  echo "Ver DRIZZLE_SETUP.md para instrucciones completas"
  exit 1
fi

# Verificar que DATABASE_URL esté configurado
if [ -z "$DATABASE_URL" ]; then
  echo "❌ Error: DATABASE_URL no está configurado en .env"
  echo ""
  echo "Agrega esta línea a tu .env:"
  echo "DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/postgres"
  echo ""
  echo "Ver DRIZZLE_SETUP.md para instrucciones completas"
  exit 1
fi

# Verificar que no sea el valor de ejemplo
if [[ "$DATABASE_URL" == *"[YOUR-PASSWORD]"* ]] || [[ "$DATABASE_URL" == *"your-project.supabase.co"* ]]; then
  echo "❌ Error: DATABASE_URL contiene valores de ejemplo"
  echo ""
  echo "Por favor reemplaza:"
  echo "  - [YOUR-PASSWORD] con tu database password real"
  echo "  - your-project.supabase.co con tu host real de Supabase"
  echo ""
  echo "Ver DRIZZLE_SETUP.md para instrucciones completas"
  exit 1
fi

echo "✅ DATABASE_URL configurado correctamente"
echo ""
echo "🚀 Iniciando introspección de la base de datos..."
echo "   (Esto solo LEE tu DB, no modifica nada)"
echo ""

# Ejecutar introspección
npm run db:introspect

echo ""
echo "✅ Introspección completada!"
echo ""
echo "📁 Revisa el schema generado en: lib/db/schema.ts"
echo ""
