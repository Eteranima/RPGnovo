import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';
import {inflateSync} from 'node:zlib';

const out=mkdtempSync(join(tmpdir(),'eter-elements-'));
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','cosmetics','data','progression','summons','carmilla','engine']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {GameEngine,parseSave}=await import(pathToFileURL(join(out,'engine.js')).href);
const {PLAYABLE_HERO_IDS,HERO_COMBAT_ELEMENTS,combatElement,combatImpact,SKILLS,heroBases,ULTIMATE_NAMES,EARTH_VFX_FRAMES,ASSETS}=await import(pathToFileURL(join(out,'data.js')).href);
const {deriveHeroes,TREE,EXTRA_SKILLS,STATUS,FIELD_TECHNIQUES}=await import(pathToFileURL(join(out,'progression.js')).href);
const {summonedById}=await import(pathToFileURL(join(out,'summons.js')).href);
let saved,timers=[];global.localStorage={setItem:(_,value)=>saved=value,getItem:()=>null};
global.setTimeout=callback=>{timers.push(callback);return timers.length;};

const freshHero=id=>{
 const game=new GameEngine();game.start(false);game.finishCutscene();
 game.state.progress.recruited=[id];game.state.progress.party=[id];
 game.state.progress.summoned=['beatriz','orfeu','ava','carmilla'];game.state.progress.bonded=['beatriz','orfeu','ava','carmilla'];
 game.state.progress.masterMode=true;
 game.state.progress.learned=TREE.filter(node=>node.hero===id).map(node=>node.id);
 game.state.heroes=deriveHeroes(game.state.progress);
 game.state.heroes[0].hp=Math.max(1,Math.floor(game.state.heroes[0].maxHp*.6));
 game.beginBattle({id:'element-audit',kind:'mob',label:'Auditoria elemental',x:11,y:8,asset:'wolf',family:'lobo',hp:50000,damage:1});
 timers=[];const battle=game.state.battle;battle.queue=[id,'enemy'];battle.index=0;battle.busy=false;battle.animation=undefined;
 return game;
};

for(const id of PLAYABLE_HERO_IDS){
 const primary=HERO_COMBAT_ELEMENTS[id];
 for(const action of ['attack','ultimate',...SKILLS[id].map(skill=>skill.id),...EXTRA_SKILLS[id].map(skill=>skill.id)]){
  const expected=id==='beatriz'?action==='umbra-seal'?'dark':['ultimate','abyss-countertide'].includes(action)?'water-dark':'water':primary;
  assert.equal(combatElement(id,action),expected,`${id}:${action} keeps elemental identity`);
  if(action==='in-aeternum-vive')continue; // Its automatic ally selection is covered by the dedicated Carmilla suite.
  const game=freshHero(id);if(action==='ultimate')game.state.progress.limit[id]=100;
  assert.equal(game.action(action,id),true,`${id}:${action} can execute`);
  assert.equal(game.state.battle.animation.element,expected,`${id}:${action} exposes the same element to battle and cinematic rendering`);
 }
 assert.equal(combatElement(id,'guard'),'neutral');
 assert.equal(combatElement(id,'potion'),'neutral');
}
for(const id of PLAYABLE_HERO_IDS)for(const technique of FIELD_TECHNIQUES[id].filter(t=>t.timed)){
 const game=freshHero(id);game.state.mode='world';game.state.battle=null;
 assert.ok(game.useFieldSkill(technique.id),`${id}:${technique.id} existing field ability works`);
 assert.equal(game.state.fieldEffect.kind,technique.id==='shadow-step'?'shadow':HERO_COMBAT_ELEMENTS[id],`${id} field effect keeps its element`);
}
assert.equal(combatImpact('ice').row,0,'Ophelia uses the actual ice atlas row');
assert.equal(combatImpact('fire').row,3,'the fire atlas is reserved for Fire');
assert.equal(combatImpact('water').asset,'battle_fx_beatriz','Water uses generated Water art');
assert.equal(combatImpact('water-dark').row,1,'dual ultimate keeps the dark Water row');
assert.equal(combatImpact('earth').asset,'battle_fx_ava','Earth uses its generated sandstone effects');
assert.equal(combatImpact('earth').frames.length,6,'six measured isolated Earth frames');
for(const element of ['lightning','neutral','blood'])assert.equal(combatImpact(element),undefined,`${element} never borrows the generic fire or ice effect`);

