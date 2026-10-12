'use client';
import {useEffect,useRef,type CSSProperties} from 'react';
import {ASSETS,battleBackground,COMPANIONS,ENEMY_ULTIMATES,ULTIMATE_NAMES,combatElement,combatImpact,ELEMENT_COLORS,type HeroId,type Hero,type MapId} from '@/lib/game/data';
import type {Battle} from '@/lib/game/engine';
import type {Progression} from '@/lib/game/progression';
import {SPRITE_FRAMES} from '@/lib/game/sprites';
import polish from './battle-intent-v32.module.css';
import {preloadBattleArt} from './battle-scene';
import {heroArtIdV36,variantByIdV36,variantCompanionV36} from '@/lib/game/variantsV36';
import {NativeSpritePortrait} from './native-sprite-portrait';
import {applyNativeSpriteCrop,companionPoseV36} from '@/lib/art/nativeSpriteViewport';
import {enemyPoseFrame} from '@/lib/game/enemyArtV30';
import {drawUltimateSceneV36} from './ultimate-scene-v36';
import {COMPANION_SIZES_V36} from '@/lib/game/variantArtV36';

export function UltimateCinematic({battle,heroes,map,progress}:{battle:Battle;heroes:Hero[];map:MapId;progress:Progression}){
 const cv=useRef<HTMLCanvasElement>(null),companionView=useRef<SVGSVGElement>(null),live=useRef(battle);live.current=battle;
 const a=battle.animation,enabled=!!a&&['ultimate','boss-ultimate','enemy-ultimate'].includes(a.action),actor=a?.actor,hero=heroes.find(h=>h.id===actor),name=actor==='enemy'?battle.eventId?.startsWith('recruit-')?ULTIMATE_NAMES[battle.asset as HeroId]:ENEMY_ULTIMATES[battle.family]?.name:actor?(variantByIdV36(heroArtIdV36(hero||actor,progress))?.ultimate.name||ULTIMATE_NAMES[actor]):'';
 useEffect(()=>{if(!enabled||!a)return;let stop=false,raf=0,last=0;const canvas=cv.current!,ctx=canvas.getContext('2d')!,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 void preloadBattleArt(heroes.map(hero=>heroArtIdV36(hero,progress)),battle.eventId?.startsWith('recruit-')?battle.asset as HeroId:undefined,{family:battle.family,asset:battle.asset,boss:battle.boss,phase:battle.phase,map}).then(art=>{if(stop)return;const draw=()=>{if(stop)return;raf=requestAnimationFrame(draw);const now=Date.now();if(now-last<33)return;last=now;const r=canvas.getBoundingClientRect(),w=r.width,h=r.height,dpr=Math.min(devicePixelRatio||1,2);if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}ctx.setTransform(dpr,0,0,dpr,0,0);const age=now-a.started,speed=a.speed||1,t=Math.min(1,Math.max(0,age/a.duration)),beat=age<900/speed?'focus':age<1800/speed?'charge':age<a.impactAt?'release':'impact';canvas.dataset.cameraBeat=beat;canvas.dataset.ultimateActor=a.actor;
 const companionArt=actor&&actor!=='enemy'?variantCompanionV36(hero||actor,progress):null,companionFrames=companionArt?SPRITE_FRAMES[companionArt.eventKey]:undefined,companionFrame=companionPoseV36(age,a.duration,a.impactAt,reduced);if(companionView.current&&companionFrames?.[companionFrame]){applyNativeSpriteCrop(companionView.current,companionFrames[companionFrame]);companionView.current.dataset.companionFrame=String(companionFrame);}
 const heroKey=a.actor==='enemy'?a.actor:heroArtIdV36(heroes.find(hero=>hero.id===a.actor)||a.actor,progress);
 const duel=a.actor==='enemy'&&!!battle.eventId?.startsWith('recruit-'),visualHero=duel?battle.asset as HeroId:a.actor;
 const visualId=a.actor==='enemy'?visualHero:heroKey,key=a.actor==='enemy'?duel?`battle_${battle.asset}_ultimate`:`ultimate_${battle.family}`:`battle_${heroKey}_ultimate`;
 const element=a.element||(visualHero==='enemy'?ENEMY_ULTIMATES[battle.family]?.element||'dark':combatElement(visualHero,'ultimate'));
 drawUltimateSceneV36(ctx,{art,id:visualId,key,family:battle.family,enemy:a.actor==='enemy',recruitDuel:duel,width:w,height:h,age,duration:a.duration,impactAt:a.impactAt,speed,reduced,element,canvas});
 };draw();});return()=>{stop=true;cancelAnimationFrame(raf);};},[enabled,a?.started]);
 if(!enabled)return null;const companionArt=actor&&actor!=='enemy'?variantCompanionV36(hero||actor,progress):null,companion=actor&&actor!=='enemy'&&!['beatriz','orfeu','ava','carmilla','abel'].includes(actor)?COMPANIONS[actor]:null,element=a.element||(actor==='enemy'?battle.eventId?.startsWith('recruit-')?combatElement(battle.asset as HeroId,'ultimate'):ENEMY_ULTIMATES[battle.family]?.element||'dark':actor?combatElement(actor,'ultimate'):'neutral');return <div className="ultimate-cinematic" role="status" aria-label={`Cinemática: ${name}`} style={{'--element':ELEMENT_COLORS[element],backgroundImage:`url(${ASSETS[battleBackground(map)]})`} as CSSProperties}><canvas ref={cv}/>{a.enemyOutcomeV32&&<p className={polish.cinematicOutcome} aria-hidden="true">{a.enemyOutcomeV32.missed?<span>O inimigo errou</span>:a.enemyOutcomeV32.targets.map(hit=><span key={hit.id}>{heroes.find(h=>h.id===hit.id)?.name}: −{hit.damage}{hit.guarded?' · Guarda':''}</span>)}</p>}{companion&&<aside className={`ultimate-companion companion-${actor}`}><span aria-hidden="true" style={companionArt?{backgroundImage:"none"}:undefined}>{companionArt&&<NativeSpritePortrait ref={companionView} src={ASSETS[companionArt.eventKey]||companionArt.eventPath} crop={SPRITE_FRAMES[companionArt.eventKey]?.[2]} sheetSize={COMPANION_SIZES_V36[companionArt.variantId]} name={companionArt.name} decorative style={{width:48,height:48}}/>}</span><p><b>{companion.name}</b>{actor==='seiji'?'Vai, Seiji!':actor==='ophelia'?'O inverno está com você.':actor==='marin'?'A noite é sua.':actor==='gabriel'?'Sua chama conduz.':'Max, a descarga é nossa!'}</p></aside>}<div className={`cinematic-caption element-${actor}`} style={{'--element':ELEMENT_COLORS[element]} as CSSProperties}><small>{hero?.name||battle.name} · ULTIMATE</small><strong>{name}</strong></div></div>;
}
