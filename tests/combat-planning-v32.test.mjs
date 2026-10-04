import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-combat-v32-'));
compileGameModules(out,['engine']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave,SAVE_KEY}=await load('engine');
const {MAPS,ENEMY_ULTIMATES,HERO_IDS,heroBases}=await load('data');
const {GEAR}=await load('progression');
const {COMBAT_PREFERENCES_KEY_V32,parseBattleSpeedV32,battleTimingV32}=await load('combatPreferencesV32');
const {gachaSequenceDuration}=await load('gachaSequence');
let checks=0,timers=[],rngReads=0,cases=0;const store=new Map(),report=[];
const check=(v,label)=>{assert.ok(v,label);checks++;};
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
global.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
global.setTimeout=(fn,ms)=>{timers.push({fn,ms});return timers.length;};
Math.random=()=>.99;
function fresh(){store.clear();const e=new GameEngine();e.start(false);e.finishCutscene();timers=[];return e;}
function setup(family,round=1,charge=0){const e=fresh(),entity=Object.values(MAPS).flatMap(m=>m.entities).find(n=>n.family===family||n.id===family);check(entity,'real family encounter exists');e.beginBattle(entity);const b=e.state.battle;Object.assign(b,{round,bossCharge:charge,queue:['enemy','seiji','ophelia'],index:0,busy:false,animation:undefined});e.state.heroes.forEach(h=>{h.hp=h.maxHp=500;h.guard=false;});timers=[];return e;}
function signature(p){return p&&{round:p.round,action:p.action,name:p.name,kind:p.kind,element:p.element,targets:p.targets,area:p.area,chargeBefore:p.chargeBefore,chargeAfter:p.chargeAfter,missChance:p.missChance,blockedBy:p.blockedBy,controlAvailable:p.controlAvailable};}
function forecast(e){const before=JSON.stringify({b:e.state.battle,p:e.state.progress,h:e.state.heroes});const random=Math.random;Math.random=()=>{throw Error('forecast must not read RNG');};const p=e.enemyIntentV32();Math.random=random;equal(JSON.stringify({b:e.state.battle,p:e.state.progress,h:e.state.heroes}),before,'forecast has no side effects');return p;}
function runEnemy(e,miss=false){
 const b=e.state.battle,preview=forecast(e);check(preview,'enemy forecast available');const hp=e.state.heroes.map(h=>h.hp),charge=b.bossCharge;
 rngReads=0;Math.random=()=>{rngReads++;return miss?.25:.99;};e.nextActor();const a=b.animation;
 equal(signature(e.enemyIntentV32()),signature(preview),'captured acting intent equals the pre-action plan');equal(e.enemyIntentV32().phase,'in-progress','animation exposes captured in-progress plan');equal(a.action,preview.action,'same resolver selects actual enemy action');equal(a.element,preview.element,'forecast element equals rendered action');
 equal(e.state.heroes.map(h=>h.hp),hp,'damage does not happen before the impact callback');check(!a.enemyOutcomeV32,'forecast is not falsely recorded as an impact result');check(b.busy,'commands locked until authored recovery');
 const impact=timers.find(t=>t.ms===a.impactAt),recovery=timers.find(t=>t.ms===a.duration);check(impact&&recovery,'impact and cleanup are distinct scheduled callbacks');impact.fn();
 const didMiss=miss&&preview.missChance>0;
 if(preview.kind!=='blocked'){equal(a.enemyOutcomeV32.missed,didMiss,'outcome reports the actual RNG result');equal(a.enemyOutcomeV32.targets.length,didMiss?0:preview.targets.length,'a missed action cannot display predicted hits as damage');}
 for(let i=0;i<e.state.heroes.length;i++){
  const h=e.state.heroes[i],target=preview.targets.find(t=>t.id===h.id);equal(hp[i]-h.hp,target&&!didMiss?target.damageOnHit:0,'forecast matches damage applied to each actual target');
  if(target?.status){const applied=b.statuses[h.id].some(s=>s.id===target.status);equal(applied,!didMiss&&!target.statusPrevented,'forecast identifies statuses actually applied/prevented');if(applied)equal(b.statuses[h.id].find(s=>s.id===target.status).turns,target.statusTurns,'status duration remains in actor actions');}
  const outcome=a.enemyOutcomeV32?.targets.find(t=>t.id===h.id);if(outcome){equal(outcome.hpLost,hp[i]-h.hp,'outcome records actual HP lost');equal(outcome.guardSavedHp,target.guardSavedHp,'guard result is recorded only after real impact');equal(outcome.status,target.status&&!target.statusPrevented?target.status:null,'outcome records only actually applied status');}
 }
 equal(b.bossCharge,preview.kind==='blocked'?charge:preview.chargeAfter,'charge matches forecast, including guarded/missed/skipped actions');equal(rngReads,preview.missChance&&preview.kind!=='blocked'?1:0,'RNG is only read at the real blind impact');
 recovery.fn();const after=e.state.heroes.map(h=>h.hp);impact.fn();equal(e.state.heroes.map(h=>h.hp),after,'stale impact cannot hit again after recovery and next-actor status processing');
 Math.random=()=>.99;cases++;return preview;
}
for(const family of Object.keys(ENEMY_ULTIMATES))for(const round of [1,2])for(const charge of [0,100])for(const state of [null,'silence','freeze','bind','blind'])for(const guarded of [false,true]){
 const e=setup(family,round,charge);e.state.battle.statuses.enemy=state?[{id:state,turns:1}]:[];e.state.heroes.forEach(h=>h.guard=guarded);const p=runEnemy(e,state==='blind');
 if(state==='blind')for(const t of p.targets)equal(t.damageRange,[0,t.damageOnHit],'blind forecast shows a range and 50% miss chance');
 if(state==='silence')check(p.kind!=='ultimate'&&p.area===false,'silence prevents ultimate and collapse without deleting charge');
}
report.push(`${cases} real family scenarios: preview/execution equivalence through actual callbacks, controls, RNG boundaries, guard, status and stale timer cleanup.`);
for(const family of Object.keys(ENEMY_ULTIMATES)){const e=setup(family,2,100);e.state.battle.statuses.enemy=[{id:'blind',turns:1}];runEnemy(e,false);}

