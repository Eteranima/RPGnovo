import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';
import ts from 'typescript';

let checks=0;
const equal=(a,b,message)=>{assert.deepEqual(a,b,message);checks++;};
const check=(a,message)=>{assert.ok(a,message);checks++;};
const contractSource=readFileSync('lib/art/questCinematicsV34.ts','utf8');
const registry={};
new Function('exports',ts.transpileModule(contractSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(registry);
const {QUEST_CINEMATICS_V34:films,getQuestCinematicV34,questVideoRangeV34,questVideoFrameV34,questVideoDurationMatchesV34,questVideoCaptionV34,questVideoClockV34,questVideoCapturesKeyV34,questVideoTabTargetV34}=registry;
const ids=['long-tinta','long-geada','long-brasa','long-trovao','long-nulo'];
equal(Object.keys(films),ids,'all five save identifiers remain stable');
for(const id of ['missing','__proto__','constructor','toString'])equal(getQuestCinematicV34(id),undefined,'unknown or prototype identifiers cannot borrow a film');
const finals={
 'long-tinta':'A memória de Iria voltou. Seu cuidado pertence às pessoas do cais.',
 'long-geada':'O jardim voltou a respirar. A memória continuará sob o cuidado escolhido.',
 'long-brasa':'A pira está livre. O primeiro fogo pertence a quem ficará.',
 'long-trovao':'A mensagem está livre. Quem a guarda decidirá como partilhá-la.',
 'long-nulo':'A página ficou em branco. Nenhuma resposta será imposta.'
};
for(const [id,film]of Object.entries(films)){
 equal(getQuestCinematicV34(id),film,'registry returns only the selected mission');
 equal(film.src,`/assets/v34/quest-cinematics/${id}.mp4`,'one encoded native film per mission');
 equal(film.poster,`/assets/v34/quest-cinematics/${id}.jpg`,'library requests the standalone poster');
 equal(film.fps,24,'film contract is native24fps');
 equal(film.frames,film.durationSeconds*film.fps,'duration and native frame count agree');
 check(Number.isInteger(film.frames)&&film.frames>=192,'each encoded movie has at least8seconds at24fps');
 check(!('atlases'in film),'runtime registry cannot preload historical atlas sheets');
 equal(film.captions.map(c=>c.act),[0,1,2],'caption beats remain accessible rather than announcing every frame');
 equal(film.captions[2].text,finals[id],'final captions respect already completed choices');
 check(film.loadTimeoutMs>=10000&&film.loadTimeoutMs<=30000,'network stalls have a bounded retry path');
 for(const avatar of film.avatars)check(existsSync('public'+avatar.src),'avatar uses an existing native character portrait');
 for(let frame=0;frame<film.frames;frame++)equal(questVideoFrameV34(film,(frame+.25)/film.fps),frame,'native clock identifies each encoded frame');
 for(const time of [-1,NaN,Infinity,-Infinity])equal(questVideoFrameV34(film,time),0,'invalid media time never creates an invalid frame');
 for(const time of [film.durationSeconds,film.durationSeconds+100])equal(questVideoFrameV34(film,time),film.frames-1,'the final encoded frame holds');
 for(const time of [film.durationSeconds,film.durationSeconds+1/24,film.durationSeconds-1/24])check(questVideoDurationMatchesV34(film,time),'metadata tolerance is only one native frame');
 for(const time of [0,NaN,Infinity,film.durationSeconds+.1,film.durationSeconds-.1])check(!questVideoDurationMatchesV34(film,time),'different or missing edits are rejected');
 const whole=questVideoRangeV34(film),acts=[0,1,2].map(act=>questVideoRangeV34(film,act));
 equal([whole.startFrame,whole.endFrame],[0,film.frames],'first presentation includes the entire film');
 equal(acts.map(a=>a.startFrame),[0,acts[0].endFrame,acts[1].endFrame],'act previews are contiguous');
 equal(acts[2].endFrame,whole.endFrame,'third act includes the final native shot');
 equal(acts.reduce((sum,a)=>sum+a.endFrame-a.startFrame,0),film.frames,'preview thirds neither duplicate nor lose native frames');
 for(let act=0;act<3;act++)equal(questVideoCaptionV34(film,(acts[act].startFrame+.25)/film.fps),film.captions[act].text,'each act starts with its own narrative caption');
 equal(questVideoRangeV34(film,9),whole,'invalid preview act falls back to the complete movie');
}
equal(questVideoClockV34(0),'0:00','zero clock');equal(questVideoClockV34(62.5),'1:02','readable minute clock');equal(questVideoClockV34(NaN),'0:00','invalid clock remains readable');
for(const key of ['Enter',' ','Escape','Tab','1','2','3','4','5','w','a','s','d','e'])check(questVideoCapturesKeyV34(key,{}),'gameplay keys are contained');
for(const key of ['F1','F5','F12'])check(!questVideoCapturesKeyV34(key,{}),'browser function keys pass through');
for(const modifier of ['ctrlKey','metaKey','altKey'])check(!questVideoCapturesKeyV34('r',{[modifier]:true}),'browser modified shortcuts pass through');
for(let count=1;count<=4;count++){
 equal(questVideoTabTargetV34('keydown',false,-1,count),0,'Tab enters first enabled button');
 equal(questVideoTabTargetV34('keydown',true,-1,count),count-1,'ShiftTab enters last enabled button');
 equal(questVideoTabTargetV34('keydown',false,count-1,count),0,'forward boundary wraps');
 equal(questVideoTabTargetV34('keydown',true,0,count),count-1,'backward boundary wraps');
 for(let index=0;index<count;index++)equal(questVideoTabTargetV34('keyup',false,index,count),null,'keyup never relocates focus');
}

// Execute the actual production effects and completion handler, not a duplicate lifecycle.
const componentSource=readFileSync('components/quest-cinematic.tsx','utf8');
const tree=ts.createSourceFile('quest-cinematic.tsx',componentSource,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let mediaEffect,portalEffect,focusEffect,finishExpression;
function visit(node){
 if(ts.isCallExpression(node)&&node.expression.getText(tree)==='useEffect'&&ts.isArrowFunction(node.arguments[0])){
  const source=node.arguments[0].getText(tree);
  if(source.includes('const media=video.current,motion='))mediaEffect=node.arguments[0];
  if(source.includes("document.createElement('div')"))portalEffect=node.arguments[0];
  if(source.includes('const captureKey='))focusEffect=node.arguments[0];
 }
 if(ts.isVariableDeclaration(node)&&node.name.getText(tree)==='finish')finishExpression=node.initializer;
 ts.forEachChild(node,visit);
}
visit(tree);for(const [name,effect]of Object.entries({mediaEffect,portalEffect,focusEffect,finishExpression}))check(effect,`production ${name} is found`);
const effectJs=effect=>ts.transpileModule(`const run=${effect.getText(tree)};return run();`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
class FakeNode{}
class FakeElement extends FakeNode{
 isConnected=true;children=[];parentElement=null;dataset={};
 constructor(owner){super();this.owner=owner;}
 focus(){this.owner.activeElement=this;}
 contains(target){return target===this||this.children.some(child=>child===target||child.contains?.(target));}
 appendChild(child){if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(entry=>entry!==child);if(child.contains?.(this.owner.activeElement))this.owner.activeElement=null;child.parentElement=this;this.children.push(child);return child;}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);this.parentElement=null;this.isConnected=false;}
 querySelectorAll(){return this.children.filter(child=>child instanceof FakeButton&&!child.disabled);}
 querySelector(){return this.querySelectorAll()[0];}
}
class FakeButton extends FakeElement{disabled=false;clicks=0;click(){this.clicks++;this.onclick?.();}}
class Events{
 events=new Map();
 addEventListener(name,listener,capture=false){const entries=this.events.get(name)||[];entries.push({listener,capture});this.events.set(name,entries);}
 removeEventListener(name,listener){this.events.set(name,(this.events.get(name)||[]).filter(entry=>entry.listener!==listener));}
 emit(name,event={}){for(const{listener}of[...(this.events.get(name)||[])])listener(event);}
 get listenerCount(){return[...this.events.values()].flat().length;}
}
class FakeMedia extends Events{
 muted=false;volume=.8;playbackRate=2;paused=true;ended=false;currentTime=0;duration=8;videoWidth=1280;videoHeight=720;readyState=2;seeking=false;dataset={};playCalls=0;pauseCalls=0;loadCalls=0;rejectPlay=false;
 load(){this.loadCalls++;}
 play(){this.playCalls++;if(this.rejectPlay)return Promise.reject(new Error('autoplay blocked'));this.paused=false;this.ended=false;this.emit('playing');return Promise.resolve();}
 pause(){this.pauseCalls++;if(!this.paused){this.paused=true;this.emit('pause');}}
}
const initialView={ready:false,failed:false,playing:false,buffering:false,finished:false,reduced:false,elapsed:0,blocked:false};
const mediaParameters=['scene','sceneAct','portalTarget','video','viewRef','setView','resolved','controls','window','document','matchMedia','requestAnimationFrame','cancelAnimationFrame','questVideoRangeV34','questVideoDurationMatchesV34','questVideoFrameV34','initialView'];
const bindMedia=new Function(...mediaParameters,effectJs(mediaEffect));
const bindFocus=new Function('portalTarget','dialog','window','document','HTMLElement','HTMLButtonElement','Node','questVideoCapturesKeyV34','questVideoTabTargetV34','finish','viewRef','togglePlayback',effectJs(focusEffect));
const bindFinish=new Function('resolved','video','viewRef','callbacks',ts.transpileModule(`return ${finishExpression.getText(tree)};`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText);
function player({id='long-tinta',act,reduced=false,hidden=false,focus=true}={}){
 const scene=films[id],media=new FakeMedia();media.duration=scene.durationSeconds;
 const doc=new Events();doc.hidden=hidden;doc.body=new FakeElement(doc);doc.activeElement=null;
 const restore=new FakeButton(doc);doc.activeElement=restore;
 const win=new Events(),timers=new Map(),rafs=new Map();let timerId=0,rafId=0;
 win.setTimeout=(callback,ms)=>{timers.set(++timerId,{callback,ms});return timerId;};win.clearTimeout=id=>timers.delete(id);
 const motion=new Events();motion.matches=reduced;
 const buttons=[new FakeButton(doc),new FakeButton(doc),new FakeButton(doc)];
 const dlg=new FakeElement(doc);dlg.children=buttons;
 let state={...initialView};const viewRef={current:state};const setView=change=>{state=typeof change==='function'?change(state):change;viewRef.current=state;};
 const resolved={current:false},controls={current:null},callbacks={current:{onComplete:()=>exits.push('complete'),onSkip:()=>exits.push('skip')}},exits=[];
 const finish=bindFinish(resolved,{current:media},viewRef,callbacks);
 const toggle=()=>media.paused?controls.current?.play():controls.current?.pause();
 const cleanupFocus=focus?bindFocus({}, {current:dlg},win,doc,FakeElement,FakeButton,FakeNode,questVideoCapturesKeyV34,questVideoTabTargetV34,finish,viewRef,toggle):()=>{};
 const cleanupMedia=bindMedia(scene,act,{}, {current:media},viewRef,setView,resolved,controls,win,doc,()=>motion,callback=>{rafs.set(++rafId,callback);return rafId;},id=>rafs.delete(id),questVideoRangeV34,questVideoDurationMatchesV34,questVideoFrameV34,initialView);
 buttons[0].onclick=toggle;buttons[1].onclick=()=>finish(true);buttons[2].onclick=()=>finish(false);
 return{scene,media,doc,win,motion,buttons,dlg,restore,viewRef,resolved,controls,exits,timers,rafs,finish,toggle,cleanupMedia,cleanup(){cleanupMedia();cleanupFocus();},get state(){return state;},ready(){media.emit('loadedmetadata');media.emit('loadeddata');},flushTimers(){for(const{id,callback}of[...timers].map(([id,timer])=>({id,...timer}))){timers.delete(id);callback();}},tick(time){media.currentTime=time;media.emit('timeupdate');},key(key,type='keydown',extra={}){let prevented=0,stopped=0;win.emit(type,{key,type,repeat:false,target:doc.activeElement,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;},...extra});return{prevented,stopped};}};
}
{
 const p=player();equal(p.media.loadCalls,1,'only mounted film is loaded');check(p.media.muted&&p.media.volume===0,'native media remains fully silent');equal(p.media.playbackRate,1,'video cannot inherit2x combat preference');equal(p.doc.activeElement,p.dlg,'initial focus reaches enabled dialog while video loads');
 p.media.emit('loadeddata');equal(p.state.ready,false,'decoded data without metadata is not enough');p.ready();equal(p.state.ready,true,'validated video metadata and data enable playback');equal(p.media.playCalls,1,'normal preference autoplays once');p.media.emit('canplay');equal(p.media.playCalls,1,'repeated readiness does not restart playback');equal(p.timers.size,0,'ready playback releases load watchdog');
 p.tick(1.4);equal(p.media.dataset.nativeFrame,String(Math.floor(1.4*24)),'progress follows native time');equal(p.state.elapsed,1.4,'accessible timeline follows video clock');p.toggle();equal(p.state.playing,false,'pause works');equal(p.media.currentTime,1.4,'pause preserves position');p.toggle();equal(p.state.playing,true,'manual resume works');equal(p.media.currentTime,1.4,'resume does not rewind');
 p.doc.hidden=true;p.doc.emit('visibilitychange');equal(p.media.paused,true,'hidden tab pauses native media');p.doc.hidden=false;p.doc.emit('visibilitychange');equal(p.media.playCalls,2,'returning to tab does not resume unexpectedly');
 p.cleanup();equal(p.media.listenerCount,0,'cleanup removes all media listeners');equal(p.doc.listenerCount,0,'cleanup removes visibility and focus listeners');equal(p.win.listenerCount,0,'cleanup removes keyboard listeners');equal(p.motion.listenerCount,0,'cleanup removes motion listener');equal(p.timers.size,0,'cleanup clears watchdog');equal(p.rafs.size,0,'cleanup clears native progress tracker');equal(p.controls.current,null,'cleanup invalidates generation controls');equal(p.doc.activeElement,p.restore,'closing player restores prior focus');
}
{
 const p=player();p.media.readyState=1;p.ready();equal(p.state.ready,false,'metadata alone does not promise a decoded native frame');equal(p.media.playCalls,0,'metadata-only video cannot start its quest clock');p.media.readyState=2;p.media.seeking=true;p.media.emit('canplay');equal(p.state.ready,false,'act seek must finish before declaring the frame ready');p.media.seeking=false;p.media.emit('seeked');check(p.state.ready,'completed seek with decoded data enables the player');equal(p.media.playCalls,1,'seek completion autoplays only once');p.cleanup();
}
{
 const p=player({reduced:true});p.ready();equal(p.media.playCalls,0,'reduced motion starts paused');check(p.state.ready&&p.state.reduced,'poster and controls remain available');p.controls.current.play();equal(p.media.playCalls,1,'reduced motion still permits explicit playback');p.motion.matches=true;p.motion.emit('change');equal(p.media.paused,true,'enabling reduced motion pauses playback');p.motion.matches=false;p.motion.emit('change');equal(p.media.playCalls,1,'disabling reduced motion does not force autoplay');p.cleanup();
}
{
 const p=player({hidden:true});p.ready();equal(p.media.playCalls,0,'initial hidden tab never autoplays');p.doc.hidden=false;p.doc.emit('visibilitychange');equal(p.media.playCalls,0,'visibility alone never starts the scene');p.controls.current.play();equal(p.media.playCalls,1,'explicit visible playback starts');p.cleanup();
}
for(const invalid of [{duration:0},{duration:NaN},{duration:Infinity},{duration:20},{videoWidth:0},{videoHeight:0}]){
 const p=player();Object.assign(p.media,invalid);p.ready();check(p.state.failed&&!p.state.ready,'wrong edit or audio-only media shows retry');equal(p.media.playCalls,0,'invalid film never autoplays');p.media.duration=p.scene.durationSeconds;p.media.videoWidth=1280;p.media.videoHeight=720;p.ready();check(p.state.failed&&!p.state.ready,'late readiness cannot revive a failed generation');p.cleanup();
}
{
 const p=player();equal([...p.timers.values()][0].ms,p.scene.loadTimeoutMs,'initial network load has declared watchdog');p.flushTimers();check(p.state.failed&&!p.state.ready,'missing file metadata reaches bounded retry');equal(p.exits,[],'network failure never completes or skips the quest silently');p.cleanup();
}
{
 const p=player();p.ready();p.media.emit('waiting');check(p.state.buffering,'stall has accessible progress feedback');equal(p.timers.size,1,'buffer stall arms watchdog');p.media.emit('playing');check(!p.state.buffering,'resumed native playback clears buffering');equal(p.timers.size,0,'resumed playback clears watchdog');p.media.emit('stalled');p.flushTimers();check(p.state.failed&&!p.state.ready,'permanent playback stall offers retry');equal(p.media.paused,true,'failed generation cannot continue invisibly');p.cleanup();
}
{
 const p=player();p.ready();p.controls.current.pause();p.media.emit('waiting');equal(p.timers.size,0,'intentional paused media does not trigger false network failure');p.cleanup();
}
{
 const p=player();p.media.rejectPlay=true;p.ready();await Promise.resolve();check(p.state.blocked&&p.state.ready&&!p.state.failed,'autoplay rejection keeps a manual play route');p.media.rejectPlay=false;p.controls.current.play();check(p.state.playing&&!p.state.blocked,'manual retry clears autoplay hint');p.cleanup();
}
{
 const p=player();p.media.rejectPlay=true;p.ready();p.cleanup();await Promise.resolve();check(!p.state.blocked,'old play rejection cannot mutate unmounted generation');
}
for(const id of ids){
 const p=player({id});p.finish(false);equal(p.exits,[],'continuation is unavailable before media is ready');p.ready();p.finish(false);equal(p.exits,[],'a playing film cannot complete the quest');
 p.media.currentTime=p.scene.durationSeconds;p.media.ended=true;p.media.paused=true;p.media.emit('ended');check(p.state.finished&&!p.state.playing,'native end enables explicit continuation');equal(p.media.dataset.nativeFrame,String(p.scene.frames-1),'native end retains final frame metadata');equal(p.media.currentTime,p.scene.durationSeconds,'full-film end does not seek away from decoded final frame');equal(p.exits,[],'native ended never completes a mission automatically');
 p.controls.current.play();check(!p.state.finished&&p.state.playing,'repeat clears ended state');equal(p.media.currentTime,0,'repeat starts full movie at zero');equal(p.state.elapsed,0,'repeat resets timeline');p.media.currentTime=p.scene.durationSeconds;p.media.ended=true;p.media.emit('ended');p.finish(false);p.finish(true);equal(p.exits,['complete'],'explicit continuation calls exactly once');p.cleanup();
}
for(const act of [0,1,2]){
 const p=player({act}),range=questVideoRangeV34(p.scene,act);p.ready();equal(p.media.currentTime,range.startSeconds,'preview starts at selected native third');equal(p.state.elapsed,range.startSeconds,'preview caption starts at selected third');p.tick(range.endSeconds);check(p.state.finished,'preview ends at its native boundary');equal(p.media.currentTime,range.endSeconds-1/24,'preview holds its own final native frame');equal(p.media.dataset.nativeFrame,String(range.endFrame-1),'preview never leaks the next act frame');equal(p.state.elapsed,range.endSeconds,'preview timeline reports completed range');p.controls.current.play();equal(p.media.currentTime,range.startSeconds,'preview repeat restarts only selected third');p.cleanup();
}
{
 const p=player();p.key('Enter');equal(p.exits,[],'Enter on dialog never completes or skips');equal(p.media.playCalls,0,'Enter does not skip initial media load');
 p.key('1');p.key('e');equal(p.exits,[],'game keys do not act behind cinema');for(const shortcut of [{ctrlKey:true},{altKey:true},{metaKey:true}])equal(p.key('r','keydown',shortcut),{prevented:0,stopped:0},'browser shortcuts stay usable');equal(p.key('F5'),{prevented:0,stopped:0},'browser reload stays usable');
 p.doc.activeElement=p.buttons[1];p.key('Tab','keyup');equal(p.doc.activeElement,p.buttons[1],'Tab release never relocates focus');p.doc.activeElement=p.buttons[2];p.key('Tab');equal(p.doc.activeElement,p.buttons[0],'Tab wraps at last enabled button');p.doc.activeElement=p.buttons[0];p.key('Tab','keydown',{shiftKey:true});equal(p.doc.activeElement,p.buttons[2],'ShiftTab wraps at first enabled button');
 const external=new FakeButton(p.doc);p.doc.activeElement=external;p.doc.emit('focusin',{target:external});equal(p.doc.activeElement,p.buttons[0],'focus cannot escape modal');
 p.ready();p.doc.activeElement=p.dlg;p.key(' ');equal(p.media.paused,true,'Space outside button pauses film');p.key(' ','keyup');equal(p.media.playCalls,1,'Space release never double-toggles');p.key(' ');equal(p.media.playCalls,2,'next Space explicitly resumes');
 p.doc.activeElement=p.buttons[0];p.key('Enter');equal(p.buttons[0].clicks,1,'Enter activates only the focused native button');p.key('Enter','keyup');equal(p.buttons[0].clicks,1,'Enter release does not activate twice');p.key('Escape');p.key('Escape');equal(p.exits,['skip'],'Escape is an explicit idempotent return');p.cleanup();
}
{
 const p=player();p.ready();p.doc.activeElement=p.buttons[2];p.buttons[2].disabled=true;p.key('Enter');equal(p.exits,[],'disabled Continue cannot accidentally finish');p.doc.activeElement=p.buttons[1];p.key('Enter');equal(p.exits,['skip'],'focused Skip is explicitly available');p.cleanup();
}
{
 const p=player();p.buttons.forEach(button=>button.disabled=true);equal(p.key('Tab'),{prevented:1,stopped:1},'no enabled control cannot leak Tab into the game');p.key('Escape','keydown',{repeat:true});equal(p.exits,[],'repeated held Escape does not exit');p.key('Escape');equal(p.exits,['skip'],'Escape remains available when controls are unavailable');p.cleanup();
}
// Fullscreen moves the existing portal host; it never replaces or reloads the decoded video.
{
 const doc=new Events();doc.fullscreenElement=null;doc.webkitFullscreenElement=null;doc.activeElement=null;doc.body=new FakeElement(doc);doc.createElement=()=>new FakeElement(doc);
 const mounted=[],cleanup=new Function('document','HTMLElement','setPortalTarget',effectJs(portalEffect))(doc,FakeElement,target=>mounted.push(target));
 const host=mounted[0],button=new FakeButton(doc),media=new FakeMedia();media.currentTime=3.5;media.paused=false;host.appendChild(button);host.children.push(media);doc.activeElement=button;
 equal(host.parentElement,doc.body,'normal cinema mounts into body');equal(host.dataset.questCinematicHost,'v34','private portal identity is explicit');
 const full=new FakeElement(doc);doc.fullscreenElement=full;doc.emit('fullscreenchange');equal(host.parentElement,full,'fullscreen tree contains the visible player');equal(doc.activeElement,button,'fullscreen transition retains focused control');equal(mounted.length,1,'fullscreen never changes the React portal target');equal(media.currentTime,3.5,'fullscreen never resets video clock');equal(media.loadCalls,0,'fullscreen never reloads video');equal(media.paused,false,'fullscreen never interrupts active video');
 doc.fullscreenElement=null;doc.emit('fullscreenchange');equal(host.parentElement,doc.body,'fullscreen exit returns the same host to body');equal(doc.activeElement,button,'fullscreen exit retains control focus');
 doc.webkitFullscreenElement=full;doc.emit('webkitfullscreenchange');equal(host.parentElement,full,'WebKit fullscreen is supported');doc.webkitFullscreenElement=null;doc.emit('webkitfullscreenchange');equal(host.parentElement,doc.body,'WebKit fullscreen exit returns to body');
 doc.fullscreenElement=host;doc.emit('fullscreenchange');equal(host.parentElement,doc.body,'fullscreen target cannot create a portal parenting cycle');
 cleanup();equal(host.parentElement,null,'unmount removes private host');equal(doc.listenerCount,0,'unmount removes fullscreen listeners');
 doc.fullscreenElement=full;const initial=[];const cleanupInitial=new Function('document','HTMLElement','setPortalTarget',effectJs(portalEffect))(doc,FakeElement,target=>initial.push(target));equal(initial[0].parentElement,full,'initial fullscreen mounts inside its visible tree');cleanupInitial();
}
// Current real React component remains SSR-safe and requests no media outside the client portal.
{
 const out=mkdtempSync(join(tmpdir(),'eter-quest-video-v34-')),require=createRequire(import.meta.url);
 writeFileSync(join(out,'registry.mjs'),ts.transpileModule(contractSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
 let js=ts.transpileModule(componentSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 for(const name of ['react/jsx-runtime','react','react-dom']){const url=pathToFileURL(require.resolve(name)).href;js=js.replaceAll(`from '${name}'`,`from '${url}'`).replaceAll(`from "${name}"`,`from "${url}"`);}
 js=js.replace(/from\s+['"]@\/lib\/art\/questCinematicsV34['"]/g,"from './registry.mjs'").replace(/from\s+['"]\.\/quest-cinematic\.module\.css['"]/g,"from './styles.mjs'");
 writeFileSync(join(out,'styles.mjs'),'export default {};');writeFileSync(join(out,'component.mjs'),js);
 const{QuestCinematic}=await import(pathToFileURL(join(out,'component.mjs')).href);
 for(const questId of [...ids,'missing-film'])for(const replay of [false,true])equal(renderToString(createElement(QuestCinematic,{questId,replay,onComplete:()=>{},onSkip:()=>{}})),'','native video portal is safe during server render');
}
// The opt-in artifact gate is used after the media producer exports all five final films.
// stts describes encoded samples; this measures the MP4's native clock, not CSS/RAF updates.
if(process.env.ETER_VERIFY_QUEST_MEDIA==='1'){
 const atoms=(bytes,start=0,end=bytes.length)=>{
  const list=[];
  for(let offset=start;offset+8<=end;){
   let size=bytes.readUInt32BE(offset),header=8;const type=bytes.toString('ascii',offset+4,offset+8);
   if(size===1){check(offset+16<=end,'64bit MP4 atom header is complete');size=Number(bytes.readBigUInt64BE(offset+8));header=16;}
   if(size===0)size=end-offset;
   check(Number.isSafeInteger(size)&&size>=header&&offset+size<=end,'MP4 atom stays inside its parent bounds');
   list.push({type,start:offset,data:offset+header,end:offset+size});offset+=size;
  }
  return list;
 };
 for(const film of Object.values(films)){
  const path='public'+film.src;check(existsSync(path),'final encoded mission film exists');check(existsSync('public'+film.poster),'standalone poster exists');
  const bytes=readFileSync(path),top=atoms(bytes),movie=top.find(atom=>atom.type==='moov');check(movie,'native MP4 movie metadata exists');
  check(top.some(atom=>atom.type==='mdat'),'encoded native video samples exist');
  const tracks=atoms(bytes,movie.data,movie.end).filter(atom=>atom.type==='trak');let measured;
  for(const track of tracks){
   const children=atoms(bytes,track.data,track.end),mdia=children.find(atom=>atom.type==='mdia');if(!mdia)continue;
   const media=atoms(bytes,mdia.data,mdia.end),handler=media.find(atom=>atom.type==='hdlr');if(!handler||bytes.toString('ascii',handler.data+8,handler.data+12)!=='vide')continue;
   const mdhd=media.find(atom=>atom.type==='mdhd'),minf=media.find(atom=>atom.type==='minf'),tkhd=children.find(atom=>atom.type==='tkhd');check(mdhd&&minf&&tkhd,'video track has timing, dimensions and media information');
   const version=bytes[mdhd.data],timeScale=bytes.readUInt32BE(mdhd.data+(version===1?20:12));check(timeScale>0,'native video has positive timing resolution');
   const table=atoms(bytes,minf.data,minf.end).find(atom=>atom.type==='stbl');check(table,'native samples have a table');
   const tables=atoms(bytes,table.data,table.end),stts=tables.find(atom=>atom.type==='stts'),stsz=tables.find(atom=>atom.type==='stsz');check(stts&&stsz,'native samples have timing and count tables');
   let samples=0,ticks=0;const entries=bytes.readUInt32BE(stts.data+4),sampleCount=bytes.readUInt32BE(stsz.data+8);
   for(let entry=0;entry<entries;entry++){const count=bytes.readUInt32BE(stts.data+8+entry*8),delta=bytes.readUInt32BE(stts.data+12+entry*8);samples+=count;ticks+=count*delta;check(Math.abs(timeScale/delta-film.fps)<.001,'every encoded timing segment is24fps');}
   measured={samples,sampleCount,duration:ticks/timeScale,width:bytes.readUInt32BE(tkhd.end-8)/65536,height:bytes.readUInt32BE(tkhd.end-4)/65536};
  }
  check(measured,'MP4 contains an actual video track');equal(measured.samples,film.frames,'native sample count matches the final edit');equal(measured.sampleCount,film.frames,'native sample table agrees with24fps edit count');check(questVideoDurationMatchesV34(film,measured.duration),'native edit duration matches the playback guard');equal([measured.width,measured.height],[1280,720],'final movie retains the approved native1280x720 resolution');check(Math.abs(measured.width/measured.height-16/9)<.025,'encoded native film preserves cinematic16:9');
 }
}
console.log(`quest-video-v34: ${checks} checks passed;5 native film contracts,actual player lifecycle,fullscreen,keyboard,previews,replay${process.env.ETER_VERIFY_QUEST_MEDIA==='1'?',final MP4 artifacts':''}.`);
