import {spawn} from 'node:child_process';
import {createReadStream} from 'node:fs';
import {access,copyFile,mkdir,readFile,rename,stat,writeFile} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import {dirname,isAbsolute,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';

const HERE=dirname(fileURLToPath(import.meta.url));
const REPO=resolve(HERE,'../../..');
export const OPENING_FPS=24;
export const SHOT_FRAMES=Object.freeze([144,...Array(10).fill(120),156]);
export const OPENING_FRAMES=1500;
export const OPENING_SECONDS=62.5;
export const CLOUDFLARE_ASSET_MAX_BYTES=25*1024*1024;
export const DELIVERY_MAX_BYTES=24*1024*1024;
export const VIDEO_BITRATE=2_800_000;
const VIDEO_BUFFER_BITS=VIDEO_BITRATE*2;
const ESTIMATED_MUX_RESERVE_BYTES=1024*1024;
const CLOUD_LIMIT_SOURCE='https://developers.cloudflare.com/workers/platform/limits/';
const SIZE_OPTIONS=[[1280,720],[1920,1080]];

/** Bitrate planning is an estimate; only the measured MP4 size can pass the delivery gate. */
export function deliveryBudget(bytes){
 assert.ok(Number.isSafeInteger(bytes)&&bytes>0,'Delivery size must be a positive integer byte count.');
 assert.ok(bytes<=DELIVERY_MAX_BYTES,`Delivery is ${bytes} bytes, above the ${DELIVERY_MAX_BYTES}-byte (24 MiB) budget. Keep all 1,500 frames, 24 fps and approved resolution; review compression before exporting again.`);
 return {bytes,maxBytes:DELIVERY_MAX_BYTES,remainingBytes:DELIVERY_MAX_BYTES-bytes,cloudflareMaxBytes:CLOUDFLARE_ASSET_MAX_BYTES,cloudflareMarginBytes:CLOUDFLARE_ASSET_MAX_BYTES-bytes,limitSource:CLOUD_LIMIT_SOURCE};
}
export function encodingPlan(){
 const estimatedVideoBytes=Math.ceil(VIDEO_BITRATE*OPENING_SECONDS/8);
 return {codec:'libx264',passes:2,preset:'slow',bitrateBitsPerSecond:VIDEO_BITRATE,maxrateBitsPerSecond:VIDEO_BITRATE,bufferBits:VIDEO_BUFFER_BITS,estimatedVideoBytes,estimatedMuxReserveBytes:ESTIMATED_MUX_RESERVE_BYTES,estimatedTotalBytes:estimatedVideoBytes+ESTIMATED_MUX_RESERVE_BYTES,deliveryMaxBytes:DELIVERY_MAX_BYTES,cloudflareMaxBytes:CLOUDFLARE_ASSET_MAX_BYTES,frames:OPENING_FRAMES,fps:OPENING_FPS,seconds:OPENING_SECONDS,sizeEstimateIsApproval:false};
}

function sourceWindow(segment){
 assert.equal(typeof segment.path,'string','Each segment needs an original local video path.');
 assert.ok(segment.path.length&&!/^[a-z][a-z0-9+.-]*:\/\//i.test(segment.path),'Sources must be local files, not remote URLs.');
 assert.ok(Number.isFinite(segment.startSeconds)&&segment.startSeconds>=0,'startSeconds must be a nonnegative number.');
 assert.ok(Number.isInteger(segment.frames)&&segment.frames>0,'A segment needs a positive integer frame count.');
 if(segment.sourceSHA256!==undefined)assert.match(segment.sourceSHA256,/^[a-f0-9]{64}$/,'An approved source hash must be a lowercase SHA-256.');
}
export function shotSegments(shot){
 return shot.segments||[{path:shot.path,startSeconds:shot.startSeconds,frames:shot.frames,...(shot.sourceSHA256?{sourceSHA256:shot.sourceSHA256}:{})}];
}

export function fraction(value){
 const [n,d=1]=String(value).split('/').map(Number);
 return Number.isFinite(n)&&Number.isFinite(d)&&d!==0?n/d:NaN;
}
export function validateManifest(manifest){
 assert.equal(manifest.fps,OPENING_FPS,'The opening must use 24 fps.');
 assert.ok(SIZE_OPTIONS.some(([w,h])=>manifest.width===w&&manifest.height===h),'Use 1280×720 or 1920×1080.');
 assert.equal(manifest.shots?.length,12,'Exactly twelve authored video shots are required.');
 const ids=new Set();
 manifest.shots.forEach((shot,index)=>{
  assert.match(shot.id||'',/^[a-z0-9][a-z0-9-]{0,63}$/,'Shot IDs must be simple local identifiers.');
  assert.ok(!ids.has(shot.id),`Duplicate shot ID: ${shot.id}`);ids.add(shot.id);
  assert.equal(shot.frames,SHOT_FRAMES[index],`Shot ${index+1} must contain ${SHOT_FRAMES[index]} frames.`);
  if(shot.segments){
   assert.ok(shot.path===undefined&&shot.startSeconds===undefined,'Use either a single window or segments, not both.');
   assert.ok(Array.isArray(shot.segments)&&shot.segments.length>0&&shot.segments.length<=12,'A montage must contain 1–12 real segments.');
  }
  const segments=shotSegments(shot);segments.forEach(sourceWindow);
  assert.equal(segments.reduce((sum,segment)=>sum+segment.frames,0),shot.frames,`${shot.id} segments must equal its authored frame count.`);
 });
 assert.equal(manifest.shots.reduce((n,shot)=>n+shot.frames,0),OPENING_FRAMES);
 return manifest;
}

/** Select distinct decoded source frames near the real 24 fps time grid. Never synthesize missing frames. */
export function selectSourceFrames(timestamps,startSeconds,count){
 assert.ok(timestamps.length,'The source has no decoded video frames.');
 const first=timestamps[0],times=timestamps.map(time=>time-first);
 times.forEach((time,index)=>assert.ok(Number.isFinite(time)&&(index===0||time>times[index-1]),'Source timestamps must increase strictly.'));
 const selected=[];let cursor=0;
 for(let i=0;i<count;i++){
  const target=startSeconds+i/OPENING_FPS;
  while(cursor+1<times.length&&Math.abs(times[cursor+1]-target)<=Math.abs(times[cursor]-target))cursor++;
  assert.ok(Math.abs(times[cursor]-target)<=1/(OPENING_FPS*2)+.0001,`Source is missing a real frame near ${target.toFixed(6)} seconds.`);
  assert.ok(!selected.length||cursor>selected.at(-1).sourceIndex,'This clip cannot supply distinct frames at 24 fps; regenerate it rather than padding.');
  selected.push({sourceIndex:cursor,sourceTime:timestamps[cursor],relativeTime:times[cursor],outputTime:i/OPENING_FPS});
 }
 return selected;
}

function insideRepo(path,label){
 const absolute=resolve(path),rel=relative(REPO,absolute);
 assert.ok(rel&&!rel.startsWith('..')&&!isAbsolute(rel),`${label} must stay inside ${REPO}.`);
 return absolute;
}
const displayPath=path=>relative(REPO,path).replaceAll('\\','/');
async function exists(path){try{await access(path);return true;}catch{return false;}}
async function sha256(path){const hash=createHash('sha256');for await(const bytes of createReadStream(path))hash.update(bytes);return hash.digest('hex');}
async function json(path){return JSON.parse((await readFile(path,'utf8')).replace(/^\uFEFF/,''));}
async function saveJSON(path,value){await mkdir(dirname(path),{recursive:true});await writeFile(path,JSON.stringify(value,null,2)+'\n');}

/** Argument arrays and shell:false keep paths, Unicode names and filters out of shell evaluation. */
async function run(executable,args,{log,maxBytes=32*1024*1024}={}){
 return new Promise((ok,fail)=>{
  const child=spawn(executable,args,{cwd:REPO,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',bytes=0,overflow=false;
  child.stdout.on('data',buffer=>{bytes+=buffer.length;if(bytes>maxBytes){overflow=true;child.kill();return;}stdout+=buffer.toString('utf8');});
  child.stderr.on('data',buffer=>{stderr+=buffer.toString('utf8');if(stderr.length>4*1024*1024)stderr=stderr.slice(-4*1024*1024);});
  child.on('error',fail);
  child.on('close',async code=>{
   try{if(log)await writeFile(log,JSON.stringify({executable:displayPath(executable),args},null,2)+'\n\n'+stderr);}
   catch(error){fail(error);return;}
   if(overflow)fail(new Error('Video inspection exceeded the bounded output size.'));
   else if(code!==0)fail(new Error(`Video tool exited ${code}: ${stderr.slice(-6000)}`));
   else ok(stdout);
  });
 });
}

async function tools(options){
 let ffmpeg=options.ffmpeg,ffprobe=options.ffprobe,provenance=null;
 assert.ok(Boolean(ffmpeg)===Boolean(ffprobe),'Provide both --ffmpeg and --ffprobe, or neither.');
 const portable=join(REPO,'.agents/v33-ffmpeg/runtime.json');
 if(!ffmpeg&&await exists(portable)){
  provenance=await json(portable);ffmpeg=provenance.ffmpeg;ffprobe=provenance.ffprobe;
  assert.equal(await sha256(ffmpeg),provenance.ffmpegSHA256,'Portable FFmpeg no longer matches the verified vendor package.');
  assert.equal(await sha256(ffprobe),provenance.ffprobeSHA256,'Portable FFprobe no longer matches the verified vendor package.');
 }
 ffmpeg ||= 'ffmpeg';ffprobe ||= 'ffprobe';
 const ffmpegVersion=await run(ffmpeg,['-version']),ffprobeVersion=await run(ffprobe,['-version']);
 return {ffmpeg,ffprobe,provenance,ffmpegVersion:ffmpegVersion.split(/\r?\n/)[0],ffprobeVersion:ffprobeVersion.split(/\r?\n/)[0]};
}
async function probe(tool,path,frames=false){
 const args=['-v','error','-count_frames','-show_streams','-show_format'];
 if(frames)args.push('-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time,duration_time:stream:format');
 args.push('-of','json',path);
 return JSON.parse(await run(tool.ffprobe,args));
}

export function verifyVideo(metadata,expected){
 const videos=metadata.streams.filter(stream=>stream.codec_type==='video'),audio=metadata.streams.filter(stream=>stream.codec_type==='audio');
 assert.equal(videos.length,1,'Export must contain exactly one video stream.');assert.equal(audio.length,0,'Page MusicDirector owns audio; export must be silent.');
 const video=videos[0];
 assert.ok(SIZE_OPTIONS.some(([w,h])=>video.width===w&&video.height===h),'Export must retain approved native 1280×720 or 1920×1080 dimensions.');
 assert.equal(Number(video.nb_frames),expected.frames,'Container frame count differs from the authored timeline.');
 assert.equal(Number(video.nb_read_frames),expected.frames,'Actual decoded frame count differs from the authored timeline.');
 assert.equal(fraction(video.r_frame_rate),OPENING_FPS,'r_frame_rate is not 24.');
 assert.equal(fraction(video.avg_frame_rate),OPENING_FPS,'avg_frame_rate is not 24.');
 assert.equal(video.width,expected.width);assert.equal(video.height,expected.height);
 assert.ok(Math.abs(Number(video.duration)-expected.frames/OPENING_FPS)<.00001,'Video duration does not equal frames ÷ 24.');
 assert.ok(Math.abs(Number(metadata.format.duration)-expected.frames/OPENING_FPS)<.00001,'Container duration does not match the timeline.');
 if(video.duration_ts!==undefined)assert.equal(Number(video.duration_ts)*fraction(video.time_base),expected.frames/OPENING_FPS,'Integer stream duration does not match the exact timeline.');
 if(metadata.frames){
  assert.equal(metadata.frames.length,expected.frames,'Decoded timestamp count differs from the timeline.');
  metadata.frames.forEach((frame,index)=>assert.ok(Math.abs(Number(frame.best_effort_timestamp_time)-index/OPENING_FPS)<.000001,`Decoded frame ${index} is outside the uniform 24 fps clock.`));
 }
 assert.equal(video.pix_fmt,'yuv420p','Browser export must use yuv420p.');
 return video;
}

async function inspectSegment(tool,shot,manifest,manifestPath,usedFrames){
 const path=resolve(dirname(manifestPath),shot.path);
 assert.ok(!/(^|\/)rejected(\/|$)/i.test(path.replaceAll('\\','/')),'Rejected footage is excluded from the opening, even if it meets technical metadata.');
 assert.ok((await stat(path)).isFile(),`Source is not a regular local file: ${shot.path}`);
 const metadata=await probe(tool,path,true),video=metadata.streams.find(stream=>stream.codec_type==='video');
 assert.ok(video,`No video stream: ${shot.id}`);
 assert.ok(fraction(video.avg_frame_rate)>=OPENING_FPS-.000001,`${shot.id} source is below 24 fps; do not duplicate it to fill the timeline.`);
 assert.ok(video.width>=manifest.width&&video.height>=manifest.height,`${shot.id} is too small for native ${manifest.width}×${manifest.height}; upscaling is disabled.`);
 assert.ok(!video.sample_aspect_ratio||video.sample_aspect_ratio==='1:1','Anamorphic source needs a separately approved export.');
 const duration=Number(video.duration||metadata.format.duration);
 assert.ok(duration+.00001>=shot.startSeconds+shot.frames/OPENING_FPS,`${shot.id} is shorter than its authored window.`);
 const selected=selectSourceFrames(metadata.frames.map(frame=>Number(frame.best_effort_timestamp_time)),shot.startSeconds,shot.frames);
 const sourceHash=await sha256(path);
 if(shot.sourceSHA256)assert.equal(sourceHash,shot.sourceSHA256,`${shot.id} differs from its visually approved source hash.`);
 const rejectedFile=join(HERE,'rejected-sources.json');
 if(await exists(rejectedFile))assert.ok(!(await json(rejectedFile)).sources.some(source=>source.sha256===sourceHash),`${shot.id} matches footage explicitly rejected by visual review; renaming does not approve it.`);
 const prior=usedFrames.get(sourceHash)||new Set();
 for(const frame of selected){assert.ok(!prior.has(frame.sourceIndex),`Source frame reused across shots: ${shot.id}/${frame.sourceIndex}`);prior.add(frame.sourceIndex);}
 usedFrames.set(sourceHash,prior);
 return {id:shot.id,path,sourcePath:displayPath(path),sourceSHA256:sourceHash,sourceBytes:(await stat(path)).size,startSeconds:shot.startSeconds,frames:shot.frames,durationSeconds:shot.frames/OPENING_FPS,sourceVideo:video,selected};
}

async function inspectShot(tool,shot,manifest,manifestPath,usedFrames){
 const segments=[];
 for(const [index,segment] of shotSegments(shot).entries())segments.push(await inspectSegment(tool,{...segment,id:`${shot.id}-segment-${String(index+1).padStart(2,'0')}`},manifest,manifestPath,usedFrames));
 return {id:shot.id,frames:shot.frames,durationSeconds:shot.frames/OPENING_FPS,segments};
}

export function sourceSelectionFilter(indices){
 assert.ok(indices.length&&indices.every((n,i)=>Number.isInteger(n)&&n>=0&&(!i||n>indices[i-1])),'Select distinct increasing native indices.');
 const runs=[];let first=indices[0],last=first;
 for(const next of indices.slice(1)){if(next===last+1){last=next;continue;}runs.push([first,last]);first=last=next;}runs.push([first,last]);
 let nodes=runs.map(([start,end])=>start===end?`eq(n,${start})`:`between(n,${start},${end})`);
 // A balanced expression also handles sparse footage without reaching FFmpeg's parser depth limit.
 while(nodes.length>1)nodes=Array.from({length:Math.ceil(nodes.length/2)},(_,i)=>nodes[i*2+1]?`(${nodes[i*2]}+${nodes[i*2+1]})`:nodes[i*2]);
 return `select='${nodes[0]}'`;
}
const selectFilter=sourceSelectionFilter;
const spatialFilter=manifest=>[`scale=${manifest.width}:${manifest.height}:force_original_aspect_ratio=increase:flags=lanczos`,`crop=${manifest.width}:${manifest.height}`,'setsar=1','format=yuv420p'].join(',');

export function encodePassArguments(shot,manifest,destination,passLog){
 assert.ok(SIZE_OPTIONS.some(([w,h])=>manifest.width===w&&manifest.height===h),'Encoding retains an approved resolution.');
 assert.equal(shot.selected.length,shot.frames,'Encoding must keep every selected real source frame.');
 assert.ok(shot.selected.every((frame,index)=>Number.isInteger(frame.sourceIndex)&&frame.sourceIndex>=0&&(index===0||frame.sourceIndex>shot.selected[index-1].sourceIndex)),'Encoding source indices must be strictly increasing.');
 // Two passes read the original source using the same real frames and static crop. No intermediate lossy re-encode.
 const filter=[selectFilter(shot.selected.map(frame=>frame.sourceIndex)),'settb=1/24','setpts=N',spatialFilter(manifest)].join(',');
 const common=['-hide_banner','-nostdin','-y','-i',shot.path,'-map','0:v:0','-an','-sn','-dn','-map_metadata','-1','-vf',filter,'-fps_mode','passthrough','-enc_time_base','1:24','-frames:v',String(shot.frames),'-c:v','libx264','-preset','slow','-b:v',String(VIDEO_BITRATE),'-maxrate',String(VIDEO_BITRATE),'-bufsize',String(VIDEO_BUFFER_BITS),'-profile:v','high','-level:v','4.1','-pix_fmt','yuv420p','-g','48','-keyint_min','48','-sc_threshold','0','-passlogfile',passLog];
 return {filter,first:[...common,'-pass','1','-f','null','-'],second:[...common,'-pass','2','-movie_timescale','24000','-video_track_timescale','24000','-movflags','+faststart',destination]};
}
function withoutMovieTimescale(args){return args.filter((arg,index)=>arg!=='-movie_timescale'&&args[index-1]!=='-movie_timescale');}
async function packetClock(tool,path,expectedFrames){
 const metadata=JSON.parse(await run(tool.ffprobe,['-v','error','-show_packets','-select_streams','v:0','-show_data_hash','sha256','-show_entries','packet=pts,duration,data_hash','-of','json',path]));
 const packets=metadata.packets.sort((a,b)=>Number(a.pts)-Number(b.pts));
 assert.equal(packets.length,expectedFrames,'Lossless recovery must retain every H.264 packet.');
 packets.forEach((packet,index)=>{assert.equal(Number(packet.pts),index*1000,'Packet PTS must stay on the exact 24 fps clock.');assert.equal(Number(packet.duration),1000,'Packet duration must be exactly one frame.');});
 return packets.map(packet=>packet.data_hash);
}
async function reuseSegment(tool,shot,manifest,work,basename,destination,passes){
 const logged=(await readFile(join(work,`${basename}-pass-2.log`),'utf8')).split(/\r?\n\r?\n/)[0];
 const previous=JSON.parse(logged);
 // Only the MP4 header timebase changed; encoded pixels and the pinned source window must match.
 assert.deepEqual(withoutMovieTimescale(previous.args),withoutMovieTimescale(passes.second),`Cannot resume ${basename}: the previous encode used different source frames or parameters.`);
 const expected={frames:shot.frames,width:manifest.width,height:manifest.height};
 let clockRemux=null;
 try{verifyVideo(await probe(tool,destination,true),expected);}
 catch(error){
  // Millisecond movie headers can truncate a 26/24s edit list. Preserve all H.264 packets;
  // never repair a wrong frame count, missing frame or an irregular timestamp with a remux.
  const priorHash=await sha256(destination),priorPackets=await packetClock(tool,destination,shot.frames);
  const corrected=join(work,`${basename}-clock-recovered.mp4`);
  const args=['-hide_banner','-nostdin','-y','-i',destination,'-map','0:v:0','-c:v','copy','-an','-sn','-dn','-map_metadata','-1','-movie_timescale','24000','-video_track_timescale','24000','-movflags','+faststart',corrected];
  await run(tool.ffmpeg,args,{log:join(work,`${basename}-clock-recovery.log`)});
  verifyVideo(await probe(tool,corrected,true),expected);
  assert.deepEqual(await packetClock(tool,corrected,shot.frames),priorPackets,'Lossless clock recovery changed an H.264 packet.');
  await copyFile(destination,join(work,`${basename}-before-clock-recovery.mp4`));await rename(corrected,destination);
  clockRemux={reason:error.message,previousSHA256:priorHash,packetPayloadsUnchanged:true,movieTimescale:24000};
 }
 console.log(`Reusing ${basename}: ${shot.frames} verified real frames${clockRemux?' (lossless header recovery)':''}.`);
 return {destination,sha256:await sha256(destination),filter:passes.filter,args:previous.args,encoding:encodingPlan(),reused:true,clockRemux};
}
async function encodeSegment(tool,shot,manifest,work,basename,resume=false){
 const destination=join(work,`${basename}.mp4`);
 const passes=encodePassArguments(shot,manifest,destination,join(work,`${basename}-x264`));
 if(resume&&await exists(destination))return reuseSegment(tool,shot,manifest,work,basename,destination,passes);
 await run(tool.ffmpeg,passes.first,{log:join(work,`${basename}-pass-1.log`)});
 await run(tool.ffmpeg,passes.second,{log:join(work,`${basename}-pass-2.log`)});
 verifyVideo(await probe(tool,destination),{frames:shot.frames,width:manifest.width,height:manifest.height});
 return {destination,sha256:await sha256(destination),filter:passes.filter,args:passes.second,encoding:encodingPlan()};
}

async function concatVideos(tool,paths,destination,work,name){
 const concat=join(work,`${name}.ffconcat`);
 await writeFile(concat,'ffconcat version 1.0\n'+paths.map(path=>`file '${relative(work,path).replaceAll('\\','/')}'`).join('\n')+'\n');
 const args=['-hide_banner','-nostdin','-y','-f','concat','-safe','1','-i',concat,'-map','0:v:0','-c:v','copy','-an','-sn','-dn','-map_metadata','-1','-movie_timescale','24000','-video_track_timescale','24000','-movflags','+faststart',destination];
 await run(tool.ffmpeg,args,{log:join(work,`${name}-concat.log`)});
 return args;
}

async function encodeShot(tool,shot,manifest,work,index,resume=false){
 const name=`shot-${String(index+1).padStart(2,'0')}`,segments=[];
 for(const [segmentIndex,segment] of shot.segments.entries())segments.push(await encodeSegment(tool,segment,manifest,work,shot.segments.length===1?name:`${name}-segment-${String(segmentIndex+1).padStart(2,'0')}`,resume));
 const destination=join(work,`${name}.mp4`);
 if(segments.length>1)await concatVideos(tool,segments.map(segment=>segment.destination),destination,work,name);
 verifyVideo(await probe(tool,destination),{frames:shot.frames,width:manifest.width,height:manifest.height});
 return {destination,sha256:await sha256(destination),segments};
}

/** Map each review sample to the exact original decoded frame, including montage cuts. */
export function qualitySamples(shots){
 let offset=0;const samples=[];
 for(const shot of shots){
  [0,Math.floor(shot.frames*.25),Math.floor(shot.frames*.5),Math.floor(shot.frames*.75),shot.frames-1].forEach((localFrame,column)=>{
   let segmentOffset=0,source;
   for(const segment of shot.segments){
    if(localFrame<segmentOffset+segment.frames){
     const native=segment.selected[localFrame-segmentOffset];assert.ok(native,'QA sample is missing its original source frame.');
     source={path:segment.path,sourcePath:segment.sourcePath,sourceSHA256:segment.sourceSHA256,segment:segment.id,sourceIndex:native.sourceIndex,sourceTime:native.sourceTime};break;
    }
    segmentOffset+=segment.frames;
   }
   assert.ok(source,'QA sample falls outside its authored segments.');
   samples.push({sample:samples.length,shot:shot.id,column,localFrame,filmFrame:offset+localFrame,seconds:(offset+localFrame)/OPENING_FPS,source});
  });
  offset+=shot.frames;
 }
 return samples;
}

async function qualitySheets(tool,film,shots,qa,width,height){
 await mkdir(join(qa,'frames'),{recursive:true});await mkdir(join(qa,'source-frames'),{recursive:true});
 const samples=qualitySamples(shots);
 const sampleFilter=selectFilter(samples.map(sample=>sample.filmFrame));
 await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-i',film,'-map','0:v:0','-an','-vf',sampleFilter,'-fps_mode','passthrough','-start_number','0',join(qa,'frames','frame-%03d.png')],{log:join(qa,'extract.log')});
 // Decode matching originals once per source file. Apply exactly the delivery's static spatial conversion,
 // but no H.264 encoding: these PNGs are the reference for evaluating compression damage.
 const groups=new Map();
 for(const sample of samples){const key=sample.source.sourceSHA256;const group=groups.get(key)||[];group.push(sample);groups.set(key,group);}
 let groupIndex=0;
 for(const group of groups.values()){
  group.sort((a,b)=>a.source.sourceIndex-b.source.sourceIndex);
  const prefix=`source-${String(groupIndex++).padStart(2,'0')}`;
  const filter=[selectFilter(group.map(sample=>sample.source.sourceIndex)),spatialFilter({width,height})].join(',');
  await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-i',group[0].source.path,'-map','0:v:0','-an','-vf',filter,'-fps_mode','passthrough','-frames:v',String(group.length),'-start_number','0',join(qa,'source-frames',`${prefix}-%03d.png`)],{log:join(qa,`${prefix}-extract.log`)});
  for(const [index,sample] of group.entries())await rename(join(qa,'source-frames',`${prefix}-${String(index).padStart(3,'0')}.png`),join(qa,'source-frames',`frame-${String(sample.sample).padStart(3,'0')}.png`));
 }
 // Resize for review sheets only. Extracted individual PNGs retain the native final dimensions.
 const pngSequence=join(qa,'frames','frame-%03d.png'),sourceSequence=join(qa,'source-frames','frame-%03d.png');
 await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number','0','-i',pngSequence,'-vf','scale=320:180,tile=5x12:padding=8:margin=8','-frames:v','1','-q:v','2',join(qa,'contact-sheet.jpg')],{log:join(qa,'contact-sheet.log')});
 const comparisonFilter=rows=>`[0:v]scale=320:180[s];[1:v]scale=320:180[d];[s][d]hstack=inputs=2,tile=5x${rows}:padding=8:margin=8[v]`;
 await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number','0','-i',sourceSequence,'-framerate','1','-start_number','0','-i',pngSequence,'-filter_complex',comparisonFilter(12),'-map','[v]','-frames:v','1','-q:v','2',join(qa,'compression-comparison.jpg')],{log:join(qa,'compression-comparison.log')});
 for(let index=0;index<shots.length;index++){
  await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number',String(index*5),'-i',pngSequence,'-vf','scale=320:180,tile=5x1:padding=8:margin=8','-frames:v','1','-q:v','2',join(qa,`${String(index+1).padStart(2,'0')}-${shots[index].id}.jpg`)]);
  await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number',String(index*5),'-i',sourceSequence,'-framerate','1','-start_number',String(index*5),'-i',pngSequence,'-filter_complex',comparisonFilter(1),'-map','[v]','-frames:v','1','-q:v','2',join(qa,`${String(index+1).padStart(2,'0')}-${shots[index].id}-compression.jpg`)]);
 }
 for(const sample of samples){
  const path=join(qa,'frames',`frame-${String(sample.sample).padStart(3,'0')}.png`),bytes=await readFile(path);
  assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);
  sample.pngSHA256=await sha256(path);sample.path=displayPath(path);
  const sourcePath=join(qa,'source-frames',`frame-${String(sample.sample).padStart(3,'0')}.png`),sourceBytes=await readFile(sourcePath);
  assert.equal(sourceBytes.readUInt32BE(16),width);assert.equal(sourceBytes.readUInt32BE(20),height);
  sample.source.pngSHA256=await sha256(sourcePath);sample.source.pngPath=displayPath(sourcePath);sample.source.path=undefined;
 }
 await saveJSON(join(qa,'contact-sheet-index.json'),{columns:5,rows:12,thumbnail:{width:320,height:180},samples});
 await saveJSON(join(qa,'compression-comparison.json'),{pairs:samples.length,layout:'Source on the left; delivery on the right in each pair.',sourceConversion:spatialFilter({width,height}),sourcePNGs:'Decoded original footage with the same static geometry and input pixel format as encoding; no intermediate H.264 compression.',deliveryPNGs:'Decoded final H.264 MP4.',native:{width,height},sheet:displayPath(join(qa,'compression-comparison.jpg')),visualApproval:'pending',samples});
 return samples;
}

async function frameHashes(tool,film,qa){
 const path=join(qa,'decoded-frames.sha256');
 await run(tool.ffmpeg,['-hide_banner','-nostdin','-y','-i',film,'-map','0:v:0','-an','-fps_mode','passthrough','-f','framemd5','-hash','sha256',path],{log:join(qa,'decoded-frame-hashes.log')});
 const records=(await readFile(path,'utf8')).split(/\r?\n/).filter(line=>line.trim()&&!line.startsWith('#')).map(line=>line.split(',').map(field=>field.trim()));
 assert.equal(records.length,OPENING_FRAMES,'Decoded hash pass did not inspect all 1,500 frames.');
 const hashes=records.map(fields=>fields.at(-1));let longestHold=1,hold=1;
 for(let index=1;index<hashes.length;index++){hold=hashes[index]===hashes[index-1]?hold+1:1;longestHold=Math.max(longestHold,hold);}
 return {frames:records.length,uniqueDecodedHashes:new Set(hashes).size,longestIdenticalRun:longestHold,hashFile:displayPath(path),note:'Repeated decoded pixels already present in real footage can be natural animation holds. Inspect these with the native frames; no padding or synthetic animation is introduced by this pipeline.'};
}

export async function assembleOpening(options){
 const manifestPath=resolve(options.manifest||join(HERE,'source-clips.json'));
 const manifest=validateManifest(await json(manifestPath)),tool=await tools(options),usedFrames=new Map(),shots=[];
 for(const shot of manifest.shots){console.log(`Inspecting ${shot.id}...`);shots.push(await inspectShot(tool,shot,manifest,manifestPath,usedFrames));}
 if(options.planOnly)return {ready:true,frames:OPENING_FRAMES,seconds:OPENING_SECONDS,encoding:encodingPlan(),shots};
 const output=insideRepo(options.output||join(REPO,'public/assets/v33/opening/eter-anima-opening-24fps.mp4'),'Output');
 assert.equal(output.toLowerCase().endsWith('.mp4'),true,'The browser delivery file must be MP4.');
 const qa=insideRepo(options.qa||join(REPO,'docs/qa-v33/opening'),'QA directory');
 if(!options.overwrite){assert.ok(!await exists(output),'Output exists; use --overwrite explicitly after review.');assert.ok(!await exists(join(qa,'verification.json')),'QA report exists; use --overwrite explicitly after review.');}
 const work=insideRepo(options.resumeDir||join(REPO,'.agents/v33-opening-renders',`${new Date().toISOString().replace(/[:.]/g,'-')}-${randomUUID().slice(0,8)}`),'Temporary render');
 if(options.resumeDir){const rel=relative(join(REPO,'.agents/v33-opening-renders'),work);assert.ok(rel&&!rel.startsWith('..')&&!isAbsolute(rel),'Resume directory must be a prior ignored opening render directory.');assert.ok((await stat(work)).isDirectory(),'Resume needs an existing render directory.');}
 await mkdir(work,{recursive:true});await mkdir(qa,{recursive:true});
 const stages=[];
 for(let index=0;index<shots.length;index++){console.log(`Encoding ${index+1}/12: ${shots[index].id}, ${shots[index].frames} real frames...`);stages.push(await encodeShot(tool,shots[index],manifest,work,index,Boolean(options.resumeDir)));}
 const pending=join(work,'opening-verified.mp4');
 await concatVideos(tool,stages.map(stage=>stage.destination),pending,work,'master');
 // A bitrate target is not a file-size guarantee. Reject the measured payload before QA/public placement.
 const budget=deliveryBudget((await stat(pending)).size);
 const finalProbe=await probe(tool,pending,true),video=verifyVideo(finalProbe,{frames:OPENING_FRAMES,width:manifest.width,height:manifest.height});
 const hashes=await frameHashes(tool,pending,qa),samples=await qualitySheets(tool,pending,shots,qa,manifest.width,manifest.height);
 let filmOffset=0;
 const provenanceShots=shots.map((shot,index)=>{
  const source={...shot,filmStartFrame:filmOffset,encodedSHA256:stages[index].sha256,segments:shot.segments.map((segment,segmentIndex)=>{
   const stage=stages[index].segments[segmentIndex];
   const record={...segment,path:undefined,filmStartFrame:filmOffset,encodedSHA256:stage.sha256,filter:stage.filter,reused:Boolean(stage.reused),clockRemux:stage.clockRemux||null,selected:segment.selected.map(frame=>({...frame,filmFrame:filmOffset+Math.round(frame.outputTime*OPENING_FPS)}))};
   filmOffset+=segment.frames;return record;
  })};
  return source;
 });
 const report={schema:2,verifiedAt:new Date().toISOString(),output:displayPath(output),outputSHA256:await sha256(pending),outputBytes:budget.bytes,deliveryBudget:budget,encoding:encodingPlan(),frames:Number(video.nb_read_frames),nb_frames:Number(video.nb_frames),r_frame_rate:video.r_frame_rate,avg_frame_rate:video.avg_frame_rate,durationSeconds:Number(video.duration),containerDurationSeconds:Number(finalProbe.format.duration),width:video.width,height:video.height,audioStreams:0,sourceFrameReuse:0,tool:{ffmpegVersion:tool.ffmpegVersion,ffprobeVersion:tool.ffprobeVersion,package:tool.provenance&&{officialDownloadPage:tool.provenance.officialDownloadPage,packageUrl:tool.provenance.packageUrl,archiveSHA256:tool.provenance.archiveSHA256,ffmpegSHA256:tool.provenance.ffmpegSHA256,ffprobeSHA256:tool.provenance.ffprobeSHA256}},manifest:{path:displayPath(manifestPath),sha256:await sha256(manifestPath)},shots:provenanceShots,decodedHashes:hashes,qaFrames:samples.length,sourceComparisonFrames:samples.length,compressionComparison:displayPath(join(qa,'compression-comparison.json')),compressionVisualApproval:'pending',temporaryWork:displayPath(work)};
 await saveJSON(join(work,'verification.json'),report);await saveJSON(join(qa,'ffprobe-final.json'),finalProbe);
 // Place in public only after real size, decoding counts and all native QA PNGs have succeeded.
 assert.equal(deliveryBudget((await stat(pending)).size).bytes,budget.bytes,'Delivery file changed during its verification.');
 await mkdir(dirname(output),{recursive:true});if(await exists(output))await copyFile(output,join(work,'previous-opening.mp4'));
 await rename(pending,output);await saveJSON(join(qa,'verification.json'),report);
 console.log(`Verified ${report.frames} frames × 24 fps = ${report.durationSeconds}s, ${report.width}×${report.height}, ${report.outputBytes}/${DELIVERY_MAX_BYTES} bytes, silent video: ${output}. Review the source/delivery PNG comparisons before publishing.`);
 return report;
}

function argumentsOf(argv){
 const options={};
 for(let i=0;i<argv.length;i++){
  const arg=argv[i];
  if(['--help','--self-test','--doctor','--plan-only','--overwrite'].includes(arg)){options[{'--help':'help','--self-test':'selfTest','--doctor':'doctor','--plan-only':'planOnly','--overwrite':'overwrite'}[arg]]=true;continue;}
  assert.ok(['--manifest','--output','--qa','--ffmpeg','--ffprobe','--verify-only','--resume-dir'].includes(arg),`Unknown argument: ${arg}`);
  assert.ok(argv[i+1]&&!argv[i+1].startsWith('--'),`Missing value: ${arg}`);
  options[arg.slice(2).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase())]=argv[++i];
 }
 return options;
}

export function selfTest(){
 const manifest={fps:24,width:1280,height:720,shots:SHOT_FRAMES.map((frames,index)=>({id:`shot-${index+1}`,path:`raw/shot-${index+1}.mp4`,startSeconds:0,frames}))};
 validateManifest(manifest);assert.equal(SHOT_FRAMES.reduce((a,b)=>a+b),1500);assert.equal(1500/24,62.5);
 const montage=structuredClone(manifest);montage.shots[11]={id:'shot-12',frames:156,segments:Array.from({length:6},(_,index)=>({path:`raw/approved-${index}.mp4`,startSeconds:5,frames:26}))};validateManifest(montage);
 assert.equal(shotSegments(montage.shots[11]).reduce((sum,segment)=>sum+segment.frames,0),156);
 assert.throws(()=>validateManifest({...montage,shots:montage.shots.map((shot,index)=>index===11?{...shot,segments:shot.segments.slice(0,5)}:shot)}));
 const native=Array.from({length:240},(_,index)=>index/24),higher=Array.from({length:300},(_,index)=>index/30);
 assert.equal(new Set(selectSourceFrames(native,1,144).map(frame=>frame.sourceIndex)).size,144);
 assert.equal(new Set(selectSourceFrames(higher,0,156).map(frame=>frame.sourceIndex)).size,156);
 assert.throws(()=>selectSourceFrames(Array.from({length:120},(_,i)=>i/12),0,120),/missing|distinct/);
 assert.throws(()=>selectSourceFrames(native,9,120),/missing|distinct/);
 assert.throws(()=>selectSourceFrames([0,0,.1],0,1),/strictly/);
 assert.throws(()=>validateManifest({...manifest,fps:30}));
 assert.throws(()=>validateManifest({...manifest,shots:manifest.shots.slice(0,11)}));
 assert.throws(()=>validateManifest({...manifest,shots:manifest.shots.map((s,i)=>i?{...s,frames:121}:s)}));
 assert.throws(()=>validateManifest({...manifest,shots:manifest.shots.map(s=>({...s,path:'https://example.com/video.mp4'}))}));
 const metadata={streams:[{codec_type:'video',nb_frames:'1500',nb_read_frames:'1500',r_frame_rate:'24/1',avg_frame_rate:'24/1',width:1280,height:720,duration:'62.500000',pix_fmt:'yuv420p'}],format:{duration:'62.500000'}};
 verifyVideo(metadata,{frames:1500,width:1280,height:720});
 assert.throws(()=>verifyVideo({...metadata,streams:[{...metadata.streams[0],nb_read_frames:'1499'}]},{frames:1500,width:1280,height:720}));
 assert.throws(()=>verifyVideo({...metadata,streams:[...metadata.streams,{codec_type:'audio'}]},{frames:1500,width:1280,height:720}));
 assert.throws(()=>verifyVideo({...metadata,format:{duration:'62.49'}},{frames:1500,width:1280,height:720}));
 assert.throws(()=>verifyVideo({...metadata,streams:[{...metadata.streams[0],r_frame_rate:'30/1'}]},{frames:1500,width:1280,height:720}));
 assert.throws(()=>insideRepo(resolve(REPO,'../wrong-output.mp4'),'Output'));
 console.log('Opening pipeline self-test PASS: 12 shot counts, 1,500 frames, 24 fps, 62.5 s, unique source indices, short/low-fps rejection, local paths, decoded counts, silent output and checkout bounds. No film was generated.');
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const options=argumentsOf(process.argv.slice(2));
  if(options.help)console.log('node art-source/v33/opening/assemble.mjs [--manifest source-clips.json] [--output public/assets/v33/opening/eter-anima-opening-24fps.mp4] [--qa docs/qa-v33/opening] [--ffmpeg FILE --ffprobe FILE] [--plan-only] [--overwrite] [--resume-dir .agents/v33-opening-renders/PRIOR-RUN]\nModes: --doctor, --self-test, --verify-only FILE');
  else if(options.selfTest)selfTest();
  else if(options.doctor){const tool=await tools(options);console.log(JSON.stringify({ffmpeg:tool.ffmpeg,ffprobe:tool.ffprobe,ffmpegVersion:tool.ffmpegVersion,ffprobeVersion:tool.ffprobeVersion,verifiedPortable:Boolean(tool.provenance)},null,2));}
  else if(options.verifyOnly){const path=resolve(options.verifyOnly),budget=deliveryBudget((await stat(path)).size),tool=await tools(options);const metadata=await probe(tool,path,true);console.log(JSON.stringify({video:verifyVideo(metadata,{frames:1500,width:Number(metadata.streams.find(s=>s.codec_type==='video')?.width),height:Number(metadata.streams.find(s=>s.codec_type==='video')?.height)}),deliveryBudget:budget},null,2));}
  else await assembleOpening(options);
 }catch(error){console.error(error.stack||error.message);process.exitCode=1;}
}
