import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-art-load-v38-'));
compileGameModules(out,['data','variantsV36','enemyArtV30']);
const load=id=>import(pathToFileURL(join(out,id+'.js')).href);
const data=await load('data'),variants=await load('variantsV36'),enemy=await load('enemyArtV30');
const file=ts.createSourceFile('battle-scene.tsx',readFileSync('components/battle-scene.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const variableNames=new Set(['artCache','settledArtUrls','activeArtScopes','artLoadQueue','activeArtLoads']);
const functionNames=new Set(['pumpBattleArtV38','battleArtKeysV32','preloadBattleArt']);
const kernel=file.statements.filter(node=>ts.isVariableStatement(node)&&node.declarationList.declarations.some(item=>variableNames.has(item.name.getText(file)))||ts.isFunctionDeclaration(node)&&functionNames.has(node.name?.text)).map(node=>node.getText(file)).join('\n').replace(/export /g,'');
const code=ts.transpileModule(kernel,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
let clock=0,sequence=0,peak=0,checks=0;
const timers=new Map(),pending=new Set(),requests=[],cancelled=[];
const ok=(value,message)=>{checks++;assert.ok(value,message);};
const eq=(a,b,message)=>{checks++;assert.deepEqual(a,b,message);};
class ImageProbe{
 set src(src){this.value=src;requests.push({src,at:clock});pending.add(this);peak=Math.max(peak,pending.size);}
 removeAttribute(name){if(name==='src'){cancelled.push(this.value);pending.delete(this);this.value='';}}
}
const setTimer=(callback,ms)=>{const id=++sequence;timers.set(id,{callback,at:clock+ms,ms});return id;};
const clearTimer=id=>timers.delete(id);
const bind=new Function('heroArtIdV36','variantByIdV36','ASSETS','ENEMY_PRESENTATION_V30','enemyBattleKey','ENEMY_ULTIMATES','combatImpact','battleBackground','Image','setTimeout','clearTimeout',`${code};return {battleArtKeysV32,preloadBattleArt,artCache,activeArtScopes};`);
const loader=bind(variants.heroArtIdV36,variants.variantByIdV36,data.ASSETS,enemy.ENEMY_PRESENTATION_V30,enemy.enemyBattleKey,data.ENEMY_ULTIMATES,data.combatImpact,data.battleBackground,ImageProbe,setTimer,clearTimer);
const party=['seiji','ophelia','marin','gabriel','abel'],scope={family:'cinder',asset:'cinder',boss:true,phase:1,map:'ashpyre'};
const keys=loader.battleArtKeysV32(party,undefined,scope);
ok(keys.includes('battle_gabriel_attack'),'human Gabriel has his actual body');
ok(!keys.some(key=>key.startsWith('battle_gabriel_lycan_')||key==='battle_fx_gabriel_lycan'),'human Gabriel does not request the unused Lycan kit');
const lycan=loader.battleArtKeysV32(['gabriel_lycan'],undefined,scope);
ok(lycan.includes('battle_gabriel_lycan_attack')&&!lycan.includes('battle_gabriel_attack'),'the real Lycan form still has its own kit');
const sourceCount=new Set(keys.map(key=>data.ASSETS[key])).size;
const a=loader.preloadBattleArt(party,undefined,scope),cinema=loader.preloadBattleArt(party,undefined,scope);
eq(pending.size,6,'stage and cinema share a six-request queue');
eq(requests.length,6,'queued images do not start network work yet');
eq(timers.size,6,'queued images do not consume their15-second timeout while waiting');
async function finishWave(){
 clock+=4000;
 const images=[...pending];
 for(const image of images){pending.delete(image);image.onload?.();}
 await Promise.resolve();await Promise.resolve();
 ok(pending.size<=6,'each completed wave starts at most six new images');
 for(const timer of timers.values())eq(timer.ms,15000,'each started image keeps the original15-second deadline');
}
while(pending.size)await finishWave();
const art=await a,cinemaArt=await cinema;
ok(clock>15000,'a complete cold scope may legitimately take longer than15seconds in total');
ok(keys.every(key=>art[key]&&cinemaArt[key]),'every required actual key is ready for both consumers');
eq(requests.length,sourceCount,'concurrent stage/cinema calls request each URL exactly once');
eq(peak,6,'network/decode concurrency never exceeds six');
eq(timers.size,0,'success clears every timeout');
eq(loader.activeArtScopes.size,0,'finished scopes do not retain pending pins');
const firstBody=art.battle_seiji_attack,previousCount=requests.length;
await loader.preloadBattleArt(party,undefined,scope);
eq(requests.length,previousCount,'same-scope retry/cinema uses ready native images');

// Change the scope while a second scope is still waiting: no in-flight source is evicted.
const otherScope=loader.preloadBattleArt(['max'],undefined,scope),sameScope=loader.preloadBattleArt(['max'],undefined,scope);
const maxSource=data.ASSETS.battle_max_attack;
eq(requests.filter(item=>item.src===maxSource).length,1,'pending alternative party requests are shared');
while(pending.size)await finishWave();
const maxArt=await otherScope;await sameScope;
ok(!!maxArt.battle_max_attack,'new party has its complete native body');
ok(!loader.artCache.has(data.ASSETS.battle_seiji_attack),'ready URLs outside the current scope are released');
ok(firstBody===art.battle_seiji_attack,'eviction does not invalidate an already running painter dictionary');
const maxLoadedRequests=requests.length;
await loader.preloadBattleArt(['max'],undefined,scope);
eq(requests.length,maxLoadedRequests,'the current scope remains retained after concurrent completion');

const pendingA=loader.preloadBattleArt(['ava'],undefined,scope),pendingB=loader.preloadBattleArt(['orfeu'],undefined,scope);
await finishWave();
const avaArt=await pendingA;
ok(pending.size>0,'a different concurrent scope remains loading after the first scope is ready');
ok(loader.artCache.has(data.ASSETS.battle_orfeu_cast),'a ready first scope does not evict the second scope sources');
while(pending.size)await finishWave();
ok(!!(await pendingB).battle_orfeu_cast,'the other in-flight scope completes normally');
ok(avaArt.battle_ava_attack&&!loader.artCache.has(data.ASSETS.battle_ava_attack),'old painter keeps its dictionary after the latest scope retires its URL');

// A stalled new body is cancelled at its own deadline, releases the queue and can be retried.
const stalled=loader.preloadBattleArt(['beatriz']);
ok(pending.size>0,'uncached selected kit starts bounded work');
clock+=15000;
for(const [id,timer]of [...timers])if(timer.at<=clock){timers.delete(id);timer.callback();}
const failed=await stalled;
ok(!failed.battle_beatriz_attack,'timed-out art is never reported ready');
eq(pending.size,0,'failed sources are removed from native image requests');
ok(cancelled.includes(data.ASSETS.battle_beatriz_attack),'stalled native source is cancelled');
ok(!loader.artCache.has(data.ASSETS.battle_beatriz_attack),'retry cannot inherit a failed cached promise');
const retry=loader.preloadBattleArt(['beatriz']);while(pending.size)await finishWave();
ok(!!(await retry).battle_beatriz_attack,'retry loads the same actual kit successfully');
eq(loader.activeArtScopes.size,0,'failed and retried scopes release their pins');

console.log(`battle-art-loading-v38: ${checks} checks passed; actual scoped keys, six concurrent native requests,15-second per-image deadline, stage/cinema deduplication, scope retention and timeout/retry.`);
