import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';

let checks = 0;
const equal = (a,b,message) => {assert.deepEqual(a,b,message); checks++;};
const check = (value,message) => {assert.ok(value,message); checks++;};
const contractSource = readFileSync('lib/art/openingCinematicV33.ts','utf8');
const exports = {};
new Function('exports',ts.transpileModule(contractSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText)(exports);
const {OPENING_CINEMATIC_V33:film,openingFrameAtV33,openingClockV33,openingDurationMatchesV33,openingCapturesKeyV33,openingTabTargetV33} = exports;
equal(film.frames / film.fps,film.durationSeconds,'the actual edit contract is 1500 frames at 24 fps');
equal(film.durationSeconds,62.5,'runtime duration is exactly 62.5 seconds');
equal(film.src,'/assets/v33/opening/eter-anima-opening-24fps.mp4','only the final encoded film is requested');
for (let frame=0;frame<1500;frame++) equal(openingFrameAtV33((frame+.25)/24),frame,'native clock maps to the encoded frame');
for (const value of [-1,NaN,Infinity,-Infinity]) equal(openingFrameAtV33(value),0,'invalid times never leave the frame range');
for (const value of [62.5,63,1000]) equal(openingFrameAtV33(value),1499,'the end retains the last frame');
for (const value of [62.5,62.5+1/24,62.5-1/24]) check(openingDurationMatchesV33(value),'one frame of media-container duration tolerance is accepted');
for (const value of [0,NaN,Infinity,62.6,62.4]) check(!openingDurationMatchesV33(value),'a missing or different edit is rejected');
equal(openingClockV33(0),'0:00','initial clock is readable');
equal(openingClockV33(62.5),'1:02','the time display does not overflow');
for (const key of ['1','2','3','4','5','Enter',' ','Escape','Tab','w','e','p']) check(openingCapturesKeyV33(key,{}),'cinema contains gameplay keys');
for (const key of ['F1','F5','F12']) check(!openingCapturesKeyV33(key,{}),'browser function keys remain available');
for (const modifier of ['ctrlKey','altKey','metaKey']) check(!openingCapturesKeyV33('r',{[modifier]:true}),'browser shortcuts remain available');
for (let count=1;count<=4;count++) {
 equal(openingTabTargetV33('keydown',false,-1,count),0,'initial Tab reaches the first enabled control');
 equal(openingTabTargetV33('keydown',true,-1,count),count-1,'initial Shift Tab reaches the last control');
 equal(openingTabTargetV33('keydown',false,count-1,count),0,'Tab wraps forward');
 equal(openingTabTargetV33('keydown',true,0,count),count-1,'Tab wraps backward');
 for (let current=0;current<count;current++) equal(openingTabTargetV33('keyup',false,current,count),null,'keyup never moves focus again');
}
equal(openingTabTargetV33('keydown',false,0,0),null,'zero controls does not invent a focus target');

// Execute the production media effect with real event ordering. No duplicate player lifecycle is copied here.
const component = ts.createSourceFile('opening-cinematic-v33.tsx',readFileSync('components/opening-cinematic-v33.tsx','utf8'),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let mediaEffect, portalEffect;
function visit(node) {
 if (ts.isCallExpression(node) && node.expression.getText(component)==='useEffect' && ts.isArrowFunction(node.arguments[0]) && node.arguments[0].getText(component).includes('const media = video.current, motion =')) mediaEffect = node.arguments[0];
 if (ts.isCallExpression(node) && node.expression.getText(component)==='useEffect' && ts.isArrowFunction(node.arguments[0]) && node.arguments[0].getText(component).includes("document.createElement('div')")) portalEffect = node.arguments[0];
 ts.forEachChild(node,visit);
}
visit(component); check(mediaEffect,'the production media lifecycle is found');
check(portalEffect,'the production fullscreen portal lifecycle is found');
const js = ts.transpileModule(`const run=${mediaEffect.getText(component)};return run();`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
class FakeNode {}
class FakeElement extends FakeNode {isConnected=true; focus(){this.owner.activeElement=this;} constructor(owner){super();this.owner=owner;}}
class FakeButton extends FakeElement {disabled=false;clicks=0;click(){this.clicks++;}}
class Events {events=new Map();addEventListener(name,listener,capture=false){const list=this.events.get(name)||[];list.push({listener,capture});this.events.set(name,list);}removeEventListener(name,listener){this.events.set(name,(this.events.get(name)||[]).filter(event=>event.listener!==listener));}emit(name,event={}){for(const {listener} of [...(this.events.get(name)||[])])listener(event);}}
class FakeMedia extends Events {
 muted=false;volume=.6;playbackRate=2;paused=true;ended=false;currentTime=0;duration=62.5;dataset={};playCalls=0;pauseCalls=0;loadCalls=0;
 load(){this.loadCalls++;}
 play(){this.playCalls++;this.paused=false;this.emit('playing');return Promise.resolve();}
 pause(){this.pauseCalls++;if(!this.paused){this.paused=true;this.emit('pause');}}
}
// Fullscreen changes move the existing host, rather than changing the React
// portal container and recreating the decoded media element.
{
 const doc = new Events();doc.fullscreenElement=null;doc.webkitFullscreenElement=null;doc.activeElement=null;
 class PortalElement extends FakeElement {
  children=[];parentElement=null;dataset={};
  contains(target){return target===this || this.children.some(child=>child===target || child.contains?.(target));}
  append(child){
   if(child.parentElement)child.parentElement.children=child.parentElement.children.filter(entry=>entry!==child);
   if(child.contains(doc.activeElement))doc.activeElement=null;
   child.parentElement=this;this.children.push(child);
  }
  appendChild(child){this.append(child);return child;}
  remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);this.parentElement=null;this.isConnected=false;}
 }
 doc.body=new PortalElement(doc);doc.createElement=()=>new PortalElement(doc);
 const full=new PortalElement(doc),otherFull=new PortalElement(doc),containers=[];
 const portalJs=ts.transpileModule(`const run=${portalEffect.getText(component)};return run();`,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.None}}).outputText;
 const cleanup=new Function('document','HTMLElement','setPortalTarget',portalJs)(doc,FakeElement,container=>containers.push(container));
 const host=containers[0];equal(host.parentElement,doc.body,'normal opening mounts inside body');equal(host.dataset.openingCinematicHost,'v33','host identity is explicit');
 const control=new FakeButton(doc),media=new FakeMedia();media.currentTime=19.25;media.paused=false;host.children.push(control,media);doc.activeElement=control;
 doc.fullscreenElement=full;doc.emit('fullscreenchange');equal(host.parentElement,full,'fullscreen opening moves into the visible fullscreen element');equal(doc.activeElement,control,'moving into fullscreen preserves the focused control');equal(containers.length,1,'portal container identity stays stable');equal(media.currentTime,19.25,'fullscreen does not rewind the decoded video');equal(media.loadCalls,0,'fullscreen never reloads native media');equal(media.paused,false,'fullscreen does not interrupt active playback');
 doc.fullscreenElement=otherFull;doc.emit('fullscreenchange');equal(host.parentElement,otherFull,'changing fullscreen element reparents the same host');equal(doc.activeElement,control,'changing fullscreen retains control focus');
 doc.fullscreenElement=null;doc.emit('fullscreenchange');equal(host.parentElement,doc.body,'leaving fullscreen returns the existing player to body');equal(doc.activeElement,control,'leaving fullscreen retains control focus');equal(containers.length,1,'all fullscreen transitions retain the one portal instance');
 doc.webkitFullscreenElement=full;doc.emit('webkitfullscreenchange');equal(host.parentElement,full,'WebKit fullscreen is supported');doc.webkitFullscreenElement=null;doc.emit('webkitfullscreenchange');equal(host.parentElement,doc.body,'WebKit exit returns to body');
 doc.fullscreenElement={nodeName:'svg'};doc.emit('fullscreenchange');equal(host.parentElement,doc.body,'non-HTML fullscreen elements use the requested body fallback');
 cleanup();equal(host.parentElement,null,'unmount removes the private portal host');equal([...doc.events.values()].flat().length,0,'unmount removes both fullscreen listeners');
 doc.fullscreenElement=full;const initiallyFull=[];
 const cleanupInitial=new Function('document','HTMLElement','setPortalTarget',portalJs)(doc,FakeElement,container=>initiallyFull.push(container));
 equal(initiallyFull[0].parentElement,full,'opening already in fullscreen mounts directly into the visible fullscreen tree');equal(initiallyFull.length,1,'initial fullscreen also creates a single stable portal');cleanupInitial();
}
const parameters=['portalTarget','video','dialog','playButton','autoplay','setView','resolved','playbackCallback','viewRef','exit','togglePlayback','window','document','matchMedia','HTMLElement','HTMLButtonElement','Node','requestAnimationFrame','cancelAnimationFrame','OPENING_CINEMATIC_V33','openingDurationMatchesV33','openingFrameAtV33','openingCapturesKeyV33','openingTabTargetV33','initialView'];
const bind = new Function(...parameters,js);
function player({reduced=false,autoplay=true}={}) {
 const doc = new Events();doc.hidden=false;doc.activeElement=null;
 const win = new Events(),timers=new Map();let timerId=0;
 win.setTimeout=(callback,ms)=>{timers.set(++timerId,{callback,ms});return timerId;};win.clearTimeout=id=>timers.delete(id);
 const motion = new Events();motion.matches=reduced;
 const restore = new FakeButton(doc);doc.activeElement=restore;
 const buttons=[new FakeButton(doc),new FakeButton(doc)];
 const dlg = new FakeElement(doc);dlg.contains=target=>target===dlg||buttons.includes(target);dlg.querySelector=()=>buttons.find(button=>!button.disabled);dlg.querySelectorAll=()=>buttons.filter(button=>!button.disabled);
 const media = new FakeMedia(),exits=[],playReports=[],resolved={current:false};
 let state={ready:false,failed:false,playing:false,buffering:false,finished:false,reduced:false,elapsed:0,blocked:false};
 const viewRef={current:state};const setView=change=>{state=typeof change==='function'?change(state):change;viewRef.current=state;};
 const toggle=()=>media.paused?media.play():media.pause();
 const cleanup=bind({}, {current:media},{current:dlg},{current:buttons[0]},autoplay,setView,resolved,{current:value=>playReports.push(value)},viewRef,reason=>exits.push(reason),toggle,win,doc,()=>motion,FakeElement,FakeButton,FakeNode,()=>1,()=>{},film,openingDurationMatchesV33,openingFrameAtV33,openingCapturesKeyV33,openingTabTargetV33,{...state});
 return {media,doc,win,motion,buttons,dlg,restore,exits,playReports,timers,cleanup,get state(){return state;},ready(){media.emit('loadedmetadata');media.emit('loadeddata');},key(key,type='keydown',extra={}){let prevented=0,stopped=0;win.emit(type,{key,type,repeat:false,target:doc.activeElement,preventDefault(){prevented++;},stopImmediatePropagation(){stopped++;},...extra});return {prevented,stopped};}};
}
{
 const p=player();equal(p.media.loadCalls,1,'film starts loading only while the player is mounted');check(p.media.muted&&p.media.volume===0,'both media properties silence the film');equal(p.media.playbackRate,1,'film cannot inherit battle speed');
 equal(p.state.ready,false,'load alone never claims a decoded frame is ready');p.ready();equal(p.state.ready,true,'matching metadata and decoded data open the player');equal(p.media.playCalls,1,'normal gesture-requested opening plays once');equal(p.playReports,[true],'playback report follows actual playing event');
 for(const key of ['1','2','3','4','5','Enter'])equal(p.key(key),{prevented:1,stopped:1},'global gameplay shortcuts cannot receive a modal key');
 equal(p.key('F5'),{prevented:0,stopped:0},'refresh stays available');equal(p.key('r','keydown',{ctrlKey:true}),{prevented:0,stopped:0},'browser shortcut stays available');
 p.doc.activeElement=p.buttons[1];p.key('Tab');equal(p.doc.activeElement,p.buttons[0],'production handler wraps forward focus');
 p.key('Tab','keyup');equal(p.doc.activeElement,p.buttons[0],'Tab release does not advance again');
 p.key('Tab','keydown',{shiftKey:true});equal(p.doc.activeElement,p.buttons[1],'production handler wraps backward focus');
 p.key('Enter');equal(p.buttons[1].clicks,1,'Enter activates only the focused cinematic button');
 const external=new FakeButton(p.doc);p.doc.activeElement=external;p.doc.emit('focusin',{target:external});equal(p.doc.activeElement,p.buttons[0],'programmatic focus cannot leak to underlying gameplay');
 p.doc.hidden=true;p.doc.emit('visibilitychange');equal(p.media.paused,true,'hidden tab pauses playback');equal(p.state.playing,false,'view follows media pause');
 p.doc.hidden=false;p.doc.emit('visibilitychange');equal(p.media.playCalls,1,'returning to the tab requires explicit resume');
 p.media.emit('stalled');equal(p.state.buffering,false,'a paused preload stall does not pretend the viewer is waiting for playback');equal(p.timers.size,0,'paused native preloading does not create a false timeout');
 p.media.currentTime=62.5;p.media.ended=true;p.media.emit('ended');check(p.state.finished,'end is an explicit finished state');equal(p.media.dataset.nativeFrame,'1499','last decoded frame remains selected');equal(p.exits,[],'ending never exits or changes the campaign automatically');equal(p.media.currentTime,62.5,'end does not rewind to the poster');
 p.key('Escape');equal(p.exits,['finished'],'Escape can return after completion');p.cleanup();equal(p.doc.activeElement,p.restore,'unmount restores connected opening-screen focus');equal(p.timers.size,0,'unmount clears every watchdog');
 equal([...p.win.events.values()].flat().length,0,'unmount removes keyboard capture listeners');equal([...p.doc.events.values()].flat().length,0,'unmount removes visibility and focus listeners');
}
{
 const p=player({reduced:true});p.ready();check(p.state.reduced,'system motion preference is exposed');equal(p.media.playCalls,0,'reduced motion starts paused');p.key(' ','keydown',{target:p.dlg});equal(p.media.playCalls,1,'explicit playback is still available with reduced motion');p.cleanup();
}
{
 const p=player({autoplay:false});p.ready();equal(p.media.playCalls,0,'caller can request manual playback');p.cleanup();
}
{
 const p=player();p.media.duration=65;p.ready();check(p.state.failed&&!p.state.ready,'wrong edit duration is a load failure');equal(p.media.playCalls,0,'an unvalidated replacement film never starts');p.cleanup();
}
{
 const p=player();const timer=[...p.timers.values()][0];equal(timer.ms,30000,'loading has a bounded timeout');timer.callback();check(p.state.failed&&!p.state.ready,'stalled load displays a real failure');p.ready();check(p.state.failed&&!p.state.ready,'late media data cannot bypass the explicit retry path');equal(p.media.playCalls,0,'late load never autoplays after failure');p.key('Escape');equal(p.exits,['skip'],'load failure still permits returning to the opening');p.cleanup();
}
{
 const p=player();p.ready();p.motion.matches=true;p.motion.emit('change');check(p.state.reduced&&p.media.paused,'switching on reduced motion pauses the active film');p.motion.matches=false;p.motion.emit('change');equal(p.media.playCalls,1,'switching off reduced motion does not force playback');p.cleanup();
}
console.log(`${checks} opening cinematic v33 checks passed. Media assets are validated separately after export.`);
