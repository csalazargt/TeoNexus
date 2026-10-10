import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeCameraScanConfig } from 'html5-qrcode';
import { BlogPost } from '../types/blog';
import {
  X,
  Camera,
  RefreshCw,
  ExternalLink,
  BookOpen,
  Copy,
  Check,
  AlertTriangle,
  Upload,
  QrCode,
  Sparkles,
} from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  posts: BlogPost[];
  onOpenArticle: (post: BlogPost) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  onClose,
  posts,
  onOpenArticle,
}) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = 'teonexus-qr-reader';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Play subtle feedback beep
  const playScanBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      if ('vibrate' in navigator) {
        navigator.vibrate?.([60]);
      }
    } catch {
      // ignore
    }
  };

  // Start Camera Scanning
  const startCamera = async (cameraId?: string) => {
    setCameraError(null);
    setScannedResult(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }

      // Check available cameras
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          if (!cameraId && !selectedCameraId) {
            setSelectedCameraId(devices[0].id);
          }
        }
      } catch {
        // Continue with facingMode environment fallback
      }

      const config: Html5QrcodeCameraScanConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const cameraSource = cameraId || { facingMode: 'environment' };

      await scannerRef.current.start(
        cameraSource,
        config,
        (decodedText) => {
          playScanBeep();
          setScannedResult(decodedText);
          stopCamera();
        },
        () => {
          // ignore frame decode misses
        }
      );

      setScanning(true);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setScanning(false);
      const msg = err?.message || String(err);
      if (msg.includes('NotAllowedError') || msg.includes('Permission')) {
        setCameraError(
          'Permiso de cámara denegado. Por favor autoriza el acceso a la cámara en el navegador o carga una imagen con código QR.'
        );
      } else if (msg.includes('NotFoundError') || msg.includes('DevicesNotFoundError')) {
        setCameraError(
          'No se encontró ninguna cámara conectada en este dispositivo. Puedes subir una imagen con código QR para escanear.'
        );
      } else {
        setCameraError(
          'No se pudo iniciar la cámara web. Puedes subir un archivo de imagen con un código QR o probar con el código de muestra.'
        );
      }
    }
  };

  // Stop Camera
  const stopCamera = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn('Error stopping camera:', err);
      }
    }
    setScanning(false);
  };

  // Lifecycle
  useEffect(() => {
    // Delay slightly to ensure DOM element is mounted
    const timer = setTimeout(() => {
      startCamera();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          scannerRef.current.stop().catch(() => {});
        }
        scannerRef.current.clear();
      }
    };
  }, []);

  // Handle Switch Camera
  const handleSwitchCamera = async (newCameraId: string) => {
    setSelectedCameraId(newCameraId);
    await stopCamera();
    setTimeout(() => {
      startCamera(newCameraId);
    }, 150);
  };

  // Handle Image Upload Scan
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await stopCamera();

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }
      const decodedText = await scannerRef.current.scanFile(file, true);
      playScanBeep();
      setScannedResult(decodedText);
      setCameraError(null);
    } catch (err: any) {
      setCameraError('No se pudo detectar ningún código QR en la imagen seleccionada.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Find if scanned QR matches an article
  const matchedArticle = React.useMemo(() => {
    if (!scannedResult || !posts) return null;
    const trimmed = scannedResult.trim().toLowerCase();

    // Direct link or guid or partial URL match
    return posts.find((p) => {
      const pLink = p.link.toLowerCase();
      const pId = p.id.toLowerCase();
      return (
        trimmed === pLink ||
        trimmed === pId ||
        pLink.includes(trimmed) ||
        trimmed.includes(pLink) ||
        (trimmed.includes('csalazar.org') && pLink.split('/').filter(Boolean).pop() && trimmed.includes(pLink.split('/').filter(Boolean).pop()!))
      );
    });
  }, [scannedResult, posts]);

  // Is URL
  const isUrl = scannedResult?.startsWith('http://') || scannedResult?.startsWith('https://');

  const copyResult = () => {
    if (!scannedResult) return;
    navigator.clipboard.writeText(scannedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Test Sample QR
  const handleTestSampleQR = () => {
    const sample = posts[0]?.link || 'https://csalazar.org/2026/09/27/el-camino-de-damasco-cuando-dios-confronta-nuestras-certezas/';
    playScanBeep();
    setScannedResult(sample);
    stopCamera();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-reading">
                Lector de Códigos QR
              </h2>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Apunta con la cámara hacia cualquier código QR
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label="Cerrar escáner"
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 flex flex-col items-center">
          {/* Active Scanner Viewport */}
          {!scannedResult && (
            <div className="w-full flex flex-col items-center">
              {/* Camera Video Container */}
              <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden bg-stone-950 border-2 border-stone-800 shadow-inner flex items-center justify-center">
                <div id={readerElementId} className="w-full h-full object-cover" />

                {/* Scanning overlay framing */}
                {scanning && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="w-52 h-52 border-2 border-amber-500/80 rounded-xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-400 -mt-0.5 -ml-0.5" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-400 -mt-0.5 -mr-0.5" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-400 -mb-0.5 -ml-0.5" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-400 -mb-0.5 -mr-0.5" />
                      {/* Animated scan bar */}
                      <div className="w-full h-0.5 bg-linear-to-r from-transparent via-amber-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                )}

                {/* Camera initializing or stopped */}
                {!scanning && !cameraError && (
                  <div className="text-center p-4 text-stone-400 text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                    <span>Iniciando cámara...</span>
                  </div>
                )}
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="mt-4 w-full p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1 leading-relaxed">
                    <p className="font-semibold mb-0.5">Acceso a la cámara:</p>
                    <p>{cameraError}</p>
                  </div>
                </div>
              )}

              {/* Camera Controls & Fallback Buttons */}
              <div className="w-full mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                {cameras.length > 1 && (
                  <select
                    value={selectedCameraId}
                    onChange={(e) => handleSwitchCamera(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs"
                  >
                    {cameras.map((c, i) => (
                      <option key={c.id} value={c.id}>
                        {c.label || `Cámara ${i + 1}`}
                      </option>
                    ))}
                  </select>
                )}

                {!scanning && (
                  <button
                    onClick={() => startCamera(selectedCameraId)}
                    className="px-3.5 py-1.5 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium flex items-center gap-1.5 hover:bg-stone-800 transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Reintentar cámara</span>
                  </button>
                )}

                {/* Upload Image button fallback */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                  title="Escanear archivo de imagen"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir imagen con QR</span>
                </button>

                {/* Demo QR button */}
                <button
                  onClick={handleTestSampleQR}
                  className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/50 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center gap-1"
                  title="Simular escaneo de QR de prueba"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Probar QR de demo</span>
                </button>
              </div>
            </div>
          )}

          {/* Scanned Result View */}
          {scannedResult && (
            <div className="w-full space-y-5 animate-in zoom-in-95 duration-200">
              {/* Success Badge */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-1">
                  <Check className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  ¡Código QR Escaneado con Éxito!
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {matchedArticle
                    ? 'Se identificó una publicación del blog TeoNexus.'
                    : 'Información decodificada de la imagen.'}
                </p>
              </div>

              {/* If article matched */}
              {matchedArticle ? (
                <div className="p-4 rounded-xl border-2 border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Artículo Encontrado</span>
                  </div>

                  <h4 className="font-serif-reading font-bold text-base text-stone-900 dark:text-stone-100 leading-snug">
                    {matchedArticle.title}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {matchedArticle.excerpt}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenArticle(matchedArticle);
                      }}
                      className="flex-1 py-2.5 px-4 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Abrir y leer en la app</span>
                    </button>

                    <a
                      href={matchedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      title="Ver en blog original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Raw Scanned Content Box */
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400">
                    Contenido decodificado:
                  </label>
                  <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 font-mono text-xs text-stone-800 dark:text-stone-200 break-all max-h-36 overflow-y-auto select-all">
                    {scannedResult}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={copyResult}
                      className="flex-1 py-2 px-3 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copiado!' : 'Copiar contenido'}</span>
                    </button>

                    {isUrl && (
                      <a
                        href={scannedResult}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Abrir enlace</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Action to scan again */}
              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-center">
                <button
                  onClick={() => {
                    setScannedResult(null);
                    setTimeout(() => startCamera(selectedCameraId), 100);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Escanear otro código QR</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
