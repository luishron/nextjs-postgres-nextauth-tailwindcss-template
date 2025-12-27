-- ============================================================================
-- MIGRACIÓN: User Profiles + Magic Links Support
-- Fecha: 26 de Diciembre, 2025
-- Descripción: Agrega tabla user_profiles para roles, onboarding y preferencias
-- ============================================================================

-- IMPORTANTE: Ejecuta este script en Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Pega este contenido → Run

-- ============================================================================
-- 1. CREAR TABLA user_profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'premium')),
  plan_expires_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  preferences JSONB NOT NULL DEFAULT '{"currency":"USD","theme":"system"}'::jsonb,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. CREAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_role
  ON user_profiles(role);

CREATE INDEX IF NOT EXISTS idx_user_profiles_onboarding
  ON user_profiles(onboarding_completed);

-- ============================================================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Política: Los usuarios solo pueden actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Los usuarios solo pueden insertar su propio perfil
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 4. TRIGGER: Auto-crear perfil cuando un usuario se registra
-- ============================================================================

-- Función que crea el perfil automáticamente
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, role, onboarding_completed)
  VALUES (NEW.id, 'free', false)
  ON CONFLICT (id) DO NOTHING;  -- Evitar duplicados
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función al crear un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- ============================================================================
-- 5. CREAR PERFILES PARA USUARIOS EXISTENTES (si los hay)
-- ============================================================================

-- Esto crea perfiles para cualquier usuario que ya exista en auth.users
-- pero que aún no tenga un perfil
INSERT INTO user_profiles (id, role, onboarding_completed)
SELECT
  id,
  'free',
  false
FROM auth.users
WHERE id NOT IN (SELECT id FROM user_profiles)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. VERIFICACIÓN: Confirmar que todo está correcto
-- ============================================================================

-- Mostrar tabla creada
SELECT 'user_profiles table created' AS status;

-- Contar usuarios y perfiles
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM user_profiles) AS total_profiles;

-- Mostrar perfiles creados
SELECT id, role, onboarding_completed, full_name, created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- ============================================================================
-- FIN DE LA MIGRACIÓN
-- ============================================================================
-- Si ves los resultados arriba sin errores, ¡la migración fue exitosa! ✅
