import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from 'typescript';
const out=mkdtempSync(join(tmpdir(),'eter-expansion-'));
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','cosmetics','data','engine','progression','music','sprites','summons','carmilla'])writeFileSync(`${out}/${name}.js`,ts.transpileModule(readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'"),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const {GameEngine,parseSave}=await import(pathToFileURL(join(out,'engine.js')).href),{MAPS,ASSETS}=await import(pathToFileURL(join(out,'data.js')).href),{SHOP,GEAR,QUESTS,level,spellBonus}=await import(pathToFileURL(join(out,'progression.js')).href),{musicFor,MUSIC,MusicDirector}=await import(pathToFileURL(join(out,'music.js')).href),{SPRITE_FRAMES}=await import(pathToFileURL(join(out,'sprites.js')).href);
let checks=0;const check=(ok,msg)=>{assert.ok(ok,msg);checks++;};
const saved=new Map();global.localStorage={setItem:(k,v)=>saved.set(k,v),getItem:k=>saved.get(k)||null};
const timers=[];global.setTimeout=cb=>{timers.push(cb);return 1;};const flush=()=>{let n=0;while(timers.length&&n++<200)timers.shift()();check(n<200,'animation settles');};
const fresh=()=>{const g=new GameEngine();g.start();g.finishCutscene();return g;};
const dialogue=g=>{let n=0;while(g.state.mode==='dialogue'&&n++<12)g.nextDialogue();check(n<12,'NPC dialogue resolves');};
check(Object.keys(MAPS).sort().join(',')===['patio','arquivo','subsolo','camara','porto','domo','galeria','ashwood','vigilia','ashpyre'].sort().join(','),'ten canonical logical maps remain available');
for(const [id,track] of [['patio','academy'],['arquivo','academy'],['porto','academy'],['domo','academy'],['subsolo','below'],['camara','below'],['galeria','below']]){check(musicFor({mode:'world',map:id})===track,`${id} area music`);check(musicFor({mode:'dialogue',map:id})===track,`${id} dialogue keeps area music`);}
check(musicFor({mode:'start',map:'galeria'})==='start','title always selects Press Start');
check(musicFor({mode:'battle',map:'subsolo',battle:{boss:false}})==='battle','common battle theme');
check(musicFor({mode:'battle',map:'galeria',battle:{boss:true}})==='boss','boss battle theme');
check(musicFor({mode:'cutscene',map:'galeria',cutscene:{id:'echo-awakening'}})==='boss','boss anticipation keeps boss theme');
for(const item of SHOP){check(Number.isInteger(item.icon)&&item.icon>=0&&item.icon<16,'all shop goods have an existing atlas icon');if(item.gear)check(GEAR[item.gear]&&GEAR[item.gear].minLevel===item.minLevel,'equipment tier matches catalog');}
const g=fresh();g.state.credits=10000;
check(!g.buy('shop-3-weapon'),'cannot buy above player level');
check(g.buy('shop-1-weapon')&&g.state.progress.owned.includes('shop-1-weapon'),'shop adds actual equipment');
const credits=g.state.credits;check(g.buy('shop-1-weapon')&&g.state.credits===credits-60&&g.state.progress.owned.includes('shop-1-weapon@2'),'repeat equipment purchase creates separately wearable copy');
check(!g.equip('ophelia','shop-1-weapon'),'katana remains Seiji equipment');check(g.equip('seiji','shop-1-weapon')&&g.attackPower('seiji')===27,'bought katana changes damage');
check(g.buy('shop-1-staff')&&g.equip('ophelia','shop-1-staff'),'Ophelia can buy and equip her own weapon');
check(spellBonus(g.state.progress,'ophelia')===3&&g.healPower('ophelia',36)===39,'staff changes real magic and healing');
check(g.returnToTitle()&&g.state.hasSave&&musicFor(g.state)==='start','return to title saves and selects music');g.start(true);
g.gainXp(120);check(level(g.state.progress)===3&&g.buy('shop-3-weapon'),'level up unlocks next stock');check(g.equip('seiji','shop-3-weapon')&&g.attackPower('seiji')>27,'higher tier improves combat');
g.travel('porto',{x:25,y:10});g.finishCutscene();check(g.buy('potion'),'harbor shop exchanges actual inventory');
g.travel('domo',{x:12,y:17});g.finishCutscene();check(!g.buy('potion'),'non-shop locations cannot sell');
check(g.state.progress.visited.includes('porto')&&g.state.progress.visited.includes('domo'),'travel records explored areas');
g.talkToCompanion('ava');dialogue(g);check(g.state.progress.requests.includes('ava-seeds'),'Ava registers quest');check(!g.claimQuest('ava-seeds'),'quest cannot skip collection');
g.travel('porto',{x:20,y:18});g.interact('semente-porto');check(g.state.opened.includes('semente-porto'),'real harbor chest yields seed');const supplies=g.state.potions;g.interact('semente-porto');check(g.state.potions===supplies,'seed chest cannot farm consumables');
g.state.stage=5;g.travel('galeria',{x:25,y:7});g.interact('semente-galeria');check(g.state.opened.includes('semente-galeria'),'real Gallery chest yields second seed');check(!g.claimQuest('ava-seeds'),'two seeds require returning to Ava');
g.travel('domo',{x:12,y:8});g.talkToCompanion('ava');dialogue(g);const xp=g.state.progress.xp;check(g.claimQuest('ava-seeds')&&g.state.progress.xp===xp+60,'returning to Ava pays XP once');check(!g.claimQuest('ava-seeds'),'Ava reward cannot repeat');
g.travel('arquivo',{x:16,y:14});g.talkToCompanion('orfeu');dialogue(g);check(g.state.progress.requests.includes('orfeu-map')&&g.state.progress.requests.includes('echo'),'Orfeu records exploration and post-chapter requests');
check(!g.claimQuest('orfeu-map'),'exploration requires all three places');g.travel('subsolo',{x:3,y:3});g.travel('arquivo',{x:16,y:14});g.talkToCompanion('orfeu');dialogue(g);check(g.claimQuest('orfeu-map'),'Orfeu accepts actual visited locations');
g.travel('porto',{x:15,y:11});g.talkToCompanion('max');dialogue(g);check(g.state.progress.requests.includes('max-patrol'),'Max registers patrol');
for(const id of ['lobo-norte','lobo-rastro','sombra-escada']){g.beginBattle(MAPS.subsolo.entities.find(e=>e.id===id));g.state.battle.hp=0;g.nextActor();g.finishBattle();check(g.state.progress.encounters.includes(id),`${id} records distinct encounter`);}
check(g.state.progress.kills.lobo===2&&g.state.progress.kills.sombra===1,'variants contribute to original bestiary families');
check(!g.claimQuest('max-patrol'),'patrol requires reporting to Max');g.talkToCompanion('max');dialogue(g);check(g.claimQuest('max-patrol'),'Max accepts all three unique encounters');
g.travel('galeria',{x:24,y:20});g.beginBattle(MAPS.galeria.entities.find(e=>e.id==='eco'));g.state.battle.hp=0;g.nextActor();g.finishBattle();check(g.state.stage===5,'optional boss preserves completed chapter');g.finishCutscene();check(g.state.progress.kills.eco===1&&!g.activeEntities().some(e=>e.id==='eco'),'optional boss defeat persists uniquely');
check(!g.claimQuest('echo'),'optional expedition requires reporting');g.travel('arquivo',{x:16,y:14});g.talkToCompanion('orfeu');dialogue(g);check(g.claimQuest('echo'),'Orfeu accepts optional expedition');
g.save();const old=JSON.parse([...saved.values()][0]);delete old.progress.requests;delete old.progress.visited;delete old.progress.encounters;delete old.progress.kills.eco;const migrated=parseSave(JSON.stringify(old));check(migrated&&migrated.progress.kills.eco===0&&migrated.progress.visited.includes(old.map),'v1.2 save migrates optional fields safely');
const current=parseSave([...saved.values()][0]);check(current&&current.progress.requests.includes('echo')&&current.progress.kills.eco===1,'new quests and optional boss survive reload');
const blocked=fresh();blocked.state.stage=4;blocked.travel('camara',{x:10,y:3});blocked.interact('porta-galeria');check(blocked.state.mode==='dialogue'&&blocked.state.map==='camara','Gallery gate respects main chapter');
for(const r of SPRITE_FRAMES.max)check(r.x>=0&&r.y>=0&&r.x+r.w<=1086&&r.y+r.h<=1448,'complete Max source crop and feet inside sheet');
for(const [key,path] of Object.entries(MUSIC))check(existsSync(`public${path.src}`),`${key} MP3 exists`);
// Real audio coordinator: activation, looping, area changes, crossfade completion and mute.
const frames=new Map();let frameId=0;global.requestAnimationFrame=cb=>{frames.set(++frameId,cb);return frameId;};global.cancelAnimationFrame=id=>frames.delete(id);
class AudioMock{src='';loop=false;preload='';volume=1;currentTime=0;paused=true;plays=0;reject=false;pause(){this.paused=true;}play(){this.plays++;if(this.reject)return Promise.reject(new Error('autoplay'));this.paused=false;return Promise.resolve();}}
const channels=[new AudioMock(),new AudioMock()],statuses=[],music=new MusicDirector(channels,s=>statuses.push(s));
check(channels.every(a=>a.loop),'both audio channels loop');check(channels.every(a=>a.plays===0),'no playback before gesture');check(await music.setEnabled(true),'explicit activation starts title MP3');
check(channels[0].src===MUSIC.start.src&&!channels[0].paused,'Press Start is playing');music.request('academy');await Promise.resolve();for(const [id,cb] of [...frames]){frames.delete(id);cb(0);}check(channels.every(a=>a.volume>=0&&a.volume<=1),'early animation timestamp keeps legal audio volume');for(const [id,cb] of [...frames]){frames.delete(id);cb(performance.now()+1000);}check(channels[0].paused&&!channels[1].paused&&channels[1].src===MUSIC.academy.src,'area transition fades to supplied Academy MP3');
music.setVolume(.35);check(channels[1].volume===.35,'volume affects active audio');await music.setEnabled(false);check(channels.every(a=>a.paused),'mute pauses both channels');music.request('battle');check(channels.every(a=>a.paused),'muted context never autoplays');check(!(await music.unlock()),'gesture retry preserves mute');check(await music.setEnabled(true)&&channels[music.active].src===MUSIC.battle.src,'explicit unmute resumes correct battle theme');music.dispose();check(channels.every(a=>a.paused&&a.src===''),'dispose stops all music');
const denied=[new AudioMock(),new AudioMock()];denied[0].reject=true;let status;const rejected=new MusicDirector(denied,s=>status=s);check(!(await rejected.setEnabled(true))&&status==='blocked','blocked autoplay reports real state');rejected.dispose();
console.log(`${checks} expansion checks passed: MP3 mapping and playback, ten maps, gear tiers, canonical NPC quests, unique encounters, optional boss and compatible saves.`);
