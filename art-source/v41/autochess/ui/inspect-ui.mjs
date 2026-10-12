import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {decodeNative,inspectNative} from '../../../v39/autochess/items-and-fx/inspect-native.mjs';

const directory=path.dirname(fileURLToPath(import.meta.url));
const choices=JSON.parse(fs.readFileSync(path.join(directory,'selections.json'),'utf8'));
const records=[];
for(const choice of choices){
 const decoded=decodeNative(choice.source),inspection=inspectNative(choice.source,1,choice.id==='buttons'?2:1),{width,height,pixels}=decoded;
 const frames=inspection.cells.map(cell=>{
  const[x,y,w,h]=cell.visibleBounds;
  let zero=0,total=0,strong=0,sumAlpha=0,sumR=0,sumG=0,sumB=0,minAlpha=255,maxAlpha=0;
  const center={x:Math.floor(x+w*.28),y:Math.floor(y+h*.28),w:Math.floor(w*.44),h:Math.floor(h*.44)};
  for(let py=center.y;py<center.y+center.h;py++)for(let px=center.x;px<center.x+center.w;px++){
   const at=(py*width+px)*4,a=pixels[at+3];total++;if(!a)zero++;if(a>=16)strong++;sumAlpha+=a;minAlpha=Math.min(minAlpha,a);maxAlpha=Math.max(maxAlpha,a);sumR+=pixels[at];sumG+=pixels[at+1];sumB+=pixels[at+2];
  }
  return{...cell,center:{...center,zero,total,strong,zeroRatio:zero/total,meanAlpha:sumAlpha/total,minAlpha,maxAlpha,meanRGB:[sumR/total,sumG/total,sumB/total]}};
 });
 records.push({...inspection,id:choice.id,source:choice.source,centerKind:choice.center,frames});
}
fs.writeFileSync(path.join(directory,'inspection.json'),JSON.stringify({date:'2026-10-12',records},null,2)+'\n');
console.log(JSON.stringify(records.map(record=>({id:record.id,size:[record.width,record.height],alpha:record.alpha,frames:record.frames.map(frame=>({crop:frame.crop,visibleBounds:frame.visibleBounds,edgePixels:frame.edgePixels,edgeMaxAlpha:frame.edgeMaxAlpha,center:frame.center}))})),null,2));
