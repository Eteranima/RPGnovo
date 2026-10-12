'use client';

import {useEffect,useRef,useState,type ReactNode} from 'react';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {ASSETS,type BaseHeroId} from '@/lib/game/data';
import {EVENT_ACTIVITIES_V38,EVENT_ACTIVITY_IDS_V38,SEALS_V38,SEAL_NAMES_V38,arenaCardV38,type EventActivityIdV38,type SealV38,type ArenaCardV38,type ArenaRoundResultV38,type ArenaStanceV38} from '@/lib/game/eventActivitiesV38';
import {variantByIdV36,variantCompanionV36} from '@/lib/game/variantsV36';
import {COMPANION_SIZES_V36} from '@/lib/game/variantArtV36';
import {SPRITE_FRAMES} from '@/lib/game/sprites';
import {CompanionPortrait} from './companion-portrait';
import {HeroPortrait} from './hero-card';
import styles from './event-activities-v38.module.css';

export type EventActivityViewV38=ReturnType<GameEngine['eventActivitiesV38']>;
type ActivityProps={view:EventActivityViewV38;engine:GameEngine;disabled:boolean};
const SEAL_HEROES:Record<SealV38,{hero:BaseHeroId;artId:string}>={ink:{hero:'seiji',artId:'seiji-last-script'},ice:{hero:'ophelia',artId:'ophelia-white-equinox'},dark:{hero:'marin',artId:'marin-starless-throne'},fire:{hero:'gabriel',artId:'gabriel-solar-oath'},lightning:{hero:'max',artId:'max-thunder-requiem'}};
const POSITIONS=['Frente','Centro','Retaguarda'] as const;
const STANCES:Record<ArenaStanceV38,{name:string;description:string}>={balanced:{name:'Equilíbrio',description:'Ataque e defesa sem modificadores.'},assault:{name:'Investida',description:'+2 de ataque; cada golpe recebido causa +1 de dano.'},guard:{name:'Guarda',description:'−2 de dano recebido; −1 de ataque.'}};
const QUALITY={perfect:'Perfeito',good:'Bom',miss:'Fora do sinal',step:'Recebido'};
export function eventSealArtV38(seal:SealV38){const art=SEAL_HEROES[seal];return {...art,src:ASSETS[`skill_icon_${art.artId}_4`],name:SEAL_NAMES_V38[seal]};}
function SealArt({seal}:{seal:SealV38}){const art=eventSealArtV38(seal);return <img className={styles.sealArt} src={art.src} alt="" draggable={false} decoding="async"/>;}
function EventCompanion({seal,size=32}:{seal:SealV38;size?:number}){
 const {hero,artId}=SEAL_HEROES[seal],art=variantCompanionV36(artId);
 return <CompanionPortrait heroId={hero} size={size} decorative art={art?{src:ASSETS[art.key]||art.path,name:art.name,crop:SPRITE_FRAMES[art.key]?.[0],sheetSize:COMPANION_SIZES_V36[art.variantId]}:undefined}/>;
}
function useReducedActivityMotionV38(){
 const [reduced,setReduced]=useState(true);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)'),update=()=>setReduced(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 return reduced;
}
function ActivityReward({kind,view,engine,disabled}:ActivityProps&{kind:EventActivityIdV38}){
 if(view.progress.claimed[kind])return <p className={styles.rewardReceived}>Recompensa recebida · os próximos ensaios são livres.</p>;
 if(!view.progress.completed[kind])return null;
 return <button className={styles.primary} disabled={disabled} aria-label={`Receber ${view.rewards[kind]} cristais de ${EVENT_ACTIVITIES_V38[kind].name}`} onClick={()=>engine.claimEventActivityV38(kind)}>Receber {view.rewards[kind]} cristais</button>;
}

