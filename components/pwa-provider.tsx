'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { InstallPromptEvent } from '@/lib/pwa/client';
import { isStandalone } from '@/lib/pwa/client';

type PwaState = {
  prompt: InstallPromptEvent | null;
  installed: boolean;
  offline: boolean;
  ios: boolean;
  registration: ServiceWorkerRegistration | null;
  waiting: ServiceWorker | null;
  error: string;
  clearPrompt(): void;
};
const PwaContext = createContext<PwaState | null>(null);
export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [offline, setOffline] = useState(false);
  const [ios, setIos] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const [error, setError] = useState('');
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    let disposed = false;
    let observer: PerformanceObserver | null = null;
    const removeListeners: (() => void)[] = [];
    let lastUpdateCheck = 0;
    const seen = new Set<string>();
    const syncInstalled = () => setInstalled(isStandalone());
    const syncNetwork = () => setOffline(!navigator.onLine);
    const deferred = (event: Event) => { event.preventDefault(); setPrompt(event as InstallPromptEvent); };
    const didInstall = () => { setInstalled(true); setPrompt(null); };
    const display = window.matchMedia('(display-mode: standalone)');
    syncInstalled(); syncNetwork();
    setIos(/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    window.addEventListener('beforeinstallprompt', deferred);
    window.addEventListener('appinstalled', didInstall);
    window.addEventListener('online', syncNetwork);
    window.addEventListener('offline', syncNetwork);
    display.addEventListener('change', syncInstalled);
    const checkUpdate = () => {
      if (document.visibilityState === 'visible' && navigator.onLine && Date.now() - lastUpdateCheck > 600000) {
        lastUpdateCheck = Date.now();
        void registrationRef.current?.update().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', checkUpdate);

    if (process.env.NODE_ENV === 'production' && window.isSecureContext && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).then(async reg => {
        if (disposed) return;
        registrationRef.current = reg;
        setRegistration(reg);
        const syncWaiting = () => { if (!disposed) setWaiting(reg.waiting); };
        syncWaiting();
        reg.addEventListener('updatefound', syncWaiting);
        removeListeners.push(() => reg.removeEventListener('updatefound', syncWaiting));
        const watch = () => {
          const installing = reg.installing;
          if (installing) {
            installing.addEventListener('statechange', syncWaiting);
            removeListeners.push(() => installing.removeEventListener('statechange', syncWaiting));
          }
          syncWaiting();
        };
        reg.addEventListener('updatefound', watch);
        removeListeners.push(() => reg.removeEventListener('updatefound', watch));
        watch();
        const active = await navigator.serviceWorker.ready;
        if (disposed) return;
        // First visit remains uncontrolled. Warm only raster URLs the game actually loaded,
        // so those images can be opened offline on the next visit without claiming this document.
        const warm = (entries: PerformanceEntry[]) => {
          if (navigator.serviceWorker.controller || !active.active) return;
          const urls: string[] = [];
          for (const entry of entries) {
            const url = new URL(entry.name, window.location.href);
            if (url.origin === window.location.origin && /^\/assets\/.+\.(png|webp|jpe?g|avif)$/.test(url.pathname) && !url.search && !seen.has(url.href) && seen.size < 64) {
              seen.add(url.href); urls.push(url.href);
            }
          }
          if (urls.length) active.active.postMessage({ type: 'ETER_PWA_WARM', urls });
        };
        warm(performance.getEntriesByType('resource'));
        if ('PerformanceObserver' in window) {
          observer = new PerformanceObserver(list => warm(list.getEntries()));
          observer.observe({ type: 'resource', buffered: true });
        }
      }).catch(() => { if (!disposed) setError('A instalação offline ainda não ficou pronta. O jogo continua disponível pela rede.'); });
    }
    return () => {
      disposed = true; observer?.disconnect();
      window.removeEventListener('beforeinstallprompt', deferred);
      window.removeEventListener('appinstalled', didInstall);
      window.removeEventListener('online', syncNetwork);
      window.removeEventListener('offline', syncNetwork);
      display.removeEventListener('change', syncInstalled);
      document.removeEventListener('visibilitychange', checkUpdate);
      removeListeners.forEach(remove => remove());
    };
  }, []);
  return <PwaContext.Provider value={{ prompt, installed, offline, ios, registration, waiting, error, clearPrompt: () => setPrompt(null) }}>{children}</PwaContext.Provider>;
}
