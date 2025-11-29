-- Script SQL para configurar las políticas RLS (Row Level Security) de la tabla posts
-- Ejecuta este script en el editor SQL de Supabase
-- IMPORTANTE: Este script implementa los permisos diferenciados por rol

-- ============================================
-- 1. HABILITAR RLS EN LA TABLA POSTS
-- ============================================
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. ELIMINAR POLÍTICAS EXISTENTES (si las hay)
-- ============================================
-- Ejecuta esto primero si ya tienes políticas en la tabla posts
-- DROP POLICY IF EXISTS "Anyone can view published posts" ON public.posts;
-- DROP POLICY IF EXISTS "Users can create posts" ON public.posts;
-- DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;
-- DROP POLICY IF EXISTS "Users can delete own posts" ON public.posts;

-- ============================================
-- 3. POLÍTICAS DE LECTURA (SELECT)
-- ============================================

-- Política: Cualquiera puede ver posts (lectura pública)
-- Los usuarios autenticados pueden ver todos los posts
-- Los usuarios no autenticados también pueden ver posts (lectura pública)
-- Esta política permite acceso completo de lectura sin restricciones
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

CREATE POLICY "Anyone can view posts"
ON public.posts FOR SELECT
USING (true)
WITH CHECK (true);

-- ============================================
-- 4. POLÍTICAS DE CREACIÓN (INSERT)
-- ============================================

-- Política: Solo admin, editor, editor_senior y editor_junior pueden crear posts
CREATE POLICY "Editors can create posts"
ON public.posts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'editor', 'editor_senior', 'editor_junior')
  )
  AND author_id = auth.uid() -- El autor debe ser el usuario autenticado
);

-- ============================================
-- 5. POLÍTICAS DE ACTUALIZACIÓN (UPDATE)
-- ============================================

-- Política: Admin puede editar cualquier post
CREATE POLICY "Admin can update any post"
ON public.posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Editor Senior puede editar cualquier post
CREATE POLICY "Editor Senior can update any post"
ON public.posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor_senior'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor_senior'
  )
);

-- Política: Editor puede editar solo sus propios posts
CREATE POLICY "Editor can update own posts"
ON public.posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor'
  )
  AND author_id = auth.uid()
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor'
  )
  AND author_id = auth.uid()
);

-- Política: Editor Junior puede editar solo sus propios posts
CREATE POLICY "Editor Junior can update own posts"
ON public.posts FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor_junior'
  )
  AND author_id = auth.uid()
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor_junior'
  )
  AND author_id = auth.uid()
);

-- ============================================
-- 6. POLÍTICAS DE ELIMINACIÓN (DELETE)
-- ============================================

-- Política: Admin puede eliminar cualquier post
CREATE POLICY "Admin can delete any post"
ON public.posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'admin'
  )
);

-- Política: Editor Senior puede eliminar solo sus propios posts
CREATE POLICY "Editor Senior can delete own posts"
ON public.posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor_senior'
  )
  AND author_id = auth.uid()
);

-- Política: Editor puede eliminar solo sus propios posts
CREATE POLICY "Editor can delete own posts"
ON public.posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'editor'
  )
  AND author_id = auth.uid()
);

-- NOTA: Editor Junior NO puede eliminar posts (no hay política para ellos)

-- ============================================
-- 7. VERIFICACIÓN
-- ============================================

-- Verificar que las políticas están creadas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'posts';

-- ============================================
-- NOTAS IMPORTANTES:
-- ============================================
-- 1. Asegúrate de que la tabla posts tenga la columna 'author_id' 
--    (el código usa 'author_id', si tu tabla usa 'user_id', reemplázalo en todas las políticas)
-- 2. La política de SELECT permite lectura pública (todos pueden ver posts)
-- 3. Si quieres restringir la lectura solo a posts publicados, agrega una condición con 'draft = false'
-- 4. Los colaboradores (premium y básico) solo pueden leer posts, no crear, editar ni eliminar
-- 5. Editor Junior NO puede eliminar posts (no hay política DELETE para ese rol)
-- 6. Después de ejecutar este script, verifica que las políticas funcionan correctamente probando
--    crear, editar y eliminar posts con diferentes roles de usuario

