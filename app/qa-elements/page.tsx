'use client';
import {useEffect,useRef,useState} from 'react';
import {BattleScene} from '@/components/battle-scene';
import {UltimateCinematic} from '@/components/ultimate-cinematic';
import {ASSETS,PLAYABLE_HERO_IDS,SKILLS,ULTIMATE_NAMES,combatElement,heroBases,type HeroId} from '@/lib/game/data';
import {freshProgression} from '@/lib/game/progression';
import {SPRITE_FRAMES} from '@/lib/game/sprites';
import type {Battle} from '@/lib/game/engine';

export default function ElementQA(){
 const [hero,setHero]=useState<HeroId>('ophelia'),[action,setAction]=useState('attack'),[phase,setPhase]=useState(.66),[cinema,setCinema]=useState(false),[bind,setBind]=useState(false);
 const frozenTime=useRef(1000000);
 useEffect(()=>{const original=Date.now;Date.now=()=>frozenTime.current;return()=>{Date.now=original;};},[]);
 const progress=freshProgression();progress.party=[hero];progress.recruited=[...PLAYABLE_HERO_IDS];
 const party=heroBases().filter(base=>hero==='carmilla'?['carmilla','seiji','ophelia'].includes(base.id):base.id===hero);
 const duration=action==='ultimate'?4800:action==='attack'?1200:1600,impactAt=Math.round(duration*(action==='ultimate'?.68:.55)),heal=['mend','cleanse','garden-heal','margem','in-aeternum-vive'].includes(action)||action==='ultimate'&&['ophelia','carmilla'].includes(hero),target=heal?hero==='carmilla'?'party':hero:'enemy';
 const battle:Battle={entityId:'qa',name:'Lobo de Éter',family:'lobo',boss:false,asset:'wolf',hp:500,maxHp:500,spd:12,damage:16,xp:0,credits:0,round:1,queue:[hero,'enemy'],index:0,weakened:false,log:[],busy:true,phase:1,bossCharge:0,difficulty:1,dropChance:0,flash:0,baseDamage:16,freezeUsed:false,statuses:{enemy:bind?[{id:'bind',turns:1}]:[]},animation:{actor:hero,action,element:combatElement(hero,action),target,started:frozenTime.current-duration*phase,duration,impactAt,value:heal?38:32}};
 const cast=action!=='attack'||hero==='ophelia',key=`battle_${hero}_${action==='ultimate'?'ultimate':cast?'cast':'attack'}`,count=SPRITE_FRAMES[key]?.length||1;
 return <main id="qa-elements" style={{padding:24,maxWidth:1280,margin:'auto',color:'#eef0f4'}}>
  <h1>Auditoria visual local · elementos</h1>
  <p>Arte de combate real, sem gravação de progresso. {hero} · {action==='ultimate'?ULTIMATE_NAMES[hero]:action} · {combatElement(hero,action)} · {count} frames · {Math.round(duration*phase)} ms</p>
  <nav style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>{PLAYABLE_HERO_IDS.map(id=><button key={id} onClick={()=>{setHero(id);setAction('attack');setCinema(false);setBind(false);}} className={hero===id?'primary-button':'secondary-button'}>{id}</button>)}</nav>
  <nav style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>{['attack',...SKILLS[hero].map(skill=>skill.id),'ultimate'].map(id=><button key={id} className={action===id?'primary-button':'secondary-button'} onClick={()=>{setAction(id);setCinema(false);}}>{id}</button>)}</nav>
  <nav style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>{[.12,.35,.54,.66,.79,.93].map(value=><button key={value} className={phase===value?'primary-button':'secondary-button'} onClick={()=>setPhase(value)}>{Math.round(value*100)}%</button>)}<button className="secondary-button" onClick={()=>setBind(!bind)}>Prisão de Pedra {bind?'ativa':'inativa'}</button>{action==='ultimate'&&<button className="secondary-button" onClick={()=>setCinema(!cinema)}>Cinemática {cinema?'ativa':'inativa'}</button>}</nav>
  <section style={{position:'relative',height:420}}><BattleScene battle={battle} heroes={party} progress={progress} map="patio"/>{cinema&&<UltimateCinematic battle={battle} heroes={party} progress={progress} map="patio"/>}</section>
  <p>Asset do frame: {ASSETS[key]}</p>
  <style>{`#qa-elements .battle-stage{height:420px!important;min-height:420px!important}#qa-elements button{padding:8px 12px}#qa-elements .ultimate-cinematic{inset:0;height:420px}`}</style>
 </main>;
}