// Golden legacy values guard against a shared resolver and executor drifting together.
for(const [charge,guarded,action,damage,status] of [[99,false,'collapse',29,true],[100,false,'boss-ultimate',46,true],[100,true,'boss-ultimate',21,false]]){
 const e=setup('cinder',2,charge);e.state.heroes.forEach(h=>h.guard=guarded);const p=runEnemy(e);equal(p.action,action,'Cinder legacy action is unchanged');equal(p.targets.map(t=>t.damageOnHit),[damage,damage],'Cinder legacy damage rounding is unchanged');equal(p.targets.map(t=>!t.statusPrevented),[status,status],'Cinder legacy guard blocks status');
}
{
 const e=setup('cinder',2,100);e.state.battle.statuses.enemy=[{id:'silence',turns:1}];const p=runEnemy(e);equal(p.element,'fire','existing silenced hit still carries Fire');equal(p.targets.map(t=>t.id),['ophelia'],'even round rotates single-target hit to living ally');equal(p.targets[0].status,'silence','existing silenced even-round hit still threatens silence');equal(p.chargeAfter,100,'silence preserves stored ultimate charge');
}
for(const id of HERO_IDS)for(const round of [1,2])for(const charge of [0,100]){
 const e=fresh(),base=heroBases().find(h=>h.id===id);e.beginBattle({id:`duel-${id}`,eventId:`recruit-${id}`,kind:'mob',asset:id,family:'sombra',label:`Duelo de recrutamento · ${base.name}`,x:0,y:0,hp:500,damage:16,xp:80,credits:90});Object.assign(e.state.battle,{round,bossCharge:charge,queue:['enemy','seiji','ophelia'],index:0,busy:false,animation:undefined});e.state.heroes.forEach(h=>{h.hp=h.maxHp=500;});timers=[];const p=runEnemy(e);equal(p.targets.length,1,'every actual recruitment duel remains single-target');check(!p.area,'duel never becomes a family-wide area ultimate');
}
report.push('Golden legacy Cinder outcomes retained; all5 origin-hero duels validated at odd/even rounds with normal/ultimate charge.');

