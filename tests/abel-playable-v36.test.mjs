import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-abel-playable-v36-'));
compileGameModules(out,['engine','characterAnimation']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine');
const {PLAYABLE_HERO_IDS,STARTING_HERO_IDS,MAPS,SKILLS,ASSETS,heroBases,combatElement,signatureTechnique}=await load('data');
const {TREE,EXTRA_SKILLS,deriveHeroes,level,QUESTS}=await load('progression');
const {SUMMONED_HEROES}=await load('summons');
const {VARIANTS_V36}=await load('variantsV36');
const {ABEL_SKILLS_V36,ABEL_ULTIMATE_V36,abelSkillIconV36}=await load('abelPlayableV36');
const {ABEL_NPC_V31}=await load('abelNpcV31');
const {hasCharacterBattleArt,skillMotifIndex}=await load('characterAnimation');
let checks=0,timers=[];
const check=(v,label)=>{assert.ok(v,label);checks++;},equal=(a,b,label)=>{assert.deepEqual(a,b,label);checks++;};
const store=new Map();
global.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)};
global.setTimeout=(fn,ms)=>{timers.push({fn,ms});return timers.length;};
Math.random=()=>.99;
function fresh(){store.clear();const e=new GameEngine();e.start(false);e.finishCutscene();e.sound=false;timers=[];return e;}
function finishDialogue(e){let n=0;while(e.state.mode==='dialogue'&&n++<20)e.nextDialogue();check(n<20,'dialogue actually completes');}
function summon(e){const pool=SUMMONED_HEROES.filter(h=>h.rarity===5&&!h.achievementOnly),index=pool.findIndex(h=>h.id==='abel');let rolls=[.01,(index+.5)/pool.length];check(e.drawCharacter(1,'crystal',()=>rolls.shift()),'actual character invocation accepts normal crystals');equal(e.state.summonResults[0].id,'abel','normal 5-star pool pays Abel');timers.at(-1).fn();e.dismissNotice();timers=[];}
function lesson(e){e.state.map='patio';check(e.bondSummoned('abel'),'existing Pátio lesson button opens the real lesson');check(!e.state.progress.recruited.includes('abel'),'dialogue opening alone cannot recruit');finishDialogue(e);}
function completedFamily(){const e=fresh();summon(e);lesson(e);e.gainXp(540);e.state.opened.push('bolsa','sub-bau');e.state.progress.kills.lobo=5;check(e.claimQuest('supplies'),'normal supplies quest awards points to Abel');check(e.claimQuest('patrol'),'normal patrol quest awards points to Abel');equal(level(e.state.progress),10,'normal level cap unchanged');equal(e.state.progress.points.abel,13,'2 starting +9 levels +2 normal quest points reach full tree');let pending=TREE.filter(n=>n.hero==='abel');while(pending.length){const node=pending.find(n=>!n.requires||e.state.progress.learned.includes(n.requires));check(node,'Abel prerequisites are reachable and acyclic');check(e.learn(node.id),'actual learn spends Abel points');pending=pending.filter(n=>n!==node);}equal(e.state.progress.points.abel,0,'complete tree costs exactly thirteen points');return e;}
function battle(e){e.state.mode='world';e.state.progress.party=['abel','seiji','ophelia'];e.state.heroes=deriveHeroes(e.state.progress,[]);e.beginBattle(MAPS.subsolo.entities.find(n=>n.kind==='mob'));const b=e.state.battle;Object.assign(b,{hp:10000,maxHp:10000,queue:['abel','seiji','enemy','ophelia'],index:0,busy:false,animation:undefined,bossCharge:80});e.state.heroes.forEach(h=>{h.maxHp=h.hp=200;h.maxMp=h.mp=200;});timers=[];return b;}
function actionImpact(e,id,target){const b=e.state.battle,before=b.hp;check(e.action(id,target),`${id}: actual command accepted`);const a=b.animation;equal(b.hp,before,`${id}: no early impact before the native animation contact`);const timer=timers.find(t=>t.ms===a.impactAt);check(timer,`${id}: actual timed callback exists`);timer.fn();return a;}

