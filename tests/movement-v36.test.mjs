import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-movement-v36-'));
compileGameModules(out,['engine','ui-controls','walkMotionV36','renderer']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine,isWalkable,parseSave,SAVE_KEY}=await load('engine');
const {ASSETS}=await load('data');
const {SPRITE_FRAMES}=await load('sprites');
const {VARIANT_BODY_TOPS_V36}=await load('variantArtV36');
const {VARIANTS_V36}=await load('variantsV36');
const {EXPLORATION_DIRECTIONS_V31,EXPLORATION_FRAMES_V31}=await load('explorationArtV31');
const {WorldRenderer}=await load('renderer');
const {createGameKeyboardControls,createGamePointerControls}=await load('ui-controls');
const {walkCycleV36,WALK_STRIDE_TILES_V36}=await load('walkMotionV36');
const require=createRequire(import.meta.url),sharp=createRequire(createRequire(require.resolve('wrangler')).resolve('miniflare'))('sharp');
const store=new Map();let checks=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const near=(actual,expected,label)=>{assert.ok(Math.abs(actual-expected)<1e-7,`${label}: ${actual} != ${expected}`);checks++;};
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
global.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
global.setTimeout=()=>0;
Math.random=()=>.99;

function mapFixture(entities=[],wall=false){
 const rows=Array.from({length:31},(_,y)=>Array.from({length:31},(_,x)=>x===0||y===0||x===30||y===30||wall&&x===14?'#':'d').join(''));
 return {id:'patio',name:'Movement fixture',safe:true,width:31,height:31,rows,entities,props:[]};
}
function game(map=mapFixture(),position={x:4,y:4}){
 const e=new GameEngine();e.state.mode='world';e.state.position={...position};
 Object.defineProperty(e,'map',{get:()=>map});return e;
}
function realGame(){store.clear();const e=new GameEngine();e.start(false);e.finishCutscene();return e;}
function controls(e,overrides={}){
 return createGameKeyboardControls({engine:e,panel:()=>null,opening:()=>false,loaded:()=>true,titleArmed:()=>true,loading:()=>null,closePanel:()=>{},openMenu:()=>{},setTarget:()=>{},activateTitle:()=>{},toggleMusic:()=>{},element:()=>null,...overrides});
}
const press=(keys,key)=>keys.down({key,repeat:false,target:null,preventDefault:()=>{}});

// Integrate the real update at desktop/mobile rates and through its long-frame
// subdivision. Running remains 6.15 tiles/s and walking remains 3.8 tiles/s.
for(const dt of [1/60,1/30,.04,.1,.25])for(const sprint of [false,true]){
 const e=game(),speed=sprint?6.15:3.8;e.keys.add('d');if(sprint)e.keys.add('Shift');
 let elapsed=0;
 while(elapsed<1-1e-9){const step=Math.min(dt,1-elapsed),before={...e.state.position},phase=e.walkDistanceV36;e.update(step);elapsed+=step;
  near(distance(before,e.state.position),speed*step,'each clear-floor update spends its exact speed budget');
  near(e.walkDistanceV36-phase,distance(before,e.state.position),'gait counts actual displacement');check(e.state.moving,'walking remains active between updates');
 }
 near(e.state.position.x,4+speed,'one second preserves legacy speed');near(e.state.position.y,4,'straight movement stays aligned');near(e.walkDistanceV36,speed,'distance phase is independent of FPS');
 near(walkCycleV36(e.walkDistanceV36,true).phase,(speed%WALK_STRIDE_TILES_V36)/WALK_STRIDE_TILES_V36,'production renderer gait uses the same real distance');
}

