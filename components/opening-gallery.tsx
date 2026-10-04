'use client';
import {useEffect,useState} from 'react';
import {GACHA_ART_V30} from '@/lib/art/gachaV30';
import styles from './opening-gallery.module.css';
const scenes=[
 {src:GACHA_ART_V30['opening-companions'],name:'Umbra, Mika, Shin, Vajra e Dante · Stone Reach'},
 {src:GACHA_ART_V30['opening-ink-garden'],name:'Umbra e Shin · Jardim da Tinta'},
 {src:GACHA_ART_V30['opening-star-watch'],name:'Mika, Vajra e Dante · Vigília das Estrelas'},
 {src:'/assets/world/title-stone-reach-v14.webp',name:'Stone Reach · A Academia'}
] as const;
export function OpeningGallery({loading=false}:{loading?:boolean}){
 const [selected,setSelected]=useState(0),[manual,setManual]=useState(false);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');let timer:number|undefined;const update=()=>{if(timer)clearInterval(timer);if(!media.matches&&!manual)timer=window.setInterval(()=>setSelected(n=>(n+1)%scenes.length),14000);};update();media.addEventListener('change',update);return()=>{if(timer)clearInterval(timer);media.removeEventListener('change',update);};},[manual]);
 return <div className={styles.gallery} data-opening-gallery data-scene={selected}>
  {scenes.map((scene,index)=><img key={scene.src} src={scene.src} alt="" className={styles.backdrop} data-active={index===selected||undefined} fetchPriority={index===0?'high':'low'}/>)}
  {!loading&&<div className={styles.choices} role="group" aria-label="Artes da abertura">{scenes.map((scene,index)=><button key={scene.src} aria-label={scene.name} aria-pressed={selected===index} title={scene.name} onClick={()=>{setSelected(index);setManual(true);}}><img src={scene.src} alt=""/></button>)}</div>}
 </div>;
}
