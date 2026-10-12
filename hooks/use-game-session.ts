'use client';
import {useCallback,useEffect,useMemo,useRef,useState,useSyncExternalStore} from 'react';
import {GameEngine} from '@/lib/game/engine';
import type {HeroId} from '@/lib/game/data';
import {OBJECTIVES} from '@/lib/game/data';
import type {WorldRenderer} from '@/lib/game/renderer';
import type {WorldLoadingStatusV32} from '@/lib/game/worldAssetsV32';
import {createGameUiActions,synchronizeGamePause,type GamePanel} from '@/lib/game/ui-session';
import {createGamePointerControls} from '@/lib/game/ui-controls';
import {canApplyGameUpdate,prepareGameUpdate} from '@/lib/game/ui-update';
import {importGameSaveTransfer} from '@/lib/game/ui-save-transfer';
import {useGameAudio} from './use-game-audio';
import {useGameFullscreen} from './use-game-fullscreen';
import {useGameWorld} from './use-game-world';

type SessionUi={panel:GamePanel;confirmReset:boolean;target:HeroId;menuTab:string;activeMenuTab:string;menuFocus?:string;chosen:HeroId;titleArmed:boolean;opening:boolean;updating:boolean};
const initialUi:SessionUi={panel:null,confirmReset:false,target:'seiji',menuTab:'party',activeMenuTab:'party',chosen:'seiji',titleArmed:false,opening:false,updating:false};

