// Registry/provenance assembly only. Does not modify art or shared gameplay modules.
import{readFileSync,writeFileSync,existsSync}from'node:fs';import assert from'node:assert/strict';
const assets={},frames={},review=[];
for(const id of ['carmilla','beatriz','abel']){
 const base=`/assets/v29/${id}`;assets[`portrait_${id}`]=`${base}/portrait.png`;assets[`dlg_${id}`]=`${base}/portrait.png`;assets[`face_${id}`]=`${base}/face.png`;
 const portrait=JSON.parse(readFileSync(`art-source/v29/${id}/portrait-manifest.json`,'utf8'));assert.ok(portrait.sourceCopiesByteIdentical);assert.equal(portrait.visibleOuterEdge,0);
 for(const kind of ['walk','attack','cast','ultimate','vfx','icons']){
  if(id==='abel'&&kind==='walk')continue;
  const manifest=JSON.parse(readFileSync(`art-source/v29/${id}/${kind}-manifest.json`,'utf8'));
  const key=kind==='walk'?id:kind==='vfx'?`battle_fx_${id}`:kind==='icons'?`skill_icons_${id}`:`battle_${id}_${kind}`;
  assets[key]=`${base}/${kind}.png`;frames[key]=manifest.frames;assert.ok(manifest.byteIdenticalSourceCopies);assert.equal(manifest.frames.length,kind==='walk'?12:kind==='ultimate'?8:6);
  for(const[ordinal,crop]of manifest.frames.entries()){assert.ok(crop.x>=0&&crop.y>=0&&crop.x+crop.w<=manifest.width&&crop.y+crop.h<=manifest.height);assert.equal(manifest.measurements[ordinal].visibleEdge,0);assert.ok(crop.anchorX>=crop.x&&crop.anchorX<=crop.x+crop.w&&crop.anchorY>=crop.y&&crop.anchorY<=crop.y+crop.h);}
  if(kind==='icons')for(let i=0;i<6;i++){assets[`skill_icon_${id}_${i}`]=`${base}/icons/${i}.png`;assert.ok(manifest.measurements[i].individual.allNativeRgbaPixelsPreserved);}
  review.push({id,kind,size:[manifest.width,manifest.height],count:manifest.frames.length,backgroundAlphaZero:manifest.backgroundAlphaZero,allMeasuredCellsIsolated:true,nativeCopiesByteIdentical:true});
 }
}
for(const path of Object.values(assets))assert.ok(existsSync(`public${path}`));
const output=`import type {SpriteCrop} from './sprites';\n\n// v29 final native anime art. Source prompts and measurements: art-source/v29/{hero}.\n// Abel remains catalog/invocation art; this module introduces no playable data or stats.\nexport const REMAKE_ASSETS_CARMILLA_BEATRIZ_ABEL: Record<string,string> = ${JSON.stringify(assets,null,2)};\n\n// Walk order S/W/E/N, three poses each; neutral idle is the center pose (index 1).\n// Attack frame0 is quiet ready, VFX order impact/cut/protection/control/signature/ultimate.\nexport const REMAKE_FRAMES_CARMILLA_BEATRIZ_ABEL: Record<string,SpriteCrop[]> = ${JSON.stringify(frames,null,2)};\n`;
writeFileSync('lib/game/remakeArtCarmillaBeatrizAbel.ts',output);
const report={tool:'built-in image_gen',generatedSelectedImages:20,atlases:17,frames:Object.values(frames).reduce((n,f)=>n+f.length,0),assetKeys:Object.keys(assets).length,runtimeFiles:new Set(Object.values(assets)).size,nativeFaceCrops:3,nativeIndividualIconCrops:18,atlasReview:review,visualReview:'Reviewed full-body identities, mature proportions, hands/weapon grips, complete hats/boots/weapons, right-facing combat poses, S/W/E/N walk rows and semantic element motifs. Six rejected layouts were regenerated before selection. No claim of absolute anatomical perfection; root performs final composition QA.',preservedGameplay:'No stats, character availability, save, collision or gameplay module changed. In Aeternum Vive cost15% and proportional healing remain root-owned gameplay invariants.'};
writeFileSync('art-source/v29/carmilla-beatriz-abel-review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({atlases:report.atlases,frames:report.frames,assetKeys:report.assetKeys,runtimeFiles:report.runtimeFiles}));
