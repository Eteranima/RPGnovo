'use client';
import {useEffect,useRef,useState} from 'react';
import {heroArtIdV36,variantByIdV36} from '@/lib/game/variantsV36';
import {ASSETS,combatElement,type HeroId} from '@/lib/game/data';
import {drawUltimateSceneV36} from './ultimate-scene-v36';
import styles from './character-showcase.module.css';

/** Preview the same native choreography as battle without changing resources or saves. */
export function CharacterShowcase({id,name}:{id:string;name:string}){
 const ref=useRef<HTMLCanvasElement>(null),[paused,setPaused]=useState(false),[ready,setReady]=useState(false),[failed,setFailed]=useState(false),[retry,setRetry]=useState(0),[reducedMotion,setReducedMotion]=useState(false);
 const pauseRef=useRef(paused);pauseRef.current=paused;
 useEffect(()=>{
  if(retry===0)ref.current?.scrollIntoView({block:'nearest'});
  const artId=heroArtIdV36(id),key=`battle_${artId}_ultimate`,variant=variantByIdV36(artId),family=variant?.hero||id as HeroId;
  const keys=[key,`battle_fx_${artId}`,`battle_${artId}_cinematic_background`].filter(k=>ASSETS[k]);
  let stopped=false,raf=0,last=0;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  setReady(false);setFailed(false);setReducedMotion(reduced);if(reduced){pauseRef.current=true;setPaused(true);}
  void Promise.all(keys.map(k=>new Promise<[string,HTMLImageElement|null]>(resolve=>{
   const image=new Image();let settled=false;const finish=(value:HTMLImageElement|null)=>{if(settled)return;settled=true;clearTimeout(timeout);image.onload=null;image.onerror=null;resolve([k,value]);};
   const timeout=setTimeout(()=>finish(null),45000);image.onload=()=>finish(image);image.onerror=()=>finish(null);image.src=ASSETS[k];
  }))).then(entries=>{
   if(stopped)return;if(!keys.includes(key)||entries.some(([,image])=>!image)){setFailed(true);return;}
   const art=Object.fromEntries(entries) as Record<string,HTMLImageElement>;setReady(true);
   const duration=4800,impactAt=Math.round(duration*.68);let elapsed=reduced?impactAt:0,previous=performance.now();
   const draw=()=>{
    if(stopped)return;const now=performance.now();raf=requestAnimationFrame(draw);if(now-last<1000/24)return;last=now;
    const canvas=ref.current!,ctx=canvas.getContext('2d')!,rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,2);if(!w||!h)return;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);if(!pauseRef.current)elapsed+=now-previous;previous=now;
    drawUltimateSceneV36(ctx,{art,id:artId,key,family,enemy:false,recruitDuel:false,width:w,height:h,age:Math.min(duration,elapsed%5600),duration,impactAt,speed:1,reduced,element:variant?.element||combatElement(family,'ultimate'),canvas});
    canvas.dataset.previewFrame=canvas.dataset.ultimateFrame;canvas.dataset.previewCharacter=id;
   };draw();
  });
  return()=>{stopped=true;cancelAnimationFrame(raf);};
 },[id,retry]);
 return <div className={styles.preview}><canvas ref={ref} role="img" aria-label={`Animação da ultimate de ${name}`}/>{!ready&&<p className={styles.status} role="status">{failed?'A animação não carregou.':'Carregando animação…'}{failed&&<button onClick={()=>setRetry(value=>value+1)}>Tentar novamente</button>}</p>}{reducedMotion?ready&&<p className={styles.status}>Prévia estática · movimento reduzido</p>:<button className={styles.pause} disabled={!ready} onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?'Reproduzir':'Pausar'}</button>}</div>;
}
