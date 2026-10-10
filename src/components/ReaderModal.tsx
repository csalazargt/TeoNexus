import React, { useEffect, useState, useRef } from 'react';
import { BlogPost, FontSize, FontFamily, ReaderTheme } from '../types/blog';
import {
  X,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Type,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  Check,
  QrCode,
} from 'lucide-react';

interface ReaderModalProps {
  post: BlogPost;
  onClose: () => void;
  onToggleSave: (post: BlogPost) => void;
  isSaved: boolean;
  onShare: (post: BlogPost) => void;
  onShowQRCode?: (post: BlogPost) => void;
  onNextPost?: () => void;
  onPrevPost?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  post,
  onClose,
  onToggleSave,
  isSaved,
  onShare,
  onShowQRCode,
  onNextPost,
  onPrevPost,
  hasNext,
  hasPrev,
}) => {
  // Reading customization state
  const [fontSize, setFontSize] = useState<FontSize>('lg');
  const [fontFamily, setFontFamily] = useState<FontFamily>('serif');
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('sepia');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const el = containerRef.current;
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    const currentEl = containerRef.current;
    if (currentEl) {
      currentEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentEl) currentEl.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle keyboard shortcuts (ESC, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev && onPrevPost) {
        onPrevPost();
      } else if (e.key === 'ArrowRight' && hasNext && onNextPost) {
        onNextPost();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevPost, onNextPost, hasPrev, hasNext]);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Voice narration toggle (Spanish voice synthesis)
  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      if (isPaused) {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } else {
        window.speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    // Start speaking
    window.speechSynthesis.cancel();
    const cleanText = `${post.title}. Por ${post.author}. ${post.excerpt}. ${(post.content || '').replace(/<[^>]+>/g, ' ')}`;
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.95;

    // Pick Spanish voice if available
    const voices = window.speechSynthesis.getVoices();
    const spanishVoice = voices.find((v) => v.lang.startsWith('es'));
    if (spanishVoice) utterance.voice = spanishVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const copyPostUrl = () => {
    navigator.clipboard.writeText(post.link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Font size classes
  const fontSizeClass = {
    sm: 'text-base',
    base: 'text-lg',
    lg: 'text-xl leading-relaxed',
    xl: 'text-2xl leading-relaxed',
  }[fontSize];

  // Reader theme colors
  const themeStyles = {
    light: 'bg-white text-stone-900 border-stone-200',
    sepia: 'bg-[#faf6ee] text-[#2c2825] border-[#eae0ce]',
    dark: 'bg-[#141416] text-[#e2e1dd] border-stone-800',
  }[readerTheme];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Container */}
      <div
        className={`w-full h-full sm:h-[95vh] max-w-4xl rounded-none sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors ${themeStyles}`}
      >
        {/* Progress Bar */}
        <div className="h-1 w-full bg-stone-200/50 dark:bg-stone-800/50">
          <div
            className="h-full bg-amber-600 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Top Sticky Toolbar */}
        <div
          className={`shrink-0 px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 select-none ${
            readerTheme === 'dark'
              ? 'border-stone-800 bg-[#141416]/90'
              : readerTheme === 'sepia'
              ? 'border-[#eae0ce] bg-[#faf6ee]/90'
              : 'border-stone-200 bg-white/90'
          } backdrop-blur-sm`}
        >
          {/* Left: Close & Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Cerrar lector"
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a la lista</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 border-l border-current/15 pl-2 ml-1">
              <button
                onClick={onPrevPost}
                disabled={!hasPrev}
                aria-label="Artículo anterior"
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Artículo anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={onNextPost}
                disabled={!hasNext}
                aria-label="Artículo siguiente"
                className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Artículo siguiente"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center / Right: Reader Customization Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs">
            {/* Audio Reader Play / Pause */}
            <div className="flex items-center">
              <button
                onClick={toggleSpeech}
                aria-label={isSpeaking ? (isPaused ? 'Reanudar lectura' : 'Pausar lectura') : 'Escuchar artículo'}
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-colors ${
                  isSpeaking
                    ? 'bg-amber-600 text-white font-medium'
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                }`}
                title="Escuchar narración de este artículo"
              >
                {isSpeaking ? (
                  isPaused ? (
                    <Play className="w-3.5 h-3.5" />
                  ) : (
                    <Pause className="w-3.5 h-3.5" />
                  )
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span className="hidden md:inline">
                  {isSpeaking ? (isPaused ? 'Reanudar' : 'Pausar') : 'Escuchar'}
                </span>
              </button>
              {isSpeaking && (
                <button
                  onClick={stopSpeech}
                  aria-label="Detener narración"
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-rose-500 ml-0.5"
                  title="Detener audio"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Font Family Switcher */}
            <button
              onClick={() => setFontFamily((prev) => (prev === 'serif' ? 'sans' : 'serif'))}
              aria-label="Alternar tipografía Serif / Sans"
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 font-semibold px-2"
              title={`Tipografía actual: ${fontFamily === 'serif' ? 'Serif Editorial' : 'Sans Minimalista'}`}
            >
              {fontFamily === 'serif' ? 'Serif' : 'Sans'}
            </button>

            {/* Font Size controls */}
            <div className="hidden sm:flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setFontSize('sm')}
                aria-label="Texto pequeño"
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  fontSize === 'sm' ? 'bg-amber-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize('base')}
                aria-label="Texto mediano"
                className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                  fontSize === 'base' ? 'bg-amber-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
              >
                A
              </button>
              <button
                onClick={() => setFontSize('lg')}
                aria-label="Texto grande"
                className={`px-2 py-0.5 rounded text-sm font-medium transition-colors ${
                  fontSize === 'lg' ? 'bg-amber-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
              >
                A+
              </button>
            </div>

            {/* Theme Surface buttons */}
            <div className="flex items-center bg-black/5 dark:bg-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setReaderTheme('sepia')}
                aria-label="Tema lectura Sepia / Papel"
                className={`w-5 h-5 rounded-md bg-[#faf6ee] border border-amber-800/30 transition-transform ${
                  readerTheme === 'sepia' ? 'scale-110 shadow-xs ring-1 ring-amber-600' : 'opacity-70'
                }`}
                title="Lectura en papel suave"
              />
              <button
                onClick={() => setReaderTheme('light')}
                aria-label="Tema lectura Blanco"
                className={`w-5 h-5 rounded-md bg-white border border-stone-300 ml-1 transition-transform ${
                  readerTheme === 'light' ? 'scale-110 shadow-xs ring-1 ring-amber-600' : 'opacity-70'
                }`}
                title="Lectura clara"
              />
              <button
                onClick={() => setReaderTheme('dark')}
                aria-label="Tema lectura Noche"
                className={`w-5 h-5 rounded-md bg-[#141416] border border-stone-700 ml-1 transition-transform ${
                  readerTheme === 'dark' ? 'scale-110 shadow-xs ring-1 ring-amber-600' : 'opacity-70'
                }`}
                title="Lectura nocturna"
              />
            </div>

            {/* Bookmark button */}
            <button
              onClick={() => onToggleSave(post)}
              aria-label={isSaved ? 'Quitar de guardados' : 'Guardar offline'}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved ? 'text-amber-600 font-bold' : 'hover:bg-black/5 dark:hover:bg-white/10'
              }`}
              title={isSaved ? 'Guardado para lectura offline' : 'Guardar offline'}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Copy / Share */}
            <button
              onClick={copyPostUrl}
              aria-label="Copiar enlace"
              className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Copiar enlace del post"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* QR Code */}
            {onShowQRCode && (
              <button
                onClick={() => onShowQRCode(post)}
                aria-label="Ver código QR del artículo"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-amber-600 dark:text-amber-400 transition-colors"
                title="Ver código QR para escanear con móvil"
              >
                <QrCode className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Reading Content */}
        <div ref={containerRef} className="flex-1 overflow-y-auto px-4 sm:px-8 md:px-16 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Header Metadata */}
            <div className="mb-6 flex flex-wrap items-center gap-x-2 text-xs font-medium text-amber-700 dark:text-amber-400">
              <span className="uppercase tracking-widest text-[11px] font-semibold">
                {post.categories.join(' · ')}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 opacity-80">
                <Calendar className="w-3 h-3" />
                {post.formattedDate}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 opacity-80">
                <Clock className="w-3 h-3" />
                {post.readingTimeMinutes} minutos de lectura
              </span>
            </div>

            {/* Article Title */}
            <h1
              className={`font-serif-reading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.25] mb-6`}
            >
              {post.title}
            </h1>

            {/* Author Byline */}
            <div className="flex items-center justify-between pb-8 mb-8 border-b border-current/10">
              <div className="flex items-center gap-3">
                {post.authorAvatar ? (
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-10 h-10 rounded-full object-cover border border-current/20"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-300 dark:bg-stone-700 flex items-center justify-center font-bold text-xs">
                    CS
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold">{post.author}</div>
                  <div className="text-xs opacity-75">TeoNexus · Pensar la fe con profundidad</div>
                </div>
              </div>

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1 underline underline-offset-4"
              >
                <span>Ver en blog original</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Featured Image */}
            {post.featuredImage && (
              <figure className="mb-10 rounded-xl overflow-hidden shadow-lg border border-current/10">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              </figure>
            )}

            {/* Article Prose Body */}
            <div
              className={`article-prose ${fontSizeClass} ${
                fontFamily === 'serif' ? 'font-serif-reading' : 'font-sans-reading'
              }`}
            >
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <div>
                  <p className="font-normal leading-relaxed">{post.excerpt}</p>
                  <div className="my-8 p-6 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                    <p className="text-sm mb-3">
                      Este artículo completo se encuentra disponible en su publicación original en WordPress.
                    </p>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-sm"
                    >
                      <span>Abrir entrada completa en csalazar.org</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Post Bottom Footer / Author Bio */}
            <div className="mt-16 pt-8 border-t border-current/10">
              <div className="p-6 rounded-xl bg-current/5 border border-current/10 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt={post.author}
                    className="w-14 h-14 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-serif-reading font-bold text-base mb-1">
                    Sobre Carlos Salazar
                  </h3>
                  <p className="text-xs opacity-80 leading-relaxed font-sans">
                    Autor y editor de TeoNexus. Teólogo, comunicador y ensayista. Explora la intersección entre la fe cristiana, la cultura contemporánea y el desarrollo tecnológico.
                  </p>
                </div>
                <a
                  href="https://csalazar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs px-3 py-1.5 rounded-md border border-current/20 hover:bg-current/10 transition-colors font-medium"
                >
                  Visitar blog
                </a>
              </div>

              {/* Prev / Next Article Navigation Footer */}
              <div className="flex items-center justify-between gap-4 mt-8 pt-6">
                {hasPrev && onPrevPost ? (
                  <button
                    onClick={onPrevPost}
                    className="flex items-center gap-2 text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Artículo anterior</span>
                  </button>
                ) : (
                  <div />
                )}

                {hasNext && onNextPost ? (
                  <button
                    onClick={onNextPost}
                    className="flex items-center gap-2 text-xs font-medium opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <span>Artículo siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