export function SealPuzzlePanelV38({view,engine,disabled}:ActivityProps){
 const run=view.puzzle,[chosen,setChosen]=useState<SealV38|null>(null);
 if(!run)return null;
 const won=run.status==='won';
 return <section className={styles.activity} aria-label={EVENT_ACTIVITIES_V38.puzzle.name} data-event-puzzle>
  <div className={styles.companionRow}>{SEALS_V38.map(seal=><span key={seal}><EventCompanion seal={seal}/><small>{SEAL_NAMES_V38[seal]}</small></span>)}</div>
  <p className={styles.hint}>Escolha um selo e depois seu lugar. Um selo já colocado troca de lugar; você pode testar as pistas sem perder recursos.</p>
  <ul className={styles.clues}>{run.clues.map((clue,index)=><li key={index}>{clue.text}</li>)}</ul>
  <div className={styles.sealBank} role="group" aria-label="Escolher selo">{SEALS_V38.map(seal=><button key={seal} disabled={disabled||won} aria-pressed={chosen===seal} aria-label={'Escolher '+SEAL_NAMES_V38[seal]} onClick={()=>setChosen(seal)}><SealArt seal={seal}/><span>{SEAL_NAMES_V38[seal]}</span></button>)}</div>
  <p className={styles.selection} role="status">{won?'Os cinco selos estão em harmonia.':chosen?'Selecionado: '+SEAL_NAMES_V38[chosen]+'. Escolha um lugar abaixo.':'Selecione um dos cinco selos acima.'}</p>
  <div className={styles.sealBoard} role="group" aria-label="Cinco lugares, da esquerda para a direita">{run.board.map((seal,slot)=><button key={slot} disabled={disabled||won||!chosen} aria-label={`Lugar ${slot+1}${seal?': '+SEAL_NAMES_V38[seal]:': vazio'}${chosen?' · colocar '+SEAL_NAMES_V38[chosen]:''}`} onClick={()=>{if(chosen)engine.puzzlePlaceSealV38(chosen,slot);}}><b>{slot+1}</b>{seal?<SealArt seal={seal}/>:<span className={styles.emptySlot}>Lugar livre</span>}</button>)}</div>
  <div className={styles.feedback} role="status" aria-live="polite">{run.feedback.map((text,index)=><p key={index}>{text}</p>)}</div>
  <div className={styles.actions}>{!won&&<><button className={styles.primary} disabled={disabled} onClick={()=>engine.submitSealPuzzleV38()}>Verificar os selos</button><button disabled={disabled} onClick={()=>{engine.resetSealPuzzleV38();setChosen(null);}}>Limpar os lugares</button></>}<button disabled={disabled} onClick={()=>{engine.retryEventActivityV38('puzzle');setChosen(null);}}>{won?'Novo enigma · treino livre':'Novas pistas'}</button><ActivityReward kind="puzzle" view={view} engine={engine} disabled={disabled}/></div>
 </section>;
}

