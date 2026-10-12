import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,''));
const root=path.resolve(dir,'../../../..');
const kinds=['walk','attack','cast','ultimate','vfx','icons'];
const proof={id:'orfeu-unwritten-archon',direction:'redesign-short-white-hair-indigo-black-gold',measuredThreshold:24,kindCounts:{},frames:[],notes:['Measurement threshold only; RGBA pixels are never edited.','All native crops retain the exact source pixel rows.','True walk row order SOUTH/WEST/EAST/NORTH; no remap needed.','Ultimate physical palm contact is native index5.','Technical measurements are not user visual approval. Pose review is recorded separately; no claim of absolute anatomical perfection.']};
for(const kind of kinds){
 const m=JSON.parse(await fs.readFile(path.join(dir,kind+'-manifest.json'),'utf8'));
 const runtime=path.join(root,m.runtime);const selected=path.join(root,m.selected);
 const bytes=await fs.readFile(runtime);const original=await fs.readFile(selected);
 if(!bytes.equals(original))throw new Error(kind+' runtime differs from selected native source');
 const {data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 proof.kindCounts[kind]=m.frames.length;
 await fs.mkdir(path.join(dir,'native-crop-proof',kind),{recursive:true});
 for(let i=0;i<m.frames.length;i++){
  const f=m.frames[i];const {x,y,w,h}=f;
  if(x<0||y<0||x+w>info.width||y+h>info.height)throw new Error(kind+i+' bounds');
  const crop=await sharp(bytes).extract({left:x,top:y,width:w,height:h}).png().toBuffer();
  const rgba=await sharp(crop).ensureAlpha().raw().toBuffer();
  let edgeVisible=0,lowAlpha=0,zero=0,visible=0;
  for(let cy=0;cy<h;cy++){
   if(!data.subarray(((y+cy)*info.width+x)*4,((y+cy)*info.width+x+w)*4).equals(rgba.subarray(cy*w*4,(cy+1)*w*4)))throw new Error(kind+i+' pixels edited');
   for(let cx=0;cx<w;cx++){
    const a=rgba[(cy*w+cx)*4+3];if(a===0)zero++;else if(a<=24)lowAlpha++;else{visible++;if(cx===0||cy===0||cx===w-1||cy===h-1)edgeVisible++;}
   }
  }
  if(edgeVisible)throw new Error(kind+i+' visible clipped crop edge');
  const file=path.join(dir,'native-crop-proof',kind,i+'.png');await fs.writeFile(file,crop);
  const measurement=m.measurements[i];
  proof.frames.push({kind,index:i,crop:f,visibleBounds:measurement.visibleBounds,visibleCellEdge:measurement.visibleEdge,visibleCropEdge:edgeVisible,visiblePixels:visible,alphaZero:zero,retainedLowAlphaPixels:lowAlpha,rgbaRowsIdentical:true,sha256:crypto.createHash('sha256').update(crop).digest('hex')});
 }
}
proof.totalAtlasFrames=proof.frames.length;
await fs.mkdir(path.join(root,'docs/qa-v36'),{recursive:true});
await fs.writeFile(path.join(root,'docs/qa-v36/orfeu-art.json'),JSON.stringify(proof,null,2)+'\n');
console.log(JSON.stringify({kinds:proof.kindCounts,total:proof.totalAtlasFrames,visibleCellEdges:proof.frames.reduce((a,f)=>a+f.visibleCellEdge,0),visibleCropEdges:proof.frames.reduce((a,f)=>a+f.visibleCropEdge,0),nativePixelsPreserved:true}));
