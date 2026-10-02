import type {MapId} from './data';

export const MUSIC={
 start:{name:'Press Start Screen — Éter Anima',src:'/assets/music/press-start.mp3'},
 academy:{name:'Hidden Academy Theme',src:'/assets/music/hidden-academy.mp3'},
 below:{name:'The Academy Below',src:'/assets/music/academy-below.mp3'},
 battle:{name:'Ink and Ice Clash',src:'/assets/music/ink-and-ice-clash.mp3'},
 boss:{name:'Boss Theme',src:'/assets/music/boss-theme.mp3'}
} as const;
export type TrackId=keyof typeof MUSIC;
export function musicFor(s:{mode:string;map:MapId;battle?:{boss:boolean}|null;cutscene?:{id:string}|null}):TrackId{
 if(s.mode==='start'||s.mode==='selection')return 'start';
 if(s.mode==='battle')return s.battle?.boss?'boss':'battle';
 if(s.mode==='cutscene'&&['awakening','echo-awakening','cinder-awakening'].includes(s.cutscene?.id||''))return 'boss';
 return ['subsolo','camara','galeria'].includes(s.map)?'below':'academy';
}
type Channel=Pick<HTMLAudioElement,'src'|'loop'|'preload'|'volume'|'currentTime'|'paused'|'play'|'pause'>;
export type MusicStatus='off'|'playing'|'blocked';
/** Two real audio channels keep the supplied MP3s intact and crossfade area changes. */
export class MusicDirector{
 track:TrackId='start';enabled=false;unlocked=false;volume=.6;active=0;generation=0;frame=0;disposed=false;
 constructor(public channels:[Channel,Channel],public onStatus:(s:MusicStatus)=>void=()=>{}){for(const a of channels){a.loop=true;a.preload='none';}channels[0].src=MUSIC.start.src;}
 cancelFade(){if(this.frame)cancelAnimationFrame(this.frame);this.frame=0;}
 request(track:TrackId){if(this.disposed||track===this.track)return;this.track=track;this.cancelFade();const old=this.channels[this.active];this.active=1-this.active;const next=this.channels[this.active];next.pause();next.src=MUSIC[track].src;next.currentTime=0;const token=++this.generation;
  if(!this.enabled||!this.unlocked){old.pause();next.volume=this.volume;this.onStatus('off');return;}
  next.volume=old.paused?this.volume:0;
  void next.play().then(()=>{if(this.disposed||token!==this.generation){if(next!==this.channels[this.active])next.pause();return;}this.onStatus('playing');if(old.paused){next.volume=this.volume;return;}const start=performance.now(),oldVolume=old.volume;
   const fade=(now:number)=>{if(token!==this.generation||this.disposed)return;const t=Math.min(1,Math.max(0,(now-start)/450));next.volume=this.volume*t;old.volume=oldVolume*(1-t);if(t<1)this.frame=requestAnimationFrame(fade);else{old.pause();this.frame=0;}};this.frame=requestAnimationFrame(fade);
  }).catch(()=>{if(token===this.generation){old.pause();this.onStatus('blocked');}});
 }
 async unlock(){if(this.disposed)return false;this.unlocked=true;this.enabled=true;this.cancelFade();const token=++this.generation,a=this.channels[this.active];this.channels[1-this.active].pause();a.volume=this.volume;
  try{await a.play();if(token!==this.generation||this.disposed)return false;this.onStatus('playing');return true;}catch{if(token===this.generation)this.onStatus('blocked');return false;}
 }
 setEnabled(enabled:boolean){this.enabled=enabled;if(enabled)return this.unlock();this.generation++;this.cancelFade();this.channels.forEach(a=>a.pause());this.onStatus('off');return Promise.resolve(false);}
 setVolume(volume:number){this.volume=Math.min(1,Math.max(0,volume));this.cancelFade();this.channels[1-this.active].pause();this.channels[this.active].volume=this.volume;}
 dispose(){this.disposed=true;this.generation++;this.cancelFade();this.channels.forEach(a=>{a.pause();a.src='';});}
}
