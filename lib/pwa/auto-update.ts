export type GameUpdateGuard = {
  canApply(): boolean;
  prepare(): boolean | Promise<boolean>;
  verify(): boolean;
  setPending(pending: boolean): void;
};

type UpdateWorker = Pick<ServiceWorker, 'state'>;
export type AutoUpdateState = { busy: boolean; available: boolean; message: string };
export type AutoUpdateEnvironment<W extends UpdateWorker> = {
  waiting(): W | null;
  guard(): GameUpdateGuard | null;
  available(): boolean;
  status(worker: W): Promise<{ gameTabs: number }>;
  activate(worker: W): Promise<void>;
  reload(): void;
  notify(state: AutoUpdateState): void;
  now?(): number;
};

/** One promotion owner for automatic and manual requests. No controllerchange reload. */
export function createAutoUpdateCoordinator<W extends UpdateWorker>(environment: AutoUpdateEnvironment<W>) {
  let disposed = false, busy = false, reloading = false, retryAfter = 0;
  let attempted: W | null = null, candidate: W | null = null;
  const now = environment.now || Date.now;
  const notify = (message: string) => {
    if (!disposed) environment.notify({ busy, available: !!(environment.waiting() || candidate), message });
  };
  const attempt = async (manual = false) => {
    if (disposed || busy || reloading) return;
    const worker = environment.waiting() || candidate, guard = environment.guard();
    if (!worker || worker.state === 'redundant') { candidate = null; notify(''); return; }
    if (!guard || !environment.available() || !guard.canApply()) {
      notify('Nova versão pronta. A atualização será aplicada automaticamente ao concluir a ação atual.'); return;
    }
    if (worker !== attempted) retryAfter = 0;
    if (!manual && now() < retryAfter) return;
    attempted = worker; busy = true;
    guard.setPending(true);
    notify('Salvando seu progresso para atualizar…');
    const valid = () => !disposed && environment.guard() === guard && environment.available() &&
      guard.canApply() && worker.state !== 'redundant' &&
      (!environment.waiting() || environment.waiting() === worker);
    try {
      const status = await environment.status(worker);
      if (status.gameTabs !== 1) throw new Error('Atualização aguardando o fechamento das outras janelas do jogo. Seu progresso está preservado.');
      if (!valid() || !await guard.prepare() || !valid() || !guard.verify())
        throw new Error('A atualização aguardará um salvamento seguro. Sua partida continua nesta versão.');
      // Retain this worker if activation takes longer than its deadline. A later safe
      // checkpoint can finish its reload even after registration.waiting becomes null.
      candidate = worker;
      notify('Progresso salvo. Aplicando a nova versão…');
      await environment.activate(worker);
      const finalStatus = await environment.status(worker);
      if (finalStatus.gameTabs !== 1) throw new Error('Atualização aguardando o fechamento das outras janelas do jogo. Seu progresso está preservado.');
      if (!valid() || !guard.verify()) throw new Error('A partida mudou durante a atualização. Ela foi preservada e não será recarregada agora.');
      reloading = true;
      environment.reload();
    } catch (error) {
      retryAfter = now() + 30000;
      reloading = false;
      busy = false;
      if (environment.guard() === guard) guard.setPending(false);
      notify(error instanceof Error ? error.message : 'A atualização será tentada novamente quando for seguro.');
    }
  };
  return {
    attempt,
    dispose() { disposed = true; },
  };
}
