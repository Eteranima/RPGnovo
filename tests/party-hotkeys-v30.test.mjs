import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-party-hotkeys-v30-')),compiled=new Set();
function compile(name){
 if(compiled.has(name))return;compiled.add(name);
 let source=readFileSync(`lib/game/${name}.ts`,'utf8');
 for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);
 source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
for(const name of ['engine','master-mode'])compile(name);
const imported=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave,SAVE_KEY}=await imported('engine');
const {HERO_IDS}=await imported('data');
const {deriveHeroes}=await imported('progression');
const {advanceMasterSequence,emptyMasterSequence}=await imported('master-mode');
let checks=0;const store=new Map();
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
global.localStorage={setItem:(key,value)=>store.set(key,value),getItem:key=>store.get(key)||null};
global.setTimeout=()=>1;
function fresh(count=5){
 store.clear();const game=new GameEngine();game.start(false);game.finishCutscene();
 const p=game.state.progress;p.recruited=[...HERO_IDS];p.party=HERO_IDS.slice(0,count);p.leaderId=p.party[0];game.state.heroes=deriveHeroes(p);
 game.state.heroes.forEach((h,i)=>{h.hp=h.maxHp-7-i;h.mp=h.maxMp-3-i;p.limit[h.id]=17+i*13;});
 return game;
}
const partyState=game=>structuredClone({party:game.state.progress.party,heroes:game.state.heroes,limit:game.state.progress.limit,reserveVitals:game.state.progress.reserveVitals});

