// Native RGBA crops only. No resize, repaint, alpha masking, or background removal.
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const jobs=JSON.parse(readFileSync(process.argv[2],'utf8'));
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
function cuts(arr,n){
 const out=[0]; for(let i=1;i<n;i++){
  const expected=arr.length*i/n,left=Math.max(out.at(-1)+1,Math.round(expected-arr.length/n*.4)),right=Math.min(arr.length,Math.round(expected+arr.length/n*.4)); let runs=[],start=-1;
  for(let x=left;x<=right;x++){if(x<right&&arr[x]===0){if(start<0)start=x;}else if(start>=0){runs.push([start,x-1]);start=-1;}}
  assert.ok(runs.length,'Every native icon needs an empty visible-alpha separator');
  runs.sort((a,b)=>Math.abs((a[0]+a[1])/2-expected)-Math.abs((b[0]+b[1])/2-expected));
  const run=runs.find(r=>r[1]-r[0]>=3)||runs[0];out.push(Math.round((run[0]+run[1])/2));
 } out.push(arr.length);return out;
}
for(const job of jobs){try{
 const {hero,source,cols,rows,ids}=job,dir='art-source/v36/skills/'+hero,runtime='public/assets/v36/skills/'+hero;
 mkdirSync(dir,{recursive:true});mkdirSync(runtime,{recursive:true});
 copyFileSync(source,dir+'/candidate-atlas.png');
 const {data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true}),{width:w,height:h}=info;
 let alphaZero=0;const yy=new Uint32Array(h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)alphaZero++;if(a>24)yy[y]++;}
 assert.ok(alphaZero>w*h*.1,'Real alpha0 outside independent icons');
 const rowCuts=cuts(yy,rows),frames=[],measurements=[];let ordinal=0;
 for(let row=0;row<rows;row++){
  const top=rowCuts[row],bottom=rowCuts[row+1],xx=new Uint32Array(w);
  for(let y=top;y<bottom;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>24)xx[x]++;
  const colCuts=cuts(xx,cols);
  for(let col=0;col<cols;col++){
   const left=colCuts[col],right=colCuts[col+1];let x0=right,y0=bottom,x1=left,y1=top,pixels=0,edges=0;
   for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(data[(y*w+x)*4+3]>24){
    pixels++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
    if(x===left||x===right-1||y===top||y===bottom-1)edges++;
   }
   if(ordinal>=ids.length){assert.equal(pixels,0,'Unused icon cell must stay empty');ordinal++;continue;}
   assert.ok(pixels>100,'Complete meaningful icon');assert.equal(edges,0,'No icon cutoffs at measured cell boundaries');
   const cx=Math.max(left,x0-8),cy=Math.max(top,y0-8),cr=Math.min(right,x1+9),cb=Math.min(bottom,y1+9),crop={x:cx,y:cy,w:cr-cx,h:cb-cy};
   frames.push(crop);measurements.push({id:ids[ordinal],index:ordinal,row,col,cell:{x:left,y:top,w:right-left,h:bottom-top},visibleBounds:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},visiblePixels:pixels,visibleEdgePixels:edges,crop});
   ordinal++;
  }
 }
 assert.equal(frames.length,ids.length);
 // No runtime publication until the entire family atlas passes.
 copyFileSync(source,dir+'/selected-atlas.png');
 for(const m of measurements){
  const {crop,id}=m,dst=runtime+'/'+id+'.png';await sharp(source).extract({left:crop.x,top:crop.y,width:crop.w,height:crop.h}).png().toFile(dst);
  const raw=await sharp(dst).ensureAlpha().raw().toBuffer();for(let y=0;y<crop.h;y++)assert.ok(raw.subarray(y*crop.w*4,(y+1)*crop.w*4).equals(data.subarray(((crop.y+y)*w+crop.x)*4,((crop.y+y)*w+crop.x+crop.w)*4)),'Each output RGBA row equals native source');
  m.runtime=dst;m.sha256=hash(dst);m.nativeRgbaPreserved=true;
 }
 const manifest={hero,tool:'built-in image_gen',source,sourceSha256:hash(source),selectedSha256:hash(dir+'/selected-atlas.png'),width:w,height:h,cols,rows,ids,rowCuts,backgroundAlphaZero:alphaZero,alphaThresholdForMeasurementOnly:24,frames,measurements};
 writeFileSync(dir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({hero,size:[w,h],icons:ids.length,alphaZero,nativePixels:true,edges:0}));
}catch(e){process.exitCode=1;console.error(JSON.stringify({hero:job.hero,error:e.message}));}}
