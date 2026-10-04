'use client';
import {useEffect,useRef,useState,type CSSProperties,type ReactNode} from 'react';
import {GACHA_ART_V30,GACHA_FRAMES_V30} from '@/lib/art/gachaV30';
import {gachaSequencePhase,GACHA_COLORS,gachaTier} from '@/lib/game/gachaSequence';
import styles from './summoning-sanctum.module.css';

const cache=new Map<string,Promise<HTMLImageElement|null>>();
function loadArt(src:string){if(!cache.has(src))cache.set(src,new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{cache.delete(src);resolve(null);};img.src=src;}));return cache.get(src)!;}
const sequenceKey=(rank:number)=>rank===5?'gacha-tier5-cinematic':`gacha-tier${rank}` as keyof typeof GACHA_FRAMES_V30;
export function SummoningSanctum({busy,started,rank,heading,description,reveal,pulls,pity,kind='character'}:{busy:boolean;started:number;rank:number;heading:string;description:string;reveal:ReactNode;pulls:ReactNode;pity:string;kind?:'character'|'aura'}){
 const canvas=useRef<HTMLCanvasElement>(null),[ready,setReady]=useState(false),[beat,setBeat]=useState('awakening'),[revealed,setRevealed]=useState(false),[error,setError]=useState(false);
 const tier=gachaTier(rank);
 useEffect(()=>{let disposed=false;void Promise.all([1,2,3,4,5].map(value=>loadArt(GACHA_ART_V30[sequenceKey(value)]))).then(images=>{if(disposed)return;setReady(images.every(Boolean));setError(images.some(img=>!img));});return()=>{disposed=true;};},[]);
 useEffect(()=>{
  let disposed=false,raf=0,last=0;setRevealed(!busy);setBeat('awakening');
  const cv=canvas.current!,ctx=cv.getContext('2d')!,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,key=sequenceKey(busy?tier:3),frames=GACHA_FRAMES_V30[key];
  void loadArt(GACHA_ART_V30[key]).then(img=>{if(!img||disposed)return;const draw=(now:number)=>{if(disposed)return;raf=requestAnimationFrame(draw);if(now-last<50)return;last=now;const sequence=gachaSequencePhase(tier,Date.now()-started),index=busy?(reduced?frames.length-1:sequence.frame):0,f=frames[index];
   if(busy){setBeat(previous=>previous===sequence.beat?previous:sequence.beat);setRevealed(sequence.t>=.8);}
   const rect=cv.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;if(!w||!h)return;if(cv.width!==Math.round(w*dpr)||cv.height!==Math.round(h*dpr)){cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   const size=Math.min(w,h),x=(w-size)/2,y=(h-size)/2;ctx.drawImage(img,f.x,f.y,f.w,f.h,x,y,size,size);
   // Blend native adjacent drawings during transitions, with no repainting of the source.
   if(busy&&!reduced&&index<frames.length-1){const transition=(sequence.t*frames.length)%1;if(transition>.65){const next=frames[index+1];ctx.save();ctx.globalAlpha=(transition-.65)/.35;ctx.drawImage(img,next.x,next.y,next.w,next.h,x,y,size,size);ctx.restore();}}
   cv.dataset.frame=String(index);cv.dataset.rarity=String(tier);cv.dataset.beat=sequence.beat;
  };raf=requestAnimationFrame(draw);});return()=>{disposed=true;cancelAnimationFrame(raf);};
 },[busy,started,tier]);
 const phase={awakening:'O cristal desperta',opening:'O portal se abre',convergence:tier===5?'As constelações se encontram':'O Éter toma forma',reveal:'Sua convocação respondeu'}[beat]||'O portal se abre';
 return <section className={styles.sanctum} data-gacha-sanctum data-rarity={busy?tier:undefined} aria-busy={busy} style={{'--rarity-color':GACHA_COLORS[tier-1],backgroundImage:`url(${GACHA_ART_V30['gacha-sanctum']})`} as CSSProperties}>
  <div className={styles.scene}>
   <div className={styles.ritual}><canvas ref={canvas} aria-hidden="true"/><div className={styles.phase} role="status">{busy?<><small>{kind==='character'?`${tier}★`:(['Comum','Incomum','Raro','Épico','Lendário'][tier-1])}</small><strong>{phase}</strong></>:<><small>STONE REACH</small><strong>{heading}</strong></>}</div></div>
   <div className={styles.reveal} data-revealed={revealed||undefined}>{revealed?reveal:<><h3>{tier===5?'Um eco extraordinário':'Uma memória se aproxima'}</h3><p>{description}</p></>}</div>
  </div>
  <div className={styles.controls}><fieldset className={styles.pulls} disabled={!ready}>{pulls}</fieldset><p>{pity}</p>{!ready&&<small role="status">{error?'Não foi possível carregar a arte. Feche e abra o Arquivo para tentar novamente.':'Preparando o ritual…'}</small>}</div>
 </section>;
}
export function InvocationButton({children,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>){return <button {...props} className={styles.pullButton}><img src={GACHA_ART_V30['plaque-0']} alt=""/><span>{children}</span></button>;}
export function SummonResultCard({rank,children,...props}:React.ButtonHTMLAttributes<HTMLButtonElement>&{rank:number}){const tier=gachaTier(rank);return <button {...props} className={styles.resultCard} style={{'--rarity-color':GACHA_COLORS[tier-1],backgroundImage:`url(${GACHA_ART_V30[`plaque-${tier}` as keyof typeof GACHA_ART_V30]})`} as CSSProperties} data-rarity={tier}>{children}</button>;}
