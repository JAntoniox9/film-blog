// hooks/useSupabase.js
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient'; 

// Hook para gestionar usuarios (no necesita cambios)
export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId, newRole) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de usuarios
      await fetchUsers();
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user role:', error);
      return { data: null, error: error.message };
    }
  };

  return { users, loading, fetchUsers, updateUserRole };
}

// ✅ SECCIÓN MODIFICADA
// Hook para gestionar la autenticación
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Este useEffect obtiene la sesión actual y escucha los cambios
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ FUNCIÓN DE LOGIN ACTUALIZADA - Solo para admin y editores
  const login = async (email, password) => {
    // Usamos la función nativa de Supabase para iniciar sesión.
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    
    // Después del login exitoso, obtenemos el perfil de nuestra tabla 'users'
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);
    
    // ✅ Verificar que el usuario sea admin o editor
    const allowedRoles = ['admin', 'editor', 'editor_senior', 'editor_junior'];
    const userRole = userProfile.role || 'colaborador_basico'; // Rol por defecto
    if (!allowedRoles.includes(userRole)) {
      await supabase.auth.signOut();
      throw new Error('Acceso denegado. Este login es solo para administradores y editores.');
    }
    
    // Devolvemos el perfil del usuario (de tu tabla) y la sesión.
    return { user: userProfile, session: data.session };
  };

  // ✅ FUNCIÓN DE LOGIN PARA LECTOR PREMIUM
  const loginPremium = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) throw new Error(error.message);
    
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw new Error(profileError.message);
    
    // ✅ Verificar que el usuario sea lector premium
    if (!userProfile.role || userProfile.role !== 'colaborador_premium') {
      await supabase.auth.signOut();
      throw new Error('Acceso denegado. Este login es solo para lectores premium.');
    }
    
    return { user: userProfile, session: data.session };
  };

  // ✅ FUNCIÓN DE REGISTRO (NUEVA Y RECOMENDADA)
  const signUp = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // 'options.data' es donde pasamos la información extra
      // que nuestro trigger usará (en este caso, el 'name').
      options: {
        data: {
          name: name 
        }
      }
    });
    if (error) throw new Error(error.message);
    return { user: data.user };
  };

  // ✅ FUNCIÓN DE REGISTRO PARA LECTOR PREMIUM
  const signUpPremium = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
          role: 'colaborador_premium' // Asignar rol de lector premium (mantiene el nombre técnico en BD)
        }
      }
    });
    if (error) throw new Error(error.message);
    
    // Esperar un momento para que el trigger cree el usuario en la tabla users
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Si el registro fue exitoso, actualizar el rol en la tabla users
    if (data.user) {
      // Primero intentar actualizar si el usuario ya existe
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: 'colaborador_premium' })
        .eq('id', data.user.id);
      
      // Si no existe, crear el usuario con el rol
      if (updateError && updateError.code === 'PGRST116') {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            name: name,
            email: email,
            role: 'colaborador_premium'
          });
        
        if (insertError) {
          console.error('Error creando usuario:', insertError);
          throw new Error('Error al crear el perfil de usuario');
        }
      } else if (updateError) {
        console.error('Error actualizando rol:', updateError);
        throw new Error('Error al actualizar el perfil de usuario');
      }
    }
    
    return { user: data.user };
  };

  // ✅ FUNCIÓN DE LOGOUT (sin cambios, ya era correcta)
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Exponemos las funciones para que la app las pueda usar
  return { session, loading, login, logout, signUp, loginPremium, signUpPremium };
}

// Hook para gestionar posts (sin cambios)
export function usePosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users(name)
        `);

      if (error) throw error;

      const formattedData = data.map(p => ({
        ...p,
        authorName: p.users ? p.users.name : 'Desconocido',
      }));
      setPosts(formattedData || []);

    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    const subscription = supabase.channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
        fetchPosts(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchPosts]);

  const createPost = async (postData) => {
    const { data, error } = await supabase.from('posts').insert([postData]).select();
    return { data, error: error?.message };
  };

  const updatePost = async (id, postData) => {
    const {
      users,
      authorName,
      ...validPostData 
    } = postData;

    const { data, error } = await supabase
      .from('posts')
      .update(validPostData)
      .eq('id', id)
      .select();
      
    return { data, error: error?.message };
  };

  const deletePost = async (id) => {
    const { data, error } = await supabase.from('posts').delete().eq('id', id);
    return { data, error: error?.message };
  };

  return { posts, loading, createPost, updatePost, deletePost };
}

// Hook para settings (sin cambios)
export function useSettings() {
    const [settings, setSettings] = useState({ title: "25 Grandes Películas", subtitle: "De Ciencia Ficción y Tecnología" });
    const [loading, setLoading] = useState(false);

    const updateSettings = (newSettings) => {
        setLoading(true);
        setSettings(prev => ({...prev, ...newSettings}));
        setTimeout(() => setLoading(false), 300);
    };

    return { settings, loading, updateSettings };
}

// ✅ NUEVO: Hook para gestionar favoritos
export function useFavorites(userId) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritePostIds, setFavoritePostIds] = useState(new Set());

  const fetchFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      setFavoritePostIds(new Set());
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          posts(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const favoritesList = data || [];
      setFavorites(favoritesList);
      setFavoritePostIds(new Set(favoritesList.map(f => f.post_id)));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
      setFavoritePostIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFavorites();

    // Suscripción en tiempo real a cambios en favoritos
    if (userId) {
      const subscription = supabase.channel('public:favorites')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'favorites',
            filter: `user_id=eq.${userId}`
          }, 
          () => {
            fetchFavorites();
          })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [fetchFavorites, userId]);

  const addFavorite = async (postId) => {
    if (!userId) throw new Error('Debes estar autenticado para agregar favoritos');
    
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, post_id: postId }])
      .select();

    if (error) {
      // Si ya existe, no es un error crítico
      if (error.code !== '23505') {
        throw new Error(error.message);
      }
    } else if (data && data.length > 0) {
      setFavoritePostIds(prev => new Set([...prev, postId]));
    }
  };

  const removeFavorite = async (postId) => {
    if (!userId) throw new Error('Debes estar autenticado para eliminar favoritos');
    
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) throw new Error(error.message);
    
    setFavoritePostIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(postId);
      return newSet;
    });
  };

  const toggleFavorite = async (postId) => {
    if (favoritePostIds.has(postId)) {
      await removeFavorite(postId);
    } else {
      await addFavorite(postId);
    }
  };

  const isFavorite = (postId) => {
    return favoritePostIds.has(postId);
  };

  return { 
    favorites, 
    loading, 
    favoritePostIds,
    addFavorite, 
    removeFavorite, 
    toggleFavorite, 
    isFavorite,
    fetchFavorites 
  };
}