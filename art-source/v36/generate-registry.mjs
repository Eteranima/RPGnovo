// Deterministic native source metadata -> runtime registry. Run only after every final atlas is approved.
import {readFileSync,writeFileSync,existsSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='art-source/v36/variants';
const ids=['seiji-last-script','ophelia-white-equinox','marin-starless-throne','gabriel-solar-oath','max-thunder-requiem','ava-worldroot-sovereign','beatriz-eclipse-tide','orfeu-unwritten-archon'];
const assets={},frames={},sizes={},bodyTops={};
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const id of ids){
 const dir=`${root}/${id}`,path=`/assets/v36/variants/${id}`;
 const portrait=JSON.parse(readFileSync(`${dir}/portrait-manifest.json`,'utf8'));
 assert.equal(hash(portrait.source),portrait.sourceSha256);assert.equal(hash(portrait.runtime),portrait.sourceSha256);
 for(const prefix of ['portrait','dlg'])assets[`${prefix}_${id}`]=`${path}/portrait.png`;
 assets[`face_${id}`]=`${path}/face.png`;
 const order=id==='marin-starless-throne'?[0,1,2,6,3,4,5,7]:undefined;
 const body=existsSync(`${dir}/body-metrics.json`)?JSON.parse(readFileSync(`${dir}/body-metrics.json`,'utf8')):null;
 for(const kind of ['walk','attack','cast','ultimate','vfx','icons',...(!id.startsWith('ava-')&&!id.startsWith('beatriz-')&&!id.startsWith('orfeu-')?['companion']:[]),...(id==='gabriel-solar-oath'?['lycan-walk','lycan-attack','lycan-cast','lycan-ultimate']:[])]){
  const m=JSON.parse(readFileSync(`${dir}/${kind}-manifest.json`,'utf8'));
  assert.equal(hash(m.selected),m.selectedSha256,id+kind);assert.equal(hash(m.runtime),m.selectedSha256,id+kind);
  const lycan=kind.startsWith('lycan-'),baseKind=lycan?kind.slice(6):kind,artId=lycan?`${id}_lycan`:id;
  const key=baseKind==='walk'?artId:['attack','cast','ultimate'].includes(baseKind)?`battle_${artId}_${baseKind}`:baseKind==='vfx'?`battle_fx_${id}`:baseKind==='icons'?`skill_icons_${id}`:`companion_${id}`;
  assets[key]=`${path}/${kind}.png`;
  const remap=kind==='walk'&&id==='ophelia-white-equinox'?[0,1,2,6,7,8,3,4,5,9,10,11]:kind==='lycan-ultimate'?[0,1,2,3,5,4,6,7]:kind==='ultimate'&&order?order:m.frames.map((_,i)=>i);
  frames[key]=remap.map(i=>m.frames[i]);
  const measured=Object.fromEntries((body?.metrics||[]).filter(metric=>metric.kind===kind).map(metric=>[metric.i??metric.index,metric.headTop])),array=body?.bodyTops?.[`battle_${artId}_${baseKind}`]||[],overrides={...measured,...Object.fromEntries(array.map((top,i)=>[i,top])),...body?.manualHeadTopOverrides?.[kind]};if(Object.keys(overrides).length)bodyTops[key]=Object.fromEntries(remap.map((native,i)=>[i,overrides[native]]).filter(([,top])=>Number.isFinite(top)));
  if(baseKind==='icons')for(let i=0;i<6;i++){const icon=m.measurements[i].individual;assert.ok(icon&&existsSync(icon.path));assert.equal(hash(icon.path),icon.sha256);assets[`skill_icon_${id}_${i}`]=`${path}/icons/${i}.png`;}
  if(baseKind==='companion'){sizes[id]={width:m.width,height:m.height};assets[`companion_event_${id}`]=assets[key];frames[`companion_event_${id}`]=frames[key];}
 }
 if(id==='gabriel-solar-oath'){const lycan=`${id}_lycan`,portraits=JSON.parse(readFileSync(`${dir}/lycan-portrait-manifest.json`,'utf8'));assert.equal(hash(portraits.source),portraits.sourceSha256);for(const entry of portraits.entries){assert.equal(hash(entry.runtime),entry.pngSha256);assets[`${entry.kind==='face-lycan'?'face':'portrait'}_${lycan}`]='/'+entry.runtime.replace(/^public\//,'');}assets[`dlg_${lycan}`]=assets[`portrait_${lycan}`];assets[`battle_fx_${lycan}`]=assets[`battle_fx_${id}`];frames[`battle_fx_${lycan}`]=frames[`battle_fx_${id}`];for(let i=0;i<6;i++)assets[`skill_icon_${lycan}_${i}`]=assets[`skill_icon_${id}_${i}`];}
 if(['ava-worldroot-sovereign','beatriz-eclipse-tide','orfeu-unwritten-archon'].includes(id)){
  const background=JSON.parse(readFileSync(`${dir}/cinematic-background-manifest.json`,'utf8')),runtime=`public${path}/cinematic-background.png`;
  assert.equal(hash(runtime),background.runtimeSha256,id+' final cinematic background');
  assets[`battle_${id}_cinematic_background`]=`${path}/cinematic-background.png`;
 }
}
for(const hero of readdirSync('public/assets/v36/skills'))for(const file of readdirSync(`public/assets/v36/skills/${hero}`))if(file.endsWith('.png'))assets[`skill_icon_${hero}_${file.slice(0,-4)}`]=`/assets/v36/skills/${hero}/${file}`;
const output="import type {SpriteCrop} from './sprites';\n\n// Generated from approved native RGBA source manifests; see art-source/v36/generate-registry.mjs.\n"+
'export const VARIANT_ASSETS_V36:Record<string,string>='+JSON.stringify(assets,null,1)+';\n\n'+
'export const VARIANT_FRAMES_V36:Record<string,SpriteCrop[]>='+JSON.stringify(frames,null,1)+';\n\n'+
'export const COMPANION_SIZES_V36:Record<string,{width:number;height:number}>='+JSON.stringify(sizes,null,1)+';\n\n'+
'export const VARIANT_BODY_TOPS_V36:Record<string,Record<number,number>>='+JSON.stringify(bodyTops,null,1)+';\n';
writeFileSync('lib/game/variantArtV36.ts',output);
console.log(JSON.stringify({variants:ids.length,assets:Object.keys(assets).length,sheets:Object.keys(frames).length,poses:Object.values(frames).reduce((n,a)=>n+a.length,0)}));
