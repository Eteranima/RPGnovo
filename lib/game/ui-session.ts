import type {GameEngine} from './engine';

export type GamePanel='journal'|'bag'|'help'|'menu'|null;
export type GameUiSessionState={panel:GamePanel;opening:boolean;confirmReset:boolean;updating?:boolean};
export type GameUiSessionContext={
 read:()=>GameUiSessionState;
 setPanel:(panel:GamePanel)=>void;
 setOpening:(opening:boolean)=>void;
 setMenuTab:(tab:string)=>void;
 setActiveMenuTab:(tab:string)=>void;
 setMenuFocus:(focus:string|undefined)=>void;
 onOpeningGesture?:()=>void;
};

/** UI transitions keep cinematic sessions and persistent gameplay in the engine. */
export function createGameUiActions(engine:GameEngine,context:GameUiSessionContext){
 const openMenu=(tab='party',focus?:string)=>{
  if(engine.state.mode!=='world'||context.read().opening||context.read().updating)return;
  engine.clearMovement();engine.paused=true;
  context.setMenuTab(tab);context.setActiveMenuTab(tab);context.setMenuFocus(focus);context.setPanel('menu');
 };
 const showOpening=()=>{
  const ui=context.read();
  if(engine.state.mode!=='start'||ui.opening||ui.panel||ui.confirmReset||ui.updating)return;
  engine.clearMovement();engine.paused=true;context.onOpeningGesture?.();context.setOpening(true);
 };
 const closeOpening=()=>{
  context.setOpening(false);engine.clearMovement();
  const ui=context.read();engine.paused=!!engine.state.saveConflictV36||!!ui.panel||ui.confirmReset;
 };
 const replayQuestScene=(questId:string)=>{
  if(context.read().updating)return;
  if(!engine.replayQuestCinematic(questId))return;
  engine.paused=true;context.setPanel(null);
 };
 const finishQuestScene=(token:number,skip=false)=>{
  const session=engine.state.questCinematic;
  if(!session||session.token!==token)return;
  const {replay,questId}=session;
  if(!engine.finishQuestCinematic(skip,token))return;
  if(replay)openMenu('scenes',questId);
 };
 const closePanel=()=>{engine.clearMovement();if(!context.read().updating)context.setPanel(null);};
 const goTo=(id:string)=>{if(context.read().updating)return;engine.paused=false;context.setPanel(null);engine.approach(id);};
 return {openMenu,showOpening,closeOpening,replayQuestScene,finishQuestScene,closePanel,goTo};
}

export function synchronizeGamePause(engine:GameEngine,ui:GameUiSessionState){
 engine.paused=!!engine.state.saveConflictV36||!!ui.panel||ui.confirmReset||ui.opening||!!ui.updating||!!engine.state.questCinematic?.replay;
 if(engine.paused)engine.clearMovement();
}