// No idle tick at a corner, including the old .09 snap region and the exact
// half-step that previously oscillated forever when Shift was held at 30 FPS.
for(const offset of [.05,.1025,.123])for(const dt of [1/60,1/30,.04])for(const sprint of [false,true]){
 const e=game(undefined,{x:4-offset,y:4}),budget=(sprint?6.15:3.8)*dt;
 e.path=[{x:4,y:4},{x:4,y:5},{x:4,y:6}];if(sprint)e.keys.add('Shift');e.update(dt);
 near(e.walkDistanceV36,budget,'corner spends the entire available distance');check(e.state.moving,'reached waypoint does not introduce an idle update');
 if(budget>=offset){near(e.state.position.x,4,'corner reaches the horizontal waypoint without overshoot');near(e.state.position.y,4+budget-offset,'unused distance continues along the next segment');equal(e.state.facing,budget-offset>1e-9?0:2,'facing follows the last segment actually traveled');}
 else {near(e.state.position.x,4-offset+budget,'short update approaches without snapping');near(e.state.position.y,4,'does not round a corner before reaching it');}
 let iterations=0;while(e.path.length&&iterations++<200)e.update(dt);
 check(!e.path.length,'path terminates instead of bouncing around a waypoint');equal(e.state.position,{x:4,y:6},'path ends exactly on the requested point');near(e.walkDistanceV36,2+offset,'path length includes every corner without free snaps');
 e.update(dt);check(!e.state.moving,'completed path becomes idle');near(e.walkDistanceV36,2+offset,'idle holds the accumulated phase');
}
{
 const e=game();e.path=[{x:4,y:4},{x:4,y:4},{x:5,y:4}];e.update(.04);
 near(e.state.position.x,4.152,'zero-length waypoints are consumed without a stop');equal(e.path,[{x:5,y:4}],'only the future waypoint remains');
}
{
 const e=game();check(e.moveTo({x:8,y:7}),'production click-to-walk finds a path');
 let ticks=0;while(e.path.length&&ticks++<100){e.update(1/30);check(e.state.moving,'actual planned route never pauses at an intermediate tile');check(isWalkable(e.map,e.state.position.x,e.state.position.y),'actual route remains walkable');}
 equal(e.state.position,{x:8,y:7},'real path planner reaches the clicked tile');near(e.walkDistanceV36,7,'real path has no uncounted snaps');
}

// Collision preserves axis sliding, never reports blocked motion as walking,
// and never snaps into an NPC merely because its waypoint is very close.
{
 const e=game(mapFixture([],true),{x:13.49,y:4});e.walkDistanceV36=.4;e.keys.add('d');const before={...e.state.position};
 for(let i=0;i<20;i++){e.update(.04);equal(e.state.position,before,'wall collision preserves position');check(!e.state.moving,'wall does not animate walking in place');near(e.walkDistanceV36,.4,'wall does not advance gait');}
 e.keys.add('s');e.update(.04);near(e.state.position.x,13.49,'diagonal wall slide still blocks the horizontal axis');near(e.state.position.y,4+.152/Math.SQRT2,'diagonal wall slide preserves the free-axis speed');near(e.walkDistanceV36,.4+.152/Math.SQRT2,'gait counts only the free-axis displacement');check(e.state.moving,'sliding along a wall is real movement');
}
{
 const npc={id:'beatriz',kind:'npc',asset:'beatriz',label:'NPC collision',x:8,y:8};
 const e=game(mapFixture([npc]),{x:7.94,y:8});e.path=[{x:8,y:8},{x:9,y:8}];const before={...e.state.position};
 e.update(.04);equal(e.state.position,before,'close waypoint cannot snap through a live NPC');equal(e.path.length,2,'blocked waypoint remains pending');check(!e.state.moving,'blocked NPC approach is idle');near(e.walkDistanceV36,0,'blocked NPC does not count as a step');check(distance(e.state.position,e.activeEntities()[0])>=.38,'NPC collision radius is preserved');
}
{
 const e=game();e.path=[{x:8,y:4}];e.pending='later';e.keys.add('w');e.update(.04);
 equal(e.path,[],'manual input cancels auto-walking');equal(e.pending,null,'manual input cancels pending interaction');equal(e.state.facing,3,'manual input changes to North');near(e.walkDistanceV36,.152,'direction changes do not reset the step cycle');
 e.keys.clear();e.keys.add('a');e.update(.04);equal(e.state.facing,1,'next input changes to West');near(e.walkDistanceV36,.304,'phase survives a turn');
 e.clearMovement();near(e.walkDistanceV36,0,'explicit movement cleanup resets the gait');check(!e.state.moving&&!e.keys.size&&!e.path.length,'cleanup stops all movement sources');
}

