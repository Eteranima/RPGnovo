import {ENEMY_ULTIMATES,SKILLS,ULTIMATE_NAMES,combatElement,heroBases,type Hero,type HeroId,type CombatElement} from './data';
import {setCount,type Progression,type StatusId} from './progression';
import {cosmeticRank} from './cosmetics';
import type {Battle} from './engine';

export type EnemyIntentTargetV32={id:HeroId;name:string;damageOnHit:number;damageRange:[number,number];status:StatusId|null;statusTurns:number;guarded:boolean;statusPrevented:boolean;guardSavedHp:number};
export type EnemyOutcomeV32={missed:boolean;targets:{id:HeroId;damage:number;hpLost:number;guarded:boolean;guardSavedHp:number;status:StatusId|null;blockedStatus:StatusId|null}[]};
export type EnemyIntentV32={
 phase:'preview'|'in-progress';timing:'acting'|'imminent'|'next-round';kind:'attack'|'skill'|'collapse'|'ultimate'|'blocked';
 round:number;action:string;name:string;element:CombatElement;targets:EnemyIntentTargetV32[];area:boolean;
 chargeBefore:number;chargeAfter:number;missChance:0|.5;blockedBy:'freeze'|'bind'|'silence'|null;controlAvailable:boolean;startsNextRound:boolean;
};
type Options={round?:number;guardCleared?:ReadonlySet<HeroId>;forceUltimate?:boolean;ignoreImmobilization?:boolean;bleedPending?:boolean;projectPhase?:boolean};
const has=(battle:Battle,status:StatusId)=>battle.statuses.enemy?.some(s=>s.id===status)===true;
export function enemyStatusImmuneV32(progress:Progression,hero:HeroId,status:StatusId){
 return (status==='bleed'&&setCount(progress,hero,'wolf')>=6)||(status==='blind'&&setCount(progress,hero,'veil')>=6)||(status==='silence'&&setCount(progress,hero,'ember')>=6)||((status==='freeze'||status==='bind')&&setCount(progress,hero,'lunar')>=6);
}
/** No random reads or mutations: one plan is also captured by the real enemy animation. */
export function resolveEnemyIntentV32(battle:Battle,heroes:readonly Hero[],progress:Progression,options:Options={}):EnemyIntentV32|null{
 const alive=heroes.filter(h=>h.hp>0);if(battle.result||battle.hp<=0||!alive.length)return null;
 const round=options.round??battle.round,startsNextRound=round!==battle.round;
 if(options.bleedPending&&has(battle,'bleed')&&battle.hp<=6)return null;
 const phase=battle.boss&&options.projectPhase!==false?Math.max(battle.phase,battle.hp<=battle.maxHp/3?3:battle.hp<=battle.maxHp*2/3?2:1):battle.phase;
 const chargeBefore=phase>battle.phase?Math.min(100,battle.bossCharge+25):battle.bossCharge;
 const damage=phase>battle.phase?battle.baseDamage+(phase-1)*4:battle.damage;
 const base={phase:'preview' as const,timing:startsNextRound?'next-round' as const:'imminent' as const,round,chargeBefore,controlAvailable:!battle.freezeUsed,startsNextRound};
 const immobilization=!options.ignoreImmobilization?(has(battle,'bind')?'bind':has(battle,'freeze')?'freeze':null):null;
 if(immobilization)return {...base,kind:'blocked',action:immobilization==='bind'?'bound':'frozen',name:immobilization==='bind'?'Prisão de Pedra · perde a ação':'Congelado · perde a ação',element:immobilization==='bind'?'earth':'ice',targets:[],area:false,chargeAfter:chargeBefore,missChance:0,blockedBy:immobilization};
 const duel=!!battle.eventId?.startsWith('recruit-')&&battle.asset in SKILLS,duelHero=battle.asset as HeroId,silenced=has(battle,'silence');
 const ultimate=options.forceUltimate??(chargeBefore>=100&&!silenced),collapse=battle.boss&&round%2===0&&!silenced;
 const area=duel?false:ultimate?!!ENEMY_ULTIMATES[battle.family]?.area:collapse;
 const action=ultimate?battle.boss?'boss-ultimate':'enemy-ultimate':collapse?'collapse':duel&&round%2===0?SKILLS[duelHero][0].id:'enemy-hit';
 const kind=ultimate?'ultimate':collapse?'collapse':duel&&round%2===0?'skill':'attack';
 const name=duel?ultimate?ULTIMATE_NAMES[duelHero]:round%2===0?SKILLS[duelHero][0].name:`Ataque de ${heroBases().find(h=>h.id===duelHero)?.name}`:ultimate?ENEMY_ULTIMATES[battle.family]?.name||'Ruptura do Éter':area?battle.family==='cinder'?'Pulso da Pira':'Colapso do Véu':'Golpe de Éter';
 const element=duel?combatElement(duelHero,ultimate?'ultimate':action==='enemy-hit'?'attack':action):ENEMY_ULTIMATES[battle.family]?.element||'dark';
 const missChance=has(battle,'blind')?.5:0,baseDamage=Math.round((damage+(area?5:0))*(ultimate?(ENEMY_ULTIMATES[battle.family]?.multiplier||1.5):1));
 const duelStatuses:Partial<Record<HeroId,StatusId>>={seiji:'blind',ophelia:'freeze',marin:'blind',gabriel:'bleed',max:'silence'};
 // The existing silenced physical hit still applies its even-round status: expose this honestly.
 const status:StatusId|null=ultimate||round%2===0?duel?duelStatuses[duelHero]||'blind':ultimate?ENEMY_ULTIMATES[battle.family]?.status||'blind':battle.boss?'silence':battle.family==='lobo'?'bleed':'blind':null;
 const targets=(area?alive:[alive[(round-1)%alive.length]]).map(h=>{
  const guarded=h.guard&&!options.guardCleared?.has(h.id),ember=setCount(progress,h.id,'ember')>=6?.8:1,defense=cosmeticRank(progress,h.id,'defense');
  const incoming=(guard:boolean)=>Math.max(1,Math.round(baseDamage*(guard?.45:1)*(battle.weakened?.45:1)*ember)-defense),damageOnHit=incoming(guarded);
  return {id:h.id,name:h.name,damageOnHit,damageRange:[missChance?0:damageOnHit,damageOnHit] as [number,number],status,statusTurns:battle.boss?1:2,guarded,statusPrevented:!!status&&(guarded||enemyStatusImmuneV32(progress,h.id,status)||h.hp<=damageOnHit&&!progress.masterMode),guardSavedHp:guarded?Math.max(0,Math.min(h.hp,incoming(false))-Math.min(h.hp,damageOnHit)):0};
 });
 return {...base,kind,action,name,element,targets,area,chargeAfter:ultimate?0:Math.min(100,chargeBefore+34+(phase-1)*8),missChance,blockedBy:silenced?'silence':null};
}

