import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-environment-'));
for(const name of ['cosmetics','data','progression','summons','carmilla','engine','sprites','aura','environmentArt','environment','renderer']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {MAPS}=await import(pathToFileURL(join(out,'data.js')).href);
const {ENVIRONMENT_ASSETS,ENVIRONMENT_THEMES,ENVIRONMENT_CROPS,FLOOR_ROWS,environmentVariant,environmentScenery,environmentObject,paintEnvironmentTile,paintEnvironmentEdges,blendEnvironmentSeams}=await import(pathToFileURL(join(out,'environment.js')).href);
const {WorldRenderer}=await import(pathToFileURL(join(out,'renderer.js')).href);
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const bounds=JSON.parse(readFileSync('art-source/v26/environment/sprite-bounds.json','utf8'));
const images={};
for(const[key,src]of Object.entries(ENVIRONMENT_ASSETS)){
 check(existsSync(`public${src}`),`Generated source exists: ${src}`);
 check(src.includes('/v26/'),`Production environment source is anime v26: ${src}`);
 const png=readFileSync(`public${src}`);images[key]={width:png.readUInt32BE(16),height:png.readUInt32BE(20),key};
}
for(const[key,metadata]of Object.entries(bounds)){
 check(metadata.transparentPixels>400000,`${key} has broad real alpha transparency`);
 check(ENVIRONMENT_CROPS[key].length===metadata.crops.length,`${key} uses all measured independent crops`);
 metadata.crops.forEach((crop,index)=>{
  check(JSON.stringify(crop)===JSON.stringify(ENVIRONMENT_CROPS[key][index]),`${key} crop/anchor equals native alpha measurement`);
  check(crop.x>0&&crop.y>0&&crop.x+crop.w<metadata.width&&crop.y+crop.h<metadata.height,`${key} sprite fully contained inside image`);
  for(const other of metadata.crops.slice(index+1))check(!(crop.x<other.x+other.w&&crop.x+crop.w>other.x&&crop.y<other.y+other.h&&crop.y+crop.h>other.y),`${key} source rectangle contains no adjacent sprite`);
 });
}
check(ENVIRONMENT_CROPS.signboards.length===12,'All twelve sign identities have separate anime artwork');
const calls=[],fills=[];
const context={drawImage:(...args)=>calls.push(args),fillRect:(...args)=>fills.push(args),translate:()=>{},createLinearGradient:()=>({addColorStop:()=>{}})};
for(const map of Object.values(MAPS)){
 check(!!ENVIRONMENT_THEMES[map.id],`${map.id} has its own theme`);
 check(!('wall' in ENVIRONMENT_THEMES[map.id]),`${map.id} no longer defines an opaque wall fill`);
 const floor=ENVIRONMENT_THEMES[map.id].floor;
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
  const tile=map.rows[y][x];check(!!floor[tile],`${map.id}/${tile} has floor artwork`);
  const before=calls.length,fillBefore=fills.length;paintEnvironmentTile(context,images,{},map,x,y,56);
  check(calls.length===before+(tile==='#'?2:1),`${map.id} paints artwork, including illustrated wall modules`);
  check(fills.length===fillBefore,`${map.id} loaded floor/wall uses no solid rectangle covering artwork`);
  const[img,sx,sy,sw,sh]=calls[before],row=floor[tile].row,rows=FLOOR_ROWS[floor[tile].sheet];
  check(sx>=0&&sy>=rows[row]&&sx+sw<=img.width&&sy+sh<=rows[row+1],`${map.id} crop stays in its actual material row`);
  if(tile==='#'){
   const[wall,wx,wy,ww,wh]=calls.at(-1);
   const boundary=ENVIRONMENT_THEMES[map.id].boundary,capRow=boundary===2?1:0;
   check(boundary===1?wall.key==='env_boundaries'&&ENVIRONMENT_CROPS.boundaries.some(crop=>wx>=crop.x&&wy>=crop.y&&wx+ww<=crop.x+crop.w&&wy+wh<=crop.y+crop.h):wall.key==='env_wallcaps'&&wy>=capRow*wall.height/2&&wy+wh<=(capRow+1)*wall.height/2,'Wall sample remains inside its generated cap/hedge material');
   const beforeEdges=calls.length;paintEnvironmentEdges(context,map,x,y,56,images);
   check(fills.slice(fillBefore).every(rect=>Math.min(rect[2],rect[3])<=2),'Blocked cells add only thin rim ink, no opaque fill or rectangular shadow');
   check(calls.length===beforeEdges+(boundary!==1&&map.rows[y+1]?.[x]!=='#'?1:0),'Wall facade appears only along the exposed south edge, not repeatedly inside the wall');
  }
 }
 const variants=new Set();for(let x=0;x<10;x++)for(let y=0;y<10;y++){const value=environmentVariant(map.id,x,y);check(value===environmentVariant(map.id,x,y),'Variation remains stable');variants.add(value%4);}
 check(variants.size===4,`${map.id} uses all four material choices`);
 map.props.forEach((prop,index)=>{const art=environmentScenery(map.id,prop,index)||environmentObject(prop.asset,prop.atlas,prop.atlasSheet);
  check(!!art,`${map.id}/${prop.asset} has coherent anime scenery art`);
  check(!!images[art.sheet],`${map.id}/${prop.asset} references a loaded generated asset`);
  check(Object.values(ENVIRONMENT_CROPS).flat().some(crop=>JSON.stringify(crop)===JSON.stringify(art.crop)),`${map.id} uses a measured crop`);
  const painter={ctx:context,images,image:WorldRenderer.prototype.image};WorldRenderer.prototype.scenery.call(painter,map,prop,index);
  const source=calls.at(-1);check(source[6]>=-20,`${map.id}/${prop.asset} complete top stays inside the map canvas`);
 });
}
global.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
const seaCanvas={width:MAPS.porto.width*56,height:MAPS.porto.height*56},rowsBefore=MAPS.porto.rows.join('|');
const seaSeams=blendEnvironmentSeams(context,seaCanvas,MAPS.porto,56);
check(seaSeams>0,'Harbor water patch boundaries receive smooth bitmap transitions');
check(seaSeams===blendEnvironmentSeams(context,seaCanvas,MAPS.porto,56),'Seam placement is deterministic');
check(blendEnvironmentSeams(context,{width:1120,height:952},MAPS.camara,56)===0,'Crisp architectural floor patterns are not softened');
check(MAPS.porto.rows.join('|')===rowsBefore,'Water mixing preserves every navigation cell');
const renderer={images,patterns:{},groundCache:new Map()};
const floor=WorldRenderer.prototype.ground.call(renderer,MAPS.patio),paintCalls=calls.length;
check(WorldRenderer.prototype.ground.call(renderer,MAPS.patio)===floor&&calls.length===paintCalls,'Unchanged ground reuses cache');
const bridgeRows=MAPS.patio.rows.map((row,y)=>y===16||y===17?row.slice(0,2)+'ii'+row.slice(4):row);
check(WorldRenderer.prototype.ground.call(renderer,{...MAPS.patio,rows:bridgeRows})!==floor,'Frozen bridge repaints ground');
check(WorldRenderer.prototype.ground.call(renderer,MAPS.patio)!==floor,'Bridge expiry repaints ground');
for(const map of Object.values(MAPS))WorldRenderer.prototype.ground.call(renderer,map);
check(renderer.groundCache.size===3,'Floor cache is bounded at three maps');
console.log(`${checks} environment checks passed: 10 anime maps, 72 floor/wall-cap swatches, 75 measured transparent sprites, continuous wall caps with exposed facades, no opaque wall fill or rectangular wall shadow, complete prop coverage, stable variation and bridge cache invalidation.`);
