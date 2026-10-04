import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-orfeu-')),compiled=new Set();
function compile(name){
 if(compiled.has(name))return;compiled.add(name);
 let source=readFileSync(`lib/game/${name}.ts`,'utf8');
 for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);
 source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
for(const name of ['engine','sprites','characterAnimation','orfeuArtV30'])compile(name);
const component=readFileSync('components/character-vfx.ts','utf8').replace(/from ['"]@\/lib\/game\/([\w-]+)['"]/g,"from './$1.js'");
writeFileSync(join(out,'character-vfx.js'),ts.transpileModule(component,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const imported=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave}=await imported('engine');
const {ASSETS,SKILLS,ULTIMATE_NAMES,combatElement}=await imported('data');
const {deriveHeroes}=await imported('progression');
const {SPRITE_FRAMES}=await imported('sprites');
const {ORFEU_ASSETS_V30,ORFEU_FRAMES_V30}=await imported('orfeuArtV30');
const {hasCharacterBattleArt,isRemadeHero,characterPoseFrame,skillMotifIndex}=await imported('characterAnimation');
const {drawCharacterVfx}=await imported('character-vfx');
let timers=[],saved,checks=0;
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
const check=(value,message)=>{assert.ok(value,message);checks++;};
global.localStorage={setItem:(_,value)=>saved=value,getItem:()=>null};
global.setTimeout=callback=>{timers.push(callback);return timers.length;};
function fixture(){
 const game=new GameEngine();game.start(false);game.finishCutscene();
 const p=game.state.progress;p.recruited=['orfeu','seiji','ophelia'];p.party=[...p.recruited];
 p.summoned=['orfeu'];p.bonded=['orfeu'];p.masterMode=false;p.learned=[];
 game.state.heroes=deriveHeroes(p);
 game.beginBattle({id:'orfeu-regression',kind:'mob',label:'Selo de teste',asset:'shadow',family:'selo',hp:5000,damage:1,x:1,y:1});
 Object.assign(game.state.battle,{queue:['orfeu','enemy'],index:0,busy:false,animation:undefined});timers=[];
 return game;
}

equal(SKILLS.orfeu.map(s=>s.id),['echo-strike','echo-ward'],'approved save-compatible skill IDs');
equal(ULTIMATE_NAMES.orfeu,'Domínio Nulo','approved ultimate name');
for(const action of ['attack','echo-strike','echo-ward','ultimate'])equal(combatElement('orfeu',action),'neutral',`${action} remains non-elemental`);
{
 const game=fixture(),battle=game.state.battle,hero=game.currentHero(),hp=battle.hp,mp=hero.mp;
 check(game.action('echo-strike'),'Palma de Ruptura starts');
 equal(hero.mp,mp-8,'Palma cost deducted once');equal(battle.hp,hp,'physical impact waits for animation');
 equal(battle.animation.target,'enemy','Palma targets enemy');equal(battle.animation.element,'neutral','Palma animation is neutral');
 check(!game.action('echo-strike'),'busy actor cannot spend MP twice');
 timers.shift()();
 equal(hp-battle.hp,32,'approved physical skill damage');
 equal(battle.statuses.enemy.find(s=>s.id==='silence').turns,1,'Palma interrupts magic for one action');
}
{
 const game=fixture(),battle=game.state.battle,hero=game.currentHero(),mp=hero.mp,hp=battle.hp;
 const seiji=game.state.heroes.find(h=>h.id==='seiji'),ophelia=game.state.heroes.find(h=>h.id==='ophelia');
 seiji.hp-=10;ophelia.hp=0;
 battle.statuses.seiji=[{id:'silence',turns:2},{id:'bleed',turns:2}];
 battle.statuses.ophelia=[{id:'silence',turns:2},{id:'blind',turns:2}];
 check(game.action('echo-ward'),'Guarda Nula starts');
 equal(hero.mp,mp-11,'Guarda cost deducted once');equal(battle.animation.target,'party','Guarda targets group');
 check(!seiji.guard&&game.hasStatus('seiji','silence'),'group guard/cleanse waits for impact');
 timers.shift()();
 equal(battle.hp,hp,'Guarda never deals enemy damage');check(game.state.heroes.filter(member=>member.hp>0).every(member=>member.guard),'party guard applied');
 check(!game.hasStatus('seiji','silence'),'Guarda removes silence');check(game.hasStatus('seiji','bleed'),'Guarda preserves other statuses');
 const protectedSeiji=game.state.heroes.find(member=>member.id==='seiji'),protectedOphelia=game.state.heroes.find(member=>member.id==='ophelia');
 equal(protectedSeiji.hp,protectedSeiji.maxHp-10,'Guarda is protection without invented healing');equal(protectedOphelia.hp,0,'Guarda does not revive');
}
for(const action of ['echo-strike','echo-ward']){
 const silenced=fixture(),h=silenced.currentHero(),mp=h.mp;
 silenced.state.battle.statuses.orfeu=[{id:'silence',turns:1}];
 check(!silenced.action(action),`${action} respects silence`);equal(h.mp,mp,'rejected skill preserves MP');
 const empty=fixture();empty.currentHero().mp=0;check(!empty.action(action),`${action} requires MP`);
}
{
 const game=fixture(),battle=game.state.battle,hero=game.currentHero(),hp=battle.hp,mp=hero.mp;
 game.state.progress.limit.orfeu=99;check(!game.action('ultimate'),'ultimate requires full limit');equal(game.state.progress.limit.orfeu,99,'rejected ultimate preserves limit');
 game.state.progress.limit.orfeu=100;game.state.progress.learned=['orfeu-master'];
 battle.statuses.orfeu=[{id:'silence',turns:1}];battle.statuses.seiji=[{id:'silence',turns:2},{id:'blind',turns:2}];
 check(game.action('ultimate'),'approved physical ultimate remains available under silence');
 equal(game.state.progress.limit.orfeu,0,'ultimate spends limit once');equal(hero.mp,mp,'ultimate retains zero MP cost');
 equal(battle.hp,hp,'ultimate waits for impact');equal(battle.animation.duration,4800,'ultimate keeps cinematic duration');
 equal(battle.animation.element,'neutral','Domínio Nulo stays non-elemental');timers.shift()();
 equal(hp-battle.hp,78+hero.atk+12,'physical ultimate keeps attack scaling and legacy mastery');
 equal(battle.statuses.enemy.find(s=>s.id==='silence').turns,2,'Domínio Nulo silences enemy for two actions');
 check(game.state.heroes.every(h=>h.guard),'Domínio Nulo guards group');
 check(!game.hasStatus('orfeu','silence')&&!game.hasStatus('seiji','silence'),'Domínio Nulo removes allied silence');
 check(game.hasStatus('seiji','blind'),'ultimate preserves unrelated states');
 game.state.mode='world';game.state.battle=null;game.state.progress.learned=['orfeu-vital','orfeu-master','orfeu-field'];game.save();
 const parsed=parseSave(saved);check(parsed,'existing save parses');equal(parsed.progress.learned,game.state.progress.learned,'Orfeu learned IDs survive save');check(parsed.progress.party.includes('orfeu'),'Orfeu remains recruited in save');
}

check(hasCharacterBattleArt('orfeu'),'Orfeu eligible for personal neutral FX');
check(!isRemadeHero('orfeu'),'partial art update preserves full-remake exceptions');
equal(skillMotifIndex('echo-strike'),1,'Palma uses rupture motif');equal(skillMotifIndex('echo-ward'),2,'Guarda uses protection motif');
for(const [action,count] of [['cast',6],['ultimate',8]]){
 const seen=new Set(Array.from({length:101},(_,i)=>characterPoseFrame('orfeu',action,i/100,count)));
 equal(seen.size,count,`all ${action} poses appear`);
}
equal(characterPoseFrame('orfeu','cast',.5,6),2,'cast holds rupture before the guarding pose');
equal(characterPoseFrame('orfeu','ultimate',.2,8),2,'ultimate holds the grounded anticipation pose');
equal(characterPoseFrame('orfeu','attack',.6,4),2,'approved four-frame basic timing preserved');
for(const [key,path] of Object.entries(ORFEU_ASSETS_V30)){
 equal(ASSETS[key],path,`${key} registered at final path`);check(existsSync(`public${path}`),`${key} file exists`);
}
check(!ASSETS.orfeu.includes('/v30/'),'approved walk preserved');check(!ASSETS.dlg_orfeu.includes('/v30/'),'approved portrait preserved');check(!ASSETS.battle_orfeu_attack.includes('/v30/'),'approved basic art preserved');
for(const [key,crops] of Object.entries(ORFEU_FRAMES_V30)){
 equal(SPRITE_FRAMES[key],crops,`${key} measured crops integrated`);
 const {data,info}=await sharp(`public${ASSETS[key]}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let transparent=0;for(let i=info.channels-1;i<data.length;i+=info.channels)if(data[i]===0)transparent++;
 check(transparent>info.width*info.height*.45,`${key} real open alpha background, without an opaque matte`);
 for(const [i,c] of crops.entries()){
  check(Object.values(c).every(Number.isFinite),`${key}/${i} finite crop/anchor`);
  check(c.x>=0&&c.y>=0&&c.w>0&&c.h>0&&c.x+c.w<=info.width&&c.y+c.h<=info.height,`${key}/${i} inside native source`);
  let visible=0,edge=0;
  for(let y=0;y<c.h;y++)for(let x=0;x<c.w;x++){
   const a=data[((c.y+y)*info.width+c.x+x)*info.channels+info.channels-1];
   if(a>24){visible++;if(!x||!y||x===c.w-1||y===c.h-1)edge++;}
  }
  check(visible>0,`${key}/${i} visible artwork`);equal(edge,0,`${key}/${i} isolated alpha edges`);
 }
}
const slot=x=>({x,y:200,labelY:220,cellWidth:130,height:150}),origin=slot(100),target=slot(600),allies=[slot(100),slot(240)];
const calls=[],ctx={save(){},restore(){},drawImage(...args){calls.push(args);},globalAlpha:1};
const art={battle_fx_orfeu:{naturalWidth:1536,naturalHeight:1024}};
const expectCrop=index=>{const c=SPRITE_FRAMES.battle_fx_orfeu[index];equal(calls[0].slice(1,5),[c.x,c.y,c.w,c.h],'render chooses the generated motif crop');};
check(drawCharacterVfx(ctx,art,'orfeu','echo-strike',origin,target,[],.3,-1,140),'Palma uses personal art before impact');expectCrop(1);
check(calls[0][5]+calls[0][7]/2>origin.x&&calls[0][5]+calls[0][7]/2<target.x,'rupture travels toward enemy');
calls.length=0;check(drawCharacterVfx(ctx,art,'orfeu','echo-ward',origin,allies[0],allies,.7,100,140),'Guarda uses generated group shields');expectCrop(2);
equal(calls.length,2,'Guarda renders each allied shield');equal(calls.map(a=>a[5]+a[7]/2),allies.map(s=>s.x),'Guarda remains centered on allies');
calls.length=0;check(drawCharacterVfx(ctx,art,'orfeu','ultimate',origin,target,[],.7,100,140),'Domínio Nulo uses generated anti-magic art');expectCrop(5);
calls.length=0;check(!drawCharacterVfx(ctx,art,'orfeu','guard',origin,target,[],.7,100,140),'ordinary guard remains free of offensive FX');equal(calls.length,0,'suppressed FX draws nothing');
console.log(`${checks} Orfeu checks passed: neutral physical mechanics, impact/resource/control rules, compatible saves, personal FX routing and 26 isolated native frames.`);
