'use client';

import { useRef, useState } from 'react';
import { usePwa } from './pwa-provider';
import { activateSavedUpdate, workerMessage } from '@/lib/pwa/client';
import styles from './pwa-install-control.module.css';
import { PwaSaveTransfer } from './pwa-save-transfer';
import type { PwaSaveTransferProps } from '@/lib/pwa/save-transfer';
import { NativeMenuFrame } from './native-menu-frame';

export type GameInstallControlProps = {
  canUpdate: boolean;
  onBeforeUpdate: () => boolean | Promise<boolean>;
  onUpdatePendingChange?: (pending: boolean) => void;
  saveTransfer?: PwaSaveTransferProps;
};

export function GameInstallControl({ canUpdate, onBeforeUpdate, onUpdatePendingChange, saveTransfer }: GameInstallControlProps) {
  const pwa = usePwa();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState(false);
  const current = useRef({ canUpdate, onBeforeUpdate, onUpdatePendingChange });
  current.current = { canUpdate, onBeforeUpdate, onUpdatePendingChange };
  if (!pwa) return null;
  const install = async () => {
    if (!pwa.prompt || busy) return;
    setBusy(true); setMessage('');
    try {
      await pwa.prompt.prompt();
      const choice = await pwa.prompt.userChoice;
      pwa.clearPrompt();
      setMessage(choice.outcome === 'accepted' ? 'Instalação aceita. Abra Éter Anima pelo ícone do aparelho.' : 'Você pode instalar pelo menu do navegador quando quiser.');
    } catch { setMessage('Abra o menu do navegador para instalar Éter Anima.'); }
    finally { setBusy(false); }
  };
  const update = async () => {
    if (!pwa.waiting || busy || !current.current.canUpdate) return;
    setBusy(true); setMessage('Preparando atualização…');
    current.current.onUpdatePendingChange?.(true);
    try {
      const worker = pwa.waiting;
      const status = await workerMessage<{ gameTabs: number }>(worker, { type: 'ETER_PWA_STATUS' });
      if (status.gameTabs !== 1) throw new Error('Feche as outras abas ou janelas do jogo antes de atualizar.');
      if (!current.current.canUpdate || !await current.current.onBeforeUpdate()) throw new Error('Não foi possível salvar com segurança. A partida continua nesta versão.');
      if (!current.current.canUpdate) throw new Error('Conclua a ação atual antes de atualizar.');
      await activateSavedUpdate(worker);
      // This is the only reload path. It follows this player's explicit click and successful save.
      window.location.reload();
    } catch (error) {
      current.current.onUpdatePendingChange?.(false);
      setMessage(error instanceof Error ? error.message : 'Não foi possível atualizar agora.'); setBusy(false);
    }
  };
  const check = async () => {
    setBusy(true); setMessage('Procurando atualização…');
    try { await pwa.registration?.update(); setMessage('Verificação concluída. Uma nova versão aparecerá aqui quando estiver pronta.'); }
    catch { setMessage(pwa.offline ? 'Conecte-se para procurar uma nova versão.' : 'Não foi possível verificar a atualização. Tente novamente ou abra o jogo no Chrome, Edge ou Safari. Sua partida continua nesta versão.'); }
    finally { setBusy(false); }
  };
  return <section className={styles.panel} aria-labelledby="pwa-install-title">
    <NativeMenuFrame />
    <div className={styles.heading}><img src="/pwa/icon-192.png" width="32" height="32" alt="" /><h3 id="pwa-install-title">Éter Anima no aparelho</h3></div>
    <p>{pwa.installed ? 'Aberto como aplicativo.' : 'Abra o jogo pelo seu próprio ícone no PC ou celular.'}</p>
    <div className={styles.actions}>
      {!pwa.installed && (pwa.prompt ? <button type="button" disabled={busy} onClick={() => void install()}>Instalar jogo</button> : <button type="button" aria-expanded={instructions} disabled={busy} onClick={() => setInstructions(!instructions)}>Como instalar</button>)}
      {pwa.waiting ? <button type="button" disabled={busy || !canUpdate || pwa.offline} onClick={() => void update()}>Salvar e atualizar</button> : pwa.registration && <button type="button" disabled={busy || pwa.offline} onClick={() => void check()}>Procurar atualização</button>}
    </div>
    {instructions && <p className={styles.help}>{pwa.ios ? 'No Safari, abra Compartilhar e escolha Adicionar à Tela de Início. Ative Abrir como App Web, se aparecer, e toque em Adicionar.' : 'No Chrome ou Edge, abra o menu do navegador e escolha Instalar Éter Anima ou Instalar página como aplicativo. No Safari do Mac, use Arquivo → Adicionar ao Dock.'}</p>}
    {pwa.waiting && <p className={styles.help}>{canUpdate ? 'Nova versão pronta. O jogo será salvo e esta janela será reaberta após sua confirmação.' : 'Nova versão pronta. Termine a batalha ou cena e volte ao Sistema para atualizar.'}</p>}
    <p className={styles.help}>{pwa.offline ? 'Sem conexão. ' : ''}O aplicativo e parte das imagens visitadas podem abrir sem rede. Novas áreas, vídeos e áudio precisam de conexão. O progresso é salvo neste navegador e aparelho; a instalação não sincroniza outros dispositivos.</p>
    {saveTransfer && <PwaSaveTransfer {...saveTransfer} />}
    <p className={styles.status} role="status" aria-live="polite">{message || pwa.error}</p>
  </section>;
}
