-- Script SQL para corregir la recursión infinita en las políticas RLS de users
-- Ejecuta este script en el editor SQL de Supabase para solucionar el error

-- ============================================
-- PROBLEMA: Recursión infinita en políticas RLS
-- ============================================
-- El error "infinite recursion detected in policy for relation 'users'" ocurre
-- cuando una política consulta la misma tabla que está protegiendo.
-- 
-- SOLUCIÓN: Usar funciones SECURITY DEFINER o verificar el rol de otra manera

-- ============================================
-- 1. ELIMINAR POLÍTICAS PROBLEMÁTICAS
-- ============================================

-- Eliminar todas las políticas existentes de users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can update any user" ON public.users;

-- ============================================
-- 2. CREAR FUNCIÓN HELPER PARA VERIFICAR ROL
-- ============================================

-- Función que obtiene el rol del usuario actual sin causar recursión
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  -- Esta función usa SECURITY DEFINER para evitar recursión
  RETURN (
    SELECT role 
    FROM public.users 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- 3. CREAR POLÍTICAS CORREGIDAS
-- ============================================

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política: Los administradores pueden ver todos los usuarios
-- Usa la función helper para evitar recursión
CREATE POLICY "Admins can view all users"
ON public.users FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Política: Los administradores pueden actualizar cualquier usuario
-- Usa la función helper para evitar recursión
CREATE POLICY "Admins can update any user"
ON public.users FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'admin'
)
WITH CHECK (
  public.get_user_role(auth.uid()) = 'admin'
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que las políticas están creadas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'users';

-- ============================================
-- NOTAS:
-- ============================================
-- 1. La función get_user_role usa SECURITY DEFINER para evitar recursión
-- 2. STABLE indica que la función no modifica datos y puede ser optimizada
-- 3. Después de ejecutar esto, recarga la página y los errores deberían desaparecer
-- 4. Si aún hay problemas, verifica que la función se creó correctamente:
--    SELECT public.get_user_role('tu-user-id-aqui');

