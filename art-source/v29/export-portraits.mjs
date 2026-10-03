// Record original portrait provenance and native face crops. No art modifications.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{readFileSync,writeFileSync}from'node:fs';import{createHash}from'node:crypto';import assert from'node:assert/strict';
const entries=JSON.parse(readFileSync('art-source/v29/selected-portraits.json','utf8')),hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const e of entries){
 const path=`public/assets/v29/${e.id}/portrait.png`,selected=`art-source/v29/${e.id}/portrait-source.png`,face=JSON.parse(readFileSync(`art-source/v29/${e.id}/face-manifest.json`,'utf8'));
 assert.equal(hash(e.source),hash(path));assert.equal(hash(e.source),hash(selected));const{data,info}=await sharp(path).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=info;let clear=0,edge=0;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)clear++;if((x===0||x===w-1||y===0||y===h-1)&&a>24)edge++;}
 assert.equal(edge,0,'Full portrait silhouette stays inside canvas');assert.ok(clear>w*h*.2,'Free portrait background actualalpha0');
 const crop=face.faceCrop;writeFileSync(`art-source/v29/${e.id}/portrait-manifest.json`,JSON.stringify({id:e.id,tool:'built-in image_gen',source:e.source,selected,runtime:path,identityReference:e.identityReference,styleReference:'public/assets/v26/ava/ava-anime-portrait.png',width:w,height:h,sourceSha256:hash(e.source),selectedSha256:hash(selected),runtimeSha256:hash(path),sourceCopiesByteIdentical:true,freeAlphaZero:clear,visibleOuterEdge:edge,face:{path:face.face,crop:{x:crop.left,y:crop.top,w:crop.width,h:crop.height},sha256:face.faceSha256,allNativeRgbaPixelsPreserved:true}},null,2)+'\n');console.log(JSON.stringify({id:e.id,portrait:[w,h],freeAlphaZero:clear,edge,face:face.face}));
}