// Pause and replay freeze the distance and quest steps even with held input.
for(const freeze of ['pause','replay','dialogue','battle']){
 const e=game();e.keys.add('d');e.update(.04);const before={...e.state.position},phase=e.walkDistanceV36;
 if(freeze==='pause')e.paused=true;else if(freeze==='replay')e.state.questCinematic={questId:'long-tinta',caption:'Replay',replay:true,token:1};else e.state.mode=freeze;
 for(let i=0;i<6;i++)e.update(.1);
 equal(e.state.position,before,`${freeze} freezes position`);near(e.walkDistanceV36,phase,`${freeze} freezes the renderer gait`);
}

// The production PC/mobile input handlers drive the same movement and cleanup.
for(const modal of ['opening','suspended'])for(const key of ['Enter',' ']){
 const e=game(),button={closest:selector=>selector==='button'?{}:null};let gameplayActions=0,prevented=0;
 const keys=controls(e,{opening:()=>modal==='opening',suspended:()=>modal==='suspended',element:target=>target,openMenu:()=>gameplayActions++,activateTitle:()=>gameplayActions++,toggleMusic:()=>gameplayActions++});
 e.keys.add('d');e.path=[{x:8,y:4}];e.pending='later';e.state.moving=true;e.walkDistanceV36=.5;
 keys.down({key,repeat:false,target:button,preventDefault:()=>prevented++});
 equal(prevented,0,`${modal} preserves native ${JSON.stringify(key)} activation of its focused button`);
 equal(gameplayActions,0,`${modal} button activation never reaches game shortcuts`);
 check(!e.keys.size&&!e.path.length&&e.pending===null&&!e.state.moving,`${modal} clears movement before returning to the modal button`);
 near(e.walkDistanceV36,0,`${modal} resets the gait while keeping the button usable`);
 keys.down({key,repeat:false,target:null,preventDefault:()=>prevented++});equal(prevented,1,`${modal} still consumes the same key outside a button`);
 keys.down({key:'a',repeat:false,target:button,preventDefault:()=>prevented++});equal(prevented,2,`${modal} still consumes movement keys when a button is focused`);
 check(!e.keys.size,`${modal} cannot start walking behind the modal`);
}
{
 const e=game();let musicToggles=0;const keys=controls(e,{now:()=>1000,toggleMusic:()=>musicToggles++});
 press(keys,'p');press(keys,'p');press(keys,'a');
 equal(musicToggles,2,'master prefix preserves both real sound-toggle inputs');
 check(e.keys.has('a'),'first A after P P starts movement without waiting for key repeat');
 check(!e.state.progress.masterMode,'partial master sequence never activates the mode');
 e.update(.04);near(e.state.position.x,4-.152,'first A after P P really moves West on the next update');near(e.walkDistanceV36,.152,'partial master sequence advances the real walking stride');
 keys.up({key:'a'});e.path=[{x:7,y:4}];e.pending='later';
 press(keys,'p');press(keys,'p');press(keys,'w');
 check(e.state.progress.masterMode,'complete P P A P P W still activates Master Mode');
 check(!e.keys.size&&!e.path.length&&e.pending===null&&!e.state.moving,'final activation clears held keys, path and pending interaction');near(e.walkDistanceV36,0,'final activation resets the walking stride');
 const position={...e.state.position};e.update(.04);equal(e.state.position,position,'final W is consumed only when activation actually occurs');
}
{
 const e=game(),keys=controls(e);press(keys,'W');press(keys,'d');e.update(.04);
 near(e.walkDistanceV36,.152,'keyboard diagonal is normalized');equal(e.state.facing,3,'diagonal keeps the existing vertical-facing priority');
 keys.up({key:'W'});e.update(.04);equal(e.state.facing,2,'releasing one diagonal key turns East');near(e.walkDistanceV36,.304,'releasing a key preserves the stride');
 keys.up({key:'d'});e.update(.04);check(!e.state.moving,'keyboard release stops on the next update');near(e.walkDistanceV36,.304,'keyboard release stops phase advancement');
 keys.blur();near(e.walkDistanceV36,0,'window blur clears the stride and held movement');
}
for(const release of ['onPointerUp','onPointerCancel','onLostPointerCapture']){
 const e=game();let blocked=false,captured=0;const pointer=createGamePointerControls(e,{blocked:()=>blocked,focus:()=>{},click:()=>{}}),right=pointer.hold('ArrowRight');
 right.onPointerDown({pointerId:2,currentTarget:{setPointerCapture:()=>captured++},preventDefault:()=>{}});e.update(1/30);
 equal(captured,1,'mobile movement captures its pointer');near(e.walkDistanceV36,3.8/30,'mobile movement uses the same speed');
 right[release]();e.update(1/30);check(!e.state.moving,`${release} stops touch walking`);near(e.walkDistanceV36,3.8/30,`${release} stops the gait`);
 blocked=true;right.onPointerDown({pointerId:3,currentTarget:{setPointerCapture:()=>captured++},preventDefault:()=>{}});check(!e.keys.size,'blocked mobile input cannot start a step');
}