for(const action of ['vine-strike','ultimate']){
 const game=freshHero('ava');if(action==='ultimate')game.state.progress.limit.ava=100;
 const hp=game.state.battle.hp;assert.ok(game.action(action));timers.shift()();
 assert.ok(game.state.battle.hp<hp,'Ava Earth action retains real damage');
 assert.ok(game.hasStatus('enemy','bind'),'Ava applies the existing one-action immobilization as stone');
 assert.equal(game.hasStatus('enemy','freeze'),false,'Ava never freezes the opponent');
 assert.equal(STATUS.bind.name,'Prisão de Pedra');
 assert.equal(game.addStatus('enemy','bind',1),false,'original one-use immobilization rule is preserved');
 game.state.battle.busy=false;game.state.battle.animation=undefined;game.state.battle.queue=['enemy'];game.state.battle.index=0;game.nextActor();
 assert.equal(game.state.battle.animation.action,'bound');assert.equal(game.state.battle.animation.element,'earth','the skipped turn remains Earth');
}
{
 const game=freshHero('ophelia');assert.ok(game.action('freeze'));timers.shift()();
 assert.ok(game.hasStatus('enemy','freeze'));assert.equal(game.hasStatus('enemy','bind'),false,'Ophelia still uses Ice control');
}
{
 const game=freshHero('ava');game.state.mode='world';game.state.battle=null;game.save();
 const legacy=JSON.parse(saved);legacy.heroes[0].element='Natureza';
 assert.equal(parseSave(JSON.stringify(legacy)).heroes[0].element,'Terra','old Natureza save derives corrected Earth metadata');
 assert.equal(heroBases().find(hero=>hero.id==='ava').element,'Terra');
 assert.equal(summonedById('ava').element,'Terra');assert.equal(summonedById('ava').rarity,5);
 assert.equal(summonedById('orfeu').element,'Sem Elemento');
 assert.equal(ULTIMATE_NAMES.ava,'Soberania da Terra');
}
{
 const png=readFileSync('public'+ASSETS.battle_fx_ava),w=png.readUInt32BE(16),h=png.readUInt32BE(20);
 assert.equal(w,1536);assert.equal(h,1024);assert.equal(png[24],8);assert.equal(png[25],6,'Earth effect has a real RGBA alpha channel');
 const chunks=[];for(let offset=8;offset<png.length;){const length=png.readUInt32BE(offset);if(png.toString('ascii',offset+4,offset+8)==='IDAT')chunks.push(png.subarray(offset+8,offset+8+length));offset+=length+12;}
 const raw=inflateSync(Buffer.concat(chunks)),stride=w*4,pixels=Buffer.alloc(stride*h);
 const paeth=(a,b,c)=>{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
 for(let y=0;y<h;y++){const filter=raw[y*(stride+1)];for(let x=0;x<stride;x++){const value=raw[y*(stride+1)+x+1],left=x>=4?pixels[y*stride+x-4]:0,up=y?pixels[(y-1)*stride+x]:0,upperLeft=y&&x>=4?pixels[(y-1)*stride+x-4]:0;pixels[y*stride+x]=(value+(filter===0?0:filter===1?left:filter===2?up:filter===3?Math.floor((left+up)/2):paeth(left,up,upperLeft)))&255;}}
 let transparent=0;for(let index=3;index<pixels.length;index+=4)if(pixels[index]===0)transparent++;
 assert.ok(transparent>1000000,'background is substantially transparent');
 for(const [index,crop] of EARTH_VFX_FRAMES.entries()){
  assert.ok(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=w&&crop.y+crop.h<=h);
  let visible=0;
  for(let y=crop.y;y<crop.y+crop.h;y++)for(let x=crop.x;x<crop.x+crop.w;x++){
   const alpha=pixels[(y*w+x)*4+3];if(alpha>128)visible++;
   if(x===crop.x||x===crop.x+crop.w-1||y===crop.y||y===crop.y+crop.h-1)assert.ok(alpha<=8,`Earth frame ${index} has no visible neighboring effect on crop boundary`);
  }
  assert.ok(visible>1000,`Earth frame ${index} contains real generated stone art`);
 }
}
console.log('Element audit passed: all 9 playable heroes, basic attacks, skills, ultimates, Earth stone control, Ice control and legacy saves.');
