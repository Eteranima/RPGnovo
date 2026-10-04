'use client';

import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {getQuestCinematic, cinematicFrameAt, cinematicPlaybackStep, cinematicRange, cinematicTabTarget, type QuestCinematicId, type SceneAct} from '@/lib/art/questCinematicsV31';
import styles from './quest-cinematic.module.css';

export type QuestCinematicProps = {
 questId: QuestCinematicId | string;
 caption?: string;
 sceneAct?: SceneAct;
 onComplete: () => void;
 onSkip: () => void;
};

/** Loads just the active film. Completion is an explicit action after its last native frame. */
export function QuestCinematic({questId, caption, sceneAct, onComplete, onSkip}: QuestCinematicProps) {
 const scene = getQuestCinematic(questId);
 const canvas = useRef<HTMLCanvasElement>(null), dialog = useRef<HTMLDivElement>(null), playButton = useRef<HTMLButtonElement>(null);
 const playback = useRef({elapsedMs: 0, paused: false, finished: false}), resolved = useRef(false);
 const [view, setView] = useState({frame: 0, ready: false, failed: false, paused: false, finished: false, reduced: false});
 const [retry, setRetry] = useState(0);
 const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

 useEffect(() => {setPortalTarget(document.body);}, []);

 useEffect(() => {
  if (!scene || !portalTarget) return;
  let disposed = false, raf = 0, previous = 0;
  const restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const range = cinematicRange(scene, sceneAct);
  resolved.current = false;
  playback.current = {elapsedMs: 0, paused: reduced, finished: false};
  setView({frame: range.start, ready: false, failed: false, paused: reduced, finished: false, reduced});
  dialog.current?.focus();
  const images = new Map<number, HTMLImageElement>();
  const requiredAtlases = [...new Set(scene.frames.slice(range.start, range.end).map(frame => frame.atlas))];
  const paint = (index: number) => {
   const cv = canvas.current, frame = scene.frames[index], image = images.get(frame.atlas);
   if (!cv || !image) return;
   const rect = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
   const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
   if (cv.width !== width || cv.height !== height) {cv.width = width; cv.height = height;}
   const ctx = cv.getContext('2d');
   if (!ctx) return;
   ctx.fillStyle = '#070a12'; ctx.fillRect(0, 0, width, height);
   const scale = Math.min(width / frame.w, height / frame.h), dw = frame.w * scale, dh = frame.h * scale;
   ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, (width - dw) / 2, (height - dh) / 2, dw, dh);
   cv.dataset.nativeFrame = String(index);
   cv.dataset.quest = scene.id;
  };
  let currentFrame = range.start;
  const observer = new ResizeObserver(() => paint(currentFrame));
  if (canvas.current) observer.observe(canvas.current);
  const onVisibility = () => {previous = 0;};
  document.addEventListener('visibilitychange', onVisibility);
  const captureKey = (event: KeyboardEvent) => {
   if (event.ctrlKey || event.metaKey || event.altKey || /^F\d+$/.test(event.key)) return;
   if (event.key === 'Tab') {
    const buttons = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
    if (!buttons.length) {event.preventDefault(); return;}
    const target = cinematicTabTarget(event.type, event.shiftKey, buttons.indexOf(document.activeElement as HTMLButtonElement), buttons.length);
    if (target !== null) {event.preventDefault(); buttons[target].focus();}
    event.stopImmediatePropagation();
    return;
   }
   // The game uses Enter to advance dialogue. This modal consumes it before the game handler.
   event.preventDefault(); event.stopImmediatePropagation();
   if ((event.key === 'Enter' || event.key === ' ') && !event.repeat && event.type === 'keydown' && event.target instanceof HTMLButtonElement && dialog.current?.contains(event.target) && !event.target.disabled) event.target.click();
  };
  window.addEventListener('keydown', captureKey, true);
  window.addEventListener('keyup', captureKey, true);
  const load = (atlas: number) => new Promise<void>((resolve, reject) => {
   const image = new Image(); image.decoding = 'async'; images.set(atlas, image);
   image.onload = () => resolve(); image.onerror = () => reject(new Error('A cena não pôde ser carregada.'));
   image.src = scene.atlases[atlas].src;
  });
  void Promise.all(requiredAtlases.map(load)).then(() => {
   if (disposed) return;
   paint(currentFrame);
   setView(v => ({...v, ready: true}));
   const tick = (now: number) => {
    if (disposed) return;
    const delta = previous ? Math.max(0, now - previous) : 0; previous = now;
    const state = playback.current;
    const next = cinematicPlaybackStep(state.elapsedMs, delta, range.durationMs, state.paused, document.hidden);
    state.elapsedMs = next.elapsedMs; state.finished = next.finished;
    const index = cinematicFrameAt(scene, state.elapsedMs, sceneAct);
    if (index !== currentFrame || next.finished) {
     currentFrame = index; paint(index);
     setView(v => ({...v, frame: index, finished: next.finished}));
    }
    if (!next.finished) raf = requestAnimationFrame(tick);
   };
   raf = requestAnimationFrame(tick);
  }).catch(() => {if (!disposed) setView(v => ({...v, failed: true}));});
  return () => {
   disposed = true; cancelAnimationFrame(raf); observer.disconnect();
   document.removeEventListener('visibilitychange', onVisibility);
   window.removeEventListener('keydown', captureKey, true); window.removeEventListener('keyup', captureKey, true);
   for (const image of images.values()) {image.onload = null; image.onerror = null;}
   images.clear(); restoreFocus?.focus();
  };
 }, [scene, sceneAct, retry, portalTarget]);

 useEffect(() => {if (view.ready && document.activeElement === dialog.current) playButton.current?.focus();}, [view.ready]);

 if (!portalTarget) return null;
 if (!scene) return createPortal(<div className={styles.overlay}><div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="quest-film-title"><header className={styles.header}><h2 id="quest-film-title">Cena indisponível</h2></header><div className={styles.narrative}><p>Esta cena não está no registro atual. Você pode voltar à missão.</p></div><footer className={styles.footer}><button autoFocus type="button" onClick={onSkip}>Voltar à missão</button></footer></div></div>, portalTarget);
 const range = cinematicRange(scene, sceneAct);
 const beat = [...scene.captions].reverse().find(beat => beat.startFrame <= view.frame);
 const togglePause = () => {playback.current.paused = !playback.current.paused; setView(v => ({...v, paused: playback.current.paused}));};
 const finish = (skip: boolean) => {if (resolved.current || (!skip && !playback.current.finished)) return; resolved.current = true; skip ? onSkip() : onComplete();};
 return createPortal(<div className={styles.overlay}>
  <div ref={dialog} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="quest-film-title" aria-describedby="quest-film-caption">
   <header className={styles.header}><div><span className={styles.eyebrow}>Ecos que Escolhem</span><h2 id="quest-film-title">{scene.title}</h2></div><span className={styles.counter} aria-hidden="true">{view.frame - range.start + 1} / {range.end - range.start}</span></header>
   <div className={styles.screen} aria-busy={!view.ready && !view.failed}>
    <canvas ref={canvas} aria-hidden="true"/>
    {!view.ready && <div className={styles.loading} role="status">{view.failed ? <>Não foi possível carregar esta cena.<button type="button" onClick={() => setRetry(v => v + 1)}>Tentar novamente</button></> : 'Preparando a cena…'}</div>}
    <span className={styles.srOnly}>Quadro {view.frame - range.start + 1} da cena {scene.title}.</span>
   </div>
   <div className={styles.narrative}><div className={styles.actors} aria-label={`Participação: ${scene.actors.join(', ')}`}>{scene.avatars.map(avatar => <img key={avatar.src} src={avatar.src} alt={avatar.name} width="44" height="44"/>)}</div><p id="quest-film-caption" aria-live="polite">{caption || beat?.text}</p></div>
   <footer className={styles.footer}><div className={styles.controls}>
    <button ref={playButton} type="button" onClick={togglePause} disabled={!view.ready || view.finished}>{view.finished ? 'Filme concluído' : view.paused ? 'Reproduzir' : 'Pausar'}</button>
    <button type="button" onClick={() => finish(true)}>Pular cena</button>
   </div><span className={styles.hint}>{view.reduced ? 'Quadros sem transições. Reproduza quando quiser.' : view.finished ? 'A escolha continua com você.' : 'A cena pausa quando você sai desta tela.'}</span><button className={styles.continue} type="button" onClick={() => finish(false)} disabled={!view.finished}>Continuar</button></footer>
  </div>
 </div>, portalTarget);
}
