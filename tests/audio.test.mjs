import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import ts from 'typescript';

const out=mkdtempSync(join(tmpdir(),'eter-audio-'));
for(const name of ['remakeArt','remakeArtSeijiOphelia','remakeArtGabrielMarinMax','remakeArtCarmillaBeatrizAbel','cosmetics','data','progression','summons','carmilla','engine','music']){
 const source=readFileSync(`lib/game/${name}.ts`,'utf8').replace(/from '\.\/(\w+)'/g,"from './$1.js'");
 writeFileSync(join(out,`${name}.js`),ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}}).outputText);
}
const {MusicDirector,musicFor,MUSIC,readAudioPreferences,saveSoundPreference,saveMusicVolume,SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY}=await import(pathToFileURL(join(out,'music.js')).href);
const {GameEngine}=await import(pathToFileURL(join(out,'engine.js')).href);
const frames=new Map();let frameId=0;
global.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};
global.cancelAnimationFrame=id=>frames.delete(id);
const flush=async()=>{await Promise.resolve();await Promise.resolve();};
const sounds=[];
class AudioMock{
 constructor(src=''){this._src=src;this.autoplay=true;this.muted=false;this.paused=true;this.volume=1;this.currentTime=0;this.plays=0;this.pending=[];sounds.push(this);}
 get src(){return this._src;}
 set src(value){this._src=value;if(this.autoplay&&value){this.plays++;this.paused=false;}}
 play(){this.plays++;if(this.reject)return Promise.reject(new Error('Gesture required'));if(this.deferred)return new Promise(resolve=>this.pending.push(()=>{this.paused=false;resolve();}));this.paused=false;return Promise.resolve();}
 pause(){this.paused=true;}
 resolve(){this.pending.shift()?.();}
}
const channels=()=>[new AudioMock(),new AudioMock()];
const silent=pair=>pair.every(audio=>audio.muted&&audio.paused);
const store=new Map();const storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};global.localStorage=storage;
assert.deepEqual(readAudioPreferences(storage),{enabled:true,volume:.6},'first visit retains existing sound and volume defaults');
saveSoundPreference(false,storage);saveMusicVolume(.35,storage);
assert.equal(store.get(SOUND_ENABLED_KEY),'false');assert.equal(store.get(MUSIC_VOLUME_KEY),'0.35');
assert.deepEqual(readAudioPreferences(storage),{enabled:false,volume:.35},'mute and volume survive reload');
assert.deepEqual(readAudioPreferences({getItem(){throw new Error('Denied');}}),{enabled:true,volume:.6},'unavailable storage cannot break the game');
store.set(MUSIC_VOLUME_KEY,'invalid');assert.equal(readAudioPreferences(storage).volume,.6);store.set(MUSIC_VOLUME_KEY,'0');assert.equal(readAudioPreferences(storage).volume,0);saveMusicVolume(.35,storage);

{
 const pair=channels(),statuses=[],director=new MusicDirector(pair,status=>statuses.push(status));
 assert.ok(silent(pair));assert.ok(pair.every(audio=>!audio.autoplay&&audio.plays===0),'native autoplay cannot bypass the director');
 const preferences=readAudioPreferences(storage);director.setVolume(preferences.volume);await director.setEnabled(preferences.enabled);
 assert.equal(await director.unlock(),false,'PRESS START or a gesture does not undo mute');
 for(const state of [{mode:'selection',map:'patio'},{mode:'world',map:'arquivo'},{mode:'world',map:'subsolo'},{mode:'battle',map:'subsolo',battle:{boss:false}},{mode:'battle',map:'camara',battle:{boss:true}},{mode:'cutscene',map:'galeria',cutscene:{id:'echo-awakening'}},{mode:'start',map:'patio'}]){
  director.request(musicFor(state));await director.unlock();director.setVolume(.45);assert.ok(silent(pair),`${state.mode}/${state.map} stays muted`);assert.ok(pair.every(audio=>audio.plays===0));
 }
 assert.equal(statuses.at(-1),'off');director.dispose();
 const restored=new MusicDirector(channels());await restored.setEnabled(readAudioPreferences(storage).enabled);assert.ok(silent(restored.channels),'a remount respects saved mute');restored.request('battle');saveSoundPreference(true,storage);assert.equal(await restored.setEnabled(true),true);assert.equal(restored.channels[restored.active].src,MUSIC.battle.src);assert.equal(restored.channels[restored.active].muted,false);assert.deepEqual(readAudioPreferences(storage),{enabled:true,volume:.35},'explicit activation saves only sound and retains volume');restored.dispose();
}
{
 const pair=channels(),statuses=[],director=new MusicDirector(pair,status=>statuses.push(status));pair[0].deferred=true;
 const starting=director.setEnabled(true);await director.setEnabled(false);pair[0].resolve();await starting;assert.ok(silent(pair),'late opening play cannot bypass mute');assert.equal(statuses.at(-1),'off');
 pair[0].deferred=false;await director.setEnabled(true);pair[1].deferred=true;director.request('academy');await director.setEnabled(false);pair[1].resolve();await flush();assert.ok(silent(pair),'late map transition play cannot bypass mute');assert.equal(statuses.at(-1),'off');
 pair[1].deferred=false;await director.setEnabled(true);director.request('below');await flush();assert.ok(frames.size>0,'enabled area changes retain crossfade');await director.setEnabled(false);assert.equal(frames.size,0,'mute cancels crossfade');assert.ok(silent(pair));
 pair[director.active].deferred=true;const pending=director.setEnabled(true);director.dispose();pair[director.active].resolve();await pending;assert.ok(silent(pair),'late play cannot escape a disposed screen');
}
{
 const pair=channels(),statuses=[],director=new MusicDirector(pair,status=>statuses.push(status));pair[0].reject=true;
 assert.equal(await director.setEnabled(true),false);assert.equal(statuses.at(-1),'blocked','autoplay policy stays visible');assert.ok(silent(pair));pair[0].reject=false;assert.equal(await director.unlock(),true,'an allowed gesture retries the saved enabled preference');await director.setEnabled(false);assert.equal(await director.unlock(),false);assert.ok(silent(pair));director.dispose();
}

