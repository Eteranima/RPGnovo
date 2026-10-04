import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-quests-v31-')),compiled=new Set();
function compile(name){if(compiled.has(name))return;compiled.add(name);let source=readFileSync(`lib/game/${name}.ts`,'utf8');for(const m of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(m[1]);source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);}
compile('engine');
const load=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave,SAVE_KEY,isWalkable,findPath}=await load('engine');
const {QUESTS_V31,QUEST_SITES_V31,questEntityIdV31,CRYSTALS_PER_PULL_V31}=await load('questsV31');
const {normalizeQuestProgressV31,freshQuestProgressV31}=await load('questRuntimeV31');
const {MAPS,STARTING_HERO_IDS}=await load('data');
const {QUESTS}=await load('progression');
let checks=0;const rows=[],store=new Map(),timers=[];
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
global.localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
global.setTimeout=(fn,delay)=>{timers.push({fn,delay});return timers.length;};
const runTimer=()=>{const timer=timers.shift();check(timer,'scheduled action timer exists');timer.fn();};
function game(stage=5){store.clear();timers.length=0;const e=new GameEngine();e.start(false);e.finishCutscene();e.state.stage=stage;e.state.progress.seen=['arrival','harbor','roots','ashwood-arrival'];return e;}
function finishDialogue(e){let n=0;while(e.state.mode==='dialogue'&&!e.state.dialogue?.questChoices){check(++n<20,'dialogue finishes within authored lines');e.nextDialogue();}}
function entry(e,id){return e.questJournalV31().find(q=>q.id===id);}
function visit(e,site){e.state.mode='world';e.state.map=site.map;e.state.position={x:site.x,y:site.y};check(isWalkable(e.map,site.x,site.y),`${site.questId||''}/${site.id} site is walkable`);e.paused=false;}
function interactSite(e,q,site,option=0){
 visit(e,site);const id=questEntityIdV31(q.id,site.id);check(e.activeEntities().some(s=>s.id===id),'active site is actually exposed in the world');e.interact(id);finishDialogue(e);
 if(site.choices){const d=e.state.dialogue;check(d?.questChoices?.length===site.choices.length,'production dialogue exposes authored choices');
  if(site.kind==='puzzle'){
   const wrong=site.choices.find(c=>c.correct===false),before=structuredClone(e.state.progress.questsV31);
   if(wrong){check(e.chooseQuestV31(wrong.id),'wrong puzzle answer receives feedback');equal(e.state.progress.questsV31,before,'wrong answer cannot advance or store a consequence');check(e.state.dialogue.questChoices.length>0,'wrong answer can be retried');}
  }
  const selected=site.kind==='puzzle'?site.choices.find(c=>c.correct===true):site.choices[option%site.choices.length];
  check(e.chooseQuestV31(selected.id),'authored answer/decision succeeds');finishDialogue(e);
 }else if(site.kind==='combat'){
  check(e.state.mode==='battle'&&e.state.battle.entityId===id,'context combat really starts');
  const b=e.state.battle;equal(b.family,site.combat.family,'context combat uses approved family');
  b.hp=1;b.busy=false;b.queue=[e.state.heroes[0].id];b.index=0;
  check(e.action('attack'),'real basic attack accepted');runTimer();equal(b.hp,0,'real impact defeats context opponent');runTimer();check(b.result==='victory','actual nextActor produces victory');
  e.finishBattle();check(e.state.mode==='world','context victory returns to world');timers.length=0;
 }
}
function performObjective(e,q,o){
 if(o.event==='ui'){check(e.reportQuestTutorialV31(o.target),'UI event accepted on actual tutorial stage');return;}
 if(o.event==='track'){check(e.trackQuestV31(q.id),'tracking teaches real diary tracking');return;}
 if(o.event==='travel'){e.travel('arquivo',{x:11,y:14.5});if(e.state.cutscene)e.finishCutscene();return;}
 if(o.event==='leader'){check(e.selectPartySlot(0),'single available hero slot can teach leader selection');return;}
 if(o.event==='crystal'){const crystal=MAPS.patio.entities.find(s=>s.kind==='save');e.state.map='patio';e.state.position={x:crystal.x,y:crystal.y};e.interact(crystal.id);return;}
 if(o.event==='move'){e.state.map='patio';e.state.position={x:14,y:12};e.keys.add('d');for(let i=0;i<55;i++)e.update(.04);e.keys.clear();return;}
 throw new Error(`Unexpected standalone objective ${o.event}`);
}
function walkthrough(e,q,option=0){
 check(e.startQuestV31(q.id),`accept ${q.id}`);const before=e.state.progress.crystals;
 let loops=0;
 while(entry(e,q.id).status==='active'){
  check(++loops<25,'finite quest stages');const index=e.state.progress.questsV31.records[q.id].step,step=q.steps[index];
  if(q.id==='tutorial-guarda'){
   const site=q.steps[0].sites[0];visit(e,site);e.interact(questEntityIdV31(q.id,site.id));finishDialogue(e);const b=e.state.battle;
   check(b,'training starts');b.busy=false;b.queue=[e.state.heroes[0].id];b.index=0;check(e.action('guard'),'training accepts guard');runTimer();equal(b.hp,0,'guard actually ends the nonlethal exercise');runTimer();check(b.result==='victory','training produces victory');e.finishBattle();timers.length=0;
  }else if(step.sites.length){for(const site of step.sites)interactSite(e,q,site,option);}else for(const o of step.objectives)performObjective(e,q,o);
  const raw=JSON.stringify(e.saved||{...e.state});check(parseSave(raw),'each completed stage has a valid persistent save');
 }
 if(q.cinematic){
  equal(entry(e,q.id).status,'cinematic','long story waits for its full cinematic');check(e.state.questCinematic?.questId===q.id,'final dialogue launches correct full48frame cinematic');
  check(!e.claimQuestV31(q.id),'cinematic cannot receive a prize before explicit close');check(!e.chooseQuestV31('invented'),'cinematic blocks stale choices');
  const parsed=parseSave(store.get(SAVE_KEY));check(parsed,'pending cinematic saves valid state');const resumed=new GameEngine();resumed.saved=parsed;resumed.start(true);
  equal(entry(resumed,q.id).status,'cinematic','reload preserves pending cinematic');check(resumed.resumeQuestCinematic(q.id),'pending cinema resumes from diary');check(resumed.finishQuestCinematic(option>0),'Continue or Skip explicitly releases completion');equal(entry(resumed,q.id).status,'complete','explicit close completes long story');
  e.state=resumed.state;e.saved=resumed.saved;
 }
 equal(e.state.progress.crystals,before,'story stages and choices do not mint crystals before claim');check(e.claimQuestV31(q.id),'one-time reward can be claimed');equal(e.state.progress.crystals,before+q.rewardPulls*160,'reward buys exact advertised real character pulls');
 const awarded=e.state.progress.crystals;check(!e.claimQuestV31(q.id),'repeated button cannot pay twice');check(!e.startQuestV31(q.id),'completed quest cannot restart');e.save(true);
 const resumed=new GameEngine();resumed.saved=parseSave(store.get(SAVE_KEY));check(resumed.saved,'claimed reward save parses');resumed.start(true);check(!resumed.claimQuestV31(q.id),'reload cannot claim twice');equal(resumed.state.progress.crystals,awarded,'reload keeps one exact payout');
 return e;
}

