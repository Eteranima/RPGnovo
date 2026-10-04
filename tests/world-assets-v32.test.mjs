import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, statSync, writeFileSync, mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-world-assets-v32-'));
compileGameModules(out,['worldAssetsV32','renderer']);
const imported=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {ASSETS,MAPS,PLAYABLE_HERO_IDS}=await imported('data');
const {ENVIRONMENT_ASSETS,ENVIRONMENT_THEMES,FLOOR_ROWS,environmentScenery,environmentObject}=await imported('environment');
const {emptyWorldAssetPlanV32,worldAssetPlanV32,WorldAssetSessionV32}=await imported('worldAssetsV32');
const {WorldRenderer}=await imported('renderer');
const {GameEngine}=await imported('engine');
let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const tick=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};

function imageHarness(){
 const requests=[];
 const createImage=()=>{
  const image={width:1536,height:1024,onload:null,onerror:null,decode:()=>Promise.resolve(),_src:'',done:false};
  Object.defineProperty(image,'src',{get:()=>image._src,set:src=>{
   image._src=src;requests.push(image);
   if(src.startsWith('/assets/')){const bytes=readFileSync(`public${src}`);if(bytes.subarray(1,4).toString()==='PNG'){image.width=bytes.readUInt32BE(16);image.height=bytes.readUInt32BE(20);}}
  }});
  image.finish=(success=true)=>{image.done=true;(success?image.onload:image.onerror)?.();};
  return image;
 };
 const finish=async()=>{for(const image of requests.filter(image=>!image.done))image.finish();await tick();};
 const settle=async promise=>{
  let done=false,value;promise.then(result=>{done=true;value=result;});
  for(let turn=0;!done&&turn<200;turn++)await finish();
  check(done,'Image batch settles without an uncontrolled background preload');return value;
 };
 return {requests,createImage,finish,settle};
}
const plan=(id,entries)=>({map:id,name:MAPS[id].name,entries,signature:`${id}:${JSON.stringify(entries)}`,groundSignature:id});
const pngImage=src=>{const bytes=readFileSync(`public${src}`);return {width:bytes.subarray(1,4).toString()==='PNG'?bytes.readUInt32BE(16):1536,height:bytes.subarray(1,4).toString()==='PNG'?bytes.readUInt32BE(20):1024,src};};