global.Audio=AudioMock;
class AudioContextMock{
 constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.oscillators=[];this.pending=[];}
 resume(){if(this.deferred)return new Promise(resolve=>this.pending.push(()=>{this.state='running';resolve();}));this.state='running';return Promise.resolve();}
 suspend(){this.state='suspended';return Promise.resolve();}
 close(){this.state='closed';return Promise.resolve();}
 createOscillator(){const oscillator={frequency:{setValueAtTime(){}},stops:[],connect(){},start(){this.started=true;},stop(at){this.stops.push(at);},disconnect(){this.disconnected=true;}};this.oscillators.push(oscillator);return oscillator;}
 createGain(){return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
}
global.AudioContext=AudioContextMock;
{
 const game=new GameEngine(),before=sounds.length;game.soundEffect('cast');game.tone();assert.equal(sounds.length,before);assert.equal(game.audio,null,'muted combat creates no sound sources');
 game.sound=true;game.soundEffect('cast');const effect=sounds.at(-1);assert.equal(effect.volume,.32,'SFX retains its established volume');assert.equal(effect.muted,false);game.tone();const context=game.audio,oscillator=context.oscillators[0];assert.equal(oscillator.started,true);
 game.sound=false;assert.ok(effect.muted&&effect.paused);assert.ok(oscillator.stops.includes(undefined),'mute stops an already started UI tone immediately');assert.equal(context.state,'suspended');
 game.start(false);game.finishCutscene();game.returnToTitle();assert.equal(game.sound,false,'game navigation never changes the sound preference');game.dispose();assert.equal(context.state,'closed');
}
{
 const game=new GameEngine();game.sound=true;game.soundEffect('attack');const effect=sounds.at(-1);effect.onended();game.sound=false;assert.equal(effect.src,'/assets/audio/sfx/attack.wav','ended effects are released rather than retained');
 game.sound=true;const savedPlay=AudioMock.prototype.play;AudioMock.prototype.play=function(){this.deferred=true;return savedPlay.call(this);};game.soundEffect('cast');AudioMock.prototype.play=savedPlay;const delayed=sounds.at(-1);game.sound=false;delayed.resolve();await flush();assert.ok(delayed.muted&&delayed.paused,'pending SFX play respects mute');
 game.sound=true;game.soundEffect('cast');const newEffect=sounds.at(-1);assert.equal(newEffect.paused,false,'explicit reactivation permits new SFX');assert.ok(delayed.paused,'reactivation does not restart interrupted SFX');game.dispose();assert.ok(newEffect.muted&&newEffect.paused,'screen disposal releases SFX');
}
{
 const game=new GameEngine();game.sound=true;game.audio=new AudioContextMock();game.audio.deferred=true;const context=game.audio;game.tone();game.sound=false;context.pending.shift()();await flush();assert.equal(context.state,'suspended','late Web Audio resume is suspended again after mute');assert.ok(context.oscillators[0].stops.includes(undefined));game.dispose();
}
console.log('Audio checks passed: persisted mute/volume, title/maps/battle/remount, native autoplay, crossfade cancellation, delayed play, browser gesture policy, SFX and Web Audio interruption.');
