import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-cadence-v37-'));
compileGameModules(out,['engine']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {GameEngine,parseSave,SAVE_KEY}=await load('engine');
const {MAPS,ENEMY_ULTIMATES,heroBases}=await load('data');
const {deriveHeroes,DIFFICULTIES}=await load('progression');
const {combatCadenceV37,buildBattleQueueV37,enemyChargeStepV37}=await load('combatCadenceV37');
let checks=0,timers=[],rngReads=0;const store=new Map(),traces=[];
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
global.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};
global.setTimeout=(fn,ms)=>{timers.push({fn,ms});return timers.length;};
Math.random=()=>{rngReads++;return .99;};
const origins=['seiji','ophelia','marin','gabriel','max'];
function fresh(count=5,difficulty=1){
 store.clear();timers=[];const engine=new GameEngine();engine.start(false);engine.finishCutscene();engine.sound=false;
 for(const id of origins.slice(2))engine.recruit(id);
 engine.gainXp(540);const p=engine.state.progress;p.party=origins.slice(0,count);p.leaderId=p.party[0];p.difficulty=difficulty;
 engine.state.heroes=deriveHeroes(p,[]).map(hero=>({...hero,hp:hero.maxHp,mp:hero.maxMp}));
 engine.setBattleArtGateV32(true);timers=[];return engine;
}
function begin(engine,entity){engine.beginBattle(entity);check(!engine.state.battle.artReadyV32,'cadence queue still waits for art');equal(timers.length,0,'no enemy windows run during loading');}
function ready(engine){check(engine.markBattleArtReadyV32(engine.state.battle.artTokenV32),'native art gate releases queue once');}
function intentSignature(plan){return plan&&{round:plan.round,action:plan.action,kind:plan.kind,targets:plan.targets,chargeBefore:plan.chargeBefore,chargeAfter:plan.chargeAfter,actionInRound:plan.actionInRound,actionsPerRound:plan.actionsPerRound,reaction:plan.reaction};}
function forecast(engine){const before=JSON.stringify(engine.state),reads=rngReads;const plan=engine.enemyIntentV32();equal(rngReads,reads,'forecast consumes no random roll');equal(JSON.stringify(engine.state),before,'forecast cannot mutate queue/phase/charge/party');return plan;}
function step(engine,choice='guard'){
 const battle=engine.state.battle,hero=engine.currentHero();
 if(hero)check(engine.action(choice),'actual allied command takes one queued turn');
 const animation=battle.animation;check(animation,'real actor/control window has an animation');
 const captured=animation.enemyIntentV32,hp=engine.state.heroes.map(hero=>hero.hp),charge=battle.bossCharge;
 equal(timers.length,2,'one impact/recovery pair per action');const [impact,recovery]=timers.splice(0,2);
 impact.fn();
 if(animation.actor==='enemy'){
  check(captured,'every real enemy window captures the shared forecast');
  if(captured.kind==='blocked'){equal(engine.state.heroes.map(hero=>hero.hp),hp,'blocked enemy slot cannot hit allies');equal(battle.bossCharge,charge,'blocked enemy slot cannot gain charge');}
  else {check(animation.enemyOutcomeV32,'actual impact publishes an outcome');equal(battle.bossCharge,captured.chargeAfter,'impact applies exactly predicted charge');if(animation.enemyOutcomeV32.missed)equal(engine.state.heroes.map(hero=>hero.hp),hp,'actual blind miss deals no invented predicted damage');for(const target of animation.enemyOutcomeV32.targets)equal(target.damage,captured.targets.find(item=>item.id===target.id).damageOnHit,'live reaction damage matches shared intent');}
 }
 const next=forecast(engine);
 if(animation.actor==='enemy')equal(intentSignature(next),intentSignature(captured),'current enemy recovery keeps its captured acting intent visible');
 recovery.fn();
 if(animation.actor!=='enemy'&&battle.animation?.actor==='enemy'&&next)equal(intentSignature(engine.enemyIntentV32()),intentSignature(next),'post-impact forecast matches actual next repeated enemy slot');
 return {actor:animation.actor,action:animation.action,round:captured?.round||battle.round-(battle.index===0?1:0),intent:captured};
}
const encounters=Object.keys(ENEMY_ULTIMATES).map(family=>Object.values(MAPS).flatMap(map=>map.entities).find(entity=>entity.family===family||entity.id===family));
check(encounters.every(Boolean),'all ten authored enemy families have real encounters');
for(const entity of encounters)for(const difficulty of [1,2,3]){
 let strength;
 for(const count of [1,2,5]){
  const engine=fresh(count,difficulty);begin(engine,entity);const battle=engine.state.battle,profile=combatCadenceV37(battle);
  const current={hp:battle.maxHp,damage:battle.damage,baseDamage:battle.baseDamage,spd:battle.spd,xp:battle.xp,credits:battle.credits,drop:battle.dropChance,budget:profile.enemyActions,burst:profile.maxAlliedBurst};
  if(strength)equal(current,strength,'same encounter/difficulty has identical stats/rewards/action budget with1/2/5 allies');else strength=current;
  equal(battle.queue.filter(id=>id==='enemy').length,profile.enemyActions,'fixed budget is not reduced for a solo hero');
  equal(battle.queue.filter(id=>id!=='enemy').sort(),origins.slice(0,count).sort(),'every living ally gets exactly one action');
  const tracesByRound=new Map();ready(engine);let n=0;
  while(battle.round<=3&&!battle.result&&n++<40){const round=battle.round,trace=step(engine);(tracesByRound.get(round)||tracesByRound.set(round,[]).get(round)).push(trace);}
  check(n<40,'three real rounds make progress without queue/timer stall');
  check(!battle.result,'canonical level10 guarded party can observe the three-round encounter');
  for(const [round,trace]of tracesByRound){
   const enemy=trace.filter(item=>item.actor==='enemy');equal(enemy.length,profile.enemyActions,'live engine spends its full enemy action budget every round');
   equal(trace.filter(item=>item.actor!=='enemy').length,count,'live engine never grants allies extra turns');
   let burst=0;for(const actor of trace){if(actor.actor==='enemy')burst=0;else{burst++;check(burst<=profile.maxAlliedBurst,'enemy reacts before an oversized allied burst');}}
   check(enemy.filter(item=>item.intent.area&&!item.action.includes('ultimate')).length<=1,'normal area pattern cannot repeat per reaction');
   equal(enemy.map(item=>item.intent.actionInRound),Array.from({length:profile.enemyActions},(_,i)=>i+1),'every spent enemy window has its actual ordinal');
   equal(enemy.at(-1).intent.chargeAfter,Math.min(100,round*34),'actual phase1 enemy actions retain the old total round charge');
   for(const item of enemy)if(!item.intent.area)equal(item.intent.targets.map(target=>target.id),[origins[((round-1)*profile.enemyActions+item.intent.actionInRound-1)%count]],'single-target reactions rotate across living allies by spent action ordinal');
   for(const item of enemy.slice(1))if(item.intent.kind!=='ultimate')equal(item.intent.kind,'attack','reaction is a normal hit rather than repeated magic/control');
  }
  traces.push(`${battle.family}/difficulty${difficulty}/party${count}: ${battle.cadenceV37.enemyActions} enemy windows, HP${battle.maxHp}, damage${battle.baseDamage}`);
 }
}
// Explicit initiative, full-party burst and death scenarios, using the actual builder/execution.
{
 const engine=fresh(),entity=encounters.find(item=>item.id==='cinder');begin(engine,entity);const battle=engine.state.battle;
 for(const hero of engine.state.heroes)hero.spd=99;engine.newRound();equal(battle.queue,['seiji','ophelia','enemy','marin','gabriel','enemy','max','enemy'],'faster five-person party is interrupted after two allies');
 engine.state.heroes[2].hp=0;engine.state.heroes[3].hp=0;engine.state.heroes[4].hp=0;engine.newRound();equal(battle.queue.filter(id=>id==='enemy').length,3,'defeated allies do not shrink the enemy budget');equal(battle.queue.filter(id=>id!=='enemy'),['seiji','ophelia'],'dead allies receive no turn');
 battle.spd=100;equal(buildBattleQueueV37(battle,engine.state.heroes),['enemy','seiji','ophelia','enemy','enemy'],'enemy SPD preserves first initiative and remaining fixed windows');
}
for(const difficulty of [1,2,3]){
 const engine=fresh(5,difficulty);for(const hero of engine.state.heroes)engine.state.progress.limit[hero.id]=100;
 const boss=encounters.find(item=>item.id==='cinder');begin(engine,boss);ready(engine);let allies=0,firstEnemyAt=-1,n=0;
 while(!engine.state.battle.result&&n++<35){const trace=step(engine,engine.currentHero()&&engine.state.progress.limit[engine.currentHero().id]>=100?'ultimate':'guard');if(trace.actor==='enemy'&&firstEnemyAt<0)firstEnemyAt=allies;else if(trace.actor!=='enemy')allies++;if(firstEnemyAt>=0&&allies>=3)break;}
 check(firstEnemyAt>=0&&firstEnemyAt<=2,'actual five-ultimate burst meets a real boss response before the third ally');
 traces.push(`Cinder charged burst/difficulty${difficulty}: first enemy after${firstEnemyAt} allied ultimates`);
}
// A single immobilization consumes exactly one fixed window; the next remains dangerous.
for(const control of ['freeze','bind'])for(const speed of [1,2]){
 const engine=fresh(1);engine.setBattleSpeedV32(speed);begin(engine,encounters.find(item=>item.id==='cinder'));const battle=engine.state.battle;battle.bossCharge=100;
 check(engine.addStatus('enemy',control,1),'first authored control succeeds');check(!engine.addStatus('enemy',control==='freeze'?'bind':'freeze',1),'one immobilization per enemy remains enforced');ready(engine);const trace=[];while(battle.round===1)trace.push(step(engine));
 const enemies=trace.filter(item=>item.actor==='enemy');equal(enemies.length,3,'control skip never removes a remaining enemy window');equal(enemies[0].intent.kind,'blocked','first window is actually lost to control');equal(enemies[1].intent.kind,'ultimate','charged ultimate remains telegraphed in the next window');check(!battle.statuses.enemy.some(status=>status.id===control),'one-turn control expires after its actual skipped action');
}
for(const id of ['abel','max']){
 const engine=fresh(1),p=engine.state.progress;p.summoned.push('abel');p.bonded.push('abel');engine.recruit('abel');p.party=[id];engine.state.heroes=deriveHeroes(p,[]).map(hero=>({...hero,hp:hero.maxHp,mp:hero.maxMp,spd:99}));
 begin(engine,encounters.find(item=>item.id==='cinder'));const battle=engine.state.battle,hero=engine.state.heroes[0],prior=hero.hp;battle.statuses[id]=[{id:'bleed',turns:1}];ready(engine);
 equal(engine.state.heroes[0].hp,prior-6,'actual allied bleed ticks six HP once at turn start');check(battle.log.includes(`${hero.name} sofre 6 de sangramento.`),'bleed log names the actual Abel/Max instead of Ophelia');step(engine);check(!battle.statuses[id].some(status=>status.id==='bleed'),'allied bleed expires after the actual guarded action');
}
{
 const engine=fresh(1);begin(engine,encounters.find(item=>item.id==='cinder'));const battle=engine.state.battle;battle.bossCharge=100;battle.statuses.enemy=[{id:'silence',turns:1},{id:'bleed',turns:3}];ready(engine);const before=battle.hp,trace=[];while(battle.round===1)trace.push(step(engine));const enemy=trace.filter(item=>item.actor==='enemy');
 equal(enemy[0].intent.kind,'attack','one silence stops the first charged special');equal(enemy[1].intent.kind,'ultimate','silence ends by action, not by entire multi-window round');equal(battle.hp,before-18,'bleed ticks three times across three actual enemy actions');check(!battle.statuses.enemy.some(status=>['silence','bleed'].includes(status.id)),'bleed/silence expire after their authored action counts');
}
// The same old round charge budget is split, never multiplied by enemy windows.
for(const actions of [1,2,3])for(const phase of [1,2,3])equal(Array.from({length:actions},(_,i)=>enemyChargeStepV37(34+(phase-1)*8,i+1,actions)).reduce((sum,n)=>sum+n,0),34+(phase-1)*8,'charge allocations add to the original per-round amount');
{
 const engine=fresh(2);begin(engine,encounters.find(item=>item.id==='cinder'));const battle=engine.state.battle;battle.maxHp=300;battle.hp=100;ready(engine);const trace=[];while(battle.round===1)trace.push(step(engine));
 equal(battle.phase,3,'real low-HP boss enters its authored final phase');equal(battle.damage,battle.baseDamage+8,'phase3 retains its authored damage increase');
 const enemy=trace.filter(item=>item.actor==='enemy');equal(enemy[0].intent.chargeBefore,25,'phase transition grants one separate25charge');equal(enemy.at(-1).intent.chargeAfter,75,'three windows total50phase3charge plus the single25phase bonus');
}
for(const difficulty of [1,2,3]){
 const engine=fresh(5,difficulty);const target=heroBases().find(hero=>hero.id==='marin');begin(engine,{id:'duel-marin',eventId:'recruit-marin',kind:'mob',asset:'marin',family:'sombra',label:'Duelo de recrutamento · Marin',x:0,y:0,hp:Math.round(target.maxHp*2.2),damage:Math.max(14,target.atk),xp:80,credits:90});
 equal(engine.state.battle.queue.filter(id=>id==='enemy').length,2,'real recruitment duel receives two fixed windows');ready(engine);const battle=engine.state.battle,trace=[];while(battle.round<=2)trace.push(step(engine));
 for(const item of trace.filter(item=>item.actor==='enemy')){equal(item.intent.targets.length,1,'duel remains single-target');if(item.intent.reaction)equal(item.intent.action,'enemy-hit','duel reaction does not repeat its signature spell');}
}
// A remaining ally after the final enemy window previews the real next-round cadence, not old SPD-only order.
{
 const engine=fresh(5);begin(engine,encounters.find(item=>item.id==='cinder'));const battle=engine.state.battle;battle.spd=99;engine.newRound();const last=battle.queue.at(-1);check(last!=='enemy','real speed order has an allied tail after the last enemy');ready(engine);let pending;
 while(battle.round===1){if(engine.currentHero()?.id===last){check(engine.action('guard'),'last allied tail turn spends its actual guard');const [impact,recovery]=timers.splice(0,2);impact.fn();pending=forecast(engine);equal(pending.timing,'next-round','tail forecast honestly points to the following round');equal(pending.actionInRound,1,'round wrap previews the first fixed window');recovery.fn();equal(intentSignature(engine.enemyIntentV32()),intentSignature(pending),'next-round fixed queue forecast agrees with the actual first enemy');break;}step(engine);}
 check(pending,'real tail slot was reached without skipped allies');
}
{
 const engine=fresh(2);begin(engine,encounters.find(item=>item.family==='lobo'||item.id==='lobo'));const battle=engine.state.battle;battle.statuses.enemy=[{id:'blind',turns:2}];ready(engine);
 const oldRandom=Math.random;Math.random=()=>{rngReads++;return .25;};const trace=[];while(battle.round===1)trace.push(step(engine));Math.random=oldRandom;
 for(const item of trace.filter(item=>item.actor==='enemy'))equal(item.intent.missChance,.5,'each affected enemy action exposes the same50percent miss chance');
 check(!battle.statuses.enemy.some(status=>status.id==='blind'),'two-action blindness expires after two real enemy attempts');
}
{
 const engine=fresh(5);check(engine.save(true),'normal campaign still saves before the fight');const before=store.get(SAVE_KEY);begin(engine,encounters.find(item=>item.id==='cinder'));check(!engine.save(true),'runtime battle cadence cannot serialize an in-progress fight');equal(store.get(SAVE_KEY),before,'fight cannot overwrite valid campaign checkpoint');engine.state.mode='world';engine.state.battle=null;check(engine.save(true),'world save stays valid after runtime battle');const parsed=parseSave(store.get(SAVE_KEY));check(parsed,'normal save parser accepts the unchanged schema');check(!('cadenceV37'in parsed)&&!('cadenceV37'in parsed.progress),'cadence remains runtime only');equal(parsed.progress.party,origins,'party slots and identities remain stable');
}
const report=`Combat cadence v37 — PASS (${checks} checks)\nFixed mob/duel2, introductory Selo2 and later boss3 enemy actions, independent of1/2/5 allies and all3 difficulties. Real engine commands/timers verify repeated windows, solo budgets, same stats/rewards, SPD, actual ultimate burst, shared forecast/impact/round wrap, guard, control/bleed/silence/blind action ticks, phased charge allocation and unchanged saves.\n${traces.join('\n')}\n`;
mkdirSync('docs/qa-v37',{recursive:true});writeFileSync('docs/qa-v37/combat-cadence-test.txt',report);console.log(report);
