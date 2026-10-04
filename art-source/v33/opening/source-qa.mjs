import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir,readFile,stat,writeFile} from 'node:fs/promises';
import {dirname,isAbsolute,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {selectSourceFrames} from './assemble.mjs';

const REPO=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const args=process.argv.slice(2),options={};
for(let index=0;index<args.length;index+=2){assert.ok(['--source','--qa','--crop','--crops'].includes(args[index])&&args[index+1],`Unknown/missing argument: ${args[index]}`);options[args[index].slice(2)]=args[index+1];}
const local=value=>{const path=resolve(REPO,value),part=relative(REPO,path);assert.ok(part&&!part.startsWith('..')&&!isAbsolute(part),'QA paths must stay in the game repository.');return path;};
const source=local(options.source),qa=local(options.qa),runtime=JSON.parse(await readFile(join(REPO,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
const display=path=>relative(REPO,path).replaceAll('\\','/');
const hash=async path=>createHash('sha256').update(await readFile(path)).digest('hex');
const save=async(path,value)=>writeFile(path,JSON.stringify(value,null,2)+'\n');
const invocations=[];
async function run(executable,arguments_){
 invocations.push({executable:display(executable),args:arguments_});
 return new Promise((ok,fail)=>{const process_=spawn(executable,arguments_,{cwd:REPO,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});let stdout='',stderr='';process_.stdout.on('data',bytes=>stdout+=bytes);process_.stderr.on('data',bytes=>stderr=(stderr+bytes).slice(-16000));process_.on('error',fail);process_.on('close',code=>code===0?ok(stdout):fail(new Error(`FFmpeg exited ${code}: ${stderr}`)));});
}
await mkdir(join(qa,'full'),{recursive:true});
const probe=JSON.parse(await run(runtime.ffprobe,['-v','error','-count_frames','-show_streams','-show_format','-of','json',source]));
const detailed=JSON.parse(await run(runtime.ffprobe,['-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',source]));
const video=probe.streams.find(stream=>stream.codec_type==='video');assert.ok(video,'Source has no video stream.');
assert.equal(video.r_frame_rate,'24/1');assert.equal(video.avg_frame_rate,'24/1');assert.equal(Number(video.nb_read_frames),detailed.frames.length,'Decoded count and source timestamps disagree.');
const times=detailed.frames.map(frame=>Number(frame.best_effort_timestamp_time));
const choose=seconds=>selectSourceFrames(times,seconds,1)[0];
const full=Array.from({length:16},(_,index)=>({sample:index,seconds:index*.5,...choose(index*.5)}));
const filter=frames=>`select='${frames.map(frame=>`eq(n,${frame.sourceIndex})`).join('+')}',format=rgb24`;
await run(runtime.ffmpeg,['-hide_banner','-nostdin','-y','-i',source,'-map','0:v:0','-an','-vf',filter(full),'-fps_mode','passthrough','-frames:v','16','-start_number','0',join(qa,'full','frame-%02d.png')]);
await run(runtime.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number','0','-i',join(qa,'full','frame-%02d.png'),'-vf',`scale=320:${Math.round(video.height/video.width*320)},tile=4x4:padding=8:margin=8`,'-frames:v','1','-q:v','2',join(qa,'full-contact.jpg')]);
async function record(frames,folder,width,height){
 for(const frame of frames){const path=join(qa,folder,`frame-${String(frame.sample).padStart(2,'0')}.png`),bytes=await readFile(path);assert.equal(bytes.readUInt32BE(16),width);assert.equal(bytes.readUInt32BE(20),height);frame.path=display(path);frame.pngSHA256=await hash(path);}
 return frames;
}
await record(full,'full',video.width,video.height);
const descriptors=[];
if(options.crop){
 const [x,y,width,height]=options.crop.split(',').map(Number);descriptors.push({id:'mika',character:'Mika',crop:{x,y,width,height}});
}
if(options.crops){const configured=JSON.parse(await readFile(local(options.crops),'utf8'));assert.ok(Array.isArray(configured),'Crops file needs an array of named native rectangles.');descriptors.push(...configured);}
const crops=[],cropIds=new Set();
for(const descriptor of descriptors){
 const {id,character,crop}=descriptor;assert.match(id,/^[a-z][a-z0-9-]{0,63}$/);assert.ok(!cropIds.has(id),'Crop IDs must be unique.');cropIds.add(id);
 const {x,y,width,height}=crop;assert.ok([x,y,width,height].every(Number.isInteger)&&x>=0&&y>=0&&width>0&&height>0&&x+width<=video.width&&y+height<=video.height,'Crop must be native and within the source frame.');
 await mkdir(join(qa,id),{recursive:true});
 const frames=Array.from({length:32},(_,index)=>({sample:index,seconds:index*6/24,...choose(index*6/24)}));
 await run(runtime.ffmpeg,['-hide_banner','-nostdin','-y','-i',source,'-map','0:v:0','-an','-vf',`${filter(frames)},crop=${width}:${height}:${x}:${y}`,'-fps_mode','passthrough','-frames:v','32','-start_number','0',join(qa,id,'frame-%02d.png')]);
 for(let sheet=0;sheet<2;sheet++)await run(runtime.ffmpeg,['-hide_banner','-nostdin','-y','-framerate','1','-start_number',String(sheet*16),'-i',join(qa,id,'frame-%02d.png'),'-vf',`scale=320:${Math.round(height/width*320)},tile=4x4:padding=8:margin=8`,'-frames:v','1','-q:v','2',join(qa,`${id}-contact-${sheet+1}.jpg`)]);
 crops.push({id,character,crop:{x,y,width,height},frames:await record(frames,id,width,height),nativePixels:true});
}
await save(join(qa,'ffprobe.json'),probe);
await save(join(qa,'qa-manifest.json'),{schema:2,source:display(source),sourceSHA256:await hash(source),sourceBytes:(await stat(source)).size,actualDecodedFrames:Number(video.nb_read_frames),sourceResolution:{width:video.width,height:video.height},fps:24,videoDurationSeconds:Number(video.duration),containerDurationSeconds:Number(probe.format.duration),audio:probe.streams.filter(stream=>stream.codec_type==='audio').map(stream=>({codec:stream.codec_name,sampleRate:stream.sample_rate,channels:stream.channels,duration:stream.duration})),full,cropped:crops[0]||null,crops,extraction:'FFmpeg decoded original source indices, rgb24 PNG. Character crops are native rectangles without repainting/resizing; only contact thumbnails are resized.',visualReview:'pending',commands:invocations});
console.log(JSON.stringify({source:display(source),qa:display(qa),frames:Number(video.nb_read_frames),fullPNGs:full.length,cropPNGs:crops.reduce((sum,group)=>sum+group.frames.length,0),sourceSHA256:await hash(source)},null,2));
