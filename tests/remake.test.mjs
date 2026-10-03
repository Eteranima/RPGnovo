import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-remake-'));
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','cosmetics','data','engine','progression','summons','carmilla']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {GameEngine,parseSave}=await import(pathToFileURL(join(out,'engine.js')).href);
const {SIGNATURE_TECHNIQUES,SKILLS,ULTIMATE_NAMES,combatElement}=await import(pathToFileURL(join(out,'data.js')).href);
const {deriveHeroes,TREE}=await import(pathToFileURL(join(out,'progression.js')).href);
let timers=[],saved;
global.localStorage={setItem:(_,value)=>saved=value,getItem:()=>null};
global.setTimeout=callback=>{timers.push(callback);return timers.length;};
const fixture=(id,learned=true)=>{
 const game=new GameEngine();game.start(false);game.finishCutscene();
 const p=game.state.progress;p.recruited=[id,...['seiji','ophelia'].filter(hero=>hero!==id)];p.party=p.recruited;
 p.summoned=['beatriz','carmilla'];p.bonded=['beatriz','carmilla'];
 p.learned=learned?TREE.map(node=>node.id):[];
 game.state.heroes=deriveHeroes(p).map(hero=>({...hero,hp:Math.floor(hero.maxHp*.5)}));
 game.beginBattle({id:'remake-test',kind:'boss',asset:'shadow',family:'selo',label:'Selo',hp:20000,damage:1,x:1,y:1});
 timers=[];Object.assign(game.state.battle,{queue:[id,'enemy'],index:0,busy:false,animation:undefined,bossCharge:70});
 return game;
};
for(const [id,techniques] of Object.entries(SIGNATURE_TECHNIQUES))for(const skill of techniques){
 const locked=fixture(id,false);assert.equal(locked.action(skill.id),false,'unlearned technique is unavailable');
 const game=fixture(id),hero=game.currentHero(),ally=game.state.heroes.find(h=>h.id!==id),battle=game.state.battle;
 const before={hp:battle.hp,mp:hero.mp,ally:ally.hp,self:hero.hp,charge:battle.bossCharge};
 battle.statuses[ally.id]=[{id:'bleed',turns:2},{id:'blind',turns:2}];battle.statuses[id]=[{id:'bleed',turns:2}];
 assert.equal(game.action(skill.id,ally.id),true,skill.name);
 assert.equal(battle.hp,before.hp,'damage waits for impact');assert.equal(ally.hp,before.ally,'healing waits for impact');
 assert.equal(battle.animation.element,combatElement(id,skill.id));
 assert.equal(battle.animation.target,skill.target==='ally'?ally.id:'enemy');
 assert.equal(hero.mp,before.mp-(game.state.progress.masterMode?0:game.skillCost(id,skill.cost)),'MP deducted once');
 assert.equal(game.action(skill.id,ally.id),false,'animation prevents repeated commands');
 timers.shift()();
 if(skill.damage)assert.ok(battle.hp<before.hp,'real enemy damage');
 if(skill.heal)assert.ok(game.state.heroes.find(h=>h.id===ally.id).hp>before.ally,'real selected ally healing');
 if(skill.selfHeal)assert.ok(game.state.heroes.find(h=>h.id===hero.id).hp>before.self,'real self healing');
 if(skill.status)assert.ok(game.hasStatus('enemy',skill.status),'declared control is applied');
 if(skill.weaken)assert.equal(battle.weakened,true);
 if(skill.chargeDrain)assert.equal(battle.bossCharge,before.charge-skill.chargeDrain);
 if(skill.guard==='ally')assert.equal(game.state.heroes.find(h=>h.id===ally.id).guard,true);
 if(skill.guard==='party')assert.ok(game.state.heroes.every(h=>h.guard));
 if(skill.cleanse==='all')assert.deepEqual(battle.statuses[ally.id],[]);
 if(skill.cleanse==='bleed')assert.ok(!battle.statuses[ally.id].some(st=>st.id==='bleed'));
 if(skill.woundedHeal){assert.ok(game.state.heroes.some(h=>h.hp>Math.floor(h.maxHp*.5)),'lowest proportion living ally is healed');assert.ok(battle.animation.healing?.value>0,'secondary healing exposes its actual target and amount');assert.equal(battle.animation.target,'enemy','offensive impact still targets the enemy');assert.ok(battle.animation.value>0,'damage value remains separate from healing');}
 // Selected dead allies cannot turn the new healing spells into resurrection.
 if(skill.target==='ally'){
  const dead=fixture(id);const target=dead.state.heroes.find(h=>h.id!==id);target.hp=0;
  const mp=dead.currentHero().mp;assert.equal(dead.action(skill.id,target.id),false);assert.equal(dead.currentHero().mp,mp);
 }
 const silenced=fixture(id);silenced.state.battle.statuses[id]=[{id:'silence',turns:1}];assert.equal(silenced.action(skill.id),false);
 const empty=fixture(id);empty.currentHero().mp=0;assert.equal(empty.action(skill.id),false,'insufficient MP cannot start a signature');
}
const lunar=fixture('seiji');lunar.state.progress.equipment.seiji={weapon:'lunar-weapon',head:'lunar-head',body:'lunar-body'};
const lunarBefore=lunar.currentHero().hp;assert.equal(lunar.action('kanji-interdict'),true);timers.shift()();assert.equal(lunar.state.heroes.find(h=>h.id==='seiji').hp,lunarBefore+4,'new offensive magic preserves the Lunar three-piece heal');
for(const id of Object.keys(SIGNATURE_TECHNIQUES)){
 const game=fixture(id),battle=game.state.battle;game.state.progress.limit[id]=100;
 const before=battle.hp;assert.equal(game.action('ultimate'),true);assert.equal(battle.hp,before);assert.equal(game.state.progress.limit[id],0);assert.equal(battle.animation.duration,4800);
 timers.shift()();
 if(id==='seiji'){assert.ok(game.hasStatus('enemy','silence'));assert.equal(battle.weakened,true);}
 if(id==='ophelia'){assert.ok(game.state.heroes.every(h=>h.guard));assert.ok(game.hasStatus('enemy','freeze'));}
 if(id==='marin')assert.ok(game.hasStatus('enemy','silence'));
 if(id==='max')assert.equal(battle.bossCharge,35);
 if(id==='gabriel'||id==='beatriz')assert.ok(game.state.heroes.every(h=>h.guard));
 if(id==='carmilla')assert.ok(battle.log.some(line=>line.includes('IN AETERNUM VIVE')),'approved transfer preserved');
}
{
 const game=fixture('seiji');game.state.mode='world';game.state.battle=null;game.save();
 const legacy=JSON.parse(saved);legacy.progress.learned=['seiji-ink','seiji-blind','seiji-bleed','seiji-master','seiji-signature'];
 const parsed=parseSave(JSON.stringify(legacy));assert.deepEqual(parsed.progress.learned,legacy.progress.learned);
 assert.equal(SKILLS.ava[0].id,'vine-strike');assert.equal(SKILLS.orfeu[0].id,'echo-strike');
 assert.equal(ULTIMATE_NAMES.ava,'Soberania da Terra');assert.equal(ULTIMATE_NAMES.orfeu,'Domínio Nulo');
 assert.equal(SIGNATURE_TECHNIQUES.ava,undefined);assert.equal(SIGNATURE_TECHNIQUES.orfeu,undefined);
}
console.log('Remake mechanics passed: eight signature techniques, impact timing, resource/silence gates, living targets, seven renewed ultimates and legacy learned IDs.');
