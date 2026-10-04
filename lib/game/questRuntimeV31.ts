import type {Entity,MapId} from './data';
import {QUESTS_V31,questByIdV31,questEntityIdV31,type QuestDefV31,type QuestCategoryV31,type QuestEventKindV31,CRYSTALS_PER_PULL_V31} from './questsV31';

export type QuestRecordV31={step:number;counts:Record<string,number>;choices:Record<string,string>;cinematicSeen:boolean;claimed:boolean};
export type QuestProgressV31={version:1;tracked:string|null;records:Record<string,QuestRecordV31>};
export type QuestEventV31={kind:QuestEventKindV31;target?:string;amount?:number;questId?:string;entityId?:string};
export type QuestStatusV31='locked'|'available'|'active'|'cinematic'|'complete'|'claimed';
export type QuestJournalEntryV31={id:string;name:string;kind:QuestCategoryV31;summary:string;giver:string;quest:QuestDefV31;status:QuestStatusV31;tracked:boolean;rewardPulls:number;rewardCrystals:number;currentStep:{id:string;title:string;description:string;index:number;total:number;objectives:{id:string;label:string;current:number;goal:number}[]}|null;choices:{siteId:string;id:string;label:string;detail:string}[];consequences:string[];cinematicSeen:boolean};
export const freshQuestProgressV31=():QuestProgressV31=>({version:1,tracked:null,records:{}});
const object=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
const counterKey=(step:number,id:string)=>`${step}:${id}`;

