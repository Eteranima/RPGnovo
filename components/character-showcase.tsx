'use client';
import {useEffect,useRef,useState} from 'react';
import {ASSETS} from '@/lib/game/data';
import {SPRITE_FRAMES} from '@/lib/game/sprites';
import {characterPoseFrame} from '@/lib/game/characterAnimation';
import styles from './character-showcase.module.css';

/** The catalog can play a real ultimate atlas without touching battle, resources or saves. */
export function CharacterShowcase({id,name}:{id:string;name:string}){
 const ref=useRef<HTMLCanvasElement>(null),[paused,setPaused]=useState(false),pauseRef=useRef(paused);pauseRef.current=paused;
 useEffect(()=>{
  const key=`battle_${id}_ultimate`,frames=SPRITE_FRAMES[key],img=new Image(),fx=new Image(),effect=SPRITE_FRAMES[`battle_fx_${id}`]?.[5];let stopped=false,raf=0,last=0;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduced){pauseRef.current=true;setPaused(true);}
  img.onload=()=>{if(stopped||!frames?.length)return;let elapsed=0,previous=performance.now();
   const draw=()=>{if(stopped)return;const now=performance.now();raf=requestAnimationFrame(draw);if(now-last<1000/24)return;last=now;
    const canvas=ref.current!,ctx=canvas.getContext('2d')!,rect=canvas.getBoundingClientRect(),w=rect.width,h=rect.height,dpr=Math.min(devicePixelRatio||1,2);if(!w||!h)return;
    if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    if(!pauseRef.current)elapsed+=now-previous;previous=now;
    const t=elapsed%5600/4800,frame=characterPoseFrame(id,'ultimate',Math.min(1,t),frames.length),crop=frames[frame];
    const above=Math.max(...frames.map(f=>f.anchorY-f.y)),below=Math.max(0,...frames.map(f=>f.y+f.h-f.anchorY)),left=Math.max(...frames.map(f=>f.anchorX-f.x)),right=Math.max(...frames.map(f=>f.x+f.w-f.anchorX));
    const x=w*.39,scale=Math.min((h-18)/(above+below),(x-10)/left,(w-x-10)/right),y=h-8-below*scale;
    if(effect&&fx.complete&&fx.naturalWidth&&t>=.34){
     const bloom=Math.sin(Math.min(1,(t-.34)/.66)*Math.PI),s=Math.min(w*.54/effect.w,h*.65/effect.h)*(.8+bloom*.2),ew=effect.w*s,eh=effect.h*s;
     ctx.save();ctx.globalAlpha=.6+bloom*.3;ctx.drawImage(fx,effect.x,effect.y,effect.w,effect.h,w*.75-ew/2,h*.86-eh,ew,eh);ctx.restore();
    }
    ctx.drawImage(img,crop.x,crop.y,crop.w,crop.h,x-(crop.anchorX-crop.x)*scale,y-(crop.anchorY-crop.y)*scale,crop.w*scale,crop.h*scale);
    canvas.dataset.previewFrame=String(frame);canvas.dataset.previewCharacter=id;
   };draw();};
  if(effect)fx.src=ASSETS[`battle_fx_${id}`];img.src=ASSETS[key];return()=>{stopped=true;cancelAnimationFrame(raf);};
 },[id]);
 return <div className={styles.preview}><canvas ref={ref} role="img" aria-label={`Animação da ultimate de ${name}`}/><button className={styles.pause} onClick={()=>setPaused(value=>!value)} aria-pressed={paused}>{paused?'Reproduzir':'Pausar'}</button></div>;
}
