import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {compileGameModules} from './game-module-loader.mjs';
const out=mkdtempSync(join(tmpdir(),'eter-decisions-v32-'));
compileGameModules(out,['engine','equipmentPreviewV32','questNavigationV32']);
const load=name=>import(pathToFileURL(join(out,`${name}.js`)).href);
const {GameEngine}=await load('engine');
const {MAPS,PLAYABLE_HERO_IDS}=await load('data');
const {freshProgression,deriveHeroes,GEAR,spellBonus,SLOTS}=await load('progression');
const {equipmentPreviewV32,equipmentSearchV32}=await load('equipmentPreviewV32');
const {worldRouteV32,questDestinationsV32}=await load('questNavigationV32');
const {questJournalV31,freshQuestProgressV31,questEntitiesV31}=await load('questRuntimeV31');
const {QUESTS_V31,questEntityIdV31}=await load('questsV31');
let checks=0;const ok=(v,label)=>{assert.ok(v,label);checks++;};

// Compare against real equip()/recalculateGear(), across every slot and hero.
for(const hero of PLAYABLE_HERO_IDS)for(const slot of SLOTS){
 const p=freshProgression();p.recruited=[...PLAYABLE_HERO_IDS];p.party=[hero];p.xp=5000;p.owned=[`wolf-${slot}`,`lunar-${slot}`];p.equipment[hero][slot]=`wolf-${slot}`;
 const engine=new GameEngine();engine.state.progress=p;engine.state.heroes=deriveHeroes(p);engine.state.mode='world';engine.save=()=>true;
 const before=engine.state.heroes[0],magic=spellBonus(p,hero),snapshot=JSON.stringify(p),preview=equipmentPreviewV32(p,hero,`lunar-${slot}`);
 ok(JSON.stringify(p)===snapshot,'preview never changes progression');ok(preview.allowed,'valid owned swap allowed');
 ok(engine.equip(hero,`lunar-${slot}`),'real equip succeeds');const after=engine.state.heroes[0];
 assert.deepEqual(preview.delta,{hp:after.maxHp-before.maxHp,mp:after.maxMp-before.maxMp,atk:after.atk-before.atk,spell:spellBonus(p,hero)-magic});checks++;
 ok(after.hp<=before.hp&&after.mp<=before.mp,'preview does not promise restoration');
}
{
 const p=freshProgression();p.owned=['wolf-weapon','wolf-head','wolf-feet','lunar-body','lunar-hands','lunar-feet'];p.equipment.seiji={weapon:'wolf-weapon',head:'wolf-head',feet:'wolf-feet',body:'lunar-body',hands:'lunar-hands'};
 const v=equipmentPreviewV32(p,'seiji','lunar-feet');
 assert.deepEqual(v.sets.find(s=>s.id==='wolf').lost,[3]);checks++;assert.deepEqual(v.sets.find(s=>s.id==='lunar').gained,[3]);checks++;
 p.owned=SLOTS.map(slot=>`wolf-${slot}`).concat('lunar-feet');p.equipment.seiji=Object.fromEntries(SLOTS.map(slot=>[slot,`wolf-${slot}`]));
 assert.deepEqual(equipmentPreviewV32(p,'seiji','lunar-feet').sets.find(s=>s.id==='wolf').lost,[6]);checks++;
 p.equipment.seiji={};p.equipment.carmilla={feet:'lunar-feet'};
 ok(equipmentPreviewV32(p,'seiji','lunar-feet').transferFrom==='carmilla','reserve owner transfer disclosed');
 const e=new GameEngine();e.state.mode='world';e.state.progress=p;e.state.heroes=deriveHeroes(p);e.save=()=>true;e.equip('seiji','lunar-feet');ok(!p.equipment.carmilla.feet&&p.equipment.seiji.feet==='lunar-feet','real reserve transfer matches preview');
 ok(!equipmentPreviewV32(p,'seiji','lunar-feet').allowed,'equipped item does not advertise a new swap');ok(!equipmentPreviewV32(p,'seiji','not-owned').allowed,'invalid and unowned blocked');
 const exclusive=Object.values(GEAR).find(g=>g.hero&&g.hero!=='seiji');p.owned.push(exclusive.id);ok(!equipmentPreviewV32(p,'seiji',exclusive.id).allowed,'hero exclusive gate matches engine');
 const high=Object.values(GEAR).find(g=>g.minLevel>1&&!g.hero);p.xp=0;p.owned.push(high.id);ok(!equipmentPreviewV32(p,'seiji',high.id).allowed,'level gate matches engine');
 ok(equipmentSearchV32('  LÂMINA da Memória ')==='lamina da memoria','Portuguese search handles accents');
}

// Every offered hop is an existing, open, directed gateway. Locked branches stay locked.
for(const from of Object.keys(MAPS))for(const to of Object.keys(MAPS))for(const stage of [0,2,3,5]){
 const route=worldRouteV32(from,to,stage);if(!route)continue;
 ok(route.maps[0]===from&&route.maps.at(-1)===to,'route endpoints');ok(new Set(route.maps).size===route.maps.length,'route no loops');
 for(let i=0;i<route.maps.length-1;i++)ok(MAPS[route.maps[i]].entities.some(e=>e.kind==='warp'&&e.to===route.maps[i+1]&&(e.minStage||0)<=stage),'real unlocked route hop');
 if(route.exitId)ok(MAPS[from].entities.some(e=>e.id===route.exitId&&e.to===route.maps[1]),'first action uses current-map gateway');
}
ok(worldRouteV32('patio','subsolo',0)===null,'chapter lock blocks underground route');
ok(worldRouteV32('patio','observatorio',3)===null,'optional branch blocked before chapter completion');
ok(worldRouteV32('patio','observatorio',5)?.exitId,'chapter completion opens valid route');

// Only still-active quest sites are offered; no answered clues or claimed stories become objectives.
for(const q of QUESTS_V31){
 const p=freshQuestProgressV31();p.records[q.id]={step:0,counts:{},choices:{},cinematicSeen:false,claimed:false};p.tracked=q.id;
 const entry=questJournalV31(p,5).find(e=>e.id===q.id),offered=questDestinationsV32(entry,'patio',5,p);
 for(const d of offered)ok(questEntitiesV31(p,d.site.map,5).some(e=>e.id===d.entityId),'offered site is a real active entity');
 const first=q.steps[0].sites[0];if(first){p.records[q.id].counts[`0:${first.id}`]=1;const updated=questJournalV31(p,5).find(e=>e.id===q.id);ok(!questDestinationsV32(updated,'patio',5,p).some(d=>d.entityId===questEntityIdV31(q.id,first.id)),'answered site no longer recommended');}
}
const message=`PASS decisions-v32: ${checks} checks — equipment deltas versus real equip, ownership/set thresholds, save purity, directed chapter-safe routes and active quest sites.`;
writeFileSync('docs/qa-v32/decisions-test.txt',message+'\n');console.log(message);
