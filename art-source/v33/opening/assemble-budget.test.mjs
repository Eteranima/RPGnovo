import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdir,mkdtemp,open,rmdir,unlink} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
import {CLOUDFLARE_ASSET_MAX_BYTES,DELIVERY_MAX_BYTES,OPENING_FRAMES,OPENING_FPS,OPENING_SECONDS,SHOT_FRAMES,VIDEO_BITRATE,deliveryBudget,encodingPlan,encodePassArguments,qualitySamples,sourceSelectionFilter,verifyVideo} from './assemble.mjs';

const HERE=dirname(fileURLToPath(import.meta.url)),REPO=resolve(HERE,'../../..');
const value=(args,flag)=>args[args.indexOf(flag)+1];
const segment=(id,frames,start=0)=>({id,path:`${id}.mp4`,sourcePath:`${id}.mp4`,sourceSHA256:id,frames,selected:Array.from({length:frames},(_,index)=>({sourceIndex:start+index,sourceTime:(start+index)/24}))});

test('measured delivery allows 24 MiB exactly and rejects one extra byte',()=>{
 assert.equal(CLOUDFLARE_ASSET_MAX_BYTES,26_214_400);
 assert.equal(DELIVERY_MAX_BYTES,25_165_824);
 assert.equal(deliveryBudget(DELIVERY_MAX_BYTES).remainingBytes,0);
 assert.equal(deliveryBudget(DELIVERY_MAX_BYTES).cloudflareMarginBytes,1_048_576);
 assert.throws(()=>deliveryBudget(DELIVERY_MAX_BYTES+1),/above.*24 MiB/);
 for(const invalid of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>deliveryBudget(invalid),/positive integer/);
});

test('bounded bitrate estimate leaves muxing headroom without approving the real payload',()=>{
 const plan=encodingPlan();
 assert.equal(plan.passes,2);assert.equal(plan.bitrateBitsPerSecond,2_800_000);
 assert.equal(plan.estimatedVideoBytes,21_875_000);
 assert.equal(plan.estimatedMuxReserveBytes,1_048_576);
 assert.ok(plan.estimatedTotalBytes<DELIVERY_MAX_BYTES);
 assert.equal(plan.sizeEstimateIsApproval,false);
 assert.equal(plan.frames,1500);assert.equal(plan.fps,24);assert.equal(plan.seconds,62.5);
});

