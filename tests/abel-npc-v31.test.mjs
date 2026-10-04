import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-abel-npc-v31-'));
compileGameModules(out,['engine','renderer','abelNpcV31']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,isWalkable,findPath,parseSave,SAVE_KEY}=await load('engine');
const {MAPS,ASSETS,PLAYABLE_HERO_IDS,heroBases}=await load('data');
const {WorldRenderer}=await load('renderer');
const {ABEL_NPC_V31,abelPatrolV31,ABEL_PATROL_PERIOD_V31,ABEL_PATROL_SPEED_V31}=await load('abelNpcV31');
const {EXPLORATION_DIRECTIONS_V31,EXPLORATION_FRAMES_V31,EXPLORATION_FRAME_MS_V31,EXPLORATION_IDLE_FRAME_V31}=await load('explorationArtV31');
const {QUEST_SITES_V31}=await load('questsV31');
let checks=0;const report=[],store=new Map();
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
function fresh(){const e=new GameEngine();e.start(false);e.finishCutscene();e.state.progress.seen=['arrival','harbor','roots','ashwood-arrival'];return e;}
function finishDialogue(e){let lines=0;while(e.state.mode==='dialogue'){check(++lines<12,'Abel and gate dialogue have a finite number of lines');e.nextDialogue();}}
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const entity=e=>e.activeEntities().find(n=>n.id===ABEL_NPC_V31.id);

equal(Object.values(MAPS).flatMap(m=>m.entities.filter(e=>e.asset==='abel').map(e=>m.id)),['ashpyre'],'approved Abel art now has exactly one real world NPC consumer');
check(!PLAYABLE_HERO_IDS.includes('abel'),'Abel stays outside playable IDs');
check(!heroBases().some(h=>h.id==='abel'),'world NPC does not introduce invented playable vitals');
equal({x:ABEL_NPC_V31.x,y:ABEL_NPC_V31.y},{x:8,y:11},'workshop anchor keeps the actor above the floating exit label');
const e=fresh(),gate=MAPS.ashwood.entities.find(n=>n.to==='ashpyre');
equal(gate.minStage,5,'physical chapter gate remains unchanged');
e.state.stage=4;e.state.map='ashwood';e.state.position={x:gate.x,y:gate.y};e.interact(gate.id);
equal(e.state.map,'ashwood','chapter4 cannot enter the workshop clearing');
equal(e.state.mode,'dialogue','locked gate provides its existing explanation');finishDialogue(e);
e.state.stage=5;e.interact(gate.id);
equal(e.state.map,'ashpyre','chapter5 reaches Abel through the actual gate callback');
equal(e.state.mode,'world','Pira entry does not force Abel dialogue or a boss encounter');
check(entity(e),'engine active entities expose Abel after entering');
report.push('Location: Clareira da Pira (ashpyre), anchor (8,11). Professor da Forja Antiga is Abel\'s title, not a renamed map. Gate: porta-pira stays minStage5; real interaction blocks stage4 and admits stage5.');

const samples=[],facings=new Set();let resting=0;
for(let i=0;i<=392;i++){
 const time=i*.025,pose=abelPatrolV31(time);samples.push(pose);facings.add(pose.facing);if(!pose.moving)resting++;
 e.patrolTime=time;const actual=entity(e);
 equal({x:actual.x,y:actual.y},{x:pose.x,y:pose.y},'engine uses the same short route as its animation direction');
 check(isWalkable(e.map,pose.x,pose.y),'patrol feet stay outside actual walls, water and solid props');
 check(pose.y<=11,'patrol feet stay above the floating pira-retorno label for its entire route');
 check(findPath(e.map,gate.spawn,{x:Math.round(pose.x),y:Math.round(pose.y)}).length>0,'each patrol position remains reachable from the entry');
 for(const target of MAPS.ashpyre.entities.filter(n=>['warp','boss','save'].includes(n.kind)))check(distance(pose,target)>1.7,`patrol cannot hide ${target.id} inside the interaction radius`);
 for(const site of QUEST_SITES_V31.filter(s=>s.map==='ashpyre'))check(distance(pose,site)>1.7,`patrol cannot displace quest interaction ${site.questId}/${site.id}`);
 if(i){const moved=distance(samples[i-1],pose);check(moved<=ABEL_PATROL_SPEED_V31*.025+1e-8,'route has continuous motion at its declared speed, including turns and wrap');}
}
equal([...facings].sort(),[0,1,2,3],'actual route uses south/west/east/north rather than synthetic facing changes');
check(resting>0&&samples.some(p=>p.moving),'movement pauses at the workstations instead of walking in place');
equal(Math.max(...samples.map(p=>p.x))-Math.min(...samples.map(p=>p.x)),2,'patrol covers two horizontal tiles');
equal(Math.max(...samples.map(p=>p.y))-Math.min(...samples.map(p=>p.y)),1,'patrol covers a third tile around the corner');
check(distance(abelPatrolV31(0),abelPatrolV31(ABEL_PATROL_PERIOD_V31))<1e-8,'route wrap returns continuously to its origin');
report.push('Patrol: (7,11)→(9,11)→(9,10) and back; 0.75 tile/s, 0.45s pauses, four real facings. 393 collision/reachability samples; no overlap with crystals, doors, boss or ashpyre quest sites. Route was moved two rows north to separate Abel from the floating exit label.');

