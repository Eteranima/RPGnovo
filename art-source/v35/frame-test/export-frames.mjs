import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';
import {verifyMedia} from './verify-media.mjs';

const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../../..');
const files=['a.png','b.png','c.png','d.png'],fps=24,count=48;
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const relative=file=>path.relative(root,file).replaceAll('\\','/');
const round=value=>Number(value.toFixed(6));
const positiveInteger=value=>Number.isInteger(value)&&value>0;

export function validatePlaybackOrder(order=Array.from({length:count},(_,i)=>i)){
 assert.ok(Array.isArray(order),'playbackOrder is an array');assert.equal(order.length,count,'playbackOrder contains exactly 48 source indices');
 const permutation=[...order];
 assert.ok(permutation.every(index=>Number.isInteger(index)&&index>=0&&index<count),'playbackOrder source indices are integers from 0 to 47');
 assert.equal(new Set(permutation).size,count,'playbackOrder is a permutation without duplicates or omitted native frames');
 return permutation;
}

function validateCuts(cuts,length,maximum,label){
 assert.equal(cuts.length,length,label+' has the expected boundary count');
 assert.ok(cuts.every(Number.isInteger),label+' contains integer native coordinates');
 assert.ok(cuts[0]>=0&&cuts.at(-1)<=maximum,label+' stays within the source');
 for(let i=1;i<cuts.length;i++)assert.ok(cuts[i]>cuts[i-1],label+' increases strictly');
}
function sourceCrop(rgba,width,crop){
 const result=Buffer.alloc(crop.w*crop.h*4);
 for(let y=0;y<crop.h;y++)rgba.copy(result,y*crop.w*4,((crop.y+y)*width+crop.x)*4,((crop.y+y)*width+crop.x+crop.w)*4);
 return result;
}
function transition(before,after){
 assert.equal(before.length,after.length,'transition images have identical native dimensions');
 let absolute=0,squared=0,changed=0;
 for(let pixel=0;pixel<before.length;pixel+=4){
  let maximum=0;
  for(let channel=0;channel<3;channel++){const delta=Math.abs(before[pixel+channel]-after[pixel+channel]);absolute+=delta;squared+=delta*delta;maximum=Math.max(maximum,delta);}
  if(maximum>8)changed++;
 }
 const pixels=before.length/4;
 return {rgbMAE:round(absolute/(pixels*3)),rgbRMSE:round(Math.sqrt(squared/(pixels*3))),pixelsChangedOver8:changed,pixelsChangedOver8Percent:round(changed/pixels*100)};
}
function median(values){const sorted=[...values].sort((a,b)=>a-b),middle=Math.floor(sorted.length/2);return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;}

/** Pure geometry proposal. Writing/using the proposal requires the caller to inspect the native atlases. */
async function geometryPlan(){
 const sources=[];
 for(const file of files){const info=await sharp(path.join(base,file)).metadata();assert.ok(positiveInteger(info.width)&&positiveInteger(info.height),'valid atlas dimensions');sources.push({file,width:info.width,height:info.height,cutsX:Array.from({length:5},(_,i)=>Math.round(i*info.width/4)),cutsY:Array.from({length:4},(_,i)=>Math.round(i*info.height/3))});}
 const minimumWidth=Math.min(...sources.flatMap(s=>s.cutsX.slice(1).map((cut,i)=>cut-s.cutsX[i]))),minimumHeight=Math.min(...sources.flatMap(s=>s.cutsY.slice(1).map((cut,i)=>cut-s.cutsY[i])));
 const unit=Math.min(Math.floor(minimumWidth/32),Math.floor(minimumHeight/18));assert.ok(unit>0,'native cells can contain a 16:9 even crop');
 const w=32*unit,h=18*unit;
 return {name:'Mika painted 48-frame test',fps,columns:4,rows:3,geometryMethod:'centered integer native crops; inspect before export',playbackOrder:validatePlaybackOrder(),orderingReason:'Original row-major source order.',atlases:sources.map(s=>({...s,crops:Array.from({length:12},(_,i)=>{const column=i%4,row=Math.floor(i/4);return{x:s.cutsX[column]+Math.floor((s.cutsX[column+1]-s.cutsX[column]-w)/2),y:s.cutsY[row]+Math.floor((s.cutsY[row+1]-s.cutsY[row]-h)/2),w,h};})}))};
}

