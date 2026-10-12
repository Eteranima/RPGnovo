import type {GameEngine} from './engine';
import {WorldRenderer} from './renderer';
import {createGameKeyboardControls,type GameControlContext} from './ui-controls';
import type {WorldLoadingStatusV32} from './worldAssetsV32';

type GameWorldRenderer=Pick<WorldRenderer,'load'|'destroy'|'getLoadingState'>;
export type GameWorldRuntimeContext={
 engine:GameEngine;canvas:HTMLCanvasElement;
 controls:Omit<GameControlContext,'engine'|'loading'>;
 onLoading:(status:WorldLoadingStatusV32)=>void;
 onLoaded:(loaded:boolean)=>void;
 onRenderer:(renderer:WorldRenderer|null)=>void;
};
export type GameWorldRuntimeEnvironment={
 window:Pick<Window,'addEventListener'|'removeEventListener'>;
 document:Pick<Document,'addEventListener'|'removeEventListener'>;
 createRenderer:(canvas:HTMLCanvasElement,engine:GameEngine,onLoading:(status:WorldLoadingStatusV32)=>void)=>GameWorldRenderer;
};
/** Late loading callbacks cannot publish state after route/unmount cleanup. */
export function mountGameWorld(context:GameWorldRuntimeContext,env?:GameWorldRuntimeEnvironment){
 const browser=env??{window,document,createRenderer:(canvas:HTMLCanvasElement,engine:GameEngine,onLoading:(status:WorldLoadingStatusV32)=>void)=>new WorldRenderer(canvas,engine,{onLoadingChange:onLoading})};
 let disposed=false;
 context.engine.setBattleArtGateV32(true);context.engine.hydrate();
 const renderer=browser.createRenderer(context.canvas,context.engine,status=>{if(!disposed)context.onLoading(status);});
 context.onRenderer(renderer as WorldRenderer);
 void renderer.load().then(loaded=>{if(!disposed)context.onLoaded(loaded);});
 const controls=createGameKeyboardControls({...context.controls,engine:context.engine,loading:()=>renderer.getLoadingState()});
 browser.window.addEventListener('keydown',controls.down);browser.window.addEventListener('keyup',controls.up);browser.window.addEventListener('blur',controls.blur);
 browser.document.addEventListener('visibilitychange',controls.blur);
 return()=>{
  if(disposed)return;disposed=true;
  browser.window.removeEventListener('keydown',controls.down);browser.window.removeEventListener('keyup',controls.up);browser.window.removeEventListener('blur',controls.blur);
  browser.document.removeEventListener('visibilitychange',controls.blur);controls.blur();renderer.destroy();context.onRenderer(null);context.engine.dispose();
 };
}
