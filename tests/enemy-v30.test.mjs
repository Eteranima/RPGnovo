import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import ts from 'typescript';

const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-enemy-v30-')),compiled=new Set();
function compile(name){
 if(compiled.has(name))return;compiled.add(name);
 let source=readFileSync(`lib/game/${name}.ts`,'utf8');
 for(const match of source.matchAll(/from\s+['"]\.\/([\w-]+)['"]/g))compile(match[1]);
 source=source.replace(/from\s+(['"])\.\/([\w-]+)\1/g,"from './$2.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
for(const name of ['engine','enemyArtV30','battleFormation','environment','characterAnimation'])compile(name);
const imported=async name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,parseSave,SAVE_KEY,isWalkable,findPath}=await imported('engine');
const {ASSETS,MAPS,ENEMY_ULTIMATES,ELEMENT_COLORS,battleBackground}=await imported('data');
const {BESTIARY,BOSS_REWARDS,ANCHORS,CUTSCENES}=await imported('progression');
const {SPRITE_FRAMES,battleCrop}=await imported('sprites');
const {ENEMY_ASSETS_V30,ENEMY_FRAMES_V30,ENEMY_PRESENTATION_V30,ENEMY_ULTIMATE_EFFECTS_V30,enemyBattleKey,enemyPoseFrame}=await imported('enemyArtV30');
const {EXPANSION_MAPS_V30,EXPANSION_GATEWAYS_V30}=await imported('expansionV30');
const {battleFormation,battleActorScale}=await imported('battleFormation');
const {ENVIRONMENT_ASSETS,paintEnvironmentTile}=await imported('environment');
const animation=await imported('characterAnimation');
let checks=0,timers=[];const store=new Map();
const check=(value,message)=>{assert.ok(value,message);checks++;};
const equal=(actual,expected,message)=>{assert.deepEqual(actual,expected,message);checks++;};
global.localStorage={setItem:(key,value)=>store.set(key,value),getItem:key=>store.get(key)||null};
global.setTimeout=(fn,ms)=>{timers.push({fn,ms});return timers.length;};
Math.random=()=>.99;
function fresh(){store.clear();const game=new GameEngine();game.start(false);game.finishCutscene();timers=[];return game;}
function finishDialogue(game){let steps=0;while(['dialogue','cutscene'].includes(game.state.mode)&&steps++<30){if(game.state.mode==='cutscene')game.nextCutscene();else game.nextDialogue();}check(steps<30,'dialogue/cutscene callback terminates');}
function encounter(family){for(const map of Object.values(MAPS)){const entity=map.entities.find(e=>e.family===family||e.id===family);if(entity&&['mob','boss'].includes(entity.kind))return {map,entity};}throw Error(`missing encounter ${family}`);}
function readyEnemy(game,family){const {map,entity}=encounter(family);game.state.map=map.id;game.state.position={x:entity.x,y:entity.y};game.beginBattle(entity);timers=[];Object.assign(game.state.battle,{queue:['enemy','seiji','ophelia'],index:0,busy:false,animation:undefined});game.state.heroes.forEach(h=>{h.hp=500;h.maxHp=500;h.guard=false;});return game.state.battle;}
const balances=game=>structuredClone({xp:game.state.progress.xp,credits:game.state.credits,tokens:game.state.progress.tokens,kills:game.state.progress.kills,owned:game.state.progress.owned,encounters:game.state.progress.encounters});

equal(Object.keys(ENEMY_ULTIMATES).sort(),['ashwolf','astral','cinder','eco','lobo','lunastag','moth','runewarden','selo','sombra'],'all ten actual enemy ultimate families');
for(const family of Object.keys(ENEMY_ULTIMATES)){
 const game=fresh(),b=readyEnemy(game,family),spec=ENEMY_ULTIMATES[family],art=ENEMY_PRESENTATION_V30[family];b.bossCharge=100;
 const hp=game.state.heroes.map(h=>h.hp);game.nextActor();
 equal(b.animation.action,b.boss?'boss-ultimate':'enemy-ultimate','charged enemy selects real ultimate');equal(b.animation.element,spec.element,'motor exposes family element');equal(ENEMY_ULTIMATE_EFFECTS_V30[family].element,spec.element,'authored effect matches motor element');
 equal(b.bossCharge,0,'charge reserved once');equal(b.animation.duration,4800,'cinematic retains combat duration');equal(game.state.heroes.map(h=>h.hp),hp,'damage waits for real impact callback');check(!game.action('attack'),'commands locked during enemy cinematic');
 equal(enemyBattleKey(family,b.asset,b.boss,b.phase,b.animation.action),art.ultimate,'battle selects family-specific ultimate atlas');
 const contactTime=(b.animation.impactAt-900)/(b.animation.duration-900);equal(enemyPoseFrame(family,'ultimate',contactTime,8),art.impactFrame,'real delayed impact coincides with authored contact pose');
 const impact=timers.find(t=>t.ms===b.animation.impactAt),recovery=timers.find(t=>t.ms===b.animation.duration);check(impact&&recovery,'distinct impact/recovery callbacks scheduled');impact.fn();
 const damage=Math.round((b.damage+(spec.area?5:0))*spec.multiplier);equal(game.state.heroes[0].hp,hp[0]-damage,'ultimate applies actual approved damage');equal(game.state.heroes[1].hp,hp[1]-(spec.area?damage:0),'single/area target preserved');
 check(b.statuses.seiji.some(s=>s.id===spec.status),'actual contact status applied');check(b.busy,'impact keeps recovery locked');
 recovery.fn();equal(b.index,1,'ultimate recovery advances queue exactly once');
 if(spec.status==='freeze')check(b.busy&&b.animation?.actor==='seiji'&&b.animation.action==='frozen','next actor visibly loses its action to actual freeze');else check(!b.busy&&game.currentHero()?.id==='seiji','recovery releases next real actor');
 const after=game.state.heroes.map(h=>h.hp);impact.fn();equal(game.state.heroes.map(h=>h.hp),after,'stale impact cannot hit after animation recovery');
 const silent=fresh(),blocked=readyEnemy(silent,family);blocked.bossCharge=100;blocked.statuses.enemy=[{id:'silence',turns:1}];silent.nextActor();equal(blocked.animation.action,'enemy-hit','silence prevents charged magic ultimate');equal(blocked.bossCharge,100,'silenced enemy keeps charge until an eligible action');
 equal(enemyPoseFrame(family,'ultimate',-1,8),0,'ultimate starts inside atlas');equal(enemyPoseFrame(family,'ultimate',2,8),7,'ultimate ends on recovery pose');equal(new Set(Array.from({length:101},(_,i)=>enemyPoseFrame(family,'ultimate',i/100,8))).size,8,'all eight own ultimate drawings appear');
}

for(const gateway of EXPANSION_GATEWAYS_V30){
 const game=fresh();game.state.map=gateway.map;game.state.position={x:gateway.entity.x,y:gateway.entity.y};game.state.stage=4;game.interact(gateway.entity.id);equal(game.state.map,gateway.map,'expansion gateway respects finished-report gate');equal(game.state.mode,'dialogue','closed gateway gives real feedback');finishDialogue(game);
 game.state.stage=5;game.interact(gateway.entity.id);equal(game.state.map,gateway.entity.to,'same gateway opens after existing report');equal(game.state.position,gateway.entity.spawn,'gateway enters defined walkable spawn');check(isWalkable(game.map,game.state.position.x,game.state.position.y),'new area spawn walkable');
}
for(const [id,map] of Object.entries(EXPANSION_MAPS_V30)){
 equal(MAPS[id],map,'expansion data registered at final map ID');check(!!ASSETS[battleBackground(id)]&&existsSync(`public${ASSETS[battleBackground(id)]}`),'new battle background exists');
 const spawn=EXPANSION_GATEWAYS_V30.find(g=>g.entity.to===id).entity.spawn;
 for(const entity of map.entities){const neighbors=[{x:entity.x,y:entity.y+1},{x:entity.x-1,y:entity.y},{x:entity.x+1,y:entity.y}];check(neighbors.some(p=>findPath(map,spawn,p).length),'new enemy/interaction reachable through real collisions');}
 const game=fresh();game.state.stage=5;game.travel(id,spawn);const chest=map.entities.find(e=>e.kind==='chest');game.state.position={x:chest.x,y:chest.y};const potions=game.state.potions,ethers=game.state.ethers;game.interact(chest.id);equal([game.state.potions,game.state.ethers],[potions+2,ethers+1],'new chest grants actual supplies');game.interact(chest.id);equal([game.state.potions,game.state.ethers],[potions+2,ethers+1],'chest cannot pay twice');
 const crystal=map.entities.find(e=>e.kind==='save');game.state.position={x:crystal.x,y:crystal.y};game.state.heroes.forEach(h=>{h.hp=1;h.mp=0;});game.interact(crystal.id);check(game.state.heroes.every(h=>h.hp===h.maxHp&&h.mp===h.maxMp),'new crystal actually restores HP/MP');check(game.state.progress.anchors.includes(ANCHORS.find(a=>a.entityId===crystal.id).id),'new anchor activates through interaction');equal(game.state.checkpoint.map,id,'checkpoint belongs to new area');check(parseSave(store.get(SAVE_KEY))?.progress.anchors.includes(ANCHORS.find(a=>a.entityId===crystal.id).id),'new area/anchor survives save validation');
}
for(const family of ['lunastag','runewarden','astral']){
 const game=fresh(),{map,entity}=encounter(family);game.state.stage=5;game.travel(map.id,{x:entity.x,y:entity.y});game.interact(entity.id);if(entity.kind==='boss'){equal(game.state.cutscene?.id,'astral-awakening','new boss introduces its own observatory scene instead of old Selo');equal(CUTSCENES[game.state.cutscene.id].map,'observatorio','Astral intro focuses its actual map');finishDialogue(game);}equal(game.state.mode,'battle','actual map interaction/cinematic callback starts battle');equal(game.state.battle.family,family,'interaction retains correct enemy family');
 const b=game.state.battle;Object.assign(b,{queue:['seiji','enemy','ophelia'],index:0,busy:false,animation:undefined,hp:1});timers=[];const before=balances(game);check(game.action('attack'),'player can defeat actual new enemy');timers.find(t=>t.ms===b.animation.impactAt).fn();check(!b.result,'victory waits for recovery');timers.find(t=>t.ms===b.animation.duration).fn();equal(b.result,'victory','recovery resolves actual victory');game.finishBattle();
 equal(game.state.progress.xp,before.xp+b.xp,'victory awards actual enemy XP once');equal(game.state.credits,before.credits+b.credits,'victory awards actual enemy credits once');equal(game.state.progress.kills[family],1,'new family kill recorded');check(game.state.progress.encounters.includes(entity.id),'specific encounter recorded');equal(game.state.stage,5,'optional victory preserves completed main campaign');
 if(family==='astral'){equal(game.state.cutscene?.id,'astral-silence','Astral victory uses its own epilogue instead of Selo');equal(CUTSCENES[game.state.cutscene.id].map,'observatorio','Astral epilogue stays in observatory');}
 const paid=balances(game);game.finishBattle();equal(balances(game),paid,'second finish cannot duplicate rewards');if(['dialogue','cutscene'].includes(game.state.mode)){finishDialogue(game);equal(balances(game),paid,'aftermath scene does not duplicate victory payout');}
 if(family==='astral'){check(game.state.progress.seen.includes('astral-awakening')&&game.state.progress.seen.includes('astral-silence'),'own intro and epilogue recorded in save');check(!game.state.progress.seen.includes('awakening')&&!game.state.progress.seen.includes('silence'),'Astral never records the original Selo scenes');}
 if(family==='astral'){
  equal(game.state.progress.tokens,before.tokens+3,'boss grants approved normal victory tokens');check(!game.activeEntities().some(e=>e.family==='astral'),'defeated optional boss stays absent');check(game.claimBestiary('astral',1),`new boss bestiary reward claim succeeds: ${JSON.stringify({mode:game.state.mode,kill:game.state.progress.kills.astral,monster:BESTIARY.find(m=>m.id==='astral'),boss:BOSS_REWARDS.astral,claims:game.state.progress.bestiaryClaims})}`);check(game.state.progress.owned.includes(BOSS_REWARDS.astral.gear),'new unique relic is usable inventory gear');equal(game.state.progress.tokens,before.tokens+3+5,'bestiary gives five additional tokens');const claimed=balances(game);check(!game.claimBestiary('astral',1),'bestiary reward cannot be claimed twice');equal(balances(game),claimed,'rejected claim preserves rewards');
 }else{check(!game.activeEntities().some(e=>e.id===entity.id),'defeated new mob enters cooldown');game.now+=12.1;check(game.activeEntities().some(e=>e.id===entity.id),'new mob respawns after established cooldown');}
 game.save();const saved=parseSave(store.get(SAVE_KEY));check(saved?.progress.kills[family]===1&&saved.progress.encounters.includes(entity.id),'new kill/encounter persists through save');
}
{
 const game=fresh(),b=readyEnemy(game,'astral'),base=b.baseDamage;
 for(const [fraction,phase] of [[1,1],[2/3,2],[1/3,3]]){b.hp=b.maxHp*fraction;game.updateBossPhase();equal(b.phase,phase,'real HP thresholds advance three boss phases');equal(b.damage,base+(phase-1)*4,'phase retains real damage progression');equal(enemyBattleKey('astral',b.asset,true,b.phase),`battle_astral_phase_${phase}`,'idle selects own phase body');equal(enemyBattleKey('astral',b.asset,true,b.phase,'enemy-hit'),'battle_astral_attack','phase attacks use own six-pose sheet');equal(enemyBattleKey('astral',b.asset,true,b.phase,'boss-ultimate'),'ultimate_astral','phase ultimate uses own eight-pose sheet');}
 b.hp=b.maxHp;game.updateBossPhase();equal(b.phase,3,'boss phases never regress on healing');
}

const rawCache=new Map(),alphaCache=new Map(),ultimateHashes=new Set();
equal(CUTSCENES.awakening.map,'camara','original Selo intro map preserved');equal(CUTSCENES.silence.map,'camara','original Selo epilogue map preserved');
for(const [key,path] of Object.entries(ENEMY_ASSETS_V30)){equal(ASSETS[key],path,`${key} final enemy/world source integrated`);check(existsSync(`public${path}`),`${key} final PNG exists`);}
async function raw(key){const path=ASSETS[key];check(!!path&&existsSync(`public${path}`),`${key} registered image exists`);if(!rawCache.has(path))rawCache.set(path,await sharp(`public${path}`).ensureAlpha().raw().toBuffer({resolveWithObject:true}));return rawCache.get(path);}
async function silhouette(key,index){const cacheKey=`${key}:${index}`;if(alphaCache.has(cacheKey))return alphaCache.get(cacheKey);const crop=battleCrop(key,index),{data,info}=await raw(key);check(Object.values(crop).every(Number.isFinite),'finite measured crop/anchor');check(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=info.width&&crop.y+crop.h<=info.height,'native crop inside source');let left=crop.w,top=crop.h,right=-1,bottom=-1,edge=0;
 for(let y=0;y<crop.h;y++)for(let x=0;x<crop.w;x++){if(data[((crop.y+y)*info.width+crop.x+x)*info.channels+info.channels-1]>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);if(!x||!y||x===crop.w-1||y===crop.h-1)edge++;}}
 check(right>=left&&bottom>=top,'measured pose contains real visible artwork');equal(edge,0,`${key}/${index} has no visible neighbor/cut on its crop boundary`);const result={crop,left:crop.x+left,top:crop.y+top,right:crop.x+right+1,bottom:crop.y+bottom+1};alphaCache.set(cacheKey,result);return result;}
const combatKeys=[];
for(const [family,presentation] of Object.entries(ENEMY_PRESENTATION_V30)){
 const key=presentation.ultimate;equal(ASSETS[key],ENEMY_ASSETS_V30[key],'final ultimate source overrides old v20 art');equal(SPRITE_FRAMES[key],ENEMY_FRAMES_V30[key],'measured ultimate rectangles registered');equal(SPRITE_FRAMES[key].length,8,'each family has eight own frames');ultimateHashes.add(createHash('sha256').update(readFileSync(`public${ASSETS[key]}`)).digest('hex'));combatKeys.push(key);
 if(['lunastag','runewarden','astral'].includes(family)){equal(SPRITE_FRAMES[presentation.attack].length,6,'new enemy has six attack poses');combatKeys.push(presentation.attack);}
}
equal(ultimateHashes.size,10,'ten families use distinct generated sources');
for(const key of ['battle_astral_phase_1','battle_astral_phase_2','battle_astral_phase_3']){equal(SPRITE_FRAMES[key].length,1,'phase body is an individual registered native crop');combatKeys.push(key);}
for(const key of combatKeys)for(let i=0;i<SPRITE_FRAMES[key].length;i++)await silhouette(key,i);
for(const [width,height] of [[1310,235],[844,205]])for(const count of [1,5]){
 const slot=battleFormation(width,height,count).enemy;
 for(const key of combatKeys){const scale=battleActorScale(key,slot);check(Number.isFinite(scale)&&scale>0,'enemy scale finite and positive');for(let i=0;i<SPRITE_FRAMES[key].length;i++){const f=await silhouette(key,i),left=slot.x+(f.left-f.crop.anchorX)*scale,right=slot.x+(f.right-f.crop.anchorX)*scale,top=slot.y+(f.top-f.crop.anchorY)*scale,bottom=slot.y+(f.bottom-f.crop.anchorY)*scale;check(left>=0&&right<=width&&top>=0&&bottom<=height,`${width}x${height}/${key}/${i} visible battle pose stays on stage`);}}
}
// Execute the production cinematic effect to detect old frame clamps or drawn clipping.
const cinema=ts.createSourceFile('components/ultimate-cinematic.tsx',readFileSync('components/ultimate-cinematic.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let effect;
function findEffect(node){if(ts.isCallExpression(node)&&node.expression.getText(cinema)==='useEffect')effect=node.arguments[0];ts.forEachChild(node,findEffect);}findEffect(cinema);check(effect,'production cinema effect found');
const scopeNames='enabled,a,cv,battle,heroes,map,progress,matchMedia,preloadBattleArt,ASSETS,ENEMY_ULTIMATES,ELEMENT_COLORS,battleBackground,SPRITE_FRAMES,battleCrop,enemyPoseFrame,characterPoseFrame,characterCamera,hasCharacterBattleArt,characterEffectMotif,combatElement,combatImpact';
const effectJs=ts.transpileModule(`const bind=scope=>{const {${scopeNames}}=scope;return (${effect.getText(cinema)})();};`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
const bindEffect=new Function(`${effectJs};return bind;`)(),art={};for(const key of combatKeys){const {info}=await raw(key);art[key]={__key:key,width:info.width,height:info.height};}
let time=100000,rafId=0;const rafs=new Map();global.requestAnimationFrame=fn=>{rafs.set(++rafId,fn);return rafId;};global.cancelAnimationFrame=id=>rafs.delete(id);global.devicePixelRatio=1;Date.now=()=>time;
for(const [width,height] of [[1310,235],[844,205]])for(const family of Object.keys(ENEMY_ULTIMATES)){
 const game=fresh(),b=readyEnemy(game,family);b.bossCharge=100;game.nextActor();const a=b.animation,key=ENEMY_PRESENTATION_V30[family].ultimate,calls=[],stack=[];let tx=0,ty=0;
 const ctx={createRadialGradient:()=>({addColorStop(){}}),setTransform(){tx=0;ty=0;},clearRect(){calls.length=0;},fillRect(){},save(){stack.push([tx,ty]);},restore(){[tx,ty]=stack.pop();},translate(x,y){tx+=x;ty+=y;},drawImage(...args){calls.push({args,tx,ty});}};
 const canvas={width:0,height:0,dataset:{},getContext:()=>ctx,getBoundingClientRect:()=>({width,height})};
 const cleanup=bindEffect({enabled:true,a,cv:{current:canvas},battle:b,heroes:game.state.heroes,map:game.state.map,progress:game.state.progress,matchMedia:()=>({matches:false}),preloadBattleArt:()=>Promise.resolve(art),ASSETS,ENEMY_ULTIMATES,ELEMENT_COLORS,battleBackground,SPRITE_FRAMES,battleCrop,enemyPoseFrame,...animation,combatElement:()=>{throw Error('enemy must use actual family element');},combatImpact:()=>{throw Error('enemy must not borrow generic hero VFX');}});await Promise.resolve();
 const seen=new Set();
 for(const timing of ENEMY_PRESENTATION_V30[family].ultimateTiming){time=a.started+901+timing*(a.duration-900);const pending=[...rafs.values()];rafs.clear();for(const fn of pending)fn();const draw=calls.find(c=>c.args[0].__key===key);check(draw,'own enemy body actually drawn by production cinema');const index=Number(canvas.dataset.ultimateFrame);seen.add(index);const f=await silhouette(key,index),args=draw.args,sx=args[7]/args[3],sy=args[8]/args[4],left=args[5]+(f.left-args[1])*sx+draw.tx,right=args[5]+(f.right-args[1])*sx+draw.tx,top=args[6]+(f.top-args[2])*sy+draw.ty,bottom=args[6]+(f.bottom-args[2])*sy+draw.ty;check(left>=0&&right<=width&&top>=height*.065&&bottom<=height*.94,`${width}x${height}/${family}/${index} full-body cinema clears stage/letterbox`);}
 equal(seen.size,8,'production cinema displays all eight own frames without legacy three-frame clamp');cleanup();rafs.clear();
}
const floorImages={};for(const [key,path] of Object.entries(ENVIRONMENT_ASSETS)){if(!existsSync(`public${path}`))continue;const info=await sharp(`public${path}`).metadata();floorImages[key]={__key:key,width:info.width,height:info.height};}
for(const map of Object.values(EXPANSION_MAPS_V30))for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
 const draws=[],ctx={drawImage:(...args)=>draws.push(args)};paintEnvironmentTile(ctx,floorImages,{},map,x,y,32);check(draws.length>0,'new area tile uses final painted material');const a=draws[0],img=a[0];check(a.slice(1).every(Number.isFinite)&&a[1]>=0&&a[2]>=0&&a[1]+a[3]<=img.width&&a[2]+a[4]<=img.height,'material span/row crop stays inside actual atlas');
}
console.log(`${checks} enemy v30 checks passed: ten real ultimate callbacks/elements/contact timings, two gated navigable areas and persistent rewards, three boss phases, measured native alpha, battle/cinematic geometry and floor crops.`);
