import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import ts from 'typescript';
import {compileGameModules} from './game-module-loader.mjs';

const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-abel-visual-v36-'));
compileGameModules(out,['data','sprites','characterAnimation','battleFormation','heroCardArt','heroUiNameV36','explorationArtV31','combatPreferencesV32','legendarySceneV36']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {ASSETS,heroBases,combatElement,ULTIMATE_NAMES}=await load('data');
const {SPRITE_FRAMES}=await load('sprites');
const {hasCharacterBattleArt,characterPoseFrame,skillMotifIndex}=await load('characterAnimation');
const {battleFormation,battleActorScale,battleActorCropV36,battleBodyBoundsV36,battleBodyHeightV36,battleActorAdvanceV36}=await load('battleFormation');
const {ABEL_BODY_METRICS_V36}=await load('abelBodyArtV36');
const {ABEL_SKILLS_V36,abelSkillIconV36}=await load('abelPlayableV36');
const {explorationWalkFrame}=await load('explorationArtV31');
const {battleTimingV32}=await load('combatPreferencesV32');
let checks=0,nativeFrames=0,placements=0;
const check=(value,label)=>{assert.ok(value,label);checks++;};
const equal=(actual,expected,label)=>{assert.deepEqual(actual,expected,label);checks++;};
const images=new Map();
async function nativeSheet(key){
 if(!images.has(key))images.set(key,await sharp(`public${ASSETS[key]}`).ensureAlpha().raw().toBuffer({resolveWithObject:true}));
 return images.get(key);
}
check(hasCharacterBattleArt('abel'),'Abel uses his generated combat choreography/VFX/showcase');
equal(combatElement('abel','attack'),'fire','basic attack is Fire');
equal(ULTIMATE_NAMES.abel,'Leão do Fogo Primordial','real ultimate identity');
for(const [kind,count] of [['attack',6],['cast',6],['ultimate',8],['vfx',6],['icons',6]]){
 const key=kind==='vfx'?'battle_fx_abel':kind==='icons'?'skill_icons_abel':`battle_abel_${kind}`;
 equal(SPRITE_FRAMES[key].length,count,`${kind}: complete native animation/motif sheet`);
 const manifest=JSON.parse(readFileSync(`art-source/v29/abel/${kind}-manifest.json`,'utf8'));
 check(readFileSync(manifest.runtime).equals(readFileSync(manifest.selected)),`${kind}: approved source pixels/alpha remain unchanged`);
 const {data,info}=await nativeSheet(key);
 check(data.some((value,index)=>index%4===3&&value===0),`${kind}: genuine transparent source space`);
 for(const [index,crop] of SPRITE_FRAMES[key].entries()){
  check([crop.x,crop.y,crop.w,crop.h].every(Number.isInteger)&&crop.x>=0&&crop.y>=0&&crop.x+crop.w<=info.width&&crop.y+crop.h<=info.height,`${kind}/${index}: native rectangle inside atlas`);
  let visible=0,edge=0;
  for(let y=0;y<crop.h;y++)for(let x=0;x<crop.w;x++)if(data[((crop.y+y)*info.width+crop.x+x)*4+3]>24){visible++;if(!x||!y||x===crop.w-1||y===crop.h-1)edge++;}
  check(visible>0,`${kind}/${index}: visible own artwork`);
  equal(edge,0,`${kind}/${index}: no visible neighboring pixels at crop boundary`);
  nativeFrames++;
 }
 if(['attack','cast','ultimate'].includes(kind))equal(new Set(Array.from({length:201},(_,i)=>characterPoseFrame('abel',kind,i/200,count))).size,count,`${kind}: timing visits every distinct native pose`);
}
for(const [facing,direction] of ['south','west','east','north'].entries()){
 const key=`walk_abel_${direction}`,frames=SPRITE_FRAMES[key],{data,info}=await nativeSheet(key);
 equal(frames.length,8,`${direction}: eight approved native steps`);
 for(let i=0;i<8;i++){
  const walk=explorationWalkFrame('abel',facing,i*95+1,true);
  equal({key:walk.key,index:walk.index,crop:walk.crop},{key,index:i,crop:frames[i]},`${direction}/${i}: actual world dispatcher uses the correct facing/frame`);
  check(walk.crop.x>=0&&walk.crop.y>=0&&walk.crop.x+walk.crop.w<=info.width&&walk.crop.y+walk.crop.h<=info.height,`${direction}/${i}: native world crop inside source`);
  let visible=0,edge=0;const crop=walk.crop;
  for(let y=0;y<crop.h;y++)for(let x=0;x<crop.w;x++)if(data[((crop.y+y)*info.width+crop.x+x)*4+3]>24){visible++;if(!x||!y||x===crop.w-1||y===crop.h-1)edge++;}
  check(visible>0,`${direction}/${i}: visible native walking figure`);
  equal(edge,0,`${direction}/${i}: complete figure and no adjacent sprite at crop edges`);
  nativeFrames++;
 }
 equal(explorationWalkFrame('abel',facing,0,false).index,2,`${direction}: approved neutral idle, no held stride`);
}
const iconManifest=JSON.parse(readFileSync('art-source/v36/abel/icons-manifest.json','utf8'));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
equal(hash(readFileSync(iconManifest.source)),iconManifest.sourceSha256,'eight-icon source matches approved native atlas');
equal(iconManifest.icons.map(icon=>icon.id),[...ABEL_SKILLS_V36.map(skill=>skill.id),'ultimate'],'every skill and ultimate has a separate final icon');
const iconHashes=new Set();
for(const icon of iconManifest.icons){
 equal(ASSETS[abelSkillIconV36(icon.id)],icon.runtime.replace(/^public/,''),`${icon.id}: UI lookup selects its own final icon`);
 const bytes=readFileSync(icon.runtime);equal(hash(bytes),icon.sha256,`${icon.id}: runtime hash matches reviewed crop`);iconHashes.add(hash(bytes));
 const source=await sharp(iconManifest.source).extract({left:icon.crop.x,top:icon.crop.y,width:icon.crop.w,height:icon.crop.h}).ensureAlpha().raw().toBuffer();
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 check(data.equals(source),`${icon.id}: all native source RGBA pixels preserved, no resize or repaint`);
 equal([info.width,info.height],[icon.crop.w,icon.crop.h],`${icon.id}: native dimensions`);
 let transparent=0,edge=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){const alpha=data[(y*info.width+x)*4+3];if(alpha===0)transparent++;if(alpha>24&&(!x||!y||x===info.width-1||y===info.height-1))edge++;}
 check(transparent>0,`${icon.id}: real alpha-zero exterior`);equal(edge,0,`${icon.id}: isolated artwork, no visible crop-edge contamination`);nativeFrames++;
}
equal(iconHashes.size,8,'seven skills plus ultimate use eight distinct painted icons');
const bodyProof=JSON.parse(readFileSync('art-source/v36/abel/body-measurements.json','utf8'));
for(const source of bodyProof.sources){
 equal(hash(readFileSync(source.source)),source.sha256,`${source.key}: measured body source is still the approved native atlas`);
 for(const pose of bodyProof.poses[source.key]){
  const crop=battleActorCropV36(source.key,pose.frame),metric=ABEL_BODY_METRICS_V36[source.key][pose.frame];
  equal([crop.x,crop.y,crop.w,crop.h],[pose.sourceCrop.x,pose.sourceCrop.y,pose.sourceCrop.w,pose.sourceCrop.h],'body presentation never changes the native crop rectangle');
  equal(battleBodyHeightV36(source.key,pose.frame),pose.soleY-pose.headTop,'scale uses measured head-to-sole height, not staff/fire/cape height');
  equal([crop.anchorX,crop.anchorY],[pose.anchorX,pose.soleY],'presentation anchor uses the midpoint and sole of the two measured boots');
  check(metric.headTop>=crop.y&&metric.soleY<crop.y+crop.h&&metric.left>=crop.x&&metric.right<=crop.x+crop.w,'complete anatomical measurement lies in its approved native crop');
 }
}
for(const skill of ABEL_SKILLS_V36){
 equal(skillMotifIndex(skill.id),skill.motif,`${skill.id}: real support/control/lion motif`);
 equal(combatElement('abel',skill.id),'fire',`${skill.id}: keeps Fire`);
 const icon=ASSETS[abelSkillIconV36(skill.id)];
 check(icon?.includes('/abel/')&&existsSync(`public${icon}`),`${skill.id}: final own registered icon, no generic placeholder`);
}
for(const [width,height] of [[844,132],[844,155],[1280,315]])for(let count=1;count<=5;count++)for(const slot of battleFormation(width,height,count).heroes){
 for(const kind of ['attack','cast','ultimate'])for(const [frame] of SPRITE_FRAMES[`battle_abel_${kind}`].entries())for(const flip of [false,true]){
  const key=`battle_abel_${kind}`,scale=battleActorScale(key,slot,flip,frame),bounds=battleBodyBoundsV36(key,frame,slot.x,slot.y,scale,flip);
  check(scale>0&&Number.isFinite(scale),'positive finite native scale');
  check(bounds.x>=slot.x-slot.cellWidth*.49-1e-6&&bounds.x+bounds.width<=slot.x+slot.cellWidth*.49+1e-6,`${width}/${count}/${kind}/${frame}: complete anatomy stays in its own lane; weapon/fire reach does not shrink the body`);
  check(bounds.y>=10-1e-6&&bounds.y+bounds.height<=slot.labelY-13+1e-6,`${width}/${count}/${kind}/${frame}: actual head and boot soles clear stage top and ground name`);
  const naturalWide=ABEL_BODY_METRICS_V36[key][frame].wideStance;
  check(bounds.height>=Math.min(slot.height,slot.cellWidth*.98,slot.y-10)*(naturalWide?.68:.80),`${width}/${height}/${kind}/${frame}: measured anatomy keeps adult scale within the shared formation lane`);
  if(!flip){const advance=battleActorAdvanceV36(bounds,slot,slot.cellWidth*.035);check(bounds.x+advance+bounds.width<=slot.x+slot.cellWidth*.49+1e-6,'attack advance cannot enter the adjacent actor lane');}
  placements++;
 }
}
for(const [height,min,max] of [[132,84,88],[155,96,99],[197,96,99]])for(const slot of battleFormation(844,height,5).heroes){
 const scale=battleActorScale('battle_abel_attack',slot),body=battleBodyBoundsV36('battle_abel_attack',0,slot.x,slot.y,scale);
 check(body.height>=min-1e-6&&body.height<=max+1e-6,`${height}px real stage: adult idle body is ${min}–${max}px tall`);
}
for(const [width,height] of [[405,167],[844,197],[1310,379]]){
 const slot=battleFormation(width,height,5).heroes[4];
 const abel=battleBodyHeightV36('battle_abel_attack')*battleActorScale('battle_abel_attack',slot);
 const peers=['seiji','ophelia','marin'].map(id=>battleBodyHeightV36(`battle_${id}_attack`)*battleActorScale(`battle_${id}_attack`,slot)).sort((a,b)=>a-b);
 check(abel>=peers[1]*.90,`${width}: Abel's anatomical height matches the adult formation rather than a weapon-constrained miniature`);
 check(abel<=peers[1]*1.10,`${width}: Abel does not become a giant beside the other adult characters`);
}
writeFileSync(join(out,'styles.mjs'),'export default new Proxy({},{get:(_,key)=>String(key)});');
writeFileSync(join(out,'progress.mjs'),`import {createElement} from '${pathToFileURL(require.resolve('react')).href}';export function Progress({value,...props}){return createElement('div',{role:'progressbar',...props,'aria-valuenow':value});}`);
writeFileSync(join(out,'art-combatV30.mjs'),ts.transpileModule(readFileSync('lib/art/combatV30.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
async function component(name,extension='tsx'){
 let source=readFileSync(`components/${name}.${extension}`,'utf8').replace(/@\/lib\/game\/([\w-]+)/g,'./$1.js').replaceAll('@/lib/art/combatV30','./art-combatV30.mjs').replaceAll('@/components/ui/progress','./progress.mjs').replaceAll('./hero-card','./hero-card.mjs').replaceAll('./game-icon','./game-icon.mjs').replace(/\.\/[^'"\s]+\.module\.css/g,'./styles.mjs');
 let js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 for(const runtime of ['react','react/jsx-runtime'])js=js.replaceAll(`from "${runtime}"`,`from '${pathToFileURL(require.resolve(runtime)).href}'`).replaceAll(`from '${runtime}'`,`from '${pathToFileURL(require.resolve(runtime)).href}'`);
 writeFileSync(join(out,`${name}.mjs`),js);return import(pathToFileURL(join(out,`${name}.mjs`)).href);
}
const {HeroCard}=await component('hero-card'),{CombatParty}=await component('combat-party'),{TurnOrder}=await component('turn-order');
await component('game-icon');
const {CharacterSkillIcon}=await component('character-skill-icon');
const {drawUltimateSceneV36}=await component('ultimate-scene-v36','ts');
for(const speed of [1,2]){
 const timing=battleTimingV32(4800,speed,true),phase=(timing.impactAt-700/speed)/(timing.duration-700/speed);
 equal(characterPoseFrame('abel','ultimate',phase,8),5,`${speed}x: actual damage contact occurs on approved ultimate strike pose5`);
 const canvas={dataset:{}},draws=[];
 const context={clearRect(){},createRadialGradient(){return{addColorStop(){}};},fillRect(){},save(){},restore(){},translate(){},drawImage(...args){draws.push(args);}};
 const key='battle_abel_ultimate',image={width:1774,height:887};
 drawUltimateSceneV36(context,{art:{[key]:image},id:'abel',key,family:'sombra',enemy:false,recruitDuel:false,width:844,height:155,age:timing.impactAt,...timing,speed,reduced:false,element:'fire',canvas});
 equal(canvas.dataset.ultimateFrame,'5',`${speed}x: production cinematic and battle timing agree at contact`);
 const crop=SPRITE_FRAMES[key][5];equal(draws[0].slice(1,5),[crop.x,crop.y,crop.w,crop.h],`${speed}x: full measured native strike crop, not a held substitute`);
 check(Number(canvas.dataset.bodyHeightabel)>=155*.78,`${speed}x: lion halo cannot shrink the actual cinematic body`);
}
for(const height of [132,155,260])for(const [frame,phase] of [0,.08,.19,.34,.48,.62,.80,.94].entries()){
 const timing=battleTimingV32(4800,1,true),age=Math.max(900,700+(timing.duration-700)*phase+1),canvas={dataset:{}},draws=[];
 const context={clearRect(){},createRadialGradient(){return{addColorStop(){}};},fillRect(){},save(){},restore(){},translate(){},drawImage(...args){draws.push(args);}};
 const key='battle_abel_ultimate';
 drawUltimateSceneV36(context,{art:{[key]:{width:1774,height:887}},id:'abel',key,family:'sombra',enemy:false,recruitDuel:false,width:844,height,age,...timing,speed:1,reduced:false,element:'fire',canvas});
 equal(canvas.dataset.ultimateFrame,String(frame),'shared battle/showcase painter visits the correct ultimate choreography');
 check(Number(canvas.dataset.bodyHeightabel)>=height*.78,'all eight cinematic/showcase poses keep adult height independent of staff or lion width');
}
const abel=heroBases().find(hero=>hero.id==='abel'),render=(Component,props)=>renderToStaticMarkup(createElement(Component,props));
check(!!abel,'real playable base, not an invented catalog-only fixture');
const card=render(HeroCard,{h:abel});
check(card.includes(`src="${ASSETS.face_abel}"`),'full menu card uses the approved face crop');
check(card.includes('character-vitals')&&card.includes(abel.maxHp.toString()),'menu card exposes actual playable vitals');
check(!card.includes('COMPANHEIRO'),'teacher card has no invented animal');
const party=[...heroBases().filter(hero=>hero.id!=='abel').slice(0,4),abel],hud=render(CombatParty,{heroes:party,limits:{abel:100},exploration:true,leaderId:'abel',onSelectHero:()=>{}});
equal((hud.match(/data-hero=/g)||[]).length,5,'Abel composes a real five-slot compact party');
check(hud.includes('Slot 5: selecionar Abel como líder')&&hud.includes('aria-pressed="true"'),'fifth exploration slot exposes leader selection to touch and keyboard');
check(hud.includes('Leão do Fogo Primordial · Abel')&&hud.includes('Pronta'),'actual ultimate charge/name remain accessible');
const order=render(TurnOrder,{heroes:party,battle:{queue:['abel','enemy'],index:0,round:1,asset:'wolf',boss:false}});
check(order.includes(`src="${ASSETS.face_abel}"`)&&order.includes('aria-label="Abel · agora"'),'turn order preserves real Abel portrait and active turn');
for(const action of [...ABEL_SKILLS_V36.map(skill=>skill.id),'ultimate']){
 const icon=render(CharacterSkillIcon,{hero:abel,action});
 check(icon.includes(`src="${ASSETS[abelSkillIconV36(action)]}"`),`${action}: actual skill/tree component uses the descriptor-selected native icon`);
 check(!icon.includes('game-art-icon'),`${action}: no generic fallback icon`);
}
console.log(`Abel visual v36 PASS: ${checks} checks / ${nativeFrames} native cells, ${placements} measured anatomical pose placements, four facings, seven real skills, own icons/portraits and five accessible party slots.`);
