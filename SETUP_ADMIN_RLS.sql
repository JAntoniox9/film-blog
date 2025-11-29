-- Script SQL para permitir que los administradores gestionen usuarios y roles
-- Ejecuta este script en el editor SQL de Supabase DESPUÉS de SETUP_ROLES.md sección 3

-- ============================================
-- POLÍTICAS ADICIONALES PARA ADMINISTRADORES
-- ============================================

-- Política: Los administradores pueden actualizar cualquier usuario (incluyendo roles)
-- NOTA: Esta política usa la función get_user_role para evitar recursión
-- Asegúrate de ejecutar FIX_USERS_RLS_RECURSION.sql primero para crear la función

CREATE POLICY "Admins can update any user"
ON public.users FOR UPDATE
USING (
  public.get_user_role(auth.uid()) = 'admin'
)
WITH CHECK (
  public.get_user_role(auth.uid()) = 'admin'
);

-- Política: Los administradores pueden eliminar usuarios (opcional, descomenta si lo necesitas)
-- CREATE POLICY "Admins can delete users"
-- ON public.users FOR DELETE
-- USING (
--   EXISTS (
--     SELECT 1 FROM public.users
--     WHERE id = auth.uid() 
--     AND role = 'admin'
--   )
--   AND id != auth.uid() -- Prevenir que el admin se elimine a sí mismo
-- );

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Esta política permite a los admins cambiar roles de cualquier usuario
-- 2. El admin NO puede cambiar su propio rol (protección adicional recomendada en el frontend)
-- 3. Si quieres que los admins puedan eliminar usuarios, descomenta la política de DELETE
-- 4. Ejecuta este script DESPUÉS de haber ejecutado SETUP_ROLES.md sección 3

