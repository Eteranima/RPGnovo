import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

let checks=0;
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const require=createRequire(import.meta.url),react=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function commonModule(path,imports={}){const exports={};const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;new Function('require','exports',code)(name=>Object.hasOwn(imports,name)?imports[name]:require(name),exports);return exports;}
const registry=commonModule('lib/art/questCinematicsV34.ts'),{MIKA_FRAME_TEST_V35:film}=commonModule('lib/art/frameTestV35.ts');
equal([film.frames,film.fps,film.durationSeconds],[48,24,2],'one native48frame test at24fps');
equal(film.id,'mika-frame-test-v35','preview has an independent identity');
equal(film.src,'/assets/v35/frame-test/mika.mp4','preview requests only its own encoded media');
equal(film.poster,'/assets/v35/frame-test/mika-poster.png','preview has a standalone poster');
equal(Object.keys(registry.QUEST_CINEMATICS_V34).length,5,'the existing five mission films remain intact');
equal(registry.getQuestCinematicV34(film.id),undefined,'the preview is never a quest cinematic ID');
for(const avatar of film.avatars)check(existsSync('public'+avatar.src),'preview avatar is an existing native Mika asset');
for(let frame=0;frame<film.frames;frame++)equal(registry.questVideoFrameV34(film,(frame+.25)/film.fps),frame,'shared native clock addresses every drawing');

