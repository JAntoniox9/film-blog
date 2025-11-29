-- Script SQL para configurar los triggers de actualización automática
-- Ejecuta este script en el editor SQL de Supabase

-- ============================================
-- 1. TRIGGER PARA ACTUALIZAR updated_at EN POSTS
-- ============================================

-- Función que actualiza el campo updated_at
CREATE OR REPLACE FUNCTION public.update_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;

CREATE TRIGGER update_posts_updated_at
   BEFORE UPDATE ON public.posts
   FOR EACH ROW
   EXECUTE FUNCTION public.update_posts_updated_at();

-- ============================================
-- 2. TRIGGER PARA ACTUALIZAR updated_at EN USERS
-- ============================================

-- Función que actualiza el campo updated_at en users
CREATE OR REPLACE FUNCTION public.update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger si no existe
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;

CREATE TRIGGER update_users_updated_at
   BEFORE UPDATE ON public.users
   FOR EACH ROW
   EXECUTE FUNCTION public.update_users_updated_at();

-- ============================================
-- NOTAS:
-- ============================================
-- 1. Estos triggers se ejecutan automáticamente antes de cada UPDATE
-- 2. No necesitan modificaciones relacionadas con roles
-- 3. El trigger de posts actualiza updated_at cada vez que se modifica un post
-- 4. El trigger de users actualiza updated_at cada vez que se modifica un usuario
-- 5. Asegúrate de que las tablas tengan la columna updated_at:
--    - ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
--    - ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

