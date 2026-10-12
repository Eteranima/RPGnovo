'use client';

import { useState } from 'react';
import { usePwa } from './pwa-provider';
import styles from './pwa-install-control.module.css';
import { PwaSaveTransfer } from './pwa-save-transfer';
import type { PwaSaveTransferProps } from '@/lib/pwa/save-transfer';
import { NativeMenuFrame } from './native-menu-frame';

export type GameInstallControlProps = {
  canUpdate: boolean;
  saveTransfer?: PwaSaveTransferProps;
};

export function GameInstallControl({ canUpdate, saveTransfer }: GameInstallControlProps) {
  const pwa = usePwa();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [instructions, setInstructions] = useState(false);
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
    if (busy || pwa.updating || !canUpdate || pwa.offline) return;
    await pwa.applyUpdate();
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
      {pwa.updateAvailable ? <button type="button" disabled={busy || pwa.updating || !canUpdate || pwa.offline} onClick={() => void update()}>Salvar e atualizar</button> : pwa.registration && <button type="button" disabled={busy || pwa.offline} onClick={() => void check()}>Procurar atualização</button>}
    </div>
    {instructions && <p className={styles.help}>{pwa.ios ? 'No Safari, abra Compartilhar e escolha Adicionar à Tela de Início. Ative Abrir como App Web, se aparecer, e toque em Adicionar.' : 'No Chrome ou Edge, abra o menu do navegador e escolha Instalar Éter Anima ou Instalar página como aplicativo. No Safari do Mac, use Arquivo → Adicionar ao Dock.'}</p>}
    {pwa.updateAvailable && <p className={styles.help}>A nova versão será aplicada automaticamente assim que o progresso puder ser salvo com segurança.</p>}
    <p className={styles.help}>{pwa.offline ? 'Sem conexão. ' : ''}O aplicativo e parte das imagens visitadas podem abrir sem rede. Novas áreas, vídeos e áudio precisam de conexão. O progresso é salvo neste navegador e aparelho; a instalação não sincroniza outros dispositivos.</p>
    {saveTransfer && <PwaSaveTransfer {...saveTransfer} />}
    <p className={styles.status} role="status" aria-live="polite">{message || pwa.updateMessage || pwa.error}</p>
  </section>;
}
