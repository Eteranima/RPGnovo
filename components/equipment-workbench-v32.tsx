'use client';
import {useState} from 'react';
import {GameIcon} from './game-icon';
import {heroBases,type HeroId} from '@/lib/game/data';
import {gearById,SETS,SLOT_NAMES,type Slot} from '@/lib/game/progression';
import {equipmentPreviewV32,equipmentSearchV32} from '@/lib/game/equipmentPreviewV32';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import styles from './equipment-workbench-v32.module.css';

const METRICS=[['hp','HP máximo'],['mp','MP máximo'],['atk','Força'],['spell','Bônus de magia']] as const;
export function EquipmentWorkbenchV32({s,engine,hero,slot,focus}:{s:Snapshot;engine:GameEngine;hero:HeroId;slot?:Slot;focus?:string}){
 const [query,setQuery]=useState(''),[sort,setSort]=useState('name'),[available,setAvailable]=useState(false),p=s.progress,name=heroBases().find(h=>h.id===hero)!.name;
 const all=p.owned.filter(id=>gearById(id)&&(!slot||gearById(id)!.slot===slot));
 const candidates=all.map(id=>({id,item:gearById(id)!,preview:equipmentPreviewV32(p,hero,id)})).filter(({id,item,preview})=>(!available||preview.allowed||p.equipment[hero][item.slot]===id)&&equipmentSearchV32(`${item.name} ${item.set?SETS[item.set].name:''} ${SLOT_NAMES[item.slot]}`).includes(equipmentSearchV32(query))).sort((a,b)=>sort==='name'?a.item.name.localeCompare(b.item.name,'pt-BR'):((b.item[sort as 'hp'|'atk'|'spell']||0)-(a.item[sort as 'hp'|'atk'|'spell']||0)||a.item.name.localeCompare(b.item.name,'pt-BR')));
 return <section className={styles.workbench} aria-label={`Comparar equipamentos de ${name}`}>
  <div className={styles.tools}><label>Buscar peça ou conjunto<input type="search" value={query} onChange={e=>setQuery(e.target.value)} /></label><label>Ordenar<select value={sort} onChange={e=>setSort(e.target.value)}><option value="name">Nome</option><option value="atk">Mais força</option><option value="spell">Mais magia</option><option value="hp">Mais HP</option></select></label><label className={styles.check}><input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)}/>Usáveis por {name}</label></div>
  <p className={styles.note}>{candidates.length} de {all.length} peças · compare a troca completa, incluindo os bônus de conjunto.</p>
  <div className={styles.grid}>{candidates.map(({id,item,preview})=><article data-inventory-id={id} className={`${styles.card} ${id===focus?styles.focus:''}`} key={id}>
   <header><GameIcon index={item.icon}/><div><h4>{item.name}</h4><small>{SLOT_NAMES[item.slot]} · {item.set?SETS[item.set].name:'Equipamento'}</small></div></header>
   <p className={styles.itemStats}>+{item.hp} HP · +{item.mp} MP · +{item.atk} força{item.spell?` · +${item.spell} magia`:''}</p>
   {preview.allowed?<><div className={styles.deltas} aria-label="Mudança ao equipar">{METRICS.map(([metric,label])=><span key={metric} className={preview.delta[metric]>0?styles.gain:preview.delta[metric]<0?styles.loss:''}><small>{label}</small><b>{preview.delta[metric]>0?'+':''}{preview.delta[metric]}</b></span>)}</div><details className={styles.details}><summary>Comparação e conjuntos</summary><p>Substitui: {gearById(preview.currentId)?.name||'slot vazio'}.</p>{preview.transferFrom&&<p className={styles.transfer}>Esta peça sai de {heroBases().find(h=>h.id===preview.transferFrom)!.name}. O outro personagem fica sem ela.</p>}{preview.sets.length?preview.sets.map(set=><div key={set.id}><strong>{SETS[set.id].name}: {set.before} → {set.after} / 6</strong>{set.gained.map(n=><p className={styles.gain} key={'g'+n}>Ativa {n} peças: {n===3?SETS[set.id].three:SETS[set.id].six}</p>)}{set.lost.map(n=><p className={styles.loss} key={'l'+n}>Perde {n} peças: {n===3?SETS[set.id].three:SETS[set.id].six}</p>)}</div>):<p>Bônus de conjunto preservados.</p>}<small>Os números mostram atributos máximos e bônus de magia. A troca não restaura HP ou MP.</small></details></>:<p className={styles.reason}>{item.hero&&item.hero!==hero?`Exclusivo de ${heroBases().find(h=>h.id===item.hero)?.name}`:preview.reason}</p>}
   <button className="secondary-button" disabled={s.mode!=='world'||!preview.allowed} onClick={()=>engine.equip(hero,id)}>{preview.allowed?preview.transferFrom?'Transferir e equipar':`Equipar em ${name}`:preview.reason}</button>
  </article>)}</div>
  {!candidates.length&&<p className={styles.empty}>Nenhuma peça corresponde aos filtros. Altere a busca ou desmarque “Usáveis”.</p>}
 </section>;
}
