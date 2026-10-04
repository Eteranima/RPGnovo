'use client';

import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {HudIcon} from './hud-icon';
import {OPENING_CINEMATIC_V33, openingCapturesKeyV33, openingClockV33, openingDurationMatchesV33, openingFrameAtV33, openingTabTargetV33, type OpeningExitV33} from '@/lib/art/openingCinematicV33';
import styles from './opening-cinematic-v33.module.css';

export type OpeningCinematicV33Props = {
 /** Mount from the player's opening-screen gesture. Reduced motion takes precedence. */
 autoplay?: boolean;
 onExit: (reason: OpeningExitV33) => void;
 /** Optional presentation callback; it never changes the saved sound preference. */
 onPlaybackChange?: (playing: boolean) => void;
};

type PlayerView = {ready: boolean; failed: boolean; playing: boolean; buffering: boolean; finished: boolean; reduced: boolean; elapsed: number; blocked: boolean};
const initialView: PlayerView = {ready:false, failed:false, playing:false, buffering:false, finished:false, reduced:false, elapsed:0, blocked:false};

/** Plays only the approved, encoded film; loading failures never substitute another scene. */
export function OpeningCinematicV33({autoplay = true, onExit, onPlaybackChange}: OpeningCinematicV33Props) {
 const video = useRef<HTMLVideoElement>(null), dialog = useRef<HTMLDivElement>(null), playButton = useRef<HTMLButtonElement>(null);
 const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null), [view, setView] = useState<PlayerView>(initialView), [retry, setRetry] = useState(0);
 const viewRef = useRef(view), exitRef = useRef(onExit), playbackCallback = useRef(onPlaybackChange), resolved = useRef(false);
 viewRef.current = view; exitRef.current = onExit; playbackCallback.current = onPlaybackChange;

 useEffect(() => {
  // Move one stable portal host into the fullscreen tree. Recreating the portal
  // would recreate the video, restart the film and lose the focused control.
  const host = document.createElement('div');
  host.dataset.openingCinematicHost = 'v33';
  const attach = () => {
   const webkitDocument = document as Document & {webkitFullscreenElement?: Element};
   const fullscreen = document.fullscreenElement || webkitDocument.webkitFullscreenElement;
   const parent = fullscreen instanceof HTMLElement ? fullscreen : document.body;
   if (host.parentElement === parent) return;
   const focused = document.activeElement instanceof HTMLElement && host.contains(document.activeElement) ? document.activeElement : null;
   parent.appendChild(host);
   if (focused?.isConnected) focused.focus({preventScroll:true});
  };
  attach(); setPortalTarget(host);
  document.addEventListener('fullscreenchange',attach);
  document.addEventListener('webkitfullscreenchange',attach);
  return () => {
   document.removeEventListener('fullscreenchange',attach);
   document.removeEventListener('webkitfullscreenchange',attach);
   host.remove();
  };
 }, []);

 const exit = (reason: OpeningExitV33) => {
  if (resolved.current) return;
  resolved.current = true;
  video.current?.pause();
  exitRef.current(reason);
 };
 const play = () => {
  const media = video.current;
  if (!media || !viewRef.current.ready || viewRef.current.failed) return;
  if (media.ended || viewRef.current.finished) {media.currentTime = 0; setView(v => ({...v, elapsed:0, finished:false}));}
  // The export has no audio; muted also prevents future replacement files from bypassing the game's sound preference.
  media.muted = true;
  media.playbackRate = 1;
  void media.play().catch(() => {setView(v => ({...v, playing:false, blocked:true}));});
 };
 const togglePlayback = () => {if (video.current && !video.current.paused) video.current.pause(); else play();};

 useEffect(() => {
  if (!portalTarget || !video.current) return;
  const media = video.current, motion = matchMedia('(prefers-reduced-motion: reduce)');
  const restoreFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  let disposed = false, watchdog = 0, frameRequest = 0;
  let wantAutoplay = autoplay && !motion.matches, metadataValid = false, failedGeneration = false;
  let lastReportedPlaying = false;
  resolved.current = false;
  setView({...initialView, reduced:motion.matches});
  dialog.current?.focus();
  media.muted = true; media.volume = 0; media.playbackRate = 1;

  const reportPlaying = (playing: boolean) => {
   if (lastReportedPlaying === playing) return;
   lastReportedPlaying = playing; playbackCallback.current?.(playing);
  };
  const clearWatchdog = () => {window.clearTimeout(watchdog); watchdog = 0;};
  const fail = () => {
   if (disposed) return;
   failedGeneration = true; wantAutoplay = false; clearWatchdog(); media.pause(); reportPlaying(false);
   setView(v => ({...v, ready:false, failed:true, playing:false, buffering:false}));
  };
  const watchLoading = () => {if (watchdog) return; watchdog = window.setTimeout(fail, OPENING_CINEMATIC_V33.loadTimeoutMs);};
  const updateTime = () => {
   if (disposed) return;
   const elapsed = Math.min(OPENING_CINEMATIC_V33.durationSeconds, Math.max(0, media.currentTime || 0));
   media.dataset.nativeFrame = String(openingFrameAtV33(elapsed));
   setView(v => Math.abs(v.elapsed - elapsed) < .08 ? v : {...v, elapsed});
  };
  const trackFrame = () => {
   updateTime();
   if (!disposed && !media.paused && !media.ended) frameRequest = requestAnimationFrame(trackFrame);
  };
  const loadedMetadata = () => {
   metadataValid = openingDurationMatchesV33(media.duration);
   if (!metadataValid) fail();
  };
  const ready = () => {
   if (disposed || failedGeneration || !metadataValid) return;
   clearWatchdog();
   setView(v => ({...v, ready:true, failed:false, buffering:false}));
   if (document.activeElement === dialog.current) playButton.current?.focus();
   if (wantAutoplay && !document.hidden) {
    wantAutoplay = false;
    void media.play().catch(() => {if (!disposed) setView(v => ({...v, playing:false, blocked:true}));});
   }
  };
  const playing = () => {
   if (disposed) return;
   clearWatchdog(); reportPlaying(true);
   setView(v => ({...v, playing:true, buffering:false, blocked:false, finished:false}));
   cancelAnimationFrame(frameRequest); frameRequest = requestAnimationFrame(trackFrame);
  };
  const paused = () => {
   if (disposed) return;
   wantAutoplay = false; reportPlaying(false); cancelAnimationFrame(frameRequest); updateTime();
   if (viewRef.current.ready) clearWatchdog();
   setView(v => ({...v, playing:false, buffering:false}));
  };
  const waiting = () => {
   if (disposed || media.ended || media.paused && viewRef.current.ready) return;
   setView(v => ({...v, buffering:true})); watchLoading();
  };
  const ended = () => {
   if (disposed) return;
   clearWatchdog(); reportPlaying(false); cancelAnimationFrame(frameRequest);
   media.dataset.nativeFrame = String(OPENING_CINEMATIC_V33.frames - 1);
   setView(v => ({...v, playing:false, buffering:false, finished:true, elapsed:OPENING_CINEMATIC_V33.durationSeconds}));
   // Keep the browser's decoded final frame on screen until Replay or Exit is selected.
  };
  const visibility = () => {if (document.hidden) {wantAutoplay = false; media.pause();}};
  const reducedMotion = () => {setView(v => ({...v, reduced:motion.matches})); if (motion.matches) {wantAutoplay = false; media.pause();}};

  const captureKey = (event: KeyboardEvent) => {
   if (!openingCapturesKeyV33(event.key, event)) return;
   if (event.key === 'Tab') {
    const buttons = Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
    const next = openingTabTargetV33(event.type, event.shiftKey, buttons.indexOf(document.activeElement as HTMLButtonElement), buttons.length);
    if (!buttons.length || next !== null) {event.preventDefault(); if (next !== null) buttons[next].focus();}
    event.stopImmediatePropagation(); return;
   }
   event.preventDefault(); event.stopImmediatePropagation();
   if (event.type !== 'keydown' || event.repeat) return;
   if (event.key === 'Escape') {exit(viewRef.current.finished ? 'finished' : 'skip'); return;}
   if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof HTMLButtonElement && dialog.current?.contains(event.target)) {if (!event.target.disabled) event.target.click(); return;}
   if (event.key === ' ' && !viewRef.current.finished) togglePlayback();
  };
  const containFocus = (event: FocusEvent) => {
   if (event.target instanceof Node && dialog.current && !dialog.current.contains(event.target)) {
    const first = dialog.current.querySelector<HTMLButtonElement>('button:not(:disabled)');
    (first || dialog.current).focus();
   }
  };
  const listeners: [string, EventListener][] = [
   ['loadedmetadata',loadedMetadata], ['loadeddata',ready], ['canplay',ready], ['playing',playing],
   ['pause',paused], ['waiting',waiting], ['stalled',waiting], ['ended',ended], ['error',fail], ['timeupdate',updateTime],
  ];
  for (const [name, listener] of listeners) media.addEventListener(name, listener);
  document.addEventListener('visibilitychange',visibility);
  document.addEventListener('focusin',containFocus);
  motion.addEventListener('change',reducedMotion);
  window.addEventListener('keydown',captureKey,true); window.addEventListener('keyup',captureKey,true);
  media.load(); watchLoading();
  return () => {
   disposed = true; clearWatchdog(); cancelAnimationFrame(frameRequest);
   for (const [name, listener] of listeners) media.removeEventListener(name,listener);
   document.removeEventListener('visibilitychange',visibility); document.removeEventListener('focusin',containFocus);
   motion.removeEventListener('change',reducedMotion);
   window.removeEventListener('keydown',captureKey,true); window.removeEventListener('keyup',captureKey,true);
   media.pause(); reportPlaying(false);
   if (restoreFocus?.isConnected) restoreFocus.focus();
  };
 }, [portalTarget, retry, autoplay]);

 useEffect(() => {if (view.ready && document.activeElement === dialog.current) playButton.current?.focus();},[view.ready]);
 if (!portalTarget) return null;
 const progress = view.elapsed / OPENING_CINEMATIC_V33.durationSeconds * 100;
 const hint = view.failed ? 'Você pode tentar novamente ou voltar à abertura.' : view.finished ? 'Sua aventura espera por você.' : view.blocked ? 'Selecione Reproduzir para iniciar o filme.' : view.reduced && !view.playing ? 'Movimento reduzido: reproduza quando quiser.' : !view.playing && view.ready ? 'Filme pausado. Espaço para reproduzir.' : 'Espaço para pausar · Esc para voltar';
 return createPortal(<div className={styles.overlay} data-opening-cinematic="v33">
  <div ref={dialog} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="opening-film-title-v33" aria-describedby="opening-film-hint-v33">
   <header className={styles.header}><HudIcon name="emblem" className={styles.emblem}/><div><span className={styles.eyebrow}>Stone Reach</span><h2 id="opening-film-title-v33">{OPENING_CINEMATIC_V33.title}</h2></div><span className={styles.duration} aria-label="Duração: um minuto, dois segundos e meio">1:02.5</span></header>
   <div className={styles.screen} aria-busy={(!view.ready || view.buffering) && !view.failed}>
    <video ref={video} className={styles.video} src={OPENING_CINEMATIC_V33.src} poster={OPENING_CINEMATIC_V33.poster} muted playsInline preload="auto" controls={false} disablePictureInPicture data-native-frame="0" aria-label="Filme de abertura de Éter Anima"/>
    {(!view.ready || view.failed) && <div className={styles.loading} role={view.failed ? 'alert' : 'status'}>
     <HudIcon name="scenes" className={styles.loadingArt}/>
     <p>{view.failed ? 'Não foi possível preparar o filme de abertura.' : 'Preparando a abertura…'}</p>
     {view.failed && <button type="button" className={styles.secondary} onClick={() => setRetry(n => n + 1)}>Tentar novamente</button>}
    </div>}
    {view.ready && view.buffering && <div className={styles.buffering} role="status">Preparando o próximo trecho…</div>}
   </div>
   <footer className={styles.footer}>
    <div className={styles.timeline}><progress max={100} value={progress} aria-label="Progresso do filme"/><span aria-hidden="true">{openingClockV33(view.elapsed)} / 1:02</span></div>
    <div className={styles.controls}>
     <div className={styles.buttons}><button ref={playButton} type="button" className={styles.primary} disabled={!view.ready || view.failed} onClick={togglePlayback}>{view.finished ? 'Repetir abertura' : view.playing ? 'Pausar' : 'Reproduzir'}</button><button type="button" className={styles.secondary} onClick={() => exit(view.finished ? 'finished' : 'skip')}>{view.finished ? 'Voltar à abertura' : 'Pular abertura'}</button></div>
     <p id="opening-film-hint-v33" className={styles.hint} aria-live="polite">{hint}</p>
    </div>
   </footer>
  </div>
 </div>,portalTarget);
}
