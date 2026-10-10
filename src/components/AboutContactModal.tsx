import React, { useState } from 'react';
import {
  X,
  Mail,
  Rss,
  Globe,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface AboutContactModalProps {
  onClose: () => void;
}

export const AboutContactModal: React.FC<AboutContactModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'contact' | 'feed'>('about');

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedFeed, setCopiedFeed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Build mailto fallback link as direct fallback
    const mailtoUrl = `mailto:csalazar.gt@gmail.com?subject=${encodeURIComponent(
      subject || 'Mensaje desde la app TeoNexus'
    )}&body=${encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`
    )}`;

    // Set state
    setSubmitted(true);

    // Open mail client optionally
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);
  };

  const copyFeedUrl = () => {
    navigator.clipboard.writeText('https://csalazar.org/feed/');
    setCopiedFeed(true);
    setTimeout(() => setCopiedFeed(false), 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold tracking-wider text-base text-stone-900 dark:text-stone-100">
              TEONEXUS
            </span>
            <span className="text-xs text-stone-400">·</span>
            <span className="text-xs text-stone-600 dark:text-stone-400">
              Carlos Salazar
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar ventana"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('about')}
            className={`pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-amber-600 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Acerca de mí y el blog
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
              activeTab === 'contact'
                ? 'border-amber-600 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Contacto directo
          </button>
          <button
            onClick={() => setActiveTab('feed')}
            className={`pb-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
              activeTab === 'feed'
                ? 'border-amber-600 text-stone-900 dark:text-stone-100'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Feed RSS
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'about' && (
            <div className="space-y-6">
              {/* Bio Profile Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/70 dark:border-stone-800/70">
                <img
                  src="https://1.gravatar.com/avatar/a14c912ab081efb57450b299edaeda0bf778e1fc94f5514598de0ef54fa38cf5?s=120"
                  alt="Carlos Salazar"
                  className="w-20 h-20 rounded-full object-cover shadow-sm border-2 border-amber-600/30"
                />
                <div className="space-y-1.5 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-reading">
                    Carlos Salazar
                  </h2>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    Autor, Teólogo y Ensayista · Creador de TeoNexus
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed pt-1 font-sans">
                    «Pensar la fe con profundidad, vivirla con sencillez». TeoNexus es un espacio de reflexión teológica, ética contemporánea, cultura digital y vida cristiana práctica.
                  </p>
                </div>
              </div>

              {/* Pillars of the Blog */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Ejes temáticos de lectura
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                      Teología y Apologética
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      Diálogo honesto entre fe, razón y preguntas complejas de la existencia sin dogmatismos ciegos.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                      Fe, Cultura e Inteligencia Artificial
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      Exploración del impacto de las nuevas tecnologías, algoritmos y arte generativo en la espiritualidad.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                      Iglesia y Liderazgo
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      Desafíos de la comunidad de fe en el siglo XXI, vocación pastoral y servicio con autenticidad.
                    </span>
                  </div>

                  <div className="p-3.5 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                      Ética y Vida Cotidiana
                    </span>
                    <span className="text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      Desde la soledad moderna y el descanso sabático hasta el cuidado de la creación y la justicia social.
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://csalazar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Visitar blog original (csalazar.org)</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>

                <button
                  onClick={() => setActiveTab('contact')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Escribir al autor</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-5">
              {submitted ? (
                <div className="p-8 text-center space-y-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    ¡Mensaje preparado con éxito!
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-300 max-w-sm mx-auto">
                    Se ha abierto tu cliente de correo para enviar el mensaje a <strong>csalazar.gt@gmail.com</strong>.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-amber-700 dark:text-amber-400 underline pt-2"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Tu nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. María Gómez"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                        Tu correo electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Consulta sobre un artículo de TeoNexus..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribe aquí tu consulta, reflexión o comentario sobre los artículos..."
                      className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Destino: csalazar.gt@gmail.com</span>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Enviar mensaje</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'feed' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
                  <Rss className="w-4 h-4" />
                  <span>Suscripción RSS Oficial</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                  Esta aplicación sincroniza automáticamente todas las publicaciones directamente desde el feed XML RSS 2.0 del blog de WordPress en <code>https://csalazar.org/feed/</code>.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-stone-700 dark:text-stone-300">
                  URL del Feed RSS:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://csalazar.org/feed/"
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-[11px]"
                  />
                  <button
                    onClick={copyFeedUrl}
                    className="px-3 py-2 shrink-0 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium flex items-center gap-1.5 hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedFeed ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-stone-500 dark:text-stone-400 space-y-1 text-[11px]">
                <p>• Sincronización en tiempo real con WordPress.</p>
                <p>• Extracción automática de títulos, fechas, resúmenes, categorías e imágenes destacadas.</p>
                <p>• Soporte de lectura offline con almacenamiento local de cada publicación.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
