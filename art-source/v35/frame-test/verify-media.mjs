import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import sharp from '../../../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';

const base=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(base,'../../..');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const relative=file=>path.relative(root,file).replaceAll('\\','/');
function run(executable,args){const result=spawnSync(executable,args,{encoding:'utf8',windowsHide:true,maxBuffer:32*1024*1024});if(result.error||result.status!==0)throw new Error(result.error?.message||result.stderr);return result.stdout;}

export async function verifyMedia(manifestFile=path.join(base,'export-manifest.json')){
 const manifestPath=path.resolve(manifestFile),manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));
 assert.equal(manifest.fps,24,'native budget is 24fps');assert.equal(manifest.frameCount,48,'native budget is 48frames');assert.equal(manifest.durationSeconds,2,'native edit is exactly two seconds');assert.equal(manifest.frames.length,48,'48 individual PNGs are recorded');
 assert.ok(Array.isArray(manifest.playbackOrder),'recorded playback permutation exists');assert.equal(manifest.playbackOrder.length,48,'playback order has 48 entries');assert.ok(manifest.playbackOrder.every(index=>Number.isInteger(index)&&index>=0&&index<48),'playback indices stay inside the original source sequence');assert.equal(new Set(manifest.playbackOrder).size,48,'playback order contains every native frame exactly once');
 if(manifest.geometry.source){const configBytes=fs.readFileSync(path.join(root,manifest.geometry.source));assert.equal(hash(configBytes),manifest.geometry.sha256,'crop configuration remains unchanged after export');const config=JSON.parse(configBytes.toString('utf8'));assert.deepEqual(manifest.playbackOrder,config.playbackOrder||Array.from({length:48},(_,i)=>i),'recorded playback order matches the explicit configuration');assert.deepEqual(manifest.atlases.map(({file,width,height,cutsX,cutsY,crops})=>({file,width,height,cutsX,cutsY,crops})),config.atlases,'source geometry has not been shuffled by playback permutation');}
 const sourcePixels=new Map();
 for(const atlas of manifest.atlases){const source=path.join(root,atlas.source);assert.equal(hash(fs.readFileSync(source)),atlas.sourceSHA256,'selected atlas source remains unchanged');const{data,info}=await sharp(source).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,atlas.width,'source width remains measured');assert.equal(info.height,atlas.height,'source height remains measured');sourcePixels.set(atlas.file,{data,width:info.width});}
 const frameHashes=[];
 for(let index=0;index<48;index++){
  const frame=manifest.frames[index],png=fs.readFileSync(path.join(root,frame.file)),sourceIndex=manifest.playbackOrder[index],atlas=manifest.atlases[Math.floor(sourceIndex/12)],cell=sourceIndex%12;assert.equal(frame.index,index,'native PNGs remain sequential');assert.equal(frame.outputIndex,index,'output index is tracked explicitly');assert.equal(frame.sourceIndex,sourceIndex,'original source index is tracked explicitly');assert.equal(frame.atlas,atlas.file,'permutation uses the original source atlas');assert.equal(frame.cell,cell,'permutation uses the original cell');assert.deepEqual(frame.crop,atlas.crops[cell],'permutation never changes native crop geometry');assert.equal(frame.startSeconds,index/24,'native frame timing remains exact');assert.equal(frame.durationSeconds,1/24,'no added frame hold');assert.equal(hash(png),frame.pngSHA256,'native PNG file hash matches its export');
  const{data,info}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,manifest.width,'native frame width is unchanged');assert.equal(info.height,manifest.height,'native frame height is unchanged');assert.equal(hash(data),frame.rgbaSHA256,'native RGBA hash matches its source crop');
  const source=sourcePixels.get(frame.atlas),c=frame.crop;assert.ok(source,'recorded native source exists');
  for(let y=0;y<c.h;y++)assert.ok(data.subarray(y*c.w*4,(y+1)*c.w*4).equals(source.data.subarray(((c.y+y)*source.width+c.x)*4,((c.y+y)*source.width+c.x+c.w)*4)),'every exported RGBA row remains byte-identical to the native atlas');
  frameHashes.push(frame.rgbaSHA256);
 }
 assert.equal(new Set(frameHashes).size,48,'48 original painted RGBA frames are distinct');
 const video=path.join(root,manifest.output.video),poster=path.join(root,manifest.output.poster),first=path.join(root,manifest.frames[0].file);
 assert.equal(hash(fs.readFileSync(poster)),hash(fs.readFileSync(first)),'poster is byte-identical to frame000');
 const runtime=JSON.parse(fs.readFileSync(path.join(root,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
 const probe=JSON.parse(run(runtime.ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_type,codec_name,pix_fmt,width,height,r_frame_rate,avg_frame_rate,nb_read_frames,duration,time_base:format=duration,size','-of','json',video]));
 assert.equal(probe.streams.length,1,'the MP4 contains video only, without audio');const stream=probe.streams[0];assert.equal(stream.codec_type,'video');assert.equal(stream.codec_name,'h264');assert.equal(stream.pix_fmt,'yuv420p');
 assert.equal(stream.width,manifest.width,'encoder cannot resize the native frame');assert.equal(stream.height,manifest.height,'encoder cannot resize the native frame');assert.equal(stream.r_frame_rate,'24/1');assert.equal(stream.avg_frame_rate,'24/1');assert.equal(Number(stream.nb_read_frames),48,'encoder outputs exactly 48frames');assert.ok(Math.abs(Number(stream.duration)-2)<1e-6,'native video duration is two seconds');assert.ok(Math.abs(Number(probe.format.duration)-2)<1e-6,'MP4 container duration is two seconds');
 const timing=JSON.parse(run(runtime.ffprobe,['-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',video])).frames.map(frame=>Number(frame.best_effort_timestamp_time));
 assert.equal(timing.length,48,'all 48 decoded timestamps exist');for(let index=0;index<48;index++)assert.ok(Math.abs(timing[index]-index/24)<=1e-6,'timestamps advance exactly one native frame, without interpolation or holds');
 const decoded=run(runtime.ffmpeg,['-v','error','-i',video,'-map','0:v:0','-an','-fps_mode','passthrough','-f','framemd5','-']).split(/\r?\n/).filter(line=>line&&!line.startsWith('#')).map(line=>line.split(',').at(-1).trim());
 assert.equal(decoded.length,48,'full MP4 decode has 48frames');assert.equal(new Set(decoded).size,48,'all decoded frames remain distinct after lossy encoding');
 assert.equal(manifest.comparisons.transitions.length,47,'all adjacent painted frame changes are recorded');const expectedBoundaries=manifest.frames.slice(1).flatMap((frame,index)=>frame.atlas!==manifest.frames[index].atlas?[[index,index+1]]:[]);assert.deepEqual(manifest.comparisons.boundaries.map(t=>[t.from,t.to]),expectedBoundaries,'actual source-atlas boundaries are compared explicitly');
 const report={id:manifest.id,frameCount:48,paintedDistinctRGBAFrames:new Set(frameHashes).size,distinctDecodedFrames:new Set(decoded).size,fps:'24/1',durationSeconds:2,width:stream.width,height:stream.height,codec:stream.codec_name,pixelFormat:stream.pix_fmt,bytes:Number(probe.format.size),audioStreams:0,uniformNativeTimestamps:true,timestampsSeconds:timing,decodedFrameMD5:decoded,
  video:relative(video),videoSHA256:hash(fs.readFileSync(video)),poster:relative(poster),posterSHA256:hash(fs.readFileSync(poster)),posterByteIdenticalToFrame000:true,manifest:relative(manifestPath),manifestSHA256:hash(fs.readFileSync(manifestPath)),nativePNGCropsPixelExact:true,
  playbackOrder:manifest.playbackOrder,orderingReason:manifest.orderingReason,encode:manifest.encode,encodedPixelsLossless:false,interpolationUsed:false,resizeUsed:false,paddingUsed:false,duplicatedFrames:false,addedHolds:false,boundaries:manifest.comparisons.boundaries,
  comparisonMeaning:manifest.comparisons.meaning,visualReview:manifest.visualReview};
 fs.writeFileSync(path.join(base,'verification.json'),JSON.stringify(report,null,2)+'\n');return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){const report=await verifyMedia(process.argv[2]);console.log(JSON.stringify({frames:report.frameCount,distinctPaintedFrames:report.paintedDistinctRGBAFrames,distinctDecodedFrames:report.distinctDecodedFrames,fps:report.fps,seconds:report.durationSeconds,width:report.width,height:report.height,bytes:report.bytes,videoSHA256:report.videoSHA256,boundaries:report.boundaries}));}
