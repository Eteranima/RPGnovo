'use client';

import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {getQuestCinematicV34,questVideoRangeV34,questVideoFrameV34,questVideoDurationMatchesV34,questVideoCaptionV34,questVideoClockV34,questVideoCapturesKeyV34,questVideoTabTargetV34,type QuestCinematicId,type SceneAct,type CinematicFilmSpec} from '@/lib/art/questCinematicsV34';
import styles from './quest-cinematic.module.css';

export type QuestCinematicProps={questId:QuestCinematicId|string;filmSpec?:CinematicFilmSpec;caption?:string;sceneAct?:SceneAct;replay?:boolean;onComplete:()=>void;onSkip:()=>void};
type PlayerView={ready:boolean;failed:boolean;playing:boolean;buffering:boolean;finished:boolean;reduced:boolean;elapsed:number;blocked:boolean};
const initialView:PlayerView={ready:false,failed:false,playing:false,buffering:false,finished:false,reduced:false,elapsed:0,blocked:false};
type PlaybackControls={play:()=>void;pause:()=>void};

/** Only the selected native film is requested; completion never happens from a timer or Enter alone. */
export function QuestCinematic({questId,filmSpec,caption,sceneAct,replay=false,onComplete,onSkip}:QuestCinematicProps){
 const scene=filmSpec??getQuestCinematicV34(questId),video=useRef<HTMLVideoElement>(null),dialog=useRef<HTMLDivElement>(null),playButton=useRef<HTMLButtonElement>(null);
 const [portalTarget,setPortalTarget]=useState<HTMLElement|null>(null),[view,setView]=useState<PlayerView>(initialView),[retry,setRetry]=useState(0);
 const viewRef=useRef(view),callbacks=useRef({onComplete,onSkip}),resolved=useRef(false),controls=useRef<PlaybackControls|null>(null);
 const titleId=useId(),captionId=useId(),hintId=useId();viewRef.current=view;callbacks.current={onComplete,onSkip};

 useEffect(()=>{
  // Keep the same portal/video node while the game enters or leaves fullscreen.
  const host=document.createElement('div');host.dataset.questCinematicHost='v34';
  const attach=()=>{
   const fullscreen=document.fullscreenElement||(document as Document&{webkitFullscreenElement?:Element}).webkitFullscreenElement;
   const parent=fullscreen instanceof HTMLElement&&!host.contains(fullscreen)?fullscreen:document.body;
   if(host.parentElement===parent)return;
   const focused=document.activeElement instanceof HTMLElement&&host.contains(document.activeElement)?document.activeElement:null;
   parent.appendChild(host);if(focused?.isConnected)focused.focus({preventScroll:true});
  };
  attach();setPortalTarget(host);document.addEventListener('fullscreenchange',attach);document.addEventListener('webkitfullscreenchange',attach);
  return()=>{document.removeEventListener('fullscreenchange',attach);document.removeEventListener('webkitfullscreenchange',attach);host.remove();};
 },[]);

 const finish=(skip:boolean)=>{
  if(resolved.current||!skip&&(!viewRef.current.finished||!viewRef.current.ready||viewRef.current.failed))return;
  resolved.current=true;video.current?.pause();skip?callbacks.current.onSkip():callbacks.current.onComplete();
 };
 const togglePlayback=()=>{if(video.current&&!video.current.paused)controls.current?.pause();else controls.current?.play();};

 useEffect(()=>{
  if(!portalTarget)return;
  const restore=document.activeElement instanceof HTMLElement?document.activeElement:null;
  dialog.current?.focus();
  const captureKey=(event:KeyboardEvent)=>{
   if(!questVideoCapturesKeyV34(event.key,event))return;
   if(event.key==='Tab'){
    const buttons=Array.from(dialog.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')||[]);
    const next=questVideoTabTargetV34(event.type,event.shiftKey,buttons.indexOf(document.activeElement as HTMLButtonElement),buttons.length);
    if(!buttons.length||next!==null){event.preventDefault();if(next!==null)buttons[next].focus();}
    event.stopImmediatePropagation();return;
   }
   event.preventDefault();event.stopImmediatePropagation();
   if(event.type!=='keydown'||event.repeat)return;
   if(event.key==='Escape'){finish(true);return;}
   if((event.key==='Enter'||event.key===' ')&&event.target instanceof HTMLButtonElement&&dialog.current?.contains(event.target)){if(!event.target.disabled)event.target.click();return;}
   if(event.key===' '&&!viewRef.current.finished)togglePlayback();
  };
  const containFocus=(event:FocusEvent)=>{if(event.target instanceof Node&&dialog.current&&!dialog.current.contains(event.target)){const first=dialog.current.querySelector<HTMLButtonElement>('button:not(:disabled)');(first||dialog.current).focus();}};
  window.addEventListener('keydown',captureKey,true);window.addEventListener('keyup',captureKey,true);document.addEventListener('focusin',containFocus);
  return()=>{window.removeEventListener('keydown',captureKey,true);window.removeEventListener('keyup',captureKey,true);document.removeEventListener('focusin',containFocus);if(restore?.isConnected)restore.focus();};
 },[portalTarget]);

 useEffect(()=>{
  if(!scene||!portalTarget||!video.current)return;
  const media=video.current,motion=matchMedia('(prefers-reduced-motion: reduce)'),range=questVideoRangeV34(scene,sceneAct);
  let disposed=false,failedGeneration=false,metadataValid=false,wantAutoplay=!motion.matches&&!document.hidden,watchdog=0,frameRequest=0;
  resolved.current=false;setView({...initialView,reduced:motion.matches,elapsed:range.startSeconds});
  media.muted=true;media.volume=0;media.playbackRate=1;
  const clearWatchdog=()=>{window.clearTimeout(watchdog);watchdog=0;};
  const fail=()=>{if(disposed)return;failedGeneration=true;wantAutoplay=false;clearWatchdog();media.pause();setView(v=>({...v,ready:false,failed:true,playing:false,buffering:false,finished:false}));};
  const watchLoading=()=>{if(!watchdog)watchdog=window.setTimeout(fail,scene.loadTimeoutMs);};
  const completeRange=()=>{
   if(disposed||failedGeneration||!metadataValid||viewRef.current.finished)return;
   clearWatchdog();cancelAnimationFrame(frameRequest);media.pause();
   // A preview holds its last native frame; the full film retains the browser's decoded final frame.
   if(sceneAct!==undefined&&!media.ended)media.currentTime=Math.max(range.startSeconds,range.endSeconds-1/scene.fps);
   media.dataset.nativeFrame=String(range.endFrame-1);
   setView(v=>({...v,playing:false,buffering:false,finished:true,elapsed:range.endSeconds}));
  };
  const updateTime=()=>{
   if(disposed||failedGeneration||!metadataValid)return;
   if(sceneAct!==undefined&&media.currentTime>=range.endSeconds-1e-6){completeRange();return;}
   const elapsed=viewRef.current.finished?range.endSeconds:Math.min(range.endSeconds,Math.max(range.startSeconds,media.currentTime||0));
   media.dataset.nativeFrame=String(Math.min(range.endFrame-1,questVideoFrameV34(scene,elapsed)));
   setView(v=>Math.abs(v.elapsed-elapsed)<.04?v:{...v,elapsed});
  };
  const trackFrame=()=>{updateTime();if(!disposed&&!media.paused&&!media.ended&&!viewRef.current.finished)frameRequest=requestAnimationFrame(trackFrame);};
  const play=()=>{
   if(disposed||failedGeneration||!viewRef.current.ready||document.hidden)return;
   if(media.ended||viewRef.current.finished||media.currentTime<range.startSeconds||media.currentTime>=range.endSeconds){media.currentTime=range.startSeconds;setView(v=>({...v,elapsed:range.startSeconds,finished:false}));}
   media.muted=true;media.volume=0;media.playbackRate=1;
   void media.play().catch(()=>{if(!disposed&&!failedGeneration)setView(v=>({...v,playing:false,blocked:true}));});
  };
  const generationControls={play,pause:()=>media.pause()};controls.current=generationControls;
  const loadedMetadata=()=>{
   if(disposed||failedGeneration)return;metadataValid=questVideoDurationMatchesV34(scene,media.duration)&&media.videoWidth>0&&media.videoHeight>0;
   if(!metadataValid){fail();return;}if(range.startSeconds>0)media.currentTime=range.startSeconds;
  };
  const ready=()=>{
   if(disposed||failedGeneration||!metadataValid||media.readyState<2||media.seeking)return;
   clearWatchdog();setView(v=>({...v,ready:true,failed:false,buffering:false}));
   if(wantAutoplay&&!document.hidden){wantAutoplay=false;void media.play().catch(()=>{if(!disposed&&!failedGeneration)setView(v=>({...v,playing:false,blocked:true}));});}
  };
  const playing=()=>{
   if(disposed)return;if(failedGeneration||!metadataValid){media.pause();return;}clearWatchdog();setView(v=>({...v,playing:true,buffering:false,blocked:false,finished:false}));cancelAnimationFrame(frameRequest);frameRequest=requestAnimationFrame(trackFrame);
  };
  const paused=()=>{if(disposed)return;wantAutoplay=false;cancelAnimationFrame(frameRequest);if(viewRef.current.ready)clearWatchdog();setView(v=>({...v,playing:false,buffering:false}));};
  const waiting=()=>{if(disposed||failedGeneration||media.ended||media.paused&&viewRef.current.ready)return;setView(v=>({...v,buffering:true}));watchLoading();};
  const ended=()=>{if(disposed||failedGeneration||!metadataValid)return;completeRange();};
  const visibility=()=>{if(document.hidden){wantAutoplay=false;media.pause();}};
  const reducedMotion=()=>{setView(v=>({...v,reduced:motion.matches}));if(motion.matches){wantAutoplay=false;media.pause();}};
  const listeners:[string,EventListener][]=[['loadedmetadata',loadedMetadata],['loadeddata',ready],['canplay',ready],['seeked',ready],['playing',playing],['pause',paused],['waiting',waiting],['stalled',waiting],['ended',ended],['error',fail],['timeupdate',updateTime]];
  for(const[name,listener]of listeners)media.addEventListener(name,listener);
  document.addEventListener('visibilitychange',visibility);motion.addEventListener('change',reducedMotion);
  media.load();watchLoading();
  return()=>{disposed=true;clearWatchdog();cancelAnimationFrame(frameRequest);for(const[name,listener]of listeners)media.removeEventListener(name,listener);document.removeEventListener('visibilitychange',visibility);motion.removeEventListener('change',reducedMotion);media.pause();if(controls.current===generationControls)controls.current=null;};
 },[scene,sceneAct,portalTarget,retry]);

 useEffect(()=>{if(view.ready&&document.activeElement===dialog.current)playButton.current?.focus();},[view.ready]);
 if(!portalTarget)return null;
 if(!scene)return createPortal(<div className={styles.overlay}><div ref={dialog} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}><header className={styles.header}><h2 id={titleId}>Cena indisponível</h2></header><div className={styles.screen}><p className={styles.loading}>Esta cena não está no registro atual.</p></div><footer className={styles.footer}><button type="button" onClick={()=>finish(true)}>{replay?'Voltar a Cenas':'Voltar à missão'}</button></footer></div></div>,portalTarget);
 const range=questVideoRangeV34(scene,sceneAct),elapsed=Math.max(0,view.elapsed-range.startSeconds),progress=Math.min(100,elapsed/range.durationSeconds*100);
 const hint=view.failed?'Você pode tentar novamente ou voltar.':view.finished?replay?'Reveja a cena ou volte a Cenas.':'Relato concluído. Continue sua aventura.':view.blocked?'Selecione Reproduzir para iniciar a cena.':view.reduced&&!view.playing?'Movimento reduzido: reproduza quando quiser.':!view.playing&&view.ready?'Cena pausada. Espaço para reproduzir.':'Espaço para pausar · Esc para voltar';
 return createPortal(<div className={styles.overlay} data-quest-cinematic="v34" data-quest={filmSpec?undefined:scene.id} data-film-test={filmSpec?.id}>
  <div ref={dialog} tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={captionId+' '+hintId}>
   <header className={styles.header}><div><span className={styles.eyebrow}>{filmSpec?'Prévia de animação':'Ecos que Escolhem'}</span><h2 id={titleId}>{scene.title}</h2></div><span className={styles.counter}>{questVideoClockV34(range.durationSeconds)}</span></header>
   <div className={styles.screen} aria-busy={(!view.ready||view.buffering)&&!view.failed}>
    <video ref={video} className={styles.video} src={scene.src} poster={scene.poster} muted playsInline preload="auto" controls={false} disablePictureInPicture data-native-frame={range.startFrame} data-fps={scene.fps} aria-label={'Cena: '+scene.title}>Seu navegador não conseguiu reproduzir este vídeo.</video>
    {(!view.ready||view.failed)&&<div className={styles.loading} role={view.failed?'alert':'status'}><p>{view.failed?'Não foi possível preparar esta cena.':'Preparando a cena…'}</p>{view.failed&&<button type="button" onClick={()=>setRetry(v=>v+1)}>Tentar novamente</button>}</div>}
    {view.ready&&view.buffering&&<div className={styles.buffering} role="status">Preparando o próximo trecho…</div>}
   </div>
   <div className={styles.narrative}><div className={styles.actors} aria-label={'Participação: '+scene.actors.join(', ')}>{scene.avatars.map(avatar=><img key={avatar.src} src={avatar.src} alt={avatar.name} width="44" height="44"/>)}</div><p id={captionId} aria-live="polite">{caption||questVideoCaptionV34(scene,Math.max(range.startSeconds,view.elapsed))}</p></div>
   <footer className={styles.footer}><div className={styles.timeline}><progress max={100} value={progress} aria-label="Progresso da cena"/><span aria-hidden="true">{questVideoClockV34(elapsed)} / {questVideoClockV34(range.durationSeconds)}</span></div><div className={styles.footerRow}><div className={styles.controls}>
    <button ref={playButton} type="button" onClick={togglePlayback} disabled={!view.ready||view.failed}>{view.finished?'Repetir cena':view.playing?'Pausar':'Reproduzir'}</button>
    <button type="button" onClick={()=>finish(true)}>{replay?'Voltar a Cenas':'Pular cena'}</button>
   </div><p id={hintId} className={styles.hint} aria-live="polite">{hint}</p>{!replay&&<button className={styles.continue} type="button" onClick={()=>finish(false)} disabled={!view.finished||!view.ready||view.failed}>Continuar</button>}</div></footer>
  </div>
 </div>,portalTarget);
}
