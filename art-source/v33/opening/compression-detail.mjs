// Deterministic review crops of decoded source/delivery PNGs. No painting or rescaling.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=resolve(dirname(fileURLToPath(import.meta.url)),'../../..');
const qa=join(repo,'docs/qa-v33/opening');
const {ffmpeg}=JSON.parse(await readFile(join(repo,'.agents/v33-ffmpeg/runtime.json'),'utf8'));
const regions=[
 {id:'ava-character',sample:32,x:200,y:0,width:650,height:720},
 {id:'orfeu-character',sample:37,x:200,y:0,width:700,height:720},
 {id:'carmilla-character',sample:42,x:485,y:0,width:500,height:720},
 {id:'beatriz-character',sample:47,x:430,y:0,width:750,height:720},
 {id:'abel-character',sample:52,x:290,y:0,width:680,height:720},
 {id:'montage-shin',sample:55,x:730,y:155,width:500,height:550},
 {id:'montage-mika',sample:56,x:650,y:180,width:430,height:540},
 {id:'montage-dante',sample:57,x:570,y:0,width:710,height:710},
 {id:'montage-vajra',sample:58,x:730,y:240,width:300,height:470},
 {id:'montage-ava',sample:59,x:200,y:0,width:650,height:720},
];
const output=join(qa,'native-comparisons');await mkdir(output,{recursive:true});
async function run(args){await new Promise((ok,fail)=>{const child=spawn(ffmpeg,args,{cwd:repo,shell:false,windowsHide:true,stdio:['ignore','ignore','pipe']});let stderr='';child.stderr.on('data',bytes=>stderr+=bytes);child.on('error',fail);child.on('close',code=>code===0?ok():fail(new Error(stderr)));});}
for(const region of regions){
 const name=`frame-${String(region.sample).padStart(3,'0')}.png`;
 const filter=`[0:v]crop=${region.width}:${region.height}:${region.x}:${region.y}[s];[1:v]crop=${region.width}:${region.height}:${region.x}:${region.y}[d];[s][d]hstack=inputs=2[v]`;
 const args=['-hide_banner','-nostdin','-y','-i',join(qa,'source-frames',name),'-i',join(qa,'frames',name),'-filter_complex',filter,'-map','[v]','-frames:v','1',join(output,`${region.id}.png`)];
 await run(args);
}
// Five regular samples of the six-cut closing montage skip its third (Marin) segment.
// Add its midpoint explicitly so all six closing source windows receive a native comparison.
const closing={id:'montage-umbra',filmFrame:1409,sourceFrame:133,source:'art-source/v33/opening/clips/04-marin-fixed.mp4',x:700,y:240,width:340,height:460};
const closingFilter=`[0:v]select='eq(n,${closing.sourceFrame})',crop=${closing.width}:${closing.height}:${closing.x}:${closing.y},setpts=PTS-STARTPTS[s];[1:v]select='eq(n,${closing.filmFrame})',crop=${closing.width}:${closing.height}:${closing.x}:${closing.y},setpts=PTS-STARTPTS[d];[s][d]hstack=inputs=2[v]`;
await run(['-hide_banner','-nostdin','-y','-i',join(repo,closing.source),'-i',join(repo,'public/assets/v33/opening/eter-anima-opening-24fps.mp4'),'-filter_complex',closingFilter,'-map','[v]','-frames:v','1',join(output,`${closing.id}.png`)]);
regions.push(closing);
await writeFile(join(output,'index.json'),JSON.stringify({layout:'Source left; delivery right. Native pixel crops with no resize or repaint.',regions},null,2)+'\n');
console.log(`Saved ${regions.length} native comparison pairs.`);
