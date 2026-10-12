'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import type {GameEngine,Snapshot} from '@/lib/game/engine';
import {musicFor,OPENING_MUSIC_TRACK,type MusicDirector,type MusicStatus} from '@/lib/game/music';
import {mountGameAudio,setGameSound,setGameMusicVolume} from '@/lib/game/ui-audio';

export function useGameAudio(engine:GameEngine,s:Snapshot,opening=false){
 const channel0=useRef<HTMLAudioElement>(null),channel1=useRef<HTMLAudioElement>(null),director=useRef<MusicDirector|null>(null);
 const openingRef=useRef(opening);openingRef.current=opening;
 const [sound,setSound]=useState(false),[volume,setVolume]=useState(.6),[status,setStatus]=useState<MusicStatus>('off');
 useEffect(()=>{
  if(!channel0.current||!channel1.current)return;
  const audio=mountGameAudio(engine,[channel0.current,channel1.current],{onSound:setSound,onVolume:setVolume,onStatus:setStatus});
  director.current=audio.director;
  return()=>{audio.dispose();if(director.current===audio.director)director.current=null;};
 },[engine]);
 useEffect(()=>{director.current?.request(musicFor(s));},[s.mode,s.map,s.battle?.boss,s.cutscene?.id,s.autoChessSessionV39?.token]);
 useEffect(()=>{if(opening)director.current?.beginOpening();else director.current?.endOpening();},[opening]);
 const setEnabled=useCallback((enabled:boolean)=>setGameSound(engine,director.current,enabled,setSound),[engine]);
 const toggle=useCallback(()=>setEnabled(!director.current?.enabled),[setEnabled]);
 const changeVolume=useCallback((value:number)=>setGameMusicVolume(director.current,value,setVolume),[]);
 const unlock=useCallback(()=>{void director.current?.unlock();},[]);
 const prepareOpening=useCallback(()=>{director.current?.beginOpening();void director.current?.unlock();},[]);
 const openingPlayback=useCallback((playing:boolean,seconds=0)=>{if(openingRef.current)director.current?.openingPlayback(playing,seconds);},[]);
 return {channel0,channel1,sound,volume,status,currentTrack:opening?OPENING_MUSIC_TRACK:musicFor(s),setEnabled,toggle,changeVolume,unlock,prepareOpening,openingPlayback};
}