/** Forecast deterministic status ticks/guard expiry before the enemy, without guessing player choices. */
export function nextEnemyIntentV32(battle:Battle,heroes:readonly Hero[],progress:Progression):EnemyIntentV32|null{
 if(battle.result||battle.hp<=0)return null;
 const captured=battle.animation?.actor==='enemy'?battle.animation.enemyIntentV32:undefined;
 if(captured)return {...captured,phase:'in-progress',timing:'acting'};
 const projected=heroes.map(h=>({...h})),statuses=Object.fromEntries(Object.entries(battle.statuses).map(([id,states])=>[id,states.map(s=>({...s}))]));
 const expire=(id:string)=>{statuses[id]=(statuses[id]||[]).map(s=>({...s,turns:s.turns-1})).filter(s=>s.turns>0);};
 const current=battle.queue[battle.index];if(current&&current!=='enemy')expire(current);
 const projectTurn=(id:string)=>{const hero=projected.find(h=>h.id===id);if(!hero||hero.hp<=0)return;const states=statuses[id]||[];if(states.some(s=>s.id==='bleed'))hero.hp=Math.max(0,hero.hp-6);if(hero.hp<=0)return;if(!states.some(s=>s.id==='freeze'||s.id==='bind'))hero.guard=false;expire(id);};
 const index=battle.queue.indexOf('enemy',battle.index);
 const remaining=battle.queue.slice(battle.index+1,index<0?undefined:index);
 for(const id of remaining)if(id!=='enemy')projectTurn(id);
 let round=battle.round;
 if(index<0){round++;const queue=[...projected.filter(h=>h.hp>0).map(h=>({id:h.id,spd:h.spd})),{id:'enemy',spd:battle.spd}].sort((a,b)=>b.spd-a.spd).map(a=>a.id);for(const id of queue.slice(0,queue.indexOf('enemy')))projectTurn(id);}
 return resolveEnemyIntentV32(battle,projected,progress,{round,bleedPending:true});
}
