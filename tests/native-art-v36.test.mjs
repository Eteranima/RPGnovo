import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
import {compileUltimateSceneV36} from './cinematic-module-loader.mjs';

const require=createRequire(import.meta.url),sharp=createRequire(createRequire(require.resolve('wrangler')).resolve('miniflare'))('sharp');
const out=mkdtempSync(join(tmpdir(),'eter-native-art-v36-'));compileGameModules(out,['engine','variantsV36','battleFormation','legendarySceneV36','characterAnimation']);
const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {ASSETS}=await load('data'),{SPRITE_FRAMES,battleCrop}=await load('sprites'),{VARIANTS_V36,heroArtIdV36,variantByIdV36,premiumVariantV36,normalizeHeroVariantsV36,variantCompanionV36}=await load('variantsV36');
const {battleFormation,battleActorScale,battleCropBounds,battleActorAdvanceV36}=await load('battleFormation'),{characterPoseFrame}=await load('characterAnimation'),{battleTimingV32}=await load('combatPreferencesV32');
const {legendarySceneV36}=await load('legendarySceneV36'),{drawUltimateSceneV36}=await compileUltimateSceneV36(out);
let checks=0,poses=0,rows=0;const check=(v,m)=>{assert.ok(v,m);checks++;},eq=(v,e,m)=>{assert.deepEqual(v,e,m);checks++;};
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex'),json=p=>JSON.parse(readFileSync(p,'utf8'));
const remap=(id,kind,n)=>kind==='walk'&&id==='ophelia-white-equinox'?[0,1,2,6,7,8,3,4,5,9,10,11]:id==='marin-starless-throne'&&kind==='ultimate'?[0,1,2,6,3,4,5,7]:kind==='lycan-ultimate'?[0,1,2,3,5,4,6,7]:Array.from({length:n},(_,i)=>i);
for(const variant of VARIANTS_V36){
 const id=variant.id,dir='art-source/v36/variants/'+id,portrait=json(dir+'/portrait-manifest.json');
 eq(hash(portrait.source),portrait.sourceSha256,'selected portrait is the measured source');
 eq(hash(portrait.runtime),portrait.sourceSha256,'portrait is copied byte-for-byte');
 const original=await sharp(portrait.source).ensureAlpha().raw().toBuffer(),face=await sharp(portrait.face.runtime).ensureAlpha().raw().toBuffer(),f=portrait.face;
 for(let y=0;y<f.height;y++){check(face.subarray(y*f.width*4,(y+1)*f.width*4).equals(original.subarray(((f.top+y)*portrait.width+f.left)*4,((f.top+y)*portrait.width+f.left+f.width)*4)),'face keeps every native RGBA pixel');rows++;}
 const kinds=['walk','attack','cast','ultimate','vfx','icons',...(!variant.legendary?['companion']:[]),...(id==='gabriel-solar-oath'?['lycan-walk','lycan-attack','lycan-cast','lycan-ultimate']:[])];
 for(const kind of kinds){
  const m=json(dir+'/'+kind+'-manifest.json'),lycan=kind.startsWith('lycan-'),base=lycan?kind.slice(6):kind,artId=lycan?id+'_lycan':id;
  const key=base==='walk'?artId:['attack','cast','ultimate'].includes(base)?`battle_${artId}_${base}`:base==='vfx'?`battle_fx_${id}`:base==='icons'?`skill_icons_${id}`:`companion_${id}`;
  const count={walk:12,attack:6,cast:6,ultimate:8,vfx:6,icons:6,companion:4}[base];
  eq(m.frames.length,count,'complete native pose/motif set');eq(hash(m.selected),m.selectedSha256,'measured selected PNG unchanged');eq(hash(m.runtime),m.selectedSha256,'runtime PNG unchanged');
  eq(ASSETS[key],'/'+m.runtime.replace(/^public\//,''),'registered key points at this exact final atlas');
  eq(SPRITE_FRAMES[key],remap(id,kind,count).map(i=>m.frames[i]),'runtime uses measured native crops in the reviewed playback order');
  const {data,info}=await sharp(m.runtime).ensureAlpha().raw().toBuffer({resolveWithObject:true});eq([info.width,info.height],[m.width,m.height],'native dimensions are never assumed or resized');
  check(m.backgroundAlphaZero>info.width*info.height*.1,'actual background is transparent');
  for(const measurement of m.measurements){
   const cell=measurement.cell,crop=measurement.crop;check(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=info.width&&crop.y+crop.h<=info.height,'every crop remains inside its native image');
   for(let x=cell.x;x<cell.x+cell.w;x++)check(data[(cell.y*info.width+x)*4+3]<=24&&data[((cell.y+cell.h-1)*info.width+x)*4+3]<=24,'horizontal seams do not cut visible art');
   for(let y=cell.y;y<cell.y+cell.h;y++)check(data[(y*info.width+cell.x)*4+3]<=24&&data[(y*info.width+cell.x+cell.w-1)*4+3]<=24,'vertical seams do not cut visible art');
   if(base==='icons'){
    const p=measurement.individual.path,raw=await sharp(p).ensureAlpha().raw().toBuffer();eq(hash(p),measurement.individual.sha256,'individual icon matches its recorded native crop');
    for(let y=0;y<crop.h;y++){check(raw.subarray(y*crop.w*4,(y+1)*crop.w*4).equals(data.subarray(((crop.y+y)*info.width+crop.x)*4,((crop.y+y)*info.width+crop.x+crop.w)*4)),'skill icon keeps every native RGBA pixel');rows++;}
   }
   poses++;
  }
  if(['attack','cast','ultimate'].includes(base))for(const [width,height] of [[1310,235],[844,205],[390,240]]){
   const {heroes}=battleFormation(width,height,5),slot=heroes[2];
   for(let i=0;i<count;i++){const b=battleCropBounds(battleCrop(key,i),slot.x,slot.y,battleActorScale(key,slot,false,i));check(b.x>=slot.x-slot.cellWidth/2-.01&&b.x+b.width<=slot.x+slot.cellWidth/2+.01,'complete action pose clears adjacent party lanes');const advance=battleActorAdvanceV36(b,slot,Math.min(width*.018,slot.cellWidth*.055,20));check(b.x+advance+b.width<=slot.x+slot.cellWidth*.5+.01,'actual attack advance cannot enter adjacent lane');check(b.y>=9.9&&b.y+b.height<=slot.labelY-12.9,'pose clears the top of stage and ground name label');}
  }
 }
 if(variant.legendary){
  const bg=ASSETS[`battle_${id}_cinematic_background`];check(bg&&existsSync('public'+bg),'legendary scene has its own final background');
  const info=await sharp('public'+bg).metadata();check(Math.abs(info.width/info.height-16/9)<.003,'background is native cinematic widescreen');
 }
 for(const speed of [1,2]){const timing=battleTimingV32(4800,speed,true),phase=(timing.impactAt-700/speed)/(timing.duration-700/speed);eq(characterPoseFrame(id,'ultimate',phase,8),5,'own contact pose occurs at real damage callback at both speeds');}
}
const wolf=json('art-source/v36/variants/gabriel-solar-oath/lycan-portrait-manifest.json'),wolfSource=await sharp(wolf.source).ensureAlpha().raw().toBuffer();
for(const entry of wolf.entries){eq(hash(entry.runtime),entry.pngSha256,'final Lycan portrait hash');const rgba=await sharp(entry.runtime).ensureAlpha().raw().toBuffer(),r=entry.rect;for(let y=0;y<r.height;y++){check(rgba.subarray(y*r.width*4,(y+1)*r.width*4).equals(wolfSource.subarray(((r.top+y)*wolf.sourceWidth+r.left)*4,((r.top+y)*wolf.sourceWidth+r.left+r.width)*4)),'Lycan portrait retains native RGBA rows');rows++;}}
check(ASSETS['face_gabriel-solar-oath_lycan'].endsWith('/face-lycan.png'),'Lycan uses its own wolf head');check(ASSETS['portrait_gabriel-solar-oath_lycan'].endsWith('/portrait-lycan.png'),'Lycan uses its own wolf body portrait');
const progress={heroVariantsV36:{gabriel:'gabriel-solar-oath'},summoned:['gabriel-solar-oath'],gabrielForm:'lycan'};
eq(heroArtIdV36('gabriel',progress),'gabriel-solar-oath_lycan','form switch selects actual own Lycan body');
eq(variantByIdV36(heroArtIdV36('gabriel',progress)).id,'gabriel-solar-oath','form preserves its real premium kit');
eq(premiumVariantV36('gabriel-solar-oath_lycan'),undefined,'visual form cannot become a separate Gacha payout');
eq(normalizeHeroVariantsV36({gabriel:'gabriel-solar-oath_lycan'},['gabriel-solar-oath']),{},'visual alias cannot enter canonical ownership/save selection');
eq(variantCompanionV36('gabriel',progress).name,'Dante','Lycan keeps the correct companion');
for(const reduced of [false,true])for(const variant of VARIANTS_V36.filter(v=>v.legendary)){
 const id=variant.id,keys=[`battle_${id}_ultimate`,`battle_fx_${id}`,`battle_${id}_cinematic_background`],art={};
 for(const key of keys){const info=await sharp('public'+ASSETS[key]).metadata();art[key]={key,width:info.width,height:info.height};}
 const canvas={dataset:{}},calls=[],ctx={clearRect(){},fillRect(){},save(){},restore(){},translate(){},rotate(){},createRadialGradient:()=>({addColorStop(){}}),drawImage:(...args)=>calls.push(args)};
 for(const t of [0,.1,.35,.58,.68,.82,.99]){
  calls.length=0;drawUltimateSceneV36(ctx,{art,id,key:keys[0],family:variant.hero,enemy:false,recruitDuel:false,width:844,height:240,age:t*4800,duration:4800,impactAt:3264,speed:1,reduced,element:variant.element,canvas});
  check(calls.some(c=>c[0]===art[keys[2]]),'production cinematic draws the own generated world');check(calls.some(c=>c[0]===art[keys[0]]),'production cinematic draws own body');
  if(!reduced&&t===0){const bodyDraw=calls.find(c=>c[0]===art[keys[0]]),frame=Number(canvas.dataset.ultimateFrame),crop=battleCrop(keys[0],frame),metrics=json('art-source/v36/variants/'+id+'/body-metrics.json'),head=metrics.manualHeadTopOverrides?.ultimate?.[frame]??metrics.metrics?.find(m=>m.kind==='ultimate'&&(m.i??m.index)===frame)?.headTop??metrics.bodyTops?.['battle_'+id+'_ultimate']?.[frame]??crop.y,headY=bodyDraw[6]+(head-crop.y)*bodyDraw[8]/crop.h;check(headY>=240*.065&&headY<240*.2,'cinematic focus keeps the measured head visible below letterbox');}check(calls.every(c=>c.slice(1).every(Number.isFinite)),'all native layer geometry remains finite');
  if(reduced)eq(canvas.dataset.ultimateFrame,'5','reduced motion keeps a stable generated contact pose');
 }
 const a=legendarySceneV36(id,.2,.68,true),b=legendarySceneV36(id,.8,.68,true);eq([a.zoom,a.panX,a.panY,a.back,a.front],[b.zoom,b.panX,b.panY,b.back,b.front],'reduced motion has no moving backdrop or effect layers');
}
console.log(`Native art v36 PASS: ${checks} checks; ${poses} native cells; ${rows} face/icon RGBA rows; real contact, Lycan ownership, five-slot geometry and three legendary worlds.`);
