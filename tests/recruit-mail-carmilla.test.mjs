import {compileGameModules} from './game-module-loader.mjs';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-recruit-mail-'));
compileGameModules(out,['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','expansionV30','enemyArtV30','orfeuArtV30','gachaSequence','questsV31','questRuntimeV31','questArtV31','cosmetics','data','progression','summons','carmilla','sprites','engine']);
const {GameEngine,parseSave,SAVE_KEY,STARTER_FIVE_STAR_IDS}=await import(pathToFileURL(join(out,'engine.js')).href);
const {ASSETS,SKILLS}=await import(pathToFileURL(join(out,'data.js')).href);
const {SPRITE_FRAMES}=await import(pathToFileURL(join(out,'sprites.js')).href);
const storage=new Map();global.localStorage={setItem:(key,value)=>storage.set(key,value),getItem:key=>storage.get(key)||null};
const timers=[];global.setTimeout=callback=>{timers.push(callback);return timers.length;};
const fresh=(protagonist)=>{const game=new GameEngine();game.start(false,protagonist);game.finishCutscene();return game;};

{
 const game=fresh();const before=game.state.progress.tokens;
 assert.equal(game.claimStarterMail(),true);assert.equal(game.state.progress.tokens,before+30);
 assert.equal(game.claimStarterMail(),false,'welcome mail cannot be claimed twice');
 assert.deepEqual([...STARTER_FIVE_STAR_IDS],['beatriz','orfeu','ava']);
 assert.equal(game.selectStarterFiveStar('carmilla'),false,'achievement hero is not offered by selector');
 assert.equal(game.selectStarterFiveStar('orfeu'),true);
 assert.equal(game.selectStarterFiveStar('ava'),false,'selector cannot be used twice');
 assert.ok(game.state.progress.recruited.includes('orfeu'));
 const restored=parseSave(storage.get(SAVE_KEY));assert.equal(restored?.progress.starterSelected,'orfeu');
 assert.ok(restored.progress.party.includes('orfeu'),'selected 5-star joins playable party');
 const legacy=JSON.parse(storage.get(SAVE_KEY));delete legacy.progress.starterMailClaimed;delete legacy.progress.starterSelectorPending;delete legacy.progress.starterSelected;
 const migrated=parseSave(JSON.stringify(legacy));assert.equal(migrated?.progress.starterMailClaimed,false,'old saves receive the mail once');
}

for(const id of ['marin','gabriel','max','seiji','ophelia']){
 const game=fresh(id==='seiji'||id==='ophelia'?'max':'seiji');
 assert.equal(game.challengeRecruit(id),true,`${id} can be challenged`);
 const battle=game.state.battle;
 assert.equal(battle.asset,id,`${id} duel uses character art, never a shadow/banshee`);
 assert.equal(ASSETS[`battle_${id}_attack`].startsWith('/assets/'),true);
 assert.ok(SPRITE_FRAMES[`battle_${id}_attack`]?.length>=4,`${id} has opponent attack frames`);
 assert.ok(SPRITE_FRAMES[`battle_${id}_cast`]?.length>=4,`${id} has opponent skill frames`);
 assert.equal(battle.eventId,`recruit-${id}`);
 timers.length=0;battle.round=2;battle.queue=['enemy'];battle.index=0;battle.busy=false;battle.bossCharge=0;game.nextActor();
 assert.equal(battle.animation.action,SKILLS[id][0].id,`${id} uses their own skill, not a shadow move`);
 timers.shift()();assert.ok(battle.log.some(line=>line.startsWith(`${SKILLS[id][0].name}:`)));
 timers.length=0;battle.round=4;battle.bossCharge=100;battle.index=0;battle.busy=false;game.nextActor();
 assert.equal(battle.animation.action,'enemy-ultimate');timers.shift()();
 assert.ok(battle.log.some(line=>line.startsWith(`${game.ultimateName(id)}:`)),`${id} uses their own ultimate`);
 timers.length=0;
 battle.hp=0;game.nextActor();assert.equal(battle.result,'victory');game.finishBattle();
 assert.ok(game.state.progress.recruited.includes(id),`${id} joins after victory`);
 assert.ok(parseSave(storage.get(SAVE_KEY)),`${id} recruitment survives save`);
}

{
 const game=fresh();assert.equal(game.activateMasterMode(),true);
 assert.ok(game.state.progress.recruited.includes('carmilla'));
 assert.ok(game.state.progress.summoned.includes('carmilla'));
 assert.equal(game.assignParty(2,'carmilla'),true);
 assert.ok(parseSave(storage.get(SAVE_KEY))?.progress.recruited.includes('carmilla'));
 game.beginBattle({id:'test-duel',label:'Treino',kind:'mob',x:0,y:0,asset:'shadow',family:'sombra',hp:500,damage:1});
 timers.length=0;
 game.state.battle.queue=['carmilla','enemy','seiji','ophelia'];game.state.battle.index=0;game.state.battle.busy=false;
 const seiji=game.state.heroes.find(h=>h.id==='seiji'),ophelia=game.state.heroes.find(h=>h.id==='ophelia'),carmilla=game.state.heroes.find(h=>h.id==='carmilla');
 seiji.hp=20;ophelia.hp=45;carmilla.hp=60;carmilla.mp=0;game.state.progress.masterMode=false;
 assert.equal(game.action('in-aeternum-vive'),true,'zero-MP support skill can execute');
 timers.shift()();
 assert.equal(game.state.heroes.find(h=>h.id==='seiji').hp,seiji.maxHp);assert.equal(game.state.heroes.find(h=>h.id==='ophelia').hp,45,'only lowest HP percentage is healed');
 assert.equal(game.state.heroes.find(h=>h.id==='carmilla').hp,60-Math.ceil((seiji.maxHp-20)*.15));
 assert.deepEqual(game.state.battle.animation.targets,['seiji']);
 assert.equal(game.state.battle.animation.selfDamage,Math.ceil((seiji.maxHp-20)*.15));
}

assert.ok(readFileSync('components/loading-screen.tsx','utf8').includes('setInterval'),'loading tips rotate');
assert.ok(readFileSync('public/assets/v24/loading-ensemble-preview.png').length>100000,'six-character loading illustration is bundled');
console.log('MAIL once + 30 summons + playable 5-star selector, five recruitable duels, Carmilla combat/save and rotating loading tips: OK');
