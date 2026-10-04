import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

const output=mkdtempSync(join(tmpdir(),'eter-quest-replay-v34-')),compiled=new Set();
function compile(name){if(compiled.has(name))return;compiled.add(name);let source=readFileSync(`lib/game/${name}.ts`,'utf8');for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");writeFileSync(join(output,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);}
for(const name of ['engine','master-mode','music'])compile(name);
const load=async name=>import(pathToFileURL(join(output,`${name}.js`)).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine');
const {QUESTS_V31}=await load('questsV31');
const {advanceMasterSequence,emptyMasterSequence}=await load('master-mode');
const {musicFor}=await load('music');
const long=QUESTS_V31.filter(quest=>quest.cinematic);
let checks=0,writes=0;const store=new Map();
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>{writes++;store.set(key,value);}};
global.setTimeout=()=>1;
function game(){store.clear();writes=0;const engine=new GameEngine();engine.start(false);engine.finishCutscene();engine.state.stage=5;return engine;}
function completedRecord(quest,{seen=true,claimed=false}={}){
 const counts={},choices={};quest.steps.forEach((step,index)=>{for(const objective of step.objectives)counts[`${index}:${objective.id}`]=objective.goal;for(const site of step.sites)if(site.choices)choices[site.id]=site.choices.find(choice=>choice.correct!==false).id;});
 return {step:quest.steps.length,counts,choices,cinematicSeen:seen,claimed};
}
function persistent(engine){const {version,progress,remedies,map,position,stage,heroes,potions,ethers,credits,opened,checkpoint,elapsed}=engine.state;return structuredClone({version,progress,remedies,map,position,stage,heroes,potions,ethers,credits,opened,checkpoint,elapsed});}

equal(long.length,5,'the library covers precisely five long mission films');
for(const quest of long){
 for(const claimed of [false,true])for(const sound of [false,true]){
  const engine=game();engine.state.progress.questsV31.records[quest.id]=completedRecord(quest,{claimed});engine.sound=sound;
  // A seen memory is available from a different map; ordinary chapter scenes retain their old location gate.
  engine.state.map='patio';engine.save(true);check(parseSave(store.get(SAVE_KEY)),'a seen/completed record is a valid current save');
  const before=persistent(engine),raw=store.get(SAVE_KEY),saved=structuredClone(engine.saved),writeCount=writes,track=musicFor(engine.state);
  engine.keys.add('w');engine.path=[{x:15,y:12}];engine.pending='library';engine.paused=true;
  check(engine.replayQuestCinematic(quest.id),'a seen memory can be replayed before or after claiming its reward');
  const token=engine.state.questCinematic.token;
  equal(engine.state.mode,'cutscene','replay opens the actual cinematic mode');check(engine.state.questCinematic.replay,'session explicitly records replay');
  check(!engine.keys.size&&!engine.path.length&&!engine.pending,'held movement and pending interactions are removed');
  equal(engine.paused,true,'engine does not override the menu pause preference');equal(musicFor(engine.state),track,'replay retains the current map music track');
  equal(persistent(engine),before,'launching replay preserves every persistent field');
  for(const action of [()=>engine.replayQuestCinematic(quest.id),()=>engine.resumeQuestCinematic(quest.id),()=>engine.claimQuestV31(quest.id),()=>engine.startQuestV31(quest.id),()=>engine.save(true),()=>engine.selectPartySlot(1)])check(!action(),'replay rejects rewards, restart, duplicate launch, save and party shortcuts');
  engine.update(60);equal(persistent(engine),before,'world clocks and progression do not advance during replay');
  equal(store.get(SAVE_KEY),raw,'replay never writes or changes the stored save');equal(engine.saved,saved,'in-memory resume snapshot remains unchanged');equal(writes,writeCount,'no persistence side effects');equal(engine.sound,sound,'sound choice stays unchanged');
  check(!engine.finishQuestCinematic(false,token+1),'a callback from a different session cannot close the active memory');
  check(engine.finishQuestCinematic(claimed,token),'finish and explicit exit both return to world');
  equal(engine.state.questCinematic,null,'closed replay leaves no transient session');equal(engine.state.mode,'world','world mode restored');
  equal(persistent(engine),before,'closing replay preserves progression and resources');equal(store.get(SAVE_KEY),raw,'closing replay does not save');equal(writes,writeCount,'closing cannot duplicate persistence/rewards');
  check(!engine.finishQuestCinematic(false,token),'duplicate completion is harmless');
  const resumed=new GameEngine();resumed.hydrate();resumed.start(true);equal(resumed.state.progress.questsV31.records[quest.id],before.progress.questsV31.records[quest.id],'reload retains the exact completion/reward flags');
  if(!claimed){check(engine.claimQuestV31(quest.id),'the original unclaimed reward remains independently claimable once');equal(engine.state.progress.crystals,before.progress.crystals+quest.rewardPulls*160,'one original payout only');check(!engine.claimQuestV31(quest.id),'repeated reward claim remains rejected');}
 }
 for(const record of [undefined,{step:0,counts:{},choices:{},cinematicSeen:false,claimed:false},completedRecord(quest,{seen:false})]){
  const engine=game();if(record)engine.state.progress.questsV31.records[quest.id]=record;
  const before=structuredClone(engine.state),writeCount=writes;
  check(!engine.replayQuestCinematic(quest.id),'unseen, active or pending-first-watch films remain blocked');equal(engine.state,before,'a blocked replay changes no state');equal(writes,writeCount,'a blocked replay never writes a save');
 }
 {
  const engine=game();engine.state.progress.questsV31.records[quest.id]=completedRecord(quest,{seen:false});const crystals=engine.state.progress.crystals;
  check(engine.resumeQuestCinematic(quest.id),'the real pending desfecho still launches');const token=engine.state.questCinematic.token;
  check(!engine.state.questCinematic.replay,'first-watch session stays separate');check(!engine.replayQuestCinematic(quest.id),'pending playback cannot turn into replay');
  check(engine.finishQuestCinematic(false,token),'real completion still marks cinematicSeen');check(engine.state.progress.questsV31.records[quest.id].cinematicSeen,'first completion unlocks the memory');
  equal(engine.state.progress.crystals,crystals,'first completion does not auto-claim currency');
  check(engine.replayQuestCinematic(quest.id),'first-watch unlock allows later replay');check(!engine.finishQuestCinematic(true,token),'old first-watch callback cannot close the new replay');check(engine.finishQuestCinematic(true,engine.state.questCinematic.token),'active replay callback succeeds');
 }
}
for(const invalid of ['missing','__proto__',QUESTS_V31.find(quest=>!quest.cinematic).id]){const engine=game(),before=structuredClone(engine.state);check(!engine.replayQuestCinematic(invalid),'unknown/noncinematic IDs cannot borrow a film');equal(engine.state,before,'invalid IDs preserve state');}
for(const mode of ['start','selection','battle','dialogue','cutscene']){const engine=game();engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);engine.state.mode=mode;check(!engine.replayQuestCinematic(long[0].id),'replay requires a safe world state');}
for(const busy of ['gachaBusy','summonBusy']){const engine=game();engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);engine.state[busy]=true;check(!engine.replayQuestCinematic(long[0].id),'an active reveal cannot be interrupted by replay');}
{
 const engine=game();engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);engine.state.progress.fieldUntil['ice-bridge']=Date.now()-1000;
 const before=persistent(engine),now=engine.now;check(engine.replayQuestCinematic(long[0].id),'replay opens with a field timer present');engine.update(.25);equal(persistent(engine),before,'field expiry cannot relocate the party or mutate progress during replay');equal(engine.now,now,'simulation clock stays frozen');
}