// A click walks to the moving NPC and triggers the production dialogue, rather than calling a private handler.
e.patrolTime=0;e.state.position={...gate.spawn};
check(e.approach(ABEL_NPC_V31.id),'player can click the world NPC from the Pira entrance');
for(let i=0;i<200&&e.state.mode==='world';i++)e.update(.025);
equal(e.state.mode,'dialogue','actual approach reaches and talks to the moving Abel');
check(distance(e.state.position,entity(e))<=1.7,'dialogue requires real interaction distance');
const frozen=e.patrolTime;for(let i=0;i<20;i++)e.update(.04);equal(e.patrolTime,frozen,'dialogue freezes Abel route and facing');
check(e.state.dialogue.lines.every(line=>line.speaker==='Abel'&&line.right==='abel'&&line.present),'actual dialogue uses approved Abel portrait as a present NPC');
check(e.state.dialogue.lines.some(line=>line.text.includes('fogo primordial')),'canonical fire identity is explicit');
finishDialogue(e);e.paused=true;const pause=e.patrolTime;e.update(.04);equal(e.patrolTime,pause,'menu pause freezes patrol');
const near=entity(e);e.state.position={x:near.x,y:near.y+1};e.interact(ABEL_NPC_V31.id);equal(e.state.mode,'world','paused input cannot open Abel dialogue');
e.paused=false;e.state.position={x:2,y:14};e.interact(ABEL_NPC_V31.id);equal(e.state.mode,'world','distant interaction does not bypass the approach');
for(const future of ['none','abrigo','oficina']){
 const before=future==='none'?undefined:{step:7,counts:{},choices:{futuro:future},cinematicSeen:true,claimed:true};
 if(before)e.state.progress.questsV31.records['long-brasa']=before;else delete e.state.progress.questsV31.records['long-brasa'];
 e.state.progress.kills.cinder=future==='none'?0:1;const p=entity(e);e.state.position={x:p.x,y:p.y+1};
 const resources=JSON.stringify({progress:e.state.progress,heroes:e.state.heroes,credits:e.state.credits,potions:e.state.potions,ethers:e.state.ethers,remedies:e.state.remedies});
 e.interact(ABEL_NPC_V31.id);check(e.state.dialogue,'repeated workshop conversation remains available');
 const text=e.state.dialogue.lines.map(line=>line.text).join(' ');
 check(text.includes(future==='oficina'?'aprendizes decidirão':future==='abrigo'?'abrigo terá fogo':'Gabriel e Dante'),'Abel acknowledges the actual branch without replacing the quest');
 finishDialogue(e);equal(JSON.stringify({progress:e.state.progress,heroes:e.state.heroes,credits:e.state.credits,potions:e.state.potions,ethers:e.state.ethers,remedies:e.state.remedies}),resources,'dialogue cannot pay, recruit, modify party/vitals or consume resources');
}
delete e.state.progress.questsV31.records['long-brasa'];
check(e.save(true),'new NPC world state saves through the existing writer');
check(parseSave(store.get(SAVE_KEY)),'save remains compatible and passes all existing validation');
report.push('Interaction: real click approach opens Abel dialogue, pause/distance guards hold, route freezes in dialogue, both long-brasa choices are acknowledged with no resource or recruitment changes. Save parses.');

