import type {Entity,Point} from './data';

/** A workshop visitor, separate from recruitment and the playable party. */
export const ABEL_NPC_V31:Entity={id:'abel-forja',label:'Abel Nomikos · Professor da Forja Antiga',kind:'npc',asset:'abel',x:8,y:11};
export const ABEL_PATROL_SPEED_V31=.75;
export const ABEL_PATROL_PAUSE_V31=.45;
const legs:{from:Point;to:Point;facing:number}[]=[
 {from:{x:7,y:11},to:{x:9,y:11},facing:2},
 {from:{x:9,y:11},to:{x:9,y:10},facing:3},
 {from:{x:9,y:10},to:{x:9,y:11},facing:0},
 {from:{x:9,y:11},to:{x:7,y:11},facing:1},
];
export const ABEL_PATROL_PERIOD_V31=legs.reduce((time,leg)=>time+Math.hypot(leg.to.x-leg.from.x,leg.to.y-leg.from.y)/ABEL_PATROL_SPEED_V31+ABEL_PATROL_PAUSE_V31,0);

/** The specific, collision-checked three-tile route in the clearing. Time is in seconds. */
export function abelPatrolV31(time:number):Point&{facing:number;moving:boolean}{
 let phase=(Number.isFinite(time)?Math.max(0,time):0)%ABEL_PATROL_PERIOD_V31;
 for(const leg of legs){
  const travel=Math.hypot(leg.to.x-leg.from.x,leg.to.y-leg.from.y)/ABEL_PATROL_SPEED_V31;
  if(phase<travel){const progress=phase/travel;return {x:leg.from.x+(leg.to.x-leg.from.x)*progress,y:leg.from.y+(leg.to.y-leg.from.y)*progress,facing:leg.facing,moving:true};}
  if(phase<travel+ABEL_PATROL_PAUSE_V31)return {...leg.to,facing:leg.facing,moving:false};
  phase-=travel+ABEL_PATROL_PAUSE_V31;
 }
 return {...legs[0].from,facing:2,moving:false};
}
