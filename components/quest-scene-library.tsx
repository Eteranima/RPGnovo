'use client';
import {useEffect,useRef} from 'react';
import {getQuestCinematicV34} from '@/lib/art/questCinematicsV34';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {HudIcon} from './hud-icon';
import styles from './quest-scene-library.module.css';

/** A memory library uses the existing cinematicSeen flag; it never advances a mission. */
export function QuestSceneLibrary({s,engine,onReplay,focusId}:{s:Snapshot;engine:GameEngine;onReplay?:(id:string)=>void;focusId?:string}){
 const library=useRef<HTMLDivElement>(null);
 const entries=engine.questJournalV31().filter(entry=>entry.kind==='long'&&entry.quest.cinematic);
 useEffect(()=>{
  if(!focusId)return;
  const frame=requestAnimationFrame(()=>Array.from(library.current?.querySelectorAll<HTMLButtonElement>('[data-quest-scene-replay]')||[]).find(button=>button.dataset.questSceneReplay===focusId)?.focus());
  return()=>cancelAnimationFrame(frame);
 },[focusId]);
 return <section className={styles.library} aria-labelledby="quest-scenes-heading">
  <div className="menu-intro"><span className="eyebrow">ECOS QUE ESCOLHEM</span><h3 id="quest-scenes-heading">Memórias das missões</h3><p>As cinco cenas ficam disponíveis após sua primeira exibição no desfecho da missão. Você pode revê-las de qualquer lugar; ao sair, volta a Cenas.</p></div>
  <div ref={library} className={styles.grid}>{entries.map(entry=>{
   const scene=getQuestCinematicV34(entry.id),seen=entry.cinematicSeen;
   const reason=entry.status==='cinematic'?'Assista ao desfecho no Diário para liberar esta memória.':'Conclua a história e assista ao desfecho para liberar esta memória.';
   return <article key={entry.id} className={`${styles.card} ${seen?styles.unlocked:styles.locked}`} data-quest-scene={entry.id}>
    {scene&&<div className={styles.poster}><img src={scene.poster} alt="" loading="lazy" width="1280" height="720"/>{!seen&&<span className={styles.lockTag}>Ainda não vista</span>}</div>}
    <div className={styles.content}><span className={styles.label}>{seen?'MEMÓRIA LIBERADA':'MEMÓRIA BLOQUEADA'}</span><h4>{entry.name}</h4><p className={styles.actors}>{entry.giver}</p><p id={`scene-lock-${entry.id}`} className={styles.note}>{seen?'Reprodução livre · seu progresso é preservado.':reason}</p><button type="button" className="secondary-button" data-quest-scene-replay={entry.id} aria-label={`Rever ${entry.name}`} aria-describedby={`scene-lock-${entry.id}`} disabled={!seen||s.mode!=='world'||s.gachaBusy||s.summonBusy||!scene||!onReplay} onClick={()=>onReplay?.(entry.id)}><HudIcon name="scenes"/>{seen?'Rever cena':'Cena bloqueada'}</button></div>
   </article>;
  })}</div>
 </section>;
}