// Execute the production Page handlers, preserving their ordering and return-to-Cenas behavior.
const page=ts.createSourceFile('app/page.tsx',readFileSync('app/page.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX),handlers={};
function visit(node){if(ts.isVariableDeclaration(node)&&['down','openMenu','replayQuestScene','finishQuestScene'].includes(node.name.getText(page)))handlers[node.name.getText(page)]=node.initializer;ts.forEachChild(node,visit);}visit(page);
for(const name of ['down','openMenu','replayQuestScene','finishQuestScene'])check(handlers[name],'actual Page handler exists');
const js=source=>ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const uiFactory=new Function(js(`return (engine)=>{const ui={panel:'menu',tab:'scenes',active:'scenes',focus:null};const openingRef={current:false};const setPanel=value=>ui.panel=value,setMenuTab=value=>ui.tab=value,setActiveMenuTab=value=>ui.active=value,setMenuFocus=value=>ui.focus=value;const openMenu=${handlers.openMenu.getText(page)},replayQuestScene=${handlers.replayQuestScene.getText(page)},finishQuestScene=${handlers.finishQuestScene.getText(page)};return {ui,replayQuestScene,finishQuestScene};};`))();
for(const skip of [false,true]){
 const engine=game();engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);const before=persistent(engine),ui=uiFactory(engine);
 ui.replayQuestScene(long[0].id);equal(ui.ui.panel,null,'Cenas dialog closes before the cinematic overlay');check(engine.paused,'Page pauses world synchronously');const token=engine.state.questCinematic.token;
 ui.finishQuestScene(token,skip);equal(ui.ui,{panel:'menu',tab:'scenes',active:'scenes',focus:long[0].id},'completion/exit reopens Cenas and restores the same card as focus target');check(engine.paused,'world remains paused behind the reopened library');equal(persistent(engine),before,'Page replay preserves persistent state');
 ui.replayQuestScene(long[0].id);const latest=engine.state.questCinematic.token;ui.finishQuestScene(token,true);equal(engine.state.questCinematic.token,latest,'stale Page callback cannot close a later replay');ui.finishQuestScene(latest,true);
}
class TestElement{constructor(selector=''){this.selector=selector;}closest(selector){return this.selector&&selector.includes(this.selector)?this:null;}}
const downFactory=new Function('Element','advanceMasterSequence','emptyMasterSequence',js(`return(engine)=>{const panelRef={current:null},openingRef={current:false},renderer={current:null};const setTarget=()=>{throw new Error('Replay must not select an ally');},setPanel=()=>{throw new Error('Replay must not dismiss another panel');},openMenu=()=>{throw new Error('Replay must not open a gameplay menu');},toggleMusic=()=>{throw new Error('Replay must not toggle sound');};const loadedRef={current:true},armedRef={current:true};const activateTitle=()=>{},masterSequence=emptyMasterSequence();return ${handlers.down.getText(page)};};`))(TestElement,advanceMasterSequence,emptyMasterSequence);
{
 const engine=game();engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);engine.replayQuestCinematic(long[0].id);const down=downFactory(engine),before=persistent(engine);
 for(const key of ['1','2','3','4','5','Tab','w','e','q','r','g','p',' ','Enter','Escape']){let prevented=0;engine.keys.add('w');down({key,repeat:false,target:null,preventDefault:()=>prevented++});equal(prevented,1,'cinema contains gameplay keys before its capture effect mounts');check(!engine.keys.size,'held movement clears on every cinematic key');equal(persistent(engine),before,'keyboard cannot mutate party or progression');}
 for(const extra of [{key:'F5'},{key:'r',ctrlKey:true},{key:'r',altKey:true},{key:'r',metaKey:true}]){let prevented=0;down({...extra,target:null,preventDefault:()=>prevented++});equal(prevented,0,'browser shortcuts stay available');}
 let prevented=0;down({key:'Enter',target:new TestElement('button'),preventDefault:()=>prevented++});equal(prevented,0,'buttons remain keyboard accessible for the player capture handler');
}

