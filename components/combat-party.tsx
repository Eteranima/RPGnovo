import type {CSSProperties} from 'react';
import {HeroPortrait} from './hero-card';
import {HERO_CARD_ART,type CardAperture} from '@/lib/game/heroCardArt';
import {ULTIMATE_NAMES,type Hero,type HeroId} from '@/lib/game/data';
import type {Progression} from '@/lib/game/progression';
import styles from './combat-party.module.css';

export type CombatPartyProps={heroes:Hero[];activeId?:HeroId;limits:Progression['limit'];lycan?:boolean};
const pct=(current:number,maximum:number)=>Math.max(0,Math.min(100,current/Math.max(1,maximum)*100));
const aperture=(a:CardAperture):CSSProperties=>({left:a.left+'%',top:a.top+'%',width:a.width+'%',height:a.height+'%'});
function Vital({hero,kind}:{hero:Hero;kind:'hp'|'mp'}){
 const current=hero[kind],maximum=kind==='hp'?hero.maxHp:hero.maxMp,art=HERO_CARD_ART[hero.id];
 return <div className={styles.vital} data-kind={kind}><span>{kind.toUpperCase()}</span><span className={styles.vessel} data-above={art.trackAboveFrame||undefined}>
  <span className={styles.track} style={aperture(kind==='hp'?art.hpAperture:art.mpAperture)} role="progressbar" aria-label={hero.name+' · '+kind.toUpperCase()} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current} aria-valuetext={current+' de '+maximum}><i style={{width:pct(current,maximum)+'%'}}/></span>
  <img src={art[kind]} alt="" draggable={false}/>
 </span><strong className={styles.numbers}>{current}<span>/{maximum}</span></strong></div>;
}
export function CombatParty({heroes,activeId,limits,lycan=false}:CombatPartyProps){
 return <footer className={styles.party} style={{'--party-count':Math.max(1,Math.min(5,heroes.length))} as CSSProperties} aria-label="Grupo em combate" data-combat-party>
  {heroes.map(hero=>{const limit=Math.max(0,Math.min(100,limits[hero.id]||0));return <section key={hero.id} className={styles.card} data-hero={hero.id} data-current={hero.id===activeId||undefined} data-fallen={hero.hp===0||undefined} aria-label={hero.name+(hero.id===activeId?' · turno atual':'')}>
   <div className={styles.identity}><img className={styles.frame} src={HERO_CARD_ART[hero.id].frame} alt="" draggable={false}/><HeroPortrait h={hero} lycan={lycan}/><div className={styles.heading}><strong>{hero.name}</strong><span>{hero.element}</span></div></div>
   <div className={styles.vitals}><Vital hero={hero} kind="hp"/><Vital hero={hero} kind="mp"/></div>
   <div className={styles.ultimate} title={ULTIMATE_NAMES[hero.id]} data-ready={limit===100||undefined}><span>ULT</span><span className={styles.ultimateTrack} role="progressbar" aria-label={ULTIMATE_NAMES[hero.id]+' · '+hero.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={limit}><i style={{width:limit+'%'}}/></span><strong>{limit===100?'Pronta':limit+'%'}</strong></div>
  </section>;})}
 </footer>;
}
