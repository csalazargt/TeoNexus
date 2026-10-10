import React from 'react';
import { BlogPost } from '../types/blog';
import { Bookmark, BookmarkCheck, ArrowRight, Clock, Calendar, Share2, ExternalLink, QrCode } from 'lucide-react';

interface HeroFeaturedProps {
  post: BlogPost;
  onReadPost: (post: BlogPost) => void;
  onToggleSave: (post: BlogPost) => void;
  isSaved: boolean;
  onShare: (post: BlogPost) => void;
  onShowQRCode?: (post: BlogPost) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  post,
  onReadPost,
  onToggleSave,
  isSaved,
  onShare,
  onShowQRCode,
}) => {
  return (
    <section className="relative mb-12 sm:mb-16 border-b border-stone-200/80 dark:border-stone-800/80 pb-10 sm:pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Editorial Information */}
        <div className="lg:col-span-7 flex flex-col justify-center order-2 lg:order-1">
          {/* Unboxed editorial category kicker & metadata */}
          <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-amber-700 dark:text-amber-400 mb-3 tracking-wide">
            <span className="uppercase tracking-widest text-[11px] font-semibold">
              {post.categories[0] || 'Artículo Destacado'}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-stone-400" />
              {post.formattedDate}
            </span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span className="text-stone-500 dark:text-stone-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-stone-400" />
              {post.readingTimeMinutes} min de lectura
            </span>
          </div>

          {/* Headline */}
          <h1
            onClick={() => onReadPost(post)}
            className="cursor-pointer font-serif-reading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50 hover:text-amber-700 dark:hover:text-amber-400 transition-colors leading-[1.25] mb-4"
          >
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
            {post.excerpt}
          </p>

          {/* Author info & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Author */}
            <div className="flex items-center gap-2.5">
              {post.authorAvatar ? (
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                  loading="lazy"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-xs font-semibold text-stone-700 dark:text-stone-300">
                  CS
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-stone-900 dark:text-stone-100">
                  {post.author}
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  TeoNexus · csalazar.org
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onReadPost(post)}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Leer artículo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onToggleSave(post)}
                aria-label={isSaved ? 'Quitar de guardados' : 'Guardar para lectura offline'}
                className={`p-2 rounded-lg border transition-colors ${
                  isSaved
                    ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                    : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
                title={isSaved ? 'Guardado para leer sin conexión' : 'Guardar offline'}
              >
                {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>

              <button
                onClick={() => onShare(post)}
                aria-label="Compartir enlace"
                className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Compartir artículo"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {onShowQRCode && (
                <button
                  onClick={() => onShowQRCode(post)}
                  aria-label="Ver código QR del artículo"
                  className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  title="Ver código QR para escanear con móvil"
                >
                  <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </button>
              )}

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Abrir en el blog oficial csalazar.org"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Image with Editorial Frame */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <div
            onClick={() => onReadPost(post)}
            className="group cursor-pointer relative aspect-16/10 overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-800 shadow-md transition-transform duration-300 hover:-translate-y-1"
          >
            {post.featuredImage ? (
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-amber-900/10 via-stone-200 dark:via-stone-800 to-amber-950/20 p-6 text-center">
                <span className="font-serif-reading text-xl text-stone-400 font-semibold italic">
                  TeoNexus
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-stone-900/10 dark:bg-stone-950/20 group-hover:opacity-0 transition-opacity" />
          </div>
        </div>
      </div>
    </section>
  );
};