const output=mkdtempSync(join(tmpdir(),'eter-frame-test-v35-')),compiled=new Set();
function compile(name){if(compiled.has(name))return;compiled.add(name);let source=readFileSync(`lib/game/${name}.ts`,'utf8');for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");writeFileSync(join(output,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);}
for(const name of ['engine','master-mode'])compile(name);
const load=name=>import(pathToFileURL(join(output,`${name}.js`)).href);
const {GameEngine,SAVE_KEY}=await load('engine'),{emptyMasterSequence,advanceMasterSequence}=await load('master-mode');
const store=new Map();let writes=0;globalThis.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>{writes++;store.set(key,value);}};globalThis.setTimeout=()=>1;
function game(){store.clear();writes=0;const engine=new GameEngine();engine.start(false);engine.finishCutscene();engine.save(true);return engine;}
function persistent(engine){const {version,progress,remedies,map,position,stage,heroes,potions,ethers,credits,opened,checkpoint,elapsed}=engine.state;return structuredClone({version,progress,remedies,map,position,stage,heroes,potions,ethers,credits,opened,checkpoint,elapsed});}
const page=ts.createSourceFile('page.tsx',readFileSync('app/page.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),handlers={};
function collect(node){if(ts.isVariableDeclaration(node)&&['showFrameTest','closeFrameTest','openMenu','down'].includes(node.name.getText(page)))handlers[node.name.getText(page)]=node.initializer;ts.forEachChild(node,collect);}collect(page);
for(const name of ['showFrameTest','closeFrameTest','openMenu','down'])check(handlers[name],'actual Page handler is available');
const js=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const uiFactory=new Function('MIKA_FRAME_TEST_V35',js(`return(engine)=>{
 const ui={panel:'menu',tab:'scenes',active:'scenes',focus:null,preview:false},frameTestRef={current:false},openingRef={current:false},panelRef={current:'menu'};
 const canceled=[],scheduled=[],queue=new Map();let next=40;
 const world={raf:7,frame:250,disposed:false,draw:()=>{}};queue.set(world.raf,world.draw);const renderer={current:world};
 const cancelAnimationFrame=id=>{canceled.push(id);queue.delete(id);},requestAnimationFrame=callback=>{const id=++next;scheduled.push({id,callback});queue.set(id,callback);return id;};
 const setPanel=value=>{ui.panel=value;panelRef.current=value;},setMenuTab=value=>ui.tab=value,setActiveMenuTab=value=>ui.active=value,setMenuFocus=value=>ui.focus=value,setFrameTest=value=>ui.preview=value;
 const openMenu=${handlers.openMenu.getText(page)},showFrameTest=${handlers.showFrameTest.getText(page)},closeFrameTest=${handlers.closeFrameTest.getText(page)};
 return {ui,frameTestRef,openingRef,panelRef,renderer,world,canceled,scheduled,queue,showFrameTest,closeFrameTest};
};`))(film);
{
 const engine=game(),before=persistent(engine),raw=store.get(SAVE_KEY),writeCount=writes,ui=uiFactory(engine);engine.keys.add('w');engine.path=[{x:15,y:12}];engine.pending='library';
 ui.showFrameTest();equal(ui.ui.panel,null,'menu focus trap closes before the preview portal');check(ui.ui.preview&&ui.frameTestRef.current,'preview UI guard is synchronous');check(engine.paused,'world remains paused');check(!engine.keys.size&&!engine.path.length&&!engine.pending,'held movement and interactions clear');
 equal(ui.canceled,[7],'the owned world RAF is canceled');equal(ui.queue.size,0,'no world update remains queued during media playback');equal(engine.state.mode,'world','preview never changes gameplay mode');equal(engine.state.questCinematic,null,'no quest cinematic session is created');equal(persistent(engine),before,'preview launch preserves all persistent fields');equal(store.get(SAVE_KEY),raw,'preview launch does not touch saved bytes');equal(writes,writeCount,'preview launch has no storage writes');
 ui.showFrameTest();equal(ui.canceled,[7],'duplicate launch cannot cancel or mount twice');
 ui.closeFrameTest();equal(ui.ui,{panel:'menu',tab:'scenes',active:'scenes',focus:film.id,preview:false},'closing returns to Cenas and selects the test focus target');check(!ui.frameTestRef.current&&engine.paused,'closing restores the ordinary paused menu');equal(ui.world.frame,0,'renderer clock resets so elapsed video time cannot catch up as gameplay');equal(ui.scheduled.length,1,'renderer resumes exactly once');equal(ui.scheduled[0].callback,ui.world.draw,'resume uses the existing native world renderer');equal(ui.queue.size,1,'a single renderer loop is restored');
 equal(persistent(engine),before,'close preserves every quest choice/vital/reward');equal(store.get(SAVE_KEY),raw,'closing does not change save');equal(writes,writeCount,'no preview completion/reward writes');ui.closeFrameTest();equal(ui.scheduled.length,1,'duplicate close is harmless');
}
for(const configure of [ui=>ui.openingRef.current=true,ui=>ui.panelRef.current=null,(_ui,engine)=>engine.state.mode='battle',(_ui,engine)=>engine.state.gachaBusy=true,(_ui,engine)=>engine.state.summonBusy=true,(_ui,engine)=>engine.state.questCinematic={questId:'long-tinta',replay:true,token:1,caption:''}]){
 const engine=game(),ui=uiFactory(engine);configure(ui,engine);const before=persistent(engine);ui.showFrameTest();check(!ui.ui.preview&&!ui.frameTestRef.current,'unsafe gameplay/reveal state rejects preview');equal(ui.canceled.length,0,'blocked launch leaves renderer running');equal(persistent(engine),before,'blocked preview changes no persistence');
}
{
 const engine=game(),ui=uiFactory(engine);ui.showFrameTest();ui.world.disposed=true;ui.closeFrameTest();equal(ui.scheduled.length,0,'disposed renderer cannot be resurrected by late close');
}
class TestElement{constructor(selector=''){this.selector=selector;}closest(selector){return this.selector&&selector.includes(this.selector)?this:null;}}
const bindDown=new Function('Element','advanceMasterSequence','emptyMasterSequence',js(`return(engine)=>{const frameTestRef={current:true},openingRef={current:false},panelRef={current:null},renderer={current:null};const loadedRef={current:true},armedRef={current:true};let masterSequence=emptyMasterSequence();const bad=()=>{throw Error('Gameplay must not run during preview');},setTarget=bad,setPanel=bad,openMenu=bad,toggleMusic=bad,activateTitle=bad;return ${handlers.down.getText(page)};};`))(TestElement,advanceMasterSequence,emptyMasterSequence);
{
 const engine=game(),before=persistent(engine),down=bindDown(engine),sound=engine.sound;
 for(const key of ['1','2','3','4','5','Tab','w','a','s','d','e','q','r','p','Enter','Escape',' ']){let prevented=0;engine.keys.add('w');down({key,repeat:false,target:null,preventDefault:()=>prevented++});equal(prevented,1,'preview contains gameplay keys even before its portal effect');check(!engine.keys.size,'preview input clears held movement');equal(persistent(engine),before,'preview keys preserve save/quests/party');equal(engine.sound,sound,'preview keyP cannot toggle audio');}
 for(const key of ['Enter',' ']){let prevented=0;down({key,target:new TestElement('button'),preventDefault:()=>prevented++});equal(prevented,0,'focused native player buttons stay keyboard accessible');}
 for(const event of [{key:'F5'},{key:'r',ctrlKey:true},{key:'r',metaKey:true},{key:'r',altKey:true}]){let prevented=0;down({...event,target:null,preventDefault:()=>prevented++});equal(prevented,0,'browser shortcuts remain usable');}
}

const cardSource=readFileSync('components/frame-test-preview-card.tsx','utf8'),cardTree=ts.createSourceFile('card.tsx',cardSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let focusEffect;
function findFocus(node){if(ts.isCallExpression(node)&&node.expression.getText(cardTree)==='useEffect')focusEffect=node.arguments[0];ts.forEachChild(node,findFocus);}findFocus(cardTree);
let frameCallback,focused=0,canceled=[];
const restore=new Function('focusId','film','button','requestAnimationFrame','cancelAnimationFrame',js(`return (${focusEffect.getText(cardTree)})();`));
const cleanup=restore(film.id,film,{current:{focus:()=>focused++}},callback=>{frameCallback=callback;return 2;},id=>canceled.push(id));frameCallback();equal(focused,1,'return focus reaches the actual test button');cleanup();equal(canceled,[2],'focus RAF cleans up');frameCallback=null;equal(restore('long-tinta',film,{current:null},callback=>frameCallback=callback,()=>{}),undefined,'normal mission focus does not activate test button');equal(frameCallback,null,'unrelated focus schedules no preview work');
const card=commonModule('components/frame-test-preview-card.tsx',{'@/lib/art/frameTestV35':{MIKA_FRAME_TEST_V35:film},'./hud-icon':commonModule('components/hud-icon.tsx'),'./frame-test-preview-card.module.css':{section:'section',card:'card',poster:'poster',content:'content',label:'label'}});
{
 const engine=game();function markup(extra={}){return renderToStaticMarkup(react.createElement(card.FrameTestPreviewCard,{s:engine.state,onPreview:()=>{},...extra}));}
 const html=markup();check(html.includes('48 QUADROS · 24 FPS · 2 SEGUNDOS'),'card explains the actual drawing clock');check(html.includes(film.poster)&&html.includes('loading="lazy"'),'card uses the standalone final poster lazily');check(!html.includes('<video')&&!html.includes(film.src),'Cenas does not preload the test MP4');check(!html.includes('disabled=""'),'unseen missions do not block independent preview');check(!html.includes('data-quest-scene='),'preview does not count as a sixth quest');check(markup({onPreview:undefined}).includes('disabled=""'),'unwired preview button cannot be a dead click');engine.state.gachaBusy=true;check(markup().includes('disabled=""'),'active reveal blocks preview');
}

// Execute production scene selection and media effect with the dedicated film override.
const playerTree=ts.createSourceFile('quest-cinematic.tsx',readFileSync('components/quest-cinematic.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let sceneExpression,mediaEffect,finishExpression;
function findPlayer(node){if(ts.isVariableDeclaration(node)&&node.name.getText(playerTree)==='scene')sceneExpression=node.initializer;if(ts.isVariableDeclaration(node)&&node.name.getText(playerTree)==='finish')finishExpression=node.initializer;if(ts.isCallExpression(node)&&node.expression.getText(playerTree)==='useEffect'&&node.arguments[0].getText(playerTree).includes('const media=video.current,motion='))mediaEffect=node.arguments[0];ts.forEachChild(node,findPlayer);}findPlayer(playerTree);
const selectScene=new Function('filmSpec','questId','getQuestCinematicV34',js(`return ${sceneExpression.getText(playerTree)};`));let questReads=0;equal(selectScene(film,'long-geada',()=>{questReads++;return registry.getQuestCinematicV34('long-geada');}),film,'explicit override wins without loading a quest');equal(questReads,0,'override never reads quest registration');equal(selectScene(undefined,'long-geada',registry.getQuestCinematicV34),registry.QUEST_CINEMATICS_V34['long-geada'],'ordinary quest selection remains unchanged');
class Events{events=new Map();addEventListener(name,callback){const listeners=this.events.get(name)||[];listeners.push(callback);this.events.set(name,listeners);}removeEventListener(name,callback){this.events.set(name,(this.events.get(name)||[]).filter(item=>item!==callback));}emit(name){for(const callback of this.events.get(name)||[])callback();}}
class Media extends Events{muted=false;volume=.8;playbackRate=2;paused=true;ended=false;currentTime=0;duration=2;videoWidth=1280;videoHeight=720;readyState=2;seeking=false;dataset={};plays=0;load(){}play(){this.plays++;this.paused=false;this.ended=false;this.emit('playing');return Promise.resolve();}pause(){if(!this.paused){this.paused=true;this.emit('pause');}}}
const initialView={ready:false,failed:false,playing:false,buffering:false,finished:false,reduced:false,elapsed:0,blocked:false};
const bindMedia=new Function('scene','sceneAct','portalTarget','video','viewRef','setView','resolved','controls','window','document','matchMedia','requestAnimationFrame','cancelAnimationFrame','questVideoRangeV34','questVideoDurationMatchesV34','questVideoFrameV34','initialView',js(`return (${mediaEffect.getText(playerTree)})();`));
const bindFinish=new Function('resolved','video','viewRef','callbacks',js(`return ${finishExpression.getText(playerTree)};`));
function preview({reduced=true,invalid=false}={}){const media=new Media();if(invalid)media.duration=8;const doc=new Events();doc.hidden=false;const motion=new Events();motion.matches=reduced;const win={setTimeout:()=>1,clearTimeout:()=>{}};const state={current:{...initialView}},resolved={current:false},controls={current:null},exits=[];const cleanup=bindMedia(film,undefined,{}, {current:media},state,change=>state.current=typeof change==='function'?change(state.current):change,resolved,controls,win,doc,()=>motion,()=>1,()=>{},registry.questVideoRangeV34,registry.questVideoDurationMatchesV34,registry.questVideoFrameV34,initialView);const finish=bindFinish(resolved,{current:media},state,{current:{onComplete:()=>exits.push('complete'),onSkip:()=>exits.push('return')}});return {media,state,controls,exits,finish,cleanup,ready(){media.emit('loadedmetadata');media.emit('loadeddata');}};}
{
 const p=preview();p.ready();equal(p.media.plays,0,'reduced motion preview starts paused');check(p.state.current.ready&&p.state.current.reduced,'native test data validates against2seconds');check(p.media.muted&&p.media.volume===0&&p.media.playbackRate===1,'preview preserves silent normal-speed player behavior');p.controls.current.play();equal(p.media.plays,1,'manual playback starts native film');
 for(let frame=0;frame<48;frame++){p.media.currentTime=(frame+.25)/24;p.media.emit('timeupdate');equal(p.media.dataset.nativeFrame,String(frame),'player clock visits every drawing without CSS frame selection');}
 p.media.currentTime=2;p.media.ended=true;p.media.emit('ended');check(p.state.current.finished,'native ended holds final drawing');equal(p.media.dataset.nativeFrame,'47','last drawing metadata remains');equal(p.exits,[],'native end never grants quest progress or calls completion');p.controls.current.play();equal(p.media.currentTime,0,'repeat restarts only the independent test');p.controls.current.pause();check(p.media.paused,'preview can pause');p.finish(true);p.finish(true);equal(p.exits,['return'],'return callback runs once');p.cleanup();
}
{
 const p=preview({invalid:true});p.ready();check(p.state.current.failed&&!p.state.current.ready,'an8second quest file cannot substitute the2second test');equal(p.media.plays,0,'wrong native metadata never autoplays');equal(p.exits,[],'failure cannot complete a quest');p.finish(true);equal(p.exits,['return'],'failure retains explicit return to Cenas');p.cleanup();
}
console.log(`Frame test v35 PASS: ${checks} checks / dedicated48frame24fps metadata, five quests unchanged, Page RAF/input isolation, no save/rewards, return/focus, lazy poster and player override/reduced-motion/end/repeat/failure.`);
