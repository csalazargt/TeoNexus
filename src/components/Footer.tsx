import React from 'react';
import { Rss, ArrowUp, Heart, ExternalLink, Globe } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  categories: string[];
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  categories,
  onSelectCategory,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200/80 dark:border-stone-800/80 bg-stone-100/50 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400 py-12 transition-colors mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-display tracking-widest text-lg font-bold text-stone-900 dark:text-stone-100">
                TEONEXUS
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                csalazar.org
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-md text-stone-500 dark:text-stone-400">
              «Pensar la fe con profundidad, vivirla con sencillez». Blog de reflexión teológica, ética, tecnología y vida cristiana escrito por Carlos Salazar.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <a
                href="https://csalazar.org/feed/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline"
              >
                <Rss className="w-3.5 h-3.5" />
                <span>Feed RSS 2.0</span>
              </a>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <a
                href="https://csalazar.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-stone-600 dark:text-stone-300 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Sitio Web Oficial</span>
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200 mb-3">
              Categorías
            </h4>
            <ul className="space-y-1.5 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-200">
              Contacto y Acerca de
            </h4>
            <p className="text-xs leading-relaxed">
              Carlos Salazar
              <br />
              <span className="font-mono text-[11px] text-stone-500">csalazar.gt@gmail.com</span>
            </p>
            <button
              onClick={onOpenAbout}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline block pt-1"
            >
              Ver biografía y formulario de contacto →
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} TeoNexus · Carlos Salazar. Todos los derechos reservados.
          </div>

          <button
            onClick={scrollToTop}
            aria-label="Volver arriba"
            className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          >
            <span>Volver arriba</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
