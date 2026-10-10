import React, { useState } from 'react';
import { BlogPost } from '../types/blog';
import { X, QrCode, Copy, Check, ExternalLink, Download } from 'lucide-react';

interface QRCodeDisplayModalProps {
  post: BlogPost;
  onClose: () => void;
}

export const QRCodeDisplayModal: React.FC<QRCodeDisplayModalProps> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(
    post.link
  )}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(post.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-center">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-600" />
            <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif-reading">
              Código QR del Artículo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 flex flex-col items-center">
          <h4 className="font-serif-reading text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-2 px-2">
            {post.title}
          </h4>

          {/* QR Code Graphic */}
          <div className="p-3 bg-white rounded-xl shadow-md border border-stone-200 inline-block">
            <img
              src={qrImageUrl}
              alt={`Código QR para ${post.title}`}
              className="w-52 h-52 object-contain"
            />
          </div>

          <p className="text-[11px] text-stone-500 dark:text-stone-400 max-w-xs">
            Escanea este código con la cámara de tu teléfono para abrir esta entrada directamente.
          </p>

          {/* Link Copy */}
          <div className="w-full pt-1 flex items-center gap-2">
            <button
              onClick={copyUrl}
              className="flex-1 py-2 px-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar enlace'}</span>
            </button>

            <a
              href={qrImageUrl}
              download={`qr-${post.id}.png`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 transition-colors"
              title="Descargar imagen QR"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