/** Missing v31 state migrates cleanly; malformed known records invalidate the save rather than minting rewards. */
export function normalizeQuestProgressV31(raw:unknown):QuestProgressV31|null{
 if(raw===undefined)return freshQuestProgressV31();
 if(!object(raw)||raw.version!==1||!object(raw.records)||!(raw.tracked===null||typeof raw.tracked==='string'))return null;
 const normalized=freshQuestProgressV31();
 for(const [id,input] of Object.entries(raw.records)){
  const q=questByIdV31(id);if(!q)continue;
  if(!object(input)||!Number.isInteger(input.step)||Number(input.step)<0||Number(input.step)>q.steps.length||!object(input.counts)||!object(input.choices)||typeof input.claimed!=='boolean'||typeof input.cinematicSeen!=='boolean')return null;
  const record:QuestRecordV31={step:Number(input.step),counts:{},choices:{},claimed:input.claimed,cinematicSeen:input.cinematicSeen};
  for(const [key,value] of Object.entries(input.counts)){
   const match=q.steps.flatMap((s,index)=>s.objectives.map(o=>({o,index,key:counterKey(index,o.id)}))).find(o=>o.key===key);
   if(!match||match.index>record.step||typeof value!=='number'||!Number.isFinite(value)||value<0||value>match.o.goal)return null;
   record.counts[key]=value;
  }
  for(let index=0;index<record.step;index++)if(q.steps[index].objectives.some(o=>(record.counts[counterKey(index,o.id)]||0)<o.goal))return null;
  const activeStep=q.steps[record.step];if(activeStep?.sequence){let missing=false;for(const o of activeStep.objectives){const n=record.counts[counterKey(record.step,o.id)]||0;if(missing&&n>0)return null;if(n<o.goal)missing=true;}}
  if(record.step<q.steps.length&&q.steps[record.step].objectives.every(o=>(record.counts[counterKey(record.step,o.id)]||0)>=o.goal))return null;
  for(const [siteId,value] of Object.entries(input.choices)){
   const index=q.steps.findIndex(s=>s.sites.some(site=>site.id===siteId)),site=q.steps[index]?.sites.find(s=>s.id===siteId),choice=site?.choices?.find(c=>c.id===value);
   if(index<0||index>record.step||!choice||choice.correct===false||!(record.counts[counterKey(index,siteId)]>=1))return null;
   record.choices[siteId]=String(value);
  }
  for(let index=0;index<=record.step&&index<q.steps.length;index++)for(const site of q.steps[index].sites)if(site.choices&&record.counts[counterKey(index,site.id)]>=1&&!record.choices[site.id])return null;
  if((record.claimed||record.cinematicSeen)&&record.step!==q.steps.length||record.claimed&&q.cinematic&&!record.cinematicSeen||record.cinematicSeen&&!q.cinematic)return null;
  normalized.records[id]=record;
 }
 normalized.tracked=typeof raw.tracked==='string'&&normalized.records[raw.tracked]&&!normalized.records[raw.tracked].claimed?raw.tracked:null;
 return normalized;
}
export function questStatusV31(q:QuestDefV31,p:QuestProgressV31,stage:number):QuestStatusV31{
 const r=p.records[q.id];if(!r)return stage<q.minStage?'locked':'available';
 if(r.claimed)return 'claimed';if(r.step<q.steps.length)return 'active';
 return q.cinematic&&!r.cinematicSeen?'cinematic':'complete';
}
export function acceptQuestV31(p:QuestProgressV31,id:string,stage:number):boolean{
 const q=questByIdV31(id);if(!q||stage<q.minStage||p.records[id])return false;
 p.records[id]={step:0,counts:{},choices:{},cinematicSeen:false,claimed:false};p.tracked=id;return true;
}
export function trackQuestV31(p:QuestProgressV31,id:string|null):boolean{
 if(id!==null&&(!p.records[id]||p.records[id].claimed))return false;p.tracked=id;return true;
}
export function applyQuestEventV31(p:QuestProgressV31,event:QuestEventV31):string[]{
 const changed:string[]=[];
 for(const q of QUESTS_V31){
  const r=p.records[q.id];if(!r||r.claimed||r.step>=q.steps.length||event.questId&&event.questId!==q.id)continue;
  if(q.id==='tutorial-guarda'&&['action','victory'].includes(event.kind)&&event.entityId!==questEntityIdV31(q.id,'treino'))continue;
  const current=q.steps[r.step];let modified=false;
  const firstPending=current.sequence?current.objectives.find(o=>(r.counts[counterKey(r.step,o.id)]||0)<o.goal):undefined;
  for(const o of current.objectives){if(firstPending&&o!==firstPending||o.event!==event.kind||o.target!==undefined&&o.target!==event.target)continue;
   const key=counterKey(r.step,o.id),previous=r.counts[key]||0,amount=event.amount??1;if(!Number.isFinite(amount)||amount<=0)continue;
   const next=Math.min(o.goal,previous+amount);if(next!==previous){r.counts[key]=next;modified=true;}
  }
  if(!modified)continue;
  if(current.objectives.every(o=>(r.counts[counterKey(r.step,o.id)]||0)>=o.goal))r.step++;
  changed.push(q.id);
 }
 return changed;
}
export function applyQuestChoiceV31(p:QuestProgressV31,questId:string,siteId:string,choiceId:string):{accepted:boolean;correct:boolean;text?:string}{
 const q=questByIdV31(questId),r=p.records[questId],site=q?.steps[r?.step]?.sites.find(s=>s.id===siteId),choice=site?.choices?.find(c=>c.id===choiceId);
 if(!q||!r||r.claimed||!choice||r.counts[counterKey(r.step,siteId)]>=1)return {accepted:false,correct:false};
 if(choice.correct===false)return {accepted:true,correct:false,text:choice.text};
 r.choices[siteId]=choice.id;applyQuestEventV31(p,{kind:'site',questId,target:siteId});return {accepted:true,correct:true,text:choice.text};
}
export function questJournalV31(p:QuestProgressV31,stage:number):QuestJournalEntryV31[]{
 return QUESTS_V31.map(q=>{const r=p.records[q.id],step=r?q.steps[r.step]:undefined;
  const choices=q.steps.flatMap(s=>s.sites).flatMap(s=>{const choice=s.choices?.find(c=>c.id===r?.choices[s.id]);return choice?[{siteId:s.id,id:choice.id,label:choice.label,detail:choice.text}]:[];});
  return {id:q.id,name:q.name,kind:q.category,summary:q.description,giver:q.giver,quest:q,status:questStatusV31(q,p,stage),tracked:p.tracked===q.id,rewardPulls:q.rewardPulls,rewardCrystals:q.rewardPulls*CRYSTALS_PER_PULL_V31,currentStep:step?{id:step.id,title:step.title,description:step.description,index:r.step+1,total:q.steps.length,objectives:step.objectives.map(o=>({id:o.id,label:o.label,current:r.counts[counterKey(r.step,o.id)]||0,goal:o.goal}))}:null,choices,consequences:q.steps.flatMap(s=>s.sites).flatMap(s=>{const c=s.choices?.find(c=>c.id===r?.choices[s.id]);return c?.consequence?[c.consequence]:[];}),cinematicSeen:r?.cinematicSeen||false};
 });
}
export function questEntitiesV31(p:QuestProgressV31,map:MapId,stage:number):Entity[]{
 return QUESTS_V31.flatMap(q=>{const r=p.records[q.id];if(!r)return [];const status=questStatusV31(q,p,stage);
  if(q.cinematic&&['complete','claimed'].includes(status))return q.steps.at(-1)!.sites.filter(s=>s.map===map).map(s=>({id:questEntityIdV31(q.id,s.id),label:`Memória · ${q.name}`,x:s.x,y:s.y,kind:'sign' as const,asset:'quest_long',minStage:q.minStage}));
  if(status!=='active')return [];
  const sites=q.id==='tutorial-guarda'&&r.step>0?q.steps[0].sites:q.steps[r.step].sites;
  return sites.filter(s=>s.map===map&&(q.id==='tutorial-guarda'&&r.step>0||!(r.counts[counterKey(r.step,s.id)]>=1))).map(s=>({id:questEntityIdV31(q.id,s.id),label:s.label,x:s.x,y:s.y,kind:'sign' as const,asset:`quest_${q.category}`,minStage:q.minStage}));
 });
}
