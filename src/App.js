// App MEJORADA Y TOTALMENTE RESPONSIVE con funcionalidad de EDICIÓN
// Optimizada para móviles, tablets y desktop
// ✅ MODIFICADO PARA LOGIN OCULTO CON "admin 51" EN EL BUSCADOR
// ✅ INTEGRADO: Header, Footer, Modals de Autores y Acerca de

import { v4 as uuidv4 } from 'uuid';
import React, { useMemo, useState, useEffect, createContext, useContext, useRef } from "react";
import { useUsers as useSupabaseUsers, useAuth as useSupabaseAuth, usePosts as useSupabasePosts, useFavorites } from './hooks/useSupabase';
import { FileUpload } from './components/FileUpload';
import ClapperModelViewer from './ClapperModel';
import { FaThreads, FaFacebook, FaInstagram } from "react-icons/fa6";
import { canCreatePost, canEditPost, canDeletePost, canAccessPostForm } from './utils/permissions';


/*************************** Utilidades ***************************/
const LS_KEYS = {
  USERS: "filmblog_users_v1",
  SESSION: "filmblog_session_v1",
  POSTS: "filmblog_posts_v1",
  SETTINGS: "filmblog_settings_v1",
};

// ✅ Añadimos la lista de plataformas
const STREAMING_PLATFORMS = ["Netflix", "Max", "Prime Video", "Disney+", "Apple TV+", "Star+", "Paramount+", "Vix", "YouTube", "Otro"];

const CATEGORIES = ["Ciencia Ficción", "Tecnología"];

function fmtDateTime(d) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeStyle: "short" }).format(d);
}

/*************************** Contexto de Auth ***************************/
const AuthCtx = createContext(null);
function useAuth(){ return useContext(AuthCtx); }

function AuthProvider({children}){
  // ✅ Usar hooks de Supabase
  const { users, loading: usersLoading, updateUserRole } = useSupabaseUsers();
  const { login: supabaseLogin, loginPremium: supabaseLoginPremium, signUpPremium: supabaseSignUpPremium } = useSupabaseAuth();
  
  // Mantener sesión en localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = localStorage.getItem(LS_KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem(LS_KEYS.SESSION, JSON.stringify(currentUser));
    else localStorage.removeItem(LS_KEYS.SESSION);
  }, [currentUser]);

  // Login con Supabase (solo para admin y editores)
  const login = async (idOrEmail, password) => {
    const { user, error } = await supabaseLogin(idOrEmail, password);
    if (error) throw new Error(error);
    setCurrentUser(user);
  };

  // ✅ Login para lector premium
  const loginPremium = async (email, password) => {
    const { user, error } = await supabaseLoginPremium(email, password);
    if (error) throw new Error(error);
    setCurrentUser(user);
  };

  // ✅ Registro para lector premium
  const signUpPremium = async (email, password, name) => {
    const { user, error } = await supabaseSignUpPremium(email, password, name);
    if (error) throw new Error(error);
    // No hacer login automático, el usuario debe confirmar su correo primero
    return { user };
  };
  
  const logout = () => setCurrentUser(null);

  // Mostrar loading mientras carga usuarios
  if (usersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a0f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⏳</div>
          <p className="text-lg text-[#e6edf6]">Cargando Recomendaciones ....</p>
        </div>
      </div>
    );
  }

  return (
    <AuthCtx.Provider value={{users, currentUser, login, logout, loginPremium, signUpPremium, updateUserRole}}>
      {children}
    </AuthCtx.Provider>
  );
}


/*************************** Componentes UI RESPONSIVE ***************************/
function Page({children}){
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a0f1f] text-[#e6edf6] relative overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 opacity-10 sm:opacity-20 md:opacity-30 pointer-events-none">
        <div className="absolute top-5 sm:top-10 md:top-20 left-2 sm:left-5 md:left-10 w-32 sm:w-40 md:w-72 h-32 sm:h-40 md:h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 sm:bottom-10 md:bottom-20 right-2 sm:right-5 md:right-10 w-48 sm:w-56 md:w-96 h-48 sm:h-56 md:h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-32 sm:w-40 md:w-64 h-32 sm:h-40 md:h-64 bg-cyan-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="flex-1 w-full relative z-10">
        {children}
      </div>
    </div>
  );
}

function Card({children, className = ""}){
  return (
    <div className={`bg-gradient-to-br from-[#111821]/90 to-[#1a1f2e]/90 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 border border-[#1c2735]/50 hover:border-[#2a3a50]/80 transition-all duration-300 hover:shadow-blue-900/20 hover:shadow-xl ${className}`}>
      {children}
    </div>
  );
}

