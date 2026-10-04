'use client';
import {useEffect,useRef,useState} from 'react';
import {HeroPortrait} from './hero-card';
import type {Hero} from '@/lib/game/data';
import type {Battle} from '@/lib/game/engine';
import {COMBAT_V30_ASSETS,COMBAT_V30_FRAMES} from '@/lib/art/combatV30';
import styles from './victory-celebration.module.css';

export type VictoryCelebrationProps={battle:Battle;heroes:Hero[];lycan?:boolean;onContinue:()=>void};
function useReducedMotion(){
 const [reduced,setReduced]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduced(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
 return reduced;
}
function CelebrationArt({reduced}:{reduced:boolean}){
 const ref=useRef<HTMLCanvasElement>(null),[ready,setReady]=useState(false);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas?.getContext('2d');if(!canvas||!ctx)return;
  const sprite=new Image();let raf=0,disposed=false;
  const frames=COMBAT_V30_FRAMES.victory_celebration;
  const draw=(index:number)=>{const f=frames[index],scale=canvas.width/444;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(sprite,f.x,f.y,f.w,f.h,canvas.width/2-(f.anchorX-f.x)*scale,canvas.height/2-(f.anchorY-f.y)*scale,f.w*scale,f.h*scale);canvas.dataset.frame=String(index);};
  sprite.onload=()=>{if(disposed)return;setReady(true);if(reduced){draw(frames.length-1);return;}const start=performance.now();const tick=(now:number)=>{const index=Math.min(frames.length-1,Math.floor((now-start)/125));draw(index);if(index<frames.length-1)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);};
  sprite.src=COMBAT_V30_ASSETS.victory_celebration;
  return()=>{disposed=true;cancelAnimationFrame(raf);sprite.onload=null;};
 },[reduced]);
 return <span className={styles.art} aria-hidden="true">{!ready&&<img src={COMBAT_V30_ASSETS.victory_emblem} alt=""/>}<canvas ref={ref} width={320} height={320}/></span>;
}
export function VictoryCelebration({battle,heroes,lycan=false,onContinue}:VictoryCelebrationProps){
 const reduced=useReducedMotion(),continued=useRef(false),[leaving,setLeaving]=useState(false);
 const victory=battle.result==='victory';
 const continueOnce=()=>{if(continued.current)return;continued.current=true;setLeaving(true);onContinue();};
 return <section className={styles.overlay} data-victory-celebration data-reduced-motion={reduced||undefined} role="region" aria-label={victory?'Vitória e recompensas':'Resultado do combate'}>
  <div className={styles.panel} data-defeat={!victory||undefined}>
   {victory&&<CelebrationArt reduced={reduced}/>}
   <div className={styles.content}><span className={styles.eyebrow}>{victory?'CONFRONTO CONCLUÍDO':'A EXPEDIÇÃO CONTINUA'}</span><h2>{victory?'Vitória':'O caminho de volta'}</h2>
    <p className={styles.message}>{victory?battle.eventId?.startsWith('recruit-')?'O desafiante aceita sua força e se junta à expedição.':'O Éter se acalma. Seu grupo venceu.':'O grupo retorna ao último cristal sem perder a missão.'}</p>
    {victory&&<div className={styles.rewards} aria-label={'Recompensas: '+battle.credits+' créditos e '+battle.xp+' XP'}><span><strong>+{battle.credits}</strong><small>Créditos</small></span><span><strong>+{battle.xp}</strong><small>Experiência</small></span></div>}
    <div className={styles.allies} aria-label="Integrantes do grupo">{heroes.map(h=><HeroPortrait key={h.id} h={h} lycan={lycan}/>)}</div>
    <button className={styles.continueButton} onClick={continueOnce} disabled={leaving} autoFocus><img src={COMBAT_V30_ASSETS.victory_continue} alt="" draggable={false}/><span>{leaving?'Continuando…':victory?'Continuar a aventura':'Retornar ao cristal'}</span></button>
   </div>
  </div>
 </section>;
}