equal(QUESTS_V31.length,30,'exactly30newquests');equal(Object.fromEntries(['long','medium','short','tutorial'].map(k=>[k,QUESTS_V31.filter(q=>q.category===k).length])),{long:5,medium:5,short:10,tutorial:10},'required category counts');equal(new Set(QUESTS_V31.map(q=>q.id)).size,30,'unique persistent IDs');equal(QUESTS_V31.reduce((n,q)=>n+q.rewardPulls,0),60,'approved total60pulls');equal(CRYSTALS_PER_PULL_V31,160,'same currency conversion as production character draw');for(const id of ['supplies','patrol','glyph','garden','orfeu-map','ava-seeds','max-patrol','echo'])check(QUESTS.some(q=>q.id===id),'existing quest remains present');
for(const q of QUESTS_V31){check(q.steps.length>0,'authored story has stages');for(const s of q.steps){check(s.objectives.length>0,'no empty stage auto-completes');equal(new Set(s.objectives.map(o=>o.id)).size,s.objectives.length,'objective IDs unique per stage');}equal(new Set(q.steps.flatMap(s=>s.sites.map(p=>p.id))).size,q.steps.reduce((n,s)=>n+s.sites.length,0),'site IDs unique within story');}

// Reachability is measured against real collision rows/props, not the authored coordinate metadata.
for(const site of QUEST_SITES_V31){const map=MAPS[site.map],warp=map.entities.find(e=>e.kind==='warp'&&isWalkable(map,e.x,e.y));check(warp,'map has a reachable entrance');check(isWalkable(map,site.x,site.y),`${site.questId}/${site.id} lies on a real walkable tile`);check(findPath(map,warp,{x:site.x,y:site.y}).length>0||Math.hypot(warp.x-site.x,warp.y-site.y)<1,`${site.questId}/${site.id} can be reached from map entrance`);const nearby=map.entities.filter(e=>Math.hypot(e.x-site.x,e.y-site.y)<.75);check(!nearby.some(e=>['warp','boss'].includes(e.kind)),`${site.questId}/${site.id} does not hide a door or boss`);}
rows.push(`${QUEST_SITES_V31.length} authored sites validated against world collisions and paths.`);

