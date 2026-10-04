import {MAPS,type MapId} from './data';
import {questEntitiesV31,type QuestJournalEntryV31,type QuestProgressV31} from './questRuntimeV31';
import {questEntityIdV31} from './questsV31';

export type WorldRouteV32={maps:MapId[];exitId:string|null};
/** Routes follow real gateways and their campaign locks; they never teleport. */
export function worldRouteV32(from:MapId,to:MapId,stage:number):WorldRouteV32|null{
 if(!MAPS[from]||!MAPS[to])return null;
 if(from===to)return {maps:[from],exitId:null};
 const visited=new Set<MapId>([from]),queue:{map:MapId;maps:MapId[];exitId:string|null}[]=[{map:from,maps:[from],exitId:null}];
 while(queue.length){const node=queue.shift()!;for(const exit of MAPS[node.map].entities){if(exit.kind!=='warp'||!exit.to||(exit.minStage||0)>stage||exit.fieldRequired||visited.has(exit.to))continue;const route={map:exit.to,maps:[...node.maps,exit.to],exitId:node.exitId||exit.id};if(exit.to===to)return {maps:route.maps,exitId:route.exitId};visited.add(exit.to);queue.push(route);}}
 return null;
}

export function questDestinationsV32(q:QuestJournalEntryV31,map:MapId,stage:number,p:QuestProgressV31){
 if(q.status!=='active'||!q.currentStep)return [];
 return q.quest.steps[q.currentStep.index-1].sites.filter(site=>questEntitiesV31(p,site.map,stage).some(e=>e.id===questEntityIdV31(q.id,site.id))).map(site=>({site,entityId:questEntityIdV31(q.id,site.id),route:worldRouteV32(map,site.map,stage)}));
}
