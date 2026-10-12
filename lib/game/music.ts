import type {MapId} from './data';

export const MUSIC={
 start:{name:'Press Start Screen — Éter Anima',src:'/assets/music/press-start.mp3'},
 academy:{name:'Hidden Academy Theme',src:'/assets/music/hidden-academy.mp3'},
 below:{name:'The Academy Below',src:'/assets/music/academy-below.mp3'},
 battle:{name:'Ink and Ice Clash',src:'/assets/music/ink-and-ice-clash.mp3'},
 boss:{name:'Boss Theme',src:'/assets/music/boss-theme.mp3'}
} as const;
export type TrackId=keyof typeof MUSIC;
export function musicFor(s:{mode:string;map:MapId;battle?:{boss:boolean}|null;cutscene?:{id:string}|null;autoChessSessionV39?:{token:number}|null}):TrackId{
 if(s.autoChessSessionV39)return 'battle';
 if(s.mode==='start'||s.mode==='selection')return 'start';
 if(s.mode==='battle')return s.battle?.boss?'boss':'battle';
 if(s.mode==='cutscene'&&['awakening','echo-awakening','cinder-awakening'].includes(s.cutscene?.id||''))return 'boss';
 return ['subsolo','camara','galeria'].includes(s.map)?'below':'academy';
}
export const SOUND_ENABLED_KEY='eter-anima-sound-enabled';
export const MUSIC_VOLUME_KEY='eter-anima-music-volume';
type AudioStorage=Pick<Storage,'getItem'|'setItem'>;
export function readAudioPreferences(storage?:AudioStorage){
 const preferences={enabled:true,volume:.6};
 try{const saved=storage??localStorage,enabled=saved.getItem(SOUND_ENABLED_KEY),volume=saved.getItem(MUSIC_VOLUME_KEY);if(enabled==='false'||enabled==='true')preferences.enabled=enabled==='true';if(volume!==null&&volume.trim()!==''&&Number.isFinite(Number(volume)))preferences.volume=Math.min(1,Math.max(0,Number(volume)));}catch{/* Storage can be unavailable in private browsing. */}
 return preferences;
}
export function saveSoundPreference(enabled:boolean,storage?:AudioStorage){try{(storage??localStorage).setItem(SOUND_ENABLED_KEY,String(enabled));}catch{}}
export function saveMusicVolume(volume:number,storage?:AudioStorage){try{(storage??localStorage).setItem(MUSIC_VOLUME_KEY,String(Math.min(1,Math.max(0,volume))));}catch{}}
type Channel=Pick<HTMLAudioElement,'src'|'loop'|'preload'|'volume'|'currentTime'|'paused'|'play'|'pause'|'muted'|'autoplay'>&Partial<Pick<HTMLAudioElement,'duration'|'playbackRate'>>;
export type MusicStatus='off'|'playing'|'blocked';
export const OPENING_MUSIC_TRACK:TrackId='academy';
/** Two real audio channels keep the supplied MP3s intact and crossfade area changes. */
export class MusicDirector{
 track:TrackId='start';enabled=false;unlocked=false;volume=.6;active=0;generation=0;frame=0;disposed=false;
 opening:{returnTrack:TrackId;returnTime:number;elapsed:number;playing:boolean;pending:number|null;blocked:boolean}|null=null;
 constructor(public channels:[Channel,Channel],public onStatus:(s:MusicStatus)=>void=()=>{}){for(const a of channels){a.autoplay=false;a.muted=true;a.pause();a.loop=true;a.preload='none';}channels[0].src=MUSIC.start.src;}
 cancelFade(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;}
 silence(a:Channel){a.muted=true;a.pause();}
 stale(a:Channel,token:number){if(this.disposed||!this.enabled||token!==this.generation){if(this.disposed||!this.enabled||a!==this.channels[this.active]||this.opening&&!this.opening.playing)this.silence(a);return true;}return false;}
 request(track:TrackId,startAt=0,fadeIn=false){if(this.disposed)return;if(this.opening){if(this.opening.returnTrack!==track)this.opening.returnTime=0;this.opening.returnTrack=track;return;}if(track===this.track)return;this.track=track;this.cancelFade();const old=this.channels[this.active];this.active=1-this.active;const next=this.channels[this.active];this.silence(next);next.src=MUSIC[track].src;next.currentTime=startAt;const token=++this.generation;
  if(!this.enabled||!this.unlocked){this.silence(old);next.volume=this.volume;this.onStatus('off');return;}
  next.volume=old.paused&&!fadeIn?this.volume:0;next.muted=false;
  void next.play().then(()=>{if(this.stale(next,token))return;this.onStatus('playing');if(old.paused&&!fadeIn){next.volume=this.volume;return;}const start=performance.now(),oldVolume=old.paused?0:old.volume;
   const fade=(now:number)=>{if(this.stale(next,token))return;const t=Math.min(1,Math.max(0,(now-start)/450));next.volume=this.volume*t;old.volume=oldVolume*(1-t);if(t<1)this.frame=requestAnimationFrame(fade);else{this.silence(old);this.frame=0;}};this.frame=requestAnimationFrame(fade);
  }).catch(()=>{if(!this.stale(next,token)){this.silence(old);this.silence(next);this.onStatus('blocked');}});
 }
 /** Opening temporarily owns the same two channels; no background music competes with its clock. */
 beginOpening(){if(this.disposed||this.opening)return;this.opening={returnTrack:this.track,returnTime:this.channels[this.active].currentTime,elapsed:0,playing:false,pending:null,blocked:false};this.generation++;this.cancelFade();this.channels.forEach(a=>this.silence(a));this.active=1-this.active;this.track=OPENING_MUSIC_TRACK;const a=this.channels[this.active];a.src=MUSIC[this.track].src;a.currentTime=0;a.playbackRate=1;a.volume=this.volume;this.onStatus('off');}
 syncOpeningTime(force=false){if(!this.opening)return;const a=this.channels[this.active],duration=a.duration;const time=duration&&Number.isFinite(duration)&&duration>0?this.opening.elapsed%duration:this.opening.elapsed;if(force||Math.abs(a.currentTime-time)>.2)try{a.currentTime=time;}catch{/* Metadata may still be loading; the next native video tick retries. */}a.playbackRate=1;}
 openingPlayback(playing:boolean,seconds:number){if(this.disposed)return;this.beginOpening();const opening=this.opening!;const changed=opening.playing!==playing;opening.playing=playing;opening.elapsed=Number.isFinite(seconds)?Math.max(0,seconds):0;if(!playing){if(changed){this.generation++;this.cancelFade();opening.pending=null;}this.channels.forEach(a=>this.silence(a));this.onStatus('off');return;}if(!this.enabled)return;this.syncOpeningTime();const a=this.channels[this.active];if(opening.blocked||!this.unlocked){this.silence(a);if(!this.unlocked)this.onStatus('blocked');return;}a.volume=this.volume;a.muted=false;if(a.paused&&!opening.pending)void this.unlock();}
 endOpening(){const opening=this.opening;if(!opening||this.disposed)return;this.opening=null;this.request(opening.returnTrack,opening.returnTime,true);}
 /** A browser gesture may retry playback, but never overrides the player's choice. */
 async unlock(){if(this.disposed||!this.enabled)return false;this.unlocked=true;this.cancelFade();const token=++this.generation,a=this.channels[this.active];this.silence(this.channels[1-this.active]);a.volume=this.volume;a.muted=false;
  const opening=this.opening,priming=!!opening&&!opening.playing;if(opening){opening.pending=token;opening.blocked=false;this.syncOpeningTime(true);}if(priming){a.volume=0;a.muted=true;}
  try{await a.play();if(this.stale(a,token))return false;if(priming&&this.opening&&!this.opening.playing){this.silence(a);a.volume=this.volume;this.onStatus('off');return true;}this.onStatus('playing');return true;}catch{if(!this.stale(a,token)){this.silence(a);if(opening)opening.blocked=true;this.onStatus('blocked');}return false;}finally{if(opening?.pending===token)opening.pending=null;}
 }
 setEnabled(enabled:boolean){if(this.disposed)return Promise.resolve(false);this.enabled=enabled;if(enabled)return this.unlock();this.generation++;this.cancelFade();this.channels.forEach(a=>this.silence(a));this.onStatus('off');return Promise.resolve(false);}
 setVolume(volume:number){this.volume=Math.min(1,Math.max(0,volume));this.cancelFade();this.silence(this.channels[1-this.active]);if(this.opening&&!this.opening.playing)this.silence(this.channels[this.active]);this.channels[this.active].volume=this.volume;}
 dispose(){this.disposed=true;this.enabled=false;this.generation++;this.cancelFade();this.channels.forEach(a=>{this.silence(a);a.src='';});}
}
