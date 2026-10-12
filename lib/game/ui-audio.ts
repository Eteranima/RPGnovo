import type {GameEngine} from './engine';
import {MusicDirector,readAudioPreferences,saveSoundPreference,saveMusicVolume,type MusicStatus} from './music';

type MusicChannels=ConstructorParameters<typeof MusicDirector>[0];
export type GameAudioCallbacks={onSound:(enabled:boolean)=>void;onVolume:(volume:number)=>void;onStatus:(status:MusicStatus)=>void};
/** Preferences and gesture listeners have one owner and one matching cleanup. */
export function mountGameAudio(engine:GameEngine,channels:MusicChannels,callbacks:GameAudioCallbacks,events:Pick<Window,'addEventListener'|'removeEventListener'>=window){
 let disposed=false;
 const director=new MusicDirector(channels,status=>{if(!disposed)callbacks.onStatus(status);}),preferences=readAudioPreferences();
 director.setVolume(preferences.volume);callbacks.onVolume(preferences.volume);callbacks.onSound(preferences.enabled);
 engine.sound=preferences.enabled;void director.setEnabled(preferences.enabled);
 const retry=()=>{if(!disposed&&director.enabled)void director.unlock();};
 events.addEventListener('pointerdown',retry,{once:true});events.addEventListener('keydown',retry,{once:true});
 return {director,dispose:()=>{if(disposed)return;disposed=true;events.removeEventListener('pointerdown',retry);events.removeEventListener('keydown',retry);director.dispose();}};
}
export function setGameSound(engine:GameEngine,director:MusicDirector|null,enabled:boolean,onSound:(enabled:boolean)=>void){
 onSound(enabled);engine.sound=enabled;saveSoundPreference(enabled);void director?.setEnabled(enabled);
}
export function setGameMusicVolume(director:MusicDirector|null,value:number,onVolume:(volume:number)=>void){
 const volume=Math.min(1,Math.max(0,value));onVolume(volume);director?.setVolume(volume);saveMusicVolume(volume);
}