function Badge({children, variant = "default"}){
  const variants = {
    default: "bg-gradient-to-r from-[#1c2735] to-[#243247] border-[#2a3a50]",
    primary: "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 text-blue-300",
    category: "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50 text-cyan-300"
  };
  return (
    <span className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border backdrop-blur-sm ${variants[variant]}`}>
      {children}
    </span>
  );
}

// Este es el botón PRINCIPAL de la app (Formularios, etc)
function Button({children, onClick, type="button", variant="primary", disabled, icon, className=""}){
  const base = "px-3 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 flex items-center gap-1 sm:gap-2 justify-center shadow-lg hover:scale-105";
  const styles = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-blue-900/50 hover:shadow-blue-800/60 hover:shadow-xl",
    ghost: "bg-gradient-to-r from-[#0f1520]/80 to-[#1a1f2e]/80 hover:from-[#1a2030] hover:to-[#202838] border border-[#243247] hover:border-[#2f4257] backdrop-blur-sm",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-red-900/50 hover:shadow-red-800/60",
    subtle: "bg-gradient-to-r from-[#1c2735] to-[#223149] hover:from-[#223149] hover:to-[#2a3a50] shadow-md",
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {icon && <span className="text-base sm:text-lg">{icon}</span>}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

// ✅ NUEVO: Botón específico para el Header (Renombrado para evitar conflicto)
function NavButton({ variant = "solid", icon, className = "", children, onClick }) {
  const base =
    "inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-blue-500";
  const styles =
    variant === "ghost"
      ? "bg-transparent border-transparent hover:bg-white/5"
      : "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500/40 hover:opacity-90";
  return (
    <button onClick={onClick} className={`${base} ${styles} ${className}`}>
      {icon ? <span className="text-lg leading-none">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

function Input({label, icon, ...props}){
  const [focused, setFocused] = useState(false);
  return (
    <label className="block text-xs sm:text-sm mb-2 sm:mb-3 group">
      <span className={`block mb-1 sm:mb-2 text-[#a9b4c6] font-medium transition-colors ${focused ? 'text-blue-400' : ''}`}>
        {icon && <span className="mr-1 sm:mr-2">{icon}</span>}
        {label}
      </span>
      <div className="relative">
        <input 
          {...props} 
          onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
          className={`w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none transition-all duration-300 text-sm ${
            focused 
              ? 'border-blue-500 shadow-lg shadow-blue-900/30 ring-2 ring-blue-600/20' 
              : 'border-[#243247] hover:border-[#2f4257]'
          }`}
        />
        {focused && (
          <div className="absolute inset-0 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600/5 to-purple-600/5 pointer-events-none"></div>
        )}
      </div>
    </label>
  );
}

function TextArea({label, rows=4, ...props}){
  const [focused, setFocused] = useState(false);
  return (
    <label className="block text-xs sm:text-sm mb-2 sm:mb-3">
      <span className={`block mb-1 sm:mb-2 text-[#a9b4c6] font-medium transition-colors ${focused ? 'text-blue-400' : ''}`}>
        {label}
      </span>
      <textarea 
        rows={rows} 
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none transition-all duration-300 resize-none text-sm ${
          focused 
            ? 'border-blue-500 shadow-lg shadow-blue-900/30 ring-2 ring-blue-600/20' 
            : 'border-[#243247] hover:border-[#2f4257]'
        }`}
      />
    </label>
  );
}

function DetailRow({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col sm:grid sm:grid-cols-3 gap-x-4 border-b border-[#1c2735]/50 pb-2 sm:pb-3 pt-1 sm:pt-2 hover:bg-[#0f1520]/30 px-2 sm:px-3 -mx-2 sm:-mx-3 rounded-lg transition-colors">
      <strong className="text-[#a9b4c6] flex items-center gap-2 mb-1 sm:mb-0 text-xs sm:text-sm">
        <span className="text-blue-400">▸</span>
        {label}:
      </strong>
      <span className="text-[#e6edf6] sm:col-span-2 break-words text-xs sm:text-sm">{value}</span>
    </div>
  );
}

// ✅ MODAL ORIGINAL (Mantenemos este porque es más completo: scroll, tecla ESC, estilos base consistentes)
function Modal({ children, onClose, maxWidth = "max-w-6xl" }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleEsc = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-start sm:items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 p-2 sm:p-4 overflow-y-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      {/* Botón X flotante SIEMPRE VISIBLE en la esquina superior derecha */}
      <button 
        onClick={onClose} 
        title="Cerrar (Esc)" 
        className="fixed top-4 right-4 z-[110] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xl sm:text-2xl font-light shadow-2xl hover:shadow-red-900/50 transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/20"
      >
        ✕
      </button>

      <div 
        className={`relative ${maxWidth} w-full my-4 sm:my-0 max-h-[calc(100vh-2rem)] sm:max-h-[92vh] bg-gradient-to-br from-[#0b0f14] via-[#111821] to-[#0b0f14] rounded-xl sm:rounded-2xl shadow-2xl border border-white/10 transform transition-all duration-500 overflow-hidden ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-2rem)] sm:max-h-[92vh] custom-scrollbar" style={{scrollBehavior: 'smooth'}}>
          {children}
        </div>
      </div>
    </div>
  );
}

/*************************** NUEVOS COMPONENTES SOLICITADOS ***************************/

/*************************** Header Component ***************************/
function Header({ onOpenAuthors, onOpenAbout, currentUser, logout, onToggleFavorites, showFavorites, isPremium, onOpenAdmin }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#1a0f1f]/95 backdrop-blur-xl border-b border-[#1c2735]/50 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo y título */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-2xl sm:text-3xl">🎬</div>
            <div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                25 GRANDES PELÍCULAS
              </h1>
              <p className="text-[8px] sm:text-[10px] text-[#8fa1bb]">Ciencia Ficción & Tecnología</p>
            </div>
          </div>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4">
            <button
              onClick={onOpenAuthors}
              className="px-3 lg:px-4 py-2 text-sm lg:text-base text-[#e6edf6] hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <span>👥</span>
              <span>Autores</span>
            </button>
            <button
              onClick={onOpenAbout}
              className="px-3 lg:px-4 py-2 text-sm lg:text-base text-[#e6edf6] hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              <span>ℹ️</span>
              <span>Acerca de</span>
            </button>
            {isPremium && onToggleFavorites && (
              <button
                onClick={onToggleFavorites}
                className={`px-3 lg:px-4 py-2 text-sm lg:text-base transition-colors flex items-center gap-2 ${
                  showFavorites 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-[#e6edf6] hover:text-yellow-400'
                }`}
              >
                <span>{showFavorites ? '❤️' : '🤍'}</span>
                <span>Favoritos</span>
              </button>
            )}
            {currentUser && (
              <>
                <div className="h-6 w-px bg-[#243247]"></div>
                {currentUser.role === 'admin' && onOpenAdmin && (
                  <NavButton variant="solid" onClick={onOpenAdmin} icon="⚙️" className="text-sm bg-gradient-to-r from-red-600 to-orange-600">
                    Admin
                  </NavButton>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] rounded-xl border border-[#243247]">
                  <span className="text-xs text-[#8fa1bb]">Sesión:</span>
                  <strong className="text-sm text-white truncate max-w-[120px]">{currentUser.name}</strong>
                </div>
                <NavButton variant="ghost" onClick={logout} icon="👋" className="text-sm">Salir</NavButton>
              </>
            )}
          </nav>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <NavButton variant="ghost" onClick={logout} icon="👋" className="text-xs px-2 py-1">
                <span className="hidden xs:inline">Salir</span>
              </NavButton>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#e6edf6] hover:text-blue-400 transition-colors"
            >
              <span className="text-xl">{isMenuOpen ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-[#1c2735]/50 space-y-2 animate-fade-in">
            <button
              onClick={() => { onOpenAuthors(); setIsMenuOpen(false); }}
              className="w-full px-3 py-2 text-sm text-left text-[#e6edf6] hover:bg-[#1c2735]/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>👥</span>
              <span>Autores</span>
            </button>
            <button
              onClick={() => { onOpenAbout(); setIsMenuOpen(false); }}
              className="w-full px-3 py-2 text-sm text-left text-[#e6edf6] hover:bg-[#1c2735]/30 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>ℹ️</span>
              <span>Acerca de</span>
            </button>
            {isPremium && onToggleFavorites && (
              <button
                onClick={() => { onToggleFavorites(); setIsMenuOpen(false); }}
                className={`w-full px-3 py-2 text-sm text-left rounded-lg transition-colors flex items-center gap-2 ${
                  showFavorites 
                    ? 'text-yellow-400 hover:bg-[#1c2735]/30' 
                    : 'text-[#e6edf6] hover:bg-[#1c2735]/30'
                }`}
              >
                <span>{showFavorites ? '❤️' : '🤍'}</span>
                <span>Favoritos</span>
              </button>
            )}
            {currentUser && currentUser.role === 'admin' && onOpenAdmin && (
              <button
                onClick={() => { onOpenAdmin(); setIsMenuOpen(false); }}
                className="w-full px-3 py-2 text-sm text-left text-red-400 hover:bg-[#1c2735]/30 rounded-lg transition-colors flex items-center gap-2"
              >
                <span>⚙️</span>
                <span>Panel Admin</span>
              </button>
            )}
            {currentUser && (
              <div className="px-3 py-2 bg-[#0f1520]/50 rounded-lg text-xs">
                <span className="text-[#8fa1bb]">Sesión: </span>
                <strong className="text-white">{currentUser.name}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

/*************************** Footer Component ***************************/
function Footer({ onOpenAuthors, onOpenAbout }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-12 sm:mt-16 bg-gradient-to-r from-[#0a0e1a]/95 via-[#0f1419]/95 to-[#1a0f1f]/95 backdrop-blur-xl border-t border-[#1c2735]/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Sección 1: Sobre el proyecto */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <span className="text-2xl sm:text-3xl">🎬</span>
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                25 Grandes Películas
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#8fa1bb] leading-relaxed">
              Una colección  de las películas más influyentes de ciencia ficción y tecnología en la historia del cine.
            </p>
          </div>

          {/* Sección 2: Enlaces rápidos */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#e6edf6] mb-3 sm:mb-4 flex items-center gap-2">
              <span>🔗</span>
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenAuthors} className="text-xs sm:text-sm text-[#a9b4c6] hover:text-blue-400 transition-colors flex items-center gap-2">
                  <span>👥</span>
                  Ver Autores
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="text-xs sm:text-sm text-[#a9b4c6] hover:text-purple-400 transition-colors flex items-center gap-2">
                  <span>ℹ️</span>
                  Acerca del Proyecto
                </button>
              </li>
            </ul>
          </div>

          {/* Sección 3: Categorías */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#e6edf6] mb-3 sm:mb-4 flex items-center gap-2">
              <span>🎭</span>
              Categorías
            </h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <span className="text-xs sm:text-sm text-[#a9b4c6] flex items-center gap-2">
                    <span className="text-cyan-400">▸</span>
                    {cat}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sección 4: Contacto/Info */}
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#e6edf6] mb-3 sm:mb-4 flex items-center gap-2">
              <span>📧</span>
              Información
            </h4>
            <p className="text-xs sm:text-sm text-[#8fa1bb] mb-3">Proyecto educativo para Taller de Ingeniería del Software.</p>
            <div className="flex gap-2 sm:gap-3">
              {[
                // TODOS LOS ENLACES ACTUALIZADOS
                { k: "th", hint: "Threads", url: "https://www.threads.com/@topmoviescyt" },
                { k: "fb", hint: "Facebook", url: "https://www.facebook.com/Topmoviescyt" },
                { k: "ig", hint: "Instagram", url: "https://www.instagram.com/topmoviescyt/" },
              
              ].map((s) => (
                <a
                  key={s.k}
                  href={s.url} // Usamos la URL correcta
                  title={s.hint}
                  // Abrir en pestaña nueva de forma segura
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[#1c2735] hover:bg-white/10 border border-[#243247] hover:border-blue-500/50 transition-all transform hover:scale-110"
                >
                  {s.k === "th" ? <FaThreads className="text-sm sm:text-base" /> : s.k === "fb" ? <FaFacebook className="text-sm sm:text-base" /> : <FaInstagram className="text-sm sm:text-base" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-4 sm:pt-6 border-t border-[#1c2735]/50 text-center">
          <p className="text-[10px] sm:text-xs text-[#6b7a90]">
            © {currentYear} topmoviescyt.blog - 25 Grandes Películas - Proyecto Educativo - Todos los derechos reservados.
          </p>
          <p className="text-[9px] sm:text-[10px] text-[#6b7a90] mt-1">Hecho con 💙</p>
        </div>
      </div>
    </footer>
  );
}

/*************************** Modal Autores ***************************/
function AuthorsModal({ onClose, users, posts }) {
  // ✅ Filtrar usuarios: excluir admin y lectores premium (colaborador_premium)
  const filteredUsers = users.filter(user => 
    user.role !== 'admin' && user.role !== 'colaborador_premium'
  );
  
  // Calculamos las estadísticas reales basadas en los datos de Supabase
  const authorStats = filteredUsers
    .map((user) => {
      const userPosts = posts.filter((post) => post.author_id === user.id);
      return { ...user, postCount: userPosts.length, posts: userPosts };
    })
    .sort((a, b) => b.postCount - a.postCount);

  return (
    <Modal onClose={onClose} maxWidth="max-w-6xl">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl sm:text-4xl">👥</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Autores del Proyecto</h2>
            <p className="text-sm text-[#a9b4c6] mt-1">Colaboradores y sus publicaciones</p>
          </div>
        </div>

        <div className="space-y-6">
          {authorStats.map((author) => (
            <div key={author.id} className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247] hover:border-blue-500/50 transition-all duration-300">
              {/* Header del autor */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#1c2735]">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-600/40 to-purple-600/40 flex items-center justify-center text-2xl sm:text-3xl border-2 border-blue-500/30">👤</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{author.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="w-1 h-1 bg-[#8fa1bb] rounded-full"></span>
                      <p className="text-xs text-blue-400 font-semibold">{author.postCount} {author.postCount === 1 ? "publicación" : "publicaciones"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lista de publicaciones */}
              {author.postCount > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-[#a9b4c6] flex items-center gap-2">
                    <span>📽️</span>
                    Películas publicadas:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {author.posts.map((post) => (
                      <div key={post.id} className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-[#1c2735] hover:border-blue-500/30 transition-all group">
                        <div className="flex items-start gap-2">
                          <span className="text-lg flex-shrink-0 group-hover:scale-110 transition-transform">🎬</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                              {post.spanish_title || post.original_title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-[#8fa1bb]">
                              {post.year && <span>📅 {post.year}</span>}
                              {post.category && (
                                <>
                                  <span>•</span>
                                  <span>🎭 {post.category}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-[#6b7a90]">
                  <p className="text-sm">Sin publicaciones aún</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {authorStats.length === 0 && (
          <div className="text-center py-12 text-[#8fa1bb]">
            <div className="text-5xl mb-3 opacity-50">👥</div>
            <p>No hay autores registrados</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

/*************************** Modal Acerca de ***************************/
function AboutModal({ onClose }) {
  return (
    <Modal onClose={onClose} maxWidth="max-w-4xl">
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl sm:text-4xl">ℹ️</span>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Acerca del Proyecto</h2>
            <p className="text-sm text-[#a9b4c6] mt-1">Información sobre esta colección</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Descripción */}
          <section className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <span>🎬</span>
              Descripción del Proyecto
            </h3>
            <p className="text-sm sm:text-base text-[#a9b4c6] leading-relaxed">
              <strong className="text-white">25 Grandes Películas</strong> es una colección  de las películas más influyentes de ciencia ficción y tecnología en la historia del cine. Este proyecto tiene como objetivo documentar, analizar y compartir las obras cinematográficas que han definido géneros y han explorado las posibilidades del futuro, la tecnología y la condición humana.
            </p>
          </section>

          {/* Objetivo */}
          <section className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <span>🎯</span>
              Objetivos
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-[#a9b4c6]">
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">▸</span><span>Documentar películas icónicas de ciencia ficción y tecnología</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">▸</span><span>Proporcionar análisis detallados de cada película</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">▸</span><span>Crear una plataforma interactiva para el público en general</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-400 mt-1">▸</span><span>Facilitar el descubrimiento de nuevas películas del género</span></li>
            </ul>
          </section>

          {/* Características */}
          <section className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <span>✨</span>
              Características
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Galería de imágenes",
                "Audio narrado",
                "Trailers integrados",
                "Información detallada",
                "Sistema de búsqueda",
                "Compartir en redes",
              ].map((txt) => (
                <div key={txt} className="flex items-center gap-2 text-sm text-[#a9b4c6]">
                  <span className="text-green-400">✓</span>
                  <span>{txt}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Tecnologías */}
          <section className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247]">
            <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <span>⚙️</span>
              Tecnologías Utilizadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Supabase", "TailwindCSS", "JavaScript"].map((tech) => (
                <span key={tech} className="px-3 py-1.5 bg-[#1c2735] border border-[#243247] rounded-lg text-xs sm:text-sm text-[#e6edf6] hover:border-blue-500/50 transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </section>
          <section className="bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] rounded-xl p-4 sm:p-6 border border-[#243247]">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center gap-2 text-white">
                        <span>✨</span>
                        Créditos de Assets
                      </h3>
                      <p className="text-sm sm:text-base text-[#a9b4c6] leading-relaxed">
                        El modelo 3D de la pantalla de bienvenida es:
                        <br />
                        <a 
                          href="https://skfb.ly/oFXKN" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:underline"
                        >
                          "Black film slate or clapper"
                        </a> de 
                        <a 
                          href="https://sketchfab.com/bendar" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:underline"
                        >
                          Bendar Multimedia
                        </a>
                        <br />
                        Licenciado bajo <a 
                          href="http://creativecommons.org/licenses/by/4.0/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:underline"
                        >
                          Creative Commons Attribution (CC BY 4.0)
                        </a>.
                      </p>
                    </section>
        </div>
      </div>
    </Modal>
  );
}

/*************************** Tarjeta con botón de editar ***************************/
function PostSummaryCard({post, onClick, onEdit, showActions, currentUser, isPremium, isFavorite, onToggleFavorite}){
  const [isHovered, setIsHovered] = useState(false);
  const mainImage = (post.images || []).find(img => img && String(img).trim() !== "");
  // Usar funciones de permisos para verificar si puede editar
  const canEdit = showActions && currentUser && canEditPost(currentUser.role, currentUser.id, post);
  
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(post);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(post.id);
    }
  };
  
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer group relative overflow-hidden rounded-xl md:rounded-2xl aspect-[2/3] bg-gradient-to-br from-[#111821] to-[#1a1f2e] transition-all duration-500 active:scale-95 md:hover:scale-105 md:hover:-rotate-1 shadow-lg hover:shadow-2xl hover:shadow-blue-900/40"
      title={`Ver detalles de "${post.spanish_title}"`}
    >
      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-600/50 via-purple-600/50 to-cyan-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
      
      <div className="absolute inset-[2px] rounded-xl md:rounded-2xl overflow-hidden bg-[#111821]">
        {mainImage ? (
          <div className="relative w-full h-full">
            <img 
              src={mainImage} 
              alt={post.spanish_title} 
              className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110 blur-[2px]' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center p-3 sm:p-4 text-[#8fa1bb] bg-gradient-to-br from-[#0f1520] to-[#1a1f2e]">
            <span className="opacity-70 text-sm sm:text-base md:text-lg">{post.spanish_title}</span>
          </div>
        )}
        
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 flex flex-col gap-1 sm:gap-2">
          {post.category && <Badge variant="category">{post.category}</Badge>}
          
        </div>

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 flex flex-col gap-1 sm:gap-2">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600/90 to-blue-700/90 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
              title="Editar película"
            >
              <span className="text-base sm:text-lg">✏️</span>
            </button>
          )}
          {isPremium && (
            <button
              onClick={handleFavorite}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                isFavorite 
                  ? 'bg-gradient-to-br from-yellow-500/90 to-orange-500/90 hover:from-yellow-400 hover:to-orange-400 text-white opacity-100' 
                  : 'bg-black/50 hover:bg-black/70 text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
              }`}
              title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <span className="text-base sm:text-lg">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
          )}
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-5 z-10">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white transition-all duration-300 group-hover:text-blue-300 mb-1 line-clamp-2">
            {post.spanish_title}
          </h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#e6edf6]/90">
            {post.year && <span className="font-semibold">({post.year})</span>}
            {post.director && (
              <>
                <span className="text-blue-400 hidden sm:inline">•</span>
                <span className={`hidden sm:inline transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                  {post.director}
                </span>
              </>
            )}
          </div>
          
          <div className={`mt-2 sm:mt-3 flex items-center gap-2 text-blue-400 text-xs sm:text-sm font-semibold transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <span>Ver detalles</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/*************************** Modal de Edición ***************************/
function EditPostModal({ post, onClose, onSave }) {
  const [data, setData] = useState({
    category: post.category || CATEGORIES[0],
    original_title: post.original_title || "",
    spanish_title: post.spanish_title || "",
    year: post.year || "",
    distributor: post.distributor || "",
    director: post.director || "",
    movie_cast: post.movie_cast || "",
    streaming: post.streaming || "",
    awards: post.awards || "",
    summary: post.summary || "",
    features: post.features || ["", "", ""],
    trailer: post.trailer || "",
    images: post.images || ["", "", ""],
    audio_url: post.audio_url || "",
  });
  const [err, setErr] = useState("");

  const valid = useMemo(()=>{
    const req = ["original_title","spanish_title","year","distributor","director","movie_cast","streaming","awards","summary","trailer"];
    const miss = req.filter(k => !String(data[k]||"").trim());
    const featuresOk = data.features.filter(f=>String(f).trim()).length === 3;
    const imgsOk = data.images.filter(u=>String(u).trim()).length >= 1;
    const yearOk = /^\d{4}$/.test(data.year);
    return miss.length===0 && featuresOk && imgsOk && yearOk;
  },[data]);

  const handle = (k,v)=> setData(prev=>({...prev,[k]:v}));
  const handleArr = (k, idx, v)=> setData(prev=>{ const arr=[...prev[k]]; arr[idx]=v; return {...prev,[k]:arr};});

  const submit = (e)=>{
    e.preventDefault(); 
    setErr("");
    if(!valid){ 
      setErr("Completa todos los campos requeridos antes de guardar."); 
      return; 
    }
    onSave({
      ...post,
      ...data,
      updated_at: new Date().toISOString(),
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pr-8 sm:pr-12">
          <div className="text-2xl sm:text-3xl">✏️</div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Editar película</h3>
            <p className="text-[#a9b4c6] text-xs sm:text-sm mt-1">
              Modificando: <span className="font-semibold text-white">{post.spanish_title}</span>
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
          <label className="block text-xs sm:text-sm">
            <span className="mb-1 sm:mb-2 block text-[#a9b4c6] font-medium flex items-center gap-2">
              <span>🎭</span>
              Categoría
            </span>
            <select 
              value={data.category} 
              onChange={e=>handle("category", e.target.value)} 
              className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
            >
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          
         <Input label="Nombre original" icon="🎬" value={data.original_title} onChange={e=>handle("original_title", e.target.value)} required/>
<Input label="Nombre en español" icon="🇪🇸" value={data.spanish_title} onChange={e=>handle("spanish_title", e.target.value)} required/>
          <Input label="Año de realización" icon="📅" value={data.year} onChange={e=>handle("year", e.target.value)} placeholder="YYYY" required/>
          <Input label="Distribuidora" icon="🏢" value={data.distributor} onChange={e=>handle("distributor", e.target.value)} required/>
          <Input label="Director" icon="🎥" value={data.director} onChange={e=>handle("director", e.target.value)} required/>
          
          <TextArea label="Elenco actoral (separado por comas)" value={data.movie_cast} onChange={e=>handle("movie_cast", e.target.value)} rows={2} required/>
          
          {/* ✅ CAMBIO A LISTA DESPLEGABLE */}
          <label className="block text-xs sm:text-sm">
            <span className="mb-1 sm:mb-2 block text-[#a9b4c6] font-medium flex items-center gap-2">
              <span>📺</span>
              Plataforma de Streaming
            </span>
            <select
              value={data.streaming}
              onChange={e => handle("streaming", e.target.value)}
              required
              className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 outline-none hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
            >
              <option value="" disabled>Selecciona una plataforma</option>
              {STREAMING_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>
          
          <div className="md:col-span-2">
            <TextArea label="Principales premios ganados" value={data.awards} onChange={e=>handle("awards", e.target.value)} rows={2} required/>
          </div>
          
          <div className="md:col-span-2">
            <TextArea label="Resumen de la película" value={data.summary} onChange={e=>handle("summary", e.target.value)} rows={5} required/>
          </div>
          
          <div className="md:col-span-2">
            <Input label="Tráiler (URL de YouTube o MP4)" icon="🎬" value={data.trailer} onChange={e=>handle("trailer", e.target.value)} placeholder="https://youtube.com/watch?v=..." required/>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs sm:text-sm mb-2">
              <span className="text-[#a9b4c6] font-medium flex items-center gap-2">
                <span>✨</span>
                3 características clave
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {data.features.map((f, i)=> (
                <Input key={i} label={`${i+1}.`} value={f} onChange={e=>handleArr("features", i, e.target.value)} required/>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
  <label className="block text-xs sm:text-sm mb-2">
    <span className="text-[#a9b4c6] font-medium flex items-center gap-2">
      <span>🖼️</span>
      Ilustraciones
    </span>
  </label>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {data.images.map((url, i) => (
      <FileUpload
        key={i}
        type="image"
        label={`Imagen ${i + 1} ${i === 0 ? '(Requerida)' : '(Opcional)'}`}
        currentUrl={url}
        onUpload={(newUrl) => handleArr("images", i, newUrl)}
      />
    ))}
  </div>
</div>

         <div className="md:col-span-2">
  <FileUpload
    type="audio"
    label="Audio narrado (opcional)"
    currentUrl={data.audio_url}
    onUpload={(url) => handle("audio_url", url)}
  />
</div>

          {err && (
            <div className="md:col-span-2 text-red-400 text-xs sm:text-sm bg-red-900/20 border border-red-700 rounded-xl p-3 sm:p-4 flex items-start gap-2">
              <span className="text-base sm:text-lg">⚠️</span>
              <span>{err}</span>
            </div>
          )}
          
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button type="submit" disabled={!valid} icon="💾" className="w-full sm:w-auto">
              Guardar cambios
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} icon="✕" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

/*************************** Utilidades multimedia ************************/
function getYouTubeId(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
  } catch {}
  const m = /(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&#?]|$)/.exec(url);
  return m ? m[1] : null;
}

function isVideo(url) {
  return /\.(mp4|webm|ogg)(?:\?.*)?$/i.test(url || "");
}

function isAudio(url) {
  return /\.(mp3|m4a|wav|ogg|aac)(?:\?.*)?$/i.test(url || "");
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] border border-[#243247] mr-1 sm:mr-2 mb-1 sm:mb-2 hover:border-blue-500/50 transition-colors">
      {children}
    </span>
  );
}

// Agrega esta nueva función después de la función Chip
function ShareButtons({ post, settings }) {
  const shareUrl = window.location.href;
  const shareText = `🎬 ${post.spanish_title || post.original_title} (${post.year})\n${post.summary?.slice(0, 100)}...`;
  
  const handleShare = (platform) => {
    let url = '';
    
    switch(platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'instagram':
        // Instagram no permite compartir directo via URL, así que copiamos al portapapeles
        navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`).then(() => {
          alert('📋 Texto copiado al portapapeles. Pégalo en tu post de Instagram!');
        });
        return;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };
  
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-blue-600/20 hover:from-blue-500/30 hover:to-blue-600/30 border border-blue-500/50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Compartir en X (Twitter)"
      >
        <FaXTwitter className="text-base sm:text-lg" />
        <span className="text-xs sm:text-sm font-semibold">X</span>
      </button>
      
      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600/20 to-blue-700/20 hover:from-blue-600/30 hover:to-blue-700/30 border border-blue-600/50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Compartir en Facebook"
      >
        <FaFacebook className="text-base sm:text-lg" />
        <span className="text-xs sm:text-sm font-semibold">Facebook</span>
      </button>
      
      <button
        onClick={() => handleShare('instagram')}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/50 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        title="Copiar para Instagram"
      >
        <FaInstagram className="text-base sm:text-lg" />
        <span className="text-xs sm:text-sm font-semibold">Instagram</span>
      </button>
    </div>
  );
}


function CustomAudioPlayer({ src, title }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    audioRef.current.volume = vol;
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    audioRef.current.playbackRate = nextRate;
  };

  const skip = (seconds) => {
    audioRef.current.currentTime += seconds;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative bg-gradient-to-br from-[#0f1520] via-[#1a1f2e] to-[#0f1520] rounded-xl md:rounded-2xl p-4 sm:p-6 border-2 border-[#243247] hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-900/30 group">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Efecto de onda de audio decorativo animado */}
      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none overflow-hidden rounded-xl md:rounded-2xl">
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 w-1 bg-purple-500/30 rounded-full transform -translate-y-1/2"
            style={{
              left: `${(i + 1) * 5}%`,
              height: `${isPlaying ? Math.random() * 40 + 20 : 20}px`,
              animationDelay: `${i * 0.05}s`,
              animation: isPlaying ? 'audioWave 0.8s ease-in-out infinite' : 'none',
            }}
          />
        ))}
      </div>

      {/* Header con info */}
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 flex items-center justify-center border-2 border-purple-500/40 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/30">
          <span className="text-2xl sm:text-3xl">{isPlaying ? '🎵' : '🎙️'}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm sm:text-base font-bold text-[#e6edf6] line-clamp-1">
            {title || 'Audio disponible'}
          </div>
         
        </div>
        <button
          onClick={changePlaybackRate}
          className="px-2 sm:px-3 py-1 bg-gradient-to-r from-[#1a1f2e] to-[#243247] rounded-lg text-xs font-semibold text-purple-300 hover:text-purple-100 border border-purple-500/30 hover:border-purple-500/50 transition-all"
          title="Cambiar velocidad de reproducción"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Barra de progreso principal */}
      <div className="mb-4 relative z-10">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-[#0f1520] rounded-full appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, 
              rgb(147, 51, 234) 0%, 
              rgb(147, 51, 234) ${progress}%, 
              rgb(15, 21, 32) ${progress}%, 
              rgb(15, 21, 32) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-[#8fa1bb] mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controles principales */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 relative z-10">
        <button
          onClick={() => skip(-10)}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#243247] hover:from-purple-600/30 hover:to-blue-600/30 border border-[#243247] hover:border-purple-500/50 transition-all transform hover:scale-110 active:scale-95"
          title="Retroceder 10 segundos"
        >
          <span className="text-lg sm:text-xl">⏪</span>
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/50 hover:shadow-purple-800/60 transition-all transform hover:scale-110 active:scale-95"
          title={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          <span className="text-2xl sm:text-3xl text-white">
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </button>

        <button
          onClick={() => skip(10)}
          className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#1a1f2e] to-[#243247] hover:from-purple-600/30 hover:to-blue-600/30 border border-[#243247] hover:border-purple-500/50 transition-all transform hover:scale-110 active:scale-95"
          title="Adelantar 10 segundos"
        >
          <span className="text-lg sm:text-xl">⏩</span>
        </button>
      </div>

      {/* Control de volumen */}
      <div className="flex items-center gap-3 relative z-10">
        <button
          onClick={toggleMute}
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#1a1f2e] to-[#243247] hover:from-purple-600/20 hover:to-blue-600/20 border border-[#243247] hover:border-purple-500/50 transition-all"
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          <span className="text-base sm:text-lg">
            {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
          </span>
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-[#0f1520] rounded-full appearance-none cursor-pointer slider-thumb"
            style={{
              background: `linear-gradient(to right, 
                rgb(147, 51, 234) 0%, 
                rgb(147, 51, 234) ${(isMuted ? 0 : volume) * 100}%, 
                rgb(15, 21, 32) ${(isMuted ? 0 : volume) * 100}%, 
                rgb(15, 21, 32) 100%)`
            }}
          />
        </div>
        
        <span className="text-xs text-[#8fa1bb] w-10 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      </div>

      <style>{`
        @keyframes audioWave {
          0%, 100% {
            transform: translateY(-50%) scaleY(0.5);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-50%) scaleY(1.5);
            opacity: 0.7;
          }
        }

        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.6);
          transition: all 0.2s ease;
        }

        .slider-thumb::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.8);
        }

        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgb(147, 51, 234), rgb(59, 130, 246));
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(147, 51, 234, 0.6);
          transition: all 0.2s ease;
        }

        .slider-thumb::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(147, 51, 234, 0.8);
        }
      `}</style>
    </div>
  );
}



function ImageGallery({ images = [], title }) {
  const safeImages = Array.isArray(images) ? images : [];
  const clean = safeImages.filter((u) => (u || "").trim() !== "");
  const [current, setCurrent] = useState(0);
  const has = clean.length > 0;
  const main = clean[current];

  useEffect(() => {
    setCurrent(0);
  }, [safeImages.length]);

  if (!has) return (
    <div className="text-xs sm:text-sm text-[#8fa1bb] bg-[#0f1520]/50 rounded-xl md:rounded-2xl p-4 sm:p-6 text-center border border-dashed border-[#243247]">
      Sin ilustraciones
    </div>
  );

  return (
    <div>
      <h4 className="font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
        <span className="text-xl sm:text-2xl">🖼️</span>
        <span className="text-sm sm:text-base">Galería</span>
      </h4>
      <div className="aspect-[16/9] w-full overflow-hidden rounded-xl md:rounded-2xl border-2 border-[#1c2735] bg-[#0f1520] shadow-xl hover:border-blue-500/50 transition-colors">
        <img
          src={main}
          alt={title || "Ilustración"}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="mt-3 sm:mt-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
        {clean.map((u, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`aspect-[16/10] overflow-hidden rounded-lg md:rounded-xl border-2 transition-all duration-300 transform active:scale-95 md:hover:scale-110 ${
              i === current 
                ? "border-blue-500 shadow-lg shadow-blue-900/50 scale-105" 
                : "border-[#1c2735] hover:border-[#2a3a50]"
            }`}
            title={`Ilustración ${i + 1}`}
          >
            <img src={u} alt={`Ilustración ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Tabs({ tabs, current, onChange }) {
  const listRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({});

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    
    const activeButton = el.querySelector(`[data-tab-key="${current}"]`);
    if (activeButton) {
      setIndicatorStyle({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      });
    }

    const items = Array.from(el.querySelectorAll("[role=tab]"));
    const onKey = (e) => {
      const idx = items.indexOf(document.activeElement);
      if (idx < 0) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const n = (idx + 1) % items.length;
        items[n].focus();
        onChange(tabs[n].key);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const n = (idx - 1 + items.length) % items.length;
        items[n].focus();
        onChange(tabs[n].key);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [tabs, onChange, current]);

  return (
    <div>
      <div
        ref={listRef}
        role="tablist"
        aria-label="Secciones de detalle"
        className="relative flex flex-wrap gap-1.5 sm:gap-2 border-b-2 border-[#1c2735] pb-2"
      >
        <div 
          className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 transition-all duration-300 rounded-full"
          style={indicatorStyle}
        />
        
        {tabs.map((t) => (
          <button
            key={t.key}
            data-tab-key={t.key}
            role="tab"
            aria-selected={current === t.key}
            onClick={() => onChange(t.key)}
            className={`px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg md:rounded-xl text-[10px] sm:text-xs md:text-sm font-semibold border transition-all duration-300 transform active:scale-95 md:hover:scale-105 ${
              current === t.key
                ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500 text-white shadow-lg shadow-blue-900/30"
                : "bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] border-[#243247] text-[#c6d0e0] hover:border-[#2f4257] hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}



/*************************** Vista Detallada con botones ***************************/
function PostDetailViewPlus({ post = {}, onEdit, onDelete, currentUser, isPremium, isFavorite, onToggleFavorite }) {
    const safePost = typeof post === 'object' && post !== null ? post : {};
    const [tab, setTab] = useState('resumen');
    const [isMuted, setIsMuted] = useState(true);
    const [isYouTubeApiReady, setYouTubeApiReady] = useState(false);

    const videoRef = useRef(null);
    const playerRef = useRef(null);

    const trailerUrl = safePost.trailer;
    const ytId = getYouTubeId(trailerUrl);
    const isVideoFile = isVideo(trailerUrl);

    const castChips = useMemo(() => String(safePost.movie_cast || '').split(',').map(s => s.trim()).filter(Boolean), [safePost.movie_cast]);
    const features = Array.isArray(safePost.features) ? safePost.features : [];
    const hasMinimum = Boolean(safePost.spanish_title) || Boolean(safePost.original_title);
    
    // Usar funciones de permisos para verificar si puede editar o eliminar
    const canEdit = currentUser && canEditPost(currentUser.role, currentUser.id, safePost);
    const canDelete = currentUser && canDeletePost(currentUser.role, currentUser.id, safePost);

    const toggleMute = () => {
        if (playerRef.current && typeof playerRef.current.isMuted === 'function') {
            if (playerRef.current.isMuted()) {
                playerRef.current.unMute();
                setIsMuted(false);
            } else {
                playerRef.current.mute();
                setIsMuted(true);
            }
        } else if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    
    useEffect(() => {
        if (ytId) {
            if (window.YT && window.YT.Player) {
                setYouTubeApiReady(true);
            } else {
                const tag = document.createElement('script');
                if (!document.getElementById('youtube-iframe-api')) {
                    tag.id = 'youtube-iframe-api';
                    tag.src = "https://www.youtube.com/iframe_api";
                    window.onYouTubeIframeAPIReady = () => {
                        setYouTubeApiReady(true);
                    };
                    document.body.appendChild(tag);
                } else if(window.YT) {
                    setYouTubeApiReady(true);
                }
            }
        }
    }, [ytId]);

    useEffect(() => {
        if (ytId && isYouTubeApiReady) {
            const timer = setTimeout(() => {
                if (document.getElementById(`yt-player-${safePost.id}`)) {
                     playerRef.current = new window.YT.Player(`yt-player-${safePost.id}`, {
                        events: { 'onReady': (e) => e.target.playVideo() }
                    });
                }
            }, 100);

            return () => {
                clearTimeout(timer);
                 if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                    playerRef.current.destroy();
                }
                playerRef.current = null;
            };
        }
    }, [ytId, isYouTubeApiReady, safePost.id]);

  return (
    <div className="w-full">
      <header className="relative w-full aspect-video bg-black overflow-hidden group">
        {isVideoFile ? (
          <video ref={videoRef} key={trailerUrl} src={trailerUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : ytId ? (
          <div className="w-full h-full">
             <iframe id={`yt-player-${safePost.id}`} src={`https://www.youtube.com/embed/${ytId}?enablejsapi=1&autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0`} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full pointer-events-none" title="Trailer" ></iframe>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a0e1a] to-[#1a1f2e]">
            <p className="text-[#a9b4c6]">No hay tráiler disponible</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-3 xs:p-4 sm:p-6 md:p-8 text-white">
          <div className="flex flex-wrap items-center gap-1.5 xs:gap-2 sm:gap-3">
            <h2 className="min-w-0 text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight text-white break-words">
              {safePost.spanish_title || safePost.original_title || "(Sin título)"}
            </h2>
            {safePost.category && <Badge variant="category">{safePost.category}</Badge>}
            {safePost.year && <Badge variant="primary">{safePost.year}</Badge>}
          </div>
          
          <div className="mt-2 xs:mt-3 sm:mt-4">
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-1.5 sm:gap-4 text-[#a9b4c6]">
              <p className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs sm:text-sm">
                <span className="text-purple-400/80">👤</span>
                <span className="hidden xs:inline">Por:</span>
                <span className="font-semibold text-white/90 truncate max-w-[150px] xs:max-w-none">
                  {safePost.authorName || "—"}
                </span>
              </p>
              {safePost.created_at && (
                <p className="flex items-center gap-1.5 xs:gap-2 text-[10px] xs:text-xs sm:text-sm">
                  <span className="text-green-400/80">📅</span>
                  <span className="hidden xs:inline">Publicado:</span>
                  <span className="font-semibold text-white/90 text-[9px] xs:text-[10px] sm:text-xs">
                    {fmtDateTime(new Date(safePost.created_at))}
                  </span>
                </p>
              )}
            </div>
             {safePost.updated_at && (
              <p className="text-white/70 text-[10px] sm:text-xs flex items-center gap-1.5 mt-1.5">
                <span>✏️</span>
                Últ. edición: {fmtDateTime(new Date(safePost.updated_at))}
              </p>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3 xs:top-4 xs:right-4 sm:top-6 sm:right-6 flex items-center gap-2 z-10">
            {(isVideoFile || ytId) && (
              <button onClick={toggleMute} className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-white/20 transition-all" title={isMuted ? "Activar sonido" : "Silenciar"}>
                <span className="text-sm xs:text-base sm:text-lg">{isMuted ? '🔇' : '🔊'}</span>
              </button>
            )}
            {isPremium && onToggleFavorite && (
              <button 
                onClick={() => onToggleFavorite(safePost.id)} 
                className={`w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full shadow-lg transition-all ${
                  isFavorite 
                    ? 'bg-gradient-to-br from-yellow-500/90 to-orange-500/90 hover:from-yellow-400 hover:to-orange-400 text-white' 
                    : 'bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
                }`}
                title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              >
                <span className="text-sm xs:text-base sm:text-lg">{isFavorite ? '❤️' : '🤍'}</span>
              </button>
            )}
            {canEdit && (
              <button onClick={() => onEdit && onEdit(safePost)} className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full bg-blue-600/80 hover:bg-blue-500 text-white shadow-lg transition-all" title="Editar película">
                <span className="text-sm xs:text-base sm:text-lg">✏️</span>
              </button>
            )}
            {canDelete && (
              <button onClick={() => onDelete && onDelete(safePost)} className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 inline-flex items-center justify-center rounded-full bg-red-600/80 hover:bg-red-500 text-white shadow-lg transition-all" title="Eliminar película">
                <span className="text-sm xs:text-base sm:text-lg">🗑️</span>
              </button>
            )}
        </div>
      </header>

      {/* LIMITADOR & PADDING GLOBAL */}
      <div className="mx-auto max-w-7xl px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
        {!hasMinimum && (
          <div className="mt-3 text-xs sm:text-sm text-yellow-300 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-700 rounded-xl p-3 sm:p-4">
            ⚠️ No se recibieron campos mínimos
          </div>
        )}

        {/* SUPERIOR: AUDIO + TABS */}
        <section className="pt-3 xs:pt-4 sm:pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
            {/* AUDIO (1/3) */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
            
              </div>

              {safePost.audio_url && isAudio(safePost.audio_url) ? (
                <CustomAudioPlayer src={safePost.audio_url} title={safePost.spanish_title || safePost.original_title ? `Narración de ${safePost.spanish_title || safePost.original_title}`: "Narración de la película"} />
              ) : safePost.audio_url ? (
                <div className="bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] rounded-xl md:rounded-2xl p-4 sm:p-6 border border-[#243247] shadow-lg">
                  <div className="flex items-center gap-3 mb-3"> <span className="text-2xl">⚠️</span> <div> <div className="text-sm font-semibold text-yellow-300">Formato no compatible</div> <div className="text-xs text-[#8fa1bb]">Intenta descargar el archivo</div></div></div>
                  <audio className="w-full" src={safePost.audio_url} controls preload="metadata" />
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-[#8fa1bb] bg-[#0f1520]/50 rounded-xl md:rounded-2xl p-6 sm:p-8 text-center border border-dashed border-[#243247]">
                  <div className="text-3xl sm:text-4xl mb-2 opacity-50">🎵</div>
                  <p>No se proporcionó audio narrado</p>
                  <p className="text-[10px] sm:text-xs text-[#6b7a90] mt-2">Agrega una narración para enriquecer la experiencia</p>
                </div>
              )}
            </div>

            {/* TABS (2/3) */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <Tabs current={tab} onChange={setTab} tabs={[ { key: "resumen", label: "📝 Resumen" }, { key: "ficha", label: "📋 Ficha" }, { key: "galeria", label: "🖼️ Galería" }, { key: "premios", label: "🏆 Premios" }, { key: "creditos", label: "👥 Créditos" }, ]}/>
              <div className="mt-3 xs:mt-4 sm:mt-6 space-y-2 xs:space-y-3 text-[10px] xs:text-xs sm:text-sm max-h-[35vh] xs:max-h-[40vh] sm:max-h-[50vh] overflow-y-auto pr-1 xs:pr-1.5 sm:pr-2 custom-scrollbar">
                {tab === "ficha" && (
                  <div className="space-y-2 sm:space-y-3">
                    <DetailRow label="Categoría" value={safePost.category} />
                    <DetailRow label="Año" value={safePost.year} />
                    <DetailRow label="Director" value={safePost.director} />
                    <DetailRow label="Distribuidora" value={safePost.distributor} />
                  </div>
                )}
                {tab === "resumen" && (
                  <div className="space-y-3 sm:space-y-4">
                    <DetailRow label="Resumen" value={ <p className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm md:text-base">{safePost.summary || "—"}</p> } />
                    {features.filter(Boolean).length > 0 && (
                      <div className="bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] rounded-xl p-3 sm:p-4 border border-[#243247]">
                        <strong className="text-[#a9b4c6] block mb-2 sm:mb-3 flex items-center gap-2 text-xs sm:text-sm"> <span className="text-blue-400">✨</span>Características clave</strong>
                        <div className="flex flex-wrap gap-2">{features.filter(Boolean).map((f, i) => ( <Chip key={i}>{f}</Chip> ))}</div>
                      </div>
                    )}
                  </div>
                )}
                {tab === "premios" && (
                  <div className="space-y-2 sm:space-y-3">
                    <DetailRow label="Premios" value={<p className="whitespace-pre-wrap leading-relaxed">{safePost.awards || "—"}</p>} />
                  </div>
                )}
                {tab === "creditos" && (
                  <div className="space-y-3 sm:space-y-4">
                    <DetailRow label="Elenco" value={ castChips.length ? ( <div className="flex flex-wrap gap-2">{castChips.map((c, i) => ( <Chip key={i}>{c}</Chip> )) }</div>) : ("—") }/>
                    <DetailRow label="Streaming" value={safePost.streaming || "—"}/>
                  </div>
                )}
                {tab === "galeria" && (<ImageGallery images={safePost.images} title={safePost.spanish_title} />)}
               
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-4 xs:pt-6 sm:pt-8 pb-3 xs:pb-4 sm:pb-6 border-t border-[#1c2735]/50 mt-4 xs:mt-6 sm:mt-8">
          <div className="mb-2 xs:mb-3 sm:mb-4">
            <h4 className="font-bold text-sm xs:text-base sm:text-lg flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2"> <span className="text-lg xs:text-xl sm:text-2xl">🔗</span><span className="text-xs xs:text-sm sm:text-base">Compartir esta película</span></h4>
            <p className="text-[#a9b4c6] text-[10px] xs:text-xs sm:text-sm">Comparte en tus redes sociales</p>
          </div>
          <ShareButtons post={safePost} />
        </footer>
      </div>
    </div>
  );
}

/*************************** Login ***************************/
function LoginPanel(){
  const { login, users } = useAuth();
  const [form, setForm] = useState({ idOrEmail: "", password: "" });
  const [err, setErr] = useState("");
  const handleLogin = async (e)=>{ 
    e.preventDefault();
    setErr("");
    try{
      await login(form.idOrEmail.trim(), form.password.trim());
    }catch(ex){
      setErr(ex.message);
    } 
  };
  
  return (
    <Card className="animate-fadeIn">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="text-2xl sm:text-3xl">🔐</div>
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Acceso por integrante
        </h2>
      </div>
      <form onSubmit={handleLogin} className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <Input 
          label="ID o correo" 
          icon="👤"
          value={form.idOrEmail} 
          onChange={e=>setForm({...form,idOrEmail:e.target.value})} 
          required
        />
        <Input 
          label="Contraseña" 
          icon="🔑"
          type="password" 
          value={form.password} 
          onChange={e=>setForm({...form,password:e.target.value})} 
          required
        />
        <div className="flex items-end">
          <Button type="submit" icon="→" className="w-full md:w-auto">Entrar</Button>
        </div>
        {err && (
          <div className="md:col-span-3 text-red-400 text-xs sm:text-sm bg-red-900/20 border border-red-700 rounded-xl p-2 sm:p-3">
            ⚠️ {err}
          </div>
        )}
      </form>
      <div className="text-[10px] sm:text-xs text-[#8fa1bb] mt-3 sm:mt-4 flex items-center gap-2">
        <span className="text-green-400">✓</span>
        Integrantes cargados: <span className="font-bold text-white">{users.length}</span>
      </div>
      <div className="text-[10px] sm:text-xs text-[#8fa1bb] mt-2 flex items-center gap-2">
        <span className="text-yellow-400">ℹ️</span>
        <span>Este acceso es solo para administradores y editores</span>
      </div>
    </Card>
  );
}

/*************************** Modal de Lector Premium ***************************/
function PremiumCollaboratorModal({ onClose, onLogin, onSignUp }){
  const [mode, setMode] = useState('info'); // 'info', 'login', 'signup', 'confirmation'
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await onLogin(loginForm.email.trim(), loginForm.password.trim());
      onClose();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    
    if (signupForm.password !== signupForm.confirmPassword) {
      setErr("Las contraseñas no coinciden");
      return;
    }
    
    if (signupForm.password.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await onSignUp(signupForm.email.trim(), signupForm.password.trim(), signupForm.name.trim());
      setRegisteredEmail(signupForm.email.trim());
      setMode('confirmation');
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: "⭐", text: "Acceso a contenido exclusivo" },
    { icon: "❤️", text: "Marcar películas como favoritas" },
    { icon: "🔔", text: "Recibir notificaciones de nuevos posts" },
    { icon: "📱", text: "Compartir posts en redes sociales" },
    { icon: "🎬", text: "Acceso prioritario a nuevas recomendaciones" }
  ];

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
      {mode === 'info' && (
        <>
          <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="text-4xl sm:text-5xl md:text-6xl drop-shadow-lg filter" style={{filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'}}>⭐</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              ¿Quieres ser <span className="text-orange-400 drop-shadow-lg" style={{textShadow: '0 0 10px rgba(251, 146, 60, 0.5)'}}>Lector</span> <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg" style={{textShadow: '0 0 10px rgba(236, 72, 153, 0.3)'}}>Premium?</span>
            </h2>
          </div>
          
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-br from-[#0f1520]/80 via-[#1a1f2e]/60 to-[#0f1520]/80 rounded-2xl border border-[#243247]/70 shadow-2xl shadow-black/50 backdrop-blur-sm">
            <h3 className="text-base sm:text-lg font-semibold text-[#e6edf6] mb-4 sm:mb-5 flex items-center gap-2">
              <span className="text-orange-400">✨</span>
              <span>Beneficios de ser Lector Premium</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-[#0f1520]/90 to-[#1a1f2e]/90 rounded-xl border border-[#243247]/70 shadow-lg hover:shadow-xl hover:shadow-blue-900/20 hover:border-[#2f4257] transition-all duration-300 hover:scale-[1.02]">
                  <span className="text-xl sm:text-2xl flex-shrink-0 drop-shadow-md">{benefit.icon}</span>
                  <span className="text-xs sm:text-sm text-[#a9b4c6] leading-relaxed">{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Button 
              onClick={() => setMode('signup')} 
              variant="primary" 
              icon="📝"
              className="flex-1 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:shadow-blue-800/60"
            >
              Registrarse como Lector Premium
            </Button>
            <Button 
              onClick={() => setMode('login')} 
              variant="ghost" 
              icon="🔑"
              className="flex-1 text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1c2735] hover:bg-[#243247] border border-[#2a3a50] hover:border-[#3a4a60] text-[#a9b4c6] hover:text-[#e6edf6] shadow-lg hover:shadow-xl transition-all"
            >
              Iniciar Sesión como Lector Premium
            </Button>
          </div>
        </>
      )}

      {mode === 'login' && (
        <>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button 
              onClick={() => { setMode('info'); setErr(''); }} 
              className="text-2xl hover:opacity-70 transition-opacity"
            >
              ←
            </button>
            <div className="text-2xl sm:text-3xl">🔑</div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Iniciar Sesión como Lector Premium
            </h2>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <Input 
              label="Correo electrónico" 
              icon="📧"
              type="email"
              value={loginForm.email} 
              onChange={e => setLoginForm({...loginForm, email: e.target.value})} 
              required
            />
            <Input 
              label="Contraseña" 
              icon="🔒"
              type="password" 
              value={loginForm.password} 
              onChange={e => setLoginForm({...loginForm, password: e.target.value})} 
              required
            />
            {err && (
              <div className="text-red-400 text-xs sm:text-sm bg-red-900/20 border border-red-700 rounded-xl p-3">
                ⚠️ {err}
              </div>
            )}
            <div className="flex gap-3 sm:gap-4">
              <Button 
                type="submit" 
                icon="→" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </form>
        </>
      )}

      {mode === 'signup' && (
        <>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <button 
              onClick={() => { setMode('info'); setErr(''); }} 
              className="text-2xl hover:opacity-70 transition-opacity"
            >
              ←
            </button>
            <div className="text-2xl sm:text-3xl">📝</div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Registrarse como Lector Premium
            </h2>
          </div>
          
          <form onSubmit={handleSignUp} className="space-y-4 sm:space-y-5">
            <Input 
              label="Nombre completo" 
              icon="👤"
              value={signupForm.name} 
              onChange={e => setSignupForm({...signupForm, name: e.target.value})} 
              required
            />
            <Input 
              label="Correo electrónico" 
              icon="📧"
              type="email"
              value={signupForm.email} 
              onChange={e => setSignupForm({...signupForm, email: e.target.value})} 
              required
            />
            <Input 
              label="Contraseña" 
              icon="🔒"
              type="password" 
              value={signupForm.password} 
              onChange={e => setSignupForm({...signupForm, password: e.target.value})} 
              required
              minLength={6}
            />
            <Input 
              label="Confirmar contraseña" 
              icon="🔒"
              type="password" 
              value={signupForm.confirmPassword} 
              onChange={e => setSignupForm({...signupForm, confirmPassword: e.target.value})} 
              required
              minLength={6}
            />
            {err && (
              <div className="text-red-400 text-xs sm:text-sm bg-red-900/20 border border-red-700 rounded-xl p-3">
                ⚠️ {err}
              </div>
            )}
            <div className="flex gap-3 sm:gap-4">
              <Button 
                type="submit" 
                icon="✨" 
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Registrando...' : 'Registrarse'}
              </Button>
            </div>
          </form>
        </>
      )}

      {mode === 'confirmation' && (
        <>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl">📧</div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Confirma tu cuenta
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-5">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-green-900/20 via-blue-900/20 to-green-900/20 rounded-2xl border border-green-700/50 shadow-xl">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="text-5xl sm:text-6xl mb-4">✉️</div>
                <p className="text-base sm:text-lg text-[#e6edf6] font-semibold">
                  Por favor confirma tu cuenta para acceder
                </p>
                <p className="text-sm sm:text-base text-[#a9b4c6]">
                  Se envió un enlace de confirmación a tu correo electrónico:
                </p>
                <p className="text-sm sm:text-base text-blue-400 font-medium break-all">
                  {registeredEmail}
                </p>
                <p className="text-xs sm:text-sm text-[#8fa1bb] mt-4">
                  Revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <Button 
                onClick={onClose} 
                variant="primary" 
                icon="✓"
                className="flex-1"
              >
                Entendido
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/*************************** Panel de Administración ***************************/
function AdminPanel({ users, onUpdateRole, onClose }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = [
    { value: 'admin', label: 'Administrador', color: 'text-red-400' },
    { value: 'editor', label: 'Editor', color: 'text-blue-400' },
    { value: 'editor_senior', label: 'Editor Senior', color: 'text-purple-400' },
    { value: 'editor_junior', label: 'Editor Junior', color: 'text-cyan-400' },
    { value: 'colaborador_premium', label: 'Lector Premium', color: 'text-yellow-400' },
    { value: 'colaborador_basico', label: 'Colaborador Básico', color: 'text-gray-400' },
  ];

  const handleRoleChange = async (userId, currentRole) => {
    if (!newRole || newRole === currentRole) {
      setError('Selecciona un rol diferente');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const { error: updateError } = await onUpdateRole(userId, newRole);
    
    if (updateError) {
      setError(`Error: ${updateError}`);
    } else {
      setSuccess(`Rol actualizado correctamente a ${roles.find(r => r.value === newRole)?.label}`);
      setSelectedUser(null);
      setNewRole('');
      setTimeout(() => setSuccess(''), 3000);
    }
    
    setLoading(false);
  };

  const getRoleLabel = (role) => {
    return roles.find(r => r.value === role)?.label || role;
  };

  const getRoleColor = (role) => {
    return roles.find(r => r.value === role)?.color || 'text-gray-400';
  };

  return (
    <Card className="animate-fadeIn max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-3xl">⚙️</div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              Panel de Administración
            </h2>
            <p className="text-sm text-[#8fa1bb] mt-1">Gestiona usuarios y roles</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:opacity-70 transition-opacity"
        >
          ✕
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-900/20 border border-green-700 rounded-xl text-green-400 text-sm">
          ✅ {success}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-700 rounded-xl text-red-400 text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-gradient-to-br from-[#0f1520]/50 to-[#1a1f2e]/50 rounded-xl border border-[#243247]/50 hover:border-[#2f4257] transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{user.name || 'Sin nombre'}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRoleColor(user.role)} bg-[#0f1520]/50 border border-current/30`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <p className="text-sm text-[#8fa1bb]">{user.email}</p>
                {user.id && (
                  <p className="text-xs text-[#6b7a90] mt-1 font-mono truncate">ID: {user.id}</p>
                )}
              </div>

              {selectedUser?.id === user.id ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-3 py-2 bg-[#0f1520] border border-[#243247] rounded-lg text-sm text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Seleccionar nuevo rol</option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      disabled={loading || !newRole || newRole === user.role}
                      className="text-xs px-3 py-2"
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedUser(null);
                        setNewRole('');
                        setError('');
                      }}
                      variant="ghost"
                      className="text-xs px-3 py-2"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedUser(user);
                    setNewRole(user.role);
                    setError('');
                  }}
                  variant="primary"
                  className="text-xs px-4 py-2"
                >
                  Cambiar Rol
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-8 text-[#8fa1bb]">
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </Card>
  );
}

/*************************** Formulario ***************************/
function PostForm({onSubmit, currentUser}){
  const [data, setData] = useState({
    category: CATEGORIES[0],
    original_title: "",
    spanish_title: "",
    year: "",
    distributor: "",
    director: "",
    movie_cast: "",
    streaming: "", // ✅ Valor inicial vacío
    awards: "",
    summary: "",
    features: ["", "", ""],
    trailer: "",
    images: ["", "", ""],
    audio_url: "",
  });
  const [err, setErr] = useState("");

  const valid = useMemo(()=>{
    const req = ["original_title","spanish_title","year","distributor","director","movie_cast","streaming","awards","summary","trailer"];
    const miss = req.filter(k => !String(data[k]||"").trim());
    const featuresOk = data.features.filter(f=>String(f).trim()).length === 3;
    const imgsOk = data.images.filter(u=>String(u).trim()).length >= 1;
    const yearOk = /^\d{4}$/.test(data.year);
    return miss.length===0 && featuresOk && imgsOk && yearOk;
  },[data]);

  const handle = (k,v)=> setData(prev=>({...prev,[k]:v}));
  const handleArr = (k, idx, v)=> setData(prev=>{ const arr=[...prev[k]]; arr[idx]=v; return {...prev,[k]:arr};});

  const submit = (e)=>{
    e.preventDefault(); 
    setErr("");
    if(!valid){ 
      setErr("Completa todos los campos requeridos antes de publicar."); 
      return; 
    }
    
    const payload = {
      id: uuidv4(),
      ...data,
      author_id: currentUser.id,
      created_at: new Date().toISOString(),
    };
    
    onSubmit(payload);
    
    setData({
      category: CATEGORIES[0],
      original_title: "",
      spanish_title: "",
      year: "",
      distributor: "",
      director: "",
      movie_cast: "",
      streaming: "",
      awards: "",
      summary: "",
      features: ["", "", ""],
      trailer: "",
      images: ["", "", ""],
      audio_url: "",
    });
  };

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="text-2xl sm:text-3xl">✍️</div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Nueva publicación</h3>
            <p className="text-[#a9b4c6] text-xs sm:text-sm mt-1">
              Autor: <span className="font-semibold text-white">{currentUser.name}</span>
            </p>
          </div>
        </div>
      </div>
      
      <form onSubmit={submit} className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
        <label className="block text-xs sm:text-sm">
          <span className="mb-1 sm:mb-2 block text-[#a9b4c6] font-medium flex items-center gap-2">
            <span>🎭</span>
            Categoría
          </span>
          <select 
            value={data.category} 
            onChange={e=>handle("category", e.target.value)} 
            className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 outline-none hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
          >
            {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        
        <Input label="Nombre original" icon="🎬" value={data.original_title} onChange={e=>handle("original_title", e.target.value)} required/>
        <Input label="Nombre en español" icon="🇪🇸" value={data.spanish_title} onChange={e=>handle("spanish_title", e.target.value)} required/>
        <Input label="Año de realización" icon="📅" value={data.year} onChange={e=>handle("year", e.target.value)} placeholder="YYYY" required/>
        <Input label="Distribuidora" icon="🏢" value={data.distributor} onChange={e=>handle("distributor", e.target.value)} required/>
        <Input label="Director" icon="🎥" value={data.director} onChange={e=>handle("director", e.target.value)} required/>
        
        <TextArea label="Elenco actoral (separado por comas)" value={data.movie_cast} onChange={e=>handle("movie_cast", e.target.value)} rows={2} required/>
        
        {/* ✅ CAMBIO A LISTA DESPLEGABLE */}
        <label className="block text-xs sm:text-sm">
          <span className="mb-1 sm:mb-2 block text-[#a9b4c6] font-medium flex items-center gap-2">
            <span>📺</span>
            Plataforma de Streaming
          </span>
          <select
            value={data.streaming}
            onChange={e => handle("streaming", e.target.value)}
            required
            className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-2.5 outline-none hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm"
          >
            <option value="" disabled>Selecciona una plataforma</option>
            {STREAMING_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
        
        <div className="md:col-span-2">
          <TextArea label="Principales premios ganados" value={data.awards} onChange={e=>handle("awards", e.target.value)} rows={2} required/>
        </div>
        
        <div className="md:col-span-2">
          <TextArea label="Resumen" value={data.summary} onChange={e=>handle("summary", e.target.value)} rows={3} required/>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm mb-2">
            <span className="text-[#a9b4c6] font-medium flex items-center gap-2">
              <span>✨</span>
              Tres características principales
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {data.features.map((f, i)=> (
              <Input 
                key={i} 
                label={`${i+1}. Característica`}
                value={f} 
                onChange={e=>handleArr("features", i, e.target.value)} 
                required
              />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Input label="Tráiler (URL de YouTube)" icon="▶️" value={data.trailer} onChange={e=>handle("trailer", e.target.value)} placeholder="https://www.youtube.com/watch?v=..." required/>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm mb-2">
            <span className="text-[#a9b4c6] font-medium flex items-center gap-2">
              <span>🖼️</span>
              Ilustraciones
            </span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {data.images.map((url, i) => (
              <FileUpload
                key={i}
                type="image"
                label={`Imagen ${i + 1} ${i === 0 ? '(Requerida)' : '(Opcional)'}`}
                currentUrl={url}
                onUpload={(newUrl) => handleArr("images", i, newUrl)}
              />
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <FileUpload
            type="audio"
            label="Audio narrado (opcional)"
            currentUrl={data.audio_url}
            onUpload={(url) => handle("audio_url", url)}
          />
        </div>
        
        {err && (
          <div className="md:col-span-2 bg-red-900/30 border border-red-700 text-red-200 p-3 rounded-lg text-sm">
            {err}
          </div>
        )}
        
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button type="submit" icon="📤" disabled={!valid}>Publicar película</Button>
          <Button 
            type="button" 
            variant="ghost" 
            onClick={()=>{
              setData({
                category: CATEGORIES[0],
                original_title: "",
                spanish_title: "",
                year: "",
                distributor: "",
                director: "",
                movie_cast: "",
                streaming: "",
                awards: "",
                summary: "",
                features: ["", "", ""],
                trailer: "",
                images: ["", "", ""],
                audio_url: "",
              });
            }} 
            icon="↻"
          >
            Limpiar formulario
          </Button>
        </div>
      </form>
    </Card>
  );
}


/*************************** Carrusel Mejorado ***************************/
function DailyCarousel({posts, onPostClick, currentUser, onEdit}){
  const [idx, setIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoPlayRef = useRef(null);
  const timeoutRef = useRef(null);
  
  const sorted = [...posts].sort((a,b)=> new Date(a.created_at) - new Date(b.created_at));  // ✅ CORRECTO
  const has = sorted.length > 0;
  const total = sorted.length;
  
  const getPost = (index) => {
    if (!has) return null;
    return sorted[((index % total) + total) % total];
  };
  
  const current = getPost(idx);
  const prev = getPost(idx - 1);
  const next = getPost(idx + 1);
  
  const triggerTransition = React.useCallback(() => {
    setIsTransitioning(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setIsTransitioning(false), 500);
  }, []);
  
  const goToPrev = React.useCallback(() => {
    if (isTransitioning) return;
    triggerTransition();
    setIdx(current => ((current - 1) % total + total) % total);
  }, [total, isTransitioning, triggerTransition]);
  
  const goToNext = React.useCallback(() => {
    if (isTransitioning) return;
    triggerTransition();
    setIdx(current => (current + 1) % total);
  }, [total, isTransitioning, triggerTransition]);
  
  const goToSlide = React.useCallback((index) => {
    if (isTransitioning || index === idx) return;
    triggerTransition();
    setIdx(index);
  }, [isTransitioning, idx, triggerTransition]);
  
  // Auto-play mejorado
  useEffect(() => {
    if (!has || isPaused || total === 0) {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
      return;
    }
    
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    autoPlayRef.current = setInterval(() => {
      triggerTransition();
      setIdx(current => (current + 1) % total);
    }, 5000);
    
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [has, isPaused, total, triggerTransition]);
  
  // Navegación con teclado
  useEffect(() => {
    if (!has) return;
    
    const handleKeyDown = (e) => {
      // ✅ Ignorar eventos cuando el usuario está escribiendo en un campo de formulario
      const target = e.target;
      const isInputField = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.isContentEditable ||
                          target.closest('input, textarea, [contenteditable="true"]');
      
      if (isInputField) {
        return; // No hacer nada si está escribiendo en un campo
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [has, goToPrev, goToNext]);
  
  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  return (
    <Card>
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-3 sm:gap-0 mb-3 xs:mb-4 sm:mb-6">
        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3">
          
        </div>

        {has && (
          <div className="flex gap-1.5 xs:gap-2 items-center">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] rounded-md xs:rounded-lg text-[10px] xs:text-xs sm:text-sm border border-[#243247] hover:border-blue-500/50 transition-all flex items-center gap-1 xs:gap-2"
              title={isPaused ? "Reanudar auto-play (Espacio)" : "Pausar auto-play (Espacio)"}
            >
              <span className="text-sm xs:text-base">{isPaused ? '▶️' : '⏸️'}</span>
              <span className="hidden xs:inline">{isPaused ? 'Iniciar' : 'Pausar'}</span>
            </button>
            
            <div className="px-1.5 xs:px-2 sm:px-3 py-0.5 xs:py-1 bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] rounded-md xs:rounded-lg text-[10px] xs:text-xs sm:text-sm border border-[#243247]">
              <span className="font-bold text-blue-400">{idx + 1}</span>
              <span className="text-[#8fa1bb]"> / {total}</span>
            </div>
          </div>
        )}
      </div>
      
      {has ? (
        <div className="relative carousel-container">
          <div 
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative flex items-center justify-center gap-1 xs:gap-2 md:gap-4 lg:gap-6">
              
              <button
                onClick={goToPrev}
                disabled={isTransitioning}
                className="absolute left-0 xs:left-1 md:relative z-10 w-8 h-8 xs:w-9 xs:h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Anterior (←)"
              >
                <span className="text-base xs:text-lg md:text-xl">←</span>
              </button>
              
              {prev && total > 1 && (
                <div className="hidden lg:block w-28 xl:w-40 opacity-50 hover:opacity-75 transition-all duration-300 cursor-pointer transform scale-90 hover:scale-95" onClick={goToPrev}>
                  <PostSummaryCard 
                    post={prev} 
                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    showActions={false}
                  />
                </div>
              )}
              
              <div 
                key={idx}
                className={`w-[calc(100%-4rem)] xs:w-[calc(100%-5rem)] sm:w-full max-w-[280px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md mx-2 xs:mx-4 md:mx-0 transition-all duration-500 ease-out ${
                  isTransitioning ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0'
                }`}
              >
                <PostSummaryCard 
                  post={current} 
                  onClick={() => onPostClick(current)} 
                  onEdit={onEdit}
                  currentUser={currentUser}
                  showActions={!!currentUser}
                />
              </div>
              
              {next && total > 1 && (
                <div className="hidden lg:block w-28 xl:w-40 opacity-50 hover:opacity-75 transition-all duration-300 cursor-pointer transform scale-90 hover:scale-95" onClick={goToNext}>
                  <PostSummaryCard 
                    post={next} 
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    showActions={false}
                  />
                </div>
              )}
              
              <button
                onClick={goToNext}
                disabled={isTransitioning}
                className="absolute right-0 xs:right-1 md:relative z-10 w-8 h-8 xs:w-9 xs:h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600/80 to-blue-700/80 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-900/50 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Siguiente (→)"
              >
                <span className="text-base xs:text-lg md:text-xl">→</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center gap-1 xs:gap-1.5 sm:gap-2 mt-3 xs:mt-4 sm:mt-6">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                disabled={isTransitioning}
                className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed transform hover:scale-110 active:scale-95 ${
                  i === idx
                    ? 'w-6 xs:w-8 sm:w-10 h-1.5 xs:h-2 sm:h-2.5 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50'
                    : 'w-1.5 xs:w-2 sm:w-2.5 h-1.5 xs:h-2 sm:h-2.5 bg-[#243247] hover:bg-[#2f4257]'
                }`}
                title={`Ir a película ${i + 1}`}
              />
            ))}
          </div>
          
          {/* ...existing code... */}
          
          <div className="mt-2 xs:mt-3 text-center text-[9px] xs:text-[10px] text-[#8fa1bb] hidden md:block pointer-events-none select-none opacity-70">
            ⌨️ Usa las flechas ← → para navegar | Espacio para pausar
          </div>
        </div>
      ) : (
        <div className="text-center py-6 xs:py-8 sm:py-12 text-[#8fa1bb]">
          <div className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl mb-2 xs:mb-3 sm:mb-4 opacity-50 animate-pulse">🎬</div>
          <p className="text-sm xs:text-base sm:text-lg">Sin publicaciones aún</p>
          <p className="text-[10px] xs:text-xs sm:text-sm mt-1.5 xs:mt-2">Mantente atento a nuevas películas</p>
        </div>
      )}
      
      {/* ...existing code... */}
    </Card>
  );
}


/*************************** Vista de Favoritos ***************************/
function FavoritesView({favorites, posts, onPostClick, isFavorite, onToggleFavorite, isPremium}){
  // Obtener los posts que están en favoritos
  const favoritePosts = posts.filter(p => isFavorite(p.id));
  
  if (!isPremium) {
    return (
      <Card>
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-5xl mb-4 opacity-50">⭐</div>
          <p className="text-base sm:text-lg text-[#8fa1bb] mb-2">Esta función es solo para lectores premium</p>
          <p className="text-xs sm:text-sm text-[#6b7a90]">Regístrate como lector premium para acceder a esta función</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="text-2xl sm:text-3xl">❤️</div>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">Mis Películas Favoritas</h3>
        <Badge variant="primary" className="ml-auto">{favoritePosts.length}</Badge>
      </div>
      
      {favoritePosts.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-4xl sm:text-5xl mb-4 opacity-50">🤍</div>
          <p className="text-base sm:text-lg text-[#8fa1bb] mb-2">Aún no tienes películas favoritas</p>
          <p className="text-xs sm:text-sm text-[#6b7a90]">Marca películas como favoritas para verlas aquí</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
          {favoritePosts.map(p => (
            <PostSummaryCard 
              key={p.id} 
              post={p} 
              onClick={() => onPostClick(p)} 
              isPremium={isPremium}
              isFavorite={isFavorite(p.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

/*************************** Lista ***************************/
// ✅ 1. Recibe la nueva prop onUnlockLogin
function PostList({posts, users, onPostClick, currentUser, onEdit, onUnlockLogin, isPremium, isFavorite, onToggleFavorite}){
  const [author, setAuthor] = useState("all");
  const [order, setOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  // ✅ NUEVO: Filtros avanzados para colaboradores premium
  const [category, setCategory] = useState("all");
  const [year, setYear] = useState("all");
  const [streaming, setStreaming] = useState("all");
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // ✅ 2. Añade un efecto para vigilar el buscador
  useEffect(() => {
    if (searchTerm.toLowerCase() === 'admin52') {
      onUnlockLogin?.(); // Llama a la función del padre
      setSearchTerm(''); // Limpia el buscador para que la clave no se quede
    }
  }, [searchTerm, onUnlockLogin]);
  
  // Obtener años únicos y ordenados
  const availableYears = useMemo(() => {
    const years = [...new Set(posts.map(p => p.year).filter(Boolean))].sort((a, b) => b - a);
    return years;
  }, [posts]);
  
  const filtered = posts
  .filter(p => author === "all" ? true : p.author_id === author)
  .filter(p => category === "all" ? true : p.category === category)
  .filter(p => year === "all" ? true : String(p.year) === year)
  .filter(p => streaming === "all" ? true : p.streaming === streaming)
  .filter(p => {
    // La lógica de filtro normal, el `useEffect` ya se encarga de 'admin 51'
    if (!searchTerm.trim()) return true;
    const search = searchTerm.toLowerCase();
    return (
      p.spanish_title?.toLowerCase().includes(search) ||
      p.original_title?.toLowerCase().includes(search) ||
      p.director?.toLowerCase().includes(search) ||
      p.movie_cast?.toLowerCase().includes(search) ||
      p.summary?.toLowerCase().includes(search)
    );
  })
  .sort((a,b)=> order === "asc" ? new Date(a.created_at)-new Date(b.created_at) : new Date(b.created_at)-new Date(a.created_at));
    
  return (
    <Card>
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-3 xs:mb-4 sm:mb-6">
        <div className="text-xl xs:text-2xl sm:text-3xl">📚</div>
        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold">Todas Las Peliculas</h3>
      </div>
      
      <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3 mb-3 xs:mb-4 sm:mb-6">
        <div className="w-full">
          <Input 
            label="Buscar películas"
            icon="🔍"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Título, director..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3">
          <label className="text-[10px] xs:text-xs sm:text-sm">
            <span className="block text-[#a9b4c6] mb-1 xs:mb-1.5 sm:mb-2 font-medium flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>👤</span>
              Autor
            </span>
            <select 
              value={author} 
              onChange={e=>setAuthor(e.target.value)} 
              className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 md:py-3 hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-[10px] xs:text-xs sm:text-sm"
            >
              <option value="all">Todos</option>
              {users.map(u=> <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </label>
          
          <label className="text-[10px] xs:text-xs sm:text-sm">
            <span className="block text-[#a9b4c6] mb-1 xs:mb-1.5 sm:mb-2 font-medium flex items-center gap-1 xs:gap-1.5 sm:gap-2">
              <span>📊</span>
              Orden
            </span>
            <select 
              value={order} 
              onChange={e=>setOrder(e.target.value)} 
              className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 md:py-3 hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-[10px] xs:text-xs sm:text-sm"
            >
              <option value="desc">Más recientes</option>
              <option value="asc">Más antiguas</option>
            </select>
          </label>
        </div>

        {/* ✅ NUEVO: Filtros avanzados para colaboradores premium */}
        {isPremium && (
          <div className="mt-2 xs:mt-3">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg hover:border-blue-500/50 transition-all text-xs sm:text-sm"
            >
              <span className="flex items-center gap-2">
                <span>🔍</span>
                <span>Filtros Avanzados</span>
              </span>
              <span className={`transform transition-transform ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {showAdvanced && (
              <div className="mt-2 xs:mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 xs:gap-2.5 sm:gap-3 p-3 bg-gradient-to-br from-[#0f1520]/50 to-[#1a1f2e]/50 rounded-lg border border-[#243247]/50">
                <label className="text-[10px] xs:text-xs sm:text-sm">
                  <span className="block text-[#a9b4c6] mb-1 xs:mb-1.5 sm:mb-2 font-medium flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <span>📂</span>
                    Categoría
                  </span>
                  <select 
                    value={category} 
                    onChange={e=>setCategory(e.target.value)} 
                    className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 md:py-3 hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-[10px] xs:text-xs sm:text-sm"
                  >
                    <option value="all">Todas</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </label>
                
                <label className="text-[10px] xs:text-xs sm:text-sm">
                  <span className="block text-[#a9b4c6] mb-1 xs:mb-1.5 sm:mb-2 font-medium flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <span>📅</span>
                    Año
                  </span>
                  <select 
                    value={year} 
                    onChange={e=>setYear(e.target.value)} 
                    className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 md:py-3 hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-[10px] xs:text-xs sm:text-sm"
                  >
                    <option value="all">Todos</option>
                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </label>
                
                <label className="text-[10px] xs:text-xs sm:text-sm">
                  <span className="block text-[#a9b4c6] mb-1 xs:mb-1.5 sm:mb-2 font-medium flex items-center gap-1 xs:gap-1.5 sm:gap-2">
                    <span>📺</span>
                    Streaming
                  </span>
                  <select 
                    value={streaming} 
                    onChange={e=>setStreaming(e.target.value)} 
                    className="w-full bg-gradient-to-br from-[#0f1520] to-[#1a1f2e] border border-[#243247] rounded-lg md:rounded-xl px-2 xs:px-2.5 sm:px-3 md:px-4 py-1.5 xs:py-2 md:py-3 hover:border-[#2f4257] focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20 transition-all text-[10px] xs:text-xs sm:text-sm"
                  >
                    <option value="all">Todas</option>
                    {STREAMING_PLATFORMS.map(plat => <option key={plat} value={plat}>{plat}</option>)}
                  </select>
                </label>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 xs:mt-4 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 xs:gap-3 sm:gap-4">
        {filtered.map(p=> (
          <PostSummaryCard 
            key={p.id} 
            post={p} 
            onClick={() => onPostClick(p)} 
            onEdit={onEdit}
            currentUser={currentUser}
            showActions={!!currentUser}
            isPremium={isPremium}
            isFavorite={isFavorite?.(p.id)}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
        {filtered.length===0 && (
          <div className="col-span-full text-center py-6 xs:py-8 sm:py-12 text-[#8fa1bb]">
            <div className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl mb-2 xs:mb-3 sm:mb-4 opacity-50">🔍</div>
            <p className="text-sm xs:text-base sm:text-lg">No hay películas con ese filtro</p>
            <p className="text-[10px] xs:text-xs sm:text-sm mt-1.5 xs:mt-2">Intenta con otros criterios de búsqueda</p>
          </div>
        )}
      </div>
    </Card>
  );
}

/*************************** App principal ***************************/
export default function App(){
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

function MainApp(){
  const {users, currentUser, logout, loginPremium, signUpPremium, updateUserRole} = useAuth();

  // ✅ Usar hooks de Supabase
  const { posts, createPost, updatePost, deletePost } = useSupabasePosts();
  
  // ✅ NUEVO: Hook de favoritos para colaboradores premium
  const isPremium = currentUser?.role === 'colaborador_premium';
  const { favorites, toggleFavorite, isFavorite } = useFavorites(isPremium ? currentUser?.id : null);
 
  // ✅ ESTADO MODIFICADO: controla si el login está desbloqueado
  const [isLoginUnlocked, setIsLoginUnlocked] = useState(false);
  
  // ✅ ESTADO NUEVO: Controla visibilidad de los modales de Autores y Acerca de
  const [authorsOpen, setAuthorsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  // ✅ ESTADO NUEVO: Controla visibilidad del modal de Lector Premium
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  
  // ✅ ESTADO NUEVO: Controla visibilidad del panel de administración
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  
  // ✅ NUEVO: Controla si se muestra la vista de favoritos
  const [showFavorites, setShowFavorites] = useState(false);
  
  // ✅ NUEVO: Sistema de notificaciones para colaboradores premium
  const [notifications, setNotifications] = useState([]);
  const [lastPostCount, setLastPostCount] = useState(posts.length);
  
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [notice, setNotice] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  // ✅ NUEVO: Detectar nuevos posts y mostrar notificaciones
  useEffect(() => {
    if (isPremium && posts.length > lastPostCount) {
      const newPosts = posts.slice(0, posts.length - lastPostCount);
      newPosts.forEach(post => {
        const notification = {
          id: Date.now() + Math.random(),
          type: 'new_post',
          message: `🎬 Nueva película: ${post.spanish_title || post.original_title}`,
          postId: post.id,
          timestamp: new Date()
        };
        setNotifications(prev => [notification, ...prev]);
      });
      setLastPostCount(posts.length);
    }
  }, [posts.length, lastPostCount, isPremium, posts]);

  // Auto-eliminar notificaciones después de 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(n => {
        const age = Date.now() - n.timestamp.getTime();
        return age < 5000; // Mantener por 5 segundos
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCreate = async (payload) => {
    // Verificar permisos antes de crear
    if (!currentUser || !canCreatePost(currentUser.role)) {
      setNotice(`❌ Error: No tienes permisos para crear posts. Solo administradores y editores pueden crear contenido.`);
      return;
    }
    
    const { error } = await createPost(payload);
    if (error) {
      setNotice(`❌ Error: ${error}`);
    } else {
      setNotice(`✅ Película publicada: ${payload.spanish_title}`);
    }
  };

  const handleEdit = (post) => {
    // Verificar permisos antes de editar
    if (!currentUser || !canEditPost(currentUser.role, currentUser.id, post)) {
      setNotice(`❌ Error: No tienes permisos para editar este post.`);
      return;
    }
    
    setEditingPost(post);
    setSelectedPost(null);
  };

  const handleSaveEdit = async (updatedPost) => {
    // Obtener el post original para verificar permisos
    const originalPost = posts.find(p => p.id === updatedPost.id);
    if (!originalPost) {
      setNotice(`❌ Error: Post no encontrado.`);
      return;
    }
    
    // Verificar permisos antes de guardar
    if (!currentUser || !canEditPost(currentUser.role, currentUser.id, originalPost)) {
      setNotice(`❌ Error: No tienes permisos para editar este post.`);
      setEditingPost(null);
      return;
    }
    
    const { error } = await updatePost(updatedPost.id, updatedPost);
    if (error) {
      setNotice(`❌ Error: ${error}`);
    } else {
      setEditingPost(null);
      setNotice(`✅ Película "${updatedPost.spanish_title}" actualizada correctamente`);
    }
  };
  
  const handleDelete = async (post) => {
    // Verificar permisos antes de eliminar
    if (!currentUser || !canDeletePost(currentUser.role, currentUser.id, post)) {
      setNotice(`❌ Error: No tienes permisos para eliminar este post.`);
      return;
    }
    
    if (window.confirm(`¿Estás seguro de eliminar "${post.spanish_title}"?`)) {
      const { error } = await deletePost(post.id);
      if (error) {
        setNotice(`❌ Error: ${error}`);
      } else {
        setSelectedPost(null);
        setNotice(`✅ Película "${post.spanish_title}" eliminada correctamente`);
      }
    }
  };

  useEffect(()=>{
    if (process.env.NODE_ENV !== 'production') {
      try {
        const res = __runPostDetailViewPlusTests?.();
        if (res && !res.ok) console.warn("Tests fallidos", res.results);
      } catch {}
    }
  },[]);
  
  if (showSplash) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#1a0f1f] text-[#e6edf6] relative overflow-hidden flex items-center justify-center">
        {/* Efectos de fondo animados */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Contenido central */}
        <div className="relative z-10 text-center px-4 max-w-4xl">
         {/* ... dentro de if (showSplash) */}
          {/* Modelo 3D Interactivo */}
        <div className="mb-8 h-64 sm:h-80 md:h-96 w-full ...">
  <ClapperModelViewer />
</div>
          {/* Título principal */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wide mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              25 GRANDES PELÍCULAS
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-[#a9b4c6] font-medium mb-3 animate-fade-in" style={{animationDelay: '0.2s'}}>
            DE CIENCIA FICCIÓN Y TECNOLOGÍA
          </p>
          
          <p className="text-sm sm:text-base md:text-lg text-[#8fa1bb] mb-12 animate-fade-in" style={{animationDelay: '0.4s'}}>
            DE LA HISTORIA DEL CINE
          </p>

          {/* Botón de entrada */}
          <button
            onClick={() => setShowSplash(false)}
            className="group relative px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-bold transition-all duration-500 transform hover:scale-110 active:scale-95 animate-fade-in"
            style={{animationDelay: '0.6s'}}
          >
            {/* Fondo del botón con gradiente animado */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl opacity-100 group-hover:opacity-0 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Brillo animado */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>

            {/* Texto del botón */}
            <span className="relative flex items-center gap-3 text-white">
              EXPLORAR PELÍCULAS
              <span className="text-2xl transform group-hover:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </button>

          {/* Texto informativo */}
          <p className="mt-8 text-xs sm:text-sm text-[#6b7a90] animate-fade-in" style={{animationDelay: '0.8s'}}>
            Una colección de las mejores películas de ciencia ficción de todos los tiempos.
          </p>
        </div>

        {/* Partículas decorativas */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Estilos de animación */}
        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 0.6; }
            90% { opacity: 0.3; }
          }
          .animate-fade-in { animation: fade-in 1s ease-out forwards; opacity: 0; }
          .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
          .animate-shimmer { animation: shimmer 2s infinite; }
          .animate-float { animation: float linear infinite; }
        `}</style>
      </div>
    );
  }

  return (
    <Page>
      {/* ✅ NUEVO: Header Integrado */}
      <Header 
        onOpenAuthors={() => setAuthorsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        currentUser={currentUser}
        logout={logout}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        showFavorites={showFavorites}
        isPremium={isPremium}
        onOpenAdmin={() => setAdminPanelOpen(true)}
      />

      <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 py-3 xs:py-4 md:py-6 grid gap-3 xs:gap-4 sm:gap-6 md:gap-8 w-full">
        <DailyCarousel 
          posts={posts} 
          onPostClick={setSelectedPost} 
          currentUser={currentUser}
          onEdit={handleEdit}
        />
        
        {/* ✅ NUEVO: Vista de Favoritos para colaboradores premium */}
        {isPremium && showFavorites && (
          <FavoritesView 
            favorites={favorites}
            posts={posts}
            onPostClick={setSelectedPost}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            isPremium={isPremium}
          />
        )}

        {(!isPremium || !showFavorites) && (
          <PostList 
            posts={posts} 
            users={users} 
            onPostClick={setSelectedPost}
            currentUser={currentUser}
            onEdit={handleEdit}
            onUnlockLogin={() => setIsLoginUnlocked(true)}
            isPremium={isPremium}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {/* ✅ Renderizado condicional del modal de login */}
        {!currentUser && isLoginUnlocked && (
          <Modal onClose={() => setIsLoginUnlocked(false)} maxWidth="max-w-4xl">
            <LoginPanel />
          </Modal>
        )}

        {/* ✅ NUEVO: Notificaciones para colaboradores premium */}
        {isPremium && notifications.length > 0 && (
          <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map(notif => (
              <div
                key={notif.id}
                className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-xl rounded-xl p-3 sm:p-4 border border-blue-400/50 shadow-xl animate-fadeIn"
                onClick={() => {
                  const post = posts.find(p => p.id === notif.postId);
                  if (post) {
                    setSelectedPost(post);
                    setNotifications(prev => prev.filter(n => n.id !== notif.id));
                  }
                }}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl flex-shrink-0">🔔</span>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white">{notif.message}</p>
                    <p className="text-[10px] sm:text-xs text-white/70 mt-1">Haz clic para ver</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifications(prev => prev.filter(n => n.id !== notif.id));
                    }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentUser && (
          <>
            {notice && (
              <div className={`rounded-xl md:rounded-2xl p-3 sm:p-4 border flex items-start sm:items-center gap-2 sm:gap-3 text-xs sm:text-sm ${
                notice.startsWith('✅') 
                  ? 'bg-green-900/20 border-green-700 text-green-200' 
                  : 'bg-yellow-900/30 border-yellow-700 text-yellow-200'
              }`}>
                <span className="text-lg sm:text-2xl flex-shrink-0">{notice.startsWith('✅') ? '✅' : '⚠️'}</span>
                <span>{notice.replace(/^[✅⚠️]\s*/, '')}</span>
              </div>
            )}
            
            {/* Solo mostrar el formulario si el usuario tiene permisos */}
            {canAccessPostForm(currentUser.role) && (
              <PostForm onSubmit={handleCreate} currentUser={currentUser} />
            )}
          </>
        )}

        {/* ✅ NUEVO: Botón de Lector Premium - Solo visible para usuarios no autenticados o colaboradores básicos */}
        {(!currentUser || (currentUser.role !== 'colaborador_premium' && currentUser.role !== 'admin' && currentUser.role !== 'editor' && currentUser.role !== 'editor_senior' && currentUser.role !== 'editor_junior')) && (
          <div className="flex justify-center py-6 sm:py-8 md:py-10">
            <Button
              onClick={() => setPremiumModalOpen(true)}
              variant="primary"
              icon="⭐"
              className="text-base sm:text-lg px-6 sm:px-8 md:px-10 py-3 sm:py-4"
            >
              ¿Quieres ser lector premium?
            </Button>
          </div>
        )}
      </div>

      {/* ✅ NUEVO: Footer Integrado */}
      <Footer 
        onOpenAuthors={() => setAuthorsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
      />

      {/* Modales de Detalles de Película */}
      {selectedPost && (
        <Modal onClose={() => setSelectedPost(null)}>
          <PostDetailViewPlus 
            post={selectedPost} 
            currentUser={currentUser}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isPremium={isPremium}
            isFavorite={isFavorite(selectedPost.id)}
            onToggleFavorite={toggleFavorite}
          />
        </Modal>
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={handleSaveEdit}
        />
      )}
      
      {/* ✅ NUEVO: Modales de Autores y Acerca de */}
      {authorsOpen && (
        <AuthorsModal 
          onClose={() => setAuthorsOpen(false)} 
          users={users} 
          posts={posts} 
        />
      )}
      
      {aboutOpen && (
        <AboutModal onClose={() => setAboutOpen(false)} />
      )}

      {/* ✅ NUEVO: Modal de Lector Premium */}
      {premiumModalOpen && (
        <Modal onClose={() => setPremiumModalOpen(false)} maxWidth="max-w-4xl">
          <PremiumCollaboratorModal 
            onClose={() => setPremiumModalOpen(false)}
            onLogin={loginPremium}
            onSignUp={signUpPremium}
          />
        </Modal>
      )}

      {/* ✅ NUEVO: Panel de Administración */}
      {adminPanelOpen && currentUser?.role === 'admin' && (
        <Modal onClose={() => setAdminPanelOpen(false)} maxWidth="max-w-6xl">
          <AdminPanel 
            users={users}
            onUpdateRole={updateUserRole}
            onClose={() => setAdminPanelOpen(false)}
          />
        </Modal>
      )}
    </Page>
  );
}
// Estilos CSS personalizados
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #0a0e1a;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #243247;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #2f4257;
    }
  `;
  if (!document.querySelector('style[data-custom-scrollbar]')) {
    styleSheet.setAttribute('data-custom-scrollbar', 'true');
    document.head.appendChild(styleSheet);
  }
}
export function __runPostDetailViewPlusTests() {
  if (typeof window === "undefined") return { ok: true };
  const results = [];
  results.push({ name: "isVideo mp4", ok: isVideo("x.mp4") === true });
  results.push({ name: "isAudio mp3", ok: isAudio("x.mp3") === true });
  const yid = getYouTubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  results.push({ name: "YouTube ID", ok: yid === "dQw4w9WgXcQ" });
  const failed = results.filter((r) => !r.ok);
  return { ok: failed.length === 0, results };
}