equal(PLAYABLE_HERO_IDS,['seiji','ophelia','marin','gabriel','max','beatriz','orfeu','ava','carmilla','abel'],'Abel adds one playable family without replacing the original nine');
equal(STARTING_HERO_IDS,['seiji','marin','gabriel','ophelia','max'],'five permitted starting origins remain unchanged');
equal(VARIANTS_V36.length,8,'all eight optional event versions preserved');
equal(SUMMONED_HEROES.filter(h=>h.rarity===5&&!h.achievementOnly).length,12,'Abel was already in the original expanded pool; no probability pool dilution');
for(const id of PLAYABLE_HERO_IDS){const nodes=TREE.filter(n=>n.hero===id);equal(nodes.length,9,`${id}: nine nodes`);equal(nodes.reduce((n,v)=>n+v.cost,0),13,`${id}: thirteen points`);equal(SKILLS[id].length+EXTRA_SKILLS[id].length,7,`${id}: seven skills plus separate ultimate`);}
check(hasCharacterBattleArt('abel'),'real Abel combat atlases use the native animation consumer');
equal(heroBases().find(h=>h.id==='abel').element,'Fogo Primordial','canonical primordial fire retained');
check(!fresh().start(false,'abel'),'teacher recruitment does not silently introduce a sixth starting origin');
for(const skill of ABEL_SKILLS_V36){equal(signatureTechnique(skill.id),skill,`${skill.id}: UI and execution share the real descriptor`);equal(combatElement('abel',skill.id),'fire',`${skill.id}: Fire, no borrowed element`);equal(skillMotifIndex(skill.id),skill.motif,`${skill.id}: native effect motif follows actual action`);}
const iconPaths=new Set();for(const id of [...ABEL_SKILLS_V36.map(skill=>skill.id),'ultimate']){const key=abelSkillIconV36(id),path=ASSETS[key];equal(key,`skill_icon_abel_${id}`,`${id}: dedicated action icon key`);check(path&&!iconPaths.has(path),`${id}: distinct generated icon path`);iconPaths.add(path);const png=readFileSync(`public${path}`);equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a',`${id}: production icon PNG exists`);equal(png[25],6,`${id}: native RGBA, no icon placeholder`);}

// Ownership and completed lesson, including the reported old bonded-but-unplayable state.
{
 const e=fresh();check(!e.bondSummoned('abel'),'unowned Abel cannot bypass Gacha acquisition');check(!e.challengeRecruit('abel'),'generic starter duel cannot bypass 5-star ownership');summon(e);equal(e.state.progress.crystals,1440,'one real invocation costs160 crystals');check(!e.state.progress.recruited.includes('abel'),'summon still waits for explicit lesson');
 e.state.map='domo';check(!e.bondSummoned('abel'),'lesson gives honest location guard');e.state.map='patio';const before={crystals:e.state.progress.crystals,fragments:e.state.progress.soulFragments,rolls:e.state.progress.characterRolls};lesson(e);check(e.state.progress.bonded.includes('abel'),'lesson completion records bond');check(e.state.progress.recruited.includes('abel'),'lesson completion finally recruits Abel');check(e.state.heroes.some(h=>h.id==='abel'),'free party slot receives playable Abel');equal(e.state.progress.reserveVitals.abel,{hp:84,mp:58},'first recruitment has real reserve vitals');equal({crystals:e.state.progress.crystals,fragments:e.state.progress.soulFragments,rolls:e.state.progress.characterRolls},before,'lesson is free and pays no duplicate Gacha rewards');check(!e.bondSummoned('abel'),'completed lesson cannot be paid or recruited twice');
 const repaired=fresh();repaired.state.progress.summoned=['abel'];repaired.state.progress.bonded=['abel'];check(repaired.bondSummoned('abel'),'existing broken bonded state can be repaired without another draw');finishDialogue(repaired);check(repaired.state.progress.recruited.includes('abel'),'repair finishes actual recruitment');
}
// World story route uses the real moving NPC, pathfinding, proximity, gate and callback.
{
 const e=fresh();summon(e);const gate=MAPS.ashwood.entities.find(n=>n.to==='ashpyre');e.state.map='ashwood';e.state.position={x:gate.x,y:gate.y};e.state.stage=4;e.interact(gate.id);equal(e.state.mode,'dialogue','chapter-four world gate remains locked');finishDialogue(e);equal(e.state.map,'ashwood','early access cannot bypass chapter');e.state.stage=5;e.interact(gate.id);equal(e.state.map,'ashpyre','normal chapter-five warp reaches the clearing');if(e.state.mode==='cutscene')e.finishCutscene();
 check(e.approach(ABEL_NPC_V31.id),'world NPC has a real approachable route');for(let i=0;i<400&&e.state.mode==='world';i++)e.update(.025);equal(e.state.mode,'dialogue','actual approach opens the Abel lesson');check(!e.state.progress.recruited.includes('abel'),'recruitment waits for story dialogue completion');equal(e.state.progress.kills.cinder||0,0,'lesson does not require the optional boss');const prior=e.state.progress.crystals;finishDialogue(e);check(e.state.progress.recruited.includes('abel'),'world dialogue completion recruits owned Abel');equal(e.state.progress.crystals,prior,'world recruitment consumes no crystals');check(e.activeEntities().some(n=>n.id===ABEL_NPC_V31.id),'teacher remains present for quests and event conversations after recruitment');
}
{
 const e=fresh();summon(e);e.state.progress.recruited=['seiji','ophelia','marin','gabriel','max'];e.state.progress.party=[...e.state.progress.recruited];e.state.heroes=deriveHeroes(e.state.progress,[]);const order=[...e.state.progress.party];lesson(e);equal(e.state.progress.party,order,'full five-slot party is never reordered or overfilled');check(e.state.progress.recruited.includes('abel'),'full-party Abel remains available in the reserve');check(e.assignParty(4,'abel'),'normal Grupo slot selection adds Abel');equal(e.state.progress.party,['seiji','ophelia','marin','gabriel','abel'],'chosen fixed slot is replaced only once');e.state.progress.leaderId='abel';check(e.save(true),'playable Abel party saves normally');check(parseSave(store.get(SAVE_KEY)),'Abel save is valid and preserves the party leader');
}
// Migration repairs real ownership, preserves the old party and credits earned points.
{
 const e=fresh();e.gainXp(540);e.state.opened.push('bolsa','sub-bau');e.state.progress.kills.lobo=5;e.claimQuest('supplies');e.claimQuest('patrol');e.state.progress.summoned=['abel'];e.state.progress.bonded=['abel'];check(e.save(true),'legacy fixture uses the real save writer');const prior=JSON.parse(store.get(SAVE_KEY));for(const key of ['points','equipment','limit','cosmeticEquipment','reserveVitals'])delete prior.progress[key].abel;const original={party:prior.progress.party,heroes:prior.heroes,crystals:prior.progress.crystals,fivePity:prior.progress.fivePity};const migrated=parseSave(JSON.stringify(prior));check(migrated,'pre-Abel save migrates without rejecting valid progress');check(migrated.progress.recruited.includes('abel'),'already summoned/bonded Abel is repaired automatically');equal(migrated.progress.points.abel,13,'legacy earned levels and quest points are restored for the newly playable family');equal({party:migrated.progress.party,heroes:migrated.heroes,crystals:migrated.progress.crystals,fivePity:migrated.progress.fivePity},original,'migration never adds a party slot, pays currency or changes existing vitals/pity');check(migrated.progress.reserveVitals.abel.hp>84,'migrated reserve derives the actual level-ten vitals');check(parseSave(JSON.stringify(migrated)),'migrated save is idempotently valid');
 prior.progress.bonded=[];check(!parseSave(JSON.stringify(prior)).progress.recruited.includes('abel'),'summoned without lesson does not auto-recruit');prior.progress.summoned=[];prior.progress.bonded=['abel'];prior.progress.recruited.push('abel');check(!parseSave(JSON.stringify(prior)).progress.recruited.includes('abel'),'forged unowned bond cannot grant recruitment');
}

const complete=completedFamily();equal(complete.skills('abel').length,7,'actual full tree exposes seven distinct combat skills');equal(complete.skillTreeSummaryV36('abel').learned,9,'all nine nodes are real learned progress');check(complete.save(true)&&parseSave(store.get(SAVE_KEY)),'fully learned Abel saves and parses');
{
 const e=completedFamily(),b=battle(e),damage=e.attackPower('abel'),before=b.hp;const a=actionImpact(e,'attack');equal(before-b.hp,damage,'Abel basic attack uses real physical attack formula');equal(a.element,'fire','basic attack shows primordial Fire');equal(e.state.progress.limit.abel,20,'basic attack generates normal ultimate charge');
 const guarded=completedFamily();battle(guarded);guarded.state.heroes[0].mp=0;const guard=actionImpact(guarded,'guard');check(guarded.state.heroes[0].guard,'Abel standard guard protects the next hit');equal(guarded.state.heroes[0].mp,3,'guard recovers normal three MP');equal(guard.element,'neutral','standard guard stays neutral');equal(guarded.state.progress.limit.abel,10,'guard generates normal ultimate charge');
}
// Every skill applies its authored effect through the production contact callback.
for(const skill of ABEL_SKILLS_V36){
 const e=completedFamily(),b=battle(e);let [actor,ally,dead]=e.state.heroes;actor.hp=80;ally.hp=60;dead.hp=0;b.statuses.seiji=[{id:'bleed',turns:2}];const before={hp:b.hp,mp:actor.mp,actor:actor.hp,ally:ally.hp,charge:b.bossCharge};if(skill.target!=='enemy')Math.random=()=>{throw Error('support must not roll blindness');};const a=actionImpact(e,skill.id,'seiji');Math.random=()=>.99;[actor,ally,dead]=e.state.heroes;
 equal(actor.mp,before.mp-e.skillCost('abel',skill.cost),`${skill.id}: actual MP cost paid once`);equal(a.element,'fire',`${skill.id}: actual animation elemental identity`);equal(dead.hp,0,`${skill.id}: does not resurrect a fallen ally`);
 if(skill.damage)equal(before.hp-b.hp,e.signatureDamageV36('abel',skill.damage,false,skill.id),`${skill.id}: actual damage formula including its own passive`);else equal(b.hp,before.hp,`${skill.id}: support cannot damage the enemy`);
 if(skill.status)equal(b.statuses.enemy.find(s=>s.id===skill.status)?.turns,skill.turns,`${skill.id}: authored state and turn duration`);
 if(skill.chargeDrain)equal(b.bossCharge,before.charge-skill.chargeDrain,`${skill.id}: actual enemy charge drains`);
 if(skill.guard)check(ally.guard,`${skill.id}: actual intended ally guard`);if(skill.guard==='party')check(actor.guard,`${skill.id}: protects living party`);if(skill.id==='ember-mantle')check(b.log.at(-1).includes('guarda concedida')&&!b.log.at(-1).includes('HP restaurados'),'Manto log explains protection instead of reporting invented zero healing');
 if(skill.cleanse)check(!b.statuses.seiji.some(s=>s.id==='bleed'),`${skill.id}: removes actual bleeding`);
 if(skill.heal){equal(a.healingsV36,[{target:'abel',value:actor.hp-before.actor},{target:'seiji',value:ally.hp-before.ally}],`${skill.id}: real per-target HP restoration`);check(actor.hp>before.actor&&ally.hp>before.ally,`${skill.id}: every living ally heals`);}
 equal(b.index,0,`${skill.id}: native impact does not skip or reorder the queue`);const cleanup=timers.find(t=>t.ms===a.duration);check(cleanup,`${skill.id}: animation cleanup is scheduled`);cleanup.fn();equal(b.index,1,`${skill.id}: next real allied actor remains in the existing fixed queue`);equal(e.currentHero()?.id,'seiji',`${skill.id}: standard turn sequencing retained`);
}
{
 const e=completedFamily(),b=battle(e),actor=e.state.heroes[0];b.statuses.abel=[{id:'silence',turns:1}];check(!e.action('primordial-spark'),'silence vetoes Abel magical skill');check(!e.action('hearth-rest'),'silence also vetoes magical party healing');check(e.action('guard'),'standard physical guard remains available under silence');
 const other=completedFamily();battle(other);other.state.heroes[1].hp=0;check(!other.action('ember-mantle','seiji'),'targeted support cannot guard a fallen ally');other.state.heroes[0].mp=0;check(!other.action('primordial-spark'),'ordinary MP affordability enforced');
 const ult=completedFamily(),ub=battle(ult);ult.state.progress.limit.abel=99;check(!ult.action('ultimate'),'ultimate below100 charge rejected');ult.state.progress.limit.abel=100;const prior={hp:ub.hp,mp:ult.state.heroes[0].mp};const a=actionImpact(ult,'ultimate');equal(ult.state.progress.limit.abel,0,'ultimate consumes100 charge');equal(ult.state.heroes[0].mp,prior.mp,'base ultimate follows existing no-MP rule');equal(prior.hp-ub.hp,ABEL_ULTIMATE_V36.damage+12+18,'authored ultimate damage plus real master/level bonuses');equal(ub.bossCharge,60,'ultimate drains20 enemy charge');check(ub.weakened,'ultimate weakens next enemy hit');equal(a.element,'fire','ultimate uses Fire');
 const spark=complete.signatureDamageV36('abel',36,false,'primordial-spark'),oath=complete.signatureDamageV36('abel',36,false,'primordial-oath');equal(spark-oath,8,'Centelha passive cannot accidentally buff another skill with the same base number');
}

const report=`Abel playable v36 — PASS (${checks} checks)\nReported broken state reproduced: summoned+bonded but no playable family. Production lesson callbacks now recruit; legacy ownership migrates with real earned points, party/vitals/pity retained. World route uses actual gate, pathfinding and moving NPC; no boss/paid resource requirement for the lesson. Ten families retain7skills+ultimate /9nodes /13points; 8event variants and12five-star pool entries remain unchanged. All7 Abel skill impacts, costs, ally states/healing, dead targets, silence, ultimate charge, queue cleanup and save roundtrips tested through actual engine callbacks.\n`;
mkdirSync('docs/qa-v36',{recursive:true});writeFileSync('docs/qa-v36/abel-playable-test.txt',report);console.log(report);