export function useGameSession(){
 const [engine]=useState(()=>new GameEngine());
 const s=useSyncExternalStore(engine.subscribe,engine.snapshot,engine.snapshot);
 const shell=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null),renderer=useRef<WorldRenderer|null>(null);
 const [ui,setUi]=useState<SessionUi>(initialUi),uiRef=useRef(ui);uiRef.current=ui;
 const [loaded,setLoaded]=useState(false),loadedRef=useRef(loaded);loadedRef.current=loaded;
 const [viewport,setViewport]=useState<HTMLElement|null>(null),[worldLoading,setWorldLoading]=useState<WorldLoadingStatusV32|null>(null),loadingRef=useRef(worldLoading);loadingRef.current=worldLoading;
 const patch=useCallback((values:Partial<SessionUi>)=>{if(uiRef.current.updating&&values.updating===undefined)return;uiRef.current={...uiRef.current,...values};setUi(previous=>({...previous,...values}));},[]);
 const audio=useGameAudio(engine,s,ui.opening),fullscreen=useGameFullscreen(engine,shell);
 const actions=useMemo(()=>createGameUiActions(engine,{
  read:()=>uiRef.current,onOpeningGesture:audio.prepareOpening,
  setPanel:panel=>patch({panel}),setOpening:opening=>patch({opening}),
  setMenuTab:menuTab=>patch({menuTab}),setActiveMenuTab:activeMenuTab=>patch({activeMenuTab}),setMenuFocus:menuFocus=>patch({menuFocus})
 }),[engine,patch,audio.prepareOpening]);
 const activateTitle=useCallback(()=>{patch({titleArmed:true});audio.unlock();},[patch,audio.unlock]);
 const controls=useMemo(()=>({
  panel:()=>uiRef.current.panel,opening:()=>uiRef.current.opening,suspended:()=>uiRef.current.updating||!!engine.state.saveConflictV36,loaded:()=>loadedRef.current,titleArmed:()=>uiRef.current.titleArmed,
  closePanel:actions.closePanel,openMenu:actions.openMenu,setTarget:(target:HeroId)=>patch({target}),activateTitle,toggleMusic:audio.toggle,
  startSelectedOrigin:()=>document.querySelector<HTMLButtonElement>('[data-origin-start]')?.click()
 }),[actions,patch,activateTitle,audio.toggle]);
 useGameWorld(engine,canvas,renderer,controls,setWorldLoading,setLoaded);
 const pointer=useMemo(()=>createGamePointerControls(engine,{
  blocked:()=>uiRef.current.opening||uiRef.current.updating||!!engine.state.saveConflictV36,
  focus:()=>shell.current?.focus(),click:(x,y)=>renderer.current?.click(x,y)
 }),[engine]);
 useEffect(()=>{if(!s.heroes.some(hero=>hero.id===ui.target))patch({target:s.heroes[0].id});},[s.heroes.map(hero=>hero.id).join(','),ui.target,patch]);
 useEffect(()=>{
  if(!s.overlay)return;
  patch({menuTab:s.overlay,activeMenuTab:s.overlay,panel:'menu'});engine.state.overlay=null;
 },[s.overlay,engine,patch]);
 useEffect(()=>{const changed=(event:StorageEvent)=>{if(event.key==='eter-anima-stone-reach-v1')engine.checkSaveConflictV36();};window.addEventListener('storage',changed);return()=>window.removeEventListener('storage',changed);},[engine]);
 useEffect(()=>{if(s.saveConflictV36)patch({panel:null,opening:false,confirmReset:false});},[s.saveConflictV36,patch]);
 useEffect(()=>synchronizeGamePause(engine,ui),[ui.panel,ui.confirmReset,ui.opening,ui.updating,s.questCinematic?.replay,s.saveConflictV36,engine]);
 useEffect(()=>{
  const browser=document as Document&{modelContext?:{registerTool:(tool:unknown,options?:unknown)=>unknown}};
  if(!browser.modelContext?.registerTool)return;
  const life=new AbortController(),register=(tool:unknown)=>{try{void Promise.resolve(browser.modelContext!.registerTool(tool,{signal:life.signal})).catch(()=>{});}catch{}};
  register({name:'read_eter_game_state',description:'Read current location, mission, party and nearby interactions in Éter Anima.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({map:engine.state.map,stage:engine.state.stage,mode:engine.state.mode,position:engine.state.position,objective:OBJECTIVES[engine.state.stage].text,heroes:engine.state.heroes,nearby:engine.nearest()?.id})});
  register({name:'walk_to_eter_interaction',description:'Start walking through the real map toward a named point of interest, then interact when nearby. Does not teleport or bypass mission conditions.',inputSchema:{type:'object',properties:{entityId:{type:'string'}},required:['entityId'],additionalProperties:false},annotations:{readOnlyHint:false},execute:(input:{entityId:string})=>{if(!input||typeof input.entityId!=='string'||!engine.activeEntities().some(entity=>entity.id===input.entityId))throw new Error('Unknown interaction');return {walking:engine.approach(input.entityId)};}});
  return()=>life.abort();
 },[engine]);
 const retryWorld=useCallback(()=>{const world=renderer.current;if(!world)return;void world.retryLoading().then(ready=>{if(ready&&renderer.current===world&&!world.disposed)setLoaded(true);});},[]);
 const prepareUpdate=useCallback(()=>prepareGameUpdate(engine,uiRef.current,loadingRef.current),[engine]);
 const setUpdatePending=useCallback((updating:boolean)=>{engine.clearMovement();if(updating)engine.paused=true;patch({updating});},[engine,patch]);
 const openSystem=useCallback(()=>{if(uiRef.current.opening||uiRef.current.confirmReset||uiRef.current.updating||!['world','start','selection'].includes(engine.state.mode))return;engine.clearMovement();engine.paused=true;patch({menuTab:'settings',activeMenuTab:'settings',panel:'menu',menuFocus:undefined});},[engine,patch]);
 const importSave=useCallback((text:string)=>importGameSaveTransfer(engine,text,uiRef.current,loadingRef.current,{sound:audio.setEnabled,volume:audio.changeVolume,returnToTitle:()=>{engine.returnToTitle();patch({panel:null,titleArmed:false,confirmReset:false,opening:false});}}),[engine,audio.setEnabled,audio.changeVolume,patch]);
 const exportSave=useCallback(()=>canApplyGameUpdate(engine,uiRef.current,loadingRef.current)?engine.exportSavePwa():null,[engine]);
 const canUpdate=canApplyGameUpdate(engine,ui,worldLoading);
 return {engine,s,ui,patch,shell,canvas,viewport,setViewport,loaded,worldLoading,audio,fullscreen,actions,pointer,activateTitle,retryWorld,canUpdate,prepareUpdate,setUpdatePending,openSystem,saveTransfer:{canExport:canUpdate&&s.hasSave,canImport:canUpdate&&['start','selection'].includes(s.mode),exportSave,previewSave:(text:string)=>engine.previewSavePwa(text),importSave}};
}
export type GameSession=ReturnType<typeof useGameSession>;