export function EventRhythmPanelV38({view,engine,disabled}:ActivityProps){
 const reduced=useReducedActivityMotionV38(),[elapsed,setElapsed]=useState(view.rhythm?.elapsedMs||0),response=useRef<HTMLButtonElement>(null),run=view.rhythm,token=view.session?.token;
 useEffect(()=>{
  if(!run?.running||run.mode!=='timed')return;
  let alive=true,frame=0;
  const tick=()=>{if(!alive)return;const current=engine.eventActivitiesV38();if(current.session?.kind!=='rhythm'||current.session.token!==token||!current.rhythm?.running)return;engine.tickEventRhythmV38(token);setElapsed(current.rhythm.elapsedMs);frame=requestAnimationFrame(tick);};
  const visibility=()=>{if(document.hidden&&engine.eventActivitiesV38().session?.token===token)engine.cancelEventActivityV38();};
  frame=requestAnimationFrame(tick);document.addEventListener('visibilitychange',visibility);
  return()=>{alive=false;cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',visibility);};
 },[engine,run?.running,run?.attempt,run?.mode,token]);
 useEffect(()=>{if(run?.running)response.current?.focus({preventScroll:true});},[run?.running,run?.attempt]);
 if(!run)return null;
 const playing=run.status==='playing',cue=run.cues[run.cueIndex],now=playing&&run.mode==='timed'&&cue&&Math.abs(elapsed-cue.at)<=run.windowMs;
 const start=(accessible:boolean)=>{setElapsed(0);engine.startEventRhythmV38(accessible,token);};
 return <section className={styles.activity} aria-label={EVENT_ACTIVITIES_V38.rhythm.name} data-event-rhythm data-reduced-motion={reduced}>
  <p className={styles.hint}>Responda a cinco sinais; quatro acertos completam a prova. Por etapas tem o mesmo prêmio e não exige rapidez nem som.</p>
  {!playing&&<div className={styles.actions}><button className={styles.primary} disabled={disabled} onClick={()=>start(true)}>Jogar por etapas · sem tempo</button><button disabled={disabled} onClick={()=>start(false)}>Jogar no compasso · sinais visuais</button></div>}
  <ol className={styles.cues} aria-label="Os cinco sinais">{run.cues.map((item,index)=>{const hit=run.hits.find(hit=>hit.cue===index);return <li key={item.seal} data-current={playing&&index===run.cueIndex||undefined} data-quality={hit?.quality}><SealArt seal={item.seal}/><strong>{item.label}</strong><small>{hit?QUALITY[hit.quality]:playing&&index===run.cueIndex?'Sua vez':'A seguir'}</small></li>;})}</ol>
  {playing&&cue&&<div className={styles.rhythmStage} data-signal={now||undefined}><EventCompanion seal={cue.seal} size={48}/><p aria-live="off">{run.mode==='accessible'?'Sem limite de tempo':now?'AGORA':'Aguarde o sinal'}<strong>{cue.label}</strong></p><button ref={response} className={styles.primary} disabled={disabled} aria-label={`Responder ao sinal ${run.cueIndex+1}: ${cue.label}`} onKeyDown={event=>{if(event.repeat&&['Enter',' '].includes(event.key))event.preventDefault();}} onClick={()=>engine.hitEventRhythmV38(run.cueIndex,token)}>Responder ao sinal</button>{run.mode==='timed'&&<span className={styles.rhythmProgress} role="progressbar" aria-label="Andamento do compasso" aria-valuemin={0} aria-valuemax={run.cues.at(-1)!.at+run.windowMs} aria-valuenow={Math.min(elapsed,run.cues.at(-1)!.at+run.windowMs)}><i style={{width:Math.min(100,elapsed/(run.cues.at(-1)!.at+run.windowMs)*100)+'%'}}/></span>}</div>}
  <p className={styles.feedback} role="status" aria-live="polite">{run.feedback}</p>
  {run.status==='won'&&<strong className={styles.success}>Compasso concluído</strong>}{run.status==='lost'&&<p>Você pode tentar novamente ou escolher Por etapas. Nenhum recurso foi gasto.</p>}{run.status==='interrupted'&&<p>O ensaio foi interrompido. Inicie um novo compasso quando estiver pronto.</p>}
  <ActivityReward kind="rhythm" view={view} engine={engine} disabled={disabled}/>
 </section>;
}

/** Replay is a view of the recorded resolution, never a second combat simulation. */
export function arenaReplaySnapshotV38(result:ArenaRoundResultV38,cursor:number){
 const hp=Object.fromEntries([...result.allies,...result.enemies].map(unit=>[unit.id,unit.maxHp]));
 for(const event of result.events.slice(0,Math.max(0,Math.min(cursor,result.events.length))))if(event.target in hp)hp[event.target]=event.remainingHp;
 return hp;
}
export function ArenaResolutionV38({result,encounter}:{result:ArenaRoundResultV38;encounter:NonNullable<EventActivityViewV38['arena']>['encounter']}){
 const reduced=useReducedActivityMotionV38(),[cursor,setCursor]=useState(0),[playing,setPlaying]=useState(false),replayStarted=useRef(false);
 useEffect(()=>{if(replayStarted.current||reduced)return;replayStarted.current=true;setCursor(0);setPlaying(true);},[reduced]);
 useEffect(()=>{if(!playing||reduced||cursor>=result.events.length)return;const timer=setTimeout(()=>setCursor(value=>Math.min(result.events.length,value+1)),Math.max(60,Math.min(160,5000/Math.max(1,result.events.length))));return()=>clearTimeout(timer);},[playing,reduced,cursor,result]);
 const hp=arenaReplaySnapshotV38(result,cursor),event=result.events[cursor-1],finished=cursor===result.events.length,moving=playing&&!reduced&&!finished;
 const survivors=result.enemies.filter(unit=>unit.hp>0).length;
 const units=(side:'ally'|'enemy')=>(side==='ally'?result.allies:result.enemies).map(unit=>{
  const card=side==='ally'?arenaCardV38(unit.id):encounter.enemies.find(enemy=>enemy.id===unit.id),acting=event?.actor===unit.id,targeted=event?.target===unit.id;
  return <div key={unit.id} className={styles.replayUnit} data-replay-unit={unit.id} data-side={side} data-seal={card?.element} data-acting={acting||undefined} data-targeted={targeted||undefined} data-event-kind={targeted?event.kind:undefined} data-fallen={hp[unit.id]===0||undefined}>
   <span key={acting||targeted?cursor:'idle'} className={styles.replayPortrait}><img src={card?ASSETS['face_'+card.artId]:undefined} alt="" draggable={false}/></span>
   <span className={styles.replayVitals}><strong>{card?.name}</strong><small>{hp[unit.id]} / {unit.maxHp} HP</small><span className={styles.replayHp} role="progressbar" aria-label={'HP de '+card?.name} aria-valuemin={0} aria-valuemax={unit.maxHp} aria-valuenow={hp[unit.id]}><i style={{width:100*hp[unit.id]/unit.maxHp+'%'}}/></span></span>
  </div>;
 });
 return <section className={styles.resolution} aria-label={'Resolução da prova '+result.round} data-reduced-motion={reduced} data-playing={moving}>
  <div className={styles.replayStage} data-native-event-salon><div className={styles.replaySides}><div>{units('ally')}</div><span className={styles.versus}>×</span><div>{units('enemy')}</div></div><p className={styles.replayEvent} aria-live={moving?'off':'polite'}>{event?.text||'As cartas tomam seus lugares.'}</p></div>
  <div className={styles.actions}>{!reduced&&!finished&&<button onClick={()=>setPlaying(!playing)}>{playing?'Pausar resolução':'Continuar resolução'}</button>}{(!playing||reduced)&&!finished&&<button onClick={()=>setCursor(value=>Math.min(value+1,result.events.length))}>Próximo movimento</button>}{!finished&&<button onClick={()=>{setPlaying(false);setCursor(result.events.length);}}>Ver resultado</button>}{finished&&<button onClick={()=>{setCursor(0);setPlaying(!reduced);}}>Rever resolução</button>}<small>{cursor} / {result.events.length} movimentos</small></div>
  <p className={finished&&!result.victory?styles.defeat:styles.success} role="status" aria-live={moving?'off':'polite'}>{finished?(result.victory?'Prova vencida':'A prova não foi vencida')+' · '+result.cycles+' ciclos':'Resolução em andamento · '+cursor+' de '+result.events.length+' movimentos'}</p>
  {finished&&!result.victory&&<p className={styles.replaySummary}>{result.allies.every(unit=>unit.hp===0)?'Sua formação caiu':'A prova terminou'} em {result.cycles} ciclos; {survivors} {survivors===1?'eco adversário continuou':'ecos adversários continuaram'} de pé. A dica de preparação acima explica o plano desta prova.</p>}
  <details><summary>Registro completo dos movimentos</summary><ol className={styles.log}>{result.events.map((item,index)=><li key={index}>{item.text}</li>)}</ol></details>
 </section>;
}
function ArenaCard({card,children}:{card:ArenaCardV38;children?:ReactNode}){
 return <article className={styles.arenaCard} data-arena-card={card.id} data-seal={card.element}><div className={styles.cardIdentity}><HeroPortrait h={{id:card.hero,variantId:variantByIdV36(card.artId)?.id}}/><div><h5>{card.name}</h5><small>{card.role} · {card.companion}</small><span className={styles.cardSeal}><SealArt seal={card.element}/>{SEAL_NAMES_V38[card.element]}</span></div></div><div className={styles.cardStats}><span>{card.hp} HP</span><span>{card.attack} ataque</span><span>{card.speed} velocidade</span></div><p>{card.description}</p>{children}</article>;
}
export function EventArenaPanelV38({view,engine,disabled}:ActivityProps){
 const run=view.arena,[tradeSlot,setTradeSlot]=useState(0);
 if(!run)return null;
 return <section className={styles.activity} aria-label={EVENT_ACTIVITIES_V38.arena.name} data-event-arena>
  <p className={styles.hint}>Escolha três cartas emprestadas, ajuste a ordem e leia o plano adversário. Após iniciar, as cartas jogam sozinhas e você acompanha os movimentos. Cada prova começa com HP completo. Duas cartas do mesmo selo ativam uma sinergia.</p>
  <div className={styles.arenaProgress}><strong>{run.phase==='draft'?`Escolha ${run.draft.length+1} de 3`:`Prova ${run.round} de 3`}</strong><span>{run.tradesLeft} trocas gratuitas restantes</span></div>
  {run.phase==='draft'?<><p>Escolha uma das três ofertas. Não custa cristais e não exige possuir o personagem.</p><div className={styles.arenaCards}>{run.offers.map(card=><ArenaCard key={card.id} card={card}><button className={styles.primary} disabled={disabled} aria-label={'Escolher '+card.name} onClick={()=>engine.draftArenaCardV38(card.id)}>Escolher carta</button></ArenaCard>)}</div></>:<>
   <div className={styles.enemyPlan}><h5>{run.encounter.name}</h5><p>{run.encounter.plan}</p><ul>{run.encounter.enemies.map(enemy=><li key={enemy.id}><img src={ASSETS['face_'+enemy.artId]} alt=""/><span><strong>{enemy.name}</strong><small>{enemy.hp} HP · {enemy.speed} velocidade · {enemy.description}</small></span></li>)}</ul><details><summary>Dica de preparação</summary><p>{run.encounter.counter}</p></details></div>
   {run.phase==='prepare'&&<><div className={styles.arenaCards}>{run.lineup.map((id,slot)=>{const card=id&&arenaCardV38(id);return card?<ArenaCard key={card.id} card={card}><label>Posição de {card.name}<select value={slot} disabled={disabled} onChange={event=>engine.positionArenaCardV38(card.id,Number(event.target.value))}>{POSITIONS.map((name,index)=><option value={index} key={name}>{name}</option>)}</select></label></ArenaCard>:null;})}</div><div className={styles.synergies}><strong>Sinergias ativas</strong>{run.synergies.length?<ul>{run.synergies.map(text=><li key={text}>{text}</li>)}</ul>:<p>Nenhuma dupla elemental. As habilidades individuais continuam ativas.</p>}</div>
    <fieldset className={styles.stances}><legend>Postura da prova</legend>{(Object.keys(STANCES) as ArenaStanceV38[]).map(stance=><button key={stance} aria-pressed={run.stance===stance} disabled={disabled} onClick={()=>engine.setArenaStanceV38(stance)}>{STANCES[stance].name}</button>)}<p>{STANCES[run.stance].description}</p></fieldset>
    {run.tradesLeft>0&&<details className={styles.market}><summary>Trocar uma carta · {run.tradesLeft} restantes</summary><label>Carta que sai<select value={tradeSlot} disabled={disabled} onChange={event=>setTradeSlot(Number(event.target.value))}>{run.lineup.map((id,slot)=><option key={slot} value={slot}>{POSITIONS[slot]} · {id&&arenaCardV38(id)?.name}</option>)}</select></label><div className={styles.arenaCards}>{run.market.map(card=><ArenaCard key={card.id} card={card}><button disabled={disabled} aria-label={'Trocar '+POSITIONS[tradeSlot]+' por '+card.name} onClick={()=>engine.tradeArenaCardV38(tradeSlot,card.id)}>Trocar · usa 1 troca</button></ArenaCard>)}</div></details>}
    <button className={styles.primary} disabled={disabled||run.lineup.some(id=>!id)} onClick={()=>engine.resolveEventArenaRoundV38()}>Iniciar prova {run.round}</button></>}
   {run.lastBattle&&run.phase!=='prepare'&&<ArenaResolutionV38 key={run.attempt+'-'+run.lastBattle.round} result={run.lastBattle} encounter={run.encounter}/>}
   {run.phase==='review'&&<button className={styles.primary} disabled={disabled} onClick={()=>engine.continueEventArenaV38()}>Preparar prova {run.round+1}</button>}
   {run.phase==='won'&&<p className={styles.success}>As três provas foram vencidas. A mesa registra sua preparação.</p>}{run.phase==='lost'&&<p className={styles.feedback}>Você pode ensaiar outra formação. Nenhum integrante do Grupo ou recurso foi consumido.</p>}
   {(run.phase==='won'||run.phase==='lost')&&<div className={styles.actions}><button disabled={disabled} onClick={()=>engine.retryEventActivityV38('arena')}>Nova mesa · treino livre</button><ActivityReward kind="arena" view={view} engine={engine} disabled={disabled}/></div>}
  </>}
 </section>;
}

export function EventActivitiesV38({s,engine}:{s:Snapshot;engine:GameEngine}){
 const view=engine.eventActivitiesV38(),[notice,setNotice]=useState(''),host=useRef<HTMLElement>(null),lastSession=useRef<string|null>(null),disabled=s.mode!=='world'||s.gachaBusy||s.summonBusy||!!s.saveConflictV36;
 const kind=view.session?.kind,token=view.session?.token,completeCount=EVENT_ACTIVITY_IDS_V38.filter(id=>!!view.progress.completed[id]).length;
 useEffect(()=>()=>{if(engine.eventActivitiesV38().session)engine.cancelEventActivityV38();},[engine]);
 useEffect(()=>{if((s.mode!=='world'||s.saveConflictV36)&&view.session)engine.cancelEventActivityV38();},[engine,s.mode,s.saveConflictV36,view.session?.token]);
 useEffect(()=>{const current=kind||null;if(current!==lastSession.current){const selector=current?'[data-activity-heading]':lastSession.current?`[data-activity-start="${lastSession.current}"]`:null;if(selector)host.current?.querySelector<HTMLElement>(selector)?.focus({preventScroll:true});lastSession.current=current;}},[kind,token]);
 const cancel=()=>{engine.cancelEventActivityV38();setNotice('Você voltou ao salão. As recompensas e as provas já concluídas continuam registradas.');};
 return <section ref={host} className={styles.panel} aria-labelledby="event-activities-title" data-event-activities>
  <header className={styles.heading} data-native-event-salon><div><span>JOGOS DO BAILE</span><h3 id="event-activities-title">Os cinco selos também sabem brincar</h3></div><small>{completeCount} / 3 atividades</small></header>
  <p className={styles.intro}>Enigmas, compasso e cartas: use o elenco emprestado do evento. Cada atividade oferece {view.rewards.puzzle} cristais; completar as três libera mais {view.rewards.board}.</p>
  {!view.unlocked?<p className={styles.locked} role="status">{view.lockedReason}</p>:kind?<>
   <div className={styles.activityHeading}><div><h4 tabIndex={-1} data-activity-heading>{EVENT_ACTIVITIES_V38[kind].name}</h4><small>{EVENT_ACTIVITIES_V38[kind].host}</small></div><button onClick={cancel}>Voltar às atividades</button></div>
   {kind==='puzzle'?<SealPuzzlePanelV38 key={view.puzzle?.attempt} view={view} engine={engine} disabled={disabled}/>:kind==='rhythm'?<EventRhythmPanelV38 key={view.rhythm?.attempt} view={view} engine={engine} disabled={disabled}/>:<EventArenaPanelV38 key={view.arena?.attempt} view={view} engine={engine} disabled={disabled}/>}
  </>:<><div className={styles.overview}>{EVENT_ACTIVITY_IDS_V38.map(id=><article key={id}><div className={styles.overviewIdentity}><EventCompanion seal={id==='puzzle'?'ink':id==='rhythm'?'lightning':'fire'}/><div><h4>{EVENT_ACTIVITIES_V38[id].name}</h4><small>{EVENT_ACTIVITIES_V38[id].host}</small></div></div><p>{EVENT_ACTIVITIES_V38[id].description}</p><span className={styles.activityStatus}>{view.progress.claimed[id]?'Recompensa recebida':view.progress.completed[id]?'Concluída · recompensa disponível':view.progress.attempts[id]?'Ensaio iniciado':'Uma nova brincadeira'}</span><div className={styles.actions}><button className={styles.primary} disabled={disabled} data-activity-start={id} onClick={()=>{setNotice('');engine.beginEventActivityV38(id);}}>{view.progress.completed[id]?'Ensaiar novamente':view.progress.attempts[id]?'Continuar':'Participar'}</button><ActivityReward kind={id} view={view} engine={engine} disabled={disabled}/></div></article>)}</div>
   <div className={styles.boardReward}><p><strong>{view.rewards.board} cristais · bônus do salão</strong><small>{view.progress.boardClaimed?'Bônus já recebido.':completeCount===3?'As três atividades estão concluídas.':'Complete as três atividades; não é preciso gastar ou convocar.'}</small></p><button disabled={disabled||completeCount!==3||view.progress.boardClaimed} onClick={()=>engine.claimEventActivityV38('board')}>{view.progress.boardClaimed?'Recebido':'Receber bônus'}</button></div>
  </>}
  <p className={styles.feedback} role="status" aria-live="polite">{notice}</p>
 </section>;
}