// Exercise the actual map, moving NPC interaction, progression gate and Save
// rather than only a collision fixture. Runtime gait never migrates into Save.
{
 const e=realGame();e.state.position={x:14,y:12};check(e.approach('beatriz'),'real nearby NPC route is accepted');
 let ticks=0;while(e.path.length&&ticks++<150)e.update(1/30);
 equal(e.state.mode,'dialogue','real pending NPC interaction still opens its dialogue');check(!e.state.moving,'dialogue cleanup cannot be overwritten by the last path step');near(e.walkDistanceV36,0,'dialogue cleanup resets the gait');
}
{
 const e=realGame();e.state.map='arquivo';e.state.position={x:17,y:4};check(e.approach('escada'),'real locked exit can be approached');
 let ticks=0;while(e.path.length&&ticks++<150)e.update(.04);
 equal(e.state.map,'arquivo','walking to a locked stair never bypasses its story gate');equal(e.state.stage,0,'walking does not advance the story gate');check(!e.state.moving,'finished locked approach is idle');
}
{
 const e=realGame();e.state.position={x:14,y:12};e.keys.add('d');e.update(.04);check(e.walkDistanceV36>0,'real world has a runtime stride');check(e.save(true),'real world movement still saves');
 const raw=JSON.parse(store.get(SAVE_KEY));check(!('walkDistanceV36'in raw)&&!('walkDistanceV36'in raw.progress),'runtime gait is excluded from both saved schemas');check(parseSave(JSON.stringify(raw)),'movement save passes the real migration/validation');
 const resumed=new GameEngine();resumed.hydrate();resumed.start(true);equal(resumed.state.position,e.state.position,'resume preserves exact world position');near(resumed.walkDistanceV36,0,'resume starts with idle gait');
}
{
 const e=game(mapFixture([],true),{x:13.49,y:4});check(e.startQuestV31('tutorial-passos'),'walking tutorial is accepted');e.keys.add('d');for(let i=0;i<20;i++)e.update(.04);
 const record=e.state.progress.questsV31.records['tutorial-passos'];equal(record.counts,{},'blocked attempts never award tutorial steps');equal(record.step,0,'blocked attempts do not complete movement objective');
 e.clearMovement();e.state.position={x:4,y:4};check(e.moveTo({x:10,y:4}),'tutorial receives an actual six-tile path');for(let i=0;i<60&&e.path.length;i++)e.update(1/30);
 near(e.walkDistanceV36,6,'six-tile path is fully accounted');equal(record.step,1,'actual path advances the movement tutorial exactly once');equal(Object.values(record.counts),[6],'tutorial caps only at its real required distance');
}