{
 const e=setup('cinder',1,50),b=e.state.battle;b.hp=Math.floor(b.maxHp*.3);const p=runEnemy(e);equal(b.phase,3,'real pre-turn phase transition occurs');equal(p.chargeBefore,75,'forecast includes exactly one25-charge phase transition');equal(p.targets[0].damageOnHit,b.baseDamage+8,'forecast includes phase3 damage');
}
for(const [hp,phase] of [[203,1],[103,2]])for(const charge of [75,100])for(const frozen of [false,true]){
 const e=setup('cinder',1,charge),b=e.state.battle;
 Object.assign(b,{maxHp:300,hp,phase,damage:b.baseDamage+(phase-1)*4});
 b.statuses.enemy=[{id:'bleed',turns:1},...(frozen?[{id:'freeze',turns:1}]:[])];
 const preview=forecast(e),damageBefore=b.damage;equal(preview.chargeBefore,charge,'pending bleed does not add premature phase charge');equal(preview.kind,frozen?'blocked':charge===100?'ultimate':'attack','pending bleed retains legacy action selection');
 e.nextActor();const animation=b.animation;
 equal(b.hp,hp-6,'actual pre-action bleed crosses the phase threshold');equal(b.phase,phase,'phase stays unchanged until the following actor starts');equal(b.damage,damageBefore,'current action retains damage from the existing phase');equal(signature(e.enemyIntentV32()),signature(preview),'threshold bleed forecast agrees with the captured actual action');
 const impact=timers.find(t=>t.ms===animation.impactAt),recovery=timers.find(t=>t.ms===animation.duration);check(impact&&recovery,'threshold scenario schedules real impact and recovery');
 const allyHp=e.state.heroes.map(h=>h.hp);impact.fn();
 equal(b.bossCharge,frozen?charge:preview.chargeAfter,'threshold action charge has no premature phase bonus');equal(b.phase,phase,'impact does not promote the boss phase');
 equal(e.state.heroes.map((h,i)=>allyHp[i]-h.hp),e.state.heroes.map(h=>preview.targets.find(t=>t.id===h.id)?.damageOnHit||0),'threshold action applies exactly forecast damage or a frozen skip');
 recovery.fn();equal(b.phase,phase+1,'following actor applies the legacy phase transition');equal(b.bossCharge,Math.min(100,(frozen?charge:preview.chargeAfter)+25),'following actor adds the phase charge exactly once');
 check(!b.statuses.enemy.some(s=>s.id==='bleed'||s.id==='freeze'),'threshold controls expire by actor action');
}
report.push('Bleed crossing both boss phase thresholds (203→197 and103→97 HP of300): 75/100 charge and frozen skips retain forecast/execution equality, original phase damage and action; the next actor applies the phase/25-charge transition once.');
{
 const e=setup('lobo',1,50),b=e.state.battle;Object.assign(b,{queue:['enemy','seiji','ophelia'],index:1,hp:9999,maxHp:9999});e.state.heroes.forEach(h=>{h.guard=true;h.spd=30;});e.nextActor();timers=[];const p=forecast(e);equal(p.round,2,'after enemy has acted, forecast points to next round');check(p.startsNextRound&&p.timing==='next-round','UI distinguishes future round');check(p.targets.every(t=>!t.guarded),'old guards expire when their hero acts before the next enemy');
 let actions=0;while(e.currentHero()&&actions++<8){check(e.action('attack'),'real hero chooses an attack while awaiting enemy');const pair=timers.splice(0,2);pair[0].fn();pair[1].fn();}
 equal(signature(e.enemyIntentV32()),signature(p),'next-round forecast matches the next actual enemy action after real hero turns');
}
{
 const e=setup('lobo',2,0);e.state.heroes[0].hp=0;const p=runEnemy(e);equal(p.targets.map(t=>t.id),['ophelia'],'target rotation excludes already defeated allies');
}
{
 const e=setup('lobo',1,0),b=e.state.battle;Object.assign(b,{queue:['seiji','ophelia','enemy'],index:0,hp:9999,maxHp:9999});b.statuses.ophelia=[{id:'bleed',turns:1}];e.state.heroes[1].hp=6;e.nextActor();timers=[];const p=forecast(e);equal(p.targets.map(t=>t.id),['seiji'],'forecast excludes ally who will deterministically fall to bleed before the enemy slot');check(e.action('attack'),'current hero can complete actual action');const pair=timers.splice(0,2);pair[0].fn();pair[1].fn();equal(signature(e.enemyIntentV32()),signature(p),'future bleed target projection matches real nextActor death processing');
}
{
 const e=setup('cinder',2,0),b=e.state.battle;Object.assign(b,{queue:['seiji','ophelia','enemy'],index:0,hp:9999,maxHp:9999});e.state.heroes[1].guard=true;b.statuses.ophelia=[{id:'freeze',turns:1}];e.nextActor();timers=[];const p=forecast(e);check(p.targets.find(t=>t.id==='ophelia').guarded,'forced frozen skip retains the ally guard according to existing rules');check(e.action('guard'),'current hero chooses actual guard');let pair=timers.splice(0,2);pair[0].fn();pair[1].fn();pair=timers.splice(0,2);pair[0].fn();pair[1].fn();const actual=e.enemyIntentV32();check(actual.targets.find(t=>t.id==='ophelia').guarded,'actual frozen skip keeps guard until enemy impact');
}
{
 const e=setup('lobo',1,0),b=e.state.battle;b.hp=6;b.statuses.enemy=[{id:'bleed',turns:1},{id:'freeze',turns:1}];equal(forecast(e),null,'enemy dying from its pending bleed has no false freeze/attack promise');e.nextActor();equal(b.result,'victory','real bleed wins before enemy acts');
}
{
 const e=setup('cinder',2,100);check(e.addStatus('enemy','freeze',1),'first imobilization succeeds');check(!e.addStatus('enemy','bind',1),'second imobilization is still rejected');check(!forecast(e).controlAvailable,'forecast exposes the existing one-imobilization limit');runEnemy(e);
}
{
 const e=setup('cinder',2,100),p=e.state.progress;const pieces=Object.values(GEAR).filter(g=>g.set==='ember').slice(0,6);equal(pieces.length,6,'real immunity equipment set exists');p.equipment.seiji=Object.fromEntries(pieces.map(g=>[g.slot,g.id]));const preview=runEnemy(e);check(preview.targets.find(t=>t.id==='seiji').statusPrevented,'forecast respects actual gear status immunity');
}
report.push('Queue wrap, defeated targets, pre-turn boss phases, pending bleed victory, shared freeze/bind limit and equipment immunity validated.');

