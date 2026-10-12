'use client';
import { useRef, useState } from 'react';
import { MAX_PWA_SAVE_FILE_BYTES, type PwaSavePreview, type PwaSaveTransferProps } from '@/lib/pwa/save-transfer';
import styles from './pwa-install-control.module.css';

export function PwaSaveTransfer({ canExport, canImport, exportSave, previewSave, importSave }: PwaSaveTransferProps) {
  const input = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ text: string; preview: PwaSavePreview } | null>(null);
  const [message, setMessage] = useState('');
  const [reading, setReading] = useState(false);
  const callbacks = useRef({ canExport, canImport, exportSave, previewSave, importSave });
  callbacks.current = { canExport, canImport, exportSave, previewSave, importSave };
  const download = () => {
    if (!callbacks.current.canExport) return;
    try {
      const text = callbacks.current.exportSave();
      if (!text) throw new Error('Não foi possível preparar o progresso salvo.');
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
      const anchor = document.createElement('a');
      anchor.href = url; anchor.download = `eter-anima-save-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      setMessage('Arquivo preparado. Guarde-o no aparelho para importar na tela inicial do aplicativo instalado.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível baixar o progresso.'); }
  };
  const read = async (file: File | undefined) => {
    setPending(null); setMessage('');
    if (!file || !callbacks.current.canImport) return;
    if (!file.size || file.size > MAX_PWA_SAVE_FILE_BYTES) { setMessage('Escolha um arquivo de progresso de Éter Anima com até 2 MB.'); return; }
    setReading(true);
    try {
      const text = await file.text();
      if (!callbacks.current.canImport) throw new Error('Volte à tela inicial para importar.');
      const preview = callbacks.current.previewSave(text);
      if (!preview) throw new Error('Este arquivo não contém um progresso válido de Éter Anima. Nada foi alterado.');
      setPending({ text, preview });
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Não foi possível ler este arquivo. Nada foi alterado.'); }
    finally { setReading(false); if (input.current) input.current.value = ''; }
  };
  const confirm = () => {
    if (!pending || !callbacks.current.canImport || reading) return;
    try {
      if (!callbacks.current.importSave(pending.text)) { setPending(null); throw new Error('O progresso anterior foi preservado. Escolha o arquivo novamente para revisar antes de importar.'); }
      setPending(null); setMessage('Progresso importado. Use Continuar na tela inicial.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'A importação falhou. O progresso anterior foi preservado.'); }
  };
  return <div className={styles.transfer}>
    <h4>Levar meu progresso</h4>
    <p className={styles.help}>Baixe uma cópia antes de instalar pelo Safari ou trocar de navegador/aparelho. No aplicativo novo, importe o arquivo pela tela inicial. A transferência é local.</p>
    <div className={styles.actions}>
      <button type="button" disabled={!canExport || reading} onClick={download}>Baixar progresso</button>
      <button type="button" disabled={!canImport || reading} onClick={() => input.current?.click()}>Importar arquivo</button>
      <input ref={input} type="file" accept=".json,application/json" hidden onChange={event => void read(event.target.files?.[0])} />
    </div>
    {!canImport && <p className={styles.help}>Para importar, volte à tela inicial. Seu progresso atual pode ser baixado quando a partida estiver em um momento seguro.</p>}
    {pending && <div className={styles.review}>
      <h4>Revisar progresso</h4>
      <p>{pending.preview.mapName} · Nível {pending.preview.level}<br />{pending.preview.heroNames.join(', ')}<br />Tempo de jogo: {Math.floor(pending.preview.elapsedSeconds / 60)} min</p>
      <p>Confirmar substitui o progresso deste aplicativo. Uma cópia do progresso anterior é guardada no aparelho antes da troca.</p>
      <div className={styles.actions}><button type="button" disabled={!canImport} onClick={confirm}>Confirmar substituição</button><button type="button" onClick={() => setPending(null)}>Cancelar</button></div>
    </div>}
    <p className={styles.status} role="status" aria-live="polite">{reading ? 'Lendo progresso…' : message}</p>
  </div>;
}
