import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';

const root=process.cwd(),runtime=JSON.parse(fs.readFileSync(path.join(root,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
const ids=process.argv.slice(2);if(!ids.length)ids.push('long-tinta','long-geada','long-brasa','long-trovao','long-nulo');
const base=path.join(root,'art-source/v34/quest-cinematics'),out=path.join(root,'public/assets/v34/quest-cinematics'),qa=path.join(root,'docs/qa-v34/media');
fs.mkdirSync(out,{recursive:true});fs.mkdirSync(qa,{recursive:true});
const run=(exe,args)=>{const r=spawnSync(exe,args,{encoding:'utf8',maxBuffer:30*1024*1024,windowsHide:true});if(r.error||r.status!==0)throw new Error(r.error?.message||r.stderr);return r.stdout;};
const digest=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const probe=file=>JSON.parse(run(runtime.ffprobe,['-v','error','-count_frames','-show_entries','stream=codec_type,codec_name,width,height,r_frame_rate,avg_frame_rate,nb_read_frames,duration:format=duration,size','-of','json',file]));
const decoded=file=>run(runtime.ffmpeg,['-v','error','-i',file,'-map','0:v:0','-an','-fps_mode','passthrough','-f','framemd5','-']).split(/\r?\n/).filter(l=>l&&!l.startsWith('#')).map(l=>l.split(',').at(-1).trim());
for(const id of ids){
 if(!/^long-(tinta|geada|brasa|trovao|nulo)$/.test(id))throw new Error('Unknown film: '+id);
 const source=path.join(base,'clips',id+'.mp4'),final=path.join(out,id+'.mp4'),info=probe(source),v=info.streams.find(s=>s.codec_type==='video');
 if(v?.r_frame_rate!=='24/1'||v.avg_frame_rate!=='24/1'||v.width!==1280||v.height!==720)throw new Error('Source must be native24fps1280x720: '+id);
 const frames=Number(v.nb_read_frames),seconds=frames/24;if(![192,240].includes(frames)||Math.abs(Number(v.duration)-seconds)>.00001)throw new Error('Unexpected native frame budget: '+id);
 run(runtime.ffmpeg,['-y','-v','error','-i',source,'-map','0:v:0','-an','-c:v','copy','-movflags','+faststart','-movie_timescale','24000','-video_track_timescale','24000',final]);
 const result=probe(final),fv=result.streams.find(s=>s.codec_type==='video');if(result.streams.length!==1||Number(fv.nb_read_frames)!==frames||Number(fv.duration)!==seconds||fv.avg_frame_rate!=='24/1'||Number(result.format.size)>=24*1024*1024)throw new Error('Invalid runtime media: '+id);
 const before=decoded(source),after=decoded(final);if(before.length!==frames||JSON.stringify(before)!==JSON.stringify(after))throw new Error('Decoded pixels changed during remux: '+id);
 const pts=JSON.parse(run(runtime.ffprobe,['-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time','-of','json',final])).frames.map(f=>Number(f.best_effort_timestamp_time));
 if(pts.length!==frames||pts.some((t,i)=>Math.abs(t-i/24)>.000001))throw new Error('Nonuniform24fps timestamps: '+id);
 const samples=Array.from({length:12},(_,i)=>Math.round(i*(frames-1)/11));
 run(runtime.ffmpeg,['-y','-v','error','-i',final,'-vf',`select='${samples.map(i=>'eq(n,'+i+')').join('+')}',scale=426:240,tile=4x3`,'-frames:v','1','-q:v','2',path.join(qa,id+'-contact.jpg')]);
 for(const [label,index]of[['first',0],['middle',Math.floor(frames/2)],['last',frames-1]])run(runtime.ffmpeg,['-y','-v','error','-i',final,'-vf',`select='eq(n,${index})'`,'-frames:v','1','-q:v','2',path.join(qa,id+'-'+label+'.jpg')]);
 run(runtime.ffmpeg,['-y','-v','error','-i',final,'-vf',"select='eq(n,0)'",'-frames:v','1','-q:v','2',path.join(out,id+'.jpg')]);
 let longestIdenticalRun=1,current=1;for(let i=1;i<after.length;i++){current=after[i]===after[i-1]?current+1:1;longestIdenticalRun=Math.max(current,longestIdenticalRun);}
 const report={id,source:path.relative(root,source).replaceAll('\\','/'),sourceSHA256:digest(source),runtime:path.relative(root,final).replaceAll('\\','/'),runtimeSHA256:digest(final),fps:'24/1',frames,durationSeconds:seconds,width:fv.width,height:fv.height,bytes:Number(result.format.size),audioStreams:0,pixelIdenticalToSource:true,uniformNativeTimestamps:true,uniqueDecodedFrames:new Set(after).size,longestIdenticalRun,sampleIndices:samples,method:'Lossless H264 remux. Audio removed. No frame duplication, interpolation, loops or retiming.',visualReview:'pending'};
 fs.writeFileSync(path.join(qa,id+'-verification.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
}
