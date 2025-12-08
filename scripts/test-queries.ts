// Script de prueba para ejecutar las queries del dashboard
// Ejecuta: npx tsx scripts/test-queries.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQueries() {
  console.log('🔍 Probando conexión a Supabase...');
  console.log('URL:', supabaseUrl);

  // 1. Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error('❌ Error de autenticación:', authError);
    return;
  }

  if (!user) {
    console.log('⚠️  No hay usuario autenticado');
    console.log('Intentando hacer login...');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'luishron@gmail.com',
      password: 'Anna1985**'
    });

    if (error) {
      console.error('❌ Error al hacer login:', error);
      return;
    }

    console.log('✅ Login exitoso, user_id:', data.user?.id);
  } else {
    console.log('✅ Usuario autenticado:', user.id);
  }

  const userId = user?.id || (await supabase.auth.getUser()).data.user?.id;

  if (!userId) {
    console.error('❌ No se pudo obtener user_id');
    return;
  }

  // 2. Probar query de categorías
  console.log('\n🔍 Probando query de categorías...');
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (catError) {
    console.error('❌ Error al obtener categorías:', catError);
  } else {
    console.log('✅ Categorías obtenidas:', categories?.length);
    console.log('Categorías:', categories);
  }

  // 3. Probar query de gastos
  console.log('\n🔍 Probando query de gastos...');
  const { data: expenses, error: expError } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId);

  if (expError) {
    console.error('❌ Error al obtener gastos:', expError);
  } else {
    console.log('✅ Gastos obtenidos:', expenses?.length);
  }

  // 4. Probar query de ingresos
  console.log('\n🔍 Probando query de ingresos...');
  const { data: incomes, error: incError } = await supabase
    .from('incomes')
    .select('*')
    .eq('user_id', userId);

  if (incError) {
    console.error('❌ Error al obtener ingresos:', incError);
  } else {
    console.log('✅ Ingresos obtenidos:', incomes?.length);
  }

  console.log('\n✅ Todas las queries completadas');
}

testQueries().catch(console.error);
