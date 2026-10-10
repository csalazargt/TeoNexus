import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Volume2,
  Sparkles,
} from 'lucide-react';
import { AppNotification } from '../types/blog';
import {
  requestNotificationPermission,
  getNotificationPermission,
  sendLocalNotification,
} from '../services/notifications';
import { isPushNotificationsEnabled, setPushNotificationsEnabled } from '../services/storage';

interface NotificationsModalProps {
  notifications: AppNotification[];
  onClose: () => void;
  onClearNotifications: () => void;
  onSelectPostLink?: (url: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onClearNotifications,
  onSelectPostLink,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(getNotificationPermission());
  const [enabled, setEnabled] = useState<boolean>(isPushNotificationsEnabled());
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      setEnabled(true);
      sendLocalNotification(
        '🔔 Notificaciones TeoNexus activadas',
        'Recibirás un aviso cada vez que Carlos Salazar publique una nueva reflexión.',
        'https://csalazar.org'
      );
      setTestSuccess('¡Notificaciones activadas y prueba enviada!');
      setTimeout(() => setTestSuccess(null), 4000);
    }
  };

  const handleToggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    setPushNotificationsEnabled(next);
  };

  const handleSendTestNotification = () => {
    sendLocalNotification(
      '🔔 Nuevo artículo en TeoNexus',
      '«El camino de Damasco: cuando Dios confronta nuestras certezas» ya está disponible para leer.',
      'https://csalazar.org/2026/09/27/el-camino-de-damasco-cuando-dios-confronta-nuestras-certezas/'
    );
    setTestSuccess('Se ha emitido la notificación con aviso sonoro.');
    setTimeout(() => setTestSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-reading">
              Notificaciones de Nuevas Publicaciones
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600 dark:text-stone-400 font-medium">
                Permiso en el navegador:
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                  permission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : permission === 'denied'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {permission === 'granted'
                  ? 'Autorizado'
                  : permission === 'denied'
                  ? 'Bloqueado por el navegador'
                  : 'Pendiente de solicitud'}
              </span>
            </div>

            {permission !== 'granted' ? (
              <button
                onClick={handleRequestPermission}
                className="w-full py-2.5 px-4 rounded-lg bg-amber-600 text-white font-medium text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Bell className="w-4 h-4" />
                <span>Solicitar permiso de notificaciones push</span>
              </button>
            ) : (
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-stone-700 dark:text-stone-300">
                  Avisos automáticos de publicaciones
                </span>
                <button
                  onClick={handleToggleEnabled}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                    enabled ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>

          {/* Test Push Button */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleSendTestNotification}
              className="w-full py-2 px-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Simular notificación de nuevo post</span>
            </button>
          </div>

          {testSuccess && (
            <div className="text-xs p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{testSuccess}</span>
            </div>
          )}

          {/* Notification History Log */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Historial de avisos recientes ({notifications.length})
              </h3>
              {notifications.length > 0 && (
                <button
                  onClick={onClearNotifications}
                  className="text-[11px] text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  Borrar historial
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-stone-400 italic text-center py-4">
                No hay notificaciones recientes en el registro.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 dark:text-stone-100">
                        {n.title}
                      </span>
                      <span className="text-[10px] text-stone-400">{n.date}</span>
                    </div>
                    <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
