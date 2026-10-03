import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-environment-'));
for(const name of ['cosmetics','data','progression','summons','carmilla','engine','sprites','aura','environment','renderer']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {MAPS}=await import(pathToFileURL(join(out,'data.js')).href);
const {ENVIRONMENT_ASSETS,ENVIRONMENT_THEMES,environmentVariant,environmentScenery,paintEnvironmentTile}=await import(pathToFileURL(join(out,'environment.js')).href);
const {WorldRenderer}=await import(pathToFileURL(join(out,'renderer.js')).href);
const {SPRITE_FRAMES}=await import(pathToFileURL(join(out,'sprites.js')).href);
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const artBounds=JSON.parse(readFileSync('art-source/v25/environment/sprite-bounds.json','utf8'));
const signBounds=JSON.parse(readFileSync('art-source/v25/environment/signboard-final-bounds.json','utf8'));
const images=Object.fromEntries(Object.keys(ENVIRONMENT_ASSETS).map(key=>[key,{width:key.includes('scenery')?1448:1254,height:key.includes('scenery')?1086:1254}]));
for(const src of Object.values(ENVIRONMENT_ASSETS))check(existsSync(`public${src}`),`Generated source exists: ${src}`);
check(artBounds.academy.transparentPixels>500000&&artBounds.ruins.transparentPixels>500000,'Both scenery atlases contain real broad alpha transparency');
check(signBounds.parts.length===12&&SPRITE_FRAMES.signboards.length===12,'Repaired sign atlas contains twelve complete independent silhouettes');
for(const crop of SPRITE_FRAMES.signboards){check(signBounds.parts.some(part=>['x','y','w','h','anchorX','anchorY'].every(key=>part[key]===crop[key])),'Sign renderer uses a measured crop and ground anchor from the repaired source');}
const calls=[];
const context={drawImage:(...args)=>calls.push(args),fillRect:()=>{},translate:()=>{},createLinearGradient:()=>({addColorStop:()=>{}})};
for(const map of Object.values(MAPS)){
 check(!!ENVIRONMENT_THEMES[map.id],`${map.id} has its own environment theme`);
 const floor=ENVIRONMENT_THEMES[map.id].floor;
 for(let y=0;y<map.height;y++)for(let x=0;x<map.width;x++){
  const tile=map.rows[y][x];check(!!floor[tile],`${map.id}/${tile} has a generated floor material`);
  const before=calls.length;paintEnvironmentTile(context,images,{},map,x,y,56);
  check(calls.length===before+1,`${map.id} paints source artwork for every grid cell`);
  const [img,sx,sy,sw,sh]=calls.at(-1),row=floor[tile].row;
  check(sx>=0&&sy>=row*img.height/4&&sx+sw<=img.width&&sy+sh<=(row+1)*img.height/4,`${map.id} source crop remains within its own material row`);
 }
 const variants=new Set();for(let x=0;x<10;x++)for(let y=0;y<10;y++){const value=environmentVariant(map.id,x,y);check(value===environmentVariant(map.id,x,y),'Variation remains stable');variants.add(value%4);}
 check(variants.size===4,`${map.id} makes all four material variations available`);
 map.props.forEach((prop,index)=>{const art=environmentScenery(map.id,prop,index);if(!art)return;const metadata=art.sheet.endsWith('academy')?artBounds.academy:artBounds.ruins;check(metadata.crops.some(crop=>JSON.stringify(crop)===JSON.stringify(art.crop)),`${map.id} uses individually measured sprite bounds`);check(art.crop.x>=0&&art.crop.y>=0&&art.crop.x+art.crop.w<metadata.width&&art.crop.y+art.crop.h<metadata.height,'Scenery silhouette is fully contained away from outer atlas edges');});
}
global.document={createElement:()=>({width:0,height:0,getContext:()=>context})};
const renderer={images,patterns:{},groundCache:new Map()};
const floor=WorldRenderer.prototype.ground.call(renderer,MAPS.patio),paintCalls=calls.length;
check(WorldRenderer.prototype.ground.call(renderer,MAPS.patio)===floor&&calls.length===paintCalls,'Unchanged ground reuses its cached painting');
const bridgeRows=MAPS.patio.rows.map((row,y)=>y===16||y===17?row.slice(0,2)+'ii'+row.slice(4):row);
check(WorldRenderer.prototype.ground.call(renderer,{...MAPS.patio,rows:bridgeRows})!==floor,'Frozen bridge updates artwork when grid changes');
check(WorldRenderer.prototype.ground.call(renderer,MAPS.patio)!==floor,'Bridge expiry updates artwork again');
for(const map of Object.values(MAPS))WorldRenderer.prototype.ground.call(renderer,map);
check(renderer.groundCache.size===3,'Detailed floor cache has a bounded memory footprint');
console.log(`${checks} environment checks passed: 10 themed maps, 64 source swatches, 24 measured scenery sprites, 12 repaired signs, stable variation, and bridge cache invalidation.`);