// Call the production canvas consumer, without a DOM, RAF or a second copy of
// its rendering logic. Its image dimensions and pose pixels are the real PNGs.
const imageData=new Map(),images={},draws=[];
async function image(key){
 if(!imageData.has(key)){
  check(!!ASSETS[key],`${key} has a registered final image`);
  const raw=await sharp('public'+ASSETS[key]).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  imageData.set(key,raw);images[key]={key,width:raw.info.width,height:raw.info.height};
 }
 return imageData.get(key);
}
const renderer=Object.create(WorldRenderer.prototype);
renderer.images=images;renderer.ctx={save(){},restore(){},beginPath(){},ellipse(){},fill(){},drawImage:(...args)=>draws.push(args)};
function drawActor(key,facing,moving,walkDistance,time){
 draws.length=0;renderer.frame=time;renderer.actor(key,200,250,facing,moving,walkDistance);
 equal(draws.length,1,'production actor paints one native pose');return draws[0];
}
function renderedPose(call,key){
 equal(call[0].key,key,'production consumer uses the expected sheet');
 const index=SPRITE_FRAMES[key].findIndex(c=>[c.x,c.y,c.w,c.h].every((v,i)=>v===call[i+1]));
 check(index>=0,'production draw uses a complete measured crop');return index;
}
function headAndFoot(call,crop,head){
 const scale=call[8]/crop.h;near(call[7]/crop.w,scale,'native crop preserves its aspect ratio');
 return {headY:call[6]+(head-crop.y)*scale,footY:call[6]+(crop.anchorY-crop.y)*scale,footX:call[5]+(crop.anchorX-crop.x)*scale};
}
function poseHash(raw,crop){
 const hash=createHash('sha256');hash.update(`${crop.w}x${crop.h}:`);
 for(let y=crop.y;y<crop.y+crop.h;y++)hash.update(raw.data.subarray((y*raw.info.width+crop.x)*4,(y*raw.info.width+crop.x+crop.w)*4));
 return hash.digest('hex');
}
const walkingIds=[...VARIANTS_V36.map(v=>v.id),'gabriel-solar-oath_lycan'];
equal(VARIANTS_V36.length,8,'all eight extra forms are included in the actual walking consumer test');
for(const id of walkingIds){
 const raw=await image(id),frames=SPRITE_FRAMES[id],registeredTops=VARIANT_BODY_TOPS_V36[id]??{};
 equal(frames.length,12,`${id} has three native poses in four directions`);
 const family=id.replace(/_lycan$/,''),kind=id.endsWith('_lycan')?'lycan-walk':'walk',source=JSON.parse(readFileSync(`art-source/v36/variants/${family}/${kind}-manifest.json`,'utf8'));
 equal([raw.info.width,raw.info.height],[source.width,source.height],`${id} consumer uses native image dimensions`);
 const metricFile=`art-source/v36/variants/${family}/body-metrics.json`,metrics=existsSync(metricFile)?JSON.parse(readFileSync(metricFile,'utf8')):null;
 const tops=frames.map(crop=>{
  const nativeIndex=source.frames.findIndex(c=>JSON.stringify(c)===JSON.stringify(crop));check(nativeIndex>=0,'walk crop matches a reviewed native source pose');
  const metric=metrics?.metrics?.find(m=>m.kind===kind&&(m.i??m.index)===nativeIndex),manual=metrics?.manualHeadTopOverrides?.[kind]?.[nativeIndex]??metrics?.bodyTops?.[`battle_${family}_${kind}`]?.[nativeIndex];
  return manual??metric?.headTop??crop.y;
 });
 for(let facing=0;facing<4;facing++){
  const hashes=frames.slice(facing*3,facing*3+3).map(crop=>poseHash(raw,crop));equal(new Set(hashes).size,3,`${id}/${facing} contains three distinct native pose crops`);
  const cycle=[],heads=[],feet=[];
  for(let q=0;q<4;q++){
   const phase=(q+.125)/4,call=drawActor(id,facing,true,phase*WALK_STRIDE_TILES_V36,912345+q*113),index=renderedPose(call,id),crop=frames[index];
   cycle.push(index-facing*3);check(tops[index]>=crop.y&&tops[index]<crop.anchorY,'measured head is inside the native body crop above its sole');
   // Sparse overrides are valid, but every independently reviewed head must
   // reach the renderer, including sources whose playback was remapped.
   near(registeredTops[index]??crop.y,tops[index],`${id}/${index} runtime head matches the independent reviewed native metric`);
   const points=headAndFoot(call,crop,tops[index]);near(points.footX,200,'body anchor stays centered');near(points.footY-points.headY,107,'all native walk bodies retain the same head-to-sole height');
   check(Math.abs(points.footY-250)<=.6000001,'walk bob stays below one pixel at the measured feet');heads.push(points.headY);feet.push(points.footY);
  }
  equal(cycle,[0,1,2,1],`${id}/${facing} production cycle is 0,1,2,1`);
  check(Math.max(...heads)-Math.min(...heads)<=1.2000001,'pose transitions have only the bounded stride bob at the head');
  check(Math.max(...feet)-Math.min(...feet)<=1.2000001,'pose transitions have only the bounded stride bob at the feet');
  for(const fps of [30,60])for(const sprint of [false,true]){
   const e=game(undefined,{x:14,y:14}),speed=sprint?6.15:3.8;e.keys.add(['s','a','d','w'][facing]);if(sprint)e.keys.add('Shift');const observed=[];
   for(let tick=0;tick<fps;tick++){
    e.update(1/fps);near(e.walkDistanceV36,speed*(tick+1)/fps,'renderer receives actual frame-rate-independent engine distance');
    const phase=(speed*(tick+1)/fps%WALK_STRIDE_TILES_V36)/WALK_STRIDE_TILES_V36,expected=facing*3+[0,1,2,1][Math.floor(phase*4)];
    const call=drawActor(id,e.state.facing,e.state.moving,e.walkDistanceV36,7351+(tick+1)*1000/fps),index=renderedPose(call,id),points=headAndFoot(call,frames[index],tops[index]);
    equal(index,expected,`${id}/${fps}FPS/${sprint?'run':'walk'} follows distance, not elapsed wall-clock time`);
    near(points.footY-points.headY,107,'actual movement keeps body scale stable');check(Math.abs(points.footY-250)<=.6000001,'actual movement never introduces a vertical body jump');
    if(observed.at(-1)!==index-facing*3)observed.push(index-facing*3);
   }
   equal(observed.slice(0,4),[0,1,2,1],'desktop/mobile walking and running retain the native stride order');
   const captured=drawActor(id,facing,true,e.walkDistanceV36,10000),otherFacing=(facing+1)%4,turned=drawActor(id,otherFacing,true,e.walkDistanceV36,20000);
   equal(renderedPose(turned,id)%3,renderedPose(captured,id)%3,'direction change preserves the current foot phase');
   const originalPoints=headAndFoot(captured,frames[renderedPose(captured,id)],tops[renderedPose(captured,id)]),turnedIndex=renderedPose(turned,id),turnedPoints=headAndFoot(turned,frames[turnedIndex],tops[turnedIndex]);
   near(turnedPoints.headY,originalPoints.headY,'turning does not jump the measured head');near(turnedPoints.footY,originalPoints.footY,'turning does not jump the measured sole');
   e.paused=true;e.update(.25);equal(drawActor(id,facing,e.state.moving,e.walkDistanceV36,50000),captured,'pause freezes the actual pose and bob while the wall clock advances');
   e.paused=false;e.state.questCinematic={questId:'long-tinta',caption:'Replay',replay:true,token:1};e.update(.25);equal(drawActor(id,facing,e.state.moving,e.walkDistanceV36,80000),captured,'replay freezes the actual pose and bob while the wall clock advances');
   e.state.questCinematic=null;e.keys.clear();e.update(1/fps);const idle=drawActor(id,facing,e.state.moving,e.walkDistanceV36,90000),idleIndex=renderedPose(idle,id),idlePoints=headAndFoot(idle,frames[idleIndex],tops[idleIndex]);
   equal(idleIndex,facing*3+1,'stopping holds the native plant pose');near(idlePoints.footY,250,'idle has no walking bob');near(idlePoints.headY,143,'idle preserves the same body height');
  }
 }
}

