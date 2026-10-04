'use client';

import {ASSETS,MAPS,ORIGINS,STARTING_HERO_IDS,heroBases,type HeroId} from '@/lib/game/data';
import {COMPANIONS} from '@/lib/game/data';
import {CompanionPortrait} from './companion-portrait';
import styles from './origin-selection.module.css';

export function OriginSelection({chosen,onChoose,onStart,onBack}:{chosen:HeroId;onChoose:(id:HeroId)=>void;onStart:()=>void;onBack:()=>void}){
 const heroes=STARTING_HERO_IDS.map(id=>heroBases().find(hero=>hero.id===id)!);
 const hero=heroes.find(candidate=>candidate.id===chosen)||heroes[0],origin=ORIGINS[hero.id];
 return <section className={styles.screen} aria-label="Escolha do protagonista">
  <header className={styles.heading}><div><span className={styles.eyebrow}>STONE REACH · CINCO ORIGENS</span><h1>Quem vai lembrar?</h1></div><p>A jornada começa com você e seu companheiro. Encontre os outros aliados pelo caminho.</p></header>
  <div className={styles.cards} role="group" aria-label="Escolher protagonista">{heroes.map(candidate=><button key={candidate.id} type="button" className={`${styles.card} ${hero.id===candidate.id?styles.selected:''}`} aria-pressed={hero.id===candidate.id} onClick={()=>onChoose(candidate.id)} data-starting-hero={candidate.id}>
   <img className={styles.heroArt} src={ASSETS[`dlg_${candidate.id}`]} alt="" draggable={false}/>
   <span className={styles.cardCaption}><small>{candidate.element} · {candidate.role}</small><strong>{candidate.name}</strong><em>{MAPS[ORIGINS[candidate.id].map].name}</em><span className={styles.companion}><CompanionPortrait heroId={candidate.id} size={30}/>{COMPANIONS[candidate.id].name}</span></span>
  </button>)}</div>
  <div className={styles.details} aria-live="polite"><div><span className={styles.eyebrow}>{hero.name.toUpperCase()}</span><h2>{origin.title}</h2><p>{origin.lore}</p></div><div className={styles.actions}><button className="primary-button" type="button" data-origin-start onClick={onStart}>Começar com {hero.name}</button><button className="secondary-button" type="button" onClick={onBack}>Voltar à abertura</button></div></div>
 </section>;
}
