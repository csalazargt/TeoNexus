import React from 'react';
import { BlogPost, ViewMode } from '../types/blog';
import { Bookmark, BookmarkCheck, Clock, Calendar, ArrowRight, Share2, ExternalLink, QrCode } from 'lucide-react';

interface PostCardProps {
  post: BlogPost;
  viewMode: ViewMode;
  onReadPost: (post: BlogPost) => void;
  onToggleSave: (post: BlogPost) => void;
  isSaved: boolean;
  onShare: (post: BlogPost) => void;
  onShowQRCode?: (post: BlogPost) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  viewMode,
  onReadPost,
  onToggleSave,
  isSaved,
  onShare,
  onShowQRCode,
}) => {
  if (viewMode === 'list') {
    return (
      <article className="group py-5 border-b border-stone-200/70 dark:border-stone-800/70 transition-colors">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
          {/* List Content */}
          <div className="flex-1 min-w-0">
            {/* Unboxed metadata with typographic separators (NO static pills) */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-amber-700 dark:text-amber-400 mb-1.5">
              <span className="uppercase tracking-wider text-[11px] font-semibold">
                {post.categories[0] || 'General'}
              </span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-400" />
                {post.formattedDate}
              </span>
              <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
              <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-400" />
                {post.readingTimeMinutes} min
              </span>
            </div>

            <h2
              onClick={() => onReadPost(post)}
              className="cursor-pointer font-serif-reading text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-2 leading-snug"
            >
              {post.title}
            </h2>

            <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-3 font-sans">
              {post.excerpt}
            </p>

            {/* List Actions */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => onReadPost(post)}
                className="font-medium text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
              >
                <span>Leer artículo</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => onToggleSave(post)}
                className={`p-1.5 rounded transition-colors ${
                  isSaved
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                    : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200'
                }`}
                title={isSaved ? 'Guardado offline' : 'Guardar offline'}
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => onShare(post)}
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
                title="Compartir"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {onShowQRCode && (
                <button
                  onClick={() => onShowQRCode(post)}
                  className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 rounded transition-colors"
                  title="Ver código QR del artículo"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>
              )}

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded transition-colors"
                title="Abrir en blog csalazar.org"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* List Thumbnail */}
          {post.featuredImage && (
            <div
              onClick={() => onReadPost(post)}
              className="cursor-pointer shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800"
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </article>
    );
  }

  // Grid Mode Card
  return (
    <article className="group flex flex-col bg-stone-50 dark:bg-stone-900/60 rounded-xl border border-stone-200/80 dark:border-stone-800/80 overflow-hidden hover:border-amber-400/50 dark:hover:border-amber-600/50 hover:shadow-md transition-all duration-300">
      {/* Featured Card Image */}
      <div
        onClick={() => onReadPost(post)}
        className="cursor-pointer relative aspect-16/9 overflow-hidden bg-stone-200 dark:bg-stone-800"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-100 dark:bg-stone-800 text-stone-400 font-serif-reading text-lg italic">
            TeoNexus
          </div>
        )}
        <div className="absolute inset-0 bg-stone-900/5 dark:bg-stone-950/20 group-hover:opacity-0 transition-opacity" />
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (NO pills) */}
          <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-amber-700 dark:text-amber-400 mb-2">
            <span className="uppercase tracking-wider text-[10px] font-semibold">
              {post.categories[0] || 'General'}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1 text-[11px]">
              <Calendar className="w-3 h-3 text-stone-400" />
              {post.formattedDate}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1 text-[11px]">
              <Clock className="w-3 h-3 text-stone-400" />
              {post.readingTimeMinutes} min
            </span>
          </div>

          {/* Title */}
          <h2
            onClick={() => onReadPost(post)}
            className="cursor-pointer font-serif-reading text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors mb-2.5 leading-snug"
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-stone-600 dark:text-stone-300 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4 font-sans">
            {post.excerpt}
          </p>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between text-xs">
          <button
            onClick={() => onReadPost(post)}
            className="font-medium text-stone-900 dark:text-stone-100 hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center gap-1"
          >
            <span>Leer</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleSave(post)}
              aria-label={isSaved ? 'Quitar de guardados' : 'Guardar offline'}
              className={`p-1.5 rounded-md transition-colors ${
                isSaved
                  ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
              title={isSaved ? 'Guardado offline' : 'Guardar offline'}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => onShare(post)}
              aria-label="Compartir"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
              title="Compartir"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {onShowQRCode && (
              <button
                onClick={() => onShowQRCode(post)}
                aria-label="Ver código QR"
                className="p-1.5 text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
                title="Ver código QR del artículo"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>
            )}

            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ver original en csalazar.org"
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-md transition-colors"
              title="Ver entrada original en csalazar.org"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};
