import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const output=mkdtempSync(join(tmpdir(),'eter-ui-v36-')),compiled=new Set();
function compile(name){if(compiled.has(name))return;compiled.add(name);let source=readFileSync(`lib/game/${name}.ts`,'utf8');for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");writeFileSync(join(output,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);}
for(const name of ['engine','ui-session','ui-controls','ui-world','ui-audio','ui-fullscreen','ui-update','ui-save-transfer'])compile(name);
const load=name=>import(pathToFileURL(join(output,`${name}.js`)).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine');
const {createGameUiActions,synchronizeGamePause}=await load('ui-session');
const {createGameKeyboardControls,createGamePointerControls}=await load('ui-controls');
const {mountGameWorld}=await load('ui-world');
const {mountGameAudio,setGameSound,setGameMusicVolume}=await load('ui-audio');
const {SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY,MUSIC}=await load('music');
const {toggleGameFullscreen,subscribeGameFullscreen}=await load('ui-fullscreen');
const {canApplyGameUpdate,prepareGameUpdate}=await load('ui-update');
const {importGameSaveTransfer}=await load('ui-save-transfer');
let checks=0,writes=0;
const check=(value,message)=>{assert.ok(value,message);checks++;},equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const store=new Map();globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>{writes++;store.set(key,value);}};globalThis.setTimeout=()=>1;
function game(){store.clear();writes=0;const engine=new GameEngine();engine.start(false);engine.finishCutscene();engine.save(true);return engine;}
function uiSession(engine){const ui={panel:null,opening:false,confirmReset:false,tab:'party',active:'party',focus:undefined};const actions=createGameUiActions(engine,{read:()=>ui,setPanel:panel=>ui.panel=panel,setOpening:opening=>ui.opening=opening,setMenuTab:tab=>ui.tab=tab,setActiveMenuTab:active=>ui.active=active,setMenuFocus:focus=>ui.focus=focus});return {ui,actions};}
class Events{
 listeners=new Map();
 addEventListener(name,callback,options){const entries=this.listeners.get(name)||[];entries.push({callback,once:options?.once===true});this.listeners.set(name,entries);}
 removeEventListener(name,callback){this.listeners.set(name,(this.listeners.get(name)||[]).filter(entry=>entry.callback!==callback));}
 emit(name,event={}){for(const entry of [...(this.listeners.get(name)||[])]){if(entry.once)this.removeEventListener(name,entry.callback);entry.callback(event);}}
 get count(){return [...this.listeners.values()].reduce((sum,entries)=>sum+entries.length,0);}
}
class AudioChannel{src='';loop=false;preload='';volume=1;currentTime=0;paused=true;muted=false;autoplay=true;plays=0;pause(){this.paused=true;}play(){this.paused=false;this.plays++;return Promise.resolve();}}

// Opening and menu state are synchronous before any React effect can mount.
{
 const engine=game(),{ui,actions}=uiSession(engine);engine.state.mode='start';engine.keys.add('w');
 actions.showOpening();check(ui.opening&&engine.paused,'opening freezes movement synchronously');check(!engine.keys.size,'opening removes held movement');const raw=store.get(SAVE_KEY),writeCount=writes;actions.showOpening();equal(ui.opening,true,'duplicate opening is ignored');actions.openMenu('skills');equal(ui.panel,null,'gameplay menu cannot open under title film');actions.closeOpening();check(!ui.opening&&!engine.paused,'closing title film restores ordinary title input');equal(store.get(SAVE_KEY),raw,'opening never rewrites save');equal(writes,writeCount,'opening has no storage side effects');
 ui.confirmReset=true;actions.showOpening();equal(ui.opening,false,'reset confirmation blocks opening');ui.confirmReset=false;ui.panel='help';actions.showOpening();equal(ui.opening,false,'system dialog blocks opening');ui.panel=null;engine.state.mode='world';actions.showOpening();equal(ui.opening,false,'title film cannot open during world gameplay');
 actions.openMenu('gear','wolf-weapon');equal([ui.panel,ui.tab,ui.active,ui.focus],['menu','gear','gear','wolf-weapon'],'menu routing/focus preserved');check(engine.paused,'menu pauses world immediately');engine.keys.add('d');actions.closePanel();check(!engine.keys.size&&ui.panel===null,'closing panel clears held movement');synchronizeGamePause(engine,ui);equal(engine.paused,false,'closing panel releases pause after state synchronization');ui.panel='menu';ui.opening=true;synchronizeGamePause(engine,ui);equal(engine.paused,true,'combined UI layers preserve pause');
}

// Native pointer capture handles release/cancel/lost-capture and suppresses title film input.
{
 const engine=game();let blocked=false,focuses=0;const captures=[],clicks=[];
 const pointer=createGamePointerControls(engine,{blocked:()=>blocked,focus:()=>focuses++,click:(x,y)=>clicks.push([x,y])});
 for(const release of ['onPointerUp','onPointerCancel','onLostPointerCapture']){
  let prevented=0;const held=pointer.hold('ArrowRight');held.onPointerDown({pointerId:31,preventDefault:()=>prevented++,currentTarget:{setPointerCapture:id=>captures.push(id)}});equal(prevented,1,'touch gesture suppresses browser scrolling');check(engine.keys.has('ArrowRight'),'touch press starts the real movement key');held[release]();check(!engine.keys.has('ArrowRight'),'release/cancel/lost capture stops held movement');
 }
 equal(captures,[31,31,31],'each touch receives native pointer capture');blocked=true;pointer.hold('ArrowUp').onPointerDown({pointerId:32,preventDefault:()=>{},currentTarget:{setPointerCapture:()=>{throw Error('blocked capture');}}});check(!engine.keys.has('ArrowUp'),'blocked film never captures a movement pointer');pointer.canvasPointerUp({clientX:100,clientY:180});equal(clicks,[],'opening blocks canvas navigation');equal(focuses,0,'blocked canvas does not steal film focus');blocked=false;pointer.canvasPointerUp({clientX:100,clientY:180});equal(clicks,[[100,180]],'canvas preserves actual client coordinates');equal(focuses,1,'canvas restores game keyboard focus');
}

// Title/origin/interactive controls keep Enter, Escape and typing semantics.
{
 const engine=game(),{ui,actions}=uiSession(engine);let loaded=false,armed=false,activations=0,origins=0;
 engine.state.mode='start';const controls=createGameKeyboardControls({engine,panel:()=>ui.panel,opening:()=>ui.opening,loaded:()=>loaded,titleArmed:()=>armed,loading:()=>null,closePanel:actions.closePanel,openMenu:actions.openMenu,setTarget:()=>{},activateTitle:()=>{activations++;armed=true;},toggleMusic:()=>{},startSelectedOrigin:()=>origins++});
 function press(key,repeat=false){let prevented=0;controls.down({key,repeat,target:null,preventDefault:()=>prevented++});return prevented;}
 equal(press('Enter'),0,'title cannot start before initial assets are ready');loaded=true;equal(press('Enter'),1,'first Enter arms title');equal(activations,1,'title activation runs once');engine.state.hasSave=false;press('Enter');equal(engine.state.mode,'selection','second Enter opens origins without an old save');press('Enter');equal(origins,1,'origin Enter activates the selected native button');press('Enter',true);equal(origins,1,'held Enter cannot start twice');press('Escape');equal(engine.state.mode,'start','Escape exits origin selection');
 engine.state.mode='world';engine.keys.add('ArrowUp');controls.up({key:'ArrowUp'});check(!engine.keys.size,'keyboard release stops real held keys');engine.keys.add('d');engine.path=[{x:15,y:12}];controls.blur();check(!engine.keys.size&&!engine.path.length,'blur clears both physical and click movement');
}

// Browser modifiers/function keys never invoke gameplay; keyup still releases an existing held key.
{
 const engine=game();let commands=0,opening=false,suspended=false,loading=null;
 for(const method of ['quickField','swapLeader','selectPartySlot','interact','nextCutscene','nextDialogue','start','selectProtagonist','returnToTitle'])engine[method]=()=>commands++;
 const controls=createGameKeyboardControls({engine,panel:()=>null,opening:()=>opening,suspended:()=>suspended,loaded:()=>true,titleArmed:()=>true,loading:()=>loading,closePanel:()=>commands++,openMenu:()=>commands++,setTarget:()=>commands++,activateTitle:()=>commands++,toggleMusic:()=>commands++,startSelectedOrigin:()=>commands++});
 const shortcuts=[{key:'r',ctrlKey:true},{key:'w',ctrlKey:true},{key:'1',ctrlKey:true},{key:'R',metaKey:true},{key:'p',metaKey:true},{key:'Tab',altKey:true},{key:'ArrowLeft',altKey:true},{key:'F1'},{key:'F5'},{key:'F11'},{key:'F12'}];
 for(const mode of ['world','battle','dialogue','cutscene','start','selection']){
  engine.state.mode=mode;
  for(const shortcut of shortcuts){let prevented=0;controls.down({...shortcut,repeat:false,target:null,preventDefault:()=>prevented++});equal(prevented,0,'browser shortcuts keep native behavior in '+mode);}
 }
 equal(commands,0,'Ctrl/Cmd/Alt/function keys never cast, navigate, target, swap, interact or start');check(!engine.keys.size,'modified movement never arms game keys');
 for(const blocked of ['opening','suspended','loading']){
  opening=blocked==='opening';suspended=blocked==='suspended';loading=blocked==='loading'?{loading:true,error:null}:null;
  let prevented=0;controls.down({key:'r',ctrlKey:true,repeat:false,target:null,preventDefault:()=>prevented++});equal(prevented,0,'browser refresh survives '+blocked);
 }
 opening=false;suspended=false;loading=null;engine.state.mode='world';
 controls.down({key:'w',repeat:false,target:null,preventDefault:()=>{}});check(engine.keys.has('w'),'plain movement still arms the real key');
 controls.down({key:'w',ctrlKey:true,repeat:false,target:null,preventDefault:()=>{}});check(engine.keys.has('w'),'modifier keydown does not corrupt an already held movement key');
 controls.up({key:'W',ctrlKey:true});check(!engine.keys.has('w'),'modified keyup releases the existing lowercase movement key');
 engine.keys.add('ArrowRight');controls.up({key:'ArrowRight',altKey:true});check(!engine.keys.size,'modified arrow keyup releases held directional movement');
}

// Mount/unmount use matching listeners, and late loads cannot mutate a replacement session.
{
 const engine=game(),windowEvents=new Events(),documentEvents=new Events(),loaded=[],loading=[],refs=[];let resolveLoad,rendererDisposed=0;
 const renderer={load:()=>new Promise(resolve=>resolveLoad=resolve),destroy:()=>rendererDisposed++,getLoadingState:()=>({loading:false,error:null})};let emitLoading;
 const cleanup=mountGameWorld({engine,canvas:{},controls:{panel:()=>null,opening:()=>false,loaded:()=>true,titleArmed:()=>true,closePanel:()=>{},openMenu:()=>{},setTarget:()=>{},activateTitle:()=>{},toggleMusic:()=>{}},onLoading:value=>loading.push(value),onLoaded:value=>loaded.push(value),onRenderer:value=>refs.push(value)},{window:windowEvents,document:documentEvents,createRenderer:(_canvas,_engine,onLoading)=>{emitLoading=onLoading;return renderer;}});
 equal(windowEvents.count,3,'world mounts one keydown/keyup/blur set');equal(documentEvents.count,1,'world mounts one visibility cleanup');engine.keys.add('w');documentEvents.emit('visibilitychange');check(!engine.keys.size,'visibility loss releases keyboard/pointer movement');emitLoading({loading:true,ready:false});equal(loading.length,1,'live world loading publishes status');
 cleanup();cleanup();equal(rendererDisposed,1,'duplicate cleanup destroys renderer once');equal(windowEvents.count,0,'all world window listeners removed');equal(documentEvents.count,0,'visibility listener removed');equal(refs,[renderer,null],'renderer reference is cleared');emitLoading({loading:false,ready:true});resolveLoad(true);await Promise.resolve();equal(loading.length,1,'late loading status is ignored after cleanup');equal(loaded,[],'late ready promise cannot publish React state');
}
{
 const engine=game(),events=new Events(),doc=new Events(),loaded=[];let resolveLoad;const renderer={load:()=>new Promise(resolve=>resolveLoad=resolve),destroy:()=>{},getLoadingState:()=>({loading:false,error:null})};
 const cleanup=mountGameWorld({engine,canvas:{},controls:{panel:()=>null,opening:()=>false,loaded:()=>true,titleArmed:()=>true,closePanel:()=>{},openMenu:()=>{},setTarget:()=>{},activateTitle:()=>{},toggleMusic:()=>{}},onLoading:()=>{},onLoaded:value=>loaded.push(value),onRenderer:()=>{}},{window:events,document:doc,createRenderer:()=>renderer});resolveLoad(true);await Promise.resolve();equal(loaded,[true],'live initial load enables title exactly once');cleanup();
}

// Muted preference survives mount, gestures, track changes, volume and disposal.
{
 const engine=game(),events=new Events(),channels=[new AudioChannel(),new AudioChannel()],state={sound:null,volume:null,status:null};store.set(SOUND_ENABLED_KEY,'false');store.set(MUSIC_VOLUME_KEY,'0.35');
 const audio=mountGameAudio(engine,channels,{onSound:value=>state.sound=value,onVolume:value=>state.volume=value,onStatus:value=>state.status=value},events);
 equal(state.sound,false,'stored mute reaches UI');equal(state.volume,.35,'stored volume reaches UI');check(!engine.sound&&!audio.director.enabled,'engine/director agree on stored mute');equal(channels.map(a=>a.plays),[0,0],'muted mount starts no audio');events.emit('pointerdown');events.emit('keydown');equal(channels.map(a=>a.plays),[0,0],'gestures never override stored mute');audio.director.request('below');equal(channels.map(a=>a.plays),[0,0],'map music change remains silent');
 setGameMusicVolume(audio.director,.7,value=>state.volume=value);equal(store.get(MUSIC_VOLUME_KEY),'0.7','volume persists using original storage key');check(!audio.director.enabled,'volume does not enable sound');setGameSound(engine,audio.director,true,value=>state.sound=value);await Promise.resolve();equal(store.get(SOUND_ENABLED_KEY),'true','explicit enabling persists');check(state.sound&&engine.sound&&audio.director.enabled,'explicit enabling reaches all audio owners');check(channels.some(a=>a.plays===1),'explicit enabling starts only the selected track');setGameSound(engine,audio.director,false,value=>state.sound=value);check(channels.every(a=>a.muted&&a.paused),'disabling immediately silences both tracks');equal(store.get(SOUND_ENABLED_KEY),'false','mute persists again');const before=structuredClone(state);audio.dispose();audio.dispose();equal(events.count,0,'audio gesture listeners clean up once');check(audio.director.disposed,'director disposed');equal(state,before,'dispose never publishes stale audio status');
}

// Standard/WebKit fullscreen, coarse orientation and denied requests use the same contract.
{
 const doc=new Events();doc.fullscreenElement=null;doc.webkitFullscreenElement=null;let requests=0,exits=0,rotations=0,clears=0;const messages=[],states=[];
 const shell={requestFullscreen:async()=>{requests++;doc.fullscreenElement=shell;doc.emit('fullscreenchange');}};
 doc.exitFullscreen=async()=>{exits++;doc.fullscreenElement=null;doc.emit('fullscreenchange');};
 const env={document:doc,window:{matchMedia:()=>({matches:true})},screen:{orientation:{lock:async mode=>{equal(mode,'landscape','coarse input requests landscape');rotations++;}}}};
 const unsubscribe=subscribeGameFullscreen(value=>states.push(value),env),callbacks={clearMovement:()=>clears++,toast:text=>messages.push(text)};
 await toggleGameFullscreen(shell,callbacks,env);equal([requests,rotations],[1,1],'standard fullscreen and mobile orientation');await toggleGameFullscreen(shell,callbacks,env);equal(exits,1,'second action exits standard fullscreen');equal(states,[false,true,false],'state observes initial and native changes');equal(clears,2,'fullscreen transitions clear held movement');unsubscribe();equal(doc.count,0,'both fullscreen event listeners clean up');
 const webkit={webkitRequestFullscreen:async()=>{requests++;doc.webkitFullscreenElement=webkit;}};doc.exitFullscreen=undefined;doc.webkitExitFullscreen=async()=>{exits++;doc.webkitFullscreenElement=null;};await toggleGameFullscreen(webkit,callbacks,env);await toggleGameFullscreen(webkit,callbacks,env);equal([requests,exits],[2,2],'WebKit request/exit fallback preserved');
 await toggleGameFullscreen({requestFullscreen:async()=>{throw Error('denied');}},callbacks,env);check(messages.at(-1).startsWith('Tela cheia indisponível'),'denial keeps the existing player-facing recovery message');
}

// PWA applies only at an explicit safe checkpoint and rejects a failed save.
{
 const engine=game(),{ui}=uiSession(engine);ui.panel='menu';check(canApplyGameUpdate(engine,ui),'paused world menu is update-safe');const before=writes;engine.keys.add('w');check(prepareGameUpdate(engine,ui),'safe world update saves successfully');check(!engine.keys.size&&engine.paused,'update keeps menu paused and clears movement');check(writes>before&&parseSave(store.get(SAVE_KEY)),'update uses valid existing save format');
 for(const mode of ['battle','dialogue','cutscene']){engine.state.mode=mode;check(!prepareGameUpdate(engine,ui),'active gameplay/cinematic prevents update');}engine.state.mode='world';for(const busy of ['gachaBusy','summonBusy']){engine.state[busy]=true;check(!prepareGameUpdate(engine,ui),'revelation prevents update');engine.state[busy]=false;}
 ui.opening=true;check(!prepareGameUpdate(engine,ui),'opening film prevents update');ui.opening=false;check(!prepareGameUpdate(engine,ui,{loading:true,error:null}),'world transition prevents update');check(!prepareGameUpdate(engine,ui,{loading:false,error:'failed'}),'unresolved art failure prevents save/reload');
 check(engine.startBloodMoonEventV36()&&engine.beginEventActivityV38('rhythm')&&engine.startEventRhythmV38(true),'a real event activity can be active in the paused menu');const activityToken=engine.eventActivitiesV38().session.token,activityWrites=writes;check(!canApplyGameUpdate(engine,ui)&&!prepareGameUpdate(engine,ui),'update stays disabled until returning from the event activity');equal(engine.eventActivitiesV38().session.token,activityToken,'rejected update does not cancel or restart the active cue');equal(writes,activityWrites,'rejected update performs no save or reward mutation');check(engine.cancelEventActivityV38()&&canApplyGameUpdate(engine,ui),'explicit return restores update eligibility');
 const originalSave=engine.save;engine.save=()=>false;check(!prepareGameUpdate(engine,ui),'failed save rejects update');engine.save=originalSave;
 for(const mode of ['start','selection']){engine.state.mode=mode;const current=writes;check(prepareGameUpdate(engine,ui),'title/selection can update without gameplay');equal(writes,current,'title update cannot overwrite existing saved adventure');}
}
// Explicit update holds the menu and input while asynchronous activation is pending.
{
 const engine=game(),{ui,actions}=uiSession(engine);ui.panel='menu';ui.updating=true;check(canApplyGameUpdate(engine,ui),'the pending update remains eligible for its own save revalidation');engine.keys.add('w');synchronizeGamePause(engine,ui);check(engine.paused&&!engine.keys.size,'pending update pauses and releases movement');actions.closePanel();equal(ui.panel,'menu','Esc/outside/close action cannot dismiss the pending update');actions.openMenu('party');equal(ui.panel,'menu','pending update does not switch away from its menu');
 let changed=0;const controls=createGameKeyboardControls({engine,panel:()=>ui.panel,opening:()=>false,suspended:()=>ui.updating,loaded:()=>true,titleArmed:()=>true,loading:()=>null,closePanel:()=>{changed++;actions.closePanel();},openMenu:()=>changed++,setTarget:()=>changed++,activateTitle:()=>changed++,toggleMusic:()=>changed++});
 for(const key of ['Escape','1','5','Tab','p','Enter','w']){let consumed=0;controls.down({key,repeat:false,target:null,preventDefault:()=>consumed++});equal(consumed,1,'pending update consumes game input');}equal(changed,0,'pending update does not invoke gameplay or menu callbacks');check(!engine.keys.size,'pending update never arms held movement');let consumed=0;controls.down({key:'F5',repeat:false,target:null,preventDefault:()=>consumed++});equal(consumed,0,'explicit browser refresh remains available');ui.updating=false;actions.closePanel();synchronizeGamePause(engine,ui);check(!engine.paused&&ui.panel===null,'failed update can release the menu normally');
}
// Local-file transfer synchronizes real audio owners without unmuting the destination.
{
 const source=game();store.set(SOUND_ENABLED_KEY,'true');store.set(MUSIC_VOLUME_KEY,'0.45');source.sound=true;source.save(true);const packet=source.exportSavePwa();check(!!packet,'transfer exports the existing saved format');
 const destination=new GameEngine();destination.sound=false;store.set(SOUND_ENABLED_KEY,'false');const {ui}=uiSession(destination);let returned=0,sound,volume;
 const callbacks={sound:value=>{sound=value;setGameSound(destination,null,value,()=>{});},volume:value=>{volume=value;setGameMusicVolume(null,value,()=>{});},returnToTitle:()=>{returned++;destination.returnToTitle();}};
 check(importGameSaveTransfer(destination,packet,ui,null,callbacks),'explicit valid transfer imports at title');equal([sound,volume,returned],[false,.45,1],'import updates volume and returns to title without silently enabling sound');check(destination.state.hasSave&&parseSave(store.get(SAVE_KEY)),'imported adventure remains resumable');equal(store.get(SOUND_ENABLED_KEY),'false','destination mute remains persistent');
 const mutedPacket=JSON.stringify({...JSON.parse(packet),preferences:{...JSON.parse(packet).preferences,audio:{enabled:false,volume:.2}}});destination.sound=true;store.set(SOUND_ENABLED_KEY,'true');check(importGameSaveTransfer(destination,mutedPacket,ui,null,callbacks),'muted package also imports');check(!sound&&!destination.sound,'muted package immediately silences the live engine/audio callback');
 const before=returned;ui.opening=true;check(!importGameSaveTransfer(destination,packet,ui,null,callbacks),'film prevents import');ui.opening=false;destination.state.mode='world';check(!importGameSaveTransfer(destination,packet,ui,null,callbacks),'live adventure prevents replacement');destination.state.mode='start';check(!importGameSaveTransfer(destination,'not a save',ui,null,callbacks),'malformed file rejected');equal(returned,before,'rejected imports do not close/change the current UI');
}
console.log(`UI session v36 PASS: ${checks} checks / exported controls, opening/menu, mobile capture, lifecycle late-load/dispose, mute/preferences, standard/WebKit fullscreen explicit safe update and muted local-file transfer.`);
