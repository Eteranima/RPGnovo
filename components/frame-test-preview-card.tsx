'use client';

import {useEffect,useRef} from 'react';
import {MIKA_FRAME_TEST_V35} from '@/lib/art/frameTestV35';
import type {Snapshot} from '@/lib/game/engine';
import {HudIcon} from './hud-icon';
import styles from './frame-test-preview-card.module.css';

/** Viewing the experiment requires no quest completion and writes no quest flags. */
export function FrameTestPreviewCard({s,onPreview,focusId}:{s:Snapshot;onPreview?:()=>void;focusId?:string}){
 const button=useRef<HTMLButtonElement>(null),film=MIKA_FRAME_TEST_V35;
 useEffect(()=>{
  if(focusId!==film.id)return;
  const frame=requestAnimationFrame(()=>button.current?.focus());
  return()=>cancelAnimationFrame(frame);
 },[focusId,film.id]);
 return <section className={styles.section} aria-labelledby="frame-test-heading">
  <div className="menu-intro"><span className="eyebrow">PRÉVIA DE ANIMAÇÃO</span><h3 id="frame-test-heading">Teste quadro a quadro · Mika</h3><p>Compare uma sequência curta de desenhos. Este teste é independente das cinco memórias de missão e não libera recompensas.</p></div>
  <article className={styles.card} data-frame-test={film.id}>
   <div className={styles.poster}><img src={film.poster} alt="Mika no teste de animação quadro a quadro" loading="lazy" width="1280" height="720"/></div>
   <div className={styles.content}><span className={styles.label}>48 QUADROS · 24 FPS · 2 SEGUNDOS</span><h4>{film.title}</h4><p>Reproduza, pause ou repita. Ao sair, volta a Cenas; seu progresso de missões é preservado.</p><button ref={button} type="button" className="secondary-button" data-frame-test-preview={film.id} onClick={onPreview} disabled={!onPreview||s.mode!=='world'||s.gachaBusy||s.summonBusy}><HudIcon name="scenes"/>Assistir ao teste</button></div>
  </article>
 </section>;
}
