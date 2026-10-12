import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-auto-update-'));
compileGameModules(out,['engine','ui-update','ui-session','ui-controls','music']);
writeFileSync(join(out,'auto-update.js'),ts.transpileModule(readFileSync('lib/pwa/auto-update.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine'),{canApplyGameUpdate,prepareGameUpdate,verifyGameUpdate}=await load('ui-update'),{synchronizeGamePause}=await load('ui-session'),{createGameKeyboardControls,createGamePointerControls}=await load('ui-controls'),{createAutoUpdateCoordinator}=await load('auto-update');
const {SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY}=await load('music');
let checks=0;const ok=(value,message)=>{assert.ok(value,message);checks++;},eq=(value,expected,message)=>{assert.deepEqual(value,expected,message);checks++;};
const store=new Map();let failWrite=false,failRead=false,discardWrite=false;
globalThis.localStorage={getItem:key=>{if(failRead)throw Error('read denied');return store.get(key)??null;},setItem:(key,value)=>{if(failWrite)throw Error('quota');if(!discardWrite)store.set(key,value);}};
const realTimeout=globalThis.setTimeout;globalThis.setTimeout=()=>1;
function fixture(){
 store.clear();failWrite=false;failRead=false;discardWrite=false;
 const engine=new GameEngine();engine.sound=false;engine.start(false,'seiji');engine.finishCutscene();engine.save(true);
 const ui={panel:null,opening:false,confirmReset:false,updating:false},f={engine,ui,loading:null,online:true,visible:true,time:0,tabs:1,waiting:{state:'installed'},stats:{status:0,save:0,verify:0,activate:0,reload:0,locks:[],notices:[]}};
 const guard={canApply:()=>canApplyGameUpdate(engine,ui,f.loading),prepare:()=>{f.stats.save++;return prepareGameUpdate(engine,ui,f.loading);},verify:()=>{f.stats.verify++;return verifyGameUpdate(engine,ui,f.loading);},setPending:pending=>{f.stats.locks.push(pending);ui.updating=pending;synchronizeGamePause(engine,ui);}};
 f.guard=guard;
 f.coordinator=createAutoUpdateCoordinator({waiting:()=>f.waiting,guard:()=>f.guard,available:()=>f.online&&f.visible,now:()=>f.time,status:async worker=>{f.stats.status++;await f.onStatus?.(worker,f.stats.status);return {gameTabs:f.tabs};},activate:async worker=>{f.stats.activate++;f.rawAtActivation=store.get(SAVE_KEY);if(f.onActivate)await f.onActivate(worker);else{worker.state='activated';f.waiting=null;}},reload:()=>{f.stats.reload++;f.rawAtReload=store.get(SAVE_KEY);f.onReload?.();},notify:state=>f.stats.notices.push(state)});
 return f;
}

{
 const f=fixture();f.engine.state.credits+=23;const party=structuredClone(f.engine.state.heroes);store.set(SOUND_ENABLED_KEY,'false');store.set(MUSIC_VOLUME_KEY,'.27');
 f.engine.keys.add('w');f.onStatus=()=>{ok(f.ui.updating&&f.engine.paused&&!f.engine.keys.size,'automatic handshake holds the real game/input lock before async checks');};
 await f.coordinator.attempt();eq(f.stats.reload,1,'automatic request promotes without visiting Sistema or requesting manual confirmation');eq(f.stats.save,1,'one checkpoint save precedes activation');eq(f.stats.activate,1,'one activation is requested');eq(f.stats.status,2,'tabs checked before promotion and after activation');eq(f.rawAtActivation,f.rawAtReload,'same durable bytes survive promotion');eq(parseSave(f.rawAtReload).credits,f.engine.state.credits,'latest unsaved gold was durably captured');
 const resumed=new GameEngine();resumed.hydrate();resumed.start(true);eq(resumed.state.heroes,party,'actual engine resumes the same party and vitals');eq(resumed.state.credits,f.engine.state.credits,'actual engine resumes the saved gold');eq(store.get(SOUND_ENABLED_KEY),'false','persistent mute untouched');eq(store.get(MUSIC_VOLUME_KEY),'.27','volume untouched');
 for(let count=0;count<20;count++)await f.coordinator.attempt();eq([f.stats.save,f.stats.activate,f.stats.reload],[1,1,1],'successful promotion cannot enter a save/activation/reload loop');
}
for(const [name,block]of [
 ['battle',f=>f.engine.state.mode='battle'],['dialogue',f=>f.engine.state.mode='dialogue'],['cutscene',f=>f.engine.state.mode='cutscene'],['quest replay',f=>f.engine.state.questCinematic={replay:true}],['opening',f=>f.ui.opening=true],['reset confirmation',f=>f.ui.confirmReset=true],['gacha transaction',f=>f.engine.state.gachaBusy=true],['summon transaction',f=>f.engine.state.summonBusy=true],['event activity',f=>f.engine.state.eventActivityV38={token:1}],['save conflict',f=>f.engine.state.saveConflictV36=true],['world loading',f=>f.loading={loading:true}],['world load error',f=>f.loading={loading:false,error:Error('art')}],['offline',f=>f.online=false],['background',f=>f.visible=false],
]){
 const f=fixture(),before=store.get(SAVE_KEY);block(f);await f.coordinator.attempt();eq([f.stats.status,f.stats.save,f.stats.activate,f.stats.reload],[0,0,0,0],name+' defers before any save/activation');eq(store.get(SAVE_KEY),before,name+' preserves exact durable save');eq(f.stats.locks,[],name+' never freezes a scene while waiting');
}
{
 const f=fixture();f.engine.state.mode='dialogue';await f.coordinator.attempt();f.engine.state.mode='world';await f.coordinator.attempt();eq(f.stats.reload,1,'safe gate transition retries immediately without a click or visibility change');
}
{
 const f=fixture(),before=store.get(SAVE_KEY);f.engine.state.credits+=17;failWrite=true;await f.coordinator.attempt();eq([f.stats.activate,f.stats.reload],[0,0],'quota/save failure cannot activate or reload');eq(store.get(SAVE_KEY),before,'failed write leaves previous campaign intact');ok(!f.ui.updating&&!f.engine.paused,'failed write releases UI and movement lock');
 await f.coordinator.attempt();eq(f.stats.save,1,'retry backoff prevents repeated saves on every game render');failWrite=false;f.time=30001;await f.coordinator.attempt();eq(f.stats.reload,1,'storage recovery promotes automatically after backoff');eq(parseSave(store.get(SAVE_KEY)).credits,f.engine.state.credits,'recovered update persists the latest campaign');
}
{
 const f=fixture(),before=store.get(SAVE_KEY);f.engine.state.credits++;discardWrite=true;await f.coordinator.attempt();eq([f.stats.activate,f.stats.reload],[0,0],'a discarded write cannot masquerade as a durable checkpoint');eq(store.get(SAVE_KEY),before,'readback failure preserves prior save');ok(f.engine.state.saveConflictV36,'readback mismatch invokes the existing conflict protection');
}
{
 const f=fixture();failRead=true;await f.coordinator.attempt();eq([f.stats.activate,f.stats.reload],[0,0],'storage read failure refuses automatic promotion');ok(!f.ui.updating,'read failure releases UI lock');
}
{
 const f=fixture(),before=store.get(SAVE_KEY);f.tabs=2;await f.coordinator.attempt();eq([f.stats.save,f.stats.activate,f.stats.reload],[0,0,0],'another tab defers before writing any save');eq(store.get(SAVE_KEY),before,'multiple tabs preserve storage byte for byte');ok(!f.ui.updating,'multi-tab deferral leaves game usable');f.tabs=1;f.time=30001;await f.coordinator.attempt();eq(f.stats.reload,1,'closing another tab permits an automatic retry');
}
{
 const f=fixture();f.onStatus=()=>{f.engine.state.mode='dialogue';};await f.coordinator.attempt();eq([f.stats.save,f.stats.activate,f.stats.reload],[0,0,0],'scene starting during STATUS is revalidated before saving');ok(!f.ui.updating,'late scene race releases lock');
}
{
 const f=fixture(),replacement={state:'installed'};f.onStatus=()=>{f.waiting=replacement;};await f.coordinator.attempt();eq([f.stats.activate,f.stats.reload],[0,0],'replaced worker is never promoted with the previous handshake');ok(!f.ui.updating,'worker replacement releases the lock');
}
{
 const f=fixture();let resolveStatus;f.onStatus=()=>new Promise(resolve=>resolveStatus=resolve);const first=f.coordinator.attempt();await f.coordinator.attempt(true);eq(f.stats.status,1,'manual and automatic requests share one promotion owner');eq(f.stats.save,0,'duplicate request cannot save before outstanding STATUS');f.onStatus=null;resolveStatus();await first;eq([f.stats.save,f.stats.activate,f.stats.reload],[1,1,1],'concurrent requests resolve to exactly one promotion');
}
{
 const f=fixture(),latest=JSON.stringify({...parseSave(store.get(SAVE_KEY)),credits:777});f.onActivate=worker=>{worker.state='activated';f.waiting=null;store.set(SAVE_KEY,latest);};await f.coordinator.attempt();eq(f.stats.activate,1,'fixture really activated before storage race');eq(f.stats.reload,0,'storage changed after activation aborts reload');eq(store.get(SAVE_KEY),latest,'newer external save cannot be overwritten');ok(f.engine.state.saveConflictV36&&!f.ui.updating,'conflict is visible and promotion lock is released');f.time=30001;await f.coordinator.attempt();eq(f.stats.save,1,'conflict prevents a silent second save even with an activated candidate');
}
{
 const f=fixture();f.onActivate=worker=>{worker.state='activated';f.waiting=null;f.tabs=2;};await f.coordinator.attempt();eq(f.stats.reload,0,'a tab opened during activation is checked again before reload');ok(!f.ui.updating,'late multi-tab race releases lock');f.onActivate=null;f.tabs=1;f.time=30001;await f.coordinator.attempt();eq(f.stats.reload,1,'already activated candidate remains recoverable after other tab closes');
}
{
 const f=fixture();f.onActivate=worker=>{worker.state='activated';f.waiting=null;f.engine.state.mode='cutscene';};await f.coordinator.attempt();eq(f.stats.reload,0,'scene starting during activation prevents reload');ok(!f.ui.updating,'late scene deferral releases lock');f.onActivate=null;f.engine.state.mode='world';f.time=30001;await f.coordinator.attempt();eq(f.stats.reload,1,'activated worker outside registration.waiting finishes at the next safe checkpoint');
}
for(const name of ['timeout','redundant']){
 const f=fixture();f.onActivate=worker=>{if(name==='redundant')worker.state='redundant';throw Error(name);};await f.coordinator.attempt();eq(f.stats.reload,0,name+' does not reload');ok(!f.ui.updating&&!f.engine.paused,name+' releases the lock');
}
{
 const f=fixture();f.onReload=()=>{throw Error('navigation refused');};await f.coordinator.attempt();eq(f.stats.reload,1,'fixture really reaches the saved reload path');ok(!f.ui.updating&&!f.engine.paused,'reload rejection releases game lock');await f.coordinator.attempt();eq(f.stats.reload,1,'failed navigation obeys retry backoff');f.onReload=null;f.time=30001;await f.coordinator.attempt();eq(f.stats.reload,2,'reload failure cannot permanently strand the already activated candidate');await f.coordinator.attempt();eq(f.stats.reload,2,'successful retry still prevents repeated reloads');
}
{
 const f=fixture();let resolve;f.onStatus=()=>new Promise(done=>resolve=done);const pending=f.coordinator.attempt();f.coordinator.dispose();resolve();await pending;eq([f.stats.activate,f.stats.reload],[0,0],'disposed page cannot activate or reload from a late callback');ok(!f.ui.updating,'disposed attempt releases its owned lock');
}
for(const ruleset of [39,40]){
 const f=fixture();ok(f.engine.startBloodMoonEventV36()&&f.engine.beginAutoChessV39(),'league update fixture starts a real Circuito');if(ruleset===39){f.engine.state.progress.autoChessV39.run={seed:41,pairingVersion:1,journal:[]};f.engine.save(true);}
 for(let index=0;index<3;index++)ok(f.engine.autoChessBuyV39(index),'league fixture buys actual opening offer');for(const [index,unit]of f.engine.autoChessV39().run.players[0].units.entries())ok(f.engine.autoChessMoveV39(unit.uid,56+index),'league fixture places owned units');ok(f.engine.autoChessResolveV39(),'league fixture resolves an actual round');
 const reviewRaw=store.get(SAVE_KEY);await f.coordinator.attempt();eq(f.stats.reload,0,'ruleset'+ruleset+' replay/review cannot be interrupted');eq(store.get(SAVE_KEY),reviewRaw,'review deferral preserves actual journal');ok(f.engine.autoChessContinueV39(),'league fixture returns to preparation');const before=structuredClone(f.engine.autoChessV39().run),ledger=structuredClone(f.engine.autoChessV39().rewardLedger);ok(canApplyGameUpdate(f.engine,f.ui),'preparation is a safe durable league checkpoint');await f.coordinator.attempt();eq(f.stats.reload,1,'ruleset'+ruleset+' preparation applies update automatically');
 const resumed=new GameEngine();resumed.hydrate();resumed.start(true);eq(resumed.autoChessV39().run,before,'ruleset'+ruleset+' journal resumes the exact round/HP/gold/units/shops');eq(resumed.autoChessV39().rewardLedger,ledger,'ruleset'+ruleset+' reload does not duplicate rewards');ok(resumed.beginAutoChessV39(),'resumed league opens through its normal public command');eq(resumed.autoChessV39().run,before,'retake never replaces the updated league');
}
{
 const f=fixture();f.ui.panel='menu';f.ui.updating=true;synchronizeGamePause(f.engine,f.ui);let commands=0;
 const controls=createGameKeyboardControls({engine:f.engine,panel:()=>f.ui.panel,opening:()=>false,suspended:()=>f.ui.updating,loaded:()=>true,titleArmed:()=>true,loading:()=>null,closePanel:()=>commands++,openMenu:()=>commands++,setTarget:()=>commands++,activateTitle:()=>commands++,toggleMusic:()=>commands++});for(const key of ['w','1','Enter','Escape'])controls.down({key,repeat:false,target:null,preventDefault(){}});
 const pointer=createGamePointerControls(f.engine,{blocked:()=>f.ui.updating,focus:()=>commands++,click:()=>commands++});pointer.canvasPointerUp({clientX:0,clientY:0,currentTarget:{getBoundingClientRect:()=>({left:0,top:0})}});eq(commands,0,'promotion lock blocks real keyboard/menu/party/movement/canvas handlers');
 const route=readFileSync('app/page.tsx','utf8'),session=readFileSync('hooks/use-game-session.ts','utf8');ok(route.includes('inert={ui.updating}'),'title, rewards and portal buttons are covered by root inert lock');ok(session.includes('bindUpdateGuard?.(')&&session.includes('retryUpdate?.()'),'permanent session binding retries at safe gate changes without mounting Sistema');
}
// Mount the real provider lifecycle with browser surfaces and a real game guard.
// No Settings/install control is mounted, so discovery/promotion must be global.
{
 const f=fixture(),require=createRequire(import.meta.url),descriptors=Object.fromEntries(['window','document','navigator'].map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)])),previousNodeEnv=process.env.NODE_ENV,previousNow=Date.now;
 const hooks=new Map(),effects=[],intervals=new Map();let hookIndex=0,clock=0,registered=0,checksForUpdate=0,reloaded=0,statusQueries=0,activated=0;
 const events=()=>({listeners:new Map(),addEventListener(name,fn){const entries=this.listeners.get(name)||[];entries.push(fn);this.listeners.set(name,entries);},removeEventListener(name,fn){this.listeners.set(name,(this.listeners.get(name)||[]).filter(entry=>entry!==fn));},emit(name){for(const fn of this.listeners.get(name)||[])fn();}});
 const registration={...events(),waiting:null,installing:null,active:{postMessage(){}},update:async()=>{checksForUpdate++;}},doc={...events(),visibilityState:'visible'},display={...events(),matches:false},win={...events(),isSecureContext:true,matchMedia:()=>display,setInterval:(fn,delay)=>{eq(delay,15000,'provider periodically checks progress, not only tab focus');intervals.set(1,fn);return 1;},clearInterval:id=>intervals.delete(id),location:{href:'https://eter.test/',origin:'https://eter.test',reload:()=>{reloaded++;}}},nav={onLine:true,userAgent:'QA',platform:'QA',maxTouchPoints:0,serviceWorker:{controller:{},register:async(path,options)=>{registered++;eq([path,options.scope,options.updateViaCache],['/sw.js','/','none'],'production registers the current SW outside the HTTP cache');return registration;},ready:Promise.resolve(registration)}};
 const react={createContext:()=>({Provider:'context'}),useContext:()=>null,useCallback:fn=>fn,useState:initial=>{const index=hookIndex++;if(!hooks.has(index))hooks.set(index,initial);return [hooks.get(index),value=>hooks.set(index,value)];},useRef:initial=>{const index=hookIndex++;if(!hooks.has(index))hooks.set(index,{current:initial});return hooks.get(index);},useEffect:fn=>effects.push(fn)};
 const client={isStandalone:()=>false,workerMessage:async()=>{statusQueries++;return {gameTabs:1};},activateSavedUpdate:async worker=>{activated++;worker.state='activated';registration.waiting=null;}};
 const exports={};new Function('require','exports',ts.transpileModule(readFileSync('components/pwa-provider.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText)(id=>id==='react'?react:id==='react/jsx-runtime'?require(id):id==='@/lib/pwa/client'?client:id==='@/lib/pwa/auto-update'?{createAutoUpdateCoordinator}:id.endsWith('.css')?{default:{updateNotice:'updateNotice'}}:(()=>{throw Error(id);})(),exports);
 let cleanup,unbind;try{
  for(const [key,value]of Object.entries({window:win,document:doc,navigator:nav}))Object.defineProperty(globalThis,key,{configurable:true,value});process.env.NODE_ENV='production';Date.now=()=>clock;
  const provider=exports.PwaProvider({children:'game'}),value=provider.props.value;cleanup=effects[0]();unbind=value.bindUpdateGuard(f.guard);for(let count=0;count<10;count++)await Promise.resolve();eq(registered,1,'real provider registration runs without Sistema');
  clock=59000;intervals.get(1)();eq(checksForUpdate,0,'discovery respects a bounded polling interval');clock=60001;intervals.get(1)();eq(checksForUpdate,1,'continuous visible gameplay checks for updates after sixty seconds');intervals.get(1)();eq(checksForUpdate,1,'repeated ticks do not flood registration.update');
  registration.waiting={state:'installed'};registration.emit('updatefound');for(let count=0;count<20;count++)await Promise.resolve();eq([f.stats.save,activated,reloaded],[1,1,1],'real provider promotes a discovered version through the game guard without Settings');eq(statusQueries,2,'provider promotion rechecks game windows after activation');
  clock=120002;intervals.get(1)();for(let count=0;count<5;count++)await Promise.resolve();eq(reloaded,1,'provider interval cannot cause a reload loop after promotion');unbind();cleanup();cleanup=null;eq(intervals.size,0,'provider disposes its periodic discovery timer');
 }finally{unbind?.();cleanup?.();Date.now=previousNow;if(previousNodeEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=previousNodeEnv;for(const [key,descriptor]of Object.entries(descriptors)){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
}
globalThis.setTimeout=realTimeout;
console.log(`PWA automatic update: PASS ${checks}`);
