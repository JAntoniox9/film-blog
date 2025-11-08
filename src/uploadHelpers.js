// src/uploadHelpers.js

import { supabase } from './supabaseClient';

/**
 * Subir imagen a Supabase Storage
 */
export async function uploadImage(file) {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('El archivo debe ser una imagen');
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no debe superar 5MB');
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir a Supabase
    const { error } = await supabase.storage
      .from('movie-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('movie-images')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      error: null,
    };
  } catch (err) {
    return {
      url: null,
      path: null,
      error: err.message,
    };
  }
}

/**
 * Subir audio a Supabase Storage
 */
export async function uploadAudio(file) {
  try {
    // Validar tipo de archivo
    if (!file.type.startsWith('audio/')) {
      throw new Error('El archivo debe ser de audio');
    }

    // Validar tamaño (máximo 20MB)
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('El audio no debe superar 20MB');
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir a Supabase
    const { error } = await supabase.storage
      .from('movie-audio')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('movie-audio')
      .getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
      error: null,
    };
  } catch (err) {
    return {
      url: null,
      path: null,
      error: err.message,
    };
  }
}

/**
 * Eliminar archivo de Storage
 */
export async function deleteFile(bucket, path) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}

/**
 * Formatear tamaño de archivo
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];

}