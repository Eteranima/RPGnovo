'use client';
import {useEffect,useId,useRef,useState,type ReactNode,type CSSProperties} from 'react';
import {createPortal} from 'react-dom';
import {ELEMENT_COLORS,ELEMENT_LABELS,type Hero} from '@/lib/game/data';
import type {Battle} from '@/lib/game/engine';
import type {EnemyIntentV32} from '@/lib/game/combatPlanningV32';
import {STATUS,type Status,type StatusId} from '@/lib/game/progression';
import {HeroPortrait} from './hero-card';
import {GameIcon} from './game-icon';
import styles from './battle-intent-v32.module.css';

const timingLabels={acting:'Agindo',imminent:'A seguir','next-round':'Próxima rodada'};
const kindLabels={attack:'Ataque',skill:'Técnica',collapse:'Área',ultimate:'Ultimate',blocked:'Imobilizado'};

/** The game also listens on window: details consume game keys while preserving browser shortcuts. */
export function combatDetailTabTarget(index:number,count:number,shift:boolean,type:string){
 if(type!=='keydown'||!count)return null;
 return shift?(index<=0?count-1:null):(index===count-1||index<0?0:null);
}

function CombatDetails({title,children,onClose}:{title:string;children:ReactNode;onClose:()=>void}){
 const dialog=useRef<HTMLElement>(null),close=useRef(onClose),titleId=useId(),[body,setBody]=useState<HTMLElement|null>(null);close.current=onClose;
 useEffect(()=>{setBody(document.body);},[]);
 useEffect(()=>{
  if(!body)return;const previous=document.activeElement instanceof HTMLElement?document.activeElement:null;
  const first=dialog.current?.querySelector<HTMLButtonElement>('button');first?.focus();
  const capture=(event:KeyboardEvent)=>{
   if(event.ctrlKey||event.metaKey||event.altKey)return;
   if(event.key==='Tab'){
    const buttons=Array.from(dialog.current?.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input,select,[tabindex="0"]')||[]);
    const target=combatDetailTabTarget(buttons.indexOf(document.activeElement as HTMLElement),buttons.length,event.shiftKey,event.type);
    if(target!==null){event.preventDefault();buttons[target]?.focus();}
   }else{event.stopImmediatePropagation();if(event.key==='Escape'&&event.type==='keydown'){event.preventDefault();close.current();}return;}
   event.stopImmediatePropagation();
  };
  window.addEventListener('keydown',capture,true);window.addEventListener('keyup',capture,true);
  return()=>{window.removeEventListener('keydown',capture,true);window.removeEventListener('keyup',capture,true);if(previous?.isConnected)previous.focus();};
 },[body]);
 if(!body)return null;
 return createPortal(<div className={styles.backdrop} onClick={event=>{if(event.target===event.currentTarget)onClose();}}><section ref={dialog} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}><header><h3 id={titleId}>{title}</h3><button className={styles.close} onClick={onClose}>Fechar</button></header><div className={styles.detailContent}>{children}</div></section></div>,body);
}

export function EnemyIntentDetailsV32({intent,heroes,lycan=false}:{intent:EnemyIntentV32;heroes:readonly Hero[];lycan?:boolean}){
 return <><p className={styles.detailLead}><b>{intent.name}</b><br/>{timingLabels[intent.timing]} · rodada {intent.round} · {ELEMENT_LABELS[intent.element]}{intent.area?' · atinge o grupo':''}</p>
  {intent.kind==='blocked'?<p>{intent.blockedBy==='bind'?'A prisão de pedra':'O congelamento'} fará o inimigo perder esta ação. Nenhum aliado será atingido.</p>:<>
   <p>Previsão se o golpe acertar. {intent.missChance===.5?'Cegueira: 50% de chance de errar.':'Este golpe não está sujeito à cegueira.'} A previsão acompanha os estados e a ordem dos turnos.</p>
   <ul className={styles.detailTargets}>{intent.targets.map(target=>{const hero=heroes.find(h=>h.id===target.id);if(!hero)return null;return <li key={target.id}><HeroPortrait h={hero} lycan={lycan}/><div><strong>{hero.name} <small>{hero.hp}/{hero.maxHp} HP</small></strong><span>{target.damageRange[0]===target.damageRange[1]?target.damageOnHit:`${target.damageRange[0]}–${target.damageRange[1]}`} de dano{target.guarded?` · guarda preserva ${target.guardSavedHp} HP`:''}</span>{target.status&&<span className={styles.statusLine}><GameIcon index={STATUS[target.status].icon}/>{STATUS[target.status].name}{target.statusPrevented?' · impedido pela proteção ou pela queda do alvo':` · ${target.statusTurns} ${target.statusTurns===1?'ação':'ações'}`}</span>}</div></li>;})}</ul>
   {intent.blockedBy==='silence'&&<p>Silêncio impede a ultimate e o colapso. O golpe atual ainda pode causar o estado indicado.</p>}
  </>}
  <p className={styles.advice}><img src="/assets/v28/combat/guard.png" alt="" aria-hidden="true"/>Guardar reduz o dano recebido e impede novos estados até o começo do próximo turno do aliado. Uma guarda que termina antes da ação inimiga não é contada na previsão.</p>
  <p>{intent.controlAvailable?'Congelamento ou prisão de pedra ainda podem interromper uma ação deste inimigo.':'O inimigo já recebeu uma imobilização nesta batalha; não pode ser imobilizado novamente.'}</p>
  {intent.kind!=='blocked'&&<p>Carga inimiga: {intent.chargeBefore}% → {intent.chargeAfter}% após esta ação.</p>}
 </>;
}

