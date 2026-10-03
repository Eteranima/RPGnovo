import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

const require=createRequire(import.meta.url),wranglerRequire=createRequire(require.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-remake-art-'));
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','data','sprites','characterAnimation','summons']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {ASSETS,PLAYABLE_HERO_IDS}=await import(pathToFileURL(join(out,'data.js')).href);
const {SPRITE_FRAMES}=await import(pathToFileURL(join(out,'sprites.js')).href);
const {REMAKE_FRAMES}=await import(pathToFileURL(join(out,'remakeArt.js')).href);
const {REMADE_HERO_IDS,characterPoseFrame,skillMotifIndex}=await import(pathToFileURL(join(out,'characterAnimation.js')).href);
const {SUMMONED_HEROES}=await import(pathToFileURL(join(out,'summons.js')).href);
let checks=0,frames=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const images=new Map();
async function rawAsset(key){
 const path=ASSETS[key];check(path?.startsWith('/assets/v29/'),`${key}: final remake registered`);
 if(!images.has(path))images.set(path,await sharp(`public${path}`).ensureAlpha().raw().toBuffer({resolveWithObject:true}));
 return images.get(path);
}
for(const id of REMADE_HERO_IDS){
 for(const [suffix,count] of [['attack',6],['cast',6],['ultimate',8]])check(SPRITE_FRAMES[`battle_${id}_${suffix}`]?.length===count,`${id}/${suffix}: complete animation`);
 check(SPRITE_FRAMES[id]?.length===12,`${id}: four directions with three steps`);
 await rawAsset(`dlg_${id}`);await rawAsset(`face_${id}`);
 for(let i=0;i<6;i++)await rawAsset(`skill_icon_${id}_${i}`);
 for(const action of ['attack','cast','ultimate']){
  const count=action==='ultimate'?8:6,poses=new Set(Array.from({length:101},(_,i)=>characterPoseFrame(id,action,i/100,count)));
  check(poses.size===count,`${id}/${action}: every pose appears in the timing`);
 }
}
for(const [key,crops] of Object.entries(REMAKE_FRAMES)){
 const {data,info}=await rawAsset(key);
 check(data.some((value,index)=>index%info.channels===info.channels-1&&value===0),`${key}: genuine transparency`);
 for(const [i,crop] of crops.entries()){
  check(Object.values(crop).every(Number.isFinite),`${key}/${i}: finite crop and anchor`);
  check([crop.x,crop.y,crop.w,crop.h].every(Number.isInteger)&&crop.x>=0&&crop.y>=0&&crop.w>0&&crop.h>0&&crop.x+crop.w<=info.width&&crop.y+crop.h<=info.height,`${key}/${i}: native crop inside source`);
  const alpha=(x,y)=>data[((crop.y+y)*info.width+crop.x+x)*info.channels+info.channels-1];
  let edge=0,visible=0;
  for(let y=0;y<crop.h;y++)for(let x=0;x<crop.w;x++)if(alpha(x,y)>24){visible++;if(!x||!y||x===crop.w-1||y===crop.h-1)edge++;}
  check(visible>0,`${key}/${i}: visible art`);
  check(edge===0,`${key}/${i}: visible pixels do not hit crop edges (${edge})`);
  frames++;
 }
}
check(!PLAYABLE_HERO_IDS.includes('abel'),'Abel remains outside playable roster');
check(skillMotifIndex('crimson-suture')===1&&skillMotifIndex('return-stitch')===2&&skillMotifIndex('in-aeternum-vive')===4,'Carmilla techniques use their own distinct motifs');
check(!ASSETS.abel,'Abel has no invented walking asset');
for(const id of ['ava','orfeu'])check(!ASSETS[`battle_${id}_ultimate`].includes('/v29/'),`${id}: approved exception preserved`);
for(const hero of SUMMONED_HEROES){const id=hero.hero||hero.id;if([...REMADE_HERO_IDS,'abel'].includes(id))check(hero.art===ASSETS[`dlg_${id}`],`${hero.id}: catalog uses remake portrait`);}
console.log(`${checks} remake-art checks passed: ${frames} isolated native frames, all remade kits, personal icons/faces, timing, catalog and explicit exceptions.`);