for(const q of QUESTS_V31){walkthrough(game(),q);rows.push(`${q.id}: all stages, real interactions, puzzle retries/choices, save validation and unique payout passed.`);}
for(const q of QUESTS_V31.filter(q=>q.category==='long')){const a=walkthrough(game(),q,0),b=walkthrough(game(),q,1);check(entry(a,q.id).consequences.length>0,'long ending has persistent consequences');check(JSON.stringify(entry(a,q.id).consequences)!==JSON.stringify(entry(b,q.id).consequences),'alternative ending preserves a genuinely different consequence');equal(a.state.progress.crystals,b.state.progress.crystals,'choice endings pay equally');}

// The signal puzzle has physical, ordered contacts and resumes partway through a route.
{
 const e=game(),q=QUESTS_V31.find(q=>q.id==='long-trovao');e.startQuestV31(q.id);for(const step of q.steps.slice(0,2))for(const site of step.sites)interactSite(e,q,site);
 const ordered=q.steps[2];check(ordered.sequence,'production circuit has ordered contacts');const before=structuredClone(e.state.progress.questsV31);interactSite(e,q,ordered.sites[2]);equal(e.state.progress.questsV31,before,'trying last contact first cannot connect circuit');
 interactSite(e,q,ordered.sites[0]);check(parseSave(store.get(SAVE_KEY)),'first contact persists a valid partial circuit');const saved=parseSave(store.get(SAVE_KEY));const resumed=new GameEngine();resumed.saved=saved;resumed.start(true);equal(resumed.state.progress.questsV31,e.state.progress.questsV31,'partial circuit survives reload');
 const malformed=structuredClone(saved.progress.questsV31);malformed.records[q.id].counts['2:orbita-livre']=1;equal(normalizeQuestProgressV31(malformed),null,'save cannot leap across missing middle contact');
 interactSite(resumed,q,ordered.sites[2]);equal(resumed.state.progress.questsV31.records[q.id].step,2,'out of order retry preserves next expected step');interactSite(resumed,q,ordered.sites[1]);interactSite(resumed,q,ordered.sites[2]);equal(resumed.state.progress.questsV31.records[q.id].step,3,'all three physical contacts advance the route');
}
{
 const q=QUESTS_V31.find(q=>q.id==='long-tinta'),e=walkthrough(game(),q),last=q.steps.at(-1).sites[0],crystals=e.state.progress.crystals,progress=structuredClone(e.state.progress.questsV31);visit(e,last);check(e.activeEntities().some(s=>s.id===questEntityIdV31(q.id,last.id)),'completed long leaves a readable memory in the world');e.interact(questEntityIdV31(q.id,last.id));equal(e.state.dialogue.lines.map(l=>l.text),entry(e,q.id).consequences,'world consequence reflects the chosen ending');finishDialogue(e);equal(e.state.progress.questsV31,progress,'rereading consequence cannot reopen the quest');equal(e.state.progress.crystals,crystals,'rereading memory cannot duplicate payout');check(!e.finishQuestCinematic(),'stale cinema callback cannot complete twice');
}

