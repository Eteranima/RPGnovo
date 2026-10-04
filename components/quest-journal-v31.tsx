'use client';
import {useState} from 'react';
import {MAPS} from '@/lib/game/data';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import type {QuestJournalEntryV31} from '@/lib/game/questRuntimeV31';
import {questEntityIdV31} from '@/lib/game/questsV31';
import {questDestinationsV32} from '@/lib/game/questNavigationV32';
import {QUEST_ART_V31} from '@/lib/art/questJournalV31';
import styles from './quest-journal-v31.module.css';

const CATEGORIES=[['long','Longas',5],['medium','Médias',5],['short','Curtas',10],['tutorial','Tutoriais',10]] as const;
const STATUS={locked:'Após o capítulo de Stone Reach',available:'Disponível',active:'Em andamento',cinematic:'Desfecho disponível',complete:'Recompensa disponível',claimed:'Concluída'};
const statusLabel=(q:QuestJournalEntryV31)=>q.status==='locked'?(q.quest.minStage>=5?STATUS.locked:`Disponível na etapa ${q.quest.minStage} do capítulo`):STATUS[q.status];
function Emblem({kind,className}:{kind:QuestJournalEntryV31['kind'];className?:string}){return <img className={className||styles.emblem} src={QUEST_ART_V31[kind]} alt=""/>;}

export function QuestJournalV31({s,engine,onGo,onClose}:{s:Snapshot;engine:GameEngine;onGo:(id:string)=>void;onClose:()=>void}){
 const entries=engine.questJournalV31();
 const [filter,setFilter]=useState<'all'|QuestJournalEntryV31['kind']>('all');
 const [selected,setSelected]=useState(()=>entries.find(q=>q.tracked)?.id||'tutorial-passos');
 const shown=entries.filter(q=>filter==='all'||q.kind===filter);
 const entry=shown.find(q=>q.id===selected)||shown.find(q=>q.tracked)||shown[0];
 const claimed=entries.filter(q=>q.status==='claimed').length;
 const destinations=entry?questDestinationsV32(entry,s.map,s.stage,s.progress.questsV31):[];
 return <section className={styles.journal} aria-label="Ecos que Escolhem: 30 novas missões">
  <header className={styles.intro}><div><span className="eyebrow">ECOS QUE ESCOLHEM</span><h3>Histórias que ficam com você</h3><p>Investigue vestígios, decifre sinais e decida o que merece ser preservado.</p></div><div className={styles.totals}><strong>{claimed} / 30</strong><span>missões concluídas</span><b>60 tiros no total</b><small>Recompensas em Cristais de Éter</small></div></header>
  <div className={styles.filters} role="group" aria-label="Duração das missões"><button aria-pressed={filter==='all'} onClick={()=>setFilter('all')}>Todas · 30</button>{CATEGORIES.map(([kind,label,count])=><button key={kind} aria-pressed={filter===kind} onClick={()=>setFilter(kind)}><Emblem kind={kind}/>{label} · {count}</button>)}</div>
  <div className={styles.layout}><nav className={styles.list} aria-label="Escolher missão">{shown.map(q=><button key={q.id} aria-pressed={entry?.id===q.id} onClick={()=>setSelected(q.id)} className={`${styles.questButton} ${q.status==='claimed'?styles.claimed:''}`}><Emblem kind={q.kind}/><span><strong>{q.name}</strong><small>{q.tracked?'Rastreada · ':''}{statusLabel(q)}</small></span><b>{q.rewardPulls}<small>{q.rewardPulls===1?'tiro':'tiros'}</small></b></button>)}</nav>
   {entry&&<article className={styles.detail} key={entry.id}><header><Emblem kind={entry.kind}/><div><span className="eyebrow">{CATEGORIES.find(c=>c[0]===entry.kind)?.[1]} · {entry.giver}</span><h4>{entry.name}</h4><small>{statusLabel(entry)}</small></div></header><p className={styles.synopsis}>{entry.summary}</p>
    <div className={styles.reward}><img src={QUEST_ART_V31.long} alt=""/><span><strong>{entry.rewardPulls} {entry.rewardPulls===1?'tiro':'tiros'} de Invocação</strong><small>{entry.rewardCrystals} Cristais de Éter · recebimento único</small></span></div>
    {entry.currentStep&&<section className={styles.step} aria-label="Etapa atual"><span className="eyebrow">ETAPA {entry.currentStep.index} DE {entry.currentStep.total}</span><h5>{entry.currentStep.title}</h5><p>{entry.currentStep.description}</p><ul>{entry.currentStep.objectives.map(o=><li key={o.id}><span>{o.label}</span><strong>{o.current} / {o.goal}</strong></li>)}</ul><div className={styles.destinations}>{entry.quest.steps[entry.currentStep.index-1].sites.map(site=>{const entityId=questEntityIdV31(entry.id,site.id),here=site.map===s.map,available=engine.activeEntities().some(e=>e.id===entityId);return <div key={site.id}><span><strong>{site.label}</strong><small>{MAPS[site.map].name}</small></span>{here&&available?<button className="secondary-button" disabled={s.mode!=='world'} onClick={()=>onGo(entityId)}>Caminhar até aqui</button>:(()=>{const destination=destinations.find(d=>d.entityId===entityId);return destination?.route?.exitId?<div className={styles.route}><small>{destination.route.maps.map(map=>MAPS[map].name).join(' → ')}</small><button className="secondary-button" disabled={s.mode!=='world'} onClick={()=>onGo(destination.route!.exitId!)}>Seguir para {MAPS[destination.route.maps[1]].name}</button></div>:<small>{destination?'Caminho ainda fechado pela história':'Vestígio registrado'}</small>;})()}</div>;})}</div></section>}
    {entry.status==='available'&&<p className={styles.note}>Aceite para começar a acompanhar esta história. Os objetivos contam a partir da etapa atual.</p>}
    {entry.choices.length>0&&<details className={styles.decisions}><summary>Suas decisões · {entry.choices.length}</summary>{entry.choices.map(c=><div key={c.siteId}><strong>{c.label}</strong><p>{c.detail}</p></div>)}{entry.consequences.map((text,i)=><p key={i} className={styles.consequence}>{text}</p>)}</details>}
    <div className={styles.actions}>{entry.status==='available'&&<button className="primary-button" disabled={s.mode!=='world'} onClick={()=>engine.startQuestV31(entry.id)}>Aceitar missão</button>}{entry.status==='active'&&<><button className="primary-button" disabled={s.mode!=='world'} onClick={()=>engine.trackQuestV31(entry.id)}>{entry.tracked?'Rastreada · atualizar':'Rastrear missão'}</button>{entry.tracked&&<button className="text-button" onClick={()=>engine.trackQuestV31(null)}>Parar de rastrear</button>}</>}{entry.status==='cinematic'&&<button className="primary-button" disabled={s.mode!=='world'} onClick={()=>{onClose();engine.resumeQuestCinematic(entry.id);}}>Assistir ao desfecho</button>}{entry.status==='complete'&&<button className="primary-button" disabled={s.mode!=='world'} onClick={()=>engine.claimQuestV31(entry.id)}>Receber {entry.rewardPulls} {entry.rewardPulls===1?'tiro':'tiros'}</button>}{entry.status==='claimed'&&<strong className={styles.received}>Recompensa recebida</strong>}</div>
   </article>}
  </div>
 </section>;
}

