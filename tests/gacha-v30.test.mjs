import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-gacha-v30-')),compiled=new Set();
function compile(name){
 if(compiled.has(name))return;compiled.add(name);
 let source=readFileSync(`lib/game/${name}.ts`,'utf8');
 for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);
 source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
for(const name of ['engine','gachaSequence'])compile(name);
const imported=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave,SAVE_KEY}=await imported('engine');
const {SHOP,level}=await imported('progression');
const {SUMMONED_HEROES}=await imported('summons');
const {chooseCosmetic,cosmeticById}=await imported('cosmetics');
const {highestAward,gachaSequenceDuration,gachaSequencePhase}=await imported('gachaSequence');
let checks=0,timers=[];const store=new Map();
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
global.localStorage={setItem:(key,value)=>store.set(key,value),getItem:key=>store.get(key)||null};
global.setTimeout=(fn,ms)=>{timers.push({fn,ms});return timers.length;};
function fresh(){store.clear();const game=new GameEngine();game.start(false);game.finishCutscene();game.state.progress.crystals=16000;game.state.progress.tokens=100;timers=[];return game;}
function sequence(values){let i=0;return()=>{assert.ok(i<values.length,'draw must not consume unplanned randomness');return values[i++];};}
const rewards=game=>{const p=game.state.progress,value=structuredClone(Object.fromEntries(['tokens','crystals','dust','rolls','pity','characterRolls','fourPity','fivePity','soulFragments','summoned','recruited','constellations','owned','cosmetics'].map(key=>[key,p[key]])));value.constellations=Object.fromEntries(p.summoned.map(id=>[id,p.constellations[id]||0]));return value;};
const heroRoll=(rank,id)=>{const pool=SUMMONED_HEROES.filter(hero=>hero.rarity===rank&&!hero.achievementOnly);return (pool.findIndex(hero=>hero.id===id)+.5)/pool.length;};