// Orfeu's original directional eight-pose PNGs and Abel's NPC clock retain
// their own native crops and idle pose. Only the player uses distance phase.
for(const actor of ['orfeu','abel'])for(let facing=0;facing<4;facing++){
 const key=`walk_${actor}_${EXPLORATION_DIRECTIONS_V31[facing]}`;await image(key);const frames=EXPLORATION_FRAMES_V31[key];equal(frames.length,8,'original exploration sheet retains eight native poses per direction');
 for(let i=0;i<8;i++){
  const clock=i*95+10,walkDistance=actor==='orfeu'?(i+.25)/8*WALK_STRIDE_TILES_V36:undefined,call=drawActor(actor,facing,true,walkDistance,clock);
  equal(call[0].key,key,'original actor still selects its own directional PNG');equal(call.slice(1,5),[frames[i].x,frames[i].y,frames[i].w,frames[i].h],'original actor uses its distinct native eight-pose sequence');
 }
 const idle=drawActor(actor,facing,false,actor==='orfeu'?.5:undefined,20000);equal(idle.slice(1,5),[frames[2].x,frames[2].y,frames[2].w,frames[2].h],'original actor keeps native idle frame2');
}
console.log(`movement-v36: ${checks} checks passed (real speed/path/collision/input/save and production renderer: eight forms + Solar Lycan, native gait/body anchors, 30/60FPS + Shift, direction/freeze, original Orfeu/Abel).`);
