import assert from 'node:assert/strict';
import {readFileSync, writeFileSync, mkdtempSync, existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import ts from 'typescript';
import sharp from '../node_modules/.pnpm/sharp@0.35.4_@types+node@22.19.19/node_modules/sharp/dist/index.mjs';

const out=mkdtempSync(join(tmpdir(),'eter-cinematic-v31-'));
writeFileSync(join(out,'registry.mjs'),ts.transpileModule(readFileSync('lib/art/questCinematicsV31.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
const {QUEST_CINEMATICS_V31,getQuestCinematic,cinematicRange,cinematicFrameAt,cinematicPlaybackStep,cinematicTabTarget}=await import(pathToFileURL(join(out,'registry.mjs')).href);
const hash=value=>createHash('sha256').update(value).digest('hex');let checks=0;
const check=(condition,message)=>{assert.ok(condition,message);checks++;};
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
equal(Object.keys(QUEST_CINEMATICS_V31),['long-tinta','long-geada','long-brasa','long-trovao','long-nulo'],'Stable mission/save IDs');
equal(getQuestCinematic('not-a-film'),undefined,'Unknown ID does not borrow another mission');
equal(getQuestCinematic('__proto__'),undefined,'Unknown prototype ID rejected');
const allHashes=[];
for(const[id,scene]of Object.entries(QUEST_CINEMATICS_V31)){
 equal(scene.frames.length,48,`${id} genuinely has48 native frames`);equal(scene.atlases.length,3,`${id} owns3 distinct atlas sources`);
 check(scene.durationMs>=8000&&scene.durationMs<=12000,'Full movie duration8–12seconds');equal(cinematicRange(scene).durationMs,scene.durationMs,'Timeline agrees with actual frame durations');
 equal(cinematicFrameAt(scene,-20),0,'Before film starts, frame0');equal(cinematicFrameAt(scene,scene.durationMs+500),47,'Lastframe holds after movie ends');
 const seen=[];for(let elapsed=0;elapsed<scene.durationMs;elapsed+=110){const index=cinematicFrameAt(scene,elapsed);if(seen.at(-1)!==index)seen.push(index);}
 equal(seen,Array.from({length:48},(_,i)=>i),'Playback presents every frame exactly in native sequence');
 let elapsed=0,ticks=0;const actualSeen=[0];
 while(elapsed<scene.durationMs&&ticks<2000){const step=cinematicPlaybackStep(elapsed,++ticks%13===0?900:17,scene.durationMs,false,false);elapsed=step.elapsedMs;const index=cinematicFrameAt(scene,elapsed);if(actualSeen.at(-1)!==index)actualSeen.push(index);}
 equal(actualSeen,Array.from({length:48},(_,i)=>i),'Irregular real playback clocks still paint all48 frames without skipping');
 for(let act=0;act<3;act++){
  const atlas=scene.atlases[act],runtime='public'+atlas.src,sourceDir=`art-source/v31/cinematics/${id}`;
  check(existsSync(runtime),'Runtime atlas exists');equal(hash(readFileSync(runtime)),atlas.sha256,'Runtime native source hash');
  const manifest=JSON.parse(readFileSync(`${sourceDir}/act-${act+1}-manifest.json`,'utf8'));
  equal(hash(readFileSync(manifest.selected)),atlas.sha256,'Selected native source byte-identical');
  const {data,info}=await sharp(runtime).ensureAlpha().raw().toBuffer({resolveWithObject:true});equal([info.width,info.height],[atlas.width,atlas.height],'Measured native dimensions');
  equal(cinematicFrameAt(scene,0,act),act*16,'Act preview starts at correct shot');equal(cinematicFrameAt(scene,10000,act),act*16+15,'Act preview remains16frames; fullscene remains48');
  for(let cell=0;cell<16;cell++){
   const index=act*16+cell,f=scene.frames[index],column=cell%4,row=Math.floor(cell/4);
   equal(f.atlas,act,'Frame uses its own act atlas');check(Number.isInteger(f.x)&&Number.isInteger(f.y)&&Number.isInteger(f.w)&&Number.isInteger(f.h),'Integer native crop');
   check(f.x>=Math.round(column*atlas.width/4)+1&&f.x+f.w<=Math.round((column+1)*atlas.width/4)-1,'Crop does not include neighboring frame columns');
   check(f.y>=Math.round(row*atlas.height/4)+1&&f.y+f.h<=Math.round((row+1)*atlas.height/4)-1,'Crop does not include neighboring frame rows');
   check(f.w>=400&&f.h>=230,'Each shot has native painted resolution, no generated pixels resized');
   check(Math.abs(f.w/f.h-16/9)<.025,'Native shot aspect preserved');equal(f.startMs,index*220,'Frame exact position in timeline');equal(f.durationMs,220,'Native frame dwell time');
   const bytes=Buffer.alloc(f.w*f.h*4);for(let y=0;y<f.h;y++)data.copy(bytes,y*f.w*4,((f.y+y)*info.width+f.x)*4,((f.y+y)*info.width+f.x+f.w)*4);
   const digest=hash(bytes);equal(digest,manifest.frames[cell].rgbaSha256,'Each displayed crop has recorded native RGBA provenance');allHashes.push(digest);
   for(let p=3;p<bytes.length;p+=4)assert.equal(bytes[p],255,'Cinematic scene is opaque, no transparent holes within picture');checks++;
  }
 }
 equal(scene.captions.map(c=>c.startFrame),[0,16,32],'Subtitles change by narrative beat rather than48 rapid announcements');
 for(const avatar of scene.avatars)check(existsSync('public'+avatar.src),'Real native portrait source exists');
}
equal(new Set(allHashes).size,240,'240 native RGBA frames are distinct; no repeated source/crop padding');
equal(cinematicPlaybackStep(880,220,10560,true,false),{elapsedMs:880,finished:false},'Pause preserves movie position');
equal(cinematicPlaybackStep(880,60000,10560,false,true),{elapsedMs:880,finished:false},'Hidden tab time never skips frames');
equal(cinematicPlaybackStep(0,220,10560,true,false),{elapsedMs:0,finished:false},'Reduced motion starts paused, without an implicit completion');
equal(cinematicPlaybackStep(10340,220,10560,false,false),{elapsedMs:10560,finished:true},'Completion becomes available only after the last frame dwell');
equal(cinematicPlaybackStep(10560,800,10560,false,false),{elapsedMs:10560,finished:true},'Completed film holds last frame');
equal(cinematicPlaybackStep(880,-200,10560,false,false),{elapsedMs:880,finished:false},'Clock rollback does not rewind');
equal(cinematicPlaybackStep(880,Infinity,10560,false,false),{elapsedMs:880,finished:false},'Invalid clock interval does not skip all pictures');
equal(cinematicPlaybackStep(0,60000,10560,false,false),{elapsedMs:220,finished:false},'Visible browser stalls advance at most one native frame, never skip the film');
equal(cinematicPlaybackStep(210,900,10560,false,false),{elapsedMs:220,finished:false},'A frame transition discards stalled time so the new picture gets its full dwell');
for(const count of [2,3]){
 let focus=count-2;const events=['keydown','keyup'];
 for(const phase of events){const target=cinematicTabTarget(phase,false,focus,count);if(target!==null)focus=target;else if(phase==='keydown')focus++;}
 equal(focus,count-1,'Tab press+release from Skip reaches Continue and stays there');
 equal(cinematicTabTarget('keyup',false,count-1,count),null,'Tab keyup never wraps Continue back to first');
 equal(cinematicTabTarget('keydown',false,count-1,count),0,'Next separate Tab press wraps from Continue to first');
 equal(cinematicTabTarget('keydown',true,0,count),count-1,'ShiftTab wraps first to Continue');
 equal(cinematicTabTarget('keyup',true,0,count),null,'ShiftTab key release also never moves focus');
}
equal(cinematicTabTarget('keydown',false,-1,2),0,'Focus outside enabled buttons enters first on keydown');
equal(cinematicTabTarget('keyup',false,-1,2),null,'Focus outside never moves on release');
// Real React SSR smoke: the body portal must wait for a browser and never touch document/Image during server render.
const require=createRequire(import.meta.url);
let componentSource=ts.transpileModule(readFileSync('components/quest-cinematic.tsx','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
for(const name of ['react/jsx-runtime','react','react-dom']){
 const url=pathToFileURL(require.resolve(name)).href;
 componentSource=componentSource.replaceAll(`from '${name}'`,`from '${url}'`).replaceAll(`from "${name}"`,`from "${url}"`);
}
componentSource=componentSource.replace(/from\s+['"]@\/lib\/art\/questCinematicsV31['"]/g,"from './registry.mjs'").replace(/from\s+['"]\.\/quest-cinematic\.module\.css['"]/g,"from './styles.mjs'");
writeFileSync(join(out,'styles.mjs'),'export default {};');writeFileSync(join(out,'component.mjs'),componentSource);
const {QuestCinematic}=await import(pathToFileURL(join(out,'component.mjs')).href);
for(const questId of [...Object.keys(QUEST_CINEMATICS_V31),'missing-film'])equal(renderToString(createElement(QuestCinematic,{questId,onComplete:()=>{},onSkip:()=>{}})),'','Portal renders safely without browser globals duringSSR');
console.log(`cutscene-v31: ${checks}checks passed;5films,15atlases,240 distinct native frames.`);
