import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from '../../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
const dir=path.dirname(new URL(import.meta.url).pathname.replace(/^\/(?=[A-Za-z]:)/,''));
const root=path.resolve(dir,'../../../..');
const file=path.join(dir,'redesign-body-entries.json');
const entries=JSON.parse(await fs.readFile(file,'utf8'));
// Manually identified boot ROIs in the original native crop. No pixels are edited.
const bootRegions={attack:{2:[[60,350,62,74],[279,374,71,64]]},cast:{2:[[10,378,70,53],[357,377,79,33]],3:[[8,382,57,69],[340,370,72,68]]},ultimate:{2:[[9,298,64,63],[303,282,56,54]],3:[[10,364,75,68],[250,357,61,77]],4:[[17,339,75,57],[213,322,64,38]],5:[[10,341,50,69],[273,312,69,56]]}};
const manualFootAnchors={};
for(const entry of entries){
 const m=JSON.parse(await fs.readFile(path.join(dir,entry.kind+'-manifest.json'),'utf8'));
 const {data,info}=await sharp(entry.source).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(const [index,regions] of Object.entries(bootRegions[entry.kind]??{})){
  const f=m.frames[Number(index)],centers=[];
  for(const [left,top,width,height] of regions){let mass=0,mx=0;
   for(let y=f.y+top;y<f.y+top+height;y++)for(let x=f.x+left;x<f.x+left+width;x++){
    const a=data[(y*info.width+x)*4+3];if(a>160){mass+=a;mx+=x*a;}
   }
   if(!mass)throw new Error('Boot ROI missing '+entry.kind+index);
   centers.push(mx/mass);
  }
  const anchorX=Math.round((centers[0]+centers[1])/2*10)/10,anchorY=f.anchorY;
  entry.anchors??=[];entry.anchors[Number(index)]=[anchorX,anchorY];
  manualFootAnchors[entry.kind]??={};manualFootAnchors[entry.kind][index]={anchorX,anchorY,method:'Equal average of the two manually identified boot alpha centroids; lowest sole retained as ground baseline',nativeCropBootROIs:regions};
 }
 if(entry.kind==='cast')entry.colCuts=[[0,487,954,1536],[0,575,1025,1536]];
}
await fs.writeFile(file,JSON.stringify(entries,null,2)+'\n');
await fs.writeFile(path.join(dir,'manual-foot-anchor-review.json'),JSON.stringify({id:'orfeu-unwritten-archon',manualFootAnchors,reason:'Lowest-only foot-band in wide lunges selects one foot and displaces the body axis. The same exact pixels are anchored between both boots.'},null,2)+'\n');
console.log(JSON.stringify({manualBootAnchors:manualFootAnchors,castRow1Cuts:[0,575,1025,1536]}));
