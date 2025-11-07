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

  return { users, loading, fetchUsers };
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

  // ✅ FUNCIÓN DE LOGIN ACTUALIZADA
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
    
    // Devolvemos el perfil del usuario (de tu tabla) y la sesión.
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

  // ✅ FUNCIÓN DE LOGOUT (sin cambios, ya era correcta)
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Exponemos las funciones para que la app las pueda usar
  return { session, loading, login, logout, signUp };
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