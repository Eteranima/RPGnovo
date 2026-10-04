// Build the integration registry only after every selected native source passed the exporter.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {readFileSync,writeFileSync,existsSync} from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const entries=JSON.parse(readFileSync('art-source/v30/selected.json','utf8'));
const manifests=new Map(),assets={},frames={};let checks=0;const check=(ok,msg)=>{checks++;assert.ok(ok,msg);};
for(const e of entries){const m=JSON.parse(readFileSync(`art-source/v30/${e.group}/${e.id}/${e.kind}-manifest.json`,'utf8'));check(m.source===e.source,e.id+' '+e.kind+' selected source current');check(m.sourceSha256===hash(e.source)&&m.runtimeSha256===hash(m.runtime),e.id+' '+e.kind+' hashes');check(hash(m.selected)===hash(m.runtime),e.id+' '+e.kind+' selected/runtime native copies');check(m.frames.length===e.cols*e.rows,e.id+' '+e.kind+' frame count');if(!e.opaque){check(m.alphaZeroPixels>m.width*m.height*.08,e.id+' '+e.kind+' real alpha');check(m.outerVisible===0,e.id+' '+e.kind+' outer edge');}
 for(const f of m.frames){check(f.x>=0&&f.y>=0&&f.x+f.w<=m.width&&f.y+f.h<=m.height,e.id+' '+e.kind+' native crop bound');check(f.anchorX>=f.x&&f.anchorX<=f.x+f.w&&f.anchorY>=f.y&&f.anchorY<=f.y+f.h,e.id+' '+e.kind+' anchor within crop');}
 manifests.set(e.id+'_'+e.kind,m);
}
for(const family of ['lobo','sombra','selo','ashwolf','moth','eco','cinder','lunastag','runewarden','astral']){const m=manifests.get(family+'_ultimate');assets['ultimate_'+family]='/assets/v30/enemies/'+family+'/ultimate.png';frames['ultimate_'+family]=m.frames;check(m.frames.length===8,family+' ultimate8');}
for(const id of ['lunastag','runewarden','astral']){const m=manifests.get(id+'_attack');assets['battle_'+id+'_attack']='/assets/v30/enemies/'+id+'/attack.png';frames['battle_'+id+'_attack']=m.frames;check(m.frames.length===6,id+' attack6');}
const localCrop=f=>({x:0,y:0,w:f.w,h:f.h,anchorX:Math.round((f.anchorX-f.x)*10)/10,anchorY:f.anchorY-f.y});
const derived=[];
for(const id of ['lunastag','runewarden']){
 const m=manifests.get(id+'_portrait'),f=m.frames[0],target='public/assets/v30/enemies/'+id+'/body.png';await sharp(m.selected).extract({left:f.x,top:f.y,width:f.w,height:f.h}).png().toFile(target);
 const original=await sharp(m.selected).ensureAlpha().raw().toBuffer(),cropped=await sharp(target).ensureAlpha().raw().toBuffer();
 for(let y=0;y<f.h;y++)check(cropped.subarray(y*f.w*4,(y+1)*f.w*4).equals(original.subarray(((f.y+y)*m.width+f.x)*4,((f.y+y)*m.width+f.x+f.w)*4)),id+' body native RGBA row');
 assets[id]='/assets/v30/enemies/'+id+'/body.png';frames[id]=[localCrop(f)];
 assets['portrait_'+id]='/assets/v30/enemies/'+id+'/portrait.png';frames['portrait_'+id]=m.frames;
 derived.push({id,path:target,source:m.selected,crop:f,sha256:hash(target),allRgbaBytesPreserved:true});
}
const phases=manifests.get('astral_phases');assets.battle_astral_phases='/assets/v30/enemies/astral/phases.png';frames.battle_astral_phases=phases.frames;
const phaseKeys=[];
for(let i=0;i<3;i++){const key='battle_astral_phase_'+(i+1),p='/assets/v30/enemies/astral/phase-'+(i+1)+'.png';assets[key]=p;frames[key]=[localCrop(phases.frames[i])];phaseKeys.push(key);derived.push(phases.measurements[i].nativeCrop);}
assets.astral=assets.battle_astral_phase_1;frames.astral=frames.battle_astral_phase_1;assets.portrait_astral=assets.astral;frames.portrait_astral=frames.astral;
assets.env_floor_v30='/assets/v30/world/floor/materials.png';frames.env_floor_v30=manifests.get('floor_materials').frames;
assets.v30_world_props='/assets/v30/world/props/atlas.png';frames.v30_world_props=manifests.get('props_atlas').frames;
assets.battle_bg_lunar='/assets/v30/world/lunar/background.png';assets.battle_bg_observatory='/assets/v30/world/observatory/background.png';
const floorRows={env_floor_v30:manifests.get('floor_materials').rowCuts};
const bodies={lobo:'wolf',sombra:'shadow',selo:'boss',eco:'boss',ashwolf:'ashwolf',moth:'moth',cinder:'cinder',lunastag:'lunastag',runewarden:'runewarden',astral:'astral'};
const presentation={};const timing8=[0,.11,.24,.36,.5,.60,.79,.92],timing6=[0,.15,.3,.48,.64,.83];
for(const[id,body]of Object.entries(bodies)){presentation[id]={body,attack:'battle_'+body+'_attack',ultimate:'ultimate_'+id,facing:'left',ultimateTiming:timing8,impactFrame:5,...(['lunastag','runewarden','astral'].includes(id)?{attackTiming:timing6}:{}),...(id==='astral'?{phases:phaseKeys,phaseThresholds:[.66,.33]}:{})};}
const motifs={lobo:['dark','Lua fragmentada e três marcas de garras'],sombra:['dark','Espiral de correntes e maré de sombras'],selo:['ink','Selo estilhaçado e fragmentos de página'],eco:['dark','Espelhos partidos e véu violeta'],ashwolf:['fire','Brasas carmesim e uivo flamejante'],moth:['ice','Eclipse lunar e cristais violetas de geada'],cinder:['fire','Espada solar e brasas da pira'],lunastag:['ice','Coroa de gelo e investida lunar'],runewarden:['ink','Édito rúnico e arco de tinta azul'],astral:['lightning','Três órbitas douradas e estrela elétrica']};
const effects={};for(const[id,[element,motif]]of Object.entries(motifs))effects[id]={element,motif,impactFrame:5,sequence:['rest','anticipation','gather','windup','release','contact','follow-through','recovery'],containsBodyAndLocalEffect:true};
const content="import type {SpriteCrop} from './sprites';\n\n// Final built-in image_gen sources, measured native RGBA bounds.\n// Prompts, rejected variants and pixel verification: art-source/v30.\nexport const ENEMY_ASSETS_V30:Record<string,string>="+JSON.stringify(assets,null,2)+";\n\nexport const ENEMY_FRAMES_V30:Record<string,SpriteCrop[]>="+JSON.stringify(frames,null,2)+";\n\nexport const EXPANSION_FLOOR_ROWS_V30:Record<string,number[]>="+JSON.stringify(floorRows)+";\n\nexport type EnemyPresentationV30={body:string;attack:string;ultimate:string;facing:'left';ultimateTiming:number[];impactFrame:number;attackTiming?:number[];phases?:string[];phaseThresholds?:number[]};\nexport const ENEMY_PRESENTATION_V30:Record<string,EnemyPresentationV30>="+JSON.stringify(presentation,null,2)+";\n\nexport const ENEMY_ULTIMATE_EFFECTS_V30="+JSON.stringify(effects,null,2)+" as const;\n";
writeFileSync('lib/game/enemyArtV30.ts',content+'\n'+readFileSync('art-source/v30/enemy-helpers.ts.txt','utf8'));
for(const[key,path]of Object.entries(assets))check(existsSync('public'+path),key+' runtime file exists');
const out={checks,passed:true,selectedSources:entries.length,measuredSourceCells:[...manifests.values()].reduce((a,m)=>a+m.frames.length,0),ultimateFamilies:10,ultimateAnimationFrames:80,newAttackFrames:18,worldProps:8,floorVariants:16,bossPhases:3,assets:Object.entries(assets).map(([key,path])=>({key,path,sha256:hash('public'+path)})),derived};
writeFileSync('art-source/v30/registry-manifest.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({checks,passed:true,selectedSources:out.selectedSources,measuredSourceCells:out.measuredSourceCells,assetKeys:Object.keys(assets).length,frameKeys:Object.keys(frames).length}));
