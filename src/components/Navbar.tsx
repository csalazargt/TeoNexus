import React from 'react';
import {
  Sun,
  Moon,
  Bookmark,
  Bell,
  Wifi,
  WifiOff,
  User,
  Search,
  Rss,
  QrCode,
} from 'lucide-react';
import { ThemeMode } from '../types/blog';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  savedCount: number;
  unreadNotifsCount: number;
  isOnline: boolean;
  onOpenSaved: () => void;
  onOpenNotifications: () => void;
  onOpenAbout: () => void;
  onOpenQRScanner: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  savedCount,
  unreadNotifsCount,
  isOnline,
  onOpenSaved,
  onOpenNotifications,
  onOpenAbout,
  onOpenQRScanner,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-stone-50/90 dark:bg-stone-950/90 border-b border-stone-200/70 dark:border-stone-800/70 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex flex-col"
          >
            <div className="flex items-center gap-2">
              <span className="font-display tracking-widest text-xl font-bold text-stone-900 dark:text-stone-50 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                TEONEXUS
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-amber-100/70 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300/40 dark:border-amber-700/40">
                RSS
              </span>
            </div>
            <span className="text-[11px] text-stone-500 dark:text-stone-400 font-normal tracking-wide hidden sm:inline">
              Pensar la fe con profundidad · csalazar.org
            </span>
          </a>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search Toggle */}
          <button
            onClick={onToggleSearch}
            aria-label="Buscar artículos"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors"
            title="Buscar artículos"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* QR Code Camera Scanner */}
          <button
            onClick={onOpenQRScanner}
            aria-label="Escanear código QR con cámara"
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Escanear código QR con la cámara del dispositivo"
          >
            <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-medium hidden lg:inline">Escanear QR</span>
          </button>

          {/* Offline / Online indicator */}
          <div
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${
              isOnline
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50'
                : 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50'
            }`}
            title={isOnline ? 'Conexión activa con csalazar.org' : 'Sin conexión a internet (modo offline)'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 animate-pulse text-emerald-600" />
                <span>En línea</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-amber-600" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Bookmarks / Saved for Offline */}
          <button
            onClick={onOpenSaved}
            aria-label="Artículos guardados offline"
            className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors flex items-center gap-1.5"
            title="Ver artículos guardados para leer sin internet"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="text-xs font-semibold px-1.5 py-0.2 rounded-full bg-amber-600 text-white text-[11px] leading-tight min-w-4 text-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            aria-label="Notificaciones de nuevos artículos"
            className="relative p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors"
            title="Notificaciones push"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
            )}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
            className="p-2 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/50 dark:hover:bg-stone-800/50 rounded-lg transition-colors"
            title={`Modo actual: ${theme === 'dark' ? 'Oscuro' : 'Claro'}`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          {/* About / Contact */}
          <button
            onClick={onOpenAbout}
            aria-label="Acerca del autor y contacto"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors ml-1 shadow-sm"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Carlos Salazar</span>
            <span className="sm:hidden">Bio</span>
          </button>
        </div>
      </div>

      {/* Expandable Search Bar */}
      {isSearchOpen && (
        <div className="border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/70 dark:bg-stone-900/70 px-4 py-2.5 transition-all">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, temática o extracto en el blog..."
              autoFocus
              className="w-full bg-white dark:bg-stone-800/90 border border-stone-300 dark:border-stone-700 rounded-lg pl-9 pr-10 py-1.5 text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-xs text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