// Exercise the renderer itself, with only browser drawing substituted: no duplicate rendering implementation.
const drawCalls=[],renderer=Object.create(WorldRenderer.prototype),exitLabelTop=MAPS.ashpyre.entities.find(n=>n.id==='pira-retorno').y*56-142;let labelClearance=Infinity;
renderer.engine=e;renderer.frame=0;renderer.images={};
renderer.ctx={save(){},restore(){},beginPath(){},ellipse(){},fill(){},drawImage(...args){drawCalls.push(args);}};
for(const direction of EXPLORATION_DIRECTIONS_V31){const key=`walk_abel_${direction}`,path=ASSETS[key],png=readFileSync(`public${path}`);
 equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`${key}: approved PNG path exists`);
 const width=png.readUInt32BE(16),height=png.readUInt32BE(20);equal(png[25],6,`${key}: source is native RGBA`);
 renderer.images[key]={key,src:path,width,height};equal(EXPLORATION_FRAMES_V31[key].length,8,`${key}: eight measured native poses`);
 for(const crop of EXPLORATION_FRAMES_V31[key])check(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=width&&crop.y+crop.h<=height,`${key}: measured crop stays inside its actual source`);
}
for(let facing=0;facing<4;facing++)for(let frame=0;frame<8;frame++){
 renderer.frame=frame*EXPLORATION_FRAME_MS_V31+1;drawCalls.length=0;renderer.actor('abel',100,11*56,facing,true);
 const key=`walk_abel_${EXPLORATION_DIRECTIONS_V31[facing]}`,crop=EXPLORATION_FRAMES_V31[key][frame],call=drawCalls[0];
 equal(drawCalls.length,1,'approved walking actor emits one native sprite crop');
 equal(call[0].key,key,'renderer consumes the actual direction sheet');
 equal(call.slice(1,5),[crop.x,crop.y,crop.w,crop.h],'renderer consumes every approved pose, not the obsolete alias crop');
 check(call.slice(5).every(Number.isFinite),'native foot-anchor destination has finite bounds');
 const clearance=exitLabelTop-(call[6]+call[8]);labelClearance=Math.min(labelClearance,clearance);check(clearance>1,'even the full native crop at the lowest route row stays above the exit label');
}
for(let i=0;i<samples.length;i+=13){
 e.patrolTime=i*.025;e.state.mode='world';e.paused=false;const pose=abelPatrolV31(e.patrolTime),key=`walk_abel_${EXPLORATION_DIRECTIONS_V31[pose.facing]}`;
 renderer.frame=3*EXPLORATION_FRAME_MS_V31+1;drawCalls.length=0;renderer.entity(entity(e));
 equal(drawCalls[0]?.[0].key,key,'world entity renderer uses the route direction, including corners');
 const crop=EXPLORATION_FRAMES_V31[key][pose.moving?3:EXPLORATION_IDLE_FRAME_V31];equal(drawCalls[0].slice(1,5),[crop.x,crop.y,crop.w,crop.h],'world entity stops on the authored idle frame during route pauses');
}
e.paused=true;drawCalls.length=0;renderer.entity(entity(e));
const pausedPose=abelPatrolV31(e.patrolTime),pausedKey=`walk_abel_${EXPLORATION_DIRECTIONS_V31[pausedPose.facing]}`,idle=EXPLORATION_FRAMES_V31[pausedKey][EXPLORATION_IDLE_FRAME_V31];
equal(drawCalls[0]?.[0].key,pausedKey,'paused entity retains the actual facing');equal(drawCalls[0].slice(1,5),[idle.x,idle.y,idle.w,idle.h],'paused entity does not continue animated walking');
report.push('Renderer: four final RGBA sheets × eight measured crops consumed by WorldRenderer.actor. WorldRenderer.entity follows actual patrol facing, chooses the idle frame for pauses/menus, and preserves native foot anchors.');
report.push(`Exit-label regression: every route point has feet y≤11; all32 rendered crop bounds retain at least ${labelClearance.toFixed(2)}px vertical clearance above pira-retorno\'s label in world coordinates.`);
const text=`Abel NPC v31 — PASS (${checks} checks)\n\n${report.join('\n')}\n\nBefore this change, approved Abel walking assets had no NPC in MAPS. This adds the actual world consumer; Abel remains a collection character outside PLAYABLE_HERO_IDS.\n`;
mkdirSync('docs/qa-v31',{recursive:true});writeFileSync('docs/qa-v31/abel-npc-test.txt',text);console.log(text);
