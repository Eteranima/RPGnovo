import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const temporary = await mkdtemp(resolve(tmpdir(), 'eter-opening-audio-'));
const savedGlobals = { localStorage: globalThis.localStorage, requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame };
const store = new Map([['eter-anima-sound-enabled', 'false'], ['eter-anima-music-volume', '.35']]);
globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) };
const frames = new Map(); let frameId = 0;
globalThis.requestAnimationFrame = callback => { frames.set(++frameId, callback); return frameId; };
globalThis.cancelAnimationFrame = id => frames.delete(id);
const settle = async () => { await Promise.resolve(); await Promise.resolve(); };
let checks = 0;
const eq = (value, expected, message) => { checks++; assert.deepEqual(value, expected, message); };
const ok = (value, message) => { checks++; assert.ok(value, message); };
class AudioChannel {
  src = ''; loop = false; preload = 'none'; volume = .6; currentTime = 0; paused = true; muted = true; autoplay = false; playbackRate = 2; duration = 180; plays = 0; deferred = false; reject = false; pending = [];
  play() { this.plays++; if (this.reject) return Promise.reject(new Error('gesture required')); if (this.deferred) return new Promise(resolve => this.pending.push(() => { this.paused = false; resolve(); })); this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  resolve() { this.pending.shift()?.(); }
}
const pair = () => [new AudioChannel(), new AudioChannel()];
const silent = channels => channels.every(channel => channel.paused && channel.muted);
try {
  const musicCode = ts.transpileModule(await readFile('lib/game/music.ts', 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  await writeFile(resolve(temporary, 'music.mjs'), musicCode);
  const music = await import(pathToFileURL(resolve(temporary, 'music.mjs')));
  const { MusicDirector, MUSIC, OPENING_MUSIC_TRACK } = music;
  eq(OPENING_MUSIC_TRACK, 'academy', 'Opening uses an existing soundtrack');
  ok((await stat(resolve('public', '.' + MUSIC[OPENING_MUSIC_TRACK].src))).size > 0, 'Existing native MP3 is present');

  {
    const channels = pair(), director = new MusicDirector(channels);
    await director.setEnabled(false); director.setVolume(.35); director.beginOpening(); await director.unlock();
    for (const time of [0, .5, 12, 35, 62.5, 0]) { director.openingPlayback(true, time); await settle(); director.openingPlayback(false, time); ok(silent(channels), 'Mute persists through opening/resume/replay'); }
    director.endOpening(); await settle(); ok(silent(channels)); eq(channels.map(c => c.plays), [0, 0], 'Muted opening never starts an audio source');
    eq(store.get('eter-anima-sound-enabled'), 'false', 'Playback never writes or enables sound'); director.dispose();
  }
  {
    const channels = pair(), director = new MusicDirector(channels);
    director.setVolume(.35); await director.setEnabled(true); channels[director.active].currentTime = 23.25;
    director.beginOpening(); eq(director.track, OPENING_MUSIC_TRACK); ok(silent(channels), 'Opening loading replaces title audio with silence');
    const opening = channels[director.active]; eq(opening.src, MUSIC.academy.src); eq(opening.currentTime, 0); eq(opening.playbackRate, 1);
    await director.unlock(); ok(silent(channels), 'Gesture priming remains inaudible before actual video playback');
    director.openingPlayback(true, 0); await settle(); ok(!opening.paused && !opening.muted); eq(opening.volume, .35); eq(channels[1-director.active].paused, true, 'No background title track competes');
    for (const time of [.5, 4, 9.5, 35, 61]) { director.openingPlayback(true, time); eq(opening.currentTime, time, 'Music follows the actual video clock'); eq(opening.playbackRate, 1, 'Game speed does not speed up the opening'); }
    director.openingPlayback(false, 17.2); ok(silent(channels), 'Pause and buffer hold stop the soundtrack');
    director.setVolume(.18); ok(silent(channels), 'Volume change does not restart a paused opening');
    director.openingPlayback(true, 17.2); await settle(); eq(opening.currentTime, 17.2); eq(opening.volume, .18);
    director.openingPlayback(false, 62.5); ok(silent(channels), 'Native completion holds the final frame silently');
    director.openingPlayback(true, 0); await settle(); eq(opening.currentTime, 0, 'Replay starts the existing track from the beginning');
    director.openingPlayback(false, 2); director.endOpening(); await settle();
    eq(director.opening, null); eq(director.track, 'start'); const title = channels[director.active]; eq(title.src, MUSIC.start.src); eq(title.currentTime, 23.25, 'Exit restores the previous title time');
    eq(title.volume, 0, 'Title music fades back in'); ok(frames.size > 0);
    for (const [id, callback] of [...frames]) { frames.delete(id); callback(performance.now() + 1000); }
    eq(title.volume, .18); ok(opening.paused && opening.muted); director.dispose(); eq(frames.size, 0);
  }
  {
    const channels = pair(), director = new MusicDirector(channels); await director.setEnabled(true); director.beginOpening();
    const opening = channels[director.active]; opening.deferred = true;
    const prime = director.unlock(); eq(opening.volume, 0); eq(opening.muted, true, 'Silent preparation also uses native mute, independent of device volume behavior');
    director.openingPlayback(true, .75); eq(opening.volume, .6, 'Actual playing restores volume even when gesture priming is still resolving');
    for (let i = 0; i < 20; i++) director.openingPlayback(true, 1 + i / 24);
    eq(opening.pending.length, 1, 'Only one pending play attempt despite per-frame synchronization');
    director.openingPlayback(false, 2); opening.resolve(); await prime; ok(silent(channels), 'Late play cannot escape pause/visibility suspension');
    const pendingResume = director.unlock(); await director.setEnabled(false); opening.resolve(); await pendingResume; ok(silent(channels), 'Late play cannot escape persistent mute');
    director.dispose();
  }
  {
    const channels = pair(), status = [], director = new MusicDirector(channels, value => status.push(value)); await director.setEnabled(true); director.beginOpening();
    const opening = channels[director.active]; opening.reject = true; director.openingPlayback(true, 3); await settle(); eq(status.at(-1), 'blocked');
    const attempts = opening.plays; for (let i = 0; i < 50; i++) director.openingPlayback(true, 3 + i / 24); await settle();
    eq(opening.plays, attempts, 'Autoplay denial never retries every video frame'); ok(silent(channels));
    opening.reject = false; ok(await director.unlock(), 'Explicit player sound/play gesture retries browser policy'); eq(opening.currentTime, 3 + 49/24);
    await director.setEnabled(false); director.openingPlayback(true, 40); ok(silent(channels));
    await director.setEnabled(true); eq(opening.currentTime, 40, 'Explicit unmute joins the current film time'); director.dispose();
  }
  {
    const channels = pair(), director = new MusicDirector(channels); await director.setEnabled(true); director.beginOpening(); await director.unlock();
    const opening = channels[director.active]; opening.duration = 20; director.openingPlayback(true, 35); await settle(); eq(opening.currentTime, 15, 'A shorter supplied track loops on the film clock');
    director.request('boss'); eq(director.track, OPENING_MUSIC_TRACK, 'Background requests cannot replace the opening'); director.openingPlayback(false, 35); director.endOpening(); await settle(); eq(director.track, 'boss', 'Exit applies the latest requested background theme');
    director.beginOpening(); const late = channels[director.active]; late.deferred = true; const pending = director.unlock(); director.dispose(); late.resolve(); await pending; ok(silent(channels)); eq(channels.map(c => c.src), ['', ''], 'Reset/unmount releases both channels');
  }

  // Execute the actual hook with persistent refs/effects to verify Page callbacks and late cleanup isolation.
  let slots = [], cursor = 0, pendingEffects = [];
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
    useState(initial) { const i = cursor++; if (!slots[i]) slots[i] = { value: initial }; return [slots[i].value, value => { slots[i].value = typeof value === 'function' ? value(slots[i].value) : value; }]; },
    useCallback(callback, deps) { const i = cursor++; if (!same(slots[i]?.deps, deps)) slots[i] = { deps, value: callback }; return slots[i].value; },
    useEffect(callback, deps) { const i = cursor++; if (!same(slots[i]?.deps, deps)) pendingEffects.push(() => { slots[i]?.cleanup?.(); slots[i] = { deps, cleanup: callback() }; }); },
  };
  const callbacks = { addEventListener() {}, removeEventListener() {} }; const savedWindow = globalThis.window; globalThis.window = callbacks;
  try {
    const evaluate = async (path, dependencies) => { const exports = {}; const code = ts.transpileModule(await readFile(path, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText; new Function('require', 'exports', code)(id => { if (!dependencies[id]) throw Error('Unexpected import: ' + id); return dependencies[id]; }, exports); return exports; };
    const lifecycle = await evaluate('lib/game/ui-audio.ts', { './music': music });
    const { useGameAudio } = await evaluate('hooks/use-game-audio.ts', { react: React, '@/lib/game/music': music, '@/lib/game/ui-audio': lifecycle });
    const engine = { sound: false }, snapshot = { mode: 'start', map: 'patio' };
    const render = opening => { cursor = 0; return useGameAudio(engine, snapshot, opening); };
    const effects = () => { const queue = pendingEffects; pendingEffects = []; queue.forEach(callback => callback()); };
    let api = render(false); const channels = pair(); api.channel0.current = channels[0]; api.channel1.current = channels[1]; effects();
    ok(!engine.sound, 'Hook restores the local mute'); api.prepareOpening(); await settle(); eq(channels.map(c => c.plays), [0, 0]);
    api = render(true); effects(); api.openingPlayback(true, 12); await settle(); ok(silent(channels)); eq(api.currentTrack, OPENING_MUSIC_TRACK);
    api.setEnabled(true); await settle(); ok(engine.sound); api.openingPlayback(true, 12); await settle(); ok(channels.some(c => !c.paused && !c.muted));
    const late = api.openingPlayback; api = render(false); effects(); await settle(); const before = channels.map(c => c.src);
    late(false, 0); late(true, 0); await settle(); eq(channels.map(c => c.src), before, 'Late unmount callbacks cannot reopen the soundtrack session'); eq(api.currentTrack, 'start');
    for (const slot of slots) slot?.cleanup?.(); ok(silent(channels));
  } finally { globalThis.window = savedWindow; }
  console.info(`Opening audio: ${checks} checks passed; existing MP3, native video clock, persistent mute, gesture policy, pause/replay/end/fade, late cleanup and hook integration.`);
} finally {
  Object.assign(globalThis, savedGlobals);
  if (dirname(temporary) !== resolve(tmpdir()) || !basename(temporary).startsWith('eter-opening-audio-')) throw new Error('Unexpected cleanup path');
  await rm(temporary, { recursive: true, force: true });
}
