# Configuración de Roles de Usuario

Este documento explica cómo configurar los 7 tipos de usuarios en la base de datos de Supabase.

## Tipos de Usuarios

1. **admin** - Administrador (Nivel 0)
2. **editor** - Editor (Nivel 1.1)
3. **colaborador** - Colaborador (Nivel 1.2)
4. **editor_senior** - Editor Senior (Nivel 2.1)
5. **editor_junior** - Editor Junior (Nivel 2.2)
6. **colaborador_premium** - Colaborador Premium (Nivel 2.3)
7. **colaborador_basico** - Colaborador Básico (Nivel 2.4)

## Pasos para Configurar la Base de Datos

### 1. Agregar el campo `role` a la tabla `users`

Ejecuta el siguiente SQL en el editor SQL de Supabase:

```sql
-- Agregar columna 'role' a la tabla users si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'colaborador_basico';

-- Crear un índice para mejorar las consultas por rol
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Actualizar usuarios existentes (ajusta según tus necesidades)
-- Por defecto, los usuarios existentes serán 'colaborador_basico'
UPDATE users 
SET role = 'colaborador_basico' 
WHERE role IS NULL;

-- Asignar roles a usuarios específicos (ajusta los IDs según tus usuarios)
-- Ejemplo:
-- UPDATE users SET role = 'admin' WHERE id = 'tu-id-de-admin';
-- UPDATE users SET role = 'editor' WHERE id = 'tu-id-de-editor';
```

### 2. Configurar el Trigger para Asignar Rol por Defecto

**Nota:** Ya tienes triggers existentes (`update_posts_updated_at` y `update_users_updated_at`). El siguiente trigger no interferirá con ellos ya que se ejecuta en una tabla diferente (`auth.users`) y en un evento diferente (`AFTER INSERT`).

Si ya tienes un trigger que crea usuarios automáticamente desde `auth.users` a la tabla `users`, modifícalo para incluir el campo `role`. Si no tienes uno, crea el siguiente:

```sql
-- Función para crear usuario con rol por defecto
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador_basico')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    role = COALESCE(EXCLUDED.role, users.role);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar si el trigger ya existe antes de crearlo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
```

**Si ya tienes un trigger similar**, solo necesitas modificarlo para incluir el campo `role` en el INSERT. Por ejemplo, si tu función actual se llama diferente, actualízala así:

