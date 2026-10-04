// Native first-scene smoke: local source, two genuine H.264 passes, no public writes.
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {encodePassArguments,selectSourceFrames,validateManifest,verifyVideo} from './assemble.mjs';

const here=dirname(fileURLToPath(import.meta.url)),repo=resolve(here,'../../..');
const runtime=JSON.parse(await readFile(join(repo,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
const manifest=validateManifest(JSON.parse(await readFile(join(here,'source-clips.json'),'utf8')));
const source=manifest.shots[0],path=resolve(here,source.path);
assert.equal(createHash('sha256').update(await readFile(path)).digest('hex'),source.sourceSHA256);
const work=join(repo,'.agents/v33-opening-renders',`smoke-${Date.now()}`);await mkdir(work,{recursive:true});
async function run(executable,args){return new Promise((ok,fail)=>{
 const child=spawn(executable,args,{cwd:repo,shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});let out='',err='';
 child.stdout.on('data',bytes=>out+=bytes);child.stderr.on('data',bytes=>err=(err+bytes).slice(-16000));child.on('error',fail);child.on('close',code=>code===0?ok(out):fail(new Error(`Smoke tool exited ${code}: ${err}`)));
});}
const metadata=JSON.parse(await run(runtime.ffprobe,['-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',path]));
const selected=selectSourceFrames(metadata.frames.map(frame=>Number(frame.best_effort_timestamp_time)),source.startSeconds,source.frames);
const destination=join(work,'shot-01.mp4'),passes=encodePassArguments({...source,path,selected},manifest,destination,join(work,'pass-log'));
for(const [index,args] of [passes.first,passes.second].entries()){console.log(`Smoke scene01 pass${index+1}: ${source.frames} real frames...`);await run(runtime.ffmpeg,args);}
const probe=JSON.parse(await run(runtime.ffprobe,['-v','error','-count_frames','-show_streams','-show_format','-of','json',destination]));
const video=verifyVideo(probe,{frames:source.frames,width:manifest.width,height:manifest.height});
const report={source:source.path,sourceSHA256:source.sourceSHA256,sourceIndices:[selected[0].sourceIndex,selected.at(-1).sourceIndex],frames:Number(video.nb_read_frames),fps:video.r_frame_rate,seconds:Number(video.duration),width:video.width,height:video.height,audioStreams:probe.streams.filter(s=>s.codec_type==='audio').length,filter:passes.filter,output:destination};
await writeFile(join(repo,'docs/qa-v33/opening/first-scene-smoke.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
