'use client';
import {useEffect,type RefObject} from 'react';
import type {GameEngine} from '@/lib/game/engine';
import type {WorldRenderer} from '@/lib/game/renderer';
import type {GameControlContext} from '@/lib/game/ui-controls';
import {mountGameWorld} from '@/lib/game/ui-world';
import type {WorldLoadingStatusV32} from '@/lib/game/worldAssetsV32';

export function useGameWorld(engine:GameEngine,canvas:RefObject<HTMLCanvasElement|null>,renderer:RefObject<WorldRenderer|null>,controls:Omit<GameControlContext,'engine'|'loading'>,onLoading:(status:WorldLoadingStatusV32)=>void,onLoaded:(loaded:boolean)=>void){
 useEffect(()=>{
  if(!canvas.current)return;
  return mountGameWorld({engine,canvas:canvas.current,controls,onLoading,onLoaded,onRenderer:value=>renderer.current=value});
 },[engine,canvas,renderer,controls,onLoading,onLoaded]);
}
