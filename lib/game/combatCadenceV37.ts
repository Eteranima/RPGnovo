import type {Hero} from './data';
import type {Battle} from './engine';

export type CombatCadenceProfileV37={enemyActions:1|2|3;maxAlliedBurst:1|2|3};
type Encounter=Pick<Battle,'entityId'|'family'|'boss'|'difficulty'|'eventId'>;
const mob:CombatCadenceProfileV37={enemyActions:2,maxAlliedBurst:3};
const boss:CombatCadenceProfileV37={enemyActions:3,maxAlliedBurst:2};
const training:CombatCadenceProfileV37={enemyActions:1,maxAlliedBurst:2};
/** Fixed encounter budgets. Difficulty already modifies HP/damage, so cadence adds no second multiplier. */
export const COMBAT_CADENCE_V37={mob:[mob,mob,mob],duel:[mob,mob,mob],boss:[boss,boss,boss],training:[training,training,training]} as const;
/** Author explicit encounter/family exceptions here, never from party size or current HP. */
export const ENCOUNTER_CADENCE_V37:Readonly<Record<string,readonly [CombatCadenceProfileV37,CombatCadenceProfileV37,CombatCadenceProfileV37]>>={
 // The first chapter is reachable with the original level1 pair, before recruitment or farming.
 selo:[mob,mob,mob]
};
export const FAMILY_CADENCE_V37:Readonly<Record<string,readonly [CombatCadenceProfileV37,CombatCadenceProfileV37,CombatCadenceProfileV37]>>={};
export function combatCadenceV37(battle:Encounter):CombatCadenceProfileV37{
 const tier=Math.max(0,Math.min(2,battle.difficulty-1));
 const kind=battle.entityId.includes('tutorial-guarda')?'training':battle.eventId?.startsWith('recruit-')?'duel':battle.boss?'boss':'mob';
 return {...(ENCOUNTER_CADENCE_V37[battle.entityId]||FAMILY_CADENCE_V37[battle.family]||COMBAT_CADENCE_V37[kind])[tier]};
}
/** Each living ally gets one turn; all fixed enemy windows are used even against a solo hero. */
export function buildBattleQueueV37(battle:Battle,heroes:readonly Hero[]):string[]{
 const profile=battle.cadenceV37||combatCadenceV37(battle);
 const initiative=[...heroes.filter(hero=>hero.hp>0).map(hero=>({id:hero.id as string,spd:hero.spd})),{id:'enemy',spd:battle.spd}].sort((a,b)=>b.spd-a.spd);
 const first=Math.min(initiative.findIndex(actor=>actor.id==='enemy'),profile.maxAlliedBurst);
 const allies=initiative.filter(actor=>actor.id!=='enemy').map(actor=>actor.id),queue:string[]=[];
 let consumed=0;
 for(let action=0;action<profile.enemyActions;action++){
  const stop=Math.min(allies.length,action===0?first:consumed+profile.maxAlliedBurst);
  queue.push(...allies.slice(consumed,stop),'enemy');consumed=stop;
 }
 queue.push(...allies.slice(consumed));return queue;
}
/** Also supports legacy manually supplied queues, without inventing invisible enemy windows. */
export function enemyActionWindowV37(battle:Battle,round=battle.round){
 const actions=Math.max(1,battle.queue.filter(id=>id==='enemy').length);
 const action=Math.min(actions,1+battle.queue.slice(0,battle.index).filter(id=>id==='enemy').length);
 return {action,actions,ordinal:(round-1)*actions+action-1,reaction:action>1};
}
export function enemyChargeStepV37(total:number,action:number,actions:number){return Math.floor(total/actions)+(action<=total%actions?1:0);}