/** Compact header row; the resolver owns targeting, damage and turn rules. */
export function BattleIntentV32({intent,heroes,lycan=false}:{intent:EnemyIntentV32|null;heroes:readonly Hero[];lycan?:boolean}){
 const [details,setDetails]=useState(false);
 if(!intent)return null;
 const statuses=[...new Set(intent.targets.filter(t=>t.status&&!t.statusPrevented).map(t=>t.status!))];
 return <div className={styles.intent} data-enemy-intent={intent.kind} data-intent-timing={intent.timing} style={{'--intent-element':ELEMENT_COLORS[intent.element]} as CSSProperties}>
  <span className={styles.summary} aria-live="polite"><b>{timingLabels[intent.timing]}</b><span>{intent.kind==='blocked'?intent.blockedBy==='bind'?'Prisão de pedra':'Congelamento':kindLabels[intent.kind]+' · '+ELEMENT_LABELS[intent.element]}</span></span>
  <span className={styles.targets} aria-label="Alvos previstos">{intent.targets.map(target=>{const hero=heroes.find(h=>h.id===target.id);return hero&&<span className={styles.target} key={target.id} role="img" aria-label={`${hero.name}: ${hero.hp} de ${hero.maxHp} HP${target.guarded?', protegido pela guarda':''}`}><HeroPortrait h={hero} lycan={lycan}/><span>{hero.hp}<small> HP</small></span>{target.guarded&&<img className={styles.guardMark} src="/assets/v28/combat/guard.png" alt="" aria-hidden="true"/>}</span>;})}</span>
  <span className={styles.threatStates} aria-label={statuses.map(id=>STATUS[id].name).join(', ')||'Nenhum novo estado previsto'}>{statuses.map(id=><GameIcon key={id} index={STATUS[id].icon}/>)}</span>
  <button className={styles.detailsButton} onClick={()=>setDetails(true)} aria-haspopup="dialog" aria-label={`Detalhes da previsão: ${intent.name}`}>Detalhes</button>
  {details&&<CombatDetails title="Próxima ação inimiga" onClose={()=>setDetails(false)}><EnemyIntentDetailsV32 intent={intent} heroes={heroes} lycan={lycan}/></CombatDetails>}
 </div>;
}

export function combatStatusDescriptionV32(id:StatusId,enemy=false){
 if(id==='silence')return enemy?'Impede a ultimate e o colapso. O golpe individual ainda pode causar estados.':'Impede habilidades. Ataque, guarda, itens e ultimate continuam disponíveis.';
 if(id==='blind'&&!enemy)return '50% de chance de errar ataques e habilidades ofensivas. A ultimate não é afetada.';
 return STATUS[id].description;
}
function EffectList({states,enemy=false}:{states:readonly Status[];enemy?:boolean}){return <ul className={styles.effectList}>{states.map(state=><li key={state.id}><GameIcon index={STATUS[state.id].icon}/><div><b>{STATUS[state.id].name} · {state.turns} {state.turns===1?'ação':'ações'}</b><span>{combatStatusDescriptionV32(state.id,enemy)}</span></div></li>)}</ul>;}

export function CombatStatusHelpV32({battle,heroes,lycan=false}:{battle:Battle;heroes:readonly Hero[];lycan?:boolean}){
 const [open,setOpen]=useState(false),count=heroes.reduce((n,h)=>n+(battle.statuses[h.id]?.length||0)+(h.guard?1:0),battle.statuses.enemy?.length||0);
 return <><button className={styles.statusButton} onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-label={`Estados e proteção do grupo${count?`: ${count} efeitos ativos`:''}`}>Estados{count?` ${count}`:''}</button>{open&&<CombatDetails title="Estados e proteção" onClose={()=>setOpen(false)}>
  <p>Os efeitos duram ações do personagem afetado. Antídoto remove estados do aliado selecionado.</p>
  {heroes.map(hero=><section className={styles.heroEffects} key={hero.id}><header><HeroPortrait h={hero} lycan={lycan}/><b>{hero.name} · {hero.hp}/{hero.maxHp} HP</b></header>{hero.guard&&<p className={styles.advice}><img src="/assets/v28/combat/guard.png" alt="" aria-hidden="true"/>Guarda ativa: recebe 55% menos dano e impede novos estados até começar o próximo turno.</p>}{battle.statuses[hero.id]?.length?<EffectList states={battle.statuses[hero.id]}/>:<p>{hero.hp<=0?'Caído. Poção pode recuperá-lo.':'Sem estados negativos.'}</p>}</section>)}
  <section className={styles.heroEffects}><header><b>{battle.name}</b></header>{battle.statuses.enemy?.length?<EffectList states={battle.statuses.enemy} enemy/>:<p>Sem estados negativos.</p>}{battle.weakened&&<p>Enfraquecido: o próximo golpe causa 55% menos dano.</p>}<p>{battle.freezeUsed?'Já recebeu uma imobilização; não pode receber outra nesta batalha.':'Uma imobilização ainda pode fazê-lo perder uma ação.'}</p></section>
 </CombatDetails>}</>;
}
