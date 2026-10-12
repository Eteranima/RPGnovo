export type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function workerMessage<T>(worker: ServiceWorker, message: object, timeout = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = setTimeout(() => { channel.port1.close(); reject(new Error('A atualização não respondeu. Tente novamente com conexão.')); }, timeout);
    channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data as T); };
    try { worker.postMessage(message, [channel.port2]); }
    catch (error) { clearTimeout(timer); channel.port1.close(); reject(error); }
  });
}

export async function activateSavedUpdate(worker: ServiceWorker) {
  const result = await workerMessage<{ okay: boolean; reason?: string }>(worker, { type: 'ETER_PWA_ACTIVATE', saved: true });
  if (!result.okay) throw new Error(result.reason === 'other-tabs' ? 'Feche as outras abas ou janelas do jogo antes de atualizar.' : 'A atualização ainda não pode ser aplicada.');
  if (worker.state === 'activated') return;
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => { worker.removeEventListener('statechange', changed); reject(new Error('A nova versão ainda está ativando. Feche o jogo e abra novamente para concluir.')); }, 15000);
    const changed = () => {
      if (worker.state === 'activated') { clearTimeout(timer); worker.removeEventListener('statechange', changed); resolve(); }
      else if (worker.state === 'redundant') { clearTimeout(timer); worker.removeEventListener('statechange', changed); reject(new Error('A atualização foi substituída. Procure a versão novamente.')); }
    };
    worker.addEventListener('statechange', changed);
    changed();
  });
}
