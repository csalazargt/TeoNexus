/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { BlogPost, FeedResponse, SortOrder, ViewMode, AppNotification, ThemeMode } from './types/blog';
import { fetchFeed } from './services/feed';
import {
  getSavedOfflinePosts,
  toggleSaveOfflinePost,
  isPostSavedOffline,
  getStoredNotifications,
  markNotificationsAsRead,
} from './services/storage';
import { checkForNewPostsNotification } from './services/notifications';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { HeroFeatured } from './components/HeroFeatured';
import { CategoryFilter } from './components/CategoryFilter';
import { PostCard } from './components/PostCard';
import { ReaderModal } from './components/ReaderModal';
import { AboutContactModal } from './components/AboutContactModal';
import { NotificationsModal } from './components/NotificationsModal';
import { QRScannerModal } from './components/QRScannerModal';
import { QRCodeDisplayModal } from './components/QRCodeDisplayModal';
import { Footer } from './components/Footer';
import { RefreshCw, AlertCircle, BookOpen, Search, CheckCircle, QrCode } from 'lucide-react';

export default function App() {
  // Feed & Content states
  const [feed, setFeed] = useState<FeedResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Network State
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('teonexus_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOrder>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isOnlySaved, setIsOnlySaved] = useState<boolean>(false);

  // Modals & Reader
  const [activeReaderPost, setActiveReaderPost] = useState<BlogPost | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [qrDisplayPost, setQrDisplayPost] = useState<BlogPost | null>(null);

  // Storage synced states
  const [savedPosts, setSavedPosts] = useState<BlogPost[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync Theme with HTML Document Class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('teonexus_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('teonexus_theme', 'light');
    }
  }, [theme]);

  // Handle Online / Offline network events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('✓ Conexión restablecida con el servidor');
      loadFeedData(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('⚠️ Modo sin conexión activado. Usando artículos en caché.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial Load
  const loadFeedData = async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const data = await fetchFeed();
      setFeed(data);
      // Check for push notification on new post
      if (data.posts && data.posts.length > 0) {
        checkForNewPostsNotification(data.posts);
      }
      // Sync notifications
      setNotifications(getStoredNotifications());
      // Sync saved offline posts
      setSavedPosts(getSavedOfflinePosts());
    } catch (err: any) {
      setError(err?.message || 'Error al conectar con el feed RSS');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFeedData();
    setSavedPosts(getSavedOfflinePosts());
    setNotifications(getStoredNotifications());
  }, []);

  // Theme Toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Toggle Save offline post
  const handleToggleSavePost = (post: BlogPost) => {
    const nowSaved = toggleSaveOfflinePost(post);
    setSavedPosts(getSavedOfflinePosts());
    if (nowSaved) {
      showToast(`«${post.title}» guardado para lectura sin conexión`);
    } else {
      showToast(`Artículo quitado de guardados offline`);
    }
  };

  // Share post
  const handleShare = async (post: BlogPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: post.link,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    navigator.clipboard.writeText(post.link);
    showToast('Enlace copiado al portapapeles');
  };

  // Categories extraction
  const categoriesList = useMemo(() => {
    if (!feed?.posts) return [];
    const set = new Set<string>();
    feed.posts.forEach((p) => {
      p.categories.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [feed]);

  // Filtered & Sorted Posts
  const filteredPosts = useMemo(() => {
    let list: BlogPost[] = feed?.posts || [];

    // Offline only filter
    if (isOnlySaved) {
      list = savedPosts;
    }

    // Category filter
    if (selectedCategory !== 'all' && !isOnlySaved) {
      list = list.filter((p) => p.categories.includes(selectedCategory));
    }

    // Real-time search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.categories.some((c) => c.toLowerCase().includes(q)) ||
          p.content.toLowerCase().includes(q)
      );
    }

    // Sort order
    const sorted = [...list].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime();
      }
      if (sortBy === 'readingTime') {
        return b.readingTimeMinutes - a.readingTimeMinutes;
      }
      return 0;
    });

    return sorted;
  }, [feed, isOnlySaved, savedPosts, selectedCategory, searchQuery, sortBy]);

  // Featured post is the first article when looking at all posts without search
  const isDefaultView = !isOnlySaved && selectedCategory === 'all' && !searchQuery.trim();
  const heroPost = isDefaultView && filteredPosts.length > 0 ? filteredPosts[0] : null;
  const regularPosts = heroPost ? filteredPosts.slice(1) : filteredPosts;

  // Active Reader Next / Prev indices
  const currentReaderIndex = useMemo(() => {
    if (!activeReaderPost || !feed?.posts) return -1;
    return feed.posts.findIndex((p) => p.id === activeReaderPost.id);
  }, [activeReaderPost, feed]);

  const hasNextPost = currentReaderIndex >= 0 && currentReaderIndex < (feed?.posts.length || 0) - 1;
  const hasPrevPost = currentReaderIndex > 0;

  const handleNextPost = () => {
    if (hasNextPost && feed?.posts) {
      setActiveReaderPost(feed.posts[currentReaderIndex + 1]);
    }
  };

  const handlePrevPost = () => {
    if (hasPrevPost && feed?.posts) {
      setActiveReaderPost(feed.posts[currentReaderIndex - 1]);
    }
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col transition-colors selection:bg-amber-200 dark:selection:bg-amber-900/60 selection:text-stone-900 dark:selection:text-stone-100 font-sans">
      {/* Offline Alert Banner */}
      <OfflineBanner
        isOnline={isOnline}
        savedCount={savedPosts.length}
        onViewOfflinePosts={() => {
          setIsOnlySaved(true);
          setSelectedCategory('all');
        }}
      />

      {/* Top Navbar */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        savedCount={savedPosts.length}
        unreadNotifsCount={unreadNotifsCount}
        isOnline={isOnline}
        onOpenSaved={() => {
          setIsOnlySaved(true);
          setSelectedCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNotifications={() => {
          markNotificationsAsRead();
          setNotifications(getStoredNotifications());
          setIsNotificationsOpen(true);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSearchOpen={isSearchOpen}
        onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Header Kicker / Channel Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-stone-200/60 dark:border-stone-800/60">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
              Blog TeoNexus · Carlos Salazar
            </div>
            <h2 className="font-serif-reading text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
              {isOnlySaved ? 'Lecturas Guardadas Offline' : 'Artículos y Ensayos'}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 font-sans">
              {feed?.channel?.description || 'Pensar la fe con profundidad, vivirla con sencillez.'}
            </p>
          </div>

          {/* Sync status, Scanner & Refresh button */}
          <div className="flex items-center gap-2 text-xs text-stone-500 self-start sm:self-auto">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 transition-colors"
              title="Abrir cámara para escanear código QR"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Escanear QR</span>
            </button>

            <button
              onClick={() => loadFeedData(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 transition-colors disabled:opacity-50"
              title="Sincronizar feed RSS desde https://csalazar.org/feed/"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-600' : ''}`} />
              <span>{refreshing ? 'Sincronizando...' : 'Actualizar RSS'}</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-24 text-center space-y-4">
            <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              Cargando publicaciones desde csalazar.org/feed/...
            </p>
          </div>
        )}

        {/* Error State with retry */}
        {error && !loading && (
          <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 my-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              No se pudo sincronizar el feed en este momento
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
              {error}. Si estás sin conexión, tus artículos guardados en caché siguen disponibles para lectura.
            </p>
            <button
              onClick={() => loadFeedData(true)}
              className="px-4 py-2 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Reintentar conexión
            </button>
          </div>
        )}

        {/* Content Loaded */}
        {!loading && (
          <>
            {/* Hero Featured Article (only on default unfiltered view) */}
            {heroPost && (
              <HeroFeatured
                post={heroPost}
                onReadPost={(p) => setActiveReaderPost(p)}
                onToggleSave={handleToggleSavePost}
                isSaved={isPostSavedOffline(heroPost.id)}
                onShare={handleShare}
                onShowQRCode={(p) => setQrDisplayPost(p)}
              />
            )}

            {/* Filter and Search Bar */}
            <CategoryFilter
              categories={categoriesList}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              savedCount={savedPosts.length}
              isOnlySaved={isOnlySaved}
              onToggleOnlySaved={() => setIsOnlySaved((prev) => !prev)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalFiltered={filteredPosts.length}
            />

            {/* Posts Grid or List */}
            {regularPosts.length > 0 ? (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col'
                }
              >
                {regularPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    viewMode={viewMode}
                    onReadPost={(p) => setActiveReaderPost(p)}
                    onToggleSave={handleToggleSavePost}
                    isSaved={isPostSavedOffline(post.id)}
                    onShare={handleShare}
                    onShowQRCode={(p) => setQrDisplayPost(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-3">
                <BookOpen className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
                <h3 className="text-base font-semibold text-stone-800 dark:text-stone-200">
                  {isOnlySaved
                    ? 'No tienes artículos guardados para leer offline'
                    : 'No se encontraron publicaciones'}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                  {isOnlySaved
                    ? 'Guarda cualquier artículo usando el ícono de marcador para poder leerlo sin conexión en cualquier momento.'
                    : 'Prueba a cambiar tus términos de búsqueda o a seleccionar otra categoría.'}
                </p>
                {isOnlySaved && (
                  <button
                    onClick={() => setIsOnlySaved(false)}
                    className="text-xs font-semibold text-amber-700 dark:text-amber-400 underline pt-1"
                  >
                    Ver todas las publicaciones del blog
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Reader Modal */}
      {activeReaderPost && (
        <ReaderModal
          post={activeReaderPost}
          onClose={() => setActiveReaderPost(null)}
          onToggleSave={handleToggleSavePost}
          isSaved={isPostSavedOffline(activeReaderPost.id)}
          onShare={handleShare}
          onShowQRCode={(p) => setQrDisplayPost(p)}
          onNextPost={handleNextPost}
          onPrevPost={handlePrevPost}
          hasNext={hasNextPost}
          hasPrev={hasPrevPost}
        />
      )}

      {/* About & Contact Modal */}
      {isAboutOpen && <AboutContactModal onClose={() => setIsAboutOpen(false)} />}

      {/* Push Notifications Modal */}
      {isNotificationsOpen && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onClearNotifications={() => {
            localStorage.removeItem('teonexus_notifications_list');
            setNotifications([]);
          }}
          onSelectPostLink={(link) => {
            const found = feed?.posts.find((p) => p.link === link);
            if (found) {
              setActiveReaderPost(found);
              setIsNotificationsOpen(false);
            }
          }}
        />
      )}

      {/* Camera QR Code Scanner Modal */}
      {isQRScannerOpen && (
        <QRScannerModal
          onClose={() => setIsQRScannerOpen(false)}
          posts={feed?.posts || []}
          onOpenArticle={(post) => {
            setActiveReaderPost(post);
            setIsQRScannerOpen(false);
          }}
        />
      )}

      {/* Article QR Code Display Modal */}
      {qrDisplayPost && (
        <QRCodeDisplayModal
          post={qrDisplayPost}
          onClose={() => setQrDisplayPost(null)}
        />
      )}

      {/* Mobile Floating Action Button for Quick QR Scanning */}
      <button
        onClick={() => setIsQRScannerOpen(true)}
        aria-label="Escanear código QR"
        className="sm:hidden fixed bottom-6 left-6 z-30 p-3.5 rounded-full bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all border border-stone-700/50"
        title="Abrir cámara y escanear código QR"
      >
        <QrCode className="w-5 h-5 text-amber-500" />
      </button>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setIsAboutOpen(true)}
        categories={categoriesList}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsOnlySaved(false);
        }}
      />

      {/* In-App Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