// Stratified rolls pin the approved odds without statistical/flaky expectations.
const characterCounts={3:0,4:0,5:0},auraCounts={1:0,2:0,3:0,4:0,5:0};
for(let i=0;i<1000;i++){
 const roll=(i+.5)/1000,game=fresh();check(game.drawCharacter(1,'crystal',sequence([roll,.1])),'ordinary character draw accepted');
 characterCounts[game.state.summonResults[0].rarity]++;
 auraCounts[chooseCosmetic(0,sequence([roll,.1])).rank]++;
}
equal(characterCounts,{3:780,4:200,5:20},'character odds remain 78% / 20% / 2%');
equal(auraCounts,{1:550,2:250,3:130,4:60,5:10},'aura odds remain 55% / 25% / 13% / 6% / 1%');
for(const [four,five,roll,rank] of [[9,0,.99,4],[0,79,.99,5],[0,63,.04,4],[0,64,.04,5]]){
 const game=fresh();game.state.progress.fourPity=four;game.state.progress.fivePity=five;
 check(game.drawCharacter(1,'crystal',sequence([roll,.1])),'pity draw accepted');equal(game.state.summonResults[0].rarity,rank,'approved hard/soft pity threshold');
 equal(game.state.progress.fourPity,0,'four-star-or-better resets four pity');equal(game.state.progress.fivePity,rank===5?0:five+1,'five pity resets only at five stars');
}
{
 const game=fresh();check(game.drawCharacter(10,'crystal',()=>.99),'multi accepted');
 equal(game.state.summonResults.map(r=>r.rarity),[3,3,3,3,3,3,3,3,3,4],'ten-pull guarantees four-star-or-better');
 equal(game.state.progress.crystals,14400,'multi spends exactly 1600 crystals');equal(game.state.progress.characterRolls,10,'ten rolls counted once');
 check(game.state.summonResults.every(r=>r.id!=='carmilla'),'achievement-only Carmilla stays outside banner');
}
for(const [roll,rank] of [[.93,4],[.94,5]])equal(chooseCosmetic(9,sequence([roll,.1])).rank,rank,'tenth aura pity preserves 94% epic / 6% legendary');
for(const [rank,refund,fragments] of [[4,40,8],[5,160,20]]){
 const game=fresh(),id=SUMMONED_HEROES.find(hero=>hero.rarity===rank&&!hero.achievementOnly).id,p=game.state.progress;
 p.summoned=[id];p.constellations[id]=5;const crystals=p.crystals;
 check(game.drawCharacter(1,'crystal',sequence([rank===5?0:.1,heroRoll(rank,id)])),'duplicate accepted');
 equal(p.crystals,crystals-160+refund,'duplicate keeps approved crystal refund');equal(p.soulFragments,fragments,'duplicate gives approved soul fragments');equal(p.constellations[id],6,'duplicate reaches sixth constellation');
 timers.at(-1).fn();check(game.drawCharacter(1,'ticket',sequence([rank===5?0:.1,heroRoll(rank,id)])),'ticket duplicate accepted');
 equal(p.constellations[id],6,'constellation stays capped at six');equal(p.soulFragments,fragments*2,'capped duplicate still gives fragments');equal(p.tokens,99,'ticket spent exactly once');
}
{
 const game=fresh(),p=game.state.progress,gear=SHOP.find(item=>item.gear&&item.minLevel<=level(p)).gear;p.owned=[gear];
 check(game.drawCharacter(1,'ticket',sequence([.9,0])),'equipment draw accepted');
 equal(p.owned,[gear,`${gear}@2`],'duplicate equipment gives a distinct usable copy');equal(game.state.summonResults[0].duplicate,true,'equipment duplicate marked accurately');
 const before=rewards(game);timers.at(-1).fn();equal(rewards(game),before,'completion never awards a second equipment copy');
}
{
 const game=fresh();check(game.drawCharacter(1,'crystal',sequence([0,heroRoll(5,'beatriz')])),'new Beatriz draw accepted');
 check(game.state.progress.recruited.includes('beatriz'),'Beatriz added to reserve');check(!game.state.progress.party.includes('beatriz'),'draw does not change active party');
 const saved=parseSave(store.get(SAVE_KEY));check(saved?.progress.summoned.includes('beatriz')&&saved.progress.recruited.includes('beatriz'),'actual payout persisted before cinematic completes');
}
for(const count of [1,5,10]){
 const game=fresh();game.state.progress.tokens=count;check(game.drawCosmetics(count,()=>0),'aura batch accepted');
 equal(game.state.progress.tokens,0,'aura batch spends exact tickets');equal(game.state.progress.rolls,count,'aura batch counts exact rolls');
 equal(game.state.progress.dust,Math.min(count-1,8),'repeated common auras become dust; tenth pity is a new epic');
 equal(game.state.gachaResults.length,count,'no missing aura results');
 if(count===10){equal(game.state.gachaResults[9].id,'jade-4','tenth aura is guaranteed epic');equal(game.state.progress.pity,0,'epic resets aura pity');}
}
for(const type of ['character','aura']){
 const game=fresh();check(type==='character'?game.drawCharacter(1,'ticket',sequence([0,.1])):game.drawCosmetics(1,()=>.99),'draw starts before busy checks');
 const before=rewards(game),original=structuredClone(type==='character'?game.state.summonResults:game.state.gachaResults),callback=timers.at(-1);
 check(!game.drawCharacter(1,'crystal',()=>0)&&!game.drawCosmetics(10,()=>0),'both gacha types block same-kind and cross-kind double taps');equal(rewards(game),before,'busy rejection spends or awards nothing');
 game.paused=false;game.clearMovement();game.emit();game.paused=true;game.emit();
 equal(type==='character'?game.state.summonResults:game.state.gachaResults,original,'closing/reopening preserves awarded batch');equal(rewards(game),before,'closing/reopening has no payout side effects');
 callback.fn();callback.fn();equal(rewards(game),before,'completion/replayed callback never duplicates payout');check(!game.state.summonBusy&&!game.state.gachaBusy,'completion releases busy');
}
for(const type of ['character','aura']){
 const game=fresh();check(type==='character'?game.drawCharacter(1,'ticket',sequence([0,.1])):game.drawCosmetics(1,()=>.99),'pre-reload draw starts');
 const before=rewards(game),callback=timers.at(-1),saved=store.get(SAVE_KEY),resumed=new GameEngine();resumed.hydrate();resumed.start(true);
 equal(rewards(resumed),before,'reload restores paid rewards exactly once');check(!resumed.state.gachaBusy&&!resumed.state.summonBusy,'reload has no orphaned cinematic lock');
 callback.fn();equal(rewards(resumed),before,'old-page timer cannot award again to resumed game');equal(store.get(SAVE_KEY),saved,'old-page completion cannot rewrite payout');
 game.start(false);game.finishCutscene();game.state.progress.tokens=2;
 check(game.drawCharacter(1,'ticket',sequence([.9,.1])),'fresh adventure begins a new draw');const newRewards=rewards(game),newResults=structuredClone(game.state.summonResults);
 callback.fn();equal(rewards(game),newRewards,'stale pre-reset timer cannot alter fresh payout');equal(game.state.summonResults,newResults,'stale timer cannot replace new batch');check(game.state.summonBusy,'stale timer cannot unlock another batch');
}
for(const method of ['ticket','crystal']){
 const game=fresh();game.state.progress.tokens=0;game.state.progress.crystals=159;const before=rewards(game);
 check(!game.drawCharacter(1,method,()=>0),'insufficient balance rejects entire draw');equal(rewards(game),before,'rejected payment changes no resource/pity');
}
{
 const game=fresh();game.state.progress.tokens=4;const before=rewards(game);check(!game.drawCosmetics(5,()=>0),'insufficient aura batch rejected');equal(rewards(game),before,'aura failure is atomic');
}
for(const mode of ['start','selection','battle','dialogue','cutscene']){
 const game=fresh();game.state.mode=mode;const before=rewards(game);check(!game.drawCharacter(1,'crystal',()=>0)&&!game.drawCosmetics(1,()=>0),'draws require exploration/menu context');equal(rewards(game),before,'blocked mode pays nothing');
}
{
 const game=fresh();game.activateMasterMode();game.state.progress.crystals=0;game.state.progress.tokens=0;
 check(game.drawCharacter(10,'crystal',()=>.99),'master mode permits free character batch');equal(game.state.progress.crystals,0,'free character draw consumes no crystals');check(!game.drawCosmetics(1,()=>0),'master mode preserves cross-kind busy gate');timers.at(-1).fn();
 check(game.drawCosmetics(5,()=>0),'master mode permits free aura batch after completion');equal(game.state.progress.tokens,0,'free aura draw consumes no tickets');
}
const batch=Object.freeze([{id:'earlier-four',rank:4},{id:'first-five',rank:5},{id:'second-five',rank:5},{id:'last-common',rank:1}].map(Object.freeze));
equal(highestAward(batch,r=>r.rank),batch[1],'highest award uses first maximal item, not last item');equal(highestAward([],r=>r.rank),undefined,'empty batch has no fabricated prize');
for(const type of ['character','aura']){
 const game=fresh(),values=type==='character'?[.1,.1,0,.1,...Array(8).fill([.9,.1]).flat()]:[0,.1,.99,.1,...Array(3).fill([0,.1]).flat()];
 check(type==='character'?game.drawCharacter(10,'crystal',sequence(values)):game.drawCosmetics(5,sequence(values)),'mixed-rarity batch accepted');
 const results=type==='character'?game.state.summonResults:game.state.gachaResults,rankOf=type==='character'?r=>r.rarity:r=>cosmeticById(r.id).rank,award=highestAward(results,rankOf),before=rewards(game);
 equal(rankOf(award),5,'mixed batch highlights awarded five-star result');equal(timers.at(-1).ms,6800,'mixed batch gets five-star cinematic duration');
 timers.at(-1).fn();equal(game.state.rewardNotice.focus,award.id,'completion focus points to actual maximum award');equal(rewards(game),before,'spotlight selection never changes rewards');
}
for(let rank=1;rank<=5;rank++){
 const duration=[2800,3200,3800,4800,6800][rank-1],game=fresh();equal(gachaSequenceDuration(rank),duration,'approved rarity duration');
 game.drawCosmetics(1,sequence([[0,.6,.85,.96,.995][rank-1],.1]));const before=rewards(game);equal(timers.at(-1).ms,duration,'motor timer matches awarded aura rarity');
 for(const elapsed of [-100,0,1,duration*.79,duration*.8,duration,duration*4]){
  const phase=gachaSequencePhase(rank,elapsed);check(phase.frame>=0&&phase.frame<=(rank===5?15:7)&&Number.isInteger(phase.frame),'frame stays inside awarded native atlas');check(phase.t>=0&&phase.t<=1,'sequence time clamped');
 }
 equal(gachaSequencePhase(rank,duration*.79).beat,'convergence','prize remains concealed during convergence');equal(gachaSequencePhase(rank,duration*.8).beat,'reveal','reveal begins at approved phase');
 // Reduced motion can display the last frame immediately; payout remains the motor's committed batch.
 equal(gachaSequencePhase(rank,duration).frame,rank===5?15:7,'reduced-motion final frame exists');equal(rewards(game),before,'phase/reduced-motion sampling cannot reroll or pay rewards');
}
console.log(`${checks} gacha v30 checks passed: odds/pity/rewards, stable maximum spotlight, busy/payment atomicity, reload/reset timer isolation and bounded cinematic phases.`);
