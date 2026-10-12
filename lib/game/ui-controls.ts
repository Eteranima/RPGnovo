import type {GameEngine} from './engine';
import type {HeroId} from './data';
import type {GamePanel} from './ui-session';
import {advanceMasterSequence,emptyMasterSequence} from './master-mode';

export type GameKeyInput=Pick<KeyboardEvent,'key'|'repeat'|'target'|'preventDefault'> & Partial<Pick<KeyboardEvent,'ctrlKey'|'altKey'|'metaKey'>>;
type InteractiveTarget=Pick<Element,'closest'>;
export type GameControlContext={
 engine:GameEngine;
 panel:()=>GamePanel;
 opening:()=>boolean;
 suspended?:()=>boolean;
 loaded:()=>boolean;
 titleArmed:()=>boolean;
 loading:()=>{loading:boolean;error?:unknown}|null|undefined;
 closePanel:()=>void;
 openMenu:(tab?:string,focus?:string)=>void;
 setTarget:(id:HeroId)=>void;
 activateTitle:()=>void;
 toggleMusic:()=>void;
 startSelectedOrigin?:()=>void;
 element?:(target:EventTarget|null)=>InteractiveTarget|null;
 now?:()=>number;
};
const targetElement=(target:EventTarget|null)=>typeof Element!=='undefined'&&target instanceof Element?target:null;
const browserShortcut=(event:GameKeyInput)=>event.ctrlKey||event.metaKey||event.altKey||/^F\d+$/.test(event.key);

/** The same exported handlers are mounted by React and exercised by game tests. */
export function createGameKeyboardControls(context:GameControlContext){
 const {engine}=context;let masterSequence=emptyMasterSequence();
 const down=(event:GameKeyInput)=>{
  // Browser/application shortcuts never become movement, techniques or game commands.
  if(browserShortcut(event))return;
  const target=(context.element??targetElement)(event.target);
  if(target?.closest('input,select,textarea,[role=slider]'))return;
  if(engine.state.autoChessSessionV39){engine.clearMovement();return;}
  const key=event.key.length===1?event.key.toLowerCase():event.key;
  if(context.opening()||context.suspended?.()){
   const buttonActivation=(key==='Enter'||key===' ')&&!!target?.closest('button');
   engine.clearMovement();if(!browserShortcut(event)&&!buttonActivation)event.preventDefault();return;
  }
  if(engine.state.questCinematic){
   if(!browserShortcut(event)&&!target?.closest('button'))event.preventDefault();
   engine.clearMovement();return;
  }
  if(key==='Escape'){
   if(engine.state.mode==='selection')engine.returnToTitle();
   if(context.panel()){event.preventDefault();context.closePanel();}
   engine.clearMovement();return;
  }
  if(context.panel())return;
  const loading=context.loading();
  if(loading&&(loading.loading||loading.error)){
   engine.clearMovement();if(!browserShortcut(event)&&!target?.closest('button'))event.preventDefault();return;
  }
  if(key==='Tab'&&target?.closest('[data-exploration-party]'))return;
  if(target?.closest('button,[role=tab]')&&(key==='Enter'||key===' '))return;
  if(!event.repeat&&/^[1-5]$/.test(key)){
   const slot=Number(key)-1,ally=engine.state.heroes[slot];
   if(engine.state.mode==='world'&&!engine.paused){event.preventDefault();engine.selectPartySlot(slot);return;}
   if(engine.state.mode==='battle'&&ally&&!engine.state.battle?.result){event.preventDefault();context.setTarget(ally.id);return;}
  }
  if(engine.state.mode==='world'&&!engine.paused&&!event.repeat&&!engine.state.progress.masterMode){
   const result=advanceMasterSequence(masterSequence,key,(context.now??Date.now)());masterSequence=result.state;
   if(result.activated){event.preventDefault();engine.clearMovement();engine.activateMasterMode();return;}
  }
  if(engine.state.mode==='selection'){
   if(key==='Enter'&&!event.repeat){event.preventDefault();context.startSelectedOrigin?.();}
   return;
  }
  if(engine.state.mode==='start'){
   if(key==='Enter'&&!event.repeat&&context.loaded()){
    event.preventDefault();
    if(!context.titleArmed())context.activateTitle();
    else if(engine.state.hasSave)engine.start(true);
    else engine.selectProtagonist();
   }
   return;
  }
  if(engine.state.mode==='world'&&!engine.paused&&!event.repeat&&['q','r','Tab','g','i','k','m','l','v','o','p',' '].includes(key)){
   event.preventDefault();
   if(key==='Tab')engine.swapLeader();
   else if(key==='q'||key==='r')engine.quickField(key==='q'?0:1);
   else if(key==='p')context.toggleMusic();
   else if(key===' ')engine.blink();
   else context.openMenu(({g:'party',i:'bag',k:'skills',m:'map',l:'quests',v:'achievements',o:'gacha'} as Record<string,string>)[key]);
   return;
  }
  if(key==='Enter'&&engine.state.mode==='world'&&!event.repeat){event.preventDefault();context.openMenu();return;}
  if(!engine.paused&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Enter'].includes(key))event.preventDefault();
  if(engine.state.mode==='world'&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','Shift'].includes(key))engine.keys.add(key);
  if(!event.repeat&&(key==='e'||key==='Enter'||key===' ')){
   if(engine.state.mode==='cutscene')engine.nextCutscene();
   else if(engine.state.mode==='dialogue')engine.nextDialogue();
   else if(key!=='Enter')engine.interact();
  }
 };
 const up=(event:Pick<KeyboardEvent,'key'>)=>engine.keys.delete(event.key.length===1?event.key.toLowerCase():event.key);
 const blur=()=>engine.clearMovement();
 return {down,up,blur};
}

export type GamePointerInput={preventDefault:()=>void;pointerId:number;currentTarget:{setPointerCapture:(id:number)=>void}};
export function createGamePointerControls(engine:GameEngine,context:{blocked:()=>boolean;focus:()=>void;click:(x:number,y:number)=>void}){
 const hold=(key:string)=>({
  onPointerDown:(event:GamePointerInput)=>{event.preventDefault();if(context.blocked())return;event.currentTarget.setPointerCapture(event.pointerId);engine.keys.add(key);},
  onPointerUp:()=>{engine.keys.delete(key);},
  onPointerCancel:()=>{engine.keys.delete(key);},
  onLostPointerCapture:()=>{engine.keys.delete(key);}
 });
 const canvasPointerUp=(event:{clientX:number;clientY:number})=>{if(context.blocked())return;context.focus();context.click(event.clientX,event.clientY);};
 return {hold,canvasPointerUp};
}
