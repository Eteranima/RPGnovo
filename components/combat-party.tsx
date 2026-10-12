import type {CSSProperties} from 'react';
import {HeroPortrait} from './hero-card';
import {HERO_CARD_ART,type CardAperture} from '@/lib/game/heroCardArt';
import {ASSETS,type Hero,type HeroId} from '@/lib/game/data';
import {heroArtIdV36} from '@/lib/game/variantsV36';
import {heroUiNameV36,heroUiUltimateV36} from '@/lib/game/heroUiNameV36';
import type {Progression} from '@/lib/game/progression';
import styles from './combat-party.module.css';

export type CombatPartyProps={heroes:Hero[];activeId?:HeroId;targetId?:HeroId;onSelectTarget?:(id:HeroId)=>void;limits:Progression['limit'];lycan?:boolean;exploration?:boolean;leaderId?:HeroId;onSelectHero?:(id:HeroId,slot:number)=>void;credits?:number|'∞';level?:number;saving?:string;masterMode?:boolean;selectDisabled?:boolean};
const pct=(current:number,maximum:number)=>Math.max(0,Math.min(100,current/Math.max(1,maximum)*100));
const aperture=(a:CardAperture):CSSProperties=>({left:a.left+'%',top:a.top+'%',width:a.width+'%',height:a.height+'%'});
function Vital({hero,kind}:{hero:Hero;kind:'hp'|'mp'}){
 const current=hero[kind],maximum=kind==='hp'?hero.maxHp:hero.maxMp,art=HERO_CARD_ART[hero.id];
 return <div className={styles.vital} data-kind={kind}><span>{kind.toUpperCase()}</span><span className={styles.vessel} data-above={art.trackAboveFrame||undefined}>
  <span className={styles.track} style={aperture(kind==='hp'?art.hpAperture:art.mpAperture)} role="progressbar" aria-label={hero.name+' · '+kind.toUpperCase()} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={current} aria-valuetext={current+' de '+maximum}><i style={{width:pct(current,maximum)+'%'}}/></span>
  <img src={art[kind]} alt="" draggable={false}/>
 </span><strong className={styles.numbers}>{current}<span>/{maximum}</span></strong></div>;
}
export function compactCombatPortrait(hero:Hero,lycan=false){
 const artId=hero.id==='gabriel'&&lycan?heroArtIdV36((hero.variantId||'gabriel')+'_lycan'):heroArtIdV36(hero);
 return ASSETS['face_'+artId]||ASSETS['dlg_'+artId]||ASSETS['face_'+hero.id];
}
function CompactMetric({hero,kind,value,maximum,title}:{hero:Hero;kind:'hp'|'mp'|'ult';value:number;maximum:number;title?:string}){
 return <div className={styles.compactMetric} data-kind={kind} data-ready={kind==='ult'&&value===100||undefined} title={title}>
  <span>{kind.toUpperCase()}</span><strong>{kind==='ult'?value===100?'Pronta':value+'%':<>{value}<span>/{maximum}</span></>}</strong>
  <span className={styles.compactRail} role="progressbar" aria-label={title||hero.name+' · '+kind.toUpperCase()} aria-valuemin={0} aria-valuemax={maximum} aria-valuenow={value} aria-valuetext={kind==='ult'?value+' de 100':value+' de '+maximum}><i style={{width:pct(value,maximum)+'%'}}/></span>
 </div>;
}
function CompactCombatParty({heroes,activeId,targetId,onSelectTarget,limits,lycan=false,selectDisabled=false}:CombatPartyProps){
 return <footer className={styles.party+' '+styles.compactParty} style={{'--party-count':Math.max(1,Math.min(5,heroes.length))} as CSSProperties} aria-label="Grupo em combate · 1–5 selecionam o alvo aliado" data-combat-party data-compact-combat>
  {heroes.map((hero,slot)=>{const label=heroUiNameV36(hero),limit=Math.max(0,Math.min(100,limits[hero.id]||0)),current=hero.id===activeId,selected=hero.id===targetId;return <section key={hero.id} className={styles.card+' '+styles.compactCard} data-hero={hero.id} data-current={current||undefined} data-ally-target={selected||undefined} data-fallen={hero.hp===0||undefined} aria-label={hero.name+(current?' · agindo agora':'')+(selected?' · alvo aliado':'')}>
   <div className={styles.compactIdentity} title={label.fullName}><img src={compactCombatPortrait(hero,lycan)} alt="" draggable={false}/><strong>{label.name}</strong></div>
   <div className={styles.compactVitals}><CompactMetric hero={hero} kind="hp" value={hero.hp} maximum={hero.maxHp}/><CompactMetric hero={hero} kind="mp" value={hero.mp} maximum={hero.maxMp}/><CompactMetric hero={hero} kind="ult" value={limit} maximum={100} title={heroUiUltimateV36(hero)+' · '+hero.name}/></div>
   {onSelectTarget&&<button className={styles.selectTarget} disabled={selectDisabled} aria-label={`Slot ${slot+1}: selecionar ${hero.name} como alvo aliado · ${hero.hp}/${hero.maxHp} HP · ${hero.mp}/${hero.maxMp} MP · ultimate ${limit}%${current?' · agindo agora':''}`} aria-pressed={selected} aria-keyshortcuts={String(slot+1)} onClick={()=>onSelectTarget(hero.id)}/>}
  </section>;})}
 </footer>;
}
export function CombatParty({heroes,activeId,targetId,onSelectTarget,limits,lycan=false,exploration=false,leaderId,onSelectHero,credits,level,saving,masterMode=false,selectDisabled=false}:CombatPartyProps){
 if(!exploration)return <CompactCombatParty heroes={heroes} activeId={activeId} targetId={targetId} onSelectTarget={onSelectTarget} limits={limits} lycan={lycan} selectDisabled={selectDisabled}/>;
 const leader=heroes.find(hero=>hero.id===leaderId),selectedId=exploration?leaderId:activeId;
 return <footer className={styles.party+(exploration?' '+styles.exploration:'')} style={{'--party-count':Math.max(1,Math.min(5,heroes.length))} as CSSProperties} aria-label={exploration?'Grupo de exploração':'Grupo em combate'} data-combat-party data-exploration-party={exploration||undefined}>
  {heroes.map((hero,slot)=>{const limit=Math.max(0,Math.min(100,limits[hero.id]||0)),label=heroUiNameV36(hero),ultimateName=heroUiUltimateV36(hero);return <section key={hero.id} className={styles.card} data-hero={hero.id} data-current={hero.id===selectedId||undefined} data-fallen={hero.hp===0||undefined} aria-label={hero.name+(hero.id===selectedId?exploration?' · líder atual':' · turno atual':'')}>
   <div className={styles.identity}><img className={styles.frame} src={HERO_CARD_ART[hero.id].frame} alt="" draggable={false}/><HeroPortrait h={hero} lycan={lycan}/><div className={styles.heading} title={label.fullName}><strong>{label.name}{label.variantTitle&&<span className={styles.rarity} aria-label="versão cinco estrelas">5★</span>}</strong><span>{hero.element}</span></div></div>
   <div className={styles.vitals}><Vital hero={hero} kind="hp"/><Vital hero={hero} kind="mp"/></div>
   <div className={styles.ultimate} title={ultimateName} data-ready={limit===100||undefined}><span>ULT</span><span className={styles.ultimateTrack} role="progressbar" aria-label={ultimateName+' · '+hero.name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={limit}><i style={{width:limit+'%'}}/></span><strong>{limit===100?'Pronta':limit+'%'}</strong></div>
   {exploration&&onSelectHero&&<><span className={styles.slotNumber} aria-hidden="true">{slot+1}</span><button className={styles.selectHero} disabled={selectDisabled} aria-label={`Slot ${slot+1}: selecionar ${hero.name} como líder · ${hero.hp}/${hero.maxHp} HP · ${hero.mp}/${hero.maxMp} MP`} aria-pressed={hero.id===leaderId} aria-keyshortcuts={String(slot+1)} onKeyDown={event=>{if(event.key==='Tab')event.stopPropagation();}} onClick={()=>onSelectHero(hero.id,slot)}/></>}
  </section>;})}
  {exploration&&<div className={styles.resourceStrip}>{leader&&<span className={styles.leaderLabel} title={leader.name}>{heroUiNameV36(leader).name} · Líder<span> · 1–5</span></span>}<span>{credits!==undefined?`${credits} créditos`:''}{level!==undefined?` · Nv ${level}`:''}{masterMode?' · Mestre':''}</span><small role="status">{saving||'Progresso neste navegador'}</small></div>}
 </footer>;
}