// Execute the production handler itself, rather than copying its key-to-slot decisions.
const page=ts.createSourceFile('app/page.tsx',readFileSync('app/page.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let down;
function visit(node){if(ts.isVariableDeclaration(node)&&node.name.getText(page)==='down'&&ts.isArrowFunction(node.initializer))down=node.initializer;ts.forEachChild(node,visit);}visit(page);
check(down,'production keydown handler found');
const handlerSource=`const bind=(engine,panelRef,openingRef,setTarget,loadingState=null)=>{const renderer={current:{getLoadingState:()=>loadingState}};let masterSequence=emptyMasterSequence();const loadedRef={current:false},armedRef={current:false};const setPanel=()=>{},activateTitle=()=>{},openMenu=()=>{},toggleMusic=()=>{};const down=${down.getText(page)};return down;};`;
const handlerJs=ts.transpileModule(handlerSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
class TestElement{constructor(selector=''){this.selector=selector;}closest(selector){return this.selector&&selector.includes(this.selector)?this:null;}}
const bindHandler=new Function('Element','advanceMasterSequence','emptyMasterSequence',`${handlerJs};return bind;`)(TestElement,advanceMasterSequence,emptyMasterSequence);
function keyboard(game,loadingState=null){const targets=[],panelRef={current:null},openingRef={current:false},down=bindHandler(game,panelRef,openingRef,id=>targets.push(id),loadingState);return {targets,panelRef,openingRef,press(key,{repeat=false,target=null}={}){let prevented=0;down({key,repeat,target,preventDefault:()=>prevented++});return prevented;}};}

// The synchronous opening ref protects the gap before the modal's capture
// listener mounts and before React applies the engine's paused state.
{
 const game=fresh(),before=partyState(game),keys=keyboard(game);keys.openingRef.current=true;
 game.keys.add('w');game.path=[{x:15,y:12}];game.pending='library';
 for(const key of ['1','2','3','4','5','Tab','w','e','q','r','g','p',' ','Enter','Escape'])equal(keys.press(key),1,'opening consumes gameplay input before modal listeners mount');
 equal(game.state.mode,'world','opening input never starts or exits adventure');equal(game.leader().id,'seiji','opening cannot change exploration leader');equal(partyState(game),before,'opening preserves slots, vitals, limits and reserve');equal(keys.targets,[],'opening cannot select a battle target');
 check(!game.keys.size&&!game.path.length&&!game.pending,'opening removes held movement, pending interaction and path');equal(keys.press('F5'),0,'browser refresh remains available while opening is visible');
 keys.openingRef.current=false;keys.press('3');equal(game.leader().id,before.party[2],'closing opening restores normal party shortcuts');
 game.beginBattle({id:'opening-input-isolation',kind:'mob',label:'Fila de teste',asset:'shadow',family:'sombra',hp:5000,damage:1,x:1,y:1});keys.openingRef.current=true;
 const battleBefore=structuredClone(game.state.battle),targetsBefore=keys.targets.length;keys.press('2');keys.press('Tab');equal(game.state.battle,battleBefore,'opening cannot alter a battle queue or actor');equal(keys.targets.length,targetsBefore,'opening cannot change the selected healing/item target');
}

for(const status of [{loading:true,error:null},{loading:false,error:'asset failed'}]){
 const game=fresh(),before=partyState(game),keys=keyboard(game,status);game.keys.add('w');game.path=[{x:15,y:12}];
 equal(keys.press('3'),1,'loading or failure consumes game input');equal(game.leader().id,'seiji','loading never changes leader');equal(partyState(game),before,'loading preserves all party data');check(!game.keys.size&&!game.path.length,'loading clears old movement');
 equal(keys.press('F5'),0,'browser refresh stays available during loading');
}

for(let count=1;count<=5;count++){
 const game=fresh(count),before=partyState(game),keys=keyboard(game);
 for(let slot=0;slot<count;slot++){
  equal(keys.press(String(slot+1)),1,'world number key consumed');equal(game.leader().id,before.party[slot],`key ${slot+1} selects matching world leader`);
  equal(partyState(game),before,'leader selection preserves ordered slots, vitals, limits and reserve');
  equal(game.fieldSlots().map(t=>t.id),game.fieldSlots(before.party[slot]).map(t=>t.id),'quickbar follows selected leader');
 }
 for(let slot=count;slot<5;slot++){const leader=game.leader().id;keys.press(String(slot+1));equal(game.leader().id,leader,'empty number slot cannot select a phantom hero');equal(partyState(game),before,'empty slot preserves party');}
 const start=game.leader().id,offset=before.party.indexOf(start);
 for(let i=1;i<=count;i++){keys.press('Tab');equal(game.leader().id,before.party[(offset+i)%count],'Tab cycles existing leader ID without moving slots');equal(partyState(game),before,'Tab cycle preserves vitals and slot order');}
 equal(game.leader().id,start,'full Tab cycle returns to original leader');
}
{
 const game=fresh(),before=partyState(game);game.keys.add('w');game.path=[{x:15,y:12}];game.pending='library';
 check(game.selectPartySlot(3),'direct slot selection succeeds');equal(game.leader().id,'gabriel','fourth slot selects Gabriel');
 check(!game.keys.size&&!game.path.length&&!game.pending,'changing leader stops old movement/path');equal(partyState(game),before,'movement cleanup does not consume resources');
 game.save();const saved=parseSave(store.get(SAVE_KEY));check(saved,'selected party saves');equal(saved.progress.leaderId,'gabriel','leader ID survives save validation');equal(saved.progress.party,before.party,'save keeps party slots');equal(saved.heroes,before.heroes,'save keeps exact vitals and hero order');equal(saved.progress.limit,before.limit,'save keeps ultimate limits');
 const resumed=new GameEngine();resumed.hydrate();resumed.start(true);equal(resumed.leader().id,'gabriel','reload resumes chosen leader');equal(partyState(resumed),before,'reload keeps ordered slots and resources');
}
for(const invalid of [-1,5,1.5,NaN,Infinity,'1',undefined]){
 const game=fresh(),before=JSON.stringify(game.state);check(!game.selectPartySlot(invalid),'invalid slot rejected');equal(JSON.stringify(game.state),before,'invalid slot cannot emit/save/change state');
}
for(const mode of ['start','selection','dialogue','cutscene','battle']){
 const game=fresh();game.state.mode=mode;const before=JSON.stringify(game.state);
 check(!game.selectPartySlot(1)&&!game.swapLeader(),`leader selection blocked in ${mode}`);equal(JSON.stringify(game.state),before,'blocked mode preserves all state');
 const keys=keyboard(game);keys.press('2');keys.press('Tab');equal(game.leader().id,'seiji','keyboard cannot switch world leader outside exploration');
}
{
 const game=fresh(),keys=keyboard(game),before=partyState(game);game.paused=true;
 check(!game.selectPartySlot(2)&&!game.swapLeader(),'paused engine rejects slot/cycle');keys.press('3');keys.press('Tab');equal(game.leader().id,'seiji','paused keyboard cannot change leader');equal(partyState(game),before,'paused input preserves vitals/order');
 game.paused=false;keys.panelRef.current='menu';keys.press('3');keys.press('Tab');equal(game.leader().id,'seiji','open menu suppresses world number/Tab hotkeys');
 keys.panelRef.current=null;
 equal(keys.press('Tab',{target:new TestElement('[data-exploration-party]')}),0,'Tab on a leader card preserves native keyboard focus');equal(game.leader().id,'seiji','native card navigation does not swap the leader');
 for(const target of [new TestElement('input'),new TestElement('select'),new TestElement('textarea'),new TestElement('[role=slider]')]){keys.press('3',{target});keys.press('Tab',{target});equal(game.leader().id,'seiji','typing/control navigation never changes leader');}
 keys.press('3',{repeat:true});keys.press('Tab',{repeat:true});equal(game.leader().id,'seiji','held/repeated keys do not cycle leader');
}
{
 const game=fresh(),keys=keyboard(game);game.beginBattle({id:'hotkey-regression',kind:'mob',label:'Fila de teste',asset:'shadow',family:'sombra',hp:5000,damage:1,x:1,y:1});
 Object.assign(game.state.battle,{queue:['ophelia','enemy','seiji','max','marin','gabriel'],index:2,busy:true});
 const before=structuredClone(game.state.battle),members=partyState(game),leader=game.leader().id;
 for(let slot=0;slot<5;slot++){equal(keys.press(String(slot+1)),1,'battle number key targets ally');equal(keys.targets.at(-1),members.party[slot],'battle number selects corresponding ally target');equal(game.leader().id,leader,'battle targeting does not change world leader');equal(game.state.battle,before,'battle targeting cannot alter queue, actor, HP, statuses or animation');equal(partyState(game),members,'battle targeting preserves allied vitals/limits/order');}
 keys.press('Tab');equal(game.state.battle,before,'Tab does not cycle or advance battle turns');
 check(!game.selectPartySlot(1)&&!game.swapLeader(),'engine rejects world leader changes during battle');
 game.state.battle.result='victory';const targets=keys.targets.length;keys.press('2');equal(keys.targets.length,targets,'finished battle rejects target shortcut');
}
{
 const game=fresh();game.state.progress.party=['ophelia','max'];game.state.heroes=deriveHeroes(game.state.progress);game.state.progress.leaderId='max';game.save();
 const base=JSON.parse(store.get(SAVE_KEY));
 for(const leader of [undefined,null,'missing','seiji','gabriel']){
  const old=structuredClone(base);if(leader===undefined)delete old.progress.leaderId;else old.progress.leaderId=leader;
  const normalized=parseSave(JSON.stringify(old));check(normalized,'old/corrupt leader field does not destroy valid save');equal(normalized.progress.leaderId,'ophelia','leader outside active party normalizes to first actual slot');equal(normalized.progress.party,['ophelia','max'],'normalization preserves noncanonical party order');equal(normalized.heroes,base.heroes,'normalization preserves saved vitals');
 }
 equal(parseSave(JSON.stringify(base)).progress.leaderId,'max','valid active leader retained even when not first');
}
console.log(`${checks} party hotkey v30 checks passed: real 1–5/Tab bindings, stable party order/vitals/limits, mode/menu/repeat guards, battle target/queue isolation and leader save normalization.`);