test('both H.264 passes preserve source indices, geometry, clock and complete frame count',()=>{
 for(const [width,height] of [[1280,720],[1920,1080]]){
  const source=segment('approved-seiji',120,24),passes=encodePassArguments(source,{width,height},'delivery.mp4','private-pass-log');
  for(const [index,args] of [passes.first,passes.second].entries()){
   assert.equal(value(args,'-i'),source.path);assert.equal(value(args,'-pass'),String(index+1));
   assert.equal(value(args,'-passlogfile'),'private-pass-log');
   assert.equal(value(args,'-b:v'),String(VIDEO_BITRATE));assert.equal(value(args,'-maxrate'),String(VIDEO_BITRATE));
   assert.equal(value(args,'-bufsize'),String(VIDEO_BITRATE*2));
   assert.ok(!args.includes('-r'),'Output -r conflicts with passthrough and can synthesize CFR frames.');assert.equal(value(args,'-frames:v'),'120');
   assert.equal(value(args,'-fps_mode'),'passthrough');assert.equal(value(args,'-enc_time_base'),'1:24');
   assert.equal(value(args,'-pix_fmt'),'yuv420p');assert.ok(args.includes('-an'));
   assert.ok(!args.includes('-fs')&&!args.includes('-t')&&!args.includes('-crf'),'Never truncate frames or use unbounded CRF delivery.');
   assert.equal(value(args,'-vf'),passes.filter);
   assert.ok(passes.filter.includes('settb=1/24,setpts=N'),'Exact timestamps set the clock without frame duplication.');
   assert.ok(passes.filter.includes(`scale=${width}:${height}`)&&passes.filter.includes(`crop=${width}:${height}`));
   assert.ok(passes.filter.includes('between(n,24,143)'),'Only the entire verified contiguous native window is selected.');
   assert.ok(!/(?:^|,)(fps=|loop=|tpad=|minterpolate=|zoompan=)/.test(passes.filter));
  }
  assert.equal(passes.first.at(-1),'-');assert.equal(value(passes.first,'-f'),'null');
  assert.equal(passes.second.at(-1),'delivery.mp4');assert.equal(value(passes.second,'-movflags'),'+faststart');
  assert.equal(value(passes.second,'-movie_timescale'),'24000');assert.equal(value(passes.second,'-video_track_timescale'),'24000');
 }
 assert.throws(()=>encodePassArguments({...segment('bad',120),selected:[]},{width:1280,height:720},'out','log'),/every selected/);
 assert.equal(sourceSelectionFilter([24,25,27,30,31,32]),"select='((between(n,24,25)+eq(n,27))+between(n,30,32))'",'Holes between native runs must remain excluded.');
 assert.throws(()=>sourceSelectionFilter([1,1]),/distinct increasing/);
 const metadata={streams:[{codec_type:'video',nb_frames:'26',nb_read_frames:'26',r_frame_rate:'24/1',avg_frame_rate:'24/1',width:1280,height:720,duration:'1.083333',duration_ts:26000,time_base:'1/24000',pix_fmt:'yuv420p'}],format:{duration:'1.083333'},frames:Array.from({length:26},(_,index)=>({best_effort_timestamp_time:(index/24).toFixed(6)}))};
 verifyVideo(metadata,{frames:26,width:1280,height:720});
 assert.throws(()=>verifyVideo({...metadata,streams:[{...metadata.streams[0],duration_ts:25992}]},{frames:26,width:1280,height:720}),/Integer stream duration/);
 const irregular=structuredClone(metadata);irregular.frames[12].best_effort_timestamp_time='0.501000';
 assert.throws(()=>verifyVideo(irregular,{frames:26,width:1280,height:720}),/uniform 24 fps clock/);
});

test('comparison pairs reference their exact original frames across closing montage cuts',()=>{
 const shots=SHOT_FRAMES.map((frames,index)=>({id:`shot-${index+1}`,frames,segments:[segment(`native-${index+1}`,frames,12)]}));
 shots[11].segments=Array.from({length:6},(_,index)=>segment(`montage-${index+1}`,26,120+index));
 const samples=qualitySamples(shots);
 assert.equal(samples.length,60);assert.equal(samples[0].filmFrame,0);assert.equal(samples.at(-1).filmFrame,1499);
 const closing=samples.slice(-5);
 assert.deepEqual(closing.map(sample=>sample.localFrame),[0,39,78,117,155]);
 assert.deepEqual(closing.map(sample=>sample.source.segment),['montage-1','montage-2','montage-4','montage-5','montage-6']);
 assert.deepEqual(closing.map(sample=>sample.source.sourceIndex),[120,134,123,137,150]);
 assert.equal(OPENING_FRAMES/OPENING_FPS,OPENING_SECONDS);
});

test('verify-only rejects an actual oversized local file before tools or public writes',async()=>{
 const base=join(REPO,'.agents','v33-opening-budget-tests');await mkdir(base,{recursive:true});
 const folder=await mkdtemp(join(base,'measured-')),path=join(folder,'oversized.mp4');
 try{
  const file=await open(path,'w');try{await file.truncate(DELIVERY_MAX_BYTES+1);}finally{await file.close();}
  const result=spawnSync(process.execPath,[join(HERE,'assemble.mjs'),'--verify-only',path],{cwd:REPO,shell:false,windowsHide:true,encoding:'utf8',timeout:10000});
  assert.equal(result.error,undefined);assert.equal(result.status,1);
  assert.match(result.stderr,/25165825 bytes.*25165824-byte \(24 MiB\) budget/);
  assert.doesNotMatch(result.stdout,/ffmpeg|Verified/);
 }finally{await unlink(path);await rmdir(folder);}
});
