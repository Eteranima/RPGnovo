import type {ChessFightV39,ChessFightEventV39,ChessFightUnitV39} from '../game/autoChessCombatV39';

type Timeline={checkpoints:ChessFightUnitV39[][];checkpointEvents:number[];actions:Map<string,ChessFightEventV39[]>;moves:Map<string,ChessFightEventV39[]>;deaths:Map<string,ChessFightEventV39[]>;impacts:Map<ChessFightEventV39,number>;zones:ChessFightEventV39[]};
const timelines=new WeakMap<ChessFightV39,Timeline>();
const clone=(units:readonly ChessFightUnitV39[])=>units.map(unit=>({...unit,items:[...unit.items]}));
/** First event after this tick, including all impacts sharing the same tick. */
function upper(events:readonly ChessFightEventV39[],tick:number){let low=0,high=events.length;while(low<high){const mid=(low+high)>>>1;if(events[mid].tick<=tick)low=mid+1;else high=mid;}return low;}
function lower(events:readonly ChessFightEventV39[],tick:number){let low=0,high=events.length;while(low<high){const mid=(low+high)>>>1;if(events[mid].tick<tick)low=mid+1;else high=mid;}return low;}
function append(map:Map<string,ChessFightEventV39[]>,id:string,event:ChessFightEventV39){const list=map.get(id);if(list)list.push(event);else map.set(id,[event]);}
function timeline(fight:ChessFightV39):Timeline{
 const cached=timelines.get(fight);if(cached)return cached;
 const units=clone(fight.initialUnits),byId=new Map(units.map(unit=>[unit.uid,unit])),hp=new Map(units.map(unit=>[unit.uid,unit.hp])),shields=new Map(units.map(unit=>[unit.uid,unit.shield])),result:Timeline={checkpoints:[],checkpointEvents:[],actions:new Map(),moves:new Map(),deaths:new Map(),impacts:new Map(),zones:[]};
 for(const event of fight.events){const subject=event.target||event.actor,beforeHp=hp.get(subject)??event.hp,beforeShield=shields.get(subject)??event.shield,impact=event.kind==='heal'?Math.max(0,event.hp-beforeHp):event.kind==='shield'?Math.max(0,event.shield-beforeShield):['attack','skill','status'].includes(event.kind)?Math.max(0,beforeHp-event.hp):0;if(impact)result.impacts.set(event,impact);hp.set(subject,event.hp);shields.set(subject,event.shield);if(event.kind==='attack'||event.kind==='skill')append(result.actions,event.actor,event);if(event.kind==='move')append(result.moves,event.actor,event);if(event.kind==='death')append(result.deaths,event.target||event.actor,event);if(event.kind==='status'&&event.action==='pyre-zone')result.zones.push(event);}
 let at=0;
 for(let tick=0;tick<fight.ticks;tick+=10){while(at<fight.events.length&&fight.events[at].tick<=tick){apply(fight.events[at++],byId);}result.checkpoints.push(clone(units));result.checkpointEvents.push(at);}
 timelines.set(fight,result);return result;
}
function apply(event:ChessFightEventV39,byId:Map<string,ChessFightUnitV39>){const subject=byId.get(event.target||event.actor),actor=byId.get(event.actor);if(subject){subject.hp=event.hp;subject.mana=event.mana;subject.shield=event.shield;}if(actor&&event.kind==='move')actor.cell=event.toCell;if(actor&&event.kind==='skill')actor.mana=0;}
/** Seeking reads the recorded timeline; it never runs the simulator or writes progress. */
export function chessReplayUnits(fight:ChessFightV39,tick:number):ChessFightUnitV39[]{
 if(tick<0)return clone(fight.initialUnits);if(tick>=fight.ticks)return clone(fight.finalUnits);
 const indexed=timeline(fight),slot=Math.max(0,Math.min(indexed.checkpoints.length-1,Math.floor(tick/10))),units=clone(indexed.checkpoints[slot]||fight.initialUnits),byId=new Map(units.map(unit=>[unit.uid,unit]));
 for(let at=indexed.checkpointEvents[slot]||0;at<fight.events.length&&fight.events[at].tick<=tick;at++)apply(fight.events[at],byId);
 return units;
}
export function chessReplayPose(fight:ChessFightV39,uid:string,tick:number){
 const indexed=timeline(fight),actions=indexed.actions.get(uid)||[],moves=indexed.moves.get(uid)||[],deaths=indexed.deaths.get(uid)||[],actionEnd=upper(actions,tick),next=actions[lower(actions,tick)],previous=actions[actionEnd-1],movement=moves[upper(moves,tick)-1],death=deaths[upper(deaths,tick)-1];
 return {action:next&&next.tick-tick<=2?next:previous&&tick-previous.tick<=5?previous:undefined,movement:movement&&tick-movement.tick<=3?movement:undefined,death};
}
export function chessReplayEffects(fight:ChessFightV39,tick:number){const end=upper(fight.events,tick),start=lower(fight.events,tick-5.5);return fight.events.slice(start,end);}
export function chessReplayEventsBetween(fight:ChessFightV39,from:number,to:number){return to<=from?[]:fight.events.slice(upper(fight.events,from),upper(fight.events,to));}
/** Combat labels use the measured change, so a duration or redundant shield never becomes a damage number. */
export function chessReplayImpact(fight:ChessFightV39,event:ChessFightEventV39){return timeline(fight).impacts.get(event)||0;}
export function chessReplayZones(fight:ChessFightV39,tick:number){const zones=timeline(fight).zones,latest=new Map<string,ChessFightEventV39>();for(const event of zones.slice(lower(zones,tick-30),upper(zones,tick)))latest.set(event.actor,event);return [...latest.values()].filter(event=>tick<=event.tick+event.value);}
