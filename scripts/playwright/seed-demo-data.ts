/**
 * Script para poblar la base de datos con datos demo atractivos para screenshots
 *
 * IMPORTANTE: Este script asume que tienes un usuario de test configurado.
 * Ejecuta `npx tsx create-test-user.ts` primero si no tienes uno.
 */

import { createServerClient } from '@/lib/supabase/server';

const TEST_USER_EMAIL = 'test@example.com';

async function seedDemoData() {
  console.log('🌱 Iniciando seed de datos demo...\n');

  // Obtener el usuario de test
  const supabase = await createServerClient();
  const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: 'testpassword123',
  });

  if (authError || !user) {
    console.error('❌ Error: Usuario de test no encontrado.');
    console.log('💡 Ejecuta: npx tsx create-test-user.ts\n');
    process.exit(1);
  }

  const userId = user.id;
  console.log(`✓ Usuario autenticado: ${user.email}`);

  // Limpiar datos existentes del usuario de test
  console.log('\n🧹 Limpiando datos existentes...');
  await supabase.from('expenses').delete().eq('user_id', userId);
  await supabase.from('incomes').delete().eq('user_id', userId);
  await supabase.from('payment_methods').delete().eq('user_id', userId);
  await supabase.from('categories').delete().eq('user_id', userId);
  console.log('✓ Datos limpiados');

  // 1. Crear categorías
  console.log('\n📁 Creando 8 categorías...');
  const categories = [
    { name: 'Comida', color: 'hsl(25 95% 53%)', icon: '🍔', user_id: userId },
    { name: 'Transporte', color: 'hsl(220 89% 61%)', icon: '🚗', user_id: userId },
    { name: 'Entretenimiento', color: 'hsl(280 83% 63%)', icon: '🎮', user_id: userId },
    { name: 'Servicios', color: 'hsl(45 93% 47%)', icon: '💡', user_id: userId },
    { name: 'Renta', color: 'hsl(199 89% 48%)', icon: '🏠', user_id: userId },
    { name: 'Salud', color: 'hsl(142 76% 36%)', icon: '💊', user_id: userId },
    { name: 'Educación', color: 'hsl(217 91% 60%)', icon: '📚', user_id: userId },
    { name: 'Otros', color: 'hsl(215 14% 51%)', icon: '⚙️', user_id: userId },
  ];

  const { data: createdCategories } = await supabase
    .from('categories')
    .insert(categories)
    .select();

  console.log(`✓ ${createdCategories?.length || 0} categorías creadas`);

  // 2. Crear métodos de pago
  console.log('\n💳 Creando 3 métodos de pago...');
  const paymentMethods = [
    {
      user_id: userId,
      name: 'Visa BBVA',
      type: 'credit_card',
      bank: 'BBVA',
      last_four_digits: '1234',
      color: 'hsl(220 89% 61%)',
      is_default: 1,
    },
    {
      user_id: userId,
      name: 'Mastercard Santander',
      type: 'credit_card',
      bank: 'Santander',
      last_four_digits: '5678',
      color: 'hsl(0 84% 60%)',
      is_default: 0,
    },
    {
      user_id: userId,
      name: 'Efectivo',
      type: 'cash',
      color: 'hsl(142 76% 36%)',
      is_default: 0,
    },
  ];

  const { data: createdPaymentMethods } = await supabase
    .from('payment_methods')
    .insert(paymentMethods)
    .select();

  console.log(`✓ ${createdPaymentMethods?.length || 0} métodos de pago creados`);

  // 3. Crear gastos (mezcla de vencidos, pendientes, pagados y recurrentes)
  console.log('\n💸 Creando 20 gastos...');

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const expenses = [
    // Vencidos (overdue)
    {
      user_id: userId,
      description: 'Renta Diciembre',
      amount: 8000,
      date: '2025-12-01',
      category_id: createdCategories?.find(c => c.name === 'Renta')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'vencido',
      is_recurring: 1,
      recurrence_frequency: 'monthly',
    },
    {
      user_id: userId,
      description: 'Internet',
      amount: 500,
      date: '2025-12-10',
      category_id: createdCategories?.find(c => c.name === 'Servicios')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'vencido',
      is_recurring: 0,
    },

    // Pendientes (pending)
    {
      user_id: userId,
      description: 'Gym Mensualidad',
      amount: 800,
      date: '2025-12-28',
      category_id: createdCategories?.find(c => c.name === 'Salud')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pendiente',
      is_recurring: 1,
      recurrence_frequency: 'monthly',
    },
    {
      user_id: userId,
      description: 'Netflix',
      amount: 139,
      date: '2025-12-30',
      category_id: createdCategories?.find(c => c.name === 'Entretenimiento')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pendiente',
      is_recurring: 1,
      recurrence_frequency: 'monthly',
    },
    {
      user_id: userId,
      description: 'Spotify',
      amount: 115,
      date: '2025-12-29',
      category_id: createdCategories?.find(c => c.name === 'Entretenimiento')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pendiente',
      is_recurring: 1,
      recurrence_frequency: 'monthly',
    },

    // Pagados (paid) - últimos días
    {
      user_id: userId,
      description: 'Café Starbucks',
      amount: 85,
      date: '2025-12-25',
      category_id: createdCategories?.find(c => c.name === 'Comida')?.id,
      payment_method_id: createdPaymentMethods?.[2]?.id, // Efectivo
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Gasolina',
      amount: 600,
      date: '2025-12-24',
      category_id: createdCategories?.find(c => c.name === 'Transporte')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Comida Restaurante',
      amount: 450,
      date: '2025-12-23',
      category_id: createdCategories?.find(c => c.name === 'Comida')?.id,
      payment_method_id: createdPaymentMethods?.[1]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Supermercado',
      amount: 1200,
      date: '2025-12-22',
      category_id: createdCategories?.find(c => c.name === 'Comida')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Cine',
      amount: 180,
      date: '2025-12-21',
      category_id: createdCategories?.find(c => c.name === 'Entretenimiento')?.id,
      payment_method_id: createdPaymentMethods?.[2]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Uber',
      amount: 120,
      date: '2025-12-20',
      category_id: createdCategories?.find(c => c.name === 'Transporte')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Farmacia',
      amount: 250,
      date: '2025-12-19',
      category_id: createdCategories?.find(c => c.name === 'Salud')?.id,
      payment_method_id: createdPaymentMethods?.[2]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Luz (CFE)',
      amount: 450,
      date: '2025-12-18',
      category_id: createdCategories?.find(c => c.name === 'Servicios')?.id,
      payment_method_id: createdPaymentMethods?.[0]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Libros Amazon',
      amount: 320,
      date: '2025-12-17',
      category_id: createdCategories?.find(c => c.name === 'Educación')?.id,
      payment_method_id: createdPaymentMethods?.[1]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
    {
      user_id: userId,
      description: 'Comida Rápida',
      amount: 95,
      date: '2025-12-16',
      category_id: createdCategories?.find(c => c.name === 'Comida')?.id,
      payment_method_id: createdPaymentMethods?.[2]?.id,
      payment_status: 'pagado',
      is_recurring: 0,
    },
  ];

  const { data: createdExpenses } = await supabase
    .from('expenses')
    .insert(expenses)
    .select();

  console.log(`✓ ${createdExpenses?.length || 0} gastos creados`);

  // 4. Crear ingresos
  console.log('\n💰 Creando 2 ingresos...');

  const incomes = [
    {
      user_id: userId,
      source: 'Salario Diciembre',
      amount: 25000,
      date: '2025-12-15',
      category: 'Salario',
      is_recurring: 1,
      recurrence_frequency: 'monthly',
    },
    {
      user_id: userId,
      source: 'Freelance Proyecto Web',
      amount: 5000,
      date: '2025-12-20',
      category: 'Freelance',
      is_recurring: 0,
    },
  ];

  const { data: createdIncomes } = await supabase
    .from('incomes')
    .insert(incomes)
    .select();

  console.log(`✓ ${createdIncomes?.length || 0} ingresos creados`);

  // Resumen
  console.log('\n✅ Seed completado exitosamente!');
  console.log('\n📊 Resumen:');
  console.log(`  • ${createdCategories?.length || 0} categorías`);
  console.log(`  • ${createdPaymentMethods?.length || 0} métodos de pago`);
  console.log(`  • ${createdExpenses?.length || 0} gastos`);
  console.log(`  • ${createdIncomes?.length || 0} ingresos`);
  console.log(`\n🎬 Listo para capturar screenshots!\n`);
}

seedDemoData().catch((error) => {
  console.error('\n❌ Error durante el seed:', error);
  process.exit(1);
});