// Execute the actual focus restoration effect, rather than copying its target decision.
const library=ts.createSourceFile('quest-scene-library.tsx',readFileSync('components/quest-scene-library.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let focusEffect;
function findFocus(node){if(ts.isCallExpression(node)&&node.expression.getText(library)==='useEffect'&&node.arguments[0]?.getText(library).includes('requestAnimationFrame'))focusEffect=node.arguments[0];ts.forEachChild(node,findFocus);}findFocus(library);check(focusEffect,'library focus restoration uses an actual effect');
let frameCallback,canceled,focused;
const buttons=long.map(quest=>({dataset:{questSceneReplay:quest.id},focus:()=>focused=quest.id}));
const restore=new Function('library','focusId','requestAnimationFrame','cancelAnimationFrame',js(`return (${focusEffect.getText(library)})();`));
const cleanup=restore({current:{querySelectorAll:()=>buttons}},long[2].id,fn=>{frameCallback=fn;return 7;},id=>canceled=id);frameCallback();equal(focused,long[2].id,'return focuses the exact replayed card');cleanup();equal(canceled,7,'pending focus work is canceled on unmount');

// Render the actual library with real metadata and native HUD art, without browser globals.
const require=createRequire(import.meta.url),react=require('react'),{renderToStaticMarkup}=require('react-dom/server');
function commonModule(path,imports={}){const exports={};const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;new Function('require','exports',code)(name=>Object.hasOwn(imports,name)?imports[name]:require(name),exports);return exports;}
const registry=commonModule('lib/art/questCinematicsV34.ts'),hud=commonModule('components/hud-icon.tsx');
const component=commonModule('components/quest-scene-library.tsx',{'@/lib/art/questCinematicsV34':registry,'./hud-icon':hud,'./quest-scene-library.module.css':{library:'library',grid:'grid',card:'card',unlocked:'unlocked',locked:'locked',poster:'poster',lockTag:'lockTag',content:'content',label:'label',actors:'actors',note:'note'}});
function markup(engine){return renderToStaticMarkup(react.createElement(component.QuestSceneLibrary,{s:engine.state,engine,onReplay:()=>{},focusId:long[0].id}));}
{
 const engine=game(),html=markup(engine);
 equal((html.match(/data-quest-scene=/g)||[]).length,5,'all five mission memories have actual cards');equal((html.match(/disabled=""/g)||[]).length,5,'all unseen replay buttons are visibly disabled');
 for(const quest of long){check(html.includes(`data-quest-scene="${quest.id}"`),'each intended film appears once');check(html.includes(`/assets/v34/quest-cinematics/${quest.id}.jpg`),'library uses the native final poster path');}
 check(html.includes('MEMÓRIA BLOQUEADA')&&html.includes('Conclua a história'),'locked cards explain the unlock requirement');check(!html.includes('<video')&&!/\/act-[123]\.png/.test(html),'opening Cenas does not preload videos or old large atlases');
 engine.state.progress.questsV31.records[long[0].id]=completedRecord(long[0]);const unlocked=markup(engine);
 equal((unlocked.match(/disabled=""/g)||[]).length,4,'only the actually seen film unlocks');check(unlocked.includes('MEMÓRIA LIBERADA'),'seen memory has a distinct accessible status');
 engine.state.progress.questsV31.records[long[1].id]=completedRecord(long[1],{seen:false});check(markup(engine).includes('Assista ao desfecho no Diário'),'pending first-watch film points to its mission completion');
  engine.state.summonBusy=true;equal((markup(engine).match(/disabled=""/g)||[]).length,5,'library cannot interrupt an active reveal');engine.state.summonBusy=false;
  engine.state.mode='battle';equal((markup(engine).match(/disabled=""/g)||[]).length,5,'library cannot launch replay from combat');
}
console.log(`Quest replay v34 PASS: ${checks} checks / five films, seen gate, completed/claimed replay, no save/reward/progression changes, session tokens, Page return-to-Cenas, keyboard containment and focus restoration.`);
