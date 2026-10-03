import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import ts from 'typescript';

// Sharp is already installed through Wrangler/Miniflare in this pnpm project.
const projectRequire=createRequire(import.meta.url);
const wranglerRequire=createRequire(projectRequire.resolve('wrangler'));
const sharp=createRequire(wranglerRequire.resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-battle-layout-'));
for(const name of ['data','sprites','battleFormation']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {ASSETS,PLAYABLE_HERO_IDS}=await import(pathToFileURL(join(out,'data.js')).href);
const {battleCrop}=await import(pathToFileURL(join(out,'sprites.js')).href);
const {battleFormation,battleActorScale}=await import(pathToFileURL(join(out,'battleFormation.js')).href);

const images=new Map(),silhouettes=new Map();
let checks=0,actorPlacements=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};

/** Alpha, rather than the transparent crop rectangle, defines visible content. */
async function idleSilhouette(key){
 if(silhouettes.has(key))return silhouettes.get(key);
 check(!!ASSETS[key],`${key}: registered sprite source`);
 let raw=images.get(ASSETS[key]);
 if(!raw){raw=await sharp(`public${ASSETS[key]}`).ensureAlpha().raw().toBuffer({resolveWithObject:true});images.set(ASSETS[key],raw);}
 const crop=battleCrop(key,0),{data,info}=raw;
 check(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=info.width&&crop.y+crop.h<=info.height,`${key}: idle crop is inside its actual source`);
 let left=crop.w,top=crop.h,right=-1,bottom=-1;
 for(let y=0;y<crop.h;y++)for(let x=0;x<crop.w;x++){
  const alpha=data[((crop.y+y)*info.width+crop.x+x)*info.channels+info.channels-1];
  // Tiny exporter haze outside the drawing is not a body or readable effect.
  if(alpha>24){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y);}
 }
 check(right>=left&&bottom>=top,`${key}: idle has visible artwork`);
 const result={crop,left:crop.x+left,top:crop.y+top,right:crop.x+right+1,bottom:crop.y+bottom+1};
 silhouettes.set(key,result);
 return result;
}

async function renderedIdle(key,slot,flip=false){
 const source=await idleSilhouette(key),scale=battleActorScale(key,slot,flip);
 check(Number.isFinite(scale)&&scale>0,`${key}: finite positive native scale`);
 const left=slot.x+(flip?source.crop.anchorX-source.right:source.left-source.crop.anchorX)*scale;
 return{left,right:left+(source.right-source.left)*scale,top:slot.y+(source.top-source.crop.anchorY)*scale,bottom:slot.y+(source.bottom-source.crop.anchorY)*scale};
}

const heroes=[...PLAYABLE_HERO_IDS,'gabriel_lycan'];
const enemyKeys=['wolf','shadow','boss','ashwolf','moth','cinder'].map(id=>`battle_${id}_attack`);
const idleSway=1.5;
let minimumNameGap=Infinity,minimumEnemyGap=Infinity;
for(const [width,height] of [[1310,235],[844,205]])for(let count=1;count<=5;count++){
 const formation=battleFormation(width,height,count);
 check(formation.heroes.length===count,`${width}×${height}/${count}: one independent lane per ally`);
 const enemies=[];
 for(const key of enemyKeys){
  const bounds=await renderedIdle(key,formation.enemy);
  check(bounds.left>=0&&bounds.right<=width&&bounds.top>=0&&bounds.bottom<=height,`${width}×${height}/${key}: enemy idle stays on stage`);
  enemies.push(bounds);
 }
 const nearestEnemy=Math.min(...enemies.map(bounds=>bounds.left));
 for(const hero of heroes)for(let lane=0;lane<count;lane++){
  const slot=formation.heroes[lane],key=`battle_${hero}_attack`,bounds=await renderedIdle(key,slot,hero==='ophelia');
  const context=`${width}×${height}/${count}/${hero}/lane ${lane+1}`;
  check(bounds.left>=0&&bounds.right<=width&&bounds.top-idleSway>=0&&bounds.bottom+idleSway<=height,`${context}: visible idle stays on stage throughout its ±1.5px sway`);
  check(bounds.left>=slot.x-slot.cellWidth/2&&bounds.right<=slot.x+slot.cellWidth/2,`${context}: visible idle stays in its own lane`);
  // The plate begins eleven pixels above the baseline; idle bodies move ±1.5px.
  const nameGap=slot.labelY-11-(bounds.bottom+idleSway);
  check(nameGap>=1,`${context}: ground name plate clears the lowest idle sway by at least 1px`);
  check(slot.labelY+4<=height,`${context}: ground name plate stays on stage`);
  const enemyGap=nearestEnemy-bounds.right;
  check(enemyGap>=8,`${context}: visible idle remains separated from the nearest enemy silhouette`);
  minimumNameGap=Math.min(minimumNameGap,nameGap);minimumEnemyGap=Math.min(minimumEnemyGap,enemyGap);actorPlacements++;
 }
}
console.log(`${checks} battle-layout checks passed: ${actorPlacements} native-alpha idle placements, 1–5 allies, all 9 heroes plus Gabriel Lycan, two canvas sizes, ±1.5px idle sway, ground names and enemy separation. Minimum name gap ${minimumNameGap.toFixed(2)}px at lowest sway; enemy gap ${minimumEnemyGap.toFixed(2)}px. Temporary spell and weapon reach are outside this idle-body contract.`);
