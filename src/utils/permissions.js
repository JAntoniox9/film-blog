// Utilidades para verificar permisos según el rol del usuario

/**
 * Verifica si un usuario puede crear posts
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export function canCreatePost(role) {
  const allowedRoles = ['admin', 'editor', 'editor_senior', 'editor_junior'];
  return allowedRoles.includes(role);
}

/**
 * Verifica si un usuario puede editar un post específico
 * @param {string} role - Rol del usuario
 * @param {string} userId - ID del usuario actual
 * @param {object} post - Post a editar
 * @returns {boolean}
 */
export function canEditPost(role, userId, post) {
  if (!role || !userId || !post) return false;
  
  // Admin puede editar cualquier post
  if (role === 'admin') return true;
  
  // Editor Senior puede editar cualquier post
  if (role === 'editor_senior') return true;
  
  // Editor puede editar solo sus propios posts
  if (role === 'editor') {
    return post.user_id === userId || post.author_id === userId;
  }
  
  // Editor Junior puede editar solo sus propios posts
  if (role === 'editor_junior') {
    return post.user_id === userId || post.author_id === userId;
  }
  
  return false;
}

/**
 * Verifica si un usuario puede eliminar un post específico
 * @param {string} role - Rol del usuario
 * @param {string} userId - ID del usuario actual
 * @param {object} post - Post a eliminar
 * @returns {boolean}
 */
export function canDeletePost(role, userId, post) {
  if (!role || !userId || !post) return false;
  
  // Admin puede eliminar cualquier post
  if (role === 'admin') return true;
  
  // Editor Senior puede eliminar solo sus propios posts
  if (role === 'editor_senior') {
    return post.user_id === userId || post.author_id === userId;
  }
  
  // Editor puede eliminar solo sus propios posts
  if (role === 'editor') {
    return post.user_id === userId || post.author_id === userId;
  }
  
  // Editor Junior NO puede eliminar posts
  if (role === 'editor_junior') {
    return false;
  }
  
  return false;
}

/**
 * Verifica si un usuario puede ver el formulario de creación/edición
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export function canAccessPostForm(role) {
  return canCreatePost(role);
}

/**
 * Verifica si un usuario puede gestionar usuarios (solo admin)
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export function canManageUsers(role) {
  return role === 'admin';
}

/**
 * Verifica si un usuario puede ver estadísticas avanzadas
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export function canViewAdvancedStats(role) {
  return ['admin', 'editor_senior'].includes(role);
}

/**
 * Verifica si un usuario puede moderar contenido
 * @param {string} role - Rol del usuario
 * @returns {boolean}
 */
export function canModerateContent(role) {
  return ['admin', 'editor_senior'].includes(role);
}

