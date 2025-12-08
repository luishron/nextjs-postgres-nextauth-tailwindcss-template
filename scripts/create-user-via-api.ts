// Crear usuario usando la API de Supabase (genera hash correcto)
// Ejecuta: npx tsx scripts/create-user-via-api.ts

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Cargar variables de entorno desde .env (no .env.local)
config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: SUPABASE_URL y SUPABASE_ANON_KEY son requeridos');
  console.error('Verifica que tu archivo .env tenga estas variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createUser() {
  const email = 'luishron@gmail.com';
  const password = 'Anna1985**';

  console.log('🔍 Creando usuario en Supabase...');
  console.log('URL:', supabaseUrl);
  console.log('Email:', email);

  // Primero eliminar el usuario si existe (requiere Service Role Key)
  console.log('\n⚠️  Nota: Si el usuario ya existe, obtendrás un error.');
  console.log('Primero elimínalo manualmente desde el Dashboard de Supabase:');
  console.log('Authentication → Users → Busca el email → Delete user\n');

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined, // No enviar email de confirmación
      data: {}
    }
  });

  if (error) {
    console.error('❌ Error al crear usuario:', error.message);
    console.error('Detalles:', error);

    if (error.message.includes('already registered')) {
      console.log('\n💡 El usuario ya existe. Opciones:');
      console.log('1. Usa el password actual del usuario');
      console.log('2. Elimina el usuario desde Supabase Dashboard y vuelve a ejecutar este script');
      console.log('3. Usa "Forgot Password" para resetear la contraseña');
    }

    return;
  }

  console.log('✅ Usuario creado exitosamente!');
  console.log('User ID:', data.user?.id);
  console.log('Email:', data.user?.email);
  console.log('Email confirmado:', data.user?.email_confirmed_at ? 'Sí' : 'No');

  console.log('\n🎯 Ahora puedes hacer login con:');
  console.log('Email:', email);
  console.log('Password:', password);
}

createUser().catch(console.error);