for(const speed of [1,2])for(const [action,base] of [['attack',1200],['guard',700],['shard',1600],['ultimate',4800],['frozen',650],['bound',650]]){
 const e=setup('lobo'),b=e.state.battle;Object.assign(b,{queue:['seiji','ophelia','enemy'],index:0,busy:false,animation:undefined});timers=[];e.setBattleSpeedV32(speed);let hits=0;
 e.playAction('seiji',action,'enemy',()=>hits++,base);const a=b.animation,oldTimers=timers.slice();equal(a.speed,speed,'animation captures chosen speed');equal(a.duration,base/speed,'only battle action duration scales');equal(a.impactAt,Math.round(a.duration*(action==='ultimate'?.68:.55)),'authored impact proportion remains unchanged');
 e.setBattleSpeedV32(speed===1?2:1);equal(a.speed,speed,'changing preference cannot retime active animation');equal(timers,oldTimers,'changing preference cannot reschedule pending callbacks');check(!e.action('attack'),'speed controls do not unlock busy actions');
 oldTimers[0].fn();equal(hits,1,'scaled impact fires exactly once');oldTimers[1].fn();oldTimers[0].fn();equal(hits,1,'old impact is invalid after cleanup');equal(b.index,1,'scaled cleanup preserves actual turn queue');
}
for(const speed of [1,2])for(const control of ['freeze','bind']){
 const e=setup('lobo');e.setBattleSpeedV32(speed);e.state.battle.statuses.enemy=[{id:control,turns:1}];timers=[];e.nextActor();const b=e.state.battle,a=b.animation;equal(a.duration,650/speed,'enemy control skip delay scales with preference');timers[0].fn();timers[1].fn();check(!b.statuses.enemy.some(s=>s.id===control),'control still expires after one action, not wall-clock turns');
}
for(const raw of [null,'bad','null','{}','{"battleSpeed":0}','{"battleSpeed":3}','{"battleSpeed":1.5}'])equal(parseBattleSpeedV32(raw),1,'invalid/legacy preference defaults to1x');equal(parseBattleSpeedV32('{"battleSpeed":2}'),2,'valid2x preference loads');
{
 const e=fresh();equal(e.state.battleSpeedV32,1,'new engine defaults to1x');let emits=0;e.subscribe(()=>emits++);const beforeSave=store.get(SAVE_KEY);check(e.setBattleSpeedV32(2),'2x is accepted');check(emits>0,'speed setter emits snapshot update');equal(store.get(SAVE_KEY),beforeSave,'preference setter does not rewrite campaign save');check(!e.setBattleSpeedV32(3),'invalid speed is rejected');check(e.save(true),'ordinary save still succeeds');const save=JSON.parse(store.get(SAVE_KEY));check(!('battleSpeedV32' in save)&&!('battleSpeedV32' in save.progress),'speed remains outside persistent progression schema');check(parseSave(store.get(SAVE_KEY)),'legacy save validation remains valid');
 const resumed=new GameEngine();resumed.hydrate();equal(resumed.state.battleSpeedV32,2,'reload restores separate preference');resumed.start(true);equal(resumed.state.battleSpeedV32,2,'resume preserves preference');resumed.saved={...resumed.saved,battleSpeedV32:1};resumed.start(true);equal(resumed.state.battleSpeedV32,2,'unknown snapshot fields in a campaign save cannot override the standalone preference');resumed.start(false);equal(resumed.state.battleSpeedV32,2,'new campaign also preserves preference');
 const originalStorage=global.localStorage;global.localStorage={getItem(){throw Error('unavailable');},setItem(){throw Error('unavailable');}};const denied=new GameEngine();denied.hydrate();equal(denied.state.battleSpeedV32,1,'unavailable storage keeps safe default');check(denied.setBattleSpeedV32(2),'runtime speed works even if preference storage fails');global.localStorage=originalStorage;
}
{
 const e=fresh();e.setBattleSpeedV32(2);e.state.progress.tokens=1;timers=[];check(e.drawCosmetics(1,()=>.99),'gacha still starts normally at2x battle speed');equal(timers[0].ms,gachaSequenceDuration(5),'battle speed does not accelerate gacha');const count=timers.length;e.playCutscene('arrival');equal(timers.length,count,'campaign cinematic gains no speed-driven timer');
}
equal(battleTimingV32(0,2,false).duration,1,'duration is clamped above zero');
for(const invalid of [NaN,Infinity,-Infinity])equal(battleTimingV32(invalid,2,false),{duration:600,impactAt:330},'invalid duration cannot create an unbounded/NaN timer');
{
 const e=fresh();e.setBattleArtGateV32(true);e.state.heroes.forEach(h=>h.spd=1);const boss=MAPS.ashpyre.entities.find(n=>n.id==='cinder');timers=[];e.beginBattle(boss);const b=e.state.battle,hp=e.state.heroes.map(h=>h.hp),resources=JSON.stringify({progress:e.state.progress,credits:e.state.credits});
 check(!b.artReadyV32,'opt-in UI battle starts waiting for real sprite readiness');equal(timers.length,0,'cold image loading cannot schedule invisible attacks');check(b.queue.length>0,'turn queue is prepared without firing its first actor');check(!e.currentHero(),'commands cannot use a hero before art ready');check(!e.action('attack'),'waiting battle rejects commands');e.nextActor();equal(timers.length,0,'repeated nextActor while loading cannot leak timers');
 for(let i=0;i<200;i++)e.update(.04);equal(e.state.heroes.map(h=>h.hp),hp,'arbitrary loading delay cannot damage allies');equal(JSON.stringify({progress:e.state.progress,credits:e.state.credits}),resources,'loading delay cannot change charge/rewards/resources');
 check(e.markBattleArtReadyV32(b.artTokenV32),'valid current readiness releases the real first turn');check(b.artReadyV32&&timers.length===2,'exactly one action is scheduled on readiness');const a=b.animation,scheduled=timers.length;check(e.markBattleArtReadyV32(b.artTokenV32),'duplicate readiness is idempotent');equal(timers.length,scheduled,'duplicate readiness does not restart the action');equal(b.animation,a,'duplicate readiness preserves the active timeline');
 const oldToken=b.artTokenV32;e.state.battle=null;e.state.mode='world';timers=[];e.beginBattle(boss);const next=e.state.battle;check(next.artTokenV32!==oldToken,'same enemy gets a new battle instance token');check(!e.markBattleArtReadyV32(oldToken),'late ready from same enemy previous instance is ignored');equal(timers.length,0,'late readiness cannot release the new waiting battle');check(!next.artReadyV32,'stale ready leaves new gate closed');check(e.markBattleArtReadyV32(next.artTokenV32),'new instance ready releases normally');
 const headless=fresh();headless.beginBattle(boss);check(headless.state.battle.artReadyV32,'headless engine retains existing immediate readiness');check(headless.state.battle.animation||headless.currentHero(),'legacy immediate headless first actor is unchanged');
}
report.push('Cold-load art gate: no timers/commands/damage before readiness; current battle token releases once, repeated readiness is idempotent, stale readiness for the same enemy instance is ignored. Opt-in preserves headless execution.');
report.push('1x/2x: basic/guard/skill/ultimate/freeze/bind impact and recovery, mid-animation switching, turn-based control expiry, reload/new-game preference and inaccessible storage passed. Gacha/campaign cutscene timing stays separate.');
const text=`Combat planning v32 — PASS (${checks} checks)\n\n${report.join('\n')}\n\nNo RNG is consumed by forecast. Damage is conditional on an actual hit. Existing charge, damage, targets, status odds, saves and payout rules remain intact.\n`;
mkdirSync('docs/qa-v32',{recursive:true});writeFileSync('docs/qa-v32/combat-planning-test.txt',text);console.log(text);
