import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-pwa-save-v36-'));compileGameModules(out,['engine']);const load=name=>import(pathToFileURL(join(out,name+'.js')).href);
const {GameEngine,SAVE_KEY,parseSave}=await load('engine');const {SAVE_TRANSFER_BACKUP_KEY_V36}=await load('saveTransferV36');const {SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY,readAudioPreferences}=await load('music');const {COMBAT_PREFERENCES_KEY_V32}=await load('combatPreferencesV32');
let checks=0;const check=(value,label)=>{assert.ok(value,label);checks++;},equal=(value,expected,label)=>{assert.deepEqual(value,expected,label);checks++;};
const store=new Map();const storage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value),removeItem:key=>store.delete(key)};global.localStorage=storage;global.setTimeout=()=>1;
function fresh(){store.clear();const engine=new GameEngine();engine.start(false);engine.finishCutscene();check(engine.save(true),'valid original campaign saved');return engine;}
const source=fresh();source.setBattleSpeedV32(2);store.set(SOUND_ENABLED_KEY,'false');store.set(MUSIC_VOLUME_KEY,'.27');const exported=source.exportSavePwa(),packet=JSON.parse(exported);
check(exported,'safe world exports a local package');equal(packet.preferences,{audio:{enabled:false,volume:.27},battleSpeed:2},'package preserves audio and speed without embedding device/runtime state');equal(source.previewSavePwa(exported).heroNames,source.state.heroes.map(hero=>hero.name),'preview reads canonical validated party');check(parseSave(JSON.stringify(packet.save)),'export contains a normal valid legacy-compatible save');
const legacy=JSON.stringify(packet.save);check(source.previewSavePwa(legacy),'plain legacy save JSON remains importable');
for(const value of ['', '{}', '{broken',JSON.stringify({...packet,formatVersion:2}),JSON.stringify({...packet,save:{...packet.save,stage:999}}),JSON.stringify({...packet,preferences:{...packet.preferences,audio:{enabled:true,volume:2}}}),JSON.stringify({...packet,preferences:{...packet.preferences,battleSpeed:3}}),' '.repeat(2*1024*1024+1)]){
 const before=JSON.stringify([...store]);equal(source.previewSavePwa(value),null,'malformed/future/oversized package rejected at preview');source.returnToTitle();check(!source.importSavePwa(value),'invalid file never imports');equal(JSON.stringify([...store]),before,'invalid file cannot write or discard progress');
}
const receiver=fresh(),previousSave=store.get(SAVE_KEY);check(!receiver.importSavePwa(exported),'active campaign cannot be replaced');receiver.returnToTitle();check(receiver.importSavePwa(exported),'title imports valid package after external explicit confirmation');equal(receiver.state.mode,'start','import cannot secretly start an adventure');check(receiver.state.hasSave,'imported continuation is visible on title');equal(readAudioPreferences(),{enabled:false,volume:.27},'muted source restores muted preference');equal(receiver.sound,false,'engine effects are silenced on import');equal(receiver.state.battleSpeedV32,2,'battle speed preference restored');equal(JSON.parse(store.get(SAVE_TRANSFER_BACKUP_KEY_V36)).values[SAVE_KEY],previousSave,'backup contains exact prior local campaign');receiver.start(true);equal(receiver.state.heroes.map(hero=>hero.id),packet.save.heroes.map(hero=>hero.id),'resume loads imported party via real start and validation');
{
 const engine=fresh();store.set(SOUND_ENABLED_KEY,'false');engine.sound=false;engine.returnToTitle();const audible={...packet,preferences:{audio:{enabled:true,volume:.4},battleSpeed:1}};
 check(engine.importSavePwa(JSON.stringify(audible)),'audible package can transfer progress to a muted device');equal(readAudioPreferences().enabled,false,'import never reactivates an existing muted preference');equal(engine.sound,false,'import never reactivates engine SFX');equal(readAudioPreferences().volume,.4,'volume still transfers independently');
}
for(const failKey of [SAVE_TRANSFER_BACKUP_KEY_V36,SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY,COMBAT_PREFERENCES_KEY_V32,SAVE_KEY]){
 const engine=fresh();store.set(SOUND_ENABLED_KEY,'true');store.set(MUSIC_VOLUME_KEY,'.61');store.set(COMBAT_PREFERENCES_KEY_V32,'{"battleSpeed":1}');engine.returnToTitle();const keys=[SAVE_KEY,SOUND_ENABLED_KEY,MUSIC_VOLUME_KEY,COMBAT_PREFERENCES_KEY_V32],before=Object.fromEntries(keys.map(key=>[key,store.get(key)])),savedBefore=structuredClone(engine.saved);let failed=false;
 global.localStorage={...storage,setItem(key,value){if(!failed&&key===failKey){failed=true;throw Error('simulated quota failure');}storage.setItem(key,value);}};
 check(!engine.importSavePwa(exported),'write failure rejects transfer');equal(Object.fromEntries(keys.map(key=>[key,store.get(key)])),before,'failed write rolls back campaign/audio/speed atomically');equal(engine.saved,savedBefore,'failed write cannot change in-memory resume snapshot');equal(engine.state.mode,'start','failed import stays on title');global.localStorage=storage;
}
{
 const engine=fresh();engine.returnToTitle();engine.selectProtagonist();check(engine.importSavePwa(legacy),'selection safely accepts validated legacy file');engine.state.mode='battle';equal(engine.exportSavePwa(),null,'battle cannot export partial progress');check(!engine.importSavePwa(exported),'battle cannot import progress');
}
{
 const tabA=fresh();tabA.state.credits=100;tabA.save(true);
 const tabB=new GameEngine();tabB.hydrate();const otherPacket=JSON.parse(exported);otherPacket.save.credits=900;
 check(tabB.previewSavePwa(JSON.stringify(otherPacket)),'second title previews a validated import');
 check(tabB.importSavePwa(JSON.stringify(otherPacket)),'explicit import replaces storage');
 const importedRaw=store.get(SAVE_KEY);
 check(!tabA.save(true),'older campaign cannot overwrite the imported campaign');
 equal(store.get(SAVE_KEY),importedRaw,'new imported save is preserved byte-for-byte');
 check(tabA.state.saveConflictV36&&tabA.paused,'stale campaign is paused with a visible conflict state');
 check(!tabA.save(true),'repeated autosave remains blocked instead of adopting the new baseline');
 equal(store.get(SAVE_KEY),importedRaw,'repeated stale save leaves imported progress intact');
}
{
 const playing=fresh(),title=new GameEngine();title.hydrate();check(title.previewSavePwa(exported),'preview before another tab saves');
 playing.state.credits+=1;playing.save(true);const latest=store.get(SAVE_KEY);
 check(!title.importSavePwa(exported),'changed save between preview and confirmation aborts import');
 equal(store.get(SAVE_KEY),latest,'preview conflict preserves newer campaign');check(!title.importSavePwa(exported),'repeated confirmation without a new preview stays blocked');equal(store.get(SAVE_KEY),latest,'repeated confirmation cannot bypass the stale preview');
 check(title.previewSavePwa(exported),'a fresh preview is allowed');check(title.importSavePwa(exported),'fresh review explicitly imports');
}
const report=`PWA save transfer v36 — PASS (${checks} checks)\nValidated package/legacy JSON, canonical preview, title-only replacement, backup and rollback at every write, resumed party, separate volume/speed and conservative persistent mute. No network calls or imported auto-play.\n`;
mkdirSync('docs/qa-v36',{recursive:true});writeFileSync('docs/qa-v36/pwa-save-test.txt',report);console.log(report);