export async function exportFrames(configFile){
 const configPath=configFile?path.resolve(configFile):path.join(base,'crop-config.json');
 const config=fs.existsSync(configPath)?JSON.parse(fs.readFileSync(configPath,'utf8')):null;
 const playbackOrder=validatePlaybackOrder(config?.playbackOrder);
 if(config){assert.equal(config.fps,fps,'config is exactly 24fps');assert.equal(config.columns,4,'config has four columns');assert.equal(config.rows,3,'config has three rows');assert.equal(config.atlases.length,4,'config has four source atlases');assert.deepEqual(config.atlases.map(s=>s.file),files,'atlas order is explicitly a,b,c,d');}
 const sources=[];let frameWidth,frameHeight;
 // Validate every source and crop before replacing any generated output.
 for(let atlas=0;atlas<files.length;atlas++){
  const file=files[atlas],source=path.join(base,file);assert.ok(fs.existsSync(source),'missing real atlas: '+file);
  const metadata=await sharp(source).metadata();assert.equal(metadata.depth,'uchar','native sources must be RGB/RGBA 8-bit, without depth conversion');assert.ok(!metadata.orientation||metadata.orientation===1,'source cannot require an implicit rotation');
  const {data:rgba,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.channels,4,'source has canonical native RGBA pixels');
  const specification=config?.atlases[atlas];
  if(specification){assert.equal(specification.width,info.width,file+' actual width matches measured config');assert.equal(specification.height,info.height,file+' actual height matches measured config');}
  else{assert.equal(info.width%4,0,file+' requires measured crop-config.json because width is not divisible by four');assert.equal(info.height%3,0,file+' requires measured crop-config.json because height is not divisible by three');}
  const cutsX=specification?.cutsX||Array.from({length:5},(_,i)=>i*info.width/4),cutsY=specification?.cutsY||Array.from({length:4},(_,i)=>i*info.height/3);
  validateCuts(cutsX,5,info.width,file+' cutsX');validateCuts(cutsY,4,info.height,file+' cutsY');
  const crops=specification?.crops||Array.from({length:12},(_,i)=>{const column=i%4,row=Math.floor(i/4);return{x:cutsX[column],y:cutsY[row],w:cutsX[column+1]-cutsX[column],h:cutsY[row+1]-cutsY[row]};});
  assert.equal(crops.length,12,file+' has exactly twelve native cells');
  for(let cell=0;cell<crops.length;cell++){
   const c=crops[cell],column=cell%4,row=Math.floor(cell/4);
   assert.ok(Number.isInteger(c.x)&&Number.isInteger(c.y)&&positiveInteger(c.w)&&positiveInteger(c.h),'crop coordinates and dimensions are integers');
   assert.ok(c.x>=cutsX[column]&&c.x+c.w<=cutsX[column+1]&&c.y>=cutsY[row]&&c.y+c.h<=cutsY[row+1],'native crop cannot include a neighboring cell');
   assert.equal(c.w%2,0,'H264 yuv420p width must be even; no automatic padding');assert.equal(c.h%2,0,'H264 yuv420p height must be even; no automatic padding');
   assert.ok(Math.abs(c.w/c.h-16/9)<.001,'native frame is 16:9 without resizing');
   frameWidth??=c.w;frameHeight??=c.h;assert.equal(c.w,frameWidth,'all native frame widths agree');assert.equal(c.h,frameHeight,'all native frame heights agree');
   const pixels=sourceCrop(rgba,info.width,c);for(let offset=3;offset<pixels.length;offset+=4)assert.equal(pixels[offset],255,'painted film cells have opaque interiors; alpha is never flattened');
  }
  sources.push({file,source,width:info.width,height:info.height,sourceSHA256:hash(fs.readFileSync(source)),cutsX,cutsY,crops,rgba});
 }
 const frameDirectory=path.join(base,'frames'),outputDirectory=path.join(root,'public/assets/v35/frame-test');fs.mkdirSync(frameDirectory,{recursive:true});fs.mkdirSync(outputDirectory,{recursive:true});
 const unexpected=fs.readdirSync(frameDirectory).filter(file=>/^frame-\d+\.png$/.test(file)&&!/^frame-0(?:[0-3]\d|4[0-7])\.png$/.test(file));assert.deepEqual(unexpected,[],'stale frame files are not silently deleted or included');
 const frames=[],nativeBuffers=[];
 for(let index=0;index<playbackOrder.length;index++){
   const sourceIndex=playbackOrder[index],atlas=Math.floor(sourceIndex/12),cell=sourceIndex%12,s=sources[atlas],c=s.crops[cell],destination=path.join(frameDirectory,'frame-'+String(index).padStart(3,'0')+'.png');
   const expected=sourceCrop(s.rgba,s.width,c),png=await sharp(s.source).extract({left:c.x,top:c.y,width:c.w,height:c.h}).ensureAlpha().png({compressionLevel:9,adaptiveFiltering:false}).toBuffer();
   const actual=await sharp(png).ensureAlpha().raw().toBuffer();assert.ok(expected.equals(actual),'export preserves every selected native RGBA byte');fs.writeFileSync(destination,png);nativeBuffers.push(expected);
   frames.push({index,outputIndex:index,sourceIndex,atlas:s.file,cell,column:cell%4,row:Math.floor(cell/4),crop:c,file:relative(destination),rgbaSHA256:hash(expected),pngSHA256:hash(png),allNativePixelsPreserved:true,startSeconds:index/fps,durationSeconds:1/fps});
 }
 assert.equal(frames.length,count,'exactly 48 painted native frames');assert.equal(new Set(frames.map(frame=>frame.rgbaSHA256)).size,count,'all 48 native cells must be pixel-distinct; no duplicate padding');
 const transitions=nativeBuffers.slice(1).map((buffer,i)=>({from:i,to:i+1,fromSourceIndex:playbackOrder[i],toSourceIndex:playbackOrder[i+1],boundary:frames[i].atlas!==frames[i+1].atlas,...transition(nativeBuffers[i],buffer)}));
 const baseline=median(transitions.filter(t=>!t.boundary).map(t=>t.rgbMAE));
 for(const t of transitions){t.ratioToWithinAtlasMedian=baseline>0?round(t.rgbMAE/baseline):null;t.requiresVisualAttention=t.boundary&&t.rgbMAE>6&&(baseline===0||t.rgbMAE/baseline>=2.5);}
 const poster=path.join(outputDirectory,'mika-poster.png');fs.copyFileSync(path.join(frameDirectory,'frame-000.png'),poster);
 const manifest={version:35,id:'mika-frame-test',fps,frameCount:count,durationSeconds:count/fps,width:frameWidth,height:frameHeight,
  playbackOrder,orderingReason:config?.orderingReason||'Original row-major source order.',
  geometry:config?{source:relative(configPath),sha256:hash(fs.readFileSync(configPath)),method:config.geometryMethod||'explicit measured native cuts'}:{method:'exact equal 4x3 native grid, zero gutter'},
  atlases:sources.map(({rgba,source,...s})=>({...s,source:relative(source),columns:4,rows:3})),frames,
  comparisons:{unit:'RGB byte intensity 0..255; maximum-channel pixel threshold 8',withinAtlasMedianRGBMAE:round(baseline),attentionThreshold:{minimumRGBMAE:6,ratioToWithinAtlasMedian:2.5},transitions,boundaries:transitions.filter(t=>t.boundary),meaning:'Supplemental discontinuity indicators only. Pixel differences do not prove anatomy, identity, acting, or motion continuity.'},
  output:{video:'public/assets/v35/frame-test/mika.mp4',poster:relative(poster),posterSHA256:hash(fs.readFileSync(poster)),posterByteIdenticalToFrame000:true},
  transformation:{nativeCropsOnly:true,resized:false,padded:false,repainted:false,interpolated:false,duplicatedFrames:false,addedHolds:false,encodedRGBAPixelsLossless:false},
  encode:{codec:'libx264',pixelFormat:'yuv420p',crf:16,preset:'slow',fpsMode:'passthrough',inputFramerate:fps,videoTrackTimescale:24000,audio:false},
  visualReview:{status:'quality-limited-experiment',report:'docs/qa-v35/visual-review.md',scope:'Independent visual audit of native cells and seams. This frame test is not a production-quality animation approval.'}};
 fs.writeFileSync(path.join(base,'export-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 const runtime=JSON.parse(fs.readFileSync(path.join(root,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
 const args=['-y','-hide_banner','-v','error','-framerate',String(fps),'-start_number','0','-i',path.join(frameDirectory,'frame-%03d.png'),'-frames:v',String(count),'-an','-c:v','libx264','-preset','slow','-crf','16','-pix_fmt','yuv420p','-fps_mode','passthrough','-movflags','+faststart','-movie_timescale','24000','-video_track_timescale','24000',path.join(outputDirectory,'mika.mp4')];
 const result=spawnSync(runtime.ffmpeg,args,{encoding:'utf8',windowsHide:true,maxBuffer:8*1024*1024});if(result.error||result.status!==0)throw new Error(result.error?.message||result.stderr);
 return verifyMedia(path.join(base,'export-manifest.json'));
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 if(process.argv.includes('--plan'))console.log(JSON.stringify(await geometryPlan(),null,2));
 else{const index=process.argv.indexOf('--config'),report=await exportFrames(index>=0?process.argv[index+1]:undefined);console.log(JSON.stringify({frames:report.frameCount,width:report.width,height:report.height,fps:report.fps,durationSeconds:report.durationSeconds,distinctDecodedFrames:report.distinctDecodedFrames,video:report.video,boundaryAttention:report.boundaries.filter(t=>t.requiresVisualAttention).map(t=>`${t.from}→${t.to}`)}));}
}