export function QuestRewardsV31({s,engine}:{s:Snapshot;engine:GameEngine}){const entries=engine.questJournalV31().filter(q=>q.status==='complete');return <>{entries.map(q=><article className={`menu-card ${styles.pending}`} key={q.id}><Emblem kind={q.kind}/><h4>{q.name}</h4><p>{q.rewardPulls} tiros · {q.rewardCrystals} Cristais de Éter</p><button className="primary-button" disabled={s.mode!=='world'} onClick={()=>engine.claimQuestV31(q.id)}>Receber missão</button></article>)}</>;}

export function QuestTrackerV31({engine,onJournal,onGo}:{engine:GameEngine;onJournal:()=>void;onGo:(id:string)=>void}){
 const q=engine.questJournalV31().find(entry=>entry.tracked);if(!q)return null;
 const s=engine.state,destinations=questDestinationsV32(q,s.map,s.stage,s.progress.questsV31),step=q.currentStep?q.quest.steps[q.currentStep.index-1]:null;
 // Ordered circuits retain their authored order. Other investigations offer the nearest remaining map.
 const destination=step?.sequence?destinations[0]:[...destinations].sort((a,b)=>(a.route?.maps.length??99)-(b.route?.maps.length??99))[0],route=destination?.route;
 return <aside className={styles.tracker} aria-label="Missão rastreada"><button onClick={onJournal}><Emblem kind={q.kind}/><span><strong>{q.name}</strong><small>{q.currentStep?`${q.currentStep.index}/${q.currentStep.total} · ${q.currentStep.title}`:statusLabel(q)}</small></span></button><p>{q.currentStep?.objectives.find(o=>o.current<o.goal)?.label||'Abra o diário para concluir o relato.'}</p>{destination&&route&&<button className={styles.go} onClick={()=>onGo(route.exitId||destination.entityId)}>{route.exitId?`Seguir para ${MAPS[route.maps[1]].name}`:`Ir até ${destination.site.label}`}</button>}{destination&&route?.exitId&&<small>Destino: {MAPS[destination.site.map].name} · {route.maps.length-1} {route.maps.length===2?'passagem':'passagens'}</small>}{destination&&!route&&<small>Avance a história para abrir este caminho.</small>}</aside>;
}