// Every painted consumer has a final source. The test samples actual painter requests, not merely prefixes.
const drawCalls=[];
const context=new Proxy({drawImage:(...args)=>drawCalls.push(args),measureText:text=>({width:text.length*8}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get:(target,key)=>key in target?target[key]:()=>{}});
const canvas=()=>({width:1,height:1,dataset:{},getContext:()=>context,getBoundingClientRect:()=>({width:1310,height:572,left:0,top:0})});
global.document={createElement:()=>canvas()};
global.devicePixelRatio=1;
global.ResizeObserver=class{observe(){}disconnect(){}};
let scheduled=0;
global.requestAnimationFrame=()=>++scheduled;
global.cancelAnimationFrame=()=>{};
global.localStorage={getItem:()=>null,setItem(){}};

const baselineEntries=Object.fromEntries(Object.entries({...ASSETS,...ENVIRONMENT_ASSETS}).filter(([key])=>!['battle_','ultimate_','skill_icon','portrait_','face_'].some(prefix=>key.startsWith(prefix))));
const bytesCache=new Map();
const sourceSize=src=>{if(!bytesCache.has(src))bytesCache.set(src,statSync(`public${src}`).size);return bytesCache.get(src);};
const sourceBytes=entries=>[...new Set(Object.values(entries))].reduce((sum,src)=>sum+sourceSize(src),0);
const baselineURLs=new Set(Object.values(baselineEntries)).size;
const baselineBytes=sourceBytes(baselineEntries);
const mapMeasures=[];
for(const map of Object.values(MAPS)){
 const scoped=worldAssetPlanV32(map,['seiji','ophelia']);
 const keys=Object.keys(scoped.entries),urls=new Set(Object.values(scoped.entries));
 check(urls.size<baselineURLs/2,`${map.id} only requests the current map and party`);
 check(sourceBytes(scoped.entries)<baselineBytes*.3,`${map.id} removes at least 70% of the old cold world bytes for a two-hero party`);
 check(keys.every(key=>!key.startsWith('dlg_')&&!key.startsWith('battle_')&&!key.startsWith('ultimate_')&&!key.startsWith('portrait_')&&!key.startsWith('skill_')&&!['companions','companions_combat','terrain','props','academy','harbor_floor'].includes(key)),`${map.id} excludes dialogue, combat, companion and superseded scenery sources`);
 for(const [key,src] of Object.entries(scoped.entries))check(statSync(`public${src}`).isFile(),`${map.id}/${key} has its final runtime image`);
 const images=Object.fromEntries(Object.entries(scoped.entries).map(([key,src])=>[key,pngImage(src)]));
 const painter=Object.create(WorldRenderer.prototype);Object.assign(painter,{ctx:context,images,patterns:{},groundCache:new Map(),groundArtSignature:scoped.groundSignature,frame:100,engine:{state:{mode:'world',stage:0,opened:[]},paused:false,patrolTime:0}});
 painter.ground(map);
 map.props.forEach((prop,index)=>{const art=environmentScenery(map.id,prop,index)||environmentObject(prop.asset,prop.atlas,prop.atlasSheet);check(!!art&&!!images[art.sheet],`${map.id} resolves the consumed scenery crop without its original fallback sheet`);painter.scenery(map,prop,index);});
 for(const tile of new Set(map.rows.join(''))){const material=ENVIRONMENT_THEMES[map.id].floor[tile];check(!!images[material.sheet]&&FLOOR_ROWS[material.sheet][material.row+1]>FLOOR_ROWS[material.sheet][material.row],`${map.id}/${tile} loads its native floor row`);}
 for(const entity of map.entities){
  const before=drawCalls.length;painter.entity(entity);
  if(['npc','mob','boss','chest','shop','book','rune','sign','warp'].includes(entity.kind))check(drawCalls.length>before,`${map.id}/${entity.id} paints its actual final asset`);
 }
 for(const actor of ['seiji','ophelia']){const before=drawCalls.length;painter.actor(actor,280,350,2,true);check(drawCalls.length===before+1,`${map.id}/${actor} consumes its native walk sheet`);}
 mapMeasures.push({map:map.id,urls:urls.size,bytes:sourceBytes(scoped.entries)});
 for(let size=1;size<=5;size++){
  const actors=PLAYABLE_HERO_IDS.slice(0,size),partyPlan=worldAssetPlanV32(map,actors);
  const withParty=Object.create(WorldRenderer.prototype);Object.assign(withParty,{ctx:context,images:Object.fromEntries(Object.entries(partyPlan.entries).map(([key,src])=>[key,pngImage(src)])),frame:200});
  for(const actor of actors)for(let facing=0;facing<4;facing++){const before=drawCalls.length;withParty.actor(actor,280,350,facing,true);check(drawCalls.length===before+1,`${map.id} party ${size}: ${actor}/${facing} paints a loaded native frame`);}
 }
 const lycanPlan=worldAssetPlanV32(map,['gabriel_lycan']);check(!!lycanPlan.entries.gabriel_lycan,`${map.id} loads the selected Gabriel form`);
 const completeParty=worldAssetPlanV32(map,PLAYABLE_HERO_IDS),allActors=Object.create(WorldRenderer.prototype);Object.assign(allActors,{ctx:context,images:Object.fromEntries(Object.entries(completeParty.entries).map(([key,src])=>[key,pngImage(src)])),frame:400});
 for(const actor of PLAYABLE_HERO_IDS)for(let facing=0;facing<4;facing++){const before=drawCalls.length;allActors.actor(actor,280,350,facing,true);check(drawCalls.length===before+1,`${map.id}: every recruit ${actor}/${facing} is ready for a party change`);}
}
equal(Object.keys(MAPS).length,12,'All twelve existing maps are covered');
equal(Object.keys(emptyWorldAssetPlanV32().entries),[],'Title/selection plan has no hidden world download');
const abel=worldAssetPlanV32(MAPS.ashpyre,[]),orfeu=worldAssetPlanV32(MAPS.arquivo,[]);
for(const [id,scoped] of [['abel',abel],['orfeu',orfeu]]){
 for(const direction of ['south','west','east','north'])check(!!scoped.entries[`walk_${id}_${direction}`],`${id} NPC includes every native direction`);
 check(!(id in scoped.entries),`${id} alias is not a duplicate source request`);
}
const enemyAliases=worldAssetPlanV32(MAPS.ashwood,[]);
check(enemyAliases.entries.ashwolf===enemyAliases.entries.moth,'Legacy enemy aliases share one URL');
const dynamicSign={id:'v31:test:site',label:'Vestígio',kind:'sign',x:5,y:5,asset:'quest_short'};
check(worldAssetPlanV32(MAPS.patio,[],[dynamicSign]).entries.quest_short===ASSETS.quest_short,'Dynamic quest sites load their own final emblem');
const bridgeEngine=new GameEngine();bridgeEngine.state.map='patio';bridgeEngine.state.progress.fieldUntil['ice-bridge']=Date.now()+1000;const bridge=bridgeEngine.map;
check(!!worldAssetPlanV32(bridge,[]).entries.env_floor_water,'A field bridge retains its generated ice row');
const broken={...MAPS.patio,props:[{asset:'missing-v32',x:2,y:2,w:1,h:1}]};
assert.throws(()=>worldAssetPlanV32(broken,[]),/não registrada/);checks++;

// Cache is keyed by URL. Aliases are separate draw keys referencing the same decoded image.
{
 const h=imageHarness(),commits=[],statuses=[],session=new WorldAssetSessionV32({createImage:h.createImage,onCommit:(images,plan)=>commits.push({images,plan}),onStatus:status=>statuses.push(status)});
 check(await session.load(emptyWorldAssetPlanV32()),'Initial title readiness resolves');
 equal(h.requests.length,0,'No title image request is created');
 const aliases=plan('patio',{a:'/same',b:'/same',c:'/other'});
 check(await h.settle(session.load(aliases)),'First complete map commits');
 equal(h.requests.length,2,'Duplicate URLs have exactly one network/decode request');
 check(session.images.a===session.images.b,'Both aliases receive the same decoded image');
 check(await session.load(aliases),'Repeated ready plan resolves immediately');equal(h.requests.length,2,'Ready plan causes no fetch');
 check(await h.settle(session.load(plan('porto',{a:'/same',b:'/next'}))),'Next map completes');
 equal(h.requests.filter(image=>image.src==='/same').length,1,'Map transitions reuse a retained native source');
 check(statuses.every(status=>status.progress>=0&&status.progress<=1),'Reported progress stays in the range 0–1');
 session.dispose();
}

// A slow obsolete map cannot publish or replace a later map. Shared in-flight URLs remain singleflight.
{
 const h=imageHarness(),commits=[],statuses=[],session=new WorldAssetSessionV32({createImage:h.createImage,onCommit:(images,plan)=>commits.push(plan.map),onStatus:status=>statuses.push(status)});
 const old=session.load(plan('patio',{a:'/shared',b:'/old'}));
 const current=session.load(plan('porto',{a:'/shared',b:'/new'}));
 const index=statuses.length;
 h.requests.find(image=>image.src==='/new').finish();h.requests.find(image=>image.src==='/shared').finish();await tick();
 check(await current,'Current map becomes ready');
 h.requests.find(image=>image.src==='/old').finish();await tick();
 equal(await old,false,'Obsolete map completion does not become ready');
 equal(commits,['porto'],'Only the most recent map commits');
 check(statuses.slice(index).every(status=>status.map==='porto'),'Obsolete progress never overwrites current loading status');
 equal(h.requests.filter(image=>image.src==='/shared').length,1,'Concurrent generations share a single source request');
 session.dispose();
}

// A failed batch does not leak partial images or repeatedly retry; explicit retry reuses successful sources.
{
 const h=imageHarness(),session=new WorldAssetSessionV32({createImage:h.createImage});
 await h.settle(session.load(plan('patio',{a:'/native'})));const previous=session.images;
 const wanted=plan('porto',{a:'/native',b:'/good',c:'/bad'}),pending=session.load(wanted);
 h.requests.find(image=>image.src==='/good').finish();await tick();
 h.requests.find(image=>image.src==='/bad').finish(false);await tick();
 equal(await pending,false,'Failed image stops readiness');check(session.images===previous,'A failed map retains the last fully native image set');
 check(!session.getStatus().ready&&!session.getStatus().loading&&session.getStatus().error?.includes(MAPS.porto.name),'Failure is explicit, tied to the correct map, and exposes retry');
 equal(await session.load(wanted),false,'Failure does not automatically retry in the render loop');
 const retry=session.load(wanted,true);await tick();
 equal(h.requests.filter(image=>image.src==='/native').length,1,'Retry retains previously committed native source');
 equal(h.requests.filter(image=>image.src==='/good').length,1,'Retry reuses a successful partial source');
 equal(h.requests.filter(image=>image.src==='/bad').length,2,'Only the failed source needs another request');
 h.requests.filter(image=>image.src==='/bad').at(-1).finish();await tick();
 check(await retry&&session.images!==previous,'Explicit retry commits only when all final images are ready');
 session.dispose();
}

// Bounded concurrent requests, inactive cache, disposal and decode errors are observable lifecycle contracts.
{
 const h=imageHarness(),session=new WorldAssetSessionV32({createImage:h.createImage,concurrency:2,retainInactive:1});
 const pending=session.load(plan('patio',Object.fromEntries(Array.from({length:8},(_,i)=>[`a${i}`,`/batch-${i}`]))));
 equal(h.requests.length,2,'Only two image requests start under a concurrency limit of two');
 check(await h.settle(pending),'Queued native sources all complete');
 await h.settle(session.load(plan('porto',{a:'/next-map'})));
 await h.settle(session.load(plan('arquivo',{a:'/batch-0'})));
 equal(h.requests.filter(image=>image.src==='/batch-0').length,2,'Inactive URL cache evicts older unused sources instead of retaining the entire world');
 session.dispose();
}
{
 const h=imageHarness(),events=[],session=new WorldAssetSessionV32({createImage:h.createImage,onStatus:status=>events.push(status),onCommit:()=>events.push('commit')});
 const pending=session.load(plan('patio',{a:'/dispose',b:'/dispose-2'})),before=events.length;
 session.dispose();for(const image of h.requests)image.finish();await tick();
 equal(await pending,false,'Disposed pending work resolves safely without readiness');equal(events.length,before,'Disposal prevents all subsequent progress and commits');
 equal(await session.load(plan('porto',{a:'/ignored'})),false,'A disposed session cannot start another map');
 equal(h.requests.length,2,'No source is requested after disposal');
}
{
 const h=imageHarness(),session=new WorldAssetSessionV32({createImage:h.createImage});
 const pending=session.load(plan('patio',{a:'/decode'}));h.requests[0].decode=()=>Promise.reject(new Error('bad decode'));h.requests[0].finish();await tick();
 equal(await pending,false,'Undecodable art fails before atomic commit');check(!!session.getStatus().error,'Decode failure exposes a clear error');session.dispose();
}
{
 const h=imageHarness(),session=new WorldAssetSessionV32({createImage:h.createImage,timeoutMs:1});
 equal(await session.load(plan('patio',{a:'/timeout'})),false,'A source that never completes has an explicit bounded timeout');
 check(!!session.getStatus().error&&!session.getStatus().loading,'Timeout exposes retry instead of a silent placeholder');session.dispose();
}
{
 const h=imageHarness(),session=new WorldAssetSessionV32({createImage:h.createImage,concurrency:1});
 const first=session.load(plan('patio',{a:'/old-first',b:'/old-second'}));
 const second=session.load(plan('arquivo',{a:'/queued-stale'}));
 const third=session.load(plan('porto',{a:'/latest'}));
 h.requests[0].finish();await tick();
 check(!h.requests.some(image=>image.src==='/queued-stale'||image.src==='/old-second'),'Obsolete queued sources never download behind the current map');
 await h.settle(third);equal(await first,false,'First obsolete generation closes safely');equal(await second,false,'Queued obsolete generation closes safely');session.dispose();
}

// Renderer holds native canvas and freezes only its own updates during transitions; menu pause remains intact.
{
 const h=imageHarness(),engine=new GameEngine(),status=[],renderer=new WorldRenderer(canvas(),engine,{createImage:h.createImage,onLoadingChange:s=>status.push(s)});
 check(await renderer.load(),'Renderer initial start resolves');equal(h.requests.length,0,'Renderer start loads no world images');
 engine.state.mode='world';engine.emit();equal(renderer.ready,false,'World entry closes readiness synchronously');
 const clock=engine.now,paintCount=drawCalls.length;renderer.draw();equal(engine.now,clock,'Pending final map prevents engine updates');equal(drawCalls.length,paintCount,'Pending final map keeps the previous canvas unchanged');
 check(await h.settle(renderer.load()),'Actual current world map becomes ready');
 renderer.lastPaint=0;renderer.draw();check(drawCalls.length>paintCount,'Ready native map paints its complete scenery');
 engine.paused=true;engine.state.map='porto';engine.emit();check(!renderer.ready&&engine.paused,'Pending transition preserves menu pause');
 const pausedClock=engine.now,previousPaint=drawCalls.length;renderer.draw();equal(engine.now,pausedClock,'Paused pending map does not advance timers');equal(drawCalls.length,previousPaint,'Map transition does not clear the native frame');
 await h.settle(renderer.load());check(engine.paused,'Successful map load leaves menu pause unchanged');
 renderer.lastPaint=0;renderer.draw();
 engine.paused=false;engine.state.map='domo';engine.emit();const failedBatch=renderer.load(),previousFrame=drawCalls.length;
 h.requests.filter(image=>!image.done).forEach(image=>image.finish(image.src!==ASSETS.ava));await tick();equal(await failedBatch,false,'Renderer exposes a failed final world image');
 const failureClock=engine.now;renderer.draw();equal(drawCalls.length,previousFrame,'Failed final art retains the last native canvas');equal(engine.now,failureClock,'Failure suspends engine updates until explicit retry');check(!engine.paused,'Failure never writes the gameplay/menu pause flag');
 await h.settle(renderer.retryLoading());check(renderer.ready&&!engine.paused,'Explicit renderer retry resumes native readiness without changing pause');
 const priorGround=renderer.ground(MAPS.porto);renderer.groundArtSignature+=':changed';check(renderer.ground(MAPS.porto)!==priorGround,'Changed source signature invalidates map-ground cache');
 const subscribed=[],unsubscribe=renderer.subscribeLoading(s=>subscribed.push(s));check(subscribed[0].ready,'Status subscription immediately receives current readiness');unsubscribe();
 const framesBefore=scheduled;renderer.destroy();renderer.draw();equal(scheduled,framesBefore,'Destroyed renderer schedules no new animation frame');
 equal(engine.listeners.size,0,'Renderer disposal removes the engine subscription');
}

// A real resumed save loads its current map, never the hidden title's initial courtyard.
{
 const h=imageHarness(),engine=new GameEngine();engine.state.mode='start';engine.saved={...structuredClone(engine.state),map:'porto',position:{x:4,y:5}};
 const renderer=new WorldRenderer(canvas(),engine,{createImage:h.createImage});await renderer.load();engine.start(true);
 equal(renderer.getLoadingState().map,'porto','Continue uses the actual saved map');
 check(!h.requests.some(image=>image.src===ENVIRONMENT_ASSETS.env_architecture),'Continue does not preload courtyard-only scenery');
 await h.settle(renderer.load());renderer.destroy();
}

const report={checks,baseline:{keys:Object.keys(baselineEntries).length,urls:baselineURLs,bytes:baselineBytes},title:{urls:0,bytes:0},party:['seiji','ophelia'],maps:mapMeasures};
function parties(size,start=0,chosen=[]){if(chosen.length===size)return [chosen];return PLAYABLE_HERO_IDS.slice(start).flatMap((id,index)=>parties(size,start+index+1,[...chosen,id]));}
report.partySizeBounds=Array.from({length:5},(_,index)=>{
 const size=index+1,measurements=Object.values(MAPS).flatMap(map=>parties(size).map(actors=>{const scoped=worldAssetPlanV32(map,actors);return {map:map.id,actors,urls:new Set(Object.values(scoped.entries)).size,bytes:sourceBytes(scoped.entries)};}));
 const largest=measurements.reduce((a,b)=>a.bytes>=b.bytes?a:b);
 return {size,plans:measurements.length,minURLs:Math.min(...measurements.map(m=>m.urls)),maxURLs:Math.max(...measurements.map(m=>m.urls)),minBytes:Math.min(...measurements.map(m=>m.bytes)),maxBytes:largest.bytes,largest};
});
mkdirSync('docs/qa-v32',{recursive:true});writeFileSync('docs/qa-v32/world-assets-measurements.json',JSON.stringify(report,null,2)+'\n');
console.log(`World assets v32 PASS: ${checks} checks; title 0 URLs; previous ${baselineURLs} URLs / ${(baselineBytes/1048576).toFixed(2)} MiB; 12 maps with two heroes ${Math.min(...mapMeasures.map(m=>m.urls))}–${Math.max(...mapMeasures.map(m=>m.urls))} URLs / ${(Math.min(...mapMeasures.map(m=>m.bytes))/1048576).toFixed(2)}–${(Math.max(...mapMeasures.map(m=>m.bytes))/1048576).toFixed(2)} MiB; atomic ready/decode, URL singleflight, cache bounds, race, failure/retry, disposal and menu pause verified.`);
