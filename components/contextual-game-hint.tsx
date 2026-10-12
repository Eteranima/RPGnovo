'use client';
import {useState} from 'react';
import type {GameEngine} from '@/lib/game/engine';
import {HudIcon} from './hud-icon';
import styles from './contextual-game-hint.module.css';

export function ContextualGameHint({engine,onOpen}:{engine:GameEngine;onOpen:(tab:string)=>void}){
 const hint=engine.contextualHintV36(),[expandedId,setExpandedId]=useState<string|null>(null);if(!hint)return null;
 const expanded=expandedId===hint.id;
 const label=hint.action==='skills'?'Ver caminhos':hint.action==='party'?'Abrir Grupo':hint.action==='gacha'?'Ver o baile':'Entendi';
 const dismiss=()=>engine.dismissContextualHintV36(hint.id);
 return <aside className={styles.hint} aria-label="Dica de aventura" key={hint.id}>
  <div className={styles.heading}><button aria-expanded={expanded} onClick={()=>setExpandedId(value=>value===hint.id?null:hint.id)}><HudIcon name={hint.action==='skills'?'skills':hint.action==='party'?'party':'journal'}/><strong>{hint.title}</strong></button><button className={styles.close} aria-label="Dispensar esta dica" onClick={dismiss}>×</button></div>
  {expanded&&<div className={styles.body}><p>{hint.text}</p><button onClick={()=>{dismiss();if(hint.action&&hint.action!=='combat')onOpen(hint.action);setExpandedId(null);}}>{label}</button></div>}
 </aside>;
}