{
 const e=game(0);for(const q of QUESTS_V31.filter(q=>q.minStage>0)){check(!e.startQuestV31(q.id),'story cannot bypass progression gate');equal(entry(e,q.id).status,'locked','diary reports gate');}
 for(const q of QUESTS_V31.filter(q=>q.category==='tutorial'))check(e.startQuestV31(q.id),'all tutorials open at stage0 without paid resources');
 e.state.progress.crystals=0;e.state.progress.tokens=0;e.state.progress.summoned=[];
 check(e.reportQuestTutorialV31('gacha-preview'),'gacha tutorial reads rules at zero balance');equal(e.state.progress.crystals,0,'viewing gacha rules costs nothing');equal(e.state.progress.characterRolls,0,'no draw needed for gacha tutorial');
 check(!e.reportQuestTutorialV31('pay-or-roll'),'unknown UI event cannot award progress');
}
{
 const e=game();e.save(true);const legacy=JSON.parse(store.get(SAVE_KEY));delete legacy.progress.questsV31;const parsed=parseSave(JSON.stringify(legacy));check(parsed,'v2 legacy save without new field migrates');equal(parsed.progress.questsV31,freshQuestProgressV31(),'migration starts empty without retroactive rewards');equal(parsed.progress.crystals,legacy.progress.crystals,'migration preserves purse');equal(parsed.progress.questClaims,legacy.progress.questClaims,'migration preserves legacy rewards');
 equal(normalizeQuestProgressV31(undefined),freshQuestProgressV31(),'missing state is supported');
 const q=QUESTS_V31[0],corrupt=[null,{},[],{version:2,tracked:null,records:{}},{version:1,tracked:null,records:{[q.id]:{step:99,counts:{},choices:{},cinematicSeen:false,claimed:false}}},{version:1,tracked:null,records:{[q.id]:{step:q.steps.length,counts:{},choices:{},cinematicSeen:true,claimed:true}}}];
 for(const state of corrupt){equal(normalizeQuestProgressV31(state),null,'malformed or unproven completed state is rejected');const save=structuredClone(legacy);save.progress.questsV31=state;equal(parseSave(JSON.stringify(save)),null,'save parser rejects forged quest reward state');}
 check(e.startQuestV31(q.id),'accept for state validation');const valid=structuredClone(e.state.progress.questsV31);for(const key of ['step','claimed','cinematicSeen']){const bad=structuredClone(valid);bad.records[q.id][key]=key==='step'?1:true;equal(normalizeQuestProgressV31(bad),null,'future stage/completion flag requires real prior objectives');}
}
{
 const e=game();const q=QUESTS_V31.find(q=>q.id==='short-etiquetas');check(e.startQuestV31(q.id),'accept investigation');const site=q.steps[0].sites[0];visit(e,site);e.state.position={x:1,y:1};e.interact(questEntityIdV31(q.id,site.id));equal(e.state.progress.questsV31.records[q.id].step,0,'distant click cannot collect evidence');e.paused=true;e.state.position={x:site.x,y:site.y};e.interact(questEntityIdV31(q.id,site.id));equal(e.state.progress.questsV31.records[q.id].step,0,'paused world cannot collect evidence');e.paused=false;interactSite(e,q,site);equal(e.state.progress.questsV31.records[q.id].step,1,'nearby completed dialogue collects evidence');
 const decision=q.steps[1].sites[0];visit(e,decision);e.interact(questEntityIdV31(q.id,decision.id));finishDialogue(e);e.nextDialogue();check(e.state.dialogue?.questChoices,'Enter cannot choose an answer');const before=structuredClone(e.state.progress.questsV31);check(!e.chooseQuestV31('not-authored'),'unknown answer is rejected');equal(e.state.progress.questsV31,before,'unknown answer cannot mutate state');
}
{
 const e=game(),q=QUESTS_V31.find(q=>q.id==='tutorial-guarda'),before=structuredClone({heroes:e.state.heroes,limit:e.state.progress.limit,xp:e.state.progress.xp,credits:e.state.credits,kills:e.state.progress.kills,tokens:e.state.progress.tokens});e.startQuestV31(q.id);const site=q.steps[0].sites[0];visit(e,site);e.interact(questEntityIdV31(q.id,site.id));finishDialogue(e);const b=e.state.battle;b.hp=0;b.result='victory';e.finishBattle();equal(entry(e,q.id).status,'active','winning without guard cannot skip lesson');equal(e.state.progress.questsV31.records[q.id].step,1,'guard objective remains after premature win');check(e.activeEntities().some(s=>s.id===questEntityIdV31(q.id,site.id)),'training site remains available for retry');equal({heroes:e.state.heroes,limit:e.state.progress.limit,xp:e.state.progress.xp,credits:e.state.credits,kills:e.state.progress.kills,tokens:e.state.progress.tokens},before,'free tutorial cannot farm ordinary rewards or drain vitals');
 e.save(true);const resumed=new GameEngine();resumed.saved=parseSave(store.get(SAVE_KEY));resumed.start(true);equal(entry(resumed,q.id).status,'active','retry survives reload');visit(resumed,site);resumed.interact(questEntityIdV31(q.id,site.id));finishDialogue(resumed);const retry=resumed.state.battle;retry.busy=false;retry.queue=[resumed.state.heroes[0].id];retry.index=0;const resources=structuredClone({potions:resumed.state.potions,ethers:resumed.state.ethers,mp:resumed.state.heroes[0].mp});check(!resumed.action('potion')&&!resumed.action('cut'),'free guard training cannot consume items or spell MP');equal({potions:resumed.state.potions,ethers:resumed.state.ethers,mp:resumed.state.heroes[0].mp},resources,'blocked paid actions preserve resources');resumed.state.heroes[0].hp--;check(resumed.action('flee'),'training can be stopped');equal(resumed.state.heroes,before.heroes,'leaving training restores prior vitals');equal(entry(resumed,q.id).status,'active','leaving training permits retry');
}
for(const origin of STARTING_HERO_IDS){const e=game();check(e.start(false,origin)!==false,'five existing origins remain selectable');equal(e.state.progress.protagonist,origin,'new campaign uses requested permitted origin');}
for(const origin of ['ava','orfeu','beatriz','carmilla','invented']){const e=game();const before=JSON.stringify(e.state);equal(e.start(false,origin),false,'professors/nonorigin IDs cannot become campaign origins');equal(JSON.stringify(e.state),before,'rejected origin does not reset save');}

rows.unshift(`PASS: ${checks} checks. 30 new quests, 60 one-time real pulls / 9600 crystals.`);
mkdirSync('docs/qa-v31',{recursive:true});writeFileSync('docs/qa-v31/quests-test.txt',`${rows.join('\n')}\n`);console.log(rows.join('\n'));
