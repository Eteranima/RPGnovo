'use client';
import {useCallback,useEffect,useState,type RefObject} from 'react';
import type {GameEngine} from '@/lib/game/engine';
import {subscribeGameFullscreen,toggleGameFullscreen} from '@/lib/game/ui-fullscreen';

export function useGameFullscreen(engine:GameEngine,shell:RefObject<HTMLElement|null>){
 const [active,setActive]=useState(false);
 useEffect(()=>subscribeGameFullscreen(setActive),[]);
 const toggle=useCallback(()=>toggleGameFullscreen(shell.current,{clearMovement:()=>engine.clearMovement(),toast:text=>engine.toast(text)}),[engine,shell]);
 return {active,toggle};
}
