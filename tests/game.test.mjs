import {imageDimensions} from './image-dimensions.mjs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import ts from 'typescript';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const out=mkdtempSync(join(tmpdir(),'eter-tests-')); 
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','cosmetics','data','engine','sprites','progression','summons','master-mode','carmilla']){const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");writeFileSync(`${out}/${name}.js`,ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);}
const {GameEngine,isWalkable,findPath,parseSave,SAVE_KEY}=await import(pathToFileURL(join(out,'engine.js')).href);
const {MAPS,ASSETS}=await import(pathToFileURL(join(out,'data.js')).href);
const {ICON_CROPS,battleCrop}=await import(pathToFileURL(join(out,'sprites.js')).href);
const {advanceMasterSequence,emptyMasterSequence}=await import(pathToFileURL(join(out,'master-mode.js')).href);
const store=new Map();global.localStorage={setItem:(k,v)=>store.set(k,v),getItem:k=>store.get(k)||null};
const timers=[];global.setTimeout=cb=>{timers.push(cb);return 1;};
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++;};
for(const m of Object.values(MAPS)){
 check(m.rows.length===m.height&&m.rows.every(r=>r.length===m.width),`${m.id}: real grid dimensions`);
 check(!isWalkable(m,0,0),`${m.id}: boundaries blocked`);
 if(m.safe)check(!m.entities.some(e=>e.kind==='mob'||e.kind==='boss'),`${m.id}: safe area has no hostiles`);
 const spawn=m.id==='patio'?{x:14,y:12}:Object.values(MAPS).flatMap(m=>m.entities).find(e=>e.to===m.id)?.spawn;check(spawn&&isWalkable(m,spawn.x,spawn.y),`${m.id}: entry position is walkable`);
 for(const e of m.entities){const near=[{x:Math.round(e.x),y:Math.round(e.y)+1},{x:Math.round(e.x)-1,y:Math.round(e.y)},{x:Math.round(e.x)+1,y:Math.round(e.y)}];check(near.some(p=>findPath(m,spawn,p).length>0),`${m.id}/${e.id}: accessible through navigation`);if(e.to)check(MAPS[e.to]&&isWalkable(MAPS[e.to],e.spawn.x,e.spawn.y),`${e.id}: valid destination`);}
 for(let y=0;y<m.height;y++)for(let x=0;x<m.width;x++)if(m.rows[y][x]==='w')check(!isWalkable(m,x,y),'water blocked');
}
for(const [key,path] of Object.entries(ASSETS))check(existsSync(`public${path}`),`asset ${key} exists`);
for(const hero of ['seiji','ophelia'])for(const action of ['attack','cast']){
 const {width,height}=imageDimensions(`public${ASSETS[`battle_${hero}_${action}`]}`);
 check(width===1536&&height===1024,`${hero}/${action}: six generated frames`);
 for(let frame=0;frame<6;frame++){const r=battleCrop(`battle_${hero}_${action}`,frame);check(r.x>=0&&r.y>=0&&r.x+r.w<=width&&r.y+r.h<=height,`${hero}/${action}/${frame}: source crop inside sheet`);check(r.anchorX>=r.x&&r.anchorX<=r.x+r.w&&r.anchorY>=r.y&&r.anchorY<=r.y+r.h,`${hero}/${action}/${frame}: feet anchor inside frame`);}
}
for(const key of ['wolf','shadow','boss'])for(let frame=0;frame<4;frame++){
 const r=battleCrop(`battle_${key}_attack`,frame);check(r.x>=0&&r.y>=0&&r.x+r.w<=1254&&r.y+r.h<=1254,`${key}/${frame}: complete source frame inside sheet`);check(r.anchorX>=r.x&&r.anchorX<=r.x+r.w&&r.anchorY>=r.y&&r.anchorY<=r.y+r.h,`${key}/${frame}: anchor contained`);
}
for(const r of ICON_CROPS)check(r.x>=0&&r.y>=0&&r.x+r.w<=1254&&r.y+r.h<=1254,'icon crop inside whole source atlas');
const g=new GameEngine();g.hydrate();check(!g.state.hasSave,'fresh start');g.start();
const finishDialogue=()=>{let n=0;while(['dialogue','cutscene'].includes(g.state.mode)&&n++<15){if(g.state.mode==='cutscene'){g.nextCutscene();continue;}const d=g.state.dialogue;if(d.choice&&d.index===d.lines.length-1)g.choose(true);else g.nextDialogue();}check(n<15,'dialogue completes');};
finishDialogue();
const battle=()=>{let n=0;while(g.state.mode==='battle'&&!g.state.battle.result&&n++<250){if(timers.length){timers.shift()();continue;}const h=g.currentHero();if(!h)throw Error('stuck battle');const low=g.state.heroes.reduce((a,b)=>a.hp/a.maxHp<b.hp/b.maxHp?a:b);if(g.state.progress.limit[h.id]>=100)g.action('ultimate');else if(low.hp<low.maxHp*.4&&g.state.potions>0)g.action('potion',low.id);else if(h.id==='ophelia'&&low.hp<low.maxHp*.55&&h.mp>=9&&!g.hasStatus(h.id,'silence'))g.action('mend',low.id);else if(h.id==='seiji'&&h.mp>=6&&!g.hasStatus(h.id,'silence'))g.action('cut');else if(h.id==='ophelia'&&h.mp>=7&&!g.hasStatus(h.id,'silence'))g.action('shard');else g.action('attack');}check(n<250,'battle terminates');check(g.state.battle.result==='victory','combat strategy wins');g.finishBattle();finishDialogue();};
const go=id=>{const originalMap=g.state.map;check(g.approach(id),`path starts: ${id}`);let n=0;while(g.path.length&&n++<1600){g.update(.04);if(g.state.mode==='battle'){const enemyId=g.state.battle.entityId;battle();if(g.state.map===originalMap&&enemyId!==id)check(g.approach(id),`continue walking after encounter: ${id}`);}}check(n<1600,`path completes: ${id}`);if(['dialogue','cutscene'].includes(g.state.mode))finishDialogue();if(g.state.mode==='battle')battle();};
go('academia');go('escada');check(g.state.map==='arquivo'&&g.state.stage===0,'locked stairs cannot bypass quest');go('retorno');go('beatriz');check(g.state.stage===1,'accepted mission');go('academia');go('bolsa');check(g.state.potions===5,'chest grants inventory');go('bolsa');check(g.state.potions===5,'chest cannot duplicate');go('livro');check(g.state.stage===2,'book opens stairs');go('escada');check(g.state.map==='subsolo','real map transition');go('sub-cristal');check(g.state.heroes.every(h=>h.hp===h.maxHp),'crystal restores');go('fragmento');check(g.state.stage===3,'inscription opens chamber');go('porta-selo');go('cam-cristal');go('selo');check(g.state.stage===4,'boss advances quest');check(!g.activeEntities().some(e=>e.kind==='boss'),'boss stays defeated');go('cam-retorno');go('sub-retorno');go('retorno');go('beatriz');check(g.state.stage===5,'entire chapter completes');check(g.state.credits>=780,'boss and quest rewards');
check(parseSave(store.get(SAVE_KEY))?.stage===5,'save round trip');const resumed=new GameEngine();resumed.hydrate();resumed.start(true);check(resumed.state.stage===5,'resume completion');check(parseSave('{corrupt')===null,'invalid save rejected');const corrupted=JSON.parse(store.get(SAVE_KEY));corrupted.position={x:0,y:0};check(parseSave(JSON.stringify(corrupted))===null,'unsafe position rejected');
const resp=new GameEngine();resp.start();resp.finishCutscene();resp.state.map='subsolo';resp.state.position={x:11,y:8};resp.beginBattle(MAPS.subsolo.entities.find(e=>e.id==='lobo'));resp.action('flee');check(!resp.activeEntities().some(e=>e.id==='lobo'),'mob absent after encounter');resp.now+=12.1;check(resp.activeEntities().some(e=>e.id==='lobo'),'mob respawns at 12 seconds');
const failed=new GameEngine();failed.start();failed.finishCutscene();failed.state.stage=3;failed.beginBattle(MAPS.camara.entities.find(e=>e.id==='selo'));failed.state.heroes.forEach(h=>h.hp=0);failed.nextActor();check(failed.state.battle.result==='defeat','defeat detected');failed.finishBattle();check(failed.state.map==='patio'&&failed.state.stage===3&&failed.state.heroes.every(h=>h.hp>0),'defeat returns to checkpoint without losing mission');
// Each command owns its entire sequence: reserve once, apply at impact, release at recovery.
while(timers.length)timers.shift()();
const animated=new GameEngine();animated.start();animated.finishCutscene();animated.beginBattle(MAPS.subsolo.entities.find(e=>e.id==='lobo'));
const hp=animated.state.battle.hp;
check(animated.action('cut'),'animated spell accepted');
check(animated.state.heroes[0].mp===34,'spell cost reserved exactly once');
check(animated.state.battle.animation.actor==='seiji'&&animated.state.battle.animation.action==='cut','generated sequence identifies actor and skill');
check(animated.state.battle.busy&&!animated.currentHero(),'input locked during sequence');
check(!animated.action('cut'),'double tap cannot consume a second action');
check(animated.state.battle.hp===hp,'damage waits for impact');
timers.shift()();
check(animated.state.battle.hp===hp-38,'impact applies spell damage once');
check(animated.state.battle.busy&&animated.state.battle.index===0,'recovery keeps current turn');
timers.shift()();
check(animated.currentHero()?.id==='ophelia','recovery advances to next actor');
animated.state.heroes[0].hp=20;
check(animated.action('mend','seiji'),'Ophelia healing animation accepted');
check(animated.state.battle.animation.target==='seiji','healing effect follows selected ally');
check(animated.state.heroes[0].hp===20,'healing waits for impact');
timers.shift()();
check(animated.state.heroes[0].hp===56,'healing applies to current state after snapshots');
timers.shift()();
check(animated.state.battle.animation.actor==='enemy','enemy waits until player animation finishes');
while(timers.length)timers.shift()();
check(animated.currentHero()?.id==='seiji','next round unlocks command input');
const before=animated.state.heroes[0].mp;
check(!animated.action('unknown'),'invalid command does not animate');
check(animated.state.heroes[0].mp===before&&!animated.state.battle.busy,'invalid command preserves MP and input');
animated.state.battle.hp=1;animated.action('attack');
timers.shift()();
check(!animated.state.battle.result,'victory waits for recovery');
timers.shift()();
check(animated.state.battle.result==='victory','victory follows completed animation');
let secret=emptyMasterSequence(),triggered=false;for(const [key,at] of [['p',100],['p',400],['a',700],['p',900],['p',1100],['w',1300]]){const result=advanceMasterSequence(secret,key,at);secret=result.state;triggered=result.activated;}
check(triggered,'master combination activates within ten seconds');
secret=emptyMasterSequence();for(const [key,at] of [['p',100],['p',200],['a',300],['p',400],['p',500],['w',10100]]){const result=advanceMasterSequence(secret,key,at);secret=result.state;triggered=result.activated;}check(!triggered,'expired combination does not activate');
const master=new GameEngine();master.start();master.finishCutscene();master.state.progress.crystals=0;master.state.progress.tokens=0;master.state.credits=0;
check(master.activateMasterMode()&&master.state.progress.masterMode,'master mode activates and persists in state');
check(master.drawCharacter(10,'crystal',()=>.99),'ten character pulls work with zero crystals');check(master.state.progress.crystals===0&&master.state.progress.tokens===0,'master pulls consume no crystals or tickets');
check(master.drawCosmetics(5,()=>.2),'cosmetic pulls work with zero tickets');check(master.state.progress.tokens===0,'master cosmetic pulls consume no tickets');
check(master.buy('potion'),'master purchase works with zero credits');check(master.state.credits===0,'master purchase consumes no credits');
check(master.buy('shop-1-weapon')&&master.buy('shop-1-weapon'),'master can repeatedly buy equipment with zero credits');
check(master.state.progress.owned.includes('shop-1-weapon')&&master.state.progress.owned.includes('shop-1-weapon@2'),'repeat purchase creates a separate equipment copy');
check(!master.buy('shop-8-weapon'),'master mode preserves level gates');
check(parseSave(store.get(SAVE_KEY))?.progress.masterMode===true,'master mode survives save validation');
const professor=new GameEngine();professor.start();professor.finishCutscene();let roll=0;check(professor.drawCharacter(1,'crystal',()=>[0,.3][roll++]||0),'Beatriz can be summoned at 5-star rarity');
check(professor.state.progress.summoned.includes('beatriz')&&professor.state.progress.recruited.includes('beatriz')&&!professor.state.progress.party.includes('beatriz'),'Beatriz joins reserve rather than active party');
check(professor.assignParty(0,'beatriz')&&professor.state.heroes[0].id==='beatriz','Beatriz can join the active party');
check(parseSave(store.get(SAVE_KEY))?.heroes[0].id==='beatriz','summoned Beatriz survives save validation');
for(let frame=0;frame<3;frame++){const r=battleCrop('battle_beatriz_attack',frame);check(r.x>=0&&r.y>=0&&r.x+r.w<=2172&&r.y+r.h<=724,`Beatriz combat frame ${frame} stays inside the approved strip`);}
while(timers.length)timers.shift()();
professor.beginBattle(MAPS.subsolo.entities.find(e=>e.id==='lobo'));check(professor.currentHero()?.id==='beatriz','Beatriz acts in turn order');const initialHp=professor.state.battle.hp;check(professor.action('tidecut'),'Beatriz can cast Lâmina da Maré');timers.shift()();check(professor.state.battle.hp<initialHp,'water skill damages the enemy');timers.shift()();
professor.state.progress.limit.beatriz=100;let guard=0;while(professor.state.mode==='battle'&&!professor.state.battle.result&&professor.currentHero()?.id!=='beatriz'&&guard++<24){if(timers.length)timers.shift()();else if(professor.currentHero())professor.action('guard');}check(guard<24,'Beatriz receives another turn');check(professor.action('ultimate'),'Beatriz can release her ultimate');timers.shift()();check(professor.state.battle.statuses.enemy.some(s=>s.id==='blind'),'Maré Umbral inflicts blindness');
console.log(`${checks} baseline checks passed: navigable maps, collision, quest sequence, full chapter, combat, inventory, save/resume, defeat and respawn.`);
