-- Script SQL para solucionar el problema de visibilidad de posts
-- Ejecuta este script en el editor SQL de Supabase si no se muestran los posts

-- ============================================
-- SOLUCIÓN RÁPIDA: Verificar y corregir políticas
-- ============================================

-- 1. Verificar que RLS está habilitado
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar todas las políticas existentes de SELECT (si hay conflictos)
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Users can view posts" ON public.posts;

-- 3. Crear una política simple que permita ver todos los posts
CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
USING (true);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar que la política está creada:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd
-- FROM pg_policies
-- WHERE tablename = 'posts' AND cmd = 'SELECT';

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Esta política permite que CUALQUIERA (autenticado o no) pueda ver todos los posts
-- 2. Si después de ejecutar esto aún no ves los posts, verifica:
--    - Que la tabla 'posts' existe y tiene datos
--    - Que no hay errores en la consola del navegador
--    - Que la conexión a Supabase está funcionando
-- 3. Si el problema persiste, puede ser un problema de autenticación en el cliente
--    En ese caso, verifica que el cliente de Supabase esté configurado correctamente

