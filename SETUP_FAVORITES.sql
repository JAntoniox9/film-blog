-- Script SQL para crear la tabla de favoritos
-- Ejecuta este script en el editor SQL de Supabase

-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id) -- Evitar duplicados
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_post_id ON public.favorites(post_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON public.favorites(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios favoritos
CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden agregar sus propios favoritos
CREATE POLICY "Users can insert own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propios favoritos
CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);

-- Comentarios para documentación
COMMENT ON TABLE public.favorites IS 'Tabla para almacenar las películas favoritas de los colaboradores premium';
COMMENT ON COLUMN public.favorites.user_id IS 'ID del usuario que marcó como favorito';
COMMENT ON COLUMN public.favorites.post_id IS 'ID del post (película) marcado como favorito';
COMMENT ON COLUMN public.favorites.created_at IS 'Fecha y hora en que se marcó como favorito';

