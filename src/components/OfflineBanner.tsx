import React from 'react';
import { WifiOff, DownloadCloud } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  savedCount: number;
  onViewOfflinePosts: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  savedCount,
  onViewOfflinePosts,
}) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-900/90 text-amber-50 px-4 py-2.5 text-xs text-center border-b border-amber-800 transition-all flex items-center justify-center gap-2 flex-wrap">
      <WifiOff className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      <span>
        <strong>Modo sin conexión:</strong> Estás leyendo en modo offline. Los artículos en caché y tus lecturas guardadas siguen totalmente disponibles.
      </span>
      {savedCount > 0 && (
        <button
          onClick={onViewOfflinePosts}
          className="ml-2 underline font-medium hover:text-amber-200 inline-flex items-center gap-1"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          Ver {savedCount} guardado{savedCount === 1 ? '' : 's'}
        </button>
      )}
    </div>
  );
};
