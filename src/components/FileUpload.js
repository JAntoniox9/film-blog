// src/components/FileUpload.js

import React, { useState, useRef } from 'react';
import { uploadImage, uploadAudio } from '../uploadHelpers';

export function FileUpload({ type = 'image', onUpload, currentUrl, label }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentUrl || '');
  const fileInputRef = useRef(null);

  const isImage = type === 'image';
  const accept = isImage 
    ? 'image/jpeg,image/png,image/webp,image/jpg' 
    : 'audio/mpeg,audio/mp3,audio/wav,audio/m4a';
  
  const maxSize = isImage ? '5MB' : '20MB';
  const icon = isImage ? '🖼️' : '🎵';

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Simular progreso
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 100);

    // Subir archivo
    const uploadFn = isImage ? uploadImage : uploadAudio;
    const { url, error } = await uploadFn(file);

    clearInterval(progressInterval);
    setProgress(100);

    if (error) {
      alert(`Error: ${error}`);
      setUploading(false);
      setProgress(0);
      return;
    }

    // Preview
    setPreview(url);

    // Callback
    onUpload(url);
    
    setTimeout(() => {
      setUploading(false);
      setProgress(0);
    }, 500);
  };

  const handleRemove = () => {
    setPreview('');
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm mb-2">
        <span className="text-[#a9b4c6] font-medium flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          {label || (isImage ? 'Imagen' : 'Audio')}
          <span className="text-[10px] sm:text-xs text-[#8fa1bb]">(máx. {maxSize})</span>
        </span>
      </label>

      {/* Preview de imagen */}
      {isImage && preview && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-[#243247]">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all"
          >
            ✕
          </button>
        </div>
      )}

      {/* Preview de audio */}
      {!isImage && preview && (
        <div className="relative bg-[#0f1520] rounded-lg p-3 border border-[#243247]">
          <audio src={preview} controls className="w-full" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs transition-all"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input de archivo */}
      {!preview && (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id={`file-upload-${type}-${label}`}
          />
          <label
            htmlFor={`file-upload-${type}-${label}`}
            className={`
              flex flex-col items-center justify-center 
              w-full h-32 
              border-2 border-dashed rounded-xl
              cursor-pointer
              transition-all duration-300
              ${uploading 
                ? 'border-blue-500 bg-blue-500/10' 
                : 'border-[#243247] hover:border-[#2f4257] bg-[#0f1520]/50 hover:bg-[#1a1f2e]/50'
              }
            `}
          >
            {uploading ? (
              <>
                <div className="text-3xl mb-2 animate-pulse">⏳</div>
                <div className="text-sm text-blue-400 font-semibold">Subiendo... {progress}%</div>
                <div className="w-32 h-1 bg-[#0f1520] rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-sm text-[#a9b4c6]">
                  <span className="text-blue-400 font-semibold">Click para seleccionar</span>
                  <span className="hidden sm:inline"> o arrastra aquí</span>
                </div>
                <div className="text-xs text-[#8fa1bb] mt-1">
                  {isImage ? 'JPG, PNG, WebP' : 'MP3, WAV, M4A'} (máx. {maxSize})
                </div>
              </>
            )}
          </label>
        </div>
      )}

      {/* Opción de URL manual */}
      <details className="mt-2">
        <summary className="text-xs text-[#8fa1bb] cursor-pointer hover:text-blue-400 transition-colors">
          ¿Prefieres usar una URL? Click aquí
        </summary>
        <input
          type="url"
          placeholder={`https://ejemplo.com/${isImage ? 'imagen.jpg' : 'audio.mp3'}`}
          value={preview}
          onChange={(e) => {
            setPreview(e.target.value);
            onUpload(e.target.value);
          }}
          className="w-full mt-2 bg-[#0f1520] border border-[#243247] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
        />
      </details>
    </div>
  );
}