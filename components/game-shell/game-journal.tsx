'use client';
import {MapPin} from 'lucide-react';
import {MAPS,OBJECTIVES} from '@/lib/game/data';
import type {Snapshot,GameEngine} from '@/lib/game/engine';
import {Progress} from '../ui/progress';
import {MiniMap} from '../minimap';
export function GameJournal({s,engine,onGo}:{s:Snapshot;engine:GameEngine;onGo?:(id:string)=>void}){const objective=OBJECTIVES[s.stage];return <>
 <div className="eyebrow"><span className="gold">◆</span> MISSÃO ATUAL</div><h2>{objective.title}</h2><p>{objective.text}</p><div className="destination"><MapPin size={14}/>{objective.location}</div>
 <div className="chapter-progress"><span>O que o selo lembra</span><b>{Math.min(s.stage,5)}/5</b></div><Progress className="quest-bar" value={s.stage/5*100}/>
 <div className="map-title"><span>ARREDORES</span><span>{MAPS[s.map].safe?'Área segura':'Área hostil'}</span></div><MiniMap s={s} engine={engine}/><div className="map-legend"><span>● Você</span><span className="gold">◆ Objetivo</span><span className="cyan">● Cristal</span></div>
 <div className="nearby-list"><span className="eyebrow">PONTOS DE INTERESSE</span>{engine.activeEntities().filter(e=>e.kind!=='mob'&&!(e.id==='selo'&&s.stage>=4)&&!(e.id==='eco'&&s.progress.kills.eco>0)).map(e=><button key={e.id} onClick={()=>onGo?onGo(e.id):engine.approach(e.id)} disabled={s.mode!=='world'}><span className={OBJECTIVES[s.stage].target===e.id?'gold':''}>{e.kind==='save'?'◇':e.kind==='warp'?'↳':'◆'}</span>{e.label}</button>)}</div>
 </>;}
