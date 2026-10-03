// Native source copies and native crop measurements/exports only; no repaint/resize/filter.
import sharp from '../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import{mkdirSync,copyFileSync,readFileSync,writeFileSync}from'node:fs';import{createHash}from'node:crypto';import assert from'node:assert/strict';
const entries=JSON.parse(readFileSync(process.argv[2],'utf8')),hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
function cuts(arr,n){const out=[0];for(let i=1;i<n;i++){const e=arr.length*i/n,r=arr.length/n*.43,l=Math.max(out.at(-1)+1,Math.round(e-r)),b=Math.min(arr.length,Math.round(e+r));let min=Infinity;for(let j=l;j<b;j++)min=Math.min(min,arr[j]);assert.equal(min,0,'Each native cell needs a visible-alpha empty seam');let s=-1,runs=[];for(let j=l;j<=b;j++){if(j<b&&arr[j]===0){if(s<0)s=j;}else if(s>=0){runs.push([s,j-1]);s=-1;}}runs.sort((a,b)=>Math.abs((a[0]+a[1])/2-e)-Math.abs((b[0]+b[1])/2-e));const near=runs.filter(a=>a[1]-a[0]>=3);const run=near[0]||runs[0];out.push(Math.round((run[0]+run[1])/2));}out.push(arr.length);return out;}
for(const entry of entries){try{
 const{id,kind,source,cols,rows}=entry,dir=`art-source/v29/${id}`,runtimeDir=`public/assets/v29/${id}`,selected=`${dir}/${kind}-source.png`,runtime=`${runtimeDir}/${kind}.png`;mkdirSync(dir,{recursive:true});mkdirSync(runtimeDir,{recursive:true});copyFileSync(source,selected);copyFileSync(source,runtime);
 const{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});const{width:w,height:h}=info;let clear=0;const yy=new Uint32Array(h);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const a=data[(y*w+x)*4+3];if(a===0)clear++;if(a>24)yy[y]++;}
 const rowCuts=entry.rowCuts||cuts(yy,rows),frames=[],measurements=[];let ordinal=0;
 for(let row=0;row<rows;row++){const top=rowCuts[row],bottom=rowCuts[row+1],xx=new Uint32Array(w);for(let y=top;y<bottom;y++)for(let x=0;x<w;x++)if(data[(y*w+x)*4+3]>24)xx[x]++;const colCuts=entry.colCuts?.[row]||cuts(xx,cols);
  for(let col=0;col<cols;col++){
   const left=colCuts[col],right=colCuts[col+1];let x0=right,y0=bottom,x1=left,y1=top,n=0,edge=0;
   for(let y=top;y<bottom;y++)for(let x=left;x<right;x++)if(data[(y*w+x)*4+3]>24){n++;x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);if(x===left||x===right-1||y===top||y===bottom-1)edge++;}
   assert.ok(n>100,'Visible complete cell');assert.equal(edge,0,'Visible cell art cannot reach any measured boundary');
   const actor=!['icons','vfx'].includes(kind),cropLeft=Math.max(left,x0-8),cropTop=Math.max(top,y0-8),cropRight=Math.min(right,x1+9),cropBottom=Math.min(bottom,y1+9);
   let mass=0,mx=0;for(let y=Math.max(y0,y1-Math.round((y1-y0)*.05));y<=y1;y++)for(let x=x0;x<=x1;x++){const a=data[(y*w+x)*4+3];if(a>160){mass+=a;mx+=x*a;}}
   const override=entry.anchors?.[ordinal],anchorX=override?.[0]??(actor?Math.round(mx/mass*10)/10:(x0+x1)/2),anchorY=override?.[1]??(actor?y1:(y0+y1)/2);
   const crop={x:cropLeft,y:cropTop,w:cropRight-cropLeft,h:cropBottom-cropTop,anchorX,anchorY};frames.push(crop);
   measurements.push({i:ordinal,row,col,cell:{x:left,y:top,w:right-left,h:bottom-top},visibleBounds:{x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},visibleEdge:edge,visiblePixels:n,crop,headOrHatTop:actor?y0:undefined,groundSole:actor?anchorY:undefined,anchorMethod:override?'manual body/ground':actor?'foot-band alpha centroid and sole baseline':'motif center'});
   if(kind==='icons'){
    mkdirSync(`${runtimeDir}/icons`,{recursive:true});const dst=`${runtimeDir}/icons/${ordinal}.png`,rect={left:crop.x,top:crop.y,width:crop.w,height:crop.h};await sharp(source).extract(rect).png().toFile(dst);const raw=await sharp(dst).ensureAlpha().raw().toBuffer();for(let y=0;y<crop.h;y++)assert.ok(raw.subarray(y*crop.w*4,(y+1)*crop.w*4).equals(data.subarray(((crop.y+y)*w+crop.x)*4,((crop.y+y)*w+crop.x+crop.w)*4)),'All cropped icon RGBA rows match source');measurements.at(-1).individual={path:dst,sha256:hash(dst),allNativeRgbaPixelsPreserved:true};
   }ordinal++;
  }
 }
 assert.equal(frames.length,cols*rows);assert.ok(clear>w*h*.1,'Free background real alpha0');
 const manifest={id,kind,tool:'built-in image_gen',source,selected,runtime,width:w,height:h,cols,rows,sourceSha256:hash(source),selectedSha256:hash(selected),runtimeSha256:hash(runtime),byteIdenticalSourceCopies:hash(source)===hash(selected)&&hash(source)===hash(runtime),alphaThresholdForMeasurementOnly:24,backgroundAlphaZero:clear,rowCuts,frames,measurements};
 writeFileSync(`${dir}/${kind}-manifest.json`,JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify({id,kind,size:[w,h],count:frames.length,alphaZero:clear,sourceCopiesIdentical:manifest.byteIdenticalSourceCopies}));
}catch(error){process.exitCode=1;console.error(JSON.stringify({id:entry.id,kind:entry.kind,error:error.message}));}}