```sql
-- Ejemplo: Si tu función actual no incluye 'role', agrégalo
CREATE OR REPLACE FUNCTION public.tu_funcion_existente()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'colaborador_basico'), -- ✅ Agregar este campo
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, users.name),
    role = COALESCE(EXCLUDED.role, users.role), -- ✅ Agregar este campo
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Políticas de Seguridad (RLS) para la tabla `users`

Asegúrate de que las políticas de Row Level Security (RLS) permitan a los usuarios ver y actualizar su propio perfil:

```sql
-- Habilitar RLS en la tabla users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil (solo ciertos campos)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política: Los administradores pueden ver todos los usuarios
-- ⚠️ IMPORTANTE: Esta política causa recursión infinita si se usa directamente
-- Ejecuta FIX_USERS_RLS_RECURSION.sql para usar una versión corregida
CREATE POLICY "Admins can view all users"
ON users FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
```

**⚠️ PROBLEMA DE RECURSIÓN**: La política anterior puede causar recursión infinita. **Ejecuta el script `FIX_USERS_RLS_RECURSION.sql`** para corregir este problema usando una función helper.

### 3.1. Políticas Adicionales para Administradores ⚠️ **IMPORTANTE**

**CRÍTICO**: Para que los administradores puedan gestionar usuarios y cambiar roles, debes ejecutar el script `SETUP_ADMIN_RLS.sql` en el editor SQL de Supabase.

Este script agrega políticas que permiten a los administradores:
- Actualizar cualquier usuario (incluyendo cambiar roles)
- Ver todos los usuarios (ya incluido en la sección 3)

**Ejecuta `SETUP_ADMIN_RLS.sql` DESPUÉS de haber ejecutado la sección 3 de este documento.**

### 3.2. Políticas de Seguridad (RLS) para la tabla `posts` ⚠️ **IMPORTANTE**

**CRÍTICO**: Para que los permisos diferenciados por rol funcionen correctamente, debes configurar las políticas RLS en la tabla `posts`.

**⚠️ PROBLEMA COMÚN**: Si después de ejecutar `SETUP_POSTS_RLS.sql` no se muestran los posts, ejecuta el script `FIX_POSTS_VISIBILITY.sql` para corregir las políticas de visualización. 

**Ejecuta el script `SETUP_POSTS_RLS.sql` en el editor SQL de Supabase**, o ejecuta manualmente las políticas que implementan:

- **Admin**: Puede crear, editar y eliminar cualquier post
- **Editor**: Puede crear posts, editar y eliminar solo sus propios posts
- **Editor Senior**: Puede crear posts, editar cualquier post, pero eliminar solo sus propios
- **Editor Junior**: Puede crear y editar solo sus propios posts, **NO puede eliminar**
- **Colaboradores**: Solo lectura (pueden ver posts publicados)

**Nota**: Si tu tabla `posts` usa `user_id` en lugar de `author_id`, necesitarás ajustar las políticas en el script SQL.

## Notas Importantes

1. **Login Oculto**: El login oculto (desbloqueado con "admin 51" en el buscador) solo permite acceso a usuarios con roles: `admin`, `editor`, `editor_senior`, `editor_junior`.

2. **Login de Colaborador Premium**: El botón "¿Quieres ser colaborador premium?" permite registro e inicio de sesión solo para usuarios con rol `colaborador_premium`.

3. **Valores de Rol**: Los valores de rol deben coincidir exactamente con los especificados arriba (en minúsculas, con guiones bajos).

4. **Usuarios Existentes**: Si ya tienes usuarios en la base de datos, deberás actualizar manualmente sus roles según corresponda.

5. **Triggers de updated_at**: Si necesitas configurar o verificar los triggers que actualizan automáticamente el campo `updated_at` en las tablas `posts` y `users`, ejecuta el script `SETUP_TRIGGERS.sql` en el editor SQL de Supabase.

## Verificación

Para verificar que todo funciona correctamente:

1. Verifica que la columna `role` existe en la tabla `users`:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name = 'role';
```

2. Verifica que los usuarios tienen roles asignados:
```sql
SELECT id, email, name, role FROM users LIMIT 10;
```

3. Prueba el registro de un colaborador premium desde la interfaz.

## 4. Configurar Tabla de Favoritos

Para que los colaboradores premium puedan marcar películas como favoritas, necesitas crear la tabla `favorites`:

1. Ejecuta el script `SETUP_FAVORITES.sql` en el editor SQL de Supabase, o
2. Ejecuta manualmente el siguiente SQL:

```sql
-- Crear tabla de favoritos
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, post_id)
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_post_id ON public.favorites(post_id);

-- Habilitar RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "Users can view own favorites"
ON public.favorites FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
ON public.favorites FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
ON public.favorites FOR DELETE
USING (auth.uid() = user_id);
```

## 5. Funcionalidades Implementadas para Colaborador Premium

Una vez configurado todo, los colaboradores premium tendrán acceso a:

1. ✅ **Sistema de Favoritos**: Pueden marcar y desmarcar películas como favoritas
2. ✅ **Vista de Favoritos**: Pueden ver todas sus películas favoritas en una sección dedicada
3. ✅ **Compartir en Redes Sociales**: Botones para compartir en Twitter, Facebook e Instagram (ya implementado)
4. ✅ **Búsqueda Básica**: Búsqueda por título y director (mejorable a avanzada)
5. ⏳ **Notificaciones**: Sistema básico de notificaciones (pendiente de implementación completa)
6. ⏳ **Contenido Exclusivo**: Requiere campo `is_premium` en posts (pendiente)